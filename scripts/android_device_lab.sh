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

append_log() {
  adb logcat -d -s "$LOG_TAG:I" '*:S' >> "$PROOF/device-log.txt" || true
}

start_level() {
  local level="$1"
  local creative="${2:-false}"
  local acq="${3:-false}"
  adb logcat -c
  adb shell am force-stop "$PKG"
  adb shell am start -n "$ACTIVITY" --ei level "$level" --ez creative "$creative" --ez acq "$acq" >/dev/null
  for _ in $(seq 1 40); do
    if adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null | grep -q 'READY file:///android_asset/index.html'; then
      return 0
    fi
    sleep 0.2
  done
  echo "Timed out waiting for WebView READY (level=$level creative=$creative acq=$acq)" >&2
  append_log
  return 1
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
sleep 0.35
shot shadow-wrongtap
append_log

# Shadow: real correct touch then real NEXT touch.
start_level 0 false false
sleep 1.9
adb shell input tap 785 1290
sleep 0.45
shot shadow-correct
adb shell input tap 540 1815
sleep 0.8
shot shadow-next
append_log

# Mirror: capture the lag window then hit the actual hotspot.
start_level 1 false false
sleep 1.7
shot mirror-anomaly
adb shell input tap 760 900
sleep 0.45
shot mirror-correct
append_log

# Domino: capture the broken chain then hit d5 hotspot.
start_level 2 false false
sleep 2.1
shot domino-anomaly
adb shell input tap 620 1280
sleep 0.45
shot domino-correct
append_log

# Acquisition: exact Shadow acquisition query assembled in Activity, after WebView READY.
start_level 0 true true
adb shell 'screenrecord --time-limit 4 /sdcard/shadow-device.mp4 >/dev/null 2>&1 &' >/dev/null
sleep 0.75
shot acq-before-turn
sleep 0.85
shot acq-after-turn
sleep 2.7
adb pull /sdcard/shadow-device.mp4 "$PROOF/shadow-device.mp4" >/dev/null
append_log

grep -q 'LOAD file:///android_asset/index.html' "$PROOF/device-log.txt"
grep -q 'READY file:///android_asset/index.html' "$PROOF/device-log.txt"
grep -q 'creative=1&acq=1' "$PROOF/device-log.txt"
