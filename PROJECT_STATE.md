# PROJECT_STATE

## Active BET
TikTok-Native Game Experiment Factory.

Reference candidate: **Something Is Strange**.
Broad GOLD MINE search remains frozen while the factory itself is extracted and tested. Budget rule remains: buy information, not architecture or content volume.

## Authoritative physical result — V5 FAIL
The latest independent user phone test overrides prior machine/assistant visual PASS claims.

Observed on physical phone:
- graphics remained weak and did not materially solve the presentation problem;
- Extra Shadow accepted only the upper part of the visible answer while the user naturally tapped the lower part;
- Wrong Light Switch became less understandable: switch and lamps were poorly recognizable and the wording did not rescue the scene;
- Shadow Ahead shadow read as a thick line rather than a cast shadow;
- Early Splash rejected taps on the upper visible splash/droplets;
- Color Theft was understandable;
- pacing did not present a clear failure signal;
- critically, there was no compelling reason to continue: no meaningful score, evaluation, progression, intelligence/perception feedback, or social comparison object.

Therefore:
- V5 physical comprehension/value = **FAIL**;
- current coded-SVG visual system = **REJECT for production**;
- rectangular answer-hotspot architecture = **REJECT**;
- `FOUND -> NEXT` no-meta sequence = **REJECT**;
- pacing = HOLD/frozen until a reconstructed experience provides cleaner evidence;
- previous machine/assistant claims that V5 visuals/hit targets were human-readable are superseded by physical evidence.

## Product verdict
Keep the underlying anomaly-detection BET, not the current five-puzzle product.

Reposition Reference Game 01 as a bounded **Perception Challenge**:
`normal expectation -> impossible event -> semantic tap -> reaction/accuracy evaluation -> perception score/rank -> next challenge -> compact session result`.

Do not add meaningless coins. Score must represent observable play: reaction latency, false taps, premature taps and replay usage. Initial ranks are game-defined labels and must not claim population percentiles without real population data.

Reference reconstruction is limited to THREE rounds:
1. Extra Shadow
2. Early Splash
3. Color Theft

Wrong Light Switch is removed until it independently earns recognizability. Shadow Ahead remains R&D until a real cast-shadow visual reads instantly.

If three high-quality, fair rounds plus meaningful evaluation still do not create spontaneous desire to continue, **KILL Something Is Strange** and retain the factory.

## Factory Architecture V1
Canonical design: `FACTORY_ARCHITECTURE_V1.md`.

New reusable contracts now exist:
- `factory/reference-game-01.json` — data-first three-round reference specification;
- `factory/perception-score-v1.js` — transparent engine-independent scoring/rank contract;
- `factory/semantic-hit-v1.js` — semantic polygon/mask hit-testing with touch expansion;
- `scripts/validate_factory_v1.mjs` — architecture/scoring/semantic-hit regression gate, including the physical splash failure mode.

Architecture layers:
1. engine-independent Domain Runtime;
2. reusable Mechanic Modules;
3. Scene Manifest + Semantic Objects;
4. renderer adapter;
5. reusable Meta Runtime;
6. Platform Adapter;
7. Evidence Harness.

Invariant: a player who understood the answer must never fail because an invisible rectangular hotspot disagrees with the visible semantic object.

## Platform architecture correction
TikTok developer documentation changed materially in late August 2026. Starting August 28, HTML/H5 mini games are no longer accepted/supported as the production path; new/maintained games must use TikTok Mini Games Native Runtime. A normal website/HTML ZIP cannot be converted directly into the native package.

Production target therefore changes to **Cocos Creator 3.x / TypeScript -> TikTok Mini Games Native Runtime** for this lightweight 2D factory. Unity is a future adapter only for candidates that materially need 3D/physics.

The existing HTML/WebView/Android harness is retained only as cheap R&D/evidence infrastructure. Do not invest further in it as production architecture.

## Visual architecture correction
Do not create another `engine-v5/v6` containing bespoke coded SVG scenes.

Target visual model:
- recognizable illustrated layered 2D assets;
- scene manifest describes actors, transforms, z-order, timeline and anomaly;
- semantic object owns visual/hit geometry;
- renderer consumes assets/manifests;
- gameplay logic never embeds level-specific drawing code.

Asset production may be AI-assisted, but runtime is independent of asset-generation method.

## Evidence policy correction
Machine truth and human truth are separate.

Machine CI may PASS:
- state transitions;
- runtime exceptions;
- semantic hit coverage;
- timing bounds;
- manifest/assets;
- package integrity;
- provenance;
- screenshot/video generation.

Machine/assistant proxy review must NOT claim final PASS for:
- beauty;
- instant object recognizability;
- fun;
- desire to continue;
- commercial quality.

Those require physical/blind human evidence.

## Kill/throughput policy
Future candidates do not receive V2/V3/V4/V5 repair ladders by default.
- one bounded repair when failure has a concrete falsifiable cause;
- two independent human failures of the same core loop => KILL unless a genuinely different product hypothesis exists;
- no >3 polished rounds before desire-to-continue is demonstrated.

Factory throughput targets after extraction:
- mechanic proof <=1h autonomous work;
- 3-round slice <=3h when using existing families;
- machine evidence <=30m;
- human artifact review <=10m;
- strong phone candidate within one working day.

Second game is the benchmark: if it is not several times faster than Reference Game 01, Factory V1 extraction is incomplete.

## Current gates
- V5 physical phone: **FAIL**
- Current SVG production visual system: **REJECT**
- Rectangular hotspot interaction: **REJECT**
- No-meta five-puzzle product: **REJECT**
- Continuous anomaly detection as underlying mechanic: **BET/HOLD**
- Factory Architecture V1: **FROZEN FOR IMPLEMENTATION**
- Native production target / Cocos: **DECIDED**
- Three-round Reference Game 01: **NEXT IMPLEMENTATION GATE**
- Backend / ads / IAP / large content expansion: **BLOCKED**
- H1 blind humans: **BLOCKED** until reconstructed physical phone PASS
- Organic TikTok: **BLOCKED** until H1 PASS

## Next work
Implement the minimum native-ready Factory V1 skeleton and the three-round Reference Game 01 using data-first scenes, semantic hit geometry, meaningful Perception Score/rank and a result card. Do not polish the rejected WebView game further. The next user phone build should exist to falsify/validate the reconstructed human value proposition, not to prove another local UI fix.
