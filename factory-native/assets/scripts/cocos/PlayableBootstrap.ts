import { _decorator, Component, Node, Canvas, UITransform, Label, Color, Button } from 'cc';
import { LayeredSceneRenderer } from './LayeredSceneRenderer';
import { ReferenceGameController } from './ReferenceGameController';
import { ReferenceGameFlow } from './ReferenceGameFlow';
import { ResultCardController } from './ResultCardController';
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

    const hudNode = new Node('HUD');
    canvasNode.addChild(hudNode);
    const score = this.label(hudNode, 'Score', -420, 850, 42);
    const rank = this.label(hudNode, 'Rank', 300, 850, 42);
    controller.scoreLabel = score;
    controller.rankLabel = rank;

    const resultNode = new Node('ResultCard');
    canvasNode.addChild(resultNode);
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

  private label(parent: Node, name: string, x: number, y: number, size: number): Label {
    const n = new Node(name);
    parent.addChild(n);
    n.setPosition(x, y, 10);
    const ui = n.addComponent(UITransform);
    ui.setContentSize(700, 90);
    const label = n.addComponent(Label);
    label.string = name;
    label.fontSize = size;
    label.lineHeight = Math.round(size * 1.15);
    label.color = new Color(255,255,255,255);
    return label;
  }

  private button(parent:Node,name:string,x:number,y:number,width:number,height:number,size:number){
    const node=new Node(name); parent.addChild(node); node.setPosition(x,y,20);
    const ui=node.addComponent(UITransform); ui.setContentSize(width,height);
    const button=node.addComponent(Button);
    const label=node.addComponent(Label); label.string='↻  BEAT YOUR BEST'; label.fontSize=size; label.lineHeight=Math.round(size*1.15); label.color=new Color(255,255,255,255);
    return {node,button,label};
  }
}
