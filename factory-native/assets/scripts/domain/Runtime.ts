import type { SemanticObject } from './SemanticHit';
export type Mechanic='anomaly_presence'|'timing_violation'|'causality_violation'|'transformation'|'prediction'|'sequence'|'memory';
export interface SceneEvent { atMs:number; action:string; actor?:string; payload?:Record<string,unknown>; }
export interface SceneManifest { id:string; mechanic:Mechanic; anomalyAtMs:number; answerObjectIds:string[]; objects:SemanticObject[]; timeline:SceneEvent[]; }
export interface RoundState { startedAtMs:number; anomalyVisibleAtMs:number|null; solved:boolean; falseTaps:number; prematureTaps:number; replays:number; }
export function newRound(startedAtMs:number):RoundState{return {startedAtMs,anomalyVisibleAtMs:null,solved:false,falseTaps:0,prematureTaps:0,replays:0};}
export function anomalyVisible(s:RoundState,now:number):RoundState{return {...s,anomalyVisibleAtMs:now};}
