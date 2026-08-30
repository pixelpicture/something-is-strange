# Human Review Gate V1

Machine PASS is not a product PASS. Review the generated evidence artifact before any physical candidate is declared.

For each of the three rounds inspect `before`, `anomaly`, `after`, and `tap-coverage` frames at phone scale.

Required human checks:
1. **Instant scene read** — the normal scene is understandable without reading implementation notes.
2. **Impossible event read** — the anomaly is visible as an event, not only inferable from metadata.
3. **Fair semantic tap** — every visibly reasonable part of the intended answer is covered by the translucent semantic overlay; irrelevant nearby regions are not broadly covered.
4. **No rectangular-hotspot regression** — coverage should follow the visible answer shape or a deliberately expanded semantic contour.
5. **Causal timing** — Early Splash visibly occurs before contact; Color Theft baseline visibly precedes the transfer; Extra Shadow has an ownerless full cast shadow.
6. **Commercial visual quality** — machine-generated placeholder art must not be called final or production-beautiful. A human must explicitly accept recognizability and quality before physical distribution.
7. **Continuation value** — the playable result screen must visibly present Perception Score, rank, average reaction, false taps, best score and an obvious `BEAT YOUR BEST` action.

Verdict vocabulary:
- `PASS` — physically/human verified.
- `HOLD` — mechanically plausible but insufficient evidence or visual quality.
- `FAIL` — concrete comprehension/fairness/product defect.

The current deterministic PNG generator is evidence infrastructure and a cheap art placeholder. It is not a substitute for a final art direction review.