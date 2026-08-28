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

## Canonical MVP state
Branch: `feature/mvp-physical-proof`
PR: #1

Retained 10-level MVP set:
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

Verified internal gates before Android device validation:
- Cheap technical MVP: PASS
- 10-level mechanic visual proof: 10/10 PASS
- Static 9:16 creative composition: 3/3 PASS
- Deterministic browser video pipeline: PASS
- Three mechanic videos: 3/3 PASS
- Shadow acquisition A/B keyframe proof: PASS
- Shadow acquisition final 3.4 s host video: PASS
- Shadow acquisition creative internal quality gate: PASS for a cheap external/blind-human test

Rejected evidence paths remain rejected and must not be revived without a new reason: live X11 capture, repeated independent Chrome capture, CDP virtual-time capture, and other brittle/expensive paths that already failed to buy useful information.

## Android Device Lab — authoritative PASS
Validated source HEAD: `fa5190a9c1b0792309859f0b9415ea54e9d01eb7` (`Stabilize Android wrong-feedback and acquisition evidence`).

All five workflows on that source HEAD completed SUCCESS:
- Android Device Lab #104, run `33211658383`: SUCCESS
- Cheap MVP Gate #231, run `33211658446`: SUCCESS
- Phone Visual Proof #220, run `33211658484`: SUCCESS
- Shadow Acquisition Frame Proof #162, run `33211658370`: SUCCESS
- Creative 9x16 Proof #182, run `33211658368`: SUCCESS

Android artifact:
- artifact id `9701918561`
- name `android-device-lab-dcb23b9aff9c577646a9a19b8d72a3a893445e62`
- size `3,107,627` bytes
- digest `sha256:e0da11e54a9275321451964ed6d51a66fd38e6403293c6adfb7a7b9608c42f76`
- expires 2026-09-04

Physical/runtime evidence from API35 Pixel 6 x86_64 emulator with KVM and real `adb shell input tap`:
- cold WebView load and interaction readiness: PASS
- wrong physical tap routes to `tapLayer`: PASS
- wrong tap gives `NO — LOOK AGAIN.` while streak stays 0: PASS
- Shadow correct physical tap and reveal: PASS
- physical NEXT advances to Late Mirror: PASS
- Late Mirror correct physical tap/reveal: PASS
- physical NEXT advances to Domino Break: PASS
- Domino Break correct physical tap/reveal: PASS
- three consecutive level cycle advances onward to Wrong Light Switch without broken state: PASS
- double physical tap does not double-score: PASS
- background/resume preserves a usable interaction path: PASS
- acquisition WebView path loads with the intended query parameters: PASS
- acquisition baseline and early-turn markers occur: PASS
- device acquisition MP4 exists and is decodable at 1080x2400: PASS

Human semantic review of the Android artifact (not just green CI):
- `shadow-start.png`: clean portrait gameplay, no OS tutorial/system overlay: PASS
- `shadow-anomaly.png`: Shadow anomaly visible: PASS
- `shadow-wrongtap.png`: `NO — LOOK AGAIN.` visible and state intact: PASS
- `shadow-correct.png`: correct reveal and NEXT visible: PASS
- `shadow-next.png`: Late Mirror appears after NEXT with clean reset: PASS
- `mirror-anomaly.png` / `mirror-correct.png`: mechanic and reveal readable: PASS
- `domino-anomaly.png` / `domino-correct.png`: mechanic and reveal readable: PASS
- `acq-before-turn.png` / `acq-after-turn.png`: acquisition scene survives Android WebView and the impossible shadow turn is visible: PASS
- `device-window.xml`: only the app fullscreen WebView is present; no `Viewing full screen`, `Got it`, ANR, crash, action bar, or other blocking overlay: PASS
- no black/blank screenshots in the required semantic set: PASS

The device acquisition MP4 is evidence of WebView survival, not the canonical acquisition creative. It contains a lab capture transition/pre-roll artifact and therefore must not replace the already-passed deterministic host acquisition video for external creative testing. This does **not** invalidate the Android gameplay/device gate because the device criterion is that the acquisition anomaly survives the real WebView path, which the before/after frames and runtime markers establish.

**Android Device Gameplay / automated pre-phone gate = PASS.**

## Current gates
- Internal technical/mechanic/creative gates: PASS
- Android emulator physical gameplay gate: PASS
- User physical Android phone gate: NOT YET — next required gate
- Blind Human Comprehension H1: NOT YET
- Organic TikTok signal H2: NOT YET
- Paid acquisition: BLOCKED until external signal
- Backend / monetization / procedural factory scale: BLOCKED until external signal

## Next required gate — user physical Android
Do not expand scope or polish all 10 levels now.

Next step is an independent physical-phone check using the current lab APK/runtime on the user's Android device. Verify cold launch, portrait layout, tap responsiveness, wrong-tap feedback, correct reveal, NEXT progression across Shadow -> Mirror -> Domino, and absence of scroll/zoom/system-overlay interference.

Only after the physical-phone check passes should the project proceed to preregistered H1 blind-human comprehension, then H2 organic TikTok. No paid acquisition, backend, monetization SDK, AI content factory, or broad level-production expansion before those gates.
