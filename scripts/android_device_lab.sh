#!/usr/bin/env bash
set -Eeuo pipefail
PKG=com.pixelpicture.sisdevicelab
ACTIVITY="$PKG/.MainActivity"
PROOF=device-proof
LOG_TAG=SIS_DEVICE_LAB
mkdir -p "$PROOF"; : > "$PROOF/device-log.txt"
adb install -r android-device-lab/app/build/outputs/apk/debug/app-debug.apk
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put global show_first_crash_dialog 0 || true
adb shell settings put global show_restart_in_crash_dialog 0 || true
adb shell settings put global anr_show_background 0 || true
adb shell settings put secure immersive_mode_confirmations confirmed || true
lab_log(){ adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null || true; }
append_log(){ lab_log >> "$PROOF/device-log.txt"; }
trap 'rc=$?; echo "[SIS_LAB_HOST] FAIL rc=$rc stage=${STAGE:-unknown}" >> "$PROOF/device-log.txt"; append_log; exit "$rc"' ERR
wait_log(){ local p="$1" n="${2:-50}"; for _ in $(seq 1 "$n"); do lab_log|grep -Eq "$p"&&return 0; sleep .1; done; echo "Timed out: $p" >&2; append_log; return 1; }
launch(){ local level="$1" creative="${2:-false}" acq="${3:-false}"; adb logcat -c; adb shell am force-stop "$PKG"; adb shell am start -n "$ACTIVITY" --ei level "$level" --ez creative "$creative" --ez acq "$acq" >/dev/null; }
start_level(){ local level="$1"; launch "$@"; wait_log '\[SIS_LAB\] INTERACTION_READY' 120; wait_log "READY file:///android_asset/index.html\\?level=${level}([& ]|$)" 120; }
latest_state_line(){ lab_log|grep -E '\[SIS_LAB\] (INTERACTION_READY|READY|HOTSPOT|SCENE) '|tail -1||true; }
latest_hotspot_xy(){ latest_state_line|sed -E 's/.*(INTERACTION_READY|READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\2 \3/'; }
wait_mechanic_xy(){ local m="$1"; for _ in $(seq 1 40); do local l x; l=$(lab_log|grep -E "\[SIS_LAB\] (INTERACTION_READY|READY|HOTSPOT|SCENE) $m "|tail -1||true); x=$(echo "$l"|sed -E 's/.*(INTERACTION_READY|READY|HOTSPOT|SCENE) [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\2 \3/'); [[ "$x" =~ ^[0-9]+\ [0-9]+$ ]]&&{ echo "$x";return 0;}; sleep .1; done; return 1; }
wait_next_xy(){ for _ in $(seq 1 30); do local x; x=$(lab_log|grep '\[SIS_LAB\] NEXT '|tail -1|sed -E 's/.*NEXT ([0-9]+) ([0-9]+).*/\1 \2/'||true); [[ "$x" =~ ^[0-9]+\ [0-9]+$ ]]&&{ echo "$x";return 0;}; sleep .1; done; return 1; }
real_hotspot_tap(){ local x a b; x=$(latest_hotspot_xy); read -r a b<<<"$x"; adb shell input tap "$a" "$b"; }
real_wrong_tap(){ local l x a b; l=$(latest_state_line); echo "$l"|grep -q 'WRONG_TARGET tapLayer'; x=$(echo "$l"|sed -E 's/.* WRONG ([0-9]+) ([0-9]+).* DPR.*/\1 \2/'); read -r a b<<<"$x"; adb shell input tap "$a" "$b"; }
real_next_tap(){ local x a b; x=$(wait_next_xy); read -r a b<<<"$x"; adb shell input tap "$a" "$b"; }
shot_to(){ local o="$1"; for _ in $(seq 1 6); do adb exec-out screencap -p>"$o"; [ "$(wc -c<"$o")" -gt 25000 ]&&return 0; sleep .25; done; return 1; }
shot(){ shot_to "$PROOF/$1.png"; }

STAGE=cold_wrong_touch
start_level 0 false false
real_wrong_tap
wait_log '\[SIS_LAB\] EVENT WRONG_TAP' 40
wait_log '\[SIS_LAB\] FEEDBACK NO — LOOK AGAIN\.' 40
wait_log '\[SIS_LAB\] STATE STREAK 0 NO — LOOK AGAIN\.' 40
wait_log '\[SIS_LAB\] VISUAL_READY WRONG FEEDBACK NO — LOOK AGAIN\.' 50
sleep .55
shot shadow-wrongtap
adb shell uiautomator dump /sdcard/device-window.xml >/dev/null 2>&1||true
adb pull /sdcard/device-window.xml "$PROOF/device-window.xml" >/dev/null 2>&1||true
! grep -qiE 'Viewing full screen|Got it|isn.t responding|Close app|App info' "$PROOF/device-window.xml" 2>/dev/null
append_log
start_level 0 false false
shot shadow-start
append_log

