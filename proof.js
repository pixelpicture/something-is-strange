(() => {
  const params = new URLSearchParams(location.search);
  const rawLevel = Number.parseInt(params.get('level') || '0', 10);
  const target = Number.isFinite(rawLevel) ? Math.max(0, rawLevel) : 0;
  const revealAt = Number.parseInt(params.get('revealAt') || '-1', 10);

  // CI/visual-proof helper only. The playable runtime still boots normally first.
  queueMicrotask(() => {
    const next = document.getElementById('nextBtn');
    for (let i = 0; i < target; i += 1) {
      next?.click();
    }

    if (Number.isFinite(revealAt) && revealAt >= 0) {
      setTimeout(() => document.getElementById('hotspot')?.click(), revealAt);
    }

    document.documentElement.dataset.proofLevel = String(target);
  });
})();
