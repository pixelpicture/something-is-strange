import fs from 'node:fs';
import vm from 'node:vm';

const levelsSource = fs.readFileSync(new URL('../levels.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(levelsSource, sandbox, { timeout: 1000 });
const levels = sandbox.window.SIS_LEVELS;
const engine = fs.readFileSync(new URL('../engine-v3.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

if (!Array.isArray(levels) || levels.length !== 10) throw new Error(`Need exactly 10 candidate levels, got ${levels?.length}`);
if (new Set(levels.map(l => l.id)).size !== levels.length) throw new Error('Level ids must be unique');
const required = ['id','title','mechanic','intro','question','observeMs','answerMs','hotspot','focusId','revealText','telemetry'];
for (const [i,level] of levels.entries()) {
  for (const field of required) if (level[field] == null) throw new Error(`${level.id || 'unknown'} missing ${field}`);
  if (level.observeMs < 2500 || level.observeMs > 4500) throw new Error(`${level.id}: observe window must support comprehension`);
  if (i === 0 && level.answerMs !== 0) throw new Error('First puzzle must be untimed');
  if (i > 0 && (level.answerMs < 12000 || level.answerMs > 16000)) throw new Error(`${level.id}: answer window outside human gate`);
  if (!/^TAP\b/.test(level.question)) throw new Error(`${level.id}: answer instruction must explicitly say TAP`);
  const h=level.hotspot;
  for (const k of ['x','y','w','h']) if (!Number.isFinite(h[k])) throw new Error(`${level.id}: invalid hotspot ${k}`);
  if (h.x<0||h.y<0||h.w<=0||h.h<=0||h.x+h.w>100||h.y+h.h>100) throw new Error(`${level.id}: hotspot leaves viewport`);
  if (h.w*h.h < 500) throw new Error(`${level.id}: hotspot too small for physical phone`);
  if (!engine.includes(`${level.mechanic}(){`)) throw new Error(`${level.id}: renderer ${level.mechanic} missing`);
  if (!engine.includes(`'${level.focusId}'`) && !engine.includes(`id=\"${level.focusId}\"`)) throw new Error(`${level.id}: focus target ${level.focusId} missing from runtime`);
  if (level.revealText.length < 12 || level.revealText.length > 72) throw new Error(`${level.id}: reveal text outside clarity gate`);
}
const families=new Set(levels.map(l=>l.telemetry.family));
if (families.size<8) throw new Error(`Need mechanic breadth: only ${families.size} families`);
for (const token of ['phaseEl','tapEcho','replayBtn','answer_window_open','watch_phase_tap','wrong_tap','correct_tap','answer_timeout','reveal_shown']) if(!engine.includes(token)) throw new Error(`V3 runtime invariant missing: ${token}`);
if (!html.includes('engine-v3.js') || html.includes('engine-v2.js')) throw new Error('Playable path must use only V3 engine');
if (html.includes('app.js') || html.includes('runtime-motion.js') || html.includes('reveal-polish.js') || html.includes('proof.js') || html.includes('content-repairs.js')) throw new Error('Legacy/patch layers must not be in playable runtime path');
if (html.indexOf('levels.js') > html.indexOf('engine-v3.js')) throw new Error('levels.js must load before engine-v3.js');
console.log(`PASS: ${levels.length} levels, ${families.size} families, V3 watch→tap→feedback→reveal architecture valid.`);
