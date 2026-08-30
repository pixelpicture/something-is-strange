import { _decorator, Component, Label, Button } from 'cc';
import type { SessionScore } from '../domain/PerceptionScore';
const {ccclass,property}=_decorator;

@ccclass('ResultCardController')
export class ResultCardController extends Component {
  @property(Label) scoreLabel:Label|null=null;
  @property(Label) rankLabel:Label|null=null;
  @property(Label) reactionLabel:Label|null=null;
  @property(Label) falseAlarmLabel:Label|null=null;
  @property(Button) continueButton:Button|null=null;

  show(score:SessionScore, observations:{reactionMs:number;falseTaps:number}[]){
    if(this.scoreLabel)this.scoreLabel.string=score.total.toLocaleString();
    if(this.rankLabel)this.rankLabel.string=score.rank;
    const avg=observations.length?observations.reduce((s,o)=>s+o.reactionMs,0)/observations.length:0;
    const falseAlarms=observations.reduce((s,o)=>s+o.falseTaps,0);
    if(this.reactionLabel)this.reactionLabel.string=avg?`${(avg/1000).toFixed(2)}s`:'—';
    if(this.falseAlarmLabel)this.falseAlarmLabel.string=String(falseAlarms);
    this.node.active=true;
  }
  hide(){this.node.active=false;}
}
