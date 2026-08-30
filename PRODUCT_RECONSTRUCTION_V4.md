# Something Is Strange — Product Reconstruction V4

## Why V3 is not automatically accepted
The previous physical-phone failure is authoritative evidence that a technically correct hotspot game can still feel non-interactive, rushed, and incomprehensible. V3 repairs that interaction contract, but this document deliberately assumes the deeper product hypothesis may still be wrong.

## Three competing loop models

### A — Phase-led hotspot (V3)
`WATCH -> TAP NOW -> tap anomaly -> reveal`

Strengths: explicit, testable, accessible.
Weakness: UI teaches the puzzle instead of the scene teaching the player; WATCH/TAP NOW can feel like operating a test harness.
Verdict: useful onboarding/training mode, not preferred long-term core.

### B — Continuous anomaly hunt
`scene starts alive -> normal motion establishes expectation -> impossible event happens -> player taps it at any time -> immediate spatial feedback`

Strengths: closest to a TikTok-native visual experience; no artificial phase switch; the scene remains the product.
Weakness: early taps need interpretation; missed temporal events require replay.
Verdict: PRIMARY CORE LOOP.

### C — Prediction / commit
`show setup -> player predicts what should happen / where failure will occur -> event resolves -> reward prediction`

Strengths: deeper agency and stronger dopamine when correct.
Weakness: raises cognitive load, requires more UI, does not fit every anomaly family.
Verdict: secondary mechanic family for Domino/door/causal puzzles, not onboarding.

## V4 core decision
The playable game should converge toward **B with a very light onboarding affordance from A**.

First puzzle:
- scene immediately moves;
- one compact instruction only: `SPOT THE IMPOSSIBLE. TAP IT.`;
- no countdown;
- no WATCH/TAP NOW phase pill;
- taps are accepted throughout the scene;
- tapping before the anomaly is visible produces a local ripple plus `KEEP WATCHING — IT HASN'T HAPPENED YET.`;
- once anomaly exists, correct tap freezes/highlights it and explains in one sentence;
- wrong tap produces local visible feedback without resetting the scene;
- replay is always available after the temporal event;
- next is unmistakable after solve.

Later puzzles:
- same continuous contract;
- optional soft time pressure only after comprehension is externally proven; no timer in the next physical build.

## Level survival audit
A level survives only if the anomaly can be understood from the picture/motion itself before reading the explanation.

### KEEP / lead set
1. **Extra Shadow** — strongest immediate visual arithmetic: two people, three shadows.
2. **Wrong Light Switch** — clear cause/effect and obvious spatial target.
3. **Shadow Ahead** — distinctive/creepy, but must have high-quality continuous person+shadow motion.
4. **Early Splash** — clear effect-before-cause if ball and splash remain simultaneously visible.
5. **Color Theft** — clear transformation if red trajectory is smooth and vase change is held.

### CONDITIONAL / must earn survival
6. **Domino Break** — good prediction mechanic, but small target and chain readability need device proof.
7. **Door Two Rooms** — concept is strong but memory burden is high; first/second room contrast must be extreme.
8. **Wrong Mirror** — survives only if gaze difference reads instantly at phone size without explanatory copy.

### REJECT from next physical comprehension build unless materially rebuilt
9. **Haircut Mirror** — too dependent on comparing two small hair silhouettes; weak first-view salience.
10. **Wrong Occlusion** — depth-order anomaly is visually subtle and cognitively expensive on a small phone.

The next phone candidate should therefore be a **5-level comprehension slice**, not a 10-level content dump. The rejected/conditional levels remain useful R&D inventory but must not dilute the first-run test.

## Visual-quality gate
Prototype-grade geometric SVG is acceptable only where it makes the causal relation clearer. It is not acceptable merely because it is cheap.

Required for the 5-level slice:
- one dominant focal event per scene;
- no explanatory labels embedded inside the scene unless they are diegetic;
- subject silhouettes readable at 360 logical px;
- normal motion must look intentional, not like discrete coordinate jumps;
- anomaly transition must be 250–700 ms where motion is meant to be perceived, or deliberately instantaneous when impossibility is the point;
- at least 1.5 s post-anomaly hold before any automatic reset;
- target remains visually present while player decides;
- no timer competing with the focal event;
- no phase pill competing with the focal event;
- feedback occurs at the tap position within the same rendered frame/next frame;
- reveal highlight points to the exact object, never a generic scene border.

## Architecture boundaries
`LEVEL DATA -> PLAYABLE ENGINE -> RENDERER`

Separate opt-in modules:
`CREATIVE CAPTURE`
`LAB INSTRUMENTATION`

Rules:
- launcher has no creative/lab flags;
- playable behavior cannot depend on lab probe;
- acquisition creative cannot mutate playable state-machine copy/timing;
- evidence hooks may observe state but cannot create the state they claim to prove;
- source SHA embedded/proven in Android artifact pipeline;
- physical gate must include black-box taps that do not use hotspot coordinates from the DOM/probe.

## Pre-phone kill criteria
Do not give the owner another APK merely because CI is green. Before a new physical build:
1. five-level slice passes machine state/interaction tests;
2. black-box Android launch has no lab instrumentation;
3. at least first puzzle is solved through a visually discovered target path, not probe coordinates;
4. every physical tap has visible evidence;
5. all five level animations are human-reviewed from device screenshots/video;
6. no level requires explanation text to understand what visually changed;
7. no acquisition-mode regression;
8. exact branch source SHA = APK provenance SHA.

If these cannot be demonstrated cheaply, stop and redesign rather than adding more instructions.