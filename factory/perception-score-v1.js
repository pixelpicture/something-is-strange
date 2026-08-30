'use strict';

// Engine-independent scoring contract. No DOM, Cocos, TikTok or Android dependencies.
// Scores are intentionally transparent and do not claim population percentiles.

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function scoreRound(input) {
  const reactionMs = Math.max(0, Number(input.reactionMs || 0));
  const falseTaps = Math.max(0, Number(input.falseTaps || 0));
  const prematureTaps = Math.max(0, Number(input.prematureTaps || 0));
  const replays = Math.max(0, Number(input.replays || 0));
  const correct = Boolean(input.correct);
  if (!correct) return { score: 0, reactionScore: 0, penalties: 0 };

  // Full reaction credit <= 450ms, linearly decays to zero at 3000ms.
  const reactionScore = Math.round(clamp((3000 - reactionMs) / 2550, 0, 1) * 800);
  const accuracyBase = 200;
  const penalties = Math.min(500, falseTaps * 120 + prematureTaps * 60 + replays * 80);
  return {
    score: Math.max(0, accuracyBase + reactionScore - penalties),
    reactionScore,
    penalties
  };
}

function rankFor(total, rounds) {
  const max = Math.max(1, rounds) * 1000;
  const ratio = clamp(total / max, 0, 1);
  if (ratio >= 0.82) return 'UNCANNY';
  if (ratio >= 0.62) return 'SHARP';
  if (ratio >= 0.38) return 'ALERT';
  return 'UNAWARE';
}

function scoreSession(roundInputs) {
  const rounds = roundInputs.map(scoreRound);
  const total = rounds.reduce((sum, r) => sum + r.score, 0);
  return { total, rank: rankFor(total, rounds.length), rounds };
}

if (typeof module !== 'undefined') module.exports = { scoreRound, scoreSession, rankFor };
