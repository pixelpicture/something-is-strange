import { Color, Graphics, Node, UITransform } from 'cc';

export function roundedPanel(parent:Node,name:string,x:number,y:number,width:number,height:number,radius:number,fill:Color,z=0):Node {
  const node=new Node(name);
  parent.addChild(node);
  node.setPosition(x,y,z);
  node.addComponent(UITransform).setContentSize(width,height);
  const g=node.addComponent(Graphics);
  g.fillColor=fill;
  g.roundRect(-width/2,-height/2,width,height,radius);
  g.fill();
  return node;
}
