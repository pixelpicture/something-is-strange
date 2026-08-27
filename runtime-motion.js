(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const scene = document.getElementById('scene');
  const nextBtn = document.getElementById('nextBtn');
  let generation = 0;

  const timer = (gen, fn, ms) => setTimeout(() => {
    if (gen === generation) fn();
  }, ms);

  function circle(id, cx, cy, r = 3.3) {
    const el = document.createElementNS(NS, 'circle');
    el.id = id;
    el.setAttribute('cx', cx);
    el.setAttribute('cy', cy);
    el.setAttribute('r', r);
    el.setAttribute('fill', '#49362f');
    return el;
  }

  function patchShadow(gen) {
    const shadow = scene.querySelector('#shadow');
    if (!shadow) return;
    const normal = shadow.getAttribute('d');
    const ahead = 'M126 347 C168 340 220 330 276 316 L296 255 L315 262 L286 342 C218 356 166 364 126 367 Z';
    timer(gen, () => shadow.setAttribute('d', ahead), 1750);
    timer(gen, () => shadow.setAttribute('d', normal), 4050);
  }

  function patchMirror(gen) {
    const realHead = scene.querySelector('#realHead');
    const mirrorHead = scene.querySelector('#mirrorHead');
    if (!realHead || !mirrorHead) return;

    const realBody = scene.querySelector('#realBody');
    const mirrorBody = scene.querySelector('#mirrorBody');
    realBody?.append(circle('realEye1', 94, 260));
    realBody?.append(circle('realEye2', 106, 260));
    mirrorBody?.append(circle('mirrorEye1', 248, 207));
    mirrorBody?.append(circle('mirrorEye2', 260, 207));

    const realNose = scene.querySelector('#realNose');
    const mirrorNose = scene.querySelector('#mirrorNose');
    timer(gen, () => {
      realNose?.setAttribute('cx', '88');
      scene.querySelector('#realEye1')?.setAttribute('cx', '83');
      scene.querySelector('#realEye2')?.setAttribute('cx', '92');
    }, 1450);
    timer(gen, () => {
      mirrorNose?.setAttribute('cx', '278');
      scene.querySelector('#mirrorEye1')?.setAttribute('cx', '270');
      scene.querySelector('#mirrorEye2')?.setAttribute('cx', '281');
    }, 2300);
  }

  function patchDomino(gen) {
    const d5 = scene.querySelector('#d5');
    if (!d5) return;
    d5.setAttribute('fill', '#eee8dc');

    const classGuard = new MutationObserver(() => {
      if (nextBtn?.hidden && d5.classList.contains('glow')) d5.classList.remove('glow');
    });
    classGuard.observe(d5, { attributes: true, attributeFilter: ['class'] });
    timer(gen, () => classGuard.disconnect(), 5200);

    for (let i = 0; i < 5; i += 1) {
      const el = scene.querySelector('#d' + i);
      const pivotX = 28 + i * 31 + 6.5;
      timer(gen, () => el?.setAttribute('transform', `rotate(72 ${pivotX} 372)`), 810 + i * 285);
    }
  }

  function patchCurrentScene() {
    generation += 1;
    const gen = generation;
    if (scene.querySelector('#shadow')) patchShadow(gen);
    if (scene.querySelector('#realHead')) patchMirror(gen);
    if (scene.querySelector('#d5')) patchDomino(gen);
  }

  const observer = new MutationObserver(() => queueMicrotask(patchCurrentScene));
  observer.observe(scene, { childList: true });
  patchCurrentScene();
})();
