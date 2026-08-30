import { _decorator, Component, Node, Sprite, SpriteFrame, resources, tween, Vec3, UITransform } from 'cc';
import type { LayeredSceneManifest, TimelineCommand } from '../domain/SceneManifest';
const {ccclass}=_decorator;

@ccclass('LayeredSceneRenderer')
export class LayeredSceneRenderer extends Component {
  private actorNodes=new Map<string,Node>();
  private manifest:LayeredSceneManifest|null=null;

  async load(manifest:LayeredSceneManifest){
    this.clear(); this.manifest=manifest;
    const frames=new Map<string,SpriteFrame>();
    for(const asset of manifest.assets){frames.set(asset.id,await this.loadFrame(asset.path));}
    for(const actor of [...manifest.actors].sort((a,b)=>a.z-b.z)){
      const node=new Node(actor.id); const sprite=node.addComponent(Sprite); const ui=node.addComponent(UITransform);
      const state=actor.states[actor.initialState]; const frame=frames.get(state.assetId); if(!frame)throw new Error(`missing frame ${state.assetId}`);
      sprite.spriteFrame=frame; node.setPosition(actor.x-manifest.canvas.width/2,actor.y-manifest.canvas.height/2,actor.z);
      node.setScale(actor.scale??1,actor.scale??1,1); node.setRotationFromEuler(0,0,actor.rotation??0); node.active=state.visible!==false;
      ui.setContentSize(frame.originalSize); this.node.addChild(node); this.actorNodes.set(actor.id,node);
    }
    for(const event of manifest.timeline)this.scheduleOnce(()=>this.apply(event,frames),event.atMs/1000);
  }
  clear(){this.unscheduleAllCallbacks();for(const n of this.actorNodes.values())n.destroy();this.actorNodes.clear();this.manifest=null;}
  private apply(e:TimelineCommand,frames:Map<string,SpriteFrame>){const n=this.actorNodes.get(e.actorId);if(!n)return;
    if(e.command==='state'){const actor=this.manifest!.actors.find(a=>a.id===e.actorId)!;const s=actor.states[String(e.value)];const sprite=n.getComponent(Sprite)!;const frame=frames.get(s.assetId);if(frame)sprite.spriteFrame=frame;n.active=s.visible!==false;return;}
    if(e.command==='opacity'){const sprite=n.getComponent(Sprite)!;sprite.color=sprite.color.clone();sprite.color.a=Number(e.value);return;}
    if(e.command==='rotate'){n.setRotationFromEuler(0,0,Number(e.value));return;}
    if(e.command==='move'&&typeof e.value==='object'){const v=e.value as {x:number;y:number;durationMs:number};tween(n).to(v.durationMs/1000,{position:new Vec3(v.x-this.manifest!.canvas.width/2,v.y-this.manifest!.canvas.height/2,n.position.z)}).start();}
  }
  private loadFrame(path:string):Promise<SpriteFrame>{return new Promise((resolve,reject)=>resources.load(path.replace(/\.(webp|png)$/,''),SpriteFrame,(err,frame)=>err?reject(err):resolve(frame)));}
}
