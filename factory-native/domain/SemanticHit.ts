export type Point={x:number;y:number};
export type Polygon=[number,number][];
export interface SemanticObject { id:string; z?:number; interactive?:boolean; touchExpansionPx?:number; hitPolygons:Polygon[]; }
function inside(p:Point,poly:Polygon){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];const cross=((yi>p.y)!=(yj>p.y))&&(p.x<(xj-xi)*(p.y-yi)/((yj-yi)||Number.EPSILON)+xi);if(cross)yes=!yes;}return yes;}
function seg(p:Point,a:[number,number],b:[number,number]){const vx=b[0]-a[0],vy=b[1]-a[1],wx=p.x-a[0],wy=p.y-a[1],c1=vx*wx+vy*wy;if(c1<=0)return Math.hypot(p.x-a[0],p.y-a[1]);const c2=vx*vx+vy*vy;if(c2<=c1)return Math.hypot(p.x-b[0],p.y-b[1]);const t=c1/c2;return Math.hypot(p.x-(a[0]+t*vx),p.y-(a[1]+t*vy));}
export function hits(p:Point,o:SemanticObject){const e=Math.max(0,o.touchExpansionPx||0);return o.hitPolygons.some(poly=>inside(p,poly)||(e>0&&poly.some((a,i)=>seg(p,a,poly[(i+1)%poly.length])<=e)));}
export function semanticHit(p:Point,objects:SemanticObject[]){return [...objects].filter(o=>o.interactive!==false&&hits(p,o)).sort((a,b)=>(b.z||0)-(a.z||0))[0]||null;}
