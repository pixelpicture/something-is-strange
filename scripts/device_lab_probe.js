(() => {
  const log = (...parts) => console.info('[SIS_LAB]', ...parts);
  const hotspot = document.getElementById('hotspot');
  const tapLayer = document.getElementById('tapLayer');
  const nextBtn = document.getElementById('nextBtn');
  const scene = document.getElementById('scene');
  const sceneWrap = document.getElementById('sceneWrap');
  const feedback = document.getElementById('feedback');
  const prompt = document.getElementById('prompt');
  const streak = document.getElementById('streak');
  const timer = document.getElementById('timer');
  let reportTimer = 0;
  let visualTimer = 0;
  let lastVisualKey = '';
  let acqBaseLogged = false;
  let acqTurnLogged = false;
  const started = performance.now();

  function dpr() { return window.devicePixelRatio || 1; }
  function centerPx(el) { const r=el.getBoundingClientRect(), s=dpr(); return [Math.round((r.left+r.width/2)*s),Math.round((r.top+r.height/2)*s)]; }
  function rectPx(el) { const r=el.getBoundingClientRect(),s=dpr(); return {left:Math.round(r.left*s),top:Math.round(r.top*s),right:Math.round(r.right*s),bottom:Math.round(r.bottom*s)}; }
  function mechanic() {
    if (scene.querySelector('#mirrorFace')) return 'mirror_desync';
    if (scene.querySelector('#d5')) return 'domino_prediction';
    if (scene.querySelector('#rightLamp')) return 'wrong_light_switch';
    if (scene.querySelector('#shadowAcq')) return 'shadow_acquisition';
    if (scene.querySelector('#shadow')) return 'shadow_desync';
    return 'unknown';
  }
  function safeWrongPoint() {
    const s=sceneWrap.getBoundingClientRect(), h=hotspot.getBoundingClientRect(), scale=dpr();
    const xs=[.50,.32,.68,.18,.82], ys=[.50,.32,.68,.18,.82], margin=8;
    const valid=[];
    for (const yf of ys) for (const xf of xs) {
      const cx=s.left+s.width*xf, cy=s.top+s.height*yf;
      const outsideHotspot=cx<h.left-margin||cx>h.right+margin||cy<h.top-margin||cy>h.bottom+margin;
      const target=document.elementFromPoint(cx,cy);
      if (outsideHotspot && (target===tapLayer || tapLayer.contains(target))) {
        const centerPenalty=Math.abs(xf-.5)+Math.abs(yf-.5);
        valid.push({cx,cy,target,centerPenalty});
      }
    }
    valid.sort((a,b)=>a.centerPenalty-b.centerPenalty);
    const chosen=valid[0];
    if (chosen) return [Math.round(chosen.cx*scale),Math.round(chosen.cy*scale),chosen.target.id||chosen.target.tagName||'unknown'];
    const cx=s.left+s.width*.18, cy=s.top+s.height*.18, target=document.elementFromPoint(cx,cy);
    return [Math.round(cx*scale),Math.round(cy*scale),(target&&(target.id||target.tagName))||'unknown'];
  }
  function reportState(label) {
    const [x,y]=centerPx(hotspot),[wx,wy,wt]=safeWrongPoint();
    log(label,mechanic(),x,y,'WRONG',wx,wy,'WRONG_TARGET',wt,'DPR',dpr(),'SCENE_CHILDREN',scene.childElementCount,'PROMPT',prompt.textContent.trim(),'STREAK',streak.textContent.trim(),'TIMER_DISPLAY',getComputedStyle(timer).display);
  }
  function scheduleState(label) { clearTimeout(reportTimer); reportTimer=setTimeout(()=>reportState(label),80); }
  function visualReady(kind) {
    clearTimeout(visualTimer);
    visualTimer=setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const text=feedback.textContent.trim();
      const key=[kind,text,nextBtn.hidden?'true':'false',streak.textContent.trim()].join('|');
      if (key===lastVisualKey) return;
      lastVisualKey=key;
      const fr=rectPx(feedback), nr=rectPx(nextBtn);
      log('VISUAL_READY',kind,'FEEDBACK',text,'FB',fr.left,fr.top,fr.right,fr.bottom,'NEXT_HIDDEN',nextBtn.hidden?'true':'false','NEXT',nr.left,nr.top,nr.right,nr.bottom,'STREAK',streak.textContent.trim());
    })),20);
  }
  function classifyFeedback(text) {
    if (!text) return '';
    if (/^NO\b/i.test(text)) return 'WRONG';
    if (!nextBtn.hidden) return 'CORRECT';
    return '';
  }
  function traceAcq() {
    const sh=scene.querySelector('#shadowAcq');
    if (!sh) return;
    if (!acqBaseLogged) { acqBaseLogged=true; log('ACQ_BASE',Math.round(performance.now()-started)); }
    const d=sh.getAttribute('d')||'';
    if (!acqTurnLogged && (scene.classList.contains('shadow-wrong') || d.includes('L291 250'))) {
      acqTurnLogged=true; log('ACQ_TURN',Math.round(performance.now()-started));
    }
  }

  document.addEventListener('pointerdown',e=>log('POINTER_DOWN',e.target?.id||e.target?.tagName||'unknown',Math.round(e.clientX),Math.round(e.clientY)),true);
  document.addEventListener('click',e=>log('CLICK_CAPTURE',e.target?.id||e.target?.tagName||'unknown',Math.round(e.clientX),Math.round(e.clientY)),true);
  hotspot.addEventListener('click',()=>{ log('EVENT','HOTSPOT_CLICK'); setTimeout(()=>log('STATE',streak.textContent.trim(),feedback.textContent.trim()),60); visualReady('CORRECT'); });
  tapLayer.addEventListener('click',()=>{ log('EVENT','WRONG_TAP'); setTimeout(()=>log('STATE',streak.textContent.trim(),feedback.textContent.trim()),60); visualReady('WRONG'); });
  nextBtn.addEventListener('click',()=>log('EVENT','NEXT_TAP'));
  new MutationObserver(()=>{ if(!nextBtn.hidden){const [x,y]=centerPx(nextBtn);log('NEXT',x,y); const kind=classifyFeedback(feedback.textContent.trim()); if(kind) visualReady(kind);} }).observe(nextBtn,{attributes:true,attributeFilter:['hidden']});
  new MutationObserver(()=>{const text=feedback.textContent.trim();if(text){log('FEEDBACK',text); const kind=classifyFeedback(text); if(kind) visualReady(kind);}}).observe(feedback,{childList:true,characterData:true,subtree:true});
  new MutationObserver(()=>{ scheduleState('SCENE'); traceAcq(); }).observe(scene,{childList:true,subtree:true,attributes:true,attributeFilter:['d','transform','class']});
  new MutationObserver(()=>scheduleState('HOTSPOT')).observe(hotspot,{attributes:true,attributeFilter:['style']});
  traceAcq();
  requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>reportState('READY'),80)));

  const params = new URLSearchParams(location.search);
  if (params.get('labdelay') === '1' && params.get('creative') === '1' && params.get('acq') === '1') {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (fn, ms, ...args) => nativeSetTimeout(fn, (Number(ms) || 0) + 1500, ...args);
    log('ACQ_DELAY_ARMED',1500);
    nativeSetTimeout(() => { window.setTimeout = nativeSetTimeout; }, 0);
  }
})();
