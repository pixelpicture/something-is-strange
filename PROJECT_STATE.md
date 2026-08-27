# PROJECT_STATE

## Active BET
TikTok-Native Game Experiment Factory.

First physical candidate: **Something Is Strange** (working concept: dynamic impossible moments, not generic static find-the-difference).

Broad GOLD MINE search is frozen until this BET is physically validated or killed. TikTok Mini Games access is treated as solved through ODDLINGS unless new evidence appears.

## Budget rule
Buy information, not architecture. Prefer zero-dependency/browser-native implementation, free CI, deterministic SVG, no backend, no paid assets, no ad SDK, and no AI API in the prototype unless a cheaper path cannot answer the current gate.

## Current product hypothesis
`1–2 sec hook -> 3–5 sec visual anomaly/prediction -> tap -> specific replay reveal -> next/streak`.

Creative should be nearly identical to gameplay.

## Physical proof history
- Initial 3-level schema/technical gate: PASS after validator parser fix.
- First phone visual proof exposed human-visible failures despite green CI: shadow change unreadable, mirror desync too subtle, domino answer/state broken.
- Iterated without scaling content until Shadow Ahead, Late Mirror, and Domino Break became visually legible.
- Generic `THERE.` reveal was rejected as weak; mechanic-specific replay reveal replaced it.
- Expanded atomically to Engine V2 + 10 levels with no external runtime dependencies.
- Cheap MVP Gate: PASS for exactly 10 levels and >=8 mechanic families.
- Full 30-frame 412x915 proof (normal/anomaly/reveal for all 10): automated PASS.
- Human pass on that artifact: 8 PASS / 2 REPAIR. Wrong Occlusion was too visually ambiguous; Door Two Rooms reveal did not prove the two-room contradiction strongly enough.
- Bounded repairs only: tail now visibly crosses the chair front while the cat is behind it; Door reveal now shows FIRST/SECOND incompatible spaces in one aperture.
- Fresh 30-frame run after repairs: CI PASS and human reinspection gives **10/10 MVP MECHANIC PASS**.

This is a content/mechanic validation, not a claim that current placeholder SVG art is acquisition-quality.

## MVP content set — physically retained
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

## Engine V2 gate
Runtime remains intentionally small and browser-native:
- `levels.js`: level metadata/hotspots/reveal copy/telemetry family
- `engine-v2.js`: renderer registry, deterministic timelines, tap loop, countdown, streak, replay reveal, local telemetry, proof query params
- `content-repairs.js`: bounded visual repair layer for the two human-pass failures; consolidate later only if the BET survives acquisition
- no external packages or network runtime dependencies

## Current GitHub checkpoint
- Branch: `feature/mvp-physical-proof`
- PR: #1
- Current content-repair HEAD before this state update: `ba2cfadc19d53684f569e3819996ef6bfb60b548`
- Cheap MVP Gate #41: SUCCESS
- Phone Visual Proof #30, run `33114972255`: SUCCESS
- Artifact `9664118780`: 30-frame repaired 10-level proof

## Next gate — creative proof, not factory scale
Build only three TikTok-native creative cuts first:
1. Shadow Ahead
2. Late Mirror
3. Domino Break

Requirements:
- true 9:16 phone-first frame;
- first meaningful visual in <=1 sec;
- challenge visible immediately;
- anomaly occurs quickly enough for short-form attention;
- reveal is the same mechanic/replay used by gameplay;
- no paid assets, backend, ad SDK, generative service, or monetization plumbing.

Then inspect the creative cuts humanly. Only after creative proof should we spend on organic/acquisition validation.

Do not build backend, monetization SDKs, procedural generation service, or 100-level factory before creative and distribution gates.
