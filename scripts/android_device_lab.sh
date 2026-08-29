#!/usr/bin/env bash
set -Eeuo pipefail
PKG=com.pixelpicture.sisdevicelab
ACTIVITY="$PKG/.MainActivity"
PROOF=device-proof
LOG_TAG=SIS_DEVICE_LAB
rm -rf "$PROOF"; mkdir -p "$PROOF/human"; : > "$PROOF/device-log.txt"
adb install -r android-device-lab/app/build/outputs/apk/debug/app-debug.apk
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put global show_first_crash_dialog 0 || true
adb shell settings put global show_restart_in_crash_dialog 0 || true
adb shell settings put global anr_show_background 0 || true
adb shell settings put secure immersive_mode_confirmations confirmed || true
lab_log(){ adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null || true; }
append_log(){ lab_log >> "$PROOF/device-log.txt"; }
trap 'rc=$?; echo "[SIS_LAB_HOST] FAIL rc=$rc stage=${STAGE:-unknown}" >> "$PROOF/device-log.txt"; append_log; exit "$rc"' ERR
wait_log(){ local p="$1" n="${2:-80}"; for _ in $(seq 1 "$n"); do lab_log|grep -Eq "$p"&&return 0; sleep .1; done; echo "Timed out: $p" >&2; append_log; return 1; }
wait_mech(){ local m="$1" n="${2:-120}"; wait_log "\\[SIS_LAB\\] (INTERACTION_READY|READY|HOTSPOT|SCENE|PHASE_STATE) ${m} " "$n"; }
launch(){ local level="$1" creative="${2:-false}" acq="${3:-false}"; adb logcat -c; adb shell am force-stop "$PKG"; adb shell am start -n "$ACTIVITY" --ei level "$level" --ez creative "$creative" --ez acq "$acq" --ez labdelay true >/dev/null; }
launch_default(){ adb logcat -c; adb shell am force-stop "$PKG"; adb shell am start -W -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n "$ACTIVITY" >/dev/null; }
start_level(){ local level="$1"; launch "$@"; wait_log '\[SIS_LAB\] INTERACTION_READY' 160; wait_log "READY file:///android_asset/index.html\\?level=${level}([& ]|$)" 160; }
latest_state_line(){ lab_log|grep -E '\[SIS_LAB\] (INTERACTION_READY|READY|HOTSPOT|SCENE|PHASE_STATE) '|tail -1||true; }
xy_for(){ local mech="$1"; local line x; for _ in $(seq 1 80); do line=$(lab_log|grep -E "\[SIS_LAB\] (INTERACTION_READY|READY|HOTSPOT|SCENE|PHASE_STATE) $mech "|tail -1||true); x=$(echo "$line"|sed -E 's/.* [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\1 \2/'); [[ "$x" =~ ^[0-9]+\ [0-9]+$ ]]&&{ echo "$x"; return 0; }; sleep .1; done; return 1; }
wrong_xy(){ local line x; line=$(latest_state_line); echo "$line"|grep -q 'WRONG_TARGET tapLayer'; x=$(echo "$line"|sed -E 's/.* WRONG ([0-9]+) ([0-9]+).* WRONG_TARGET.*/\1 \2/'); echo "$x"; }
next_xy(){ for _ in $(seq 1 80); do local x; x=$(lab_log|grep '\[SIS_LAB\] NEXT '|tail -1|sed -E 's/.*NEXT ([0-9]+) ([0-9]+).*/\1 \2/'||true); [[ "$x" =~ ^[0-9]+\ [0-9]+$ ]]&&{ echo "$x";return 0;}; sleep .1; done; return 1; }
tap_xy(){ local a b; read -r a b<<<"$1"; adb shell input tap "$a" "$b"; }
shot_to(){ local o="$1"; for _ in $(seq 1 6); do adb exec-out screencap -p>"$o"; [ "$(wc -c<"$o")" -gt 25000 ]&&return 0; sleep .25; done; return 1; }
shot(){ shot_to "$PROOF/$1.png"; }
assert_no_system_dialog(){ adb shell uiautomator dump /sdcard/window.xml >/dev/null 2>&1||true; adb pull /sdcard/window.xml "$PROOF/device-window.xml" >/dev/null 2>&1||true; ! grep -qiE "isn.t responding|Close app|App info|Viewing full screen|Got it" "$PROOF/device-window.xml" 2>/dev/null; }

STAGE=human_default_path
launch_default
wait_log 'LOAD file:///android_asset/index.html\?level=0' 160
wait_log 'READY file:///android_asset/index.html\?level=0' 160
! lab_log|grep -qE 'LOAD .*creative=1|LOAD .*acq=1|LOAD .*labdelay=1'
! lab_log|grep -q '\[SIS_LAB\]'
sleep .8; assert_no_system_dialog; shot_to "$PROOF/human/watch.png"
adb shell input tap 160 1180
sleep .25; shot_to "$PROOF/human/early-tap.png"
sleep 2.7; shot_to "$PROOF/human/answer.png"
adb shell input tap 155 1030
sleep .25; shot_to "$PROOF/human/wrong.png"
sleep 4.0; shot_to "$PROOF/human/still-answering.png"
python3 - "$PROOF/human/watch.png" "$PROOF/human/early-tap.png" "$PROOF/human/answer.png" "$PROOF/human/wrong.png" "$PROOF/human/still-answering.png" <<'PY'
import hashlib,sys
bs=[open(p,'rb').read() for p in sys.argv[1:]]
assert all(len(b)>25000 for b in bs)
h=[hashlib.sha256(b).hexdigest() for b in bs]
assert h[0]!=h[1],h
assert h[1]!=h[2],h
assert h[2]!=h[3],h
assert h[3]!=h[4],h
PY
assert_no_system_dialog
echo '[SIS_LAB_HOST] HUMAN_DEFAULT_PATH_PASS' >> "$PROOF/device-log.txt"; append_log

