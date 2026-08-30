export type Rank = 'UNAWARE' | 'ALERT' | 'SHARP' | 'UNCANNY';
export interface RoundObservation { correct:boolean; reactionMs:number; falseTaps:number; prematureTaps:number; replays:number; }
export interface RoundScore { score:number; reactionScore:number; penalties:number; }
export interface SessionScore { total:number; rank:Rank; rounds:RoundScore[]; }
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function scoreRound(input:RoundObservation):RoundScore {
  if(!input.correct)return {score:0,reactionScore:0,penalties:0};
  const reactionMs=Math.max(0,input.reactionMs||0);
  const reactionScore=Math.round(clamp((3000-reactionMs)/2550,0,1)*800);
  const penalties=Math.min(500,Math.max(0,input.falseTaps)*120+Math.max(0,input.prematureTaps)*60+Math.max(0,input.replays)*80);
  return {score:Math.max(0,200+reactionScore-penalties),reactionScore,penalties};
}
export function rankFor(total:number,rounds:number):Rank {
  const ratio=clamp(total/(Math.max(1,rounds)*1000),0,1);
  if(ratio>=.82)return 'UNCANNY'; if(ratio>=.62)return 'SHARP'; if(ratio>=.38)return 'ALERT'; return 'UNAWARE';
}
export function scoreSession(inputs:RoundObservation[]):SessionScore {const rounds=inputs.map(scoreRound);const total=rounds.reduce((s,r)=>s+r.score,0);return {total,rank:rankFor(total,rounds.length),rounds};}
