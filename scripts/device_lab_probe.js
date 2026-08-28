(() => {
  const log = (...parts) => console.info('[SIS_LAB]', ...parts);
  const hotspot = document.getElementById('hotspot');
  const tapLayer = document.getElementById('tapLayer');
  const nextBtn = document.getElementById('nextBtn');
  const scene = document.getElementById('scene');
  const feedback = document.getElementById('feedback');
  const prompt = document.getElementById('prompt');
  const params = new URLSearchParams(location.search);

  function centerPx(el) {
    const r = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return [
      Math.round((r.left + r.width / 2) * dpr),
      Math.round((r.top + r.height / 2) * dpr)
    ];
  }

  function reportReady() {
    const [x, y] = centerPx(hotspot);
    log('READY', params.get('level') || '0', x, y, 'DPR', window.devicePixelRatio || 1,
        'SCENE_CHILDREN', scene.childElementCount, 'PROMPT', prompt.textContent.trim());
  }

  hotspot.addEventListener('click', () => log('EVENT', 'HOTSPOT_CLICK'));
  tapLayer.addEventListener('click', () => log('EVENT', 'WRONG_TAP'));
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

  requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(reportReady, 80)));
})();