STAGE=touch_contract
start_level 0 false false
wait_log '\[SIS_LAB\] PHASE TAP NOW' 80
w=$(wrong_xy); tap_xy "$w"
wait_log '\[SIS_LAB\] EVENT WRONG_TAP' 50
wait_log '\[SIS_LAB\] FEEDBACK NOT THAT — KEEP LOOKING\.' 50
sleep .25; shot shadow-wrongtap
h=$(xy_for shadow_desync); tap_xy "$h"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED BEFORE THE PERSON\.' 80
sleep .35; shot shadow-correct
n=$(next_xy); tap_xy "$n"
wait_log '\[SIS_LAB\] EVENT NEXT_TAP' 50
wait_mech extra_shadow 120
wait_log '\[SIS_LAB\] PHASE_STATE extra_shadow .* PHASE TAP NOW .* PROGRESS PUZZLE 2 / 10' 120
sleep .3; shot extra-answer
x=$(xy_for extra_shadow); tap_xy "$x"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK TWO PEOPLE\. THREE SHADOWS\.' 80
n=$(next_xy); tap_xy "$n"
wait_log '\[SIS_LAB\] EVENT NEXT_TAP' 50
wait_mech wrong_light_switch 120
wait_log '\[SIS_LAB\] PHASE_STATE wrong_light_switch .* PHASE TAP NOW .* PROGRESS PUZZLE 3 / 10' 120
sleep .3; shot light-answer
x=$(xy_for wrong_light_switch); tap_xy "$x"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SWITCH TURNED ON THE WRONG LAMP\.' 80
sleep .3; shot light-correct
append_log

STAGE=double_tap
start_level 0 false false
wait_log '\[SIS_LAB\] PHASE TAP NOW' 80
h=$(xy_for shadow_desync); read -r tx ty<<<"$h"; adb shell input tap "$tx" "$ty"; adb shell input tap "$tx" "$ty"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED BEFORE THE PERSON\.' 80
sleep .2
test "$(lab_log|grep -c '\[SIS_LAB\] FEEDBACK THE SHADOW TURNED BEFORE THE PERSON\.'||true)" -eq 1
echo '[SIS_LAB_HOST] DOUBLE_TAP_PASS' >> "$PROOF/device-log.txt"; append_log

STAGE=background_resume
start_level 0 false false
sleep .7; adb shell input keyevent KEYCODE_HOME; sleep .4; adb shell am start -n "$ACTIVITY" --activity-reorder-to-front >/dev/null
wait_log '\[SIS_LAB\] PHASE TAP NOW' 100
h=$(xy_for shadow_desync); tap_xy "$h"
wait_log '\[SIS_LAB\] VISUAL_READY CORRECT FEEDBACK THE SHADOW TURNED BEFORE THE PERSON\.' 80
echo '[SIS_LAB_HOST] BACKGROUND_RESUME_PASS' >> "$PROOF/device-log.txt"; append_log

STAGE=acquisition_motion
adb logcat -c; adb shell rm -f /sdcard/acq-raw.mp4 >/dev/null 2>&1||true
adb shell am start -S -n "$ACTIVITY" --es url 'file:///android_asset/index.html?level=0&creative=1&acq=1&labdelay=1' >/dev/null
wait_log '\[SIS_LAB\] ACQ_DELAY_ARMED 1500' 160; wait_log '\[SIS_LAB\] ACQ_BASE' 160
adb shell screenrecord --bit-rate 4000000 --time-limit 7 /sdcard/acq-raw.mp4 >/dev/null 2>&1 & REC_PID=$!
wait_log '\[SIS_LAB\] ACQ_TURN' 120; wait "$REC_PID"; adb pull /sdcard/acq-raw.mp4 "$PROOF/acq-raw.mp4" >/dev/null
raw_duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$PROOF/acq-raw.mp4")
python3 - "$raw_duration" <<'PY'
import sys
assert float(sys.argv[1])>=4.55,sys.argv[1]
PY
ffmpeg -v error -y -ss 1.35 -i "$PROOF/acq-raw.mp4" -t 3.2 -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$PROOF/shadow-device.mp4"
rm -f "$PROOF/acq-raw.mp4"; ffmpeg -v error -y -ss .35 -i "$PROOF/shadow-device.mp4" -frames:v 1 "$PROOF/acq-before-turn.png"; ffmpeg -v error -y -ss 1.70 -i "$PROOF/shadow-device.mp4" -frames:v 1 "$PROOF/acq-after-turn.png"; append_log

STAGE=final_assertions
grep -q '\[SIS_LAB_HOST\] HUMAN_DEFAULT_PATH_PASS' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB_HOST\] DOUBLE_TAP_PASS' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB_HOST\] BACKGROUND_RESUME_PASS' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_BASE' "$PROOF/device-log.txt"
grep -q '\[SIS_LAB\] ACQ_TURN' "$PROOF/device-log.txt"
