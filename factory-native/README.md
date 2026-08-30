# Factory Native / Reference Game 01

This directory is the production-oriented Cocos Creator project root for Factory V1.

- Editor target: Cocos Creator 3.8.8 LTS.
- Design resolution: 1080x1920 portrait.
- Production platform: TikTok Mini Games Native Runtime.
- `assets/scripts/domain`: engine/platform-independent game truth.
- `assets/scripts/cocos`: thin rendering/input/flow adapter.
- `assets/scripts/platform`: platform services boundary.
- `assets/resources/scenes`: data-first scene manifests loaded by id.
- future `assets/resources/assets`: layered raster art and state sprites.

Manifest coordinate system is 1080x1920 design pixels with a bottom-left origin. Touches are normalized from runtime viewport coordinates before semantic hit testing.

The repository CI validates architecture/contracts without pretending it has built Cocos. Cocos command-line publishing still requires an installed Creator editor and GUI-capable environment. A native build gate must therefore use a pinned Creator installation on a suitable runner rather than silently substituting the rejected WebView harness.

Do not import legacy `engine-v2/v3/v4`, DOM, Android WebView, or coded SVG scenes into this project.
