import { _decorator, Component, JsonAsset, resources } from 'cc';
import { createSession, startSession, completeRound, nextRound, type SessionState } from '../domain/Session';
import type { LayeredSceneManifest } from '../domain/SceneManifest';
import type { RoundObservation } from '../domain/PerceptionScore';
import { LayeredSceneRenderer } from './LayeredSceneRenderer';
import { ResultCardController } from './ResultCardController';
const {ccclass,property}=_decorator;

const SCENES=['extra-shadow','early-splash','color-theft'];

@ccclass('ReferenceGameFlow')
export class ReferenceGameFlow extends Component {
  @property(LayeredSceneRenderer) renderer:LayeredSceneRenderer|null=null;
  @property(ResultCardController) result:ResultCardController|null=null;
  private session:SessionState=createSession();
  private observations:RoundObservation[]=[];

  async start(){this.session=startSession(createSession());this.observations=[];if(this.result)this.result.hide();await this.loadRound(0);}
  async acceptRoundObservation(o:RoundObservation){
    this.observations.push(o);this.session=completeRound(this.session,o,SCENES.length);
    if(this.session.phase==='session_result'){
      this.result?.show(this.session.score,this.observations);
      return;
    }
    this.session=nextRound(this.session);await this.loadRound(this.session.roundIndex);
  }
  async replay(){await this.loadRound(this.session.roundIndex);}
  private async loadRound(index:number){const manifest=await this.loadManifest(SCENES[index]);await this.renderer?.load(manifest);this.node.emit('round-loaded',{index,id:manifest.id,anomalyAtMs:manifest.anomalyAtMs});}
  private loadManifest(id:string):Promise<LayeredSceneManifest>{return new Promise((resolve,reject)=>resources.load(`scenes/${id}`,JsonAsset,(err,asset)=>err?reject(err):resolve(asset.json as unknown as LayeredSceneManifest)));}
}
