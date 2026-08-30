import { scoreSession, type RoundObservation, type SessionScore } from './PerceptionScore';

export type SessionPhase='intro'|'playing'|'round_result'|'session_result';
export interface SessionState { phase:SessionPhase; roundIndex:number; observations:RoundObservation[]; score:SessionScore; }
const empty=()=>scoreSession([]);
export function createSession():SessionState{return {phase:'intro',roundIndex:0,observations:[],score:empty()};}
export function startSession(s:SessionState):SessionState{return {...s,phase:'playing'};}
export function completeRound(s:SessionState,o:RoundObservation,totalRounds:number):SessionState{
  const observations=[...s.observations,o], score=scoreSession(observations);
  return {...s,observations,score,phase:observations.length>=totalRounds?'session_result':'round_result'};
}
export function nextRound(s:SessionState):SessionState{
  if(s.phase!=='round_result')return s;
  return {...s,roundIndex:s.roundIndex+1,phase:'playing'};
}
export function resultCopy(score:SessionScore){
  return {eyebrow:'PERCEPTION RESULT',score:String(score.total),rank:score.rank,cta:'BEAT YOUR SCORE'};
}
