(() => {
  const scene = document.getElementById('scene');
  const nextBtn = document.getElementById('nextBtn');
  let generation = 0;

  function currentGeneration() { return generation; }
  function later(gen, fn, ms) { setTimeout(() => { if (gen === generation) fn(); }, ms); }
  function q(id) { return scene.querySelector('#' + id); }

  function makeOcclusionExplicit(gen) {
    const tail = q('tail');
    if (!tail) return;
    later(gen, () => {
      const activeTail = q('tail');
      if (!activeTail) return;
      activeTail.setAttribute('transform', 'translate(0 0)');
      activeTail.setAttribute('d', 'M150 334 Q190 292 232 278');
      activeTail.setAttribute('stroke-width', '17');
    }, 1920);
  }

  function addDoorProof() {
    if (!q('warmRoom') || q('doorProof')) return;
    const NS = 'http://www.w3.org/2000/svg';
    const g = document.createElementNS(NS, 'g');
    g.id = 'doorProof';
    g.classList.add('entity');
    g.innerHTML = `
      <rect x="104" y="92" width="76" height="296" fill="#efc477"/>
      <circle cx="150" cy="137" r="22" fill="#fff3ad"/>
      <rect x="104" y="302" width="76" height="86" fill="#76a55f"/>
      <rect x="180" y="92" width="76" height="296" fill="#aac7dc"/>
      <circle cx="221" cy="137" r="22" fill="#eff8ff"/>
      <path d="M180 314 Q202 288 220 316 Q239 292 256 316 L256 388 L180 388 Z" fill="#eef5f8"/>
      <line x1="180" y1="92" x2="180" y2="388" stroke="#fff" stroke-width="4" opacity=".88"/>
      <text x="117" y="116" fill="#5c4c31" font-size="13" font-weight="800">FIRST</text>
      <text x="193" y="116" fill="#38556b" font-size="13" font-weight="800">SECOND</text>`;
    scene.appendChild(g);
  }

  function patchScene() {
    generation += 1;
    const gen = currentGeneration();
    if (q('tail') && q('chair')) makeOcclusionExplicit(gen);
  }

  new MutationObserver(() => queueMicrotask(patchScene)).observe(scene, { childList: true });
  new MutationObserver(() => {
    if (nextBtn.hidden) return;
    const gen = currentGeneration();
    if (q('tail') && q('chair')) {
      later(gen, () => {
        const tail = q('tail');
        if (!tail) return;
        tail.setAttribute('transform', 'translate(0 0)');
        tail.setAttribute('d', 'M150 334 Q190 292 232 278');
        tail.setAttribute('stroke-width', '17');
      }, 360);
    }
    if (q('warmRoom') && q('coldRoom')) later(gen, addDoorProof, 380);
  }).observe(nextBtn, { attributes: true, attributeFilter: ['hidden'] });

  patchScene();
})();
