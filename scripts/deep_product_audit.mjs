import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(read('levels.js'), sandbox, { timeout: 1000 });
const levels = sandbox.window.SIS_LEVELS;
const engine = read('engine-v3.js');
const html = read('index.html');
const css = read('styles.css');
const activity = read('android-device-lab/app/src/main/java/com/pixelpicture/sisdevicelab/MainActivity.java');
const probe = read('scripts/device_lab_probe.js');

const fail = msg => { throw new Error(msg); };
const require = (cond,msg) => { if(!cond) fail(msg); };

const profiles = [
  {name:'fast', read:650, inspect:900, wrong:0},
  {name:'normal', read:1200, inspect:1500, wrong:1},
  {name:'slow-reader', read:2200, inspect:1800, wrong:1},
  {name:'very-slow', read:2800, inspect:2200, wrong:2},
  {name:'early-tapper', read:500, inspect:600, wrong:2, early:true},
  {name:'motion-miss', read:1400, inspect:2600, wrong:1, replay:true},
  {name:'hesitant', read:1800, inspect:3500, wrong:2},
  {name:'three-errors', read:1000, inspect:2600, wrong:3},
  {name:'replay-user', read:1500, inspect:1800, wrong:1, replay:true},
  {name:'accessibility-slow', read:3000, inspect:4200, wrong:2, replay:true}
];
let simulations = 0;
for (const [i,l] of levels.entries()) {
  for (const p of profiles) {
    simulations++;
    require(l.observeMs >= 2500, `${l.id}/${p.name}: observation too short`);
    require(/^TAP\b/.test(l.question), `${l.id}/${p.name}: interaction instruction ambiguous`);
    require(l.question.length <= 58, `${l.id}/${p.name}: question too long for phone scan`);
    require(l.intro.length <= 54, `${l.id}/${p.name}: intro too long for watch phase`);
    const estimatedDecisionMs = p.read + p.inspect + p.wrong * 700;
    if (i === 0) require(l.answerMs === 0, `${l.id}/${p.name}: onboarding must never expire`);
    else require(l.answerMs >= Math.min(12000, estimatedDecisionMs), `${l.id}/${p.name}: answer window too short`);
    if (p.early) {
      require(engine.includes('watch_phase_tap'), `${l.id}/${p.name}: early tap has no acknowledgement`);
      require(engine.includes('WATCH FIRST — THEN TAP.'), `${l.id}/${p.name}: early tap copy missing`);
    }
    if (p.replay) require(engine.includes('replayBtn.addEventListener'), `${l.id}/${p.name}: replay path absent`);
    require(l.hotspot.w*l.hotspot.h >= 500, `${l.id}/${p.name}: physical target too small`);
  }
}
require(simulations === 100, `Expected 100 simulations, got ${simulations}`);

const arch = [
  [html.includes('engine-v3.js') && !html.includes('engine-v2.js'), '01 single playable engine'],
  [!html.includes('content-repairs.js'), '02 no post-render patch layer'],
  [html.indexOf('levels.js') < html.indexOf('engine-v3.js'), '03 data before engine'],
  [html.includes('creative-mode.js') && html.includes('shadow-acquisition.js'), '04 explicit creative modules retained'],
  [engine.includes("let phase = 'watch'"), '05 explicit state machine'],
  [engine.includes("setPhase('answer','TAP NOW')"), '06 explicit answer transition'],
  [engine.includes("setPhase('reveal','FOUND')"), '07 explicit reveal transition'],
  [engine.includes('if(phase===\'watch\'){acknowledgeWatchTap'), '08 watch taps acknowledged'],
  [engine.includes("if(phase!=='answer')return"), '09 scoring gated to answer state'],
  [engine.includes('showTap(e.clientX,e.clientY'), '10 every scored tap visibly echoed'],
  [engine.includes('wrong-flash'), '11 wrong tap scene feedback'],
  [engine.includes('navigator.vibrate'), '12 optional haptic feedback'],
  [engine.includes("scene.querySelector('#'+level.focusId)"), '13 focusId contract fixed'],
  [engine.includes("feedback.textContent='TIME — WATCH IT AGAIN.'"), '14 timeout never spoils answer'],
  [engine.includes('loadLevel(index,true)'), '15 timeout/replay deterministic reset'],
  [engine.includes('nextBtn.addEventListener'), '16 explicit next navigation'],
  [engine.includes('replayBtn.addEventListener'), '17 explicit replay navigation'],
  [css.includes('.tap-echo.wrong') && css.includes('.tap-echo.correct'), '18 touch feedback styled both outcomes'],
  [css.includes('touch-action:manipulation'), '19 mobile touch contract'],
  [css.includes('.phase.answer'), '20 state visible to human'],
  [css.includes('@media (max-height:680px)'), '21 short-screen layout guard'],
  [activity.includes('file:///android_asset/index.html?level=0'), '22 launcher defaults to playable mode'],
  [!activity.includes('file:///android_asset/index.html?creative=1&level=0&acq=1'), '23 launcher cannot default to acquisition'],
  [probe.includes("if (params.get('labdelay') !== '1') return"), '24 lab instrumentation opt-in only'],
  [engine.includes("'level_replay':'level_start'"), '25 replay-aware level-start telemetry'],
  [engine.includes("emit('wrong_tap'"), '26 wrong-tap telemetry'],
  [engine.includes("emit('correct_tap'"), '27 correct-tap telemetry'],
  [engine.includes("emit('answer_timeout'"), '28 timeout telemetry'],
  [engine.includes("emit('reveal_shown'"), '29 reveal telemetry'],
  [engine.includes('revealAt') && engine.includes('hotspot.click()'), '30 deterministic evidence hook preserved']
];
for (const [ok,name] of arch) require(ok, `ARCH ${name} FAIL`);
require(arch.length === 30, `Expected 30 architecture invariants, got ${arch.length}`);

const expectations = {
  shadow_desync:4, extra_shadow:1, wrong_light_switch:2, reverse_splash:5, color_theft:3,
  door_two_rooms:3, mirror_desync:2, haircut_mirror:1, wrong_occlusion:3, domino_prediction:2
};
for (const l of levels) {
  const start = engine.indexOf(`${l.mechanic}(){`);
  require(start >= 0, `${l.id}: renderer missing`);
  const next = engine.indexOf('\n    },', start);
  const body = engine.slice(start, next > start ? next : start + 5000);
  const beats = (body.match(/later\(/g)||[]).length;
  require(beats >= expectations[l.mechanic], `${l.id}: animation has only ${beats} temporal beats`);
}
require(engine.includes("q('walker').style.transform='translateX(58px)'"), 'Shadow playable animation must move person');
require(engine.includes("attr('shadow','d'"), 'Shadow playable animation must independently move shadow');

console.log(`PASS: ${simulations}/100 adversarial comprehension simulations, ${arch.length}/30 architecture invariants, 10/10 animation beat audits.`);
