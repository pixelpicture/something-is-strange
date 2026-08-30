import type { SemanticObject } from './SemanticHit';
import type { Mechanic } from './Runtime';

export type AssetRole='background'|'actor'|'state'|'effect'|'mask';
export interface AssetRef { id:string; role:AssetRole; path:string; width:number; height:number; }
export interface ActorState { assetId:string; visible?:boolean; opacity?:number; }
export interface SceneActor {
  id:string; z:number; x:number; y:number; scale?:number; rotation?:number;
  initialState:string; states:Record<string,ActorState>;
  semantic?:SemanticObject;
}
export interface TimelineCommand { atMs:number; actorId:string; command:'state'|'move'|'rotate'|'opacity'; value:string|number|{x:number;y:number;durationMs:number}; }
export interface LayeredSceneManifest {
  schemaVersion:1; id:string; mechanic:Mechanic; canvas:{width:number;height:number};
  assets:AssetRef[]; actors:SceneActor[]; timeline:TimelineCommand[];
  anomalyAtMs:number; answerObjectIds:string[];
  humanIntent:{normalExpectation:string; impossibleEvent:string; visualQuestion:string};
}

export function validateManifest(m:LayeredSceneManifest):string[]{
  const errors:string[]=[]; if(m.schemaVersion!==1)errors.push('schemaVersion');
  const assets=new Set(m.assets.map(a=>a.id)); const actors=new Set(m.actors.map(a=>a.id));
  if(assets.size!==m.assets.length)errors.push('duplicate asset id'); if(actors.size!==m.actors.length)errors.push('duplicate actor id');
  for(const a of m.actors){for(const s of Object.values(a.states))if(!assets.has(s.assetId))errors.push(`missing asset ${s.assetId}`);}
  for(const e of m.timeline)if(!actors.has(e.actorId))errors.push(`missing actor ${e.actorId}`);
  const semantics=new Set(m.actors.filter(a=>a.semantic).map(a=>a.semantic!.id));
  for(const id of m.answerObjectIds)if(!semantics.has(id))errors.push(`answer lacks semantic object ${id}`);
  if(m.anomalyAtMs<500||m.anomalyAtMs>5000)errors.push('anomaly timing');
  return errors;
}
