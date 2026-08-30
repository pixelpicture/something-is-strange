import { _decorator, Component, Node, Canvas, UITransform, Label, Color, Button } from 'cc';
import { LayeredSceneRenderer } from './LayeredSceneRenderer';
import { ReferenceGameController } from './ReferenceGameController';
import { ReferenceGameFlow } from './ReferenceGameFlow';
import { ResultCardController } from './ResultCardController';
import { roundedPanel } from './UiChrome';
const { ccclass } = _decorator;

@ccclass('PlayableBootstrap')
export class PlayableBootstrap extends Component {
  async start() {
    const canvasNode = new Node('Canvas');
    canvasNode.addComponent(Canvas);
    const canvasTransform = canvasNode.addComponent(UITransform);
    canvasTransform.setContentSize(1080, 1920);
    this.node.addChild(canvasNode);

    const gameplayNode = new Node('Gameplay');
    canvasNode.addChild(gameplayNode);
    const renderer = gameplayNode.addComponent(LayeredSceneRenderer);
    const controller = gameplayNode.addComponent(ReferenceGameController);

    roundedPanel(canvasNode,'HUDChrome',0,850,1030,150,34,new Color(9,14,20,205),2);
    const hudNode = new Node('HUD');
    canvasNode.addChild(hudNode);
    const score = this.label(hudNode, 'Score', -380, 850, 42, '0');
    const rank = this.label(hudNode, 'Rank', 320, 850, 42, '—');
    this.label(hudNode,'Hook',0,760,34,"FIND WHAT'S WRONG");
    controller.scoreLabel = score;
    controller.rankLabel = rank;

    const resultNode = new Node('ResultCard');
    canvasNode.addChild(resultNode);
    roundedPanel(resultNode,'ResultDim',0,0,1080,1920,0,new Color(4,7,10,225),0);
    roundedPanel(resultNode,'ResultPanel',0,40,900,920,48,new Color(18,25,34,250),2);
    const result = resultNode.addComponent(ResultCardController);
    result.titleLabel = this.label(resultNode, 'ResultTitle', 0, 310, 40);
    result.scoreLabel = this.label(resultNode, 'ResultScore', 0, 210, 78);
    result.rankLabel = this.label(resultNode, 'ResultRank', 0, 115, 54);
    result.reactionLabel = this.label(resultNode, 'Reaction', 0, 25, 38);
    result.falseAlarmLabel = this.label(resultNode, 'FalseTaps', 0, -45, 36);
    result.bestLabel = this.label(resultNode, 'Best', 0, -115, 38);
    const cta = this.button(resultNode, 'Continue', 0, -255, 660, 120, 44);
    result.continueButton = cta.button;
    result.ctaLabel = cta.label;
    result.hide();

    const flow = this.node.addComponent(ReferenceGameFlow);
    flow.renderer = renderer;
    flow.controller = controller;
    flow.result = result;
    cta.node.on(Button.EventType.CLICK,()=>{void flow.start();});
    await flow.start();
  }

  private label(parent: Node, name: string, x: number, y: number, size: number, text=name): Label {
    const n = new Node(name);
    parent.addChild(n);
    n.setPosition(x, y, 10);
    const ui = n.addComponent(UITransform);
    ui.setContentSize(700, 90);
    const label = n.addComponent(Label);
    label.string = text;
    label.fontSize = size;
    label.lineHeight = Math.round(size * 1.15);
    label.color = new Color(255,255,255,255);
    return label;
  }

  private button(parent:Node,name:string,x:number,y:number,width:number,height:number,size:number){
    const node=roundedPanel(parent,name,x,y,width,height,30,new Color(240,109,68,255),20);
    const button=node.addComponent(Button);
    const label=this.label(node,`${name}Label`,0,0,size,'↻  BEAT YOUR BEST');
    return {node,button,label};
  }
}
