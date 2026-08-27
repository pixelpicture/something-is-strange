import fs from 'node:fs';
import vm from 'node:vm';

const levelsSource = fs.readFileSync(new URL('../levels.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(levelsSource, sandbox, { timeout: 1000 });
const levels = sandbox.window.SIS_LEVELS;
const engine = fs.readFileSync(new URL('../engine-v2.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

if (!Array.isArray(levels) || levels.length !== 10) throw new Error(`Need exactly 10 MVP levels, got ${levels?.length}`);
if (new Set(levels.map(l => l.id)).size !== levels.length) throw new Error('Level ids must be unique');

const required = ['id','title','mechanic','hook','durationMs','hotspot','focusId','revealText','telemetry'];
for (const level of levels) {
  for (const field of required) if (level[field] == null) throw new Error(`${level.id || 'unknown'} missing ${field}`);
  if (level.durationMs < 3000 || level.durationMs > 8000) throw new Error(`${level.id}: duration outside short-form gate`);
  const h = level.hotspot;
  for (const k of ['x','y','w','h']) if (!Number.isFinite(h[k])) throw new Error(`${level.id}: invalid hotspot ${k}`);
  if (h.x < 0 || h.y < 0 || h.w <= 0 || h.h <= 0 || h.x + h.w > 100 || h.y + h.h > 100) throw new Error(`${level.id}: hotspot leaves viewport`);
  if (!engine.includes(`${level.mechanic}()`)) throw new Error(`${level.id}: renderer/replay ${level.mechanic} missing`);
  if (level.revealText.length < 8 || level.revealText.length > 60) throw new Error(`${level.id}: reveal text outside concise gate`);
}

const families = new Set(levels.map(l => l.telemetry.family));
if (families.size < 8) throw new Error(`Need mechanic breadth: only ${families.size} families`);
if (!html.includes('levels.js') || !html.includes('engine-v2.js')) throw new Error('V2 runtime scripts missing');
if (html.includes('app.js') || html.includes('runtime-motion.js') || html.includes('reveal-polish.js') || html.includes('proof.js')) throw new Error('Legacy proof patches must not be in runtime path');
if (html.indexOf('levels.js') > html.indexOf('engine-v2.js')) throw new Error('levels.js must load before engine-v2.js');
for (const token of ['correct_tap','wrong_tap','reveal_shown','level_start']) if (!engine.includes(token)) throw new Error(`telemetry event ${token} missing`);

console.log(`PASS: ${levels.length} levels, ${families.size} mechanic families, V2 runtime/schema/hotspot/reveal/telemetry gates valid.`);
