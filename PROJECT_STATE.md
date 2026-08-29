# PROJECT_STATE

## Active BET
TikTok-Native Game Experiment Factory.

First physical candidate: **Something Is Strange**.

Broad GOLD MINE search remains frozen until this BET is physically validated or killed. TikTok Mini Games access remains treated as solved through ODDLINGS unless new evidence appears.

## Budget rule
Buy information, not architecture. Prefer zero-dependency/browser-native implementation, free CI, deterministic SVG, no backend, no paid assets, no ad SDK, and no AI API in the prototype unless a cheaper path cannot answer the active gate.

## Product reconstruction V4
The previous real-phone failures invalidated the old assumption that a technically working hotspot game was enough. V4 therefore changed the core loop and cut content instead of adding more explanation.

Primary loop:
`continuous scene -> normal expectation -> impossible event -> tap -> immediate spatial feedback -> reveal/replay/next`

Key V4 decisions:
- no countdown in the physical comprehension slice;
- taps accepted throughout the scene;
- early tap visibly acknowledges interaction without revealing the answer;
- wrong tap gives immediate local feedback;
- correct tap freezes/highlights the exact anomaly and exposes NEXT;
- acquisition creative owns its own copy/timing and cannot be overwritten by playable-state prompts;
- first physical slice cut from 10 levels to 5 high-salience anomalies.

Canonical 5-level physical slice:
1. Extra Shadow
2. Wrong Light Switch
3. Shadow Ahead
4. Early Splash
5. Color Theft

Haircut Mirror and Wrong Occlusion are rejected from the next physical comprehension build. Domino Break, Door Two Rooms, and Wrong Mirror remain R&D inventory only until they independently earn phone-size readability.

See `PRODUCT_RECONSTRUCTION_V4.md` for the adversarial reconstruction rationale.

## Authoritative V4 pre-phone PASS
Validated source HEAD: `fdefe26162f8638e15b72eb26f65f02d39a34cb3`.

All five workflows on this exact source HEAD completed SUCCESS:
- Cheap MVP Gate #331, run `33233338697`: SUCCESS
- Creative 9x16 Proof #282, run `33233338608`: SUCCESS
- Shadow Acquisition Frame Proof #262, run `33233338603`: SUCCESS
- Phone Visual Proof #320, run `33233338613`: SUCCESS
- Android Device Lab #204, run `33233338592`: SUCCESS

Android artifacts on the same source HEAD:
- device-lab artifact id `9709193337`
- name `android-device-lab-fdefe26162f8638e15b72eb26f65f02d39a34cb3`
- size `2,148,052` bytes
- digest `sha256:acf3be2d71bcffa0205132479f2834a8b405c94554ee523f6ebc0c005d4dbafc`
- APK artifact id `9709193478`
- name `something-is-strange-device-check-fdefe26162f8638e15b72eb26f65f02d39a34cb3`
- size `19,831` bytes
- digest `sha256:f3a370280daf2be46bf596fb931cd2e0720bdbc54654e63746e8aafac2449e9e`

Locally extracted APK SHA256 from that artifact:
`0ca23b184a2e602e7a13d8f963f7fa910f8c234adbcdb6832e1b74169e5ceb14`

## Machine / architecture evidence
Cheap gate on the authoritative V4 HEAD proves:
- V4 continuous 5-level slice structurally valid;
- 100/100 adversarial perception proxies pass;
- 30/30 architecture invariants pass;
- 5/5 bounded animation audits pass;
- acquisition isolation is explicitly guarded.

## Android black-box / interaction evidence
API35 Pixel 6 emulator, exact source checkout, KVM, staged exact V4 runtime, physical `adb shell input tap`:
- clean launcher path with no creative/lab query contamination: PASS
- no lab instrumentation on default launcher path: PASS
- first puzzle has no countdown: PASS
- early physical tap produces visible response: PASS
- wrong physical tap produces visible response and preserves unsolved state: PASS
- five-level physical cycle: PASS
- correct tap produces exact spatial reveal and visible NEXT: PASS
- all five levels solve through the real Android WebView path: PASS
- acquisition baseline/turn survives Android WebView: PASS
- acquisition prompt remains `WATCH HIS SHADOW.` after the anomaly: PASS
- Android proof rejects any `Uncaught` runtime exception: PASS
- fresh authoritative device log contains no `Uncaught`: PASS
- source-sha artifact exactly equals `fdefe26162f8638e15b72eb26f65f02d39a34cb3`: PASS

## Human semantic artifact review
Fresh Android artifact from run #204 was manually reviewed after CI success.

Default / first puzzle:
- cold portrait frame is clean, readable, no black/loading/system overlay: PASS
- Extra Shadow anomaly is visually obvious at phone size: PASS
- early-tap ripple is visible: PASS
- wrong-tap state remains intact: PASS
- correct reveal highlights the exact extra shadow, explanation is concise, NEXT is unmistakable: PASS

Remaining physical slice:
- Wrong Light Switch: wrong lamp causality and correct focus highlight readable: PASS
- Shadow Ahead: person/shadow composition and early-turn target readable: PASS for physical comprehension test
- Early Splash: effect-before-contact is simultaneously visible in the anomaly frame: PASS for physical comprehension test
- Color Theft: red vase + white exiting ball transformation readable: PASS

Acquisition semantic review:
- before/after frames preserve `WATCH HIS SHADOW.`; playable prompt no longer overwrites creative copy: PASS
- shadow acquisition scene no longer throws stale playable-timer exceptions: PASS
- no black/loading/system UI contamination in required acquisition frames: PASS

Visual quality remains prototype-grade geometric art. This is sufficient for the next **physical comprehension** gate, not evidence of final public/acquisition art quality across the whole game.

**AUTOMATED PRE-PHONE GATE = PASS.**

## Current gates
- V4 product reconstruction / bounded 5-level slice: PASS for physical testing
- Cheap structural + 100 perception proxies + 30 architecture invariants: PASS
- Browser/phone visual proof: PASS
- Shadow acquisition proof: PASS
- Android emulator physical interaction gate: PASS
- Human semantic review of fresh Android artifact: PASS
- Automated pre-phone gate: **PASS**
- User physical Android phone comprehension gate: **NEXT REQUIRED GATE**
- Blind Human Comprehension H1: BLOCKED until user phone PASS
- Organic TikTok H2: BLOCKED until H1 PASS
- Paid acquisition: BLOCKED
- Backend / monetization / factory scale: BLOCKED

## Next required gate — independent user phone test
Install the APK built from exact HEAD `fdefe26162f8638e15b72eb26f65f02d39a34cb3` and play it without hints or explanation.

The test is not merely “does it run.” It must answer:
- Is the first scene immediately understandable enough to watch?
- Does every tap visibly do something?
- Is the impossible event noticed without being coached?
- Is the target obvious enough to tap?
- Is the reveal satisfying/clear?
- Is NEXT obvious?
- Do the five puzzles feel like one coherent game rather than five test cases?

A phone technical PASS with poor comprehension remains a product FAIL and must trigger another reconstruction rather than more instruction text.
