(() => {
  const scene = document.getElementById('scene');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  let revealGeneration = 0;

  const later = (gen, fn, ms) => setTimeout(() => {
    if (gen === revealGeneration) fn();
  }, ms);

  function cancelAnimations(el) {
    el?.getAnimations?.().forEach(animation => animation.cancel());
    el?.style?.removeProperty('transform');
  }

  function replayShadow(gen) {
    const shadow = scene.querySelector('#shadow');
    if (!shadow) return;
    cancelAnimations(shadow);
    const normal = 'M126 347 C168 340 219 330 276 316 L286 342 C218 356 166 364 126 367 Z';
    const ahead = 'M126 347 C168 340 220 330 276 316 L296 255 L315 262 L286 342 C218 356 166 364 126 367 Z';
    shadow.setAttribute('d', normal);
    later(gen, () => shadow.setAttribute('d', ahead), 220);
    later(gen, () => shadow.setAttribute('d', normal), 760);
    later(gen, () => shadow.setAttribute('d', ahead), 980);
  }

  function replayMirror(gen) {
    const realNose = scene.querySelector('#realNose');
    const mirrorNose = scene.querySelector('#mirrorNose');
    [scene.querySelector('#realHead'), scene.querySelector('#mirrorHead'), realNose, mirrorNose].forEach(cancelAnimations);

    realNose?.setAttribute('cx', '115');
    mirrorNose?.setAttribute('cx', '267');
    scene.querySelector('#realEye1')?.setAttribute('cx', '94');
    scene.querySelector('#realEye2')?.setAttribute('cx', '106');
    scene.querySelector('#mirrorEye1')?.setAttribute('cx', '248');
    scene.querySelector('#mirrorEye2')?.setAttribute('cx', '260');

    later(gen, () => {
      realNose?.setAttribute('cx', '88');
      scene.querySelector('#realEye1')?.setAttribute('cx', '83');
      scene.querySelector('#realEye2')?.setAttribute('cx', '92');
    }, 220);
    later(gen, () => {
      mirrorNose?.setAttribute('cx', '278');
      scene.querySelector('#mirrorEye1')?.setAttribute('cx', '270');
      scene.querySelector('#mirrorEye2')?.setAttribute('cx', '281');
    }, 820);
  }

  function setDominoStanding(el, i) {
    if (!el) return;
    cancelAnimations(el);
    el.removeAttribute('transform');
    el.setAttribute('x', String(28 + i * 31));
    el.setAttribute('y', '300');
    el.setAttribute('width', '13');
    el.setAttribute('height', '72');
  }

  function setDominoFlat(el, i) {
    if (!el) return;
    cancelAnimations(el);
    el.removeAttribute('transform');
    el.setAttribute('x', String(21 + i * 31));
    el.setAttribute('y', '359');
    el.setAttribute('width', '29');
    el.setAttribute('height', '13');
  }

  function replayDomino(gen) {
    for (let i = 0; i < 5; i += 1) setDominoStanding(scene.querySelector('#d' + i), i);
    for (let i = 0; i < 5; i += 1) {
      later(gen, () => setDominoFlat(scene.querySelector('#d' + i), i), 180 + i * 105);
    }
  }

  function polishReveal() {
    if (nextBtn.hidden) return;
    revealGeneration += 1;
    const gen = revealGeneration;

    if (scene.querySelector('#shadow')) {
      feedback.textContent = 'THE SHADOW TURNED FIRST.';
      replayShadow(gen);
    } else if (scene.querySelector('#realHead')) {
      feedback.textContent = 'THE REFLECTION WAS LATE.';
      replayMirror(gen);
    } else if (scene.querySelector('#d5')) {
      feedback.textContent = 'THE CHAIN STOPS HERE.';
      replayDomino(gen);
    }
  }

  new MutationObserver(polishReveal).observe(nextBtn, {
    attributes: true,
    attributeFilter: ['hidden']
  });
})();
