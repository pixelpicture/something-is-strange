import { _decorator, Component, Label, Button } from 'cc';
import type { SessionScore } from '../domain/PerceptionScore';
const {ccclass,property}=_decorator;

@ccclass('ResultCardController')
export class ResultCardController extends Component {
  @property(Label) titleLabel:Label|null=null;
  @property(Label) scoreLabel:Label|null=null;
  @property(Label) rankLabel:Label|null=null;
  @property(Label) reactionLabel:Label|null=null;
  @property(Label) falseAlarmLabel:Label|null=null;
  @property(Label) bestLabel:Label|null=null;
  @property(Label) ctaLabel:Label|null=null;
  @property(Button) continueButton:Button|null=null;
  private bestScore=0;

  show(score:SessionScore, observations:{reactionMs:number;falseTaps:number}[]){
    this.bestScore=Math.max(this.bestScore,score.total);
    if(this.titleLabel)this.titleLabel.string='PERCEPTION SCORE';
    if(this.scoreLabel)this.scoreLabel.string=score.total.toLocaleString();
    if(this.rankLabel)this.rankLabel.string=score.rank;
    const avg=observations.length?observations.reduce((s,o)=>s+o.reactionMs,0)/observations.length:0;
    const falseAlarms=observations.reduce((s,o)=>s+o.falseTaps,0);
    if(this.reactionLabel)this.reactionLabel.string=avg?`AVG ${(avg/1000).toFixed(2)}s`:'AVG —';
    if(this.falseAlarmLabel)this.falseAlarmLabel.string=`FALSE TAPS ${falseAlarms}`;
    if(this.bestLabel)this.bestLabel.string=`BEST ${this.bestScore.toLocaleString()}`;
    if(this.ctaLabel)this.ctaLabel.string='↻  BEAT YOUR BEST';
    if(this.continueButton)this.continueButton.interactable=true;
    this.node.active=true;
  }
  hide(){this.node.active=false;}
}
