#!/usr/bin/env bash
set -euo pipefail
PKG=com.pixelpicture.sisdevicelab
ACTIVITY="$PKG/.MainActivity"
PROOF=device-proof
LOG_TAG=SIS_DEVICE_LAB
mkdir -p "$PROOF"; : > "$PROOF/device-log.txt"
adb install -r android-device-lab/app/build/outputs/apk/debug/app-debug.apk
adb shell settings put secure immersive_mode_confirmations confirmed || true
lab_log(){ adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null || true; }
append_log(){ lab_log >> "$PROOF/device-log.txt"; }
wait_log(){ local p="$1" n="${2:-50}"; for _ in $(seq 1 "$n"); do lab_log|grep -Eq "$p"&&return 0; sleep .1; done; echo "Timed out: $p" >&2; append_log; return 1; }
launch(){ local level="$1" creative="${2:-false}" acq="${3:-false}"; adb logcat -c; adb shell am force-stop "$PKG"; adb shell am start -n "$ACTIVITY" --ei level "$level" --ez creative "$creative" --ez acq "$acq" >/dev/null; }
start_level(){ launch "$@"; wait_log '\[SIS_LAB\] READY' 50; }
start_acq_fast(){ launch 0 true true; wait_log '\[SIS_LAB\] ACQ_BASE' 50; }
latest_state_line(){ lab_log|grep -E '\[SIS_LAB\] (READY|HOTSPOT|SCENE) '|tail -1||true; }
latest_hotspot_xy(){ latest_state_line|sed -E 's/.*(READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\2 \3/'; }
latest_wrong_xy(){ latest_state_line|sed -E 's/.* WRONG ([0-9]+) ([0-9]+) DPR.*/\1 \2/'; }
wait_mechanic_xy(){ local m="$1"; for _ in $(seq 1 40); do local l x; l=$(lab_log|grep -E "\[SIS_LAB\] (READY|HOTSPOT|SCENE) $m "|tail -1||true); x=$(echo "$l"|sed -E 's/.*(READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\2 \3/'); [[ "$x" =~ ^[0-9]+\ [0-9]+$ ]]&&{ echo "$x";return 0;}; sleep .1; done; return 1; }
wait_next_xy(){ for _ in $(seq 1 30); do local x; x=$(lab_log|grep '\[SIS_LAB\] NEXT '|tail -1|sed -E 's/.*NEXT ([0-9]+) ([0-9]+).*/\1 \2/'||true); [[ "$x" =~ ^[0-9]+\ [0-9]+$ ]]&&{ echo "$x";return 0;}; sleep .1; done; return 1; }
real_hotspot_tap(){ local x a b; x=$(latest_hotspot_xy); read -r a b<<<"$x"; adb shell input tap "$a" "$b"; }
real_wrong_tap(){ local x a b; x=$(latest_wrong_xy); read -r a b<<<"$x"; adb shell input tap "$a" "$b"; }
real_next_tap(){ local x a b; x=$(wait_next_xy); read -r a b<<<"$x"; adb shell input tap "$a" "$b"; }
shot_to(){ local o="$1"; for _ in $(seq 1 6); do adb exec-out screencap -p>"$o"; [ "$(wc -c<"$o")" -gt 25000 ]&&return 0; sleep .25; done; return 1; }
shot(){ shot_to "$PROOF/$1.png"; }

# Cold launch and wrong touch before timeout. Do not run slow UI dump until after this measured interaction.
start_level 0 false false
shot shadow-start
real_wrong_tap
wait_log '\[SIS_LAB\] VISUAL_READY WRONG FEEDBACK NO' 40
sleep .25
shot shadow-wrongtap
adb shell uiautomator dump /sdcard/device-window.xml >/dev/null 2>&1||true
adb pull /sdcard/device-window.xml "$PROOF/device-window.xml" >/dev/null 2>&1||true
! grep -qiE 'Viewing full screen|Got it' "$PROOF/device-window.xml" 2>/dev/null
append_log

# Correct Shadow and three consecutive levels.
start_level 0 false false
sleep 1.9; shot shadow-anomaly
real_hotspot_tap
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED FIRST\.' 50
sleep .55; shot shadow-correct
real_next_tap; wait_mechanic_xy mirror_desync >/dev/null; sleep .25; shot shadow-next
mirror_xy=$(wait_mechanic_xy mirror_desync); read -r mx my<<<"$mirror_xy"; adb shell input tap "$mx" "$my"; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE REFLECTION WAS LATE\.' 50
real_next_tap; wait_mechanic_xy domino_prediction >/dev/null
domino_xy=$(wait_mechanic_xy domino_prediction); read -r dx dy<<<"$domino_xy"; adb shell input tap "$dx" "$dy"; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE CHAIN STOPS HERE\.' 50
real_next_tap; wait_mechanic_xy wrong_light_switch >/dev/null; append_log

# Independent correct visual evidence.
start_level 1 false false
sleep 1.7; shot mirror-anomaly; real_hotspot_tap; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE REFLECTION WAS LATE\.' 50; sleep .55; shot mirror-correct; append_log
start_level 2 false false
sleep 2.1; shot domino-anomaly; real_hotspot_tap; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE CHAIN STOPS HERE\.' 50; sleep .55; shot domino-correct; append_log

# Exact acquisition runtime: probe is loaded before acquisition script and exposes base/turn moments without changing timings.
start_acq_fast
shot acq-before-turn
wait_log '\[SIS_LAB\] ACQ_TURN' 50
sleep .2; shot acq-after-turn
append_log

# Motion proof begins at the actual base state and spans the actual turn.
start_acq_fast
TMP_FRAMES=$(mktemp -d)
for i in $(seq -w 0 15); do shot_to "$TMP_FRAMES/frame-$i.png"; sleep .12; done
ffmpeg -v error -y -framerate 4 -i "$TMP_FRAMES/frame-%02d.png" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$PROOF/shadow-device.mp4"
rm -rf "$TMP_FRAMES"; append_log

grep -q 'LOAD file:///android_asset/index.html' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_BASE' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_TURN' "$PROOF/device-log.txt"
