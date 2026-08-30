#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import argparse, json

W,H=1080,1920

def save(im,p): p.parent.mkdir(parents=True,exist_ok=True); im.convert('RGBA').save(p,'PNG',optimize=True)
def q(im): return im.convert('RGBA').quantize(colors=160,method=Image.Quantize.FASTOCTREE).convert('RGBA')

def park(out):
 im=Image.new('RGBA',(W,H),(53,91,105,255)); d=ImageDraw.Draw(im)
 for y in range(H):
  if y<900: t=y/900; c=(int(48+70*t),int(83+72*t),int(108+70*t),255)
  else: t=(y-900)/(H-900); c=(int(74-18*t),int(111-25*t),int(94-22*t),255)
  d.line((0,y,W,y),fill=c)
 for x in range(-40,1120,120): d.ellipse((x,650,x+180,980),fill=(38,76,64,255)); d.rectangle((x+78,810,x+100,1120),fill=(78,64,49,255))
 d.polygon([(0,1180),(1080,1050),(1080,1920),(0,1920)],fill=(70,95,77,255)); d.polygon([(110,1920),(430,1075),(700,1070),(1000,1920)],fill=(156,145,122,255))
 d.rounded_rectangle((90,1120,330,1170),15,fill=(86,62,42,255)); d.rectangle((930,760,946,1130),fill=(38,42,48,255)); d.ellipse((900,720,976,790),fill=(255,215,145,220))
 save(q(im),out/'extra-shadow/park.png')

def person(shirt,pants,hair,flip=False):
 im=Image.new('RGBA',(260,620),(0,0,0,0)); d=ImageDraw.Draw(im); skin=(224,174,134,255)
 d.rounded_rectangle((78,380,118,575),18,fill=pants); d.rounded_rectangle((140,380,180,575),18,fill=pants); d.ellipse((68,552,123,600),fill=(44,48,55,255)); d.ellipse((137,552,192,600),fill=(44,48,55,255))
 d.rounded_rectangle((55,180,205,410),44,fill=shirt); d.rounded_rectangle((38,210,78,410),18,fill=skin); d.rounded_rectangle((182,210,222,410),18,fill=skin); d.rectangle((112,145,148,205),fill=skin); d.ellipse((83,50,177,164),fill=skin); d.pieslice((80,42,180,145),180,360,fill=hair)
 return im.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else im

def shadow(size,extra=False):
 w,h=size; m=Image.new('L',size,0); d=ImageDraw.Draw(m); cx=w*.5
 d.ellipse((cx-48,50,cx+48,145),fill=205); d.polygon([(cx-55,130),(cx+58,130),(cx+85,h*.55),(cx+42,h*.64),(cx+25,h-30),(cx-10,h-22),(cx-20,h*.66),(cx-75,h*.56)],fill=205)
 if extra: d.polygon([(cx+42,h*.52),(w-18,h*.72),(w-34,h*.78),(cx+20,h*.62)],fill=180)
 m=m.filter(ImageFilter.GaussianBlur(14)); col=Image.new('RGBA',size,(24,25,31,0)); col.putalpha(m); return col

def pool(out):
 im=Image.new('RGBA',(W,H),(50,102,132,255)); d=ImageDraw.Draw(im)
 for y in range(H):
  if y<850: t=y/850; c=(int(95+65*t),int(166+48*t),int(191+42*t),255)
  else: t=(y-850)/(H-850); c=(int(30-8*t),int(132-28*t),int(171-35*t),255)
  d.line((0,y,W,y),fill=c)
 d.rectangle((0,820,W,1050),fill=(194,177,143,255)); d.rectangle((0,1000,W,1085),fill=(232,225,207,255))
 for y in range(1120,1880,120):
  for x in range(40,1040,260): d.arc((x,y,x+180,y+55),0,180,fill=(123,211,231,255),width=4)
 save(q(im),out/'early-splash/pool.png')
 ball=Image.new('RGBA',(180,180),(0,0,0,0)); b=ImageDraw.Draw(ball); b.ellipse((12,12,168,168),fill=(245,116,56,255)); b.pieslice((22,22,158,158),210,330,fill=(252,212,92,255)); b.ellipse((38,32,75,68),fill=(255,255,255,95)); save(q(ball),out/'early-splash/ball.png')
 sp=Image.new('RGBA',(520,430),(0,0,0,0)); s=ImageDraw.Draw(sp); s.polygon([(55,330),(95,245),(145,285),(180,170),(220,260),(260,105),(305,255),(360,150),(390,280),(452,225),(475,340)],fill=(205,244,255,220)); s.ellipse((55,280,475,410),fill=(179,232,248,180))
 for cx,cy,r in [(155,115,20),(250,52,24),(370,88,18),(90,180,15),(430,155,13),(315,40,10)]: s.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(225,250,255,240))
 save(q(sp.filter(ImageFilter.GaussianBlur(1.0))),out/'early-splash/splash.png')

