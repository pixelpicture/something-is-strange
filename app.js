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
    const record = {
      event: name,
      ts: Math.round(performance.now() - sessionStartedAt),
      level: levels[index]?.id,
      ...payload
    };
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

  function setHotspot(h) {
    hotspot.style.left = h.x + '%';
    hotspot.style.top = h.y + '%';
    hotspot.style.width = h.w + '%';
    hotspot.style.height = h.h + '%';
  }

  function animate(el, keyframes, options) {
    if (!el) return;
    el.animate(keyframes, { fill: 'forwards', ...options });
  }

  const renderers = {
    shadow_desync() {
      svg(`
        <defs>
          <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27324a"/><stop offset="1" stop-color="#11151e"/></linearGradient>
        </defs>
        <rect width="360" height="520" fill="url(#night)"/>
        <rect x="0" y="350" width="360" height="170" fill="#17191f"/>
        <rect x="272" y="82" width="88" height="268" fill="#343847"/>
        <rect x="282" y="96" width="78" height="254" fill="#20232c"/>
        <circle cx="70" cy="286" r="7" fill="#f7e7b0" opacity=".9"/>
        <path id="shadow" d="M126 347 C168 340 219 330 276 316 L286 342 C218 356 166 364 126 367 Z" fill="#050607" opacity=".82"/>
        <g id="walker" class="entity">
          <circle cx="118" cy="285" r="17" fill="#d8dbe4"/>
          <rect x="103" y="302" width="31" height="58" rx="13" fill="#aeb5c6"/>
          <line x1="111" y1="356" x2="102" y2="408" stroke="#aeb5c6" stroke-width="11" stroke-linecap="round"/>
          <line x1="126" y1="356" x2="137" y2="408" stroke="#aeb5c6" stroke-width="11" stroke-linecap="round"/>
        </g>
        <text x="22" y="46" fill="#fff" opacity=".6" font-size="13">WATCH THE CORNER</text>
      `);
      animate(q('walker'), [{ transform: 'translateX(0px)' }, { transform: 'translateX(130px)' }], { duration: 4300, easing: 'linear' });
      animate(q('shadow'), [
        { transform: 'translateX(0px) skewX(0deg)' },
        { transform: 'translateX(65px) skewX(-4deg)', offset: .46 },
        { transform: 'translate(110px,-40px) rotate(-31deg) scaleX(.82)', offset: .68 },
        { transform: 'translate(135px,-62px) rotate(-42deg) scaleX(.64)' }
      ], { duration: 3600, easing: 'linear' });
    },

    mirror_desync() {
      svg(`
        <defs><linearGradient id="room" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9d2c8"/><stop offset="1" stop-color="#8f9198"/></linearGradient></defs>
        <rect width="360" height="520" fill="url(#room)"/>
        <rect x="197" y="72" width="126" height="260" rx="9" fill="#353943"/>
        <rect x="205" y="80" width="110" height="244" rx="5" fill="#bfc7ce" opacity=".72"/>
        <g id="realBody"><rect x="67" y="298" width="74" height="118" rx="25" fill="#3c465e"/><circle id="realHead" class="entity" cx="104" cy="267" r="35" fill="#d8b79d"/><path d="M77 252 Q104 213 132 251" fill="#3a2c27"/></g>
        <g id="mirrorBody" opacity=".9"><rect x="222" y="242" width="69" height="82" rx="23" fill="#4e5870"/><circle id="mirrorHead" class="entity" cx="257" cy="213" r="32" fill="#cfaf98"/><path d="M232 198 Q257 165 283 198" fill="#40322d"/></g>
        <circle id="realNose" cx="115" cy="269" r="4" fill="#6c4c3d"/><circle id="mirrorNose" cx="267" cy="215" r="4" fill="#6c4c3d"/>
        <text x="22" y="46" fill="#20242c" opacity=".65" font-size="13">DON'T BLINK</text>
      `);
      later(() => {
        animate(q('realHead'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(28deg)' }], { duration: 220, easing: 'ease-out' });
        animate(q('realNose'), [{ transform: 'translate(0,0)' }, { transform: 'translate(-17px,5px)' }], { duration: 220, easing: 'ease-out' });
      }, 1450);
      later(() => {
        animate(q('mirrorHead'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-28deg)' }], { duration: 220, easing: 'ease-out' });
        animate(q('mirrorNose'), [{ transform: 'translate(0,0)' }, { transform: 'translate(16px,5px)' }], { duration: 220, easing: 'ease-out' });
      }, 2300);
    },

    domino_prediction() {
      svg(`
        <rect width="360" height="520" fill="#dad2be"/>
        <rect x="0" y="372" width="360" height="148" fill="#a99878"/>
        <path d="M18 372 Q180 330 342 372" fill="none" stroke="#8d7b5d" stroke-width="4" opacity=".4"/>
        ${Array.from({ length: 10 }, (_, i) => `<rect id="d${i}" class="entity" x="${28 + i * 31}" y="300" width="13" height="72" rx="4" fill="${i===5 ? '#342d2b' : '#eee8dc'}" stroke="#6b6258" stroke-width="2"/>`).join('')}
        <text x="22" y="46" fill="#302c29" opacity=".68" font-size="13">PICK THE BREAK POINT</text>
      `);
      for (let i = 0; i < 10; i++) {
        if (i === 5) continue;
        const start = i < 5 ? 550 + i * 285 : 2800 + (i - 6) * 260;
        later(() => animate(q('d' + i), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(76deg) translate(14px,7px)' }], { duration: 260, easing: 'ease-in' }), start);
      }
      later(() => q('d5')?.classList.add('glow'), 2100);
    }
  };

  function reveal(level) {
    hotspot.classList.add('reveal');
    scene.querySelectorAll('.entity').forEach(el => el.classList.add('dim'));
    const special = level.mechanic === 'shadow_desync' ? q('shadow') : level.mechanic === 'mirror_desync' ? q('mirrorHead') : q('d5');
    special?.classList.remove('dim');
    special?.classList.add('glow');
    feedback.textContent = 'THERE.';
    feedback.className = 'feedback good';
    nextBtn.hidden = false;
    emit('reveal_shown', { mechanic: level.mechanic });
  }

  function startCountdown(level) {
    const start = performance.now();
    timer.textContent = '5';
    countdownId = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((level.durationMs - (performance.now() - start)) / 1000));
      timer.textContent = String(remaining);
      if (remaining <= 0) {
        clearInterval(countdownId);
        countdownId = null;
        if (!solved) {
          emit('timeout');
          feedback.textContent = 'TIME. FIND IT.';
          feedback.className = 'feedback bad';
          reveal(level);
        }
      }
    }, 100);
  }

  function loadLevel(newIndex) {
    clearScheduled();
    index = newIndex % levels.length;
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

  hotspot.addEventListener('click', (event) => {
    event.stopPropagation();
    if (solved) return;
    solved = true;
    streak += 1;
    streakEl.textContent = 'STREAK ' + streak;
    feedback.textContent = 'YES.';
    feedback.className = 'feedback good';
    emit('correct_tap', { streak });
    reveal(levels[index]);
  });

  tapLayer.addEventListener('click', (event) => {
    if (solved) return;
    const r = sceneWrap.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width;
    const y = (event.clientY - r.top) / r.height;
    streak = 0;
    streakEl.textContent = 'STREAK 0';
    feedback.textContent = 'NO — LOOK AGAIN.';
    feedback.className = 'feedback bad';
    emit('wrong_tap', { x: +x.toFixed(3), y: +y.toFixed(3) });
    later(() => { if (!solved) feedback.textContent = ''; }, 650);
  });

  nextBtn.addEventListener('click', () => loadLevel(index + 1));

  if (!levels.length) {
    prompt.textContent = 'NO LEVELS LOADED';
    timer.textContent = '—';
  } else {
    loadLevel(0);
  }
})();
