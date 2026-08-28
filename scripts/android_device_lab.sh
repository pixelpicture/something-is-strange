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

hotspot_xy() {
  lab_log | grep '\[SIS_LAB\] READY' | tail -1 | sed -E 's/.*READY [0-9]+ ([0-9]+) ([0-9]+).*/\1 \2/'
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
  xy=$(hotspot_xy)
  read -r x y <<< "$xy"
  test -n "$x" && test -n "$y"
  adb shell input tap "$x" "$y"
}

shot() {
  local name="$1"
  local out="$PROOF/$name.png"
  for _ in $(seq 1 6); do
    adb exec-out screencap -p > "$out"
    local bytes
    bytes=$(wc -c < "$out")
    if [ "$bytes" -gt 25000 ]; then
      return 0
    fi
    sleep 0.25
  done
  echo "Screenshot stayed blank/splash-sized: $name ($(wc -c < "$out") bytes)" >&2
  return 1
}

# Shadow: cold launch, anomaly, wrong tap.
start_level 0 false false
adb shell uiautomator dump /sdcard/device-window.xml >/dev/null 2>&1 || true
adb pull /sdcard/device-window.xml "$PROOF/device-window.xml" >/dev/null 2>&1 || true
! grep -qiE 'Viewing full screen|Got it' "$PROOF/device-window.xml" 2>/dev/null
shot shadow-start
sleep 1.9
shot shadow-anomaly
adb shell input tap 120 1450
sleep 0.6
shot shadow-wrongtap
append_log

# Shadow: real correct touch at live DOM hotspot, then real NEXT touch at live DOM geometry.
start_level 0 false false
sleep 1.9
real_hotspot_tap
sleep 1.1
shot shadow-correct
next_xy=$(wait_next_xy)
read -r next_x next_y <<< "$next_xy"
adb shell input tap "$next_x" "$next_y"
sleep 1.0
shot shadow-next
append_log

# Mirror: capture lag window then hit live DOM hotspot.
start_level 1 false false
sleep 1.7
shot mirror-anomaly
real_hotspot_tap
sleep 1.1
shot mirror-correct
append_log

# Domino: capture broken chain then hit live DOM hotspot.
start_level 2 false false
sleep 2.1
shot domino-anomaly
real_hotspot_tap
sleep 1.1
shot domino-correct
append_log

# Acquisition: exact Shadow acquisition query after semantic DOM readiness.
start_level 0 true true
sleep 0.4
adb shell 'screenrecord --time-limit 5 /sdcard/shadow-device.mp4 >/dev/null 2>&1 &' >/dev/null
sleep 0.6
shot acq-before-turn
sleep 0.8
shot acq-after-turn
sleep 4.0
adb pull /sdcard/shadow-device.mp4 "$PROOF/shadow-device.mp4" >/dev/null
append_log

grep -q 'LOAD file:///android_asset/index.html' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] READY' "$PROOF/device-log.txt"
grep -q 'creative=1&acq=1' "$PROOF/device-log.txt"
