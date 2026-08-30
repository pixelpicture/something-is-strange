# TikTok-Native Game Experiment Factory — Architecture V1

## Why this exists
Physical-phone V5 invalidated three assumptions at once:
1. coded procedural SVG is not a sufficient production-intent visual language;
2. rectangular answer hotspots are semantically wrong for object-based puzzles;
3. `FOUND -> NEXT` is not a sufficient reason to continue playing.

Do not repair these as isolated Something Is Strange bugs. They are factory-level requirements.

## Product thesis
The reusable unit is not a whole game. It is:
`validated mechanic + content schema + reusable runtime + evidence pipeline + kill policy`.

Something Is Strange becomes Reference Game 01 for the factory. It gets one bounded reconstruction. If the reconstructed three-round experience still does not create a spontaneous desire to continue, kill the game and retain the factory.

## Platform decision
Production target is TikTok Mini Games Native Runtime. HTML/WebView remains only a cheap local/evidence harness. New production architecture must not depend on DOM, WebView, HTML entry, CSS layout, or browser-only APIs.

Primary engine target: Cocos Creator 3.x / TypeScript. Keep the domain/runtime APIs engine-agnostic enough to permit a future Unity adapter only when a candidate materially benefits from 3D/physics.

## Layering

### 1. Domain Runtime — engine independent
Owns:
- session / round state machine;
- deterministic clock/event schedule;
- scoring;
- false-tap accounting;
- reaction latency;
- streak/combo;
- rank progression;
- adaptive mechanic selection;
- telemetry events.

It must not know about Cocos nodes, TikTok APIs, Android, DOM, sprites, or SVG.

### 2. Mechanic Modules
Initial generic families:
- anomaly_presence;
- timing_violation;
- causality_violation;
- transformation;
- prediction;
- sequence;
- memory.

A mechanic evaluates semantic actions against scene state. It never evaluates raw rectangular screen coordinates.

### 3. Scene Manifest + Semantic Objects
A level is data plus assets, not bespoke renderer code.

Required concepts:
- scene id;
- layered visual assets;
- semantic actors;
- actor transforms/pivots/z-order;
- event timeline;
- anomaly event;
- answer semantic object(s);
- interaction mask or generated collider;
- optional generous touch expansion;
- mechanic tags/difficulty.

Invariant: if a visible part belongs to the semantic answer object, tapping that visible part must be accepted. A player who understood the puzzle must never fail because an invisible authoring rectangle disagreed.

### 4. Renderer Adapter
Cocos implementation renders layered 2D assets and animation from manifests.
No level-specific gameplay logic belongs in renderer code.

Visual target is instantly recognizable illustrated scenes, not technical diagrams. Asset production may be AI-assisted, but the runtime consumes ordinary layered sprites/masks and is independent of how assets were made.

### 5. Meta Runtime
Reusable across games:
- Perception/skill score;
- reaction time;
- false alarms;
- streak/combo;
- rank ladder;
- session summary;
- share/result card;
- later: daily challenge / friend leaderboard adapter.

No fake percentile claims before real population data exists.

### 6. Platform Adapter
Separate interfaces for:
- local/dev;
- TikTok Native Runtime;
- evidence/test harness.

Owns lifecycle, storage, login, analytics, sharing, leaderboard and monetization capabilities. Core gameplay must run without platform services.

### 7. Evidence Harness
Machine truth only:
- deterministic state transitions;
- crash/runtime exception detection;
- semantic hit-region coverage;
- asset/manifest validity;
- timing bounds;
- source provenance;
- build/package integrity;
- screenshots/video for human review.

Machine CI must never claim PASS for beauty, recognizability, fun, desire-to-continue, or commercial quality. Those are explicit human gates.

## Reference Game 01 — bounded reconstruction
Only three rounds before another physical-phone decision:
1. Extra Shadow — rebuilt with a readable illustrated scene and full semantic shadow mask.
2. Early Splash — rebuilt with one semantic splash object whose complete visible geometry is tappable.
3. Color Theft — retained as the current strongest comprehension baseline, rebuilt in the same visual system.

Wrong Light Switch is removed from the reference slice until it earns recognizability independently. Shadow Ahead remains R&D inventory until a real cast-shadow visual reads instantly on phone.

## Reference meta-loop
Positioning: `How quickly do you notice the impossible?`

Per round capture:
- correct/incorrect;
- reaction latency measured from anomaly visibility;
- false taps after anomaly;
- premature taps;
- replay usage.

Return a transparent deterministic score and qualitative rank. Initial ranks are game-defined labels, not population percentiles.

The three-round session must end in a compact perception result card and a clear invitation to improve/continue. Do not build backend leaderboards, monetization, or large content inventory before the three-round human gate passes.

## Factory kill policy
Candidate funnel target:
`many concepts -> cheap mechanic proofs -> 3-round slices -> phone gate -> external human gate -> only winners scale`.

For future candidates:
- one repair is allowed when a failure has a concrete falsifiable cause;
- two independent human failures of the same core loop => KILL unless a genuinely different product hypothesis is proposed;
- no V2/V3/V4 polish ladders merely because engineering can continue;
- do not build >3 polished rounds before the core desire-to-continue gate.

## Human gates
Reference Game 01 physical PASS requires all of:
- objects understood without explanatory rescue text;
- a player who identifies the semantic answer can tap any reasonable visible part of it;
- no interaction feels unfair;
- result/score is understood;
- after round three there is a genuine reason to choose another round;
- user reports spontaneous desire to continue, not merely willingness to comply with a test.

If recognizability fails: visual pipeline FAIL.
If understood answer is rejected: semantic interaction FAIL.
If three good rounds are understood but there is no desire to continue: product/core-value FAIL and Something Is Strange is killed.

## Throughput target
After Factory V1 extraction, target per candidate:
- mechanic proof: <= 1 hour autonomous work;
- three-round slice: <= 3 hours autonomous work when it uses existing mechanic/visual families;
- machine evidence: <= 30 minutes;
- human artifact review: <= 10 minutes;
- phone candidate: within one working day for a strong candidate.

These are factory targets, not promises. The second game is the benchmark: if it is not several times faster than Reference Game 01, extraction is incomplete.

## Explicit non-goals now
- no backend;
- no ads/IAP;
- no production leaderboard service;
- no 10/20/100-level content expansion;
- no generic universal engine for every game genre;
- no Unity migration unless a candidate needs it;
- no further production investment in WebView/HTML architecture.
