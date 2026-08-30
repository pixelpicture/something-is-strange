import { _decorator, Component, input, Input, EventTouch, Label, view } from 'cc';
import { semanticHit, type SemanticObject } from '../domain/SemanticHit';
import { screenToDesign } from '../domain/CoordinateSpace';
import { scoreSession, type RoundObservation } from '../domain/PerceptionScore';
const {ccclass,property}=_decorator;
const DESIGN={width:1080,height:1920};

@ccclass('ReferenceGameController')
export class ReferenceGameController extends Component {
  @property(Label) scoreLabel:Label|null=null;
  @property(Label) rankLabel:Label|null=null;
  private objects:SemanticObject[]=[]; private answers=new Set<string>();
  private anomalyAt:number|null=null; private falseTaps=0; private prematureTaps=0; private replays=0;
  private observations:RoundObservation[]=[];

  onEnable(){input.on(Input.EventType.TOUCH_END,this.onTouch,this);}
  onDisable(){input.off(Input.EventType.TOUCH_END,this.onTouch,this);}
  configure(objects:SemanticObject[],answers:string[]){this.objects=objects;this.answers=new Set(answers);this.anomalyAt=null;this.falseTaps=0;this.prematureTaps=0;this.replays=0;}
  markAnomalyVisible(){this.anomalyAt=performance.now();}
  markReplay(){this.replays++;}

  private onTouch(e:EventTouch){
    const raw=e.getUILocation();
    const visible=view.getVisibleSize();
    const p=screenToDesign({x:raw.x,y:raw.y},{width:visible.width,height:visible.height},DESIGN);
    if(this.anomalyAt===null){this.prematureTaps++;this.node.emit('premature-tap',{point:p});return;}
    const object=semanticHit(p,this.objects);
    if(!object||!this.answers.has(object.id)){this.falseTaps++;this.node.emit('false-tap',{point:p,objectId:object?.id??null});return;}
    const observation:RoundObservation={correct:true,reactionMs:performance.now()-this.anomalyAt,falseTaps:this.falseTaps,prematureTaps:this.prematureTaps,replays:this.replays};
    this.observations.push(observation);
    const result=scoreSession(this.observations);
    if(this.scoreLabel)this.scoreLabel.string=String(result.total);
    if(this.rankLabel)this.rankLabel.string=result.rank;
    this.node.emit('round-solved',{objectId:object.id,observation,result});
  }
}
