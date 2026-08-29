#!/usr/bin/env bash
set -Eeuo pipefail
PKG=com.pixelpicture.sisdevicelab;ACTIVITY="$PKG/.MainActivity";PROOF=device-proof;LOG_TAG=SIS_DEVICE_LAB
rm -rf "$PROOF";mkdir -p "$PROOF/human" "$PROOF/levels";:>"$PROOF/device-log.txt"
adb install -r android-device-lab/app/build/outputs/apk/debug/app-debug.apk
adb shell settings put secure immersive_mode_confirmations confirmed||true
lab(){ adb logcat -d -s "$LOG_TAG:I" '*:S' 2>/dev/null||true;};append(){ lab>>"$PROOF/device-log.txt";};trap 'rc=$?;echo "[SIS_LAB_HOST] FAIL rc=$rc stage=${STAGE:-unknown}">>"$PROOF/device-log.txt";append;exit $rc' ERR
waitlog(){ for _ in $(seq 1 ${2:-120});do lab|grep -Eq "$1"&&return 0;sleep .1;done;echo "timeout $1";return 1;}
shot(){ local f="$PROOF/$1.png";for _ in $(seq 1 12);do adb exec-out screencap -p>"$f";if [ "$(wc -c<"$f")" -gt 25000 ];then return 0;fi;sleep .2;done;echo "screenshot remained blank/small: $1 $(wc -c<"$f")";return 1;}
launch(){ adb logcat -c;adb shell am force-stop "$PKG";adb shell am start -n "$ACTIVITY" --ei level "$1" --ez labdelay true >/dev/null;waitlog "READY file:///android_asset/index.html\\?level=$1" 160;}
state(){ lab|grep '\[SIS_LAB\] INTERACTION_READY'|tail -1;};xy(){ local m="$1" line;for _ in $(seq 1 80);do line=$(lab|grep "\[SIS_LAB\] INTERACTION_READY $m "|tail -1||true);if [ -n "$line" ];then echo "$line"|sed -E 's/.* [a-z_]+ ([0-9]+) ([0-9]+) WRONG.*/\1 \2/';return;fi;sleep .1;done;return 1;};wrongxy(){ state|sed -E 's/.* WRONG ([0-9]+) ([0-9]+).* WRONG_TARGET.*/\1 \2/';};tap(){ read -r x y<<<"$1";adb shell input tap "$x" "$y";}
STAGE=human_default_path
adb logcat -c;adb shell am force-stop "$PKG";adb shell am start -W -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n "$ACTIVITY" >/dev/null;waitlog 'READY file:///android_asset/index.html\?level=0' 160;! lab|grep -q '\[SIS_LAB\]';shot human/cold;adb shell input tap 160 1180;sleep .25;shot human/early;sleep 2.0;shot human/anomaly;adb shell input tap 540 1550;sleep .25;shot human/wrong;echo '[SIS_LAB_HOST] HUMAN_DEFAULT_PATH_PASS'>>"$PROOF/device-log.txt";append
STAGE=instrumented_touch
launch 0;w=$(wrongxy);tap "$w";waitlog '\[SIS_LAB\] FEEDBACK KEEP WATCHING' 60;shot levels/0-early;echo '[SIS_LAB_HOST] EARLY_TAP_PASS'>>"$PROOF/device-log.txt";sleep 1.9;w=$(wrongxy);tap "$w";waitlog '\[SIS_LAB\] FEEDBACK NOT THAT — KEEP LOOKING\.' 60;shot levels/0-wrong;echo '[SIS_LAB_HOST] WRONG_TAP_PASS'>>"$PROOF/device-log.txt"
mechs=(extra_shadow wrong_light_switch shadow_desync reverse_splash color_theft);delays=(0 2.0 2.5 2.3 2.2)
for i in 0 1 2 3 4;do launch "$i";sleep "${delays[$i]}";shot "levels/$i-anomaly";h=$(xy "${mechs[$i]}");tap "$h";waitlog '\[SIS_LAB\] VISUAL_READY CORRECT' 80;shot "levels/$i-correct";done
echo '[SIS_LAB_HOST] FIVE_LEVEL_CYCLE_PASS'>>"$PROOF/device-log.txt";append
STAGE=acquisition
adb logcat -c;adb shell am force-stop "$PKG";adb shell am start -n "$ACTIVITY" --ei level 2 --ez creative true --ez acq true --ez labdelay true >/dev/null;waitlog 'creative=1&acq=1&labdelay=1' 160;waitlog '\[SIS_LAB\] ACQ_BASE' 160;sleep 1.0;shot acq-before;sleep 1.1;waitlog '\[SIS_LAB\] ACQ_TURN' 120;waitlog 'shadow_acquisition .*PROMPT WATCH HIS SHADOW\.' 120;! lab|grep -q 'Uncaught';shot acq-after;echo '[SIS_LAB_HOST] ACQUISITION_OWNERSHIP_PASS'>>"$PROOF/device-log.txt";append
! grep -q 'Uncaught' "$PROOF/device-log.txt"
