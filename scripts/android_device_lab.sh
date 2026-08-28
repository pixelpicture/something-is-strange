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

lab_log() { adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null || true; }
append_log() { lab_log >> "$PROOF/device-log.txt"; }

wait_log() {
  local pattern="$1" tries="${2:-50}"
  for _ in $(seq 1 "$tries"); do
    lab_log | grep -Eq "$pattern" && return 0
    sleep 0.1
  done
  echo "Timed out waiting for log pattern: $pattern" >&2
  append_log
  return 1
}

start_level() {
  local level="$1" creative="${2:-false}" acq="${3:-false}"
  adb logcat -c
  adb shell am force-stop "$PKG"
  adb shell am start -n "$ACTIVITY" --ei level "$level" --ez creative "$creative" --ez acq "$acq" >/dev/null
  wait_log '\[SIS_LAB\] READY' 50
}

latest_state_line() { lab_log | grep -E '\[SIS_LAB\] (READY|HOTSPOT|SCENE) ' | tail -1 || true; }

latest_hotspot_xy() {
  latest_state_line | sed -E 's/.*(READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\2 \3/'
}

latest_wrong_xy() {
  latest_state_line | sed -E 's/.* WRONG ([0-9]+) ([0-9]+) DPR.*/\1 \2/'
}

wait_mechanic_xy() {
  local mechanic="$1"
  for _ in $(seq 1 40); do
    local line xy
    line=$(lab_log | grep -E "\[SIS_LAB\] (READY|HOTSPOT|SCENE) $mechanic " | tail -1 || true)
    xy=$(echo "$line" | sed -E 's/.*(READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\2 \3/')
    [[ "$xy" =~ ^[0-9]+\ [0-9]+$ ]] && { echo "$xy"; return 0; }
    sleep 0.1
  done
  echo "Timed out waiting for mechanic geometry: $mechanic" >&2
  return 1
}

wait_next_xy() {
  for _ in $(seq 1 30); do
    local xy
    xy=$(lab_log | grep '\[SIS_LAB\] NEXT ' | tail -1 | sed -E 's/.*NEXT ([0-9]+) ([0-9]+).*/\1 \2/' || true)
    [[ "$xy" =~ ^[0-9]+\ [0-9]+$ ]] && { echo "$xy"; return 0; }
    sleep 0.1
  done
  echo "Timed out waiting for NEXT geometry" >&2
  return 1
}

real_hotspot_tap() {
  local xy x y
  xy=$(latest_hotspot_xy); read -r x y <<< "$xy"
  [[ "$x" =~ ^[0-9]+$ && "$y" =~ ^[0-9]+$ ]]
  adb shell input tap "$x" "$y"
}

real_wrong_tap() {
  local xy x y
  xy=$(latest_wrong_xy); read -r x y <<< "$xy"
  [[ "$x" =~ ^[0-9]+$ && "$y" =~ ^[0-9]+$ ]]
  adb shell input tap "$x" "$y"
}

real_next_tap() {
  local xy x y
  xy=$(wait_next_xy); read -r x y <<< "$xy"
  adb shell input tap "$x" "$y"
}

shot_to() {
  local out="$1"
  for _ in $(seq 1 6); do
    adb exec-out screencap -p > "$out"
    [ "$(wc -c < "$out")" -gt 25000 ] && return 0
    sleep 0.25
  done
  echo "Screenshot stayed blank/splash-sized: $out ($(wc -c < "$out") bytes)" >&2
  return 1
}
shot() { shot_to "$PROOF/$1.png"; }

# Cold Shadow + guaranteed wrong touch inside scene/outside hotspot.
start_level 0 false false
adb shell uiautomator dump /sdcard/device-window.xml >/dev/null 2>&1 || true
adb pull /sdcard/device-window.xml "$PROOF/device-window.xml" >/dev/null 2>&1 || true
! grep -qiE 'Viewing full screen|Got it' "$PROOF/device-window.xml" 2>/dev/null
shot shadow-start
real_wrong_tap
wait_log '\[SIS_LAB\] VISUAL_READY WRONG FEEDBACK NO' 40
shot shadow-wrongtap
append_log

# Shadow correct + NEXT + three consecutive real touch cycles.
start_level 0 false false
sleep 1.9
shot shadow-anomaly
real_hotspot_tap
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED FIRST\.' 50
shot shadow-correct
real_next_tap
wait_mechanic_xy mirror_desync >/dev/null
shot shadow-next

mirror_xy=$(wait_mechanic_xy mirror_desync); read -r mirror_x mirror_y <<< "$mirror_xy"
adb shell input tap "$mirror_x" "$mirror_y"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE REFLECTION WAS LATE\.' 50
real_next_tap
wait_mechanic_xy domino_prediction >/dev/null

domino_xy=$(wait_mechanic_xy domino_prediction); read -r domino_x domino_y <<< "$domino_xy"
adb shell input tap "$domino_x" "$domino_y"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE CHAIN STOPS HERE\.' 50
real_next_tap
wait_mechanic_xy wrong_light_switch >/dev/null
append_log

# Independent Mirror visual proof.
start_level 1 false false
sleep 1.7
shot mirror-anomaly
real_hotspot_tap
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE REFLECTION WAS LATE\.' 50
shot mirror-correct
append_log

# Independent Domino visual proof.
start_level 2 false false
sleep 2.1
shot domino-anomaly
real_hotspot_tap
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE CHAIN STOPS HERE\.' 50
shot domino-correct
append_log

# Acquisition stills.
start_level 0 true true
shot acq-before-turn
sleep 0.85
shot acq-after-turn
append_log

# Acquisition motion proof from consecutive real Android screencaps.
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
