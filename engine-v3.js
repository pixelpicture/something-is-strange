(() => {
  'use strict';
  const levels = window.SIS_LEVELS || [];
  const scene = document.getElementById('scene');
  const sceneWrap = document.getElementById('sceneWrap');
  const hotspot = document.getElementById('hotspot');
  const tapLayer = document.getElementById('tapLayer');
  const tapEcho = document.getElementById('tapEcho');
  const timer = document.getElementById('timer');
  const phaseEl = document.getElementById('phase');
  const prompt = document.getElementById('prompt');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  const replayBtn = document.getElementById('replayBtn');
  const progressEl = document.getElementById('streak');

  let index = 0;
  let phase = 'watch';
  let timers = [];
  let countdownId = null;
  let wrongCount = 0;
  const sessionStartedAt = performance.now();

  function emit(name, payload = {}) {
    const record = { event:name, ts:Math.round(performance.now()-sessionStartedAt), level:levels[index]?.id, phase, ...payload };
    console.info('[SIS]', record);
    try { const log=JSON.parse(localStorage.getItem('sis_events')||'[]'); log.push(record); localStorage.setItem('sis_events',JSON.stringify(log.slice(-300))); } catch (_) {}
  }
  function clearScheduled(){ timers.forEach(clearTimeout); timers=[]; if(countdownId) clearInterval(countdownId); countdownId=null; }
  function later(fn,ms){ const id=setTimeout(fn,ms); timers.push(id); return id; }
  function q(id){ return scene.querySelector('#'+id); }
  function svg(markup){ scene.innerHTML=markup; }
  function attr(id,name,value){ q(id)?.setAttribute(name,String(value)); }
  function attrs(id,values){ const el=q(id); if(!el)return; Object.entries(values).forEach(([k,v])=>el.setAttribute(k,String(v))); }
  function setHotspot(h){ hotspot.style.left=h.x+'%'; hotspot.style.top=h.y+'%'; hotspot.style.width=h.w+'%'; hotspot.style.height=h.h+'%'; }
  function setDominoStanding(i){ attrs('d'+i,{x:28+i*31,y:300,width:13,height:72}); }
  function setDominoFlat(i){ attrs('d'+i,{x:21+i*31,y:359,width:29,height:13}); }

  const renderers = {
    shadow_desync(){
      svg(`<defs><linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34415d"/><stop offset="1" stop-color="#11151e"/></linearGradient></defs>
      <rect width="360" height="520" fill="url(#night)"/><rect y="350" width="360" height="170" fill="#17191f"/>
      <rect x="286" y="76" width="74" height="274" fill="#3c4150"/><rect x="296" y="91" width="64" height="259" fill="#1d2028"/>
      <path d="M286 350 L286 74" stroke="#7e8799" stroke-width="2" opacity=".45"/><circle cx="70" cy="286" r="8" fill="#ffe7a0" opacity=".9"/>
      <path id="shadow" class="entity" d="M92 347 C136 342 178 338 223 332 L246 349 C181 360 133 365 92 366 Z" fill="#030405" opacity=".88"/>
      <g id="walker" class="entity walker-motion"><circle cx="86" cy="285" r="18" fill="#e0e3ea"/><rect x="70" y="302" width="32" height="60" rx="13" fill="#b5bdd0"/><line x1="78" y1="357" x2="69" y2="409" stroke="#b5bdd0" stroke-width="11" stroke-linecap="round"/><line x1="94" y1="357" x2="105" y2="409" stroke="#b5bdd0" stroke-width="11" stroke-linecap="round"/></g>
      <text x="22" y="46" fill="#fff" opacity=".78" font-size="15" font-weight="700">CORNER →</text>`);
      later(()=>{ q('walker').style.transform='translateX(58px)'; },620);
      later(()=>{ q('walker').style.transform='translateX(118px)'; },1250);
      later(()=>{ q('walker').style.transform='translateX(164px)'; },1850);
      later(()=>attr('shadow','d','M246 347 C267 338 279 323 286 298 L295 239 L314 248 L302 318 C294 348 275 361 246 367 Z'),2050);
      later(()=>{ q('walker').style.transform='translateX(190px)'; },2700);
    },
    extra_shadow(){
      svg(`<rect width="360" height="520" fill="#d6cbb0"/><rect y="365" width="360" height="155" fill="#9b8165"/><circle cx="180" cy="128" r="40" fill="#f1ca69" opacity=".8"/>
      <g class="entity"><circle cx="112" cy="275" r="20" fill="#454b56"/><rect x="94" y="296" width="36" height="78" rx="14" fill="#586171"/><circle cx="235" cy="278" r="20" fill="#554a45"/><rect x="217" y="299" width="36" height="76" rx="14" fill="#6e5e55"/></g>
      <path d="M113 371 L66 455 L145 455 Z" fill="#413b35" opacity=".58"/><path d="M235 374 L190 455 L270 455 Z" fill="#413b35" opacity=".58"/><path id="thirdShadow" class="entity" d="M174 360 L143 455 L215 455 Z" fill="#11100f" opacity="0"/>
      <text x="22" y="46" fill="#3b3328" opacity=".75" font-size="15" font-weight="700">2 PEOPLE</text>`);
      later(()=>attr('thirdShadow','opacity','.82'),1650);
    },
    wrong_light_switch(){
      svg(`<rect width="360" height="520" fill="#151923"/><rect y="365" width="360" height="155" fill="#242630"/>
      <path d="M92 310 L92 190 L88 150" fill="none" stroke="#7b8291" stroke-width="4"/><path d="M272 310 L272 190" fill="none" stroke="#7b8291" stroke-width="4"/>
      <g id="leftLamp" class="entity"><path d="M48 150 L128 150 L112 190 L64 190 Z" fill="#4c5566"/><circle cx="88" cy="190" r="13" fill="#30343e"/></g>
      <g id="rightLamp" class="entity"><path d="M232 150 L312 150 L296 190 L248 190 Z" fill="#4c5566"/><circle id="rightBulb" cx="272" cy="190" r="13" fill="#30343e"/><circle id="rightGlow" cx="272" cy="190" r="48" fill="#ffe58d" opacity="0"/></g>
      <rect x="70" y="292" width="44" height="62" rx="8" fill="#e0e1e5"/><rect id="toggle" x="86" y="305" width="12" height="27" rx="6" fill="#414652"/><text x="49" y="130" fill="#fff" opacity=".65" font-size="12">SWITCH</text>`);
      later(()=>attr('toggle','y',320),1000);
      later(()=>{attr('rightBulb','fill','#fff0a7');attr('rightGlow','opacity','.38');},1500);
    },
    reverse_splash(){
      svg(`<rect width="360" height="520" fill="#a8c9dd"/><rect y="370" width="360" height="150" fill="#3988a9"/><ellipse id="splash" class="entity" cx="180" cy="370" rx="62" ry="14" fill="none" stroke="#e8fbff" stroke-width="9" opacity="0"/><path id="drops" d="M145 350 Q136 324 148 306 M215 350 Q226 324 214 306" fill="none" stroke="#e8fbff" stroke-width="7" stroke-linecap="round" opacity="0"/><circle id="ball" class="entity" cx="180" cy="88" r="30" fill="#e25c4d" stroke="#8c3931" stroke-width="4"/><text x="22" y="46" fill="#173847" opacity=".76" font-size="15" font-weight="700">BALL → WATER</text>`);
      later(()=>attr('ball','cy',170),650); later(()=>attr('ball','cy',250),1200); later(()=>attr('ball','cy',305),1650);
      later(()=>{attr('splash','opacity',1);attr('drops','opacity',1);},1900); later(()=>attr('ball','cy',342),2850);
    },
    color_theft(){
      svg(`<rect width="360" height="520" fill="#d8d0bf"/><rect y="375" width="360" height="145" fill="#99866d"/><ellipse cx="180" cy="375" rx="115" ry="16" fill="#6d5f50" opacity=".22"/><circle id="ballLeft" class="entity" cx="67" cy="335" r="30" fill="#e3423d"/><path id="vase" class="entity" d="M150 210 Q145 250 135 300 Q128 355 180 375 Q232 355 225 300 Q215 250 210 210 Z" fill="#f5f1e8" stroke="#777169" stroke-width="4"/><circle id="ballRight" class="entity" cx="290" cy="335" r="30" fill="#f5f1e8" opacity="0"/><text x="22" y="46" fill="#3a332d" opacity=".75" font-size="15" font-weight="700">FOLLOW RED</text>`);
      later(()=>attr('ballLeft','cx',105),650); later(()=>attr('ballLeft','cx',145),1200); later(()=>{attr('ballLeft','opacity',0);attr('vase','fill','#e3423d');attr('ballRight','opacity',1);},1750);
    },
    door_two_rooms(){
      svg(`<rect width="360" height="520" fill="#8e8a83"/><rect y="400" width="360" height="120" fill="#5f5a54"/><rect x="92" y="80" width="176" height="322" rx="8" fill="#302d2b"/><g id="warmRoom" class="entity" opacity="0"><rect x="104" y="92" width="152" height="296" fill="#efc477"/><circle cx="222" cy="135" r="28" fill="#fff3ad"/><rect x="104" y="300" width="152" height="88" fill="#76a55f"/></g><g id="coldRoom" class="entity" opacity="0"><rect x="104" y="92" width="152" height="296" fill="#9fc3de"/><circle cx="220" cy="140" r="28" fill="#eff8ff"/><path d="M104 310 Q150 280 190 315 Q222 288 256 316 L256 388 L104 388 Z" fill="#eef5f8"/></g><rect id="doorPanel" class="entity" x="104" y="92" width="152" height="296" rx="5" fill="#624b3d"/><circle cx="235" cy="245" r="7" fill="#d6b36f"/><text x="22" y="46" fill="#fff" opacity=".78" font-size="15" font-weight="700">OPEN #1 / OPEN #2</text>`);
      later(()=>{attr('doorPanel','opacity',0);attr('warmRoom','opacity',1);},750); later(()=>{attr('doorPanel','opacity',1);attr('warmRoom','opacity',0);},1850); later(()=>{attr('coldRoom','opacity',1);attr('doorPanel','opacity',0);},2700);
    },
    mirror_desync(){
      svg(`<defs><linearGradient id="room" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9d2c8"/><stop offset="1" stop-color="#8f9198"/></linearGradient></defs><rect width="360" height="520" fill="url(#room)"/><rect x="197" y="72" width="126" height="260" rx="9" fill="#353943"/><rect x="205" y="80" width="110" height="244" rx="5" fill="#bfc7ce" opacity=".72"/><g class="entity"><rect x="67" y="298" width="74" height="118" rx="25" fill="#3c465e"/><circle cx="104" cy="267" r="35" fill="#d8b79d"/><path d="M77 252 Q104 213 132 251" fill="#3a2c27"/><circle id="realEye1" cx="94" cy="260" r="4" fill="#49362f"/><circle id="realEye2" cx="106" cy="260" r="4" fill="#49362f"/></g><g id="mirrorFace" class="entity" opacity=".95"><rect x="222" y="242" width="69" height="82" rx="23" fill="#4e5870"/><circle cx="257" cy="213" r="32" fill="#cfaf98"/><path d="M232 198 Q257 165 283 198" fill="#40322d"/><circle id="mirrorEye1" cx="248" cy="207" r="4" fill="#49362f"/><circle id="mirrorEye2" cx="260" cy="207" r="4" fill="#49362f"/></g><text x="22" y="46" fill="#20242c" opacity=".72" font-size="15" font-weight="700">LOOK LEFT</text>`);
      later(()=>{attr('realEye1','cx',83);attr('realEye2','cx',93);},1100); later(()=>{attr('mirrorEye1','cx',271);attr('mirrorEye2','cx',281);},2200);
    },
    haircut_mirror(){
      svg(`<rect width="360" height="520" fill="#c6b6a7"/><rect y="390" width="360" height="130" fill="#6e5a4d"/><rect x="210" y="55" width="120" height="260" rx="8" fill="#504942"/><rect x="218" y="63" width="104" height="244" fill="#cbd1d4"/><g class="entity"><circle cx="112" cy="252" r="36" fill="#d6b293"/><path id="realHair" d="M78 244 Q112 197 147 243 L140 226 Q110 189 83 222 Z" fill="#3e3029"/><rect x="80" y="286" width="64" height="112" rx="22" fill="#4f657c"/></g><g class="entity"><circle cx="270" cy="200" r="31" fill="#cda98d"/><path id="mirrorHair" class="entity" d="M241 194 Q270 154 300 193 L294 177 Q268 145 245 173 Z" fill="#3e3029"/><rect x="244" y="231" width="52" height="76" rx="18" fill="#596c81"/></g><text x="22" y="46" fill="#3e332d" opacity=".72" font-size="15" font-weight="700">REAL / MIRROR</text>`);
      later(()=>attr('mirrorHair','d','M242 190 Q270 176 298 190 L294 178 Q270 169 246 180 Z'),1700);
    },
    wrong_occlusion(){
      svg(`<rect width="360" height="520" fill="#c9d0c3"/><rect y="385" width="360" height="135" fill="#887961"/><g id="catBody" class="entity"><ellipse cx="82" cy="330" rx="38" ry="28" fill="#515660"/><circle cx="106" cy="298" r="21" fill="#515660"/><path d="M92 281 L98 258 L110 282 M110 282 L125 261 L124 289" fill="#515660"/></g><g id="chair" class="entity"><rect x="158" y="245" width="92" height="115" rx="12" fill="#6f5144"/><rect x="170" y="360" width="14" height="82" fill="#5b4037"/><rect x="225" y="360" width="14" height="82" fill="#5b4037"/></g><path id="tail" class="entity" d="M50 331 Q20 315 28 286" fill="none" stroke="#515660" stroke-width="17" stroke-linecap="round"/><text x="22" y="46" fill="#30362f" opacity=".72" font-size="15" font-weight="700">CAT → BEHIND CHAIR</text>`);
      later(()=>{attr('catBody','transform','translate(45 0)');attr('tail','transform','translate(45 0)');},700); later(()=>{attr('catBody','transform','translate(90 0)');attr('tail','transform','translate(90 0)');},1400); later(()=>{attr('catBody','transform','translate(125 0)');attr('tail','transform','translate(125 0)');},2200);
    },
    domino_prediction(){
      svg(`<rect width="360" height="520" fill="#dad2be"/><rect y="372" width="360" height="148" fill="#a99878"/><path d="M18 372 Q180 330 342 372" fill="none" stroke="#8d7b5d" stroke-width="4" opacity=".4"/>${Array.from({length:10},(_,i)=>`<rect id="d${i}" class="entity" x="${28+i*31}" y="300" width="13" height="72" rx="4" fill="${i===5?'#fff7d6':'#eee8dc'}" stroke="#6b6258" stroke-width="2"/>`).join('')}<text x="22" y="46" fill="#302c29" opacity=".72" font-size="15" font-weight="700">FALL →</text>`);
      for(let i=0;i<5;i++) later(()=>setDominoFlat(i),700+i*360); later(()=>{ q('d5')?.animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:320}); },2700);
    }
  };

  const replays = {
    shadow_desync(){ attr('shadow','d','M246 347 C267 338 279 323 286 298 L295 239 L314 248 L302 318 C294 348 275 361 246 367 Z'); q('walker').style.transform='translateX(164px)'; },
    extra_shadow(){attr('thirdShadow','opacity','.82');}, wrong_light_switch(){attr('toggle','y',320);attr('rightBulb','fill','#fff0a7');attr('rightGlow','opacity','.38');},
    reverse_splash(){attr('splash','opacity',1);attr('drops','opacity',1);attr('ball','cy',342);}, color_theft(){attr('ballLeft','opacity',0);attr('vase','fill','#e3423d');attr('ballRight','opacity',1);},
    door_two_rooms(){attr('doorPanel','opacity',0);attr('warmRoom','opacity',0);attr('coldRoom','opacity',1);}, mirror_desync(){attr('realEye1','cx',83);attr('realEye2','cx',93);attr('mirrorEye1','cx',271);attr('mirrorEye2','cx',281);},
    haircut_mirror(){attr('mirrorHair','d','M242 190 Q270 176 298 190 L294 178 Q270 169 246 180 Z');}, wrong_occlusion(){attr('catBody','transform','translate(125 0)');attr('tail','transform','translate(125 0)');},
    domino_prediction(){for(let i=0;i<5;i++)setDominoFlat(i);for(let i=5;i<10;i++)setDominoStanding(i);}
  };

  function showTap(clientX,clientY,kind){ const r=sceneWrap.getBoundingClientRect(); tapEcho.style.left=(clientX-r.left)+'px'; tapEcho.style.top=(clientY-r.top)+'px'; tapEcho.className='tap-echo'; void tapEcho.offsetWidth; tapEcho.classList.add(kind); }
  function acknowledgeWatchTap(e){ showTap(e.clientX,e.clientY,'wrong'); feedback.textContent='WATCH FIRST — THEN TAP.'; feedback.className='feedback info'; emit('watch_phase_tap'); later(()=>{if(phase==='watch')feedback.textContent='';},900); }
  function setPhase(next,label){ phase=next; phaseEl.textContent=label; phaseEl.className='phase '+(next==='answer'?'answer':next==='reveal'?'reveal':''); }

  function beginAnswer(level){
    if(phase!=='watch') return;
    setPhase('answer','TAP NOW'); prompt.textContent=level.question; replayBtn.hidden=false; feedback.textContent=index===0?'NOW TAP THE STRANGE PART.':''; feedback.className=index===0?'feedback info':'feedback';
    emit('answer_window_open',{answerMs:level.answerMs});
    if(level.answerMs<=0){ timer.hidden=true; return; }
    timer.hidden=false; const start=performance.now();
    const paint=()=>{ const remain=Math.max(0,Math.ceil((level.answerMs-(performance.now()-start))/1000)); timer.textContent=String(remain); if(remain<=0){clearInterval(countdownId);countdownId=null; if(phase==='answer'){emit('answer_timeout'); feedback.textContent='TIME — WATCH IT AGAIN.';feedback.className='feedback info';timer.hidden=true;later(()=>loadLevel(index,true),650);}}};
    paint(); countdownId=setInterval(paint,100);
  }

  function reveal(level){
    clearScheduled(); setPhase('reveal','FOUND'); timer.hidden=true; replayBtn.hidden=false; hotspot.classList.add('reveal');
    scene.querySelectorAll('.entity').forEach(el=>el.classList.add('dim')); const focus=scene.querySelector('#'+level.focusId); focus?.classList.remove('dim');focus?.classList.add('glow');
    feedback.textContent=level.revealText;feedback.className='feedback good';nextBtn.hidden=false;replays[level.mechanic]?.();emit('reveal_shown',{mechanic:level.mechanic,wrongCount});
  }

  function loadLevel(newIndex,isReplay=false){
    clearScheduled(); index=((newIndex%levels.length)+levels.length)%levels.length; wrongCount=0; setPhase('watch','WATCH'); feedback.textContent='';feedback.className='feedback';nextBtn.hidden=true;replayBtn.hidden=true;timer.hidden=true;hotspot.classList.remove('reveal');tapEcho.className='tap-echo';
    const level=levels[index];progressEl.textContent='PUZZLE '+(index+1)+' / '+levels.length;prompt.textContent=level.intro;setHotspot(level.hotspot);renderers[level.mechanic]?.();
    emit(isReplay?'level_replay':'level_start',{mechanic:level.mechanic,family:level.telemetry.family,observeMs:level.observeMs,answerMs:level.answerMs}); later(()=>beginAnswer(level),level.observeMs);
  }

  hotspot.addEventListener('click',e=>{ e.stopPropagation(); if(phase==='watch'){acknowledgeWatchTap(e);return;} if(phase!=='answer')return; showTap(e.clientX,e.clientY,'correct'); try{navigator.vibrate?.(24);}catch(_){} emit('correct_tap',{wrongCount}); reveal(levels[index]); });
  tapLayer.addEventListener('click',e=>{ if(phase==='watch'){acknowledgeWatchTap(e);return;} if(phase!=='answer')return; wrongCount++; showTap(e.clientX,e.clientY,'wrong'); sceneWrap.classList.remove('wrong-flash');void sceneWrap.offsetWidth;sceneWrap.classList.add('wrong-flash');try{navigator.vibrate?.(14);}catch(_){} feedback.textContent=wrongCount===1?'NOT THAT — KEEP LOOKING.':'STILL NOT IT — TRY ANOTHER PART.';feedback.className='feedback bad';emit('wrong_tap',{wrongCount}); later(()=>{if(phase==='answer'){feedback.textContent='';feedback.className='feedback';}},1000); });
  replayBtn.addEventListener('click',()=>{emit('replay_tap');loadLevel(index,true);}); nextBtn.addEventListener('click',()=>{emit('next_tap');loadLevel(index+1);});

  if(!levels.length){prompt.textContent='NO LEVELS LOADED';timer.hidden=true;return;}
  const params=new URLSearchParams(location.search); const requested=Number.parseInt(params.get('level')||'0',10); loadLevel(Number.isFinite(requested)?requested:0);
  const revealAt=Number.parseInt(params.get('revealAt')||'-1',10); if(Number.isFinite(revealAt)&&revealAt>=0) later(()=>{if(phase==='watch')beginAnswer(levels[index]);hotspot.click();},revealAt);
})();
