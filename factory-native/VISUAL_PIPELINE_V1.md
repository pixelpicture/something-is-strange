# Visual Pipeline V1

Purpose: replace coded SVG diagrams with reusable, phone-readable layered 2D scenes without turning every level into bespoke renderer code.

## Runtime format
Every scene is composed from ordinary raster sprites (WebP/PNG) plus semantic geometry in the scene manifest. Runtime never depends on the generation tool.

Preferred asset structure:
- background: flattened environment only;
- actor/state sprites: transparent PNG/WebP;
- anomaly/effect sprite: transparent PNG/WebP;
- semantic geometry: authored polygons/masks stored in manifest;
- optional visual mask and hit mask are separate concerns.

## Art direction
Target: stylized editorial illustration / premium mobile puzzle art. Ordinary objects and physical relationships must be recognized before the anomaly occurs.

Reject:
- technical diagrams;
- icon-like people/objects;
- flat geometric stand-ins;
- ambiguous object silhouettes;
- decorative clutter competing with anomaly;
- text labels required to identify ordinary objects;
- painterly detail that collapses at 360px logical width.

Require:
- one dominant focal relationship;
- readable depth/light direction;
- natural contact/cast shadows;
- strong silhouette separation;
- anomaly changes one visually obvious causal fact;
- scene reads in <1 second on a phone before anomaly;
- anomaly locus remains obvious after motion stops.

## Reference scene briefs

### Extra Shadow
Normal: two clearly human figures walking through a readable park/path under one dominant visible light direction, with two believable cast shadows attached to them.
Anomaly: a third complete cast shadow appears in open pavement with no owner. It must look physically like the other shadows, not like a black stripe or UI shape.
Touch rule: any visible part of the third shadow, including distal/lower extent, is correct.

### Early Splash
Normal: recognizable ball falling toward calm pool water.
Anomaly: coherent splash/droplets appear while the ball is still visibly above the surface.
Touch rule: body, crown, and detached visible droplets all resolve to semantic object `splash`.

### Color Theft
Normal: saturated red ball passes behind an unmistakable pale vase.
Anomaly: ball exits pale while the vase becomes the same saturated red.
Touch rule: either transformed vase or transformed exiting ball is accepted because both visibly encode the same impossible event.

## Asset production policy
Generate/illustrate at 1080x1920 scene design resolution, then inspect at 360x640 logical-phone scale. Source can be AI-assisted, manually illustrated, or mixed; output contract stays the same.

Do not accept an asset merely because it is prettier than V5. It must cross a discontinuous recognizability threshold.

## Human gate
Machine gates can verify dimensions, alpha, manifest linkage, missing files, semantic coverage, and state timing.
Machine gates cannot certify recognizability or attractiveness.

Before a phone build, a human reviewer must answer for every scene without reading puzzle copy:
1. What ordinary objects are present?
2. What physical event is happening?
3. Where would you tap after the impossible event?

If #1 or #2 is not immediate, asset FAIL.
If #3 does not cover the semantic mask, interaction FAIL.
