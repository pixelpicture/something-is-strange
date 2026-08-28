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
    const s=rectPx(sceneWrap), h=rectPx(hotspot), px=Math.max(24,Math.round((s.right-s.left)*.12)), py=Math.max(24,Math.round((s.bottom-s.top)*.12));
    const cs=[[s.left+px,s.top+py],[s.right-px,s.top+py],[s.left+px,s.bottom-py],[s.right-px,s.bottom-py]], m=16;
    return cs.find(([x,y])=>x<h.left-m||x>h.right+m||y<h.top-m||y>h.bottom+m)||cs[0];
  }
  function reportState(label) {
    const [x,y]=centerPx(hotspot),[wx,wy]=safeWrongPoint();
    log(label,mechanic(),x,y,'WRONG',wx,wy,'DPR',dpr(),'SCENE_CHILDREN',scene.childElementCount,'PROMPT',prompt.textContent.trim(),'STREAK',streak.textContent.trim(),'TIMER_DISPLAY',getComputedStyle(timer).display);
  }
  function scheduleState(label) { clearTimeout(reportTimer); reportTimer=setTimeout(()=>reportState(label),80); }
  function visualReady(kind) {
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const fr=rectPx(feedback), nr=rectPx(nextBtn);
      log('VISUAL_READY',kind,'FEEDBACK',feedback.textContent.trim(),'FB',fr.left,fr.top,fr.right,fr.bottom,'NEXT_HIDDEN',nextBtn.hidden?'true':'false','NEXT',nr.left,nr.top,nr.right,nr.bottom,'STREAK',streak.textContent.trim());
    }));
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

  hotspot.addEventListener('click',()=>{ log('EVENT','HOTSPOT_CLICK'); setTimeout(()=>log('STATE',streak.textContent.trim(),feedback.textContent.trim()),60); visualReady('CORRECT'); });
  tapLayer.addEventListener('click',()=>{ log('EVENT','WRONG_TAP'); setTimeout(()=>log('STATE',streak.textContent.trim(),feedback.textContent.trim()),60); visualReady('WRONG'); });
  nextBtn.addEventListener('click',()=>log('EVENT','NEXT_TAP'));
  new MutationObserver(()=>{ if(!nextBtn.hidden){const [x,y]=centerPx(nextBtn);log('NEXT',x,y);} }).observe(nextBtn,{attributes:true,attributeFilter:['hidden']});
  new MutationObserver(()=>{const text=feedback.textContent.trim();if(text)log('FEEDBACK',text);}).observe(feedback,{childList:true,characterData:true,subtree:true});
  new MutationObserver(()=>{ scheduleState('SCENE'); traceAcq(); }).observe(scene,{childList:true,subtree:true,attributes:true,attributeFilter:['d','transform','class']});
  new MutationObserver(()=>scheduleState('HOTSPOT')).observe(hotspot,{attributes:true,attributeFilter:['style']});
  traceAcq();
  requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>reportState('READY'),80)));
})();
