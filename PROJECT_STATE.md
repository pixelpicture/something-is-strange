# PROJECT_STATE

## Active BET
TikTok-Native Game Experiment Factory.

First physical candidate: **Something Is Strange**.

Broad GOLD MINE search remains frozen until this BET is physically validated or killed. TikTok Mini Games access remains treated as solved through ODDLINGS unless new evidence appears.

## Budget rule
Buy information, not architecture. Prefer zero-dependency/browser-native implementation, free CI, deterministic scene assets, no backend, no paid assets, no ad SDK, and no AI API unless it materially improves the active evidence gate.

## Core product architecture
Primary loop:
`continuous scene -> normal expectation -> impossible event -> tap -> immediate spatial feedback -> reveal/replay/next`

The previous phase-led/timer-heavy design was rejected by real-phone evidence. The current 5-level comprehension slice intentionally has no countdown and accepts taps throughout.

Canonical slice:
1. Extra Shadow
2. Wrong Light Switch
3. Shadow Ahead
4. Early Splash
5. Color Theft

Haircut Mirror and Wrong Occlusion remain rejected. Domino Break, Door Two Rooms, and Wrong Mirror remain R&D inventory only.

## Physical-phone result after V4 automated PASS
The first independent user phone test after automated V4 PASS produced a **visual/product HOLD**, not a release PASS.

Observed by the user:
- picture quality was very weak;
- in Wrong Light Switch, the object below the unlit lamp was not immediately recognizable;
- pacing felt roughly okay, with no strong evidence yet that timing itself was the current blocker.

Interpretation:
- weak art is **not** the intended mechanic;
- the game must not require decoding what ordinary objects are before detecting the anomaly;
- current pacing is frozen provisionally while visual readability is repaired;
- green CI remains insufficient evidence of product quality.

## Visual-language recovery V5
Goal: recognizable scene in ~1 second, impossible event in ~2 seconds, confident tap target by ~3 seconds, without explanation text doing the perceptual work.

Changes now in source:
- all five puzzles upgraded from bare geometric diagrams toward a coherent illustrated/stylized scene language;
- Extra Shadow now reads as a night park with streetlamp, bench, path, two people and physically grounded shadows;
- Wrong Light Switch now has two clear lamps, a large conventional wall-switch plate, visible conduit/relationship cue, and stronger wrong-lamp glow;
- Shadow Ahead now reads as an actual sidewalk/corner scene with a walking person and grounded perspective;
- Early Splash now reads as a backyard swimming-pool scene rather than a blue rectangle;
- Color Theft now reads as a tabletop/interior still life with a recognizable vase and ball;
- switch copy changed to `WATCH THE WALL SWITCH.` and `TAP THE LAMP THE SWITCH TURNED ON.`;
- anomaly timing itself was not accelerated or slowed as part of this repair.

Current visual-recovery source HEAD before this state-only commit:
`53513f8b32219b120f24079111453f9f91d75ff9`

All five workflows on that exact visual source HEAD completed SUCCESS:
- Cheap MVP Gate #339 — SUCCESS
- Creative 9x16 Proof #290 — SUCCESS
- Phone Visual Proof #328 — SUCCESS
- Shadow Acquisition Frame Proof #270 — SUCCESS
- Android Device Lab #212 — SUCCESS

Fresh Android device log on that HEAD:
- HUMAN_DEFAULT_PATH_PASS
- EARLY_TAP_PASS
- WRONG_TAP_PASS
- FIVE_LEVEL_CYCLE_PASS
- ACQUISITION_OWNERSHIP_PASS
- no `Uncaught` runtime exception
- exact source SHA `53513f8b32219b120f24079111453f9f91d75ff9`

Artifacts:
- Android device-lab artifact id `9722853583`, digest `sha256:254f745589ae2c7039ef6e3f593606483eb1a5b75e512b0956384e0bc214d7e6`
- APK artifact id `9722853761`, digest `sha256:d3e02e789d14da7c2205e25dcbdd8b1e2ff5156d61952d62afc95f83f829341b`

## Human semantic review of V5 visual proof
The new phone-size frames are materially clearer than the failed phone build:
- the wall control is now immediately recognizable as a switch;
- the lamp relationship and wrong-lamp event read without first deciphering an abstract symbol;
- the park / sidewalk / pool / tabletop contexts are recognizable at phone size;
- all five anomaly targets remain large and tappable;
- pacing has not regressed.

However, this remains a low-cost experimental visual tier, not final commercial art. It is intended to answer whether better scene legibility materially changes comprehension and interest before spending on richer art production.

## Current gates
- Continuous-loop architecture: provisional PASS for testing
- 5-level interaction semantics: PASS
- Automated structural/device gates: PASS
- V4 old visual execution: FAIL by real user evidence
- V5 visual readability recovery: PASS internally / NEEDS USER COMPARISON
- Final commercial art quality: NOT CLAIMED
- User physical Android comprehension/interest gate: NEXT REQUIRED GATE
- Blind Human Comprehension H1: BLOCKED until user phone result
- Organic TikTok H2: BLOCKED until H1 PASS
- Paid acquisition: BLOCKED
- Backend / monetization / factory scale: BLOCKED

## Next decision
Do not tune speed yet unless the next physical test identifies a timing-specific failure.

Next phone test should compare the V5 build against the failed V4 experience and answer two separate questions:
1. Is the scene/object language now immediately understandable?
2. Even when understandable, is the anomaly hunt itself interesting enough to continue?

If comprehension improves but interest remains weak, stop spending on art and revisit/kill the core loop. If both improve, then invest in a stronger reusable production visual system rather than polishing these SVG scenes indefinitely.
