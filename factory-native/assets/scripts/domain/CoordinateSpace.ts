import type { Point } from './SemanticHit';

export interface Size { width:number; height:number; }

// Manifest coordinates are design-space pixels with origin at bottom-left.
// Touch input may arrive in a different viewport size; normalize before hit-testing.
export function screenToDesign(point:Point, viewport:Size, design:Size):Point {
  if(viewport.width<=0||viewport.height<=0) throw new Error('invalid viewport');
  return {
    x: point.x * design.width / viewport.width,
    y: point.y * design.height / viewport.height
  };
}
