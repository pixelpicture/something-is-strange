(() => {
  const log = (...parts) => console.info('[SIS_LAB]', ...parts);
  const hotspot = document.getElementById('hotspot');
  const tapLayer = document.getElementById('tapLayer');
  const nextBtn = document.getElementById('nextBtn');
  const scene = document.getElementById('scene');
  const feedback = document.getElementById('feedback');
  const prompt = document.getElementById('prompt');
  const streak = document.getElementById('streak');
  const timer = document.getElementById('timer');
  const params = new URLSearchParams(location.search);
  let reportTimer = 0;

  function centerPx(el) {
    const r = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return [
      Math.round((r.left + r.width / 2) * dpr),
      Math.round((r.top + r.height / 2) * dpr)
    ];
  }

  function mechanic() {
    if (scene.querySelector('#mirrorFace')) return 'mirror_desync';
    if (scene.querySelector('#d5')) return 'domino_prediction';
    if (scene.querySelector('#rightLamp')) return 'wrong_light_switch';
    if (scene.querySelector('#shadowAcq')) return 'shadow_acquisition';
    if (scene.querySelector('#shadow')) return 'shadow_desync';
    return 'unknown';
  }

  function reportState(label) {
    const [x, y] = centerPx(hotspot);
    log(label, mechanic(), x, y, 'DPR', window.devicePixelRatio || 1,
        'SCENE_CHILDREN', scene.childElementCount, 'PROMPT', prompt.textContent.trim(),
        'STREAK', streak.textContent.trim(), 'TIMER_DISPLAY', getComputedStyle(timer).display);
  }

  function scheduleState(label) {
    clearTimeout(reportTimer);
    reportTimer = setTimeout(() => reportState(label), 80);
  }

  hotspot.addEventListener('click', () => {
    log('EVENT', 'HOTSPOT_CLICK');
    setTimeout(() => log('STATE', streak.textContent.trim(), feedback.textContent.trim()), 60);
  });
  tapLayer.addEventListener('click', () => {
    log('EVENT', 'WRONG_TAP');
    setTimeout(() => log('STATE', streak.textContent.trim(), feedback.textContent.trim()), 60);
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
