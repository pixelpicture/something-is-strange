import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../levels.js', import.meta.url), 'utf8').trim();
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { timeout: 1000 });
const levels = context.window.SIS_LEVELS;
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

if (!Array.isArray(levels) || levels.length < 3) throw new Error('Need at least three proof levels');
if (new Set(levels.map(l => l.id)).size !== levels.length) throw new Error('Level ids must be unique');

for (const level of levels) {
  for (const field of ['id','title','mechanic','hook','durationMs','hotspot','telemetry']) {
    if (level[field] == null) throw new Error(`${level.id || 'unknown'} missing ${field}`);
  }
  if (level.durationMs < 3000 || level.durationMs > 8000) throw new Error(`${level.id}: duration outside short-form gate`);
  const h = level.hotspot;
  for (const k of ['x','y','w','h']) if (!Number.isFinite(h[k])) throw new Error(`${level.id}: invalid hotspot ${k}`);
  if (h.x < 0 || h.y < 0 || h.w <= 0 || h.h <= 0 || h.x + h.w > 100 || h.y + h.h > 100) {
    throw new Error(`${level.id}: hotspot leaves viewport`);
  }
  if (!app.includes(`${level.mechanic}()`)) throw new Error(`${level.id}: renderer ${level.mechanic} missing`);
}

if (!html.includes('levels.js') || html.indexOf('levels.js') > html.indexOf('app.js')) {
  throw new Error('levels.js must load before app.js');
}

const families = new Set(levels.map(l => l.telemetry.family));
if (families.size < 3) throw new Error('Proof set must test at least three mechanic families');

console.log(`PASS: ${levels.length} levels, ${families.size} families, schema/hotspot/renderer/load-order gates valid.`);
