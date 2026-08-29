import fs from 'node:fs';

const base = 'http://127.0.0.1:8000/';
const debug = 'http://127.0.0.1:9222';
const outDir = 'shadow-video';
const frameCount = 34;
const frameStepMs = 100;
const shadowLevel = 2;
fs.mkdirSync(outDir, { recursive: true });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CdpClient {
  constructor(url) { this.ws = new WebSocket(url); this.nextId = 1; this.pending = new Map(); }
  async open() {
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = evt => {
      const msg = JSON.parse(evt.data); if (!msg.id) return;
      const p = this.pending.get(msg.id); if (!p) return;
      this.pending.delete(msg.id); if (msg.error) p.reject(new Error(JSON.stringify(msg.error))); else p.resolve(msg.result);
    };
  }
  send(method, params = {}) { const id = this.nextId++; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject })); }
  close() { this.ws.close(); }
}

async function browserClient() {
  for (let i=0;i<100;i++) { try { const v=await fetch(`${debug}/json/version`).then(r=>r.json()); if(v.webSocketDebuggerUrl){const c=new CdpClient(v.webSocketDebuggerUrl);await c.open();return c;} } catch{} await sleep(100); }
  throw new Error('Chrome browser DevTools endpoint not ready');
}
async function pageClientForTarget(targetId) {
  for(let i=0;i<100;i++){const list=await fetch(`${debug}/json/list`).then(r=>r.json());const target=list.find(x=>x.id===targetId&&x.type==='page'&&x.webSocketDebuggerUrl);if(target){const c=new CdpClient(target.webSocketDebuggerUrl);await c.open();await c.send('Page.enable');await c.send('Runtime.enable');await c.send('Emulation.setDeviceMetricsOverride',{width:540,height:960,deviceScaleFactor:1,mobile:false});return c;}await sleep(100);} throw new Error(`Page target ${targetId} not ready`);
}
async function waitForReady(page) {
  let last=null;
  for(let i=0;i<100;i++){const result=await page.send('Runtime.evaluate',{expression:`(() => ({ready:document.readyState,scene:!!document.querySelector('#scene'),creative:document.documentElement.classList.contains('creative-mode'),acq:document.documentElement.classList.contains('shadow-acq'),walker:!!document.querySelector('#walkerAcq'),shadow:!!document.querySelector('#shadowAcq')}))()`,returnByValue:true}).catch(()=>null);last=result?.result?.value||last;if(last&&last.ready!=='loading'&&last.scene&&last.creative&&last.acq&&last.walker&&last.shadow){console.log('acquisition video runtime ready',JSON.stringify(last));return;}await sleep(100);} throw new Error(`Acquisition video runtime not ready; last=${JSON.stringify(last)}`);
}

const browser=await browserClient(); let page; let targetId;
try {
  const url=`${base}?creative=1&level=${shadowLevel}&revealAt=2250&acq=1`;
  ({targetId}=await browser.send('Target.createTarget',{url})); page=await pageClientForTarget(targetId); await waitForReady(page);
  const start=Date.now();
  for(let i=0;i<frameCount;i++){const due=start+i*frameStepMs;const wait=due-Date.now();if(wait>0)await sleep(wait);const shot=await page.send('Page.captureScreenshot',{format:'png',fromSurface:true});const file=`${outDir}/frame${String(i).padStart(3,'0')}.png`;fs.writeFileSync(file,Buffer.from(shot.data,'base64'));if(fs.statSync(file).size<=5000)throw new Error(`${file} too small`);}
  console.log(`captured ${frameCount} frames in ${Date.now()-start}ms from Shadow level ${shadowLevel}`);
} finally { page?.close(); if(targetId)await browser.send('Target.closeTarget',{targetId}).catch(()=>{}); browser.close(); }
