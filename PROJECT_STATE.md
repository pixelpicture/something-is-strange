# PROJECT_STATE

## Active BET
TikTok-Native Game Experiment Factory.

First physical candidate: **Something Is Strange** (dynamic impossible moments, not generic static find-the-difference).

Broad GOLD MINE search is frozen until this BET is physically validated or killed. TikTok Mini Games access is treated as solved through ODDLINGS unless new evidence appears.

## Budget rule
Buy information, not architecture. Prefer zero-dependency/browser-native implementation, free CI, deterministic SVG, no backend, no paid assets, no ad SDK, and no AI API in the prototype unless a cheaper path cannot answer the current gate.

## Product hypothesis
`normal -> expectation -> impossible event -> tap/reveal -> replay/next`.

Creative should be nearly identical to gameplay. Dynamic temporal/causal anomalies are the differentiation; generic static anomaly clutter is not.

## Physical proof history
- Initial 3-level technical gate: PASS after validator parser repair.
- First phone visual proof exposed real human-visible failures despite green CI; iterated before scaling.
- Shadow Ahead, Late Mirror, Domino Break mechanic proof: PASS.
- Expanded atomically to Engine V2 + 10 levels with no external runtime dependencies.
- Full 30-frame 412x915 proof: 8 PASS / 2 REPAIR on first human inspection.
- Bounded Wrong Occlusion + Door Two Rooms repairs only.
- Fresh repaired 30-frame proof: **10/10 MVP MECHANIC PASS**.
- 9:16 static creative composition for Shadow Ahead, Late Mirror, Domino Break: **3/3 PASS**.
- Deterministic browser-frame video renderer: **PASS**; previous live X11 capture path is rejected.
- Three mechanic videos: **3/3 mechanic PASS**; Shadow is the strongest acquisition candidate.

## Shadow acquisition V1
A bounded acquisition-only improvement was built for Shadow Ahead, with no paid assets or external runtime service.

The proof pipeline went through several infrastructure failures that were explicitly not treated as product failures:
- repeated independent Chrome launches: rejected as too slow/wasteful;
- CDP virtual time: rejected after deterministic hangs;
- repeat navigation in one page target: rejected;
- missed `Page.loadEventFired`: replaced with runtime/DOM readiness polling;
- recursive acquisition MutationObserver: fixed with a one-shot guard and observer disconnect;
- baseline engine `#shadow` timer collision: removed by acquisition-specific element IDs;
- current Ubuntu runner lacks ffmpeg: CI installs the free system package only when absent.

The acquisition scene now has deterministic walker movement at ~0.45/0.9/1.3 s, a normally tracking shadow, then an impossible shadow turn at ~1.35 s while the body is still before the corner. The reveal is explicit and mechanic-specific.

### Final Shadow proof
Branch: `feature/mvp-physical-proof`
PR: #1
Product HEAD before this state update: `0bcdc9831aa76ddc32c419f992c4a42d2a48b27f`

CI on that HEAD:
- Cheap MVP Gate #115, run `33139446396`: **SUCCESS**
- Creative 9x16 Proof #66, run `33139446389`: **SUCCESS**
- Phone Visual Proof #104, run `33139446418`: **SUCCESS**
- Shadow Acquisition Frame Proof #46, run `33139446398`: **SUCCESS**

Final Shadow artifact:
- artifact id `9673335767`
- 10 A/B keyframes + one `shadow-acquisition.mp4`
- MP4: 540x960, 10 fps, 34 frames, 3.4 s

Human inspection of the final artifact:
- first frame intentional/full-screen: PASS
- challenge immediately legible: PASS
- person movement reads before anomaly: PASS
- normal shadow attachment reads: PASS
- shadow turns before the body reaches the corner: PASS
- anomaly unmistakable by ~1.4 s: PASS
- reveal clean and specific at ~2.3 s: PASS
- dead hold removed; ~1.1 s remains after reveal: PASS
- materially stronger than baseline: PASS
- plausible as a real low-cost organic/blind-human test creative: PASS

**Shadow acquisition creative internal gate = PASS.**

This does not mean market/acquisition signal is proven. Current visual treatment is intentionally inexpensive and stylized; the next question is whether people actually stop, understand, answer, replay, or comment.

## Retained 10-level MVP set
1. Shadow Ahead — creepy prediction — PASS
2. Late Mirror — temporal anomaly — PASS
3. Domino Break — prediction — PASS
4. Wrong Light Switch — causality — PASS
5. Color Theft — transformation — PASS
6. Wrong Occlusion — depth/occlusion — PASS after repair
7. Reverse Splash — effect before cause — PASS
8. Door Two Rooms — spatial logic — PASS after repair
9. Haircut Mirror — reflection causality — PASS
10. Extra Shadow — creepy multiplicity — PASS

## Current gates
- Cheap technical MVP: PASS
- 10-level mechanic visual proof: 10/10 PASS
- Static 9:16 creative composition: 3/3 PASS
- Deterministic video pipeline: PASS
- Three video mechanic proofs: 3/3 PASS
- Shadow acquisition A/B keyframe proof: PASS
- Shadow acquisition final 3.4 s video: PASS
- External blind-human / organic signal: NOT YET
- Paid acquisition: BLOCKED until external signal
- Backend / monetization / procedural factory scale: BLOCKED until external signal

## Next cheapest gate
Do **not** polish all 10 levels and do **not** spend on paid TikTok yet.

Use the final Shadow acquisition creative for a cheap external reality check:
1. blind comprehension with 5–10 people and/or one organic TikTok post;
2. measure whether the anomaly is understood without explanation;
3. measure answer impulse / watch-through / replay / comments if posted;
4. only if signal exists, repeat the acquisition treatment for Late Mirror and Domino Break or proceed to the smallest real TikTok Mini Game distribution test.

No backend, monetization SDK, AI content factory, or broad level-production expansion before that external gate.