def table(out):
 im=Image.new('RGBA',(W,H),(82,73,70,255)); d=ImageDraw.Draw(im); d.rounded_rectangle((70,190,1010,840),38,fill=(111,105,102,255),outline=(139,131,124,255),width=7); d.rectangle((170,270,440,650),fill=(63,91,104,255)); d.polygon([(60,1290),(1020,1290),(1080,1920),(0,1920)],fill=(111,72,45,255)); d.rectangle((0,1260,W,1320),fill=(151,101,62,255)); save(q(im),out/'color-theft/table.png')
 def vase(color):
  v=Image.new('RGBA',(300,560),(0,0,0,0)); x=ImageDraw.Draw(v); x.ellipse((38,500,262,548),fill=(20,18,18,70)); x.polygon([(110,35),(190,35),(195,105),(228,165),(250,430),(218,505),(82,505),(50,430),(72,165),(105,105)],fill=color); x.rounded_rectangle((98,20,202,68),18,fill=tuple(min(255,c+20) for c in color[:3])+(255,)); return v
 def ball(c):
  b=Image.new('RGBA',(170,170),(0,0,0,0)); x=ImageDraw.Draw(b); x.ellipse((8,8,162,162),fill=c); x.ellipse((32,25,70,60),fill=(255,255,255,95)); return b
 save(q(vase((212,204,180,255))),out/'color-theft/vase-pale.png'); save(q(vase((198,62,52,255))),out/'color-theft/vase-red.png'); save(q(ball((206,58,50,255))),out/'color-theft/ball-red.png'); save(q(ball((216,209,188,255))),out/'color-theft/ball-pale.png')

def actor_state_at(actor,t,timeline):
 state=actor['initialState']; x=float(actor['x']); y=float(actor['y']); moves=[]
 for e in sorted((e for e in timeline if e['actorId']==actor['id']),key=lambda e:e['atMs']):
  at=e['atMs']; cmd=e['command']
  if cmd=='state' and t>=at: state=str(e['value'])
  elif cmd=='move':
   v=e['value']; end=at+v['durationMs']; sx,sy=x,y
   if t>=end: x,y=float(v['x']),float(v['y'])
   elif t>=at:
    f=(t-at)/v['durationMs']; x=sx+(float(v['x'])-sx)*f; y=sy+(float(v['y'])-sy)*f
 return state,x,y

def render_manifest(manifest,root,t):
 assets={a['id']:a for a in manifest['assets']}; canvas=Image.new('RGBA',(W,H),(0,0,0,255))
 for actor in sorted(manifest['actors'],key=lambda a:a['z']):
  state,x,y=actor_state_at(actor,t,manifest['timeline']); st=actor['states'][state]
  if st.get('visible',True) is False: continue
  asset=assets[st['assetId']]; sprite=Image.open(root/asset['path']).convert('RGBA'); scale=float(actor.get('scale',1));
  if scale!=1: sprite=sprite.resize((round(sprite.width*scale),round(sprite.height*scale)),Image.Resampling.LANCZOS)
  if actor.get('rotation',0): sprite=sprite.rotate(-float(actor['rotation']),expand=True,resample=Image.Resampling.BICUBIC)
  left=round(x-sprite.width/2); top=round(H-y-sprite.height/2); canvas.alpha_composite(sprite,(left,top))
 return canvas

def evidence(root,scene_root,out):
 out.mkdir(parents=True,exist_ok=True)
 for p in sorted(scene_root.glob('*.scene.json')):
  m=json.loads(p.read_text()); anomaly=m['anomalyAtMs']; end=max([anomaly]+[e['atMs']+(e.get('value',{}).get('durationMs',0) if isinstance(e.get('value'),dict) else 0) for e in m['timeline']])
  for label,t in [('before',max(0,anomaly-250)),('anomaly',anomaly),('after',end+100)]: save(q(render_manifest(m,root,t)),out/f"{m['id']}-{label}.png")

if __name__=='__main__':
 ap=argparse.ArgumentParser(); ap.add_argument('--output-root',default='factory-native/assets/resources/assets'); ap.add_argument('--scene-root',default='factory-native/assets/resources/scenes'); ap.add_argument('--evidence-dir',default='evidence/native-visual-v1'); a=ap.parse_args(); out=Path(a.output_root)
 park(out); save(q(person((208,112,64,255),(46,60,77,255),(58,39,29,255))),out/'extra-shadow/person-a.png'); save(q(person((63,137,162,255),(55,52,68,255),(38,30,26,255),True)),out/'extra-shadow/person-b.png'); save(q(shadow((360,520))),out/'extra-shadow/shadow-natural.png'); save(q(shadow((380,560),True)),out/'extra-shadow/shadow-impossible.png'); pool(out); table(out); evidence(out,Path(a.scene_root),Path(a.evidence_dir)); print('NATIVE_VISUAL_ASSETS_GENERATED_FROM_MANIFESTS')
