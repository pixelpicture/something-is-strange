(() => {
  const levels = window.SIS_LEVELS || [];
  const scene = document.getElementById('scene');
  const sceneWrap = document.getElementById('sceneWrap');
  const hotspot = document.getElementById('hotspot');
  const tapLayer = document.getElementById('tapLayer');
  const timer = document.getElementById('timer');
  const prompt = document.getElementById('prompt');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  const streakEl = document.getElementById('streak');

  let index = 0;
  let streak = 0;
  let solved = false;
  let timers = [];
  let countdownId = null;
  const sessionStartedAt = performance.now();

  function emit(name, payload = {}) {
    const record = { event: name, ts: Math.round(performance.now() - sessionStartedAt), level: levels[index]?.id, ...payload };
    console.info('[SIS]', record);
    try {
      const log = JSON.parse(localStorage.getItem('sis_events') || '[]');
      log.push(record);
      localStorage.setItem('sis_events', JSON.stringify(log.slice(-200)));
    } catch (_) {}
  }

  function clearScheduled() {
    timers.forEach(clearTimeout);
    timers = [];
    if (countdownId) clearInterval(countdownId);
    countdownId = null;
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function q(id) { return scene.querySelector('#' + id); }
  function svg(markup) { scene.innerHTML = markup; }
  function attr(id, name, value) { q(id)?.setAttribute(name, String(value)); }
  function attrs(id, values) { const el = q(id); if (!el) return; Object.entries(values).forEach(([k,v]) => el.setAttribute(k, String(v))); }

  function setHotspot(h) {
    hotspot.style.left = h.x + '%';
    hotspot.style.top = h.y + '%';
    hotspot.style.width = h.w + '%';
    hotspot.style.height = h.h + '%';
  }

  function setDominoStanding(i) {
    const el = q('d' + i); if (!el) return;
    attrs('d' + i, { x: 28 + i * 31, y: 300, width: 13, height: 72 });
  }
  function setDominoFlat(i) {
    const el = q('d' + i); if (!el) return;
    attrs('d' + i, { x: 21 + i * 31, y: 359, width: 29, height: 13 });
  }

  const renderers = {
    shadow_desync() {
      svg(`<defs><linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27324a"/><stop offset="1" stop-color="#11151e"/></linearGradient></defs>
        <rect width="360" height="520" fill="url(#night)"/><rect y="350" width="360" height="170" fill="#17191f"/>
        <rect x="272" y="82" width="88" height="268" fill="#343847"/><rect x="282" y="96" width="78" height="254" fill="#20232c"/>
        <circle cx="70" cy="286" r="7" fill="#f7e7b0" opacity=".9"/>
        <path id="shadow" class="entity" d="M126 347 C168 340 219 330 276 316 L286 342 C218 356 166 364 126 367 Z" fill="#050607" opacity=".84"/>
        <g id="walker" class="entity"><circle cx="118" cy="285" r="17" fill="#d8dbe4"/><rect x="103" y="302" width="31" height="58" rx="13" fill="#aeb5c6"/><line x1="111" y1="356" x2="102" y2="408" stroke="#aeb5c6" stroke-width="11" stroke-linecap="round"/><line x1="126" y1="356" x2="137" y2="408" stroke="#aeb5c6" stroke-width="11" stroke-linecap="round"/></g>
        <text x="22" y="46" fill="#fff" opacity=".6" font-size="13">WATCH THE CORNER</text>`);
      later(() => attr('shadow','d','M126 347 C168 340 220 330 276 316 L296 255 L315 262 L286 342 C218 356 166 364 126 367 Z'), 1750);
    },

    mirror_desync() {
      svg(`<defs><linearGradient id="room" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9d2c8"/><stop offset="1" stop-color="#8f9198"/></linearGradient></defs>
        <rect width="360" height="520" fill="url(#room)"/><rect x="197" y="72" width="126" height="260" rx="9" fill="#353943"/><rect x="205" y="80" width="110" height="244" rx="5" fill="#bfc7ce" opacity=".72"/>
        <g class="entity"><rect x="67" y="298" width="74" height="118" rx="25" fill="#3c465e"/><circle cx="104" cy="267" r="35" fill="#d8b79d"/><path d="M77 252 Q104 213 132 251" fill="#3a2c27"/><circle id="realEye1" cx="94" cy="260" r="3.3" fill="#49362f"/><circle id="realEye2" cx="106" cy="260" r="3.3" fill="#49362f"/><circle id="realNose" cx="115" cy="269" r="4" fill="#6c4c3d"/></g>
        <g id="mirrorFace" class="entity" opacity=".95"><rect x="222" y="242" width="69" height="82" rx="23" fill="#4e5870"/><circle cx="257" cy="213" r="32" fill="#cfaf98"/><path d="M232 198 Q257 165 283 198" fill="#40322d"/><circle id="mirrorEye1" cx="248" cy="207" r="3.3" fill="#49362f"/><circle id="mirrorEye2" cx="260" cy="207" r="3.3" fill="#49362f"/><circle id="mirrorNose" cx="267" cy="215" r="4" fill="#6c4c3d"/></g>
        <text x="22" y="46" fill="#20242c" opacity=".65" font-size="13">DON'T BLINK</text>`);
      later(() => { attr('realNose','cx',88); attr('realEye1','cx',83); attr('realEye2','cx',92); }, 1450);
      later(() => { attr('mirrorNose','cx',278); attr('mirrorEye1','cx',270); attr('mirrorEye2','cx',281); }, 2300);
    },

    domino_prediction() {
      svg(`<rect width="360" height="520" fill="#dad2be"/><rect y="372" width="360" height="148" fill="#a99878"/><path d="M18 372 Q180 330 342 372" fill="none" stroke="#8d7b5d" stroke-width="4" opacity=".4"/>
        ${Array.from({length:10},(_,i)=>`<rect id="d${i}" class="entity" x="${28+i*31}" y="300" width="13" height="72" rx="4" fill="#eee8dc" stroke="#6b6258" stroke-width="2"/>`).join('')}
        <text x="22" y="46" fill="#302c29" opacity=".68" font-size="13">PICK THE BREAK POINT</text>`);
      for (let i=0;i<5;i++) later(() => setDominoFlat(i), 810 + i*285);
    },

    wrong_light_switch() {
      svg(`<rect width="360" height="520" fill="#171b25"/><rect y="365" width="360" height="155" fill="#242630"/>
        <path d="M92 310 L92 190 L88 150" fill="none" stroke="#6c7280" stroke-width="4" opacity=".75"/>
        <g class="entity"><path d="M48 150 L128 150 L112 190 L64 190 Z" fill="#3e4656"/><circle cx="88" cy="190" r="13" fill="#30343e"/></g>
        <g id="rightLamp" class="entity"><path d="M232 150 L312 150 L296 190 L248 190 Z" fill="#3e4656"/><circle id="rightBulb" cx="272" cy="190" r="13" fill="#30343e"/><circle id="rightGlow" cx="272" cy="190" r="40" fill="#ffe89a" opacity="0"/></g>
        <rect x="70" y="292" width="44" height="62" rx="8" fill="#d7d8dd"/><rect id="toggle" x="86" y="305" width="12" height="27" rx="6" fill="#414652"/>
        <text x="22" y="46" fill="#fff" opacity=".65" font-size="13">WATCH THE SWITCH</text>`);
      later(() => { attr('toggle','y',320); attr('rightBulb','fill','#ffe89a'); attr('rightGlow','opacity','.28'); }, 1300);
    },

    color_theft() {
      svg(`<rect width="360" height="520" fill="#d8d0bf"/><rect y="375" width="360" height="145" fill="#99866d"/>
        <ellipse cx="180" cy="375" rx="115" ry="16" fill="#6d5f50" opacity=".22"/>
        <circle id="ballLeft" class="entity" cx="72" cy="335" r="29" fill="#d84b45"/>
        <path id="vase" class="entity" d="M150 210 Q145 250 135 300 Q128 355 180 375 Q232 355 225 300 Q215 250 210 210 Z" fill="#f2eee5" stroke="#777169" stroke-width="4"/>
        <circle id="ballRight" class="entity" cx="288" cy="335" r="29" fill="#f2eee5" opacity="0"/>
        <text x="22" y="46" fill="#3a332d" opacity=".7" font-size="13">FOLLOW THE RED BALL</text>`);
      later(() => attr('ballLeft','cx',112), 650);
      later(() => attr('ballLeft','cx',148), 1050);
      later(() => { attr('ballLeft','opacity',0); attr('vase','fill','#d84b45'); attr('ballRight','opacity',1); }, 1550);
    },

    wrong_occlusion() {
      svg(`<rect width="360" height="520" fill="#c9d0c3"/><rect y="385" width="360" height="135" fill="#887961"/>
        <g id="catBody" class="entity" transform="translate(0 0)"><ellipse cx="82" cy="330" rx="38" ry="28" fill="#515660"/><circle cx="106" cy="298" r="21" fill="#515660"/><path d="M92 281 L98 258 L110 282 M110 282 L125 261 L124 289" fill="#515660"/></g>
        <g id="chair" class="entity"><rect x="158" y="245" width="92" height="115" rx="12" fill="#6f5144"/><rect x="170" y="360" width="14" height="82" fill="#5b4037"/><rect x="225" y="360" width="14" height="82" fill="#5b4037"/></g>
        <path id="tail" class="entity" d="M50 331 Q20 315 28 286" fill="none" stroke="#515660" stroke-width="15" stroke-linecap="round" transform="translate(0 0)"/>
        <text x="22" y="46" fill="#30362f" opacity=".65" font-size="13">WATCH THE CAT</text>`);
      later(() => { attr('catBody','transform','translate(45 0)'); attr('tail','transform','translate(45 0)'); }, 700);
      later(() => { attr('catBody','transform','translate(90 0)'); attr('tail','transform','translate(90 0)'); }, 1300);
      later(() => { attr('catBody','transform','translate(125 0)'); attr('tail','transform','translate(125 0)'); }, 1900);
    },

    reverse_splash() {
      svg(`<rect width="360" height="520" fill="#a8c9dd"/><rect y="370" width="360" height="150" fill="#3988a9"/>
        <ellipse id="splash" class="entity" cx="180" cy="370" rx="58" ry="13" fill="none" stroke="#dff6ff" stroke-width="8" opacity="0"/>
        <path id="drops" d="M145 350 Q136 324 148 306 M215 350 Q226 324 214 306" fill="none" stroke="#dff6ff" stroke-width="7" stroke-linecap="round" opacity="0"/>
        <circle id="ball" class="entity" cx="180" cy="90" r="28" fill="#e25c4d" stroke="#8c3931" stroke-width="4"/>
        <text x="22" y="46" fill="#173847" opacity=".72" font-size="13">WATCH THE WATER</text>`);
      later(() => attr('ball','cy',180), 700);
      later(() => attr('ball','cy',270), 1300);
      later(() => { attr('splash','opacity',1); attr('drops','opacity',1); }, 1650);
      later(() => attr('ball','cy',342), 2500);
    },

    door_two_rooms() {
      svg(`<rect width="360" height="520" fill="#8e8a83"/><rect y="400" width="360" height="120" fill="#5f5a54"/>
        <rect x="92" y="80" width="176" height="322" rx="8" fill="#302d2b"/>
        <g id="warmRoom" class="entity" opacity="0"><rect x="104" y="92" width="152" height="296" fill="#efc477"/><circle cx="222" cy="135" r="28" fill="#fff3ad"/><rect x="104" y="300" width="152" height="88" fill="#76a55f"/></g>
        <g id="coldRoom" class="entity" opacity="0"><rect x="104" y="92" width="152" height="296" fill="#aac7dc"/><circle cx="220" cy="140" r="28" fill="#eff8ff"/><path d="M104 310 Q150 280 190 315 Q222 288 256 316 L256 388 L104 388 Z" fill="#eef5f8"/></g>
        <rect id="doorPanel" class="entity" x="104" y="92" width="152" height="296" rx="5" fill="#624b3d"/><circle cx="235" cy="245" r="7" fill="#d6b36f"/>
        <text x="22" y="46" fill="#fff" opacity=".7" font-size="13">SAME DOOR. WATCH TWICE.</text>`);
      later(() => { attr('doorPanel','opacity',0); attr('warmRoom','opacity',1); }, 900);
      later(() => { attr('doorPanel','opacity',1); attr('warmRoom','opacity',0); }, 2050);
      later(() => { attr('coldRoom','opacity',1); attr('doorPanel','opacity',0); }, 2700);
    },

    haircut_mirror() {
      svg(`<rect width="360" height="520" fill="#c6b6a7"/><rect y="390" width="360" height="130" fill="#6e5a4d"/>
        <rect x="210" y="55" width="120" height="260" rx="8" fill="#504942"/><rect x="218" y="63" width="104" height="244" fill="#cbd1d4"/>
        <g class="entity"><circle cx="112" cy="252" r="36" fill="#d6b293"/><path id="realHair" d="M78 244 Q112 197 147 243 L140 226 Q110 189 83 222 Z" fill="#3e3029"/><rect x="80" y="286" width="64" height="112" rx="22" fill="#4f657c"/></g>
        <g class="entity"><circle cx="270" cy="200" r="31" fill="#cda98d"/><path id="mirrorHair" d="M241 194 Q270 154 300 193 L294 177 Q268 145 245 173 Z" fill="#3e3029"/><rect x="244" y="231" width="52" height="76" rx="18" fill="#596c81"/></g>
        <text x="22" y="46" fill="#3e332d" opacity=".68" font-size="13">WATCH THE HAIRCUT</text>`);
      later(() => attr('mirrorHair','d','M242 190 Q270 176 298 190 L294 178 Q270 169 246 180 Z'), 1650);
    },

    extra_shadow() {
      svg(`<rect width="360" height="520" fill="#d1c6aa"/><rect y="365" width="360" height="155" fill="#9a8064"/>
        <circle cx="180" cy="128" r="38" fill="#f0c96a" opacity=".75"/>
        <g class="entity"><circle cx="112" cy="275" r="20" fill="#454b56"/><rect x="94" y="296" width="36" height="78" rx="14" fill="#586171"/><circle cx="235" cy="278" r="20" fill="#554a45"/><rect x="217" y="299" width="36" height="76" rx="14" fill="#6e5e55"/></g>
        <path d="M113 371 L66 455 L145 455 Z" fill="#413b35" opacity=".55"/><path d="M235 374 L190 455 L270 455 Z" fill="#413b35" opacity=".55"/>
        <path id="thirdShadow" class="entity" d="M174 360 L143 455 L215 455 Z" fill="#171615" opacity="0"/>
        <text x="22" y="46" fill="#3b3328" opacity=".68" font-size="13">COUNT THE SHADOWS</text>`);
      later(() => attr('thirdShadow','opacity','.72'), 1550);
    },

    wrong_occlusion: undefined
  };

  // Restore renderer overwritten by the duplicate guard above if needed.
  renderers.wrong_occlusion = function() {
    svg(`<rect width="360" height="520" fill="#c9d0c3"/><rect y="385" width="360" height="135" fill="#887961"/>
      <g id="catBody" class="entity"><ellipse cx="82" cy="330" rx="38" ry="28" fill="#515660"/><circle cx="106" cy="298" r="21" fill="#515660"/><path d="M92 281 L98 258 L110 282 M110 282 L125 261 L124 289" fill="#515660"/></g>
      <g id="chair" class="entity"><rect x="158" y="245" width="92" height="115" rx="12" fill="#6f5144"/><rect x="170" y="360" width="14" height="82" fill="#5b4037"/><rect x="225" y="360" width="14" height="82" fill="#5b4037"/></g>
      <path id="tail" class="entity" d="M50 331 Q20 315 28 286" fill="none" stroke="#515660" stroke-width="15" stroke-linecap="round"/>
      <text x="22" y="46" fill="#30362f" opacity=".65" font-size="13">WATCH THE CAT</text>`);
    later(() => { attr('catBody','transform','translate(45 0)'); attr('tail','transform','translate(45 0)'); }, 700);
    later(() => { attr('catBody','transform','translate(90 0)'); attr('tail','transform','translate(90 0)'); }, 1300);
    later(() => { attr('catBody','transform','translate(125 0)'); attr('tail','transform','translate(125 0)'); }, 1900);
  };

  const replays = {
    shadow_desync(){ attr('shadow','d','M126 347 C168 340 220 330 276 316 L296 255 L315 262 L286 342 C218 356 166 364 126 367 Z'); },
    mirror_desync(){ attr('realNose','cx',88); attr('realEye1','cx',83); attr('realEye2','cx',92); attr('mirrorNose','cx',278); attr('mirrorEye1','cx',270); attr('mirrorEye2','cx',281); },
    domino_prediction(){ for(let i=0;i<5;i++) setDominoFlat(i); for(let i=5;i<10;i++) setDominoStanding(i); },
    wrong_light_switch(){ attr('toggle','y',320); attr('rightBulb','fill','#ffe89a'); attr('rightGlow','opacity','.28'); },
    color_theft(){ attr('ballLeft','opacity',0); attr('vase','fill','#d84b45'); attr('ballRight','opacity',1); },
    wrong_occlusion(){ attr('catBody','transform','translate(125 0)'); attr('tail','transform','translate(125 0)'); },
    reverse_splash(){ attr('splash','opacity',1); attr('drops','opacity',1); attr('ball','cy',342); },
    door_two_rooms(){ attr('doorPanel','opacity',0); attr('warmRoom','opacity',0); attr('coldRoom','opacity',1); },
    haircut_mirror(){ attr('mirrorHair','d','M242 190 Q270 176 298 190 L294 178 Q270 169 246 180 Z'); },
    extra_shadow(){ attr('thirdShadow','opacity','.72'); }
  };

  function reveal(level) {
    clearScheduled();
    hotspot.classList.add('reveal');
    const focus = scene.querySelector(level.focusSelector);
    scene.querySelectorAll('.entity').forEach(el => el.classList.add('dim'));
    focus?.classList.remove('dim');
    focus?.classList.add('glow');
    feedback.textContent = level.revealText;
    feedback.className = 'feedback good';
    nextBtn.hidden = false;
    replays[level.mechanic]?.();
    emit('reveal_shown', { mechanic: level.mechanic });
  }

  function startCountdown(level) {
    const start = performance.now();
    timer.textContent = '5';
    countdownId = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((level.durationMs - (performance.now() - start)) / 1000));
      timer.textContent = String(remaining);
      if (remaining <= 0) {
        clearInterval(countdownId); countdownId = null;
        if (!solved) {
          solved = true;
          streak = 0;
          streakEl.textContent = 'STREAK 0';
          emit('timeout');
          reveal(level);
        }
      }
    }, 100);
  }

  function loadLevel(newIndex) {
    clearScheduled();
    index = ((newIndex % levels.length) + levels.length) % levels.length;
    solved = false;
    feedback.textContent = '';
    feedback.className = 'feedback';
    nextBtn.hidden = true;
    hotspot.classList.remove('reveal');
    const level = levels[index];
    prompt.textContent = level.hook;
    setHotspot(level.hotspot);
    renderers[level.mechanic]();
    startCountdown(level);
    emit('level_start', { mechanic: level.mechanic, family: level.telemetry.family });
  }

  hotspot.addEventListener('click', event => {
    event.stopPropagation();
    if (solved) return;
    solved = true;
    streak += 1;
    streakEl.textContent = 'STREAK ' + streak;
    emit('correct_tap', { streak });
    reveal(levels[index]);
  });

  tapLayer.addEventListener('click', event => {
    if (solved) return;
    const r = sceneWrap.getBoundingClientRect();
    const x = (event.clientX-r.left)/r.width;
    const y = (event.clientY-r.top)/r.height;
    streak = 0; streakEl.textContent = 'STREAK 0';
    feedback.textContent = 'NO — LOOK AGAIN.'; feedback.className = 'feedback bad';
    emit('wrong_tap', { x:+x.toFixed(3), y:+y.toFixed(3) });
    later(() => { if(!solved) feedback.textContent=''; }, 650);
  });

  nextBtn.addEventListener('click', () => loadLevel(index+1));

  if (!levels.length) {
    prompt.textContent='NO LEVELS LOADED'; timer.textContent='—';
    return;
  }

  const params = new URLSearchParams(location.search);
  const requested = Number.parseInt(params.get('level') || '0',10);
  loadLevel(Number.isFinite(requested) ? requested : 0);
  const revealAt = Number.parseInt(params.get('revealAt') || '-1',10);
  if (Number.isFinite(revealAt) && revealAt >= 0) later(() => hotspot.click(), revealAt);
})();
