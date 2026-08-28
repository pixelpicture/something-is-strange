import fs from 'node:fs';

const base = 'http://127.0.0.1:8000/';
const debug = 'http://127.0.0.1:9222';
const outDir = 'shadow-proof';
fs.mkdirSync(outDir, { recursive: true });

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForPageTarget() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await fetch(`${debug}/json/list`).then(r => r.json());
      const page = list.find(x => x.type === 'page' && x.webSocketDebuggerUrl);
      if (page) return page;
    } catch {}
    await sleep(100);
  }
  throw new Error('Chrome DevTools page target not ready');
}

const target = await waitForPageTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let nextId = 1;
const pending = new Map();
const listeners = new Map();

function on(method, fn) {
  if (!listeners.has(method)) listeners.set(method, []);
  listeners.get(method).push(fn);
}
function once(method) {
  return new Promise(resolve => {
    const fn = params => {
      const arr = listeners.get(method) || [];
      const idx = arr.indexOf(fn);
      if (idx >= 0) arr.splice(idx, 1);
      resolve(params);
    };
    on(method, fn);
  });
}
function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});
ws.onmessage = evt => {
  const msg = JSON.parse(evt.data);
  if (msg.id) {
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
    return;
  }
  if (msg.method) for (const fn of listeners.get(msg.method) || []) fn(msg.params);
};

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 540, height: 960, deviceScaleFactor: 1, mobile: false });

async function capture(variant, ms) {
  const reveal = variant === 'baseline' ? 3000 : 2550;
  const extra = variant === 'acquisition' ? '&acq=1' : '';
  const url = `${base}?creative=1&level=0&revealAt=${reveal}${extra}`;

  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await loaded;

  const expired = once('Emulation.virtualTimeBudgetExpired');
  await send('Emulation.setVirtualTimePolicy', {
    policy: 'pauseIfNetworkFetchesPending',
    budget: ms,
    maxVirtualTimeTaskStarvationCount: 10000
  });
  await expired;
  await send('Emulation.setVirtualTimePolicy', { policy: 'pause' });

  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const file = `${outDir}/${variant}-t${ms}.png`;
  fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
  if (fs.statSync(file).size <= 5000) throw new Error(`${file} too small`);
  console.log(file, fs.statSync(file).size);
}

for (const variant of ['baseline', 'acquisition']) {
  for (const ms of [200, 1200, 1700, 2500, 3500]) await capture(variant, ms);
}

ws.close();
