#!/usr/bin/env bash
set -euo pipefail

PKG=com.pixelpicture.sisdevicelab
ACTIVITY="$PKG/.MainActivity"
PROOF=device-proof
LOG_TAG=SIS_DEVICE_LAB

mkdir -p "$PROOF"
: > "$PROOF/device-log.txt"
adb install -r android-device-lab/app/build/outputs/apk/debug/app-debug.apk
adb shell settings put secure immersive_mode_confirmations confirmed || true

lab_log() {
  adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null || true
}

append_log() {
  lab_log >> "$PROOF/device-log.txt"
}

start_level() {
  local level="$1"
  local creative="${2:-false}"
  local acq="${3:-false}"
  adb logcat -c
  adb shell am force-stop "$PKG"
  adb shell am start -n "$ACTIVITY" --ei level "$level" --ez creative "$creative" --ez acq "$acq" >/dev/null
  for _ in $(seq 1 50); do
    if lab_log | grep -q '\[SIS_LAB\] READY'; then
      return 0
    fi
    sleep 0.2
  done
  echo "Timed out waiting for semantic LAB READY (level=$level creative=$creative acq=$acq)" >&2
  append_log
  return 1
}

latest_hotspot_xy() {
  local line
  line=$(lab_log | grep -E '\[SIS_LAB\] (READY|HOTSPOT|SCENE) ' | tail -1 || true)
  echo "$line" | sed -E 's/.*(READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+).*/\2 \3/'
}

wait_mechanic_xy() {
  local mechanic="$1"
  for _ in $(seq 1 40); do
    local line xy
    line=$(lab_log | grep -E "\[SIS_LAB\] (READY|HOTSPOT|SCENE) $mechanic " | tail -1 || true)
    xy=$(echo "$line" | sed -E 's/.*(READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+).*/\2 \3/')
    if [[ "$xy" =~ ^[0-9]+\ [0-9]+$ ]]; then
      echo "$xy"
      return 0
    fi
    sleep 0.1
  done
  echo "Timed out waiting for mechanic geometry: $mechanic" >&2
  return 1
}

wait_next_xy() {
  for _ in $(seq 1 30); do
    local xy
    xy=$(lab_log | grep '\[SIS_LAB\] NEXT ' | tail -1 | sed -E 's/.*NEXT ([0-9]+) ([0-9]+).*/\1 \2/' || true)
    if [[ "$xy" =~ ^[0-9]+\ [0-9]+$ ]]; then
      echo "$xy"
      return 0
    fi
    sleep 0.1
  done
  echo "Timed out waiting for NEXT geometry" >&2
  return 1
}

real_hotspot_tap() {
  local xy x y
  xy=$(latest_hotspot_xy)
  read -r x y <<< "$xy"
  test -n "$x" && test -n "$y"
  adb shell input tap "$x" "$y"
}

real_next_tap() {
  local xy x y
  xy=$(wait_next_xy)
  read -r x y <<< "$xy"
  adb shell input tap "$x" "$y"
}

shot_to() {
  local out="$1"
  for _ in $(seq 1 6); do
    adb exec-out screencap -p > "$out"
    local bytes
    bytes=$(wc -c < "$out")
    if [ "$bytes" -gt 25000 ]; then
      return 0
    fi
    sleep 0.25
  done
  echo "Screenshot stayed blank/splash-sized: $out ($(wc -c < "$out") bytes)" >&2
  return 1
}

shot() {
  shot_to "$PROOF/$1.png"
}

# Shadow cold launch + early wrong tap before anomaly/timeout.
start_level 0 false false
adb shell uiautomator dump /sdcard/device-window.xml >/dev/null 2>&1 || true
adb pull /sdcard/device-window.xml "$PROOF/device-window.xml" >/dev/null 2>&1 || true
! grep -qiE 'Viewing full screen|Got it' "$PROOF/device-window.xml" 2>/dev/null
shot shadow-start
adb shell input tap 120 1450
sleep 0.45
shot shadow-wrongtap
append_log

# Shadow anomaly, correct touch, NEXT, then consecutive Mirror and Domino cycles in one live session.
start_level 0 false false
sleep 1.9
shot shadow-anomaly
real_hotspot_tap
sleep 1.1
shot shadow-correct
real_next_tap
sleep 0.8
shot shadow-next

mirror_xy=$(wait_mechanic_xy mirror_desync)
read -r mirror_x mirror_y <<< "$mirror_xy"
adb shell input tap "$mirror_x" "$mirror_y"
sleep 0.35
real_next_tap

domino_xy=$(wait_mechanic_xy domino_prediction)
read -r domino_x domino_y <<< "$domino_xy"
adb shell input tap "$domino_x" "$domino_y"
sleep 0.35
real_next_tap
wait_mechanic_xy wrong_light_switch >/dev/null
append_log

# Independent Mirror visual proof + correct touch.
start_level 1 false false
sleep 1.7
shot mirror-anomaly
real_hotspot_tap
sleep 1.1
shot mirror-correct
append_log

# Independent Domino visual proof + correct touch.
start_level 2 false false
sleep 2.1
shot domino-anomaly
real_hotspot_tap
sleep 1.1
shot domino-correct
append_log

# Acquisition stills: exact Shadow acquisition runtime on the real Android surface.
start_level 0 true true
shot acq-before-turn
sleep 0.85
shot acq-after-turn
append_log

# Acquisition motion proof: build the MP4 only from consecutive real Android screencaps.
# This avoids the headless emulator's screenrecord black-lead bug without substituting browser-rendered frames.
start_level 0 true true
TMP_FRAMES=$(mktemp -d)
for i in $(seq -w 0 15); do
  shot_to "$TMP_FRAMES/frame-$i.png"
  sleep 0.12
done
ffmpeg -v error -y -framerate 4 -i "$TMP_FRAMES/frame-%02d.png" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$PROOF/shadow-device.mp4"
rm -rf "$TMP_FRAMES"
append_log

grep -q 'LOAD file:///android_asset/index.html' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] READY' "$PROOF/device-log.txt"
grep -q 'creative=1&acq=1' "$PROOF/device-log.txt"
