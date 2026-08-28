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

  function dpr() { return window.devicePixelRatio || 1; }

  function centerPx(el) {
    const r = el.getBoundingClientRect();
    const scale = dpr();
    return [
      Math.round((r.left + r.width / 2) * scale),
      Math.round((r.top + r.height / 2) * scale)
    ];
  }

  function rectPx(el) {
    const r = el.getBoundingClientRect();
    const scale = dpr();
    return {
      left: Math.round(r.left * scale), top: Math.round(r.top * scale),
      right: Math.round(r.right * scale), bottom: Math.round(r.bottom * scale)
    };
  }

  function mechanic() {
    if (scene.querySelector('#mirrorFace')) return 'mirror_desync';
    if (scene.querySelector('#d5')) return 'domino_prediction';
    if (scene.querySelector('#rightLamp')) return 'wrong_light_switch';
    if (scene.querySelector('#shadowAcq')) return 'shadow_acquisition';
    if (scene.querySelector('#shadow')) return 'shadow_desync';
    return 'unknown';
  }

  function safeWrongPoint() {
    const s = rectPx(sceneWrap);
    const h = rectPx(hotspot);
    const padX = Math.max(24, Math.round((s.right - s.left) * 0.12));
    const padY = Math.max(24, Math.round((s.bottom - s.top) * 0.12));
    const candidates = [
      [s.left + padX, s.top + padY],
      [s.right - padX, s.top + padY],
      [s.left + padX, s.bottom - padY],
      [s.right - padX, s.bottom - padY]
    ];
    const margin = 16;
    return candidates.find(([x,y]) => x < h.left-margin || x > h.right+margin || y < h.top-margin || y > h.bottom+margin) || candidates[0];
  }

  function reportState(label) {
    const [x, y] = centerPx(hotspot);
    const [wx, wy] = safeWrongPoint();
    log(label, mechanic(), x, y, 'WRONG', wx, wy, 'DPR', dpr(),
        'SCENE_CHILDREN', scene.childElementCount, 'PROMPT', prompt.textContent.trim(),
        'STREAK', streak.textContent.trim(), 'TIMER_DISPLAY', getComputedStyle(timer).display);
  }

  function scheduleState(label) {
    clearTimeout(reportTimer);
    reportTimer = setTimeout(() => reportState(label), 80);
  }

  function visualReady(kind) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const fr = rectPx(feedback);
      const nr = rectPx(nextBtn);
      log('VISUAL_READY', kind, 'FEEDBACK', feedback.textContent.trim(),
          'FB', fr.left, fr.top, fr.right, fr.bottom,
          'NEXT_HIDDEN', nextBtn.hidden ? 'true' : 'false',
          'NEXT', nr.left, nr.top, nr.right, nr.bottom,
          'STREAK', streak.textContent.trim());
    }));
  }

  hotspot.addEventListener('click', () => {
    log('EVENT', 'HOTSPOT_CLICK');
    setTimeout(() => log('STATE', streak.textContent.trim(), feedback.textContent.trim()), 60);
    visualReady('CORRECT');
  });
  tapLayer.addEventListener('click', () => {
    log('EVENT', 'WRONG_TAP');
    setTimeout(() => log('STATE', streak.textContent.trim(), feedback.textContent.trim()), 60);
    visualReady('WRONG');
  });
  nextBtn.addEventListener('click', () => log('EVENT', 'NEXT_TAP'));

  new MutationObserver(() => {
    if (!nextBtn.hidden) {
      const [x, y] = centerPx(nextBtn);
      log('NEXT', x, y);
    }
  }).observe(nextBtn, { attributes: true, attributeFilter: ['hidden'] });

  new MutationObserver(() => {
    const text = feedback.textContent.trim();
    if (text) log('FEEDBACK', text);
  }).observe(feedback, { childList: true, characterData: true, subtree: true });

  new MutationObserver(() => scheduleState('SCENE')).observe(scene, { childList: true, subtree: true });
  new MutationObserver(() => scheduleState('HOTSPOT')).observe(hotspot, { attributes: true, attributeFilter: ['style'] });

  requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => reportState('READY'), 80)));
})();
