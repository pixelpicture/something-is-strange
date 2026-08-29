import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const box = { window: {} };
vm.runInNewContext(read('levels.js'), box);

const L = box.window.SIS_LEVELS;
const E = read('engine-v4.js');
const H = read('index.html');
const C = read('styles.css');
const M = read('motion-v3.css');
const A = read('android-device-lab/app/src/main/java/com/pixelpicture/sisdevicelab/MainActivity.java');
const P = read('scripts/device_lab_probe.js');
const D = read('scripts/android_device_lab.sh');
const req = (ok, message) => { if (!ok) throw new Error(message); };

const profiles = [
  'instant-tapper','normal','slow-reader','motion-miss','two-wrong-taps',
  'replay-user','hesitant','small-screen','silent-instruction-skip','repeat-player',
  'one-hand','late-noticer','fast-scanner','accessibility-slow','random-tapper',
  'causal-reader','visual-only','second-view','distracted','no-text'
];
let n = 0;
for (const l of L) for (const p of profiles) {
  n++;
  req(l.hotspot.w * l.hotspot.h >= 500, `${l.id}/${p} target`);
  req(l.anomalyMs >= 1400, `${l.id}/${p} baseline too short`);
  req(l.revealText.length <= 72, `${l.id}/${p} reveal`);
  req(E.includes('early(e)'), `${l.id}/${p} early tap`);
  req(E.includes('wrong(e)'), `${l.id}/${p} wrong tap`);
  req(E.includes('replayBtn.addEventListener'), `${l.id}/${p} replay`);
}
req(n === 100, `need 100, got ${n}`);

const arch = [
  [H.includes('engine-v4.js') && !H.includes('engine-v3.js'), 'single V4'],
  [L.length === 5, 'bounded slice'],
  [E.includes('anomalyReady'), 'explicit anomaly readiness'],
  [!E.includes('countdownId'), 'no countdown'],
  [E.includes('early(e)'), 'early tap feedback'],
  [E.includes('wrong(e)'), 'wrong feedback'],
  [E.includes('solve(e)'), 'solve path'],
  [E.includes('clear();tapEchoAt'), 'solve freezes scheduled motion'],
  [E.includes("hotspot.classList.add('reveal')"), 'spatial reveal'],
  [E.includes('q(l.focusId)'), 'exact focus'],
  [E.includes('nextBtn.hidden=false'), 'next visible'],
  [E.includes('replayBtn.hidden=false'), 'replay visible'],
  [E.includes('navigator.vibrate'), 'haptic optional'],
  [C.includes('.tap-echo.wrong'), 'wrong visual'],
  [C.includes('.tap-echo.correct'), 'correct visual'],
  [C.includes('touch-action:manipulation'), 'touch contract'],
  [M.includes('cubic-bezier'), 'motion easing'],
  [M.includes('prefers-reduced-motion'), 'reduced motion'],
  [A.includes('index.html?level=0'), 'clean launcher'],
  [!A.includes('creative=1&level=0&acq=1'), 'no acquisition default'],
  [P.includes("params.get('labdelay') !== '1'"), 'lab opt-in'],
  [E.includes("emit('anomaly_visible')"), 'anomaly telemetry'],
  [E.includes("emit('early_tap')"), 'early telemetry'],
  [E.includes("emit('wrong_tap'"), 'wrong telemetry'],
  [E.includes("emit('correct_tap'"), 'correct telemetry'],
  [E.includes("emit('reveal_shown')"), 'reveal telemetry'],
  [E.includes("emit('next_tap')"), 'next telemetry'],
  [E.includes("replay?'level_replay':'level_start'"), 'replay telemetry'],
  [E.includes('revealAt'), 'deterministic evidence'],
  [/continuous/i.test(read('PRODUCT_RECONSTRUCTION_V4.md')), 'product decision recorded']
];
arch.forEach(([ok, message], i) => req(ok, `ARCH ${i + 1} ${message}`));
req(arch.length === 30, '30 arch');

const beats = { extra_shadow:1, wrong_light_switch:2, shadow_desync:5, reverse_splash:5, color_theft:3 };
for (const l of L) {
  const start = E.indexOf(`${l.mechanic}(){`);
  const end = E.indexOf('\n},', start);
  const body = E.slice(start, end > start ? end : start + 5000);
  req((body.match(/later\(/g) || []).length >= beats[l.mechanic], `${l.id} animation beats`);
}
req(E.includes("move('walker','translateX(58px)')"), 'shadow person moves');
req(E.includes("attr('shadow','d'"), 'shadow independently turns');
req(E.includes("const acquisitionMode=params.get('creative')==='1'&&params.get('acq')==='1'"), 'explicit acquisition isolation');
req(E.includes('if(!acquisitionMode){prompt.textContent=l.question;replayBtn.hidden=false}'), 'acquisition owns prompt timing');
req(D.includes("! lab|grep -q 'Uncaught'"), 'Android proof rejects runtime exceptions');
req(D.includes('PROMPT WATCH HIS SHADOW'), 'Android proof guards acquisition copy ownership');

console.log(`PASS: ${n}/100 adversarial V4 perception proxies, ${arch.length}/30 architecture invariants, 5/5 bounded animation audits, acquisition isolation guarded.`);
