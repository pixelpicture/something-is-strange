'use strict';

// Generic semantic hit policy for authored masks/polygons.
// A scene adapter supplies semantic objects; gameplay asks what object was tapped.
// This deliberately replaces answer rectangles.

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const crosses = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || Number.EPSILON) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

function distanceToSegment(p, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1];
  const wx = p.x - a[0], wy = p.y - a[1];
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.hypot(p.x - a[0], p.y - a[1]);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(p.x - b[0], p.y - b[1]);
  const t = c1 / c2;
  return Math.hypot(p.x - (a[0] + t * vx), p.y - (a[1] + t * vy));
}

function hitObject(point, object) {
  const polygons = object.hitPolygons || [];
  const expansion = Math.max(0, Number(object.touchExpansionPx || 0));
  for (const poly of polygons) {
    if (pointInPolygon(point, poly)) return true;
    if (expansion > 0) {
      for (let i = 0; i < poly.length; i++) {
        if (distanceToSegment(point, poly[i], poly[(i + 1) % poly.length]) <= expansion) return true;
      }
    }
  }
  return false;
}

function semanticHit(point, objects) {
  // Highest z object wins; transparent/non-interactive objects are excluded by adapter.
  return [...objects]
    .filter(o => o.interactive !== false && hitObject(point, o))
    .sort((a, b) => (b.z || 0) - (a.z || 0))[0] || null;
}

if (typeof module !== 'undefined') module.exports = { pointInPolygon, hitObject, semanticHit };
