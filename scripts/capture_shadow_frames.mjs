import fs from 'node:fs';

const base = 'http://127.0.0.1:8000/';
const debug = 'http://127.0.0.1:9222';
const outDir = 'shadow-proof';
const marks = [200, 1200, 1700, 2500, 3500];
fs.mkdirSync(outDir, { recursive: true });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CdpClient {
  constructor(url){this.ws=new WebSocket(url);this.nextId=1;this.pending=new Map();this.listeners=new Map()}
  async open(){await new Promise((resolve,reject)=>{this.ws.onopen=resolve;this.ws.onerror=reject});this.ws.onmessage=evt=>{const msg=JSON.parse(evt.data);if(msg.id){const p=this.pending.get(msg.id);if(!p)return;this.pending.delete(msg.id);msg.error?p.reject(new Error(JSON.stringify(msg.error))):p.resolve(msg.result);return}if(msg.method)for(const fn of this.listeners.get(msg.method)||[])fn(msg.params)}}
  send(method,params={}){const id=this.nextId++;this.ws.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}))}
  close(){this.ws.close()}
}
async function browserClient(){for(let i=0;i<100;i++){try{const version=await fetch(`${debug}/json/version`).then(r=>r.json());if(version.webSocketDebuggerUrl){const c=new CdpClient(version.webSocketDebuggerUrl);await c.open();return c}}catch{}await sleep(100)}throw new Error('Chrome browser DevTools endpoint not ready')}
async function pageClientForTarget(targetId){for(let i=0;i<100;i++){const list=await fetch(`${debug}/json/list`).then(r=>r.json());const page=list.find(x=>x.id===targetId&&x.type==='page'&&x.webSocketDebuggerUrl);if(page){const c=new CdpClient(page.webSocketDebuggerUrl);await c.open();await c.send('Page.enable');await c.send('Runtime.enable');await c.send('Emulation.setDeviceMetricsOverride',{width:540,height:960,deviceScaleFactor:1,mobile:false});return c}await sleep(100)}throw new Error(`Page target ${targetId} not ready`)}
async function waitForRuntimeReady(page,variant){let lastValue=null;for(let i=0;i<100;i++){try{const result=await page.send('Runtime.evaluate',{expression:`(() => ({ready: document.readyState, scene: !!document.querySelector('#scene'), creative: document.documentElement.classList.contains('creative-mode'), acq: document.documentElement.classList.contains('shadow-acq')}))()`,returnByValue:true});const value=result?.result?.value;lastValue=value;const ready=value&&value.ready!=='loading'&&value.scene&&value.creative;const variantReady=variant==='acquisition'?value?.acq===true:true;if(ready&&variantReady){console.log(`${variant} runtime ready`,JSON.stringify(value));return}}catch{}await sleep(100)}throw new Error(`${variant} runtime did not become ready; last=${JSON.stringify(lastValue)}`)}
async function screenshot(client,variant,ms){const shot=await client.send('Page.captureScreenshot',{format:'png',fromSurface:true});const file=`${outDir}/${variant}-t${ms}.png`;fs.writeFileSync(file,Buffer.from(shot.data,'base64'));const size=fs.statSync(file).size;if(size<=5000)throw new Error(`${file} too small`);console.log(file,size)}
async function captureVariant(browser,variant){
  const reveal=variant==='baseline'?3000:2550;
  const extra=variant==='acquisition'?'&acq=1':'';
  // V4 bounded slice moved Shadow Ahead from level 0 to level 2. Keep acquisition proof tied to the actual Shadow level.
  const url=`${base}?creative=1&level=2&revealAt=${reveal}${extra}`;
  const {targetId}=await browser.send('Target.createTarget',{url});const page=await pageClientForTarget(targetId);await waitForRuntimeReady(page,variant);
  const start=Date.now();let previousMark=0;for(const mark of marks){const wait=Math.max(0,mark-previousMark);if(wait)await sleep(wait);await screenshot(page,variant,mark);previousMark=mark}console.log(`${variant} capture elapsed=${Date.now()-start}ms target=${targetId}`);page.close();await browser.send('Target.closeTarget',{targetId});
}
const browser=await browserClient();try{await captureVariant(browser,'baseline');await captureVariant(browser,'acquisition')}finally{browser.close()}