STAGE=three_level_cycle
start_level 0 false false
sleep 1.9; shot shadow-anomaly
real_hotspot_tap
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED FIRST\.' 50
sleep .55; shot shadow-correct
real_next_tap
wait_mechanic_xy mirror_desync >/dev/null
sleep 1.0
shot shadow-next
mirror_xy=$(wait_mechanic_xy mirror_desync); read -r mx my<<<"$mirror_xy"; adb shell input tap "$mx" "$my"; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE REFLECTION WAS LATE\.' 50
real_next_tap; wait_mechanic_xy domino_prediction >/dev/null
domino_xy=$(wait_mechanic_xy domino_prediction); read -r dx dy<<<"$domino_xy"; adb shell input tap "$dx" "$dy"; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE CHAIN STOPS HERE\.' 50
real_next_tap; wait_mechanic_xy wrong_light_switch >/dev/null; append_log

STAGE=independent_visuals
start_level 1 false false
sleep 1.7; shot mirror-anomaly; real_hotspot_tap; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE REFLECTION WAS LATE\.' 50; sleep .55; shot mirror-correct; append_log
start_level 2 false false
sleep 2.1; shot domino-anomaly; real_hotspot_tap; wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE CHAIN STOPS HERE\.' 50; sleep .55; shot domino-correct; append_log

STAGE=double_tap
start_level 0 false false
sleep 1.9
double_xy=$(latest_hotspot_xy); read -r tx ty<<<"$double_xy"
adb shell input tap "$tx" "$ty"
adb shell input tap "$tx" "$ty"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED FIRST\.' 50
sleep .25
test "$(lab_log|grep -c '\[SIS_LAB\] FEEDBACK THE SHADOW TURNED FIRST\.' || true)" -eq 1
lab_log|grep -q '\[SIS_LAB\] STATE STREAK 1 THE SHADOW TURNED FIRST\.'
! lab_log|grep -q '\[SIS_LAB\] STATE STREAK [2-9] '
echo '[SIS_LAB_HOST] DOUBLE_TAP_PASS' >> "$PROOF/device-log.txt"
append_log

STAGE=background_resume
start_level 0 false false
sleep .5
adb shell input keyevent KEYCODE_HOME
sleep .4
adb shell am start -n "$ACTIVITY" --activity-reorder-to-front >/dev/null
sleep .4
test "$(lab_log|grep -c 'LOAD file:///android_asset/index.html?level=0' || true)" -eq 1
real_hotspot_tap
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED FIRST\.' 50
echo '[SIS_LAB_HOST] BACKGROUND_RESUME_PASS' >> "$PROOF/device-log.txt"
append_log

STAGE=acquisition_motion
adb logcat -c
adb shell rm -f /sdcard/acq-raw.mp4 >/dev/null 2>&1 || true
adb shell am start -S -n "$ACTIVITY" --es url 'file:///android_asset/index.html?level=0&creative=1&acq=1&labdelay=1' >/dev/null
wait_log '\[SIS_LAB\] ACQ_DELAY_ARMED 1500' 120
wait_log '\[SIS_LAB\] ACQ_BASE' 120
adb shell screenrecord --bit-rate 4000000 --time-limit 7 /sdcard/acq-raw.mp4 >/dev/null 2>&1 &
REC_PID=$!
wait_log '\[SIS_LAB\] ACQ_TURN' 100
wait "$REC_PID"
adb pull /sdcard/acq-raw.mp4 "$PROOF/acq-raw.mp4" >/dev/null
raw_duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$PROOF/acq-raw.mp4")
python3 - "$raw_duration" <<'PY'
import sys
assert float(sys.argv[1]) >= 4.55, sys.argv[1]
PY
ffmpeg -v error -y -ss 1.35 -i "$PROOF/acq-raw.mp4" -t 3.2 -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$PROOF/shadow-device.mp4"
rm -f "$PROOF/acq-raw.mp4"
ffmpeg -v error -y -ss 0.35 -i "$PROOF/shadow-device.mp4" -frames:v 1 "$PROOF/acq-before-turn.png"
ffmpeg -v error -y -ss 1.70 -i "$PROOF/shadow-device.mp4" -frames:v 1 "$PROOF/acq-after-turn.png"
append_log

STAGE=final_assertions
grep -q 'LOAD file:///android_asset/index.html' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_DELAY_ARMED 1500' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_BASE' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_TURN' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB_HOST\] DOUBLE_TAP_PASS' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB_HOST\] BACKGROUND_RESUME_PASS' "$PROOF/device-log.txt"
