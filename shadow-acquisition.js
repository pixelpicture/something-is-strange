(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('creative') !== '1' || params.get('level') !== '0' || params.get('acq') !== '1') return;

  document.documentElement.classList.add('shadow-acq');
  const scene = document.getElementById('scene');
  const prompt = document.getElementById('prompt');
  const streak = document.getElementById('streak');
  const timer = document.getElementById('timer');

  prompt.textContent = 'WATCH HIS SHADOW.';
  streak.textContent = 'DON’T LOOK AWAY';
  timer.hidden = true;

  let observer;
  function patch() {
    if (scene.dataset.shadowAcqPatched === '1') return true;
    if (!scene.querySelector('#walker') || !scene.querySelector('#shadow')) return false;

    scene.dataset.shadowAcqPatched = '1';
    scene.innerHTML = `
      <defs>
        <linearGradient id="acqSky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#141b2a"/><stop offset="1" stop-color="#05070b"/></linearGradient>
        <radialGradient id="lampGlow"><stop stop-color="#ffe5a0" stop-opacity=".82"/><stop offset="1" stop-color="#ffe5a0" stop-opacity="0"/></radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="360" height="520" fill="url(#acqSky)"/>
      <rect y="360" width="360" height="160" fill="#080a0e"/>
      <path d="M0 360 L360 360 L360 520 L0 520 Z" fill="#10131a"/>
      <rect x="267" y="58" width="93" height="302" fill="#202632"/>
      <rect x="282" y="76" width="78" height="284" fill="#080a0e"/>
      <rect x="258" y="58" width="9" height="302" fill="#343b49"/>
      <circle cx="82" cy="233" r="78" fill="url(#lampGlow)" filter="url(#soft)" opacity=".6"/>
      <circle cx="82" cy="233" r="8" fill="#ffe7a9"/>
      <path id="shadowAcq" d="M126 359 C169 349 219 337 278 318 L288 346 C221 365 169 374 126 379 Z" fill="#010102" opacity=".96"/>
      <g id="walkerAcq" transform="translate(0 0)">
        <ellipse cx="124" cy="348" rx="27" ry="9" fill="#020204" opacity=".45"/>
        <circle cx="122" cy="277" r="20" fill="#c7c9cf"/>
        <path d="M103 272 Q121 241 141 271" fill="#292b31"/>
        <path d="M104 300 Q122 290 140 303 L143 362 L101 362 Z" fill="#596171"/>
        <path d="M106 357 L98 423" stroke="#444b58" stroke-width="13" stroke-linecap="round"/>
        <path d="M136 357 L147 423" stroke="#444b58" stroke-width="13" stroke-linecap="round"/>
        <path d="M104 312 L83 351" stroke="#596171" stroke-width="11" stroke-linecap="round"/>
        <path d="M138 312 L155 349" stroke="#596171" stroke-width="11" stroke-linecap="round"/>
      </g>
      <text x="24" y="46" fill="#fff" opacity=".62" font-size="12" letter-spacing="2">HE HASN'T REACHED THE CORNER</text>`;

    // The walker visibly advances toward the corner while the shadow stays
    // plausibly attached. Then the shadow turns the corner first.
    setTimeout(() => {
      scene.querySelector('#walkerAcq')?.setAttribute('transform', 'translate(14 0)');
      scene.querySelector('#shadowAcq')?.setAttribute('d', 'M140 359 C181 349 226 337 278 318 L288 346 C229 365 181 374 140 379 Z');
    }, 450);
    setTimeout(() => {
      scene.querySelector('#walkerAcq')?.setAttribute('transform', 'translate(28 0)');
      scene.querySelector('#shadowAcq')?.setAttribute('d', 'M154 359 C192 349 232 337 278 318 L288 346 C236 365 192 374 154 379 Z');
    }, 900);
    setTimeout(() => {
      scene.querySelector('#walkerAcq')?.setAttribute('transform', 'translate(38 0)');
      scene.querySelector('#shadowAcq')?.setAttribute('d', 'M164 359 C199 349 237 337 278 318 L288 346 C241 365 199 374 164 379 Z');
    }, 1300);
    setTimeout(() => {
      const shadow = scene.querySelector('#shadowAcq');
      if (!shadow) return;
      shadow.setAttribute('d', 'M164 359 C199 349 238 337 278 318 L291 250 L314 257 L288 346 C241 365 199 374 164 379 Z');
      scene.classList.add('shadow-wrong');
    }, 1350);

    observer?.disconnect();
    return true;
  }

  observer = new MutationObserver(() => {
    if (patch()) observer.disconnect();
  });
  observer.observe(scene, { childList: true });
  patch();
})();
