import { _decorator, Component, JsonAsset, resources } from 'cc';
import { createSession, startSession, completeRound, nextRound, type SessionState } from '../domain/Session';
import type { LayeredSceneManifest } from '../domain/SceneManifest';
import type { RoundObservation } from '../domain/PerceptionScore';
import type { SemanticObject } from '../domain/SemanticHit';
import { LayeredSceneRenderer } from './LayeredSceneRenderer';
import { ResultCardController } from './ResultCardController';
import { ReferenceGameController } from './ReferenceGameController';
const {ccclass,property}=_decorator;
const SCENES=['extra-shadow','early-splash','color-theft'];

@ccclass('ReferenceGameFlow')
export class ReferenceGameFlow extends Component {
  @property(LayeredSceneRenderer) renderer:LayeredSceneRenderer|null=null;
  @property(ResultCardController) result:ResultCardController|null=null;
  @property(ReferenceGameController) controller:ReferenceGameController|null=null;
  private session:SessionState=createSession();
  private observations:RoundObservation[]=[];
  private anomalyCallback:(()=>void)|null=null;
  private boundController:ReferenceGameController|null=null;

  onDisable(){this.unbindController();this.cancelAnomaly();}

  async start(){
    this.bindController();
    this.controller?.resetSession();
    this.session=startSession(createSession());
    this.observations=[];
    this.result?.hide();
    await this.loadRound(0,false);
  }

  private bindController(){
    if(this.boundController===this.controller)return;
    this.unbindController();
    if(this.controller){this.controller.node.on('round-solved',this.onRoundSolved,this);this.boundController=this.controller;}
  }
  private unbindController(){if(this.boundController){this.boundController.node.off('round-solved',this.onRoundSolved,this);this.boundController=null;}}

  private async onRoundSolved(payload:{observation:RoundObservation}){await this.acceptRoundObservation(payload.observation);}

  private async acceptRoundObservation(o:RoundObservation){
    this.cancelAnomaly();
    this.observations.push(o);
    this.session=completeRound(this.session,o,SCENES.length);
    if(this.session.phase==='session_result'){
      this.result?.show(this.session.score,this.observations);
      this.node.emit('session-result',this.session.score);
      return;
    }
    this.session=nextRound(this.session);
    await this.loadRound(this.session.roundIndex,false);
  }

  async replay(){
    this.controller?.markReplay();
    await this.loadRound(this.session.roundIndex,true);
  }

  private async loadRound(index:number,preserveRoundCounters:boolean){
    this.cancelAnomaly();
    const manifest=await this.loadManifest(SCENES[index]);
    const objects:SemanticObject[]=manifest.actors.flatMap(a=>a.semantic?[a.semantic]:[]);
    this.controller?.configure(objects,manifest.answerObjectIds,preserveRoundCounters);
    await this.renderer?.load(manifest);
    this.anomalyCallback=()=>{this.controller?.markAnomalyVisible();this.node.emit('anomaly-visible',{id:manifest.id});};
    this.scheduleOnce(this.anomalyCallback,manifest.anomalyAtMs/1000);
    this.node.emit('round-loaded',{index,id:manifest.id,anomalyAtMs:manifest.anomalyAtMs});
  }

  private cancelAnomaly(){if(this.anomalyCallback){this.unschedule(this.anomalyCallback);this.anomalyCallback=null;}}
  private loadManifest(id:string):Promise<LayeredSceneManifest>{return new Promise((resolve,reject)=>resources.load(`scenes/${id}.scene`,JsonAsset,(err,asset)=>err?reject(err):resolve(asset.json as unknown as LayeredSceneManifest)));}
}
