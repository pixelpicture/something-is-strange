#!/usr/bin/env bash
set -euo pipefail

PKG='com.pixelpicture.sisdevicelab'
ACTIVITY="$PKG/.MainActivity"
OUT='device-proof'
mkdir -p "$OUT"

capture_png() {
  local name="$1"
  local path="$OUT/$name.png"
  local size=0
  for attempt in 1 2 3 4 5; do
    adb exec-out screencap -p > "$path"
    size=$(wc -c < "$path")
    if [ "$size" -gt 30000 ]; then
      echo "captured $name (${size} bytes) on attempt $attempt"
      return 0
    fi
    echo "retrying likely-black $name (${size} bytes), attempt $attempt" >&2
    sleep 0.35
  done
  echo "capture stayed black/empty: $name (${size} bytes)" >&2
  return 92
}

launch_level() {
  local url="$1"
  adb shell am force-stop "$PKG"
  adb shell am start -n "$ACTIVITY" --es url "$url"
  sleep 1.8
}

adb install -r android-device-lab/app/build/outputs/apk/debug/app-debug.apk
adb logcat -c
adb shell settings put secure immersive_mode_confirmations confirmed || true

launch_level 'file:///android_asset/index.html?level=0'
adb shell uiautomator dump /sdcard/device-window.xml >/dev/null 2>&1 || true
adb pull /sdcard/device-window.xml "$OUT/device-window.xml" >/dev/null 2>&1 || true
if [ -s "$OUT/device-window.xml" ] && grep -qiE 'Viewing full screen|Got it' "$OUT/device-window.xml"; then
  echo 'immersive tutorial overlay contaminated measured session' >&2
  exit 91
fi
capture_png shadow-start
sleep 0.8
capture_png shadow-anomaly
adb shell input tap 120 1450
sleep 0.45
capture_png shadow-wrongtap

launch_level 'file:///android_asset/index.html?level=0'
sleep 0.7
adb shell input tap 785 1290
sleep 0.55
capture_png shadow-correct
adb shell input tap 540 1780
sleep 0.8
capture_png shadow-next

launch_level 'file:///android_asset/index.html?level=1'
sleep 0.9
capture_png mirror-anomaly
adb shell input tap 760 900
sleep 0.55
capture_png mirror-correct

launch_level 'file:///android_asset/index.html?level=2'
sleep 0.7
capture_png domino-anomaly
adb shell input tap 620 1280
sleep 0.55
capture_png domino-correct

launch_level 'file:///android_asset/index.html?creative=1&level=0&acq=1'
adb shell 'screenrecord --time-limit 5 /sdcard/shadow-device.mp4 >/dev/null 2>&1 &'
sleep 1.2
capture_png acq-before-turn
sleep 0.8
capture_png acq-after-turn
sleep 3.2
adb pull /sdcard/shadow-device.mp4 "$OUT/shadow-device.mp4"
adb logcat -d -s SIS_DEVICE_LAB:I '*:S' > "$OUT/device-log.txt"
grep -q 'LOAD file:///android_asset/index.html' "$OUT/device-log.txt"
