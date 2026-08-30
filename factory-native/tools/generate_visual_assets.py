#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import argparse, json, math, random

W,H=1080,1920
random.seed(17)

def save(im,p): p.parent.mkdir(parents=True,exist_ok=True); im.convert('RGBA').save(p,'PNG',optimize=True)
def q(im): return im.convert('RGBA').quantize(colors=192,method=Image.Quantize.FASTOCTREE).convert('RGBA')
def gradient(top,bottom):
 im=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(im)
 for y in range(H):
  t=y/(H-1); c=tuple(round(top[i]*(1-t)+bottom[i]*t) for i in range(3))+(255,); d.line((0,y,W,y),fill=c)
 return im

def park(out):
 im=gradient((20,39,57),(75,103,82)); d=ImageDraw.Draw(im,'RGBA')
 # dusk glow gives one unambiguous dominant light source
 d.ellipse((790,125,1010,345),fill=(255,201,111,55)); d.ellipse((842,177,958,293),fill=(255,222,155,150))
 # layered distant canopy
 for layer,(yy,a) in enumerate([(660,90),(760,150),(850,220)]):
  for x in range(-100,1180,105):
   r=110+layer*18; d.ellipse((x-r,yy-r,x+r,yy+r),fill=(20+layer*6,55+layer*7,48+layer*5,a))
 for x in range(35,1060,145):
  d.rounded_rectangle((x,710,x+24,1170),9,fill=(48,49,43,230)); d.ellipse((x-80,630,x+115,850),fill=(30,72,58,235))
 # ground and strong perspective path
 d.polygon([(0,1050),(1080,980),(1080,1920),(0,1920)],fill=(58,84,66,255)); d.polygon([(455,1010),(625,1010),(1020,1920),(80,1920)],fill=(166,151,122,255))
 for y in range(1080,1900,105):
  t=(y-1010)/910; half=90+390*t; d.line((540-half,y,540+half,y),fill=(202,187,151,45),width=max(2,int(8*t)))
 # foreground vignette and practical lamp
 d.rounded_rectangle((88,1080,352,1138),15,fill=(75,49,32,255)); d.rectangle((930,705,948,1120),fill=(31,34,39,255)); d.ellipse((890,662,988,760),fill=(255,218,145,235)); d.ellipse((855,625,1020,790),fill=(255,210,125,40))
 vig=Image.new('L',(W,H),0); vd=ImageDraw.Draw(vig); vd.rectangle((0,0,W,H),fill=115); vd.ellipse((-130,-120,W+130,H+180),fill=0); shade=Image.new('RGBA',(W,H),(4,9,15,0)); shade.putalpha(vig.filter(ImageFilter.GaussianBlur(90))); im=Image.alpha_composite(im,shade)
 save(q(im),out/'extra-shadow/park.png')

def person(shirt,pants,hair,flip=False):
 im=Image.new('RGBA',(260,620),(0,0,0,0)); d=ImageDraw.Draw(im); skin=(224,174,134,255)
 d.ellipse((57,565,128,606),fill=(12,17,24,80)); d.ellipse((132,565,203,606),fill=(12,17,24,80))
 d.rounded_rectangle((78,380,118,575),18,fill=pants); d.rounded_rectangle((140,380,180,575),18,fill=pants); d.ellipse((68,552,123,600),fill=(35,39,47,255)); d.ellipse((137,552,192,600),fill=(35,39,47,255))
 d.rounded_rectangle((55,180,205,410),44,fill=shirt); d.polygon([(56,235),(25,360),(57,374),(83,270)],fill=skin); d.polygon([(204,235),(235,350),(204,365),(178,270)],fill=skin); d.rectangle((112,145,148,205),fill=skin); d.ellipse((83,50,177,164),fill=skin); d.pieslice((80,42,180,145),180,360,fill=hair); d.arc((103,105,157,142),10,170,fill=(116,72,58,180),width=3)
 return im.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else im

def shadow(size,extra=False):
 w,h=size; m=Image.new('L',size,0); d=ImageDraw.Draw(m); cx=w*.5
 d.ellipse((cx-48,50,cx+48,145),fill=190); d.polygon([(cx-55,130),(cx+58,130),(cx+85,h*.55),(cx+42,h*.64),(cx+25,h-30),(cx-10,h-22),(cx-20,h*.66),(cx-75,h*.56)],fill=190)
 if extra: d.polygon([(cx+42,h*.52),(w-18,h*.72),(w-34,h*.78),(cx+20,h*.62)],fill=175)
 m=m.filter(ImageFilter.GaussianBlur(18)); col=Image.new('RGBA',size,(12,17,25,0)); col.putalpha(m); return col

def pool(out):
 im=gradient((42,121,160),(12,71,111)); d=ImageDraw.Draw(im,'RGBA')
 d.rectangle((0,720,W,1015),fill=(205,188,154,255)); d.rectangle((0,975,W,1070),fill=(238,230,210,255)); d.rectangle((0,1068,W,H),fill=(17,117,158,255))
 # tile seams + pool depth bands
 for x in range(0,W,180): d.line((x,720,x,1015),fill=(146,132,110,120),width=3)
 for y in range(1110,1900,110):
  d.line((0,y,W,y+24),fill=(103,205,229,70),width=5)
  for x in range(30,1080,250): d.arc((x,y-30,x+190,y+35),5,175,fill=(181,239,248,120),width=4)
 d.rectangle((0,695,W,720),fill=(255,245,217,110)); d.ellipse((55,120,1025,930),fill=(255,232,171,18))
 save(q(im),out/'early-splash/pool.png')
 ball=Image.new('RGBA',(180,180),(0,0,0,0)); b=ImageDraw.Draw(ball); b.ellipse((12,16,168,172),fill=(245,96,43,255),outline=(174,58,29,255),width=5); b.pieslice((22,26,158,162),205,330,fill=(252,205,72,255)); b.ellipse((38,34,76,70),fill=(255,255,255,125)); save(q(ball),out/'early-splash/ball.png')
 sp=Image.new('RGBA',(520,430),(0,0,0,0)); s=ImageDraw.Draw(sp); s.polygon([(42,338),(92,238),(142,286),(178,145),(222,260),(262,74),(308,252),(364,126),(397,282),(458,205),(490,342)],fill=(213,248,255,225)); s.ellipse((45,278,490,414),fill=(169,231,249,195))
 for cx,cy,r in [(150,102,21),(252,40,25),(371,75,18),(82,170,15),(442,142,14),(316,30,10)]: s.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(238,253,255,245))
 save(q(sp.filter(ImageFilter.GaussianBlur(.7))),out/'early-splash/splash.png')

def table(out):
 im=gradient((37,42,51),(84,66,60)); d=ImageDraw.Draw(im,'RGBA')
 # framed wall + warm side light
 d.rounded_rectangle((68,180,1012,845),40,fill=(77,79,84,255),outline=(145,128,108,210),width=8); d.rectangle((150,260,450,665),fill=(36,67,83,255),outline=(186,161,122,180),width=9); d.polygon([(178,625),(292,410),(410,625)],fill=(57,101,111,255)); d.ellipse((248,325,330,407),fill=(221,180,107,220)); d.ellipse((760,120,1120,760),fill=(255,185,96,32))
 # table perspective + grain
 d.polygon([(42,1265),(1038,1265),(1080,1920),(0,1920)],fill=(105,64,39,255)); d.rectangle((0,1240,W,1310),fill=(151,96,55,255))
 for y in range(1360,1900,105): d.line((0,y,W,y+20),fill=(190,121,69,45),width=5)
 save(q(im),out/'color-theft/table.png')
 def vase(color):
  v=Image.new('RGBA',(300,560),(0,0,0,0)); x=ImageDraw.Draw(v); x.ellipse((34,495,266,552),fill=(9,9,12,85)); x.polygon([(110,35),(190,35),(195,105),(228,165),(250,430),(218,505),(82,505),(50,430),(72,165),(105,105)],fill=color,outline=(63,48,43,180)); x.rounded_rectangle((98,20,202,68),18,fill=tuple(min(255,c+20) for c in color[:3])+(255,)); x.polygon([(90,145),(115,115),(110,455),(88,440)],fill=(255,255,255,42)); return v
 def ball(c):
  b=Image.new('RGBA',(170,170),(0,0,0,0)); x=ImageDraw.Draw(b); x.ellipse((7,10,163,166),fill=c,outline=(74,48,43,190),width=4); x.ellipse((30,27,72,65),fill=(255,255,255,120)); return b
 save(q(vase((214,207,183,255))),out/'color-theft/vase-pale.png'); save(q(vase((203,55,45,255))),out/'color-theft/vase-red.png'); save(q(ball((211,48,41,255))),out/'color-theft/ball-red.png'); save(q(ball((220,214,192,255))),out/'color-theft/ball-pale.png')

def actor_state_at(actor,t,timeline):
 state=actor['initialState']; x=float(actor['x']); y=float(actor['y'])
 for e in sorted((e for e in timeline if e['actorId']==actor['id']),key=lambda e:e['atMs']):
  at=e['atMs']; cmd=e['command']
  if cmd=='state' and t>=at: state=str(e['value'])
  elif cmd=='move':
   v=e['value']; end=at+v['durationMs']; sx,sy=x,y
   if t>=end: x,y=float(v['x']),float(v['y'])
   elif t>=at:
    f=(t-at)/v['durationMs']; x=sx+(float(v['x'])-sx)*f; y=sy+(float(v['y'])-sy)*f
 return state,x,y

def render_manifest(manifest,asset_root,t):
 assets={a['id']:a for a in manifest['assets']}; canvas=Image.new('RGBA',(W,H),(0,0,0,255))
 for actor in sorted(manifest['actors'],key=lambda a:a['z']):
  state,x,y=actor_state_at(actor,t,manifest['timeline']); st=actor['states'][state]
  if st.get('visible',True) is False: continue
  asset=assets[st['assetId']]; sprite=Image.open(asset_root.parent/asset['path']).convert('RGBA'); scale=float(actor.get('scale',1))
  if scale!=1: sprite=sprite.resize((round(sprite.width*scale),round(sprite.height*scale)),Image.Resampling.LANCZOS)
  if actor.get('rotation',0): sprite=sprite.rotate(-float(actor['rotation']),expand=True,resample=Image.Resampling.BICUBIC)
  left=round(x-sprite.width/2); top=round(H-y-sprite.height/2); canvas.alpha_composite(sprite,(left,top))
 return canvas

def semantic_coverage(manifest,asset_root,t):
 base=render_manifest(manifest,asset_root,t).convert('RGBA'); overlay=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(overlay,'RGBA'); answers=set(manifest['answerObjectIds'])
 for actor in manifest['actors']:
  sem=actor.get('semantic')
  if not sem or sem['id'] not in answers: continue
  expansion=max(0,int(round(float(sem.get('touchExpansionPx',0)))))
  for poly in sem['hitPolygons']:
   pts=[(round(x),round(H-y)) for x,y in poly]
   if expansion: d.line(pts+[pts[0]],fill=(44,255,164,72),width=expansion*2,joint='curve')
   d.polygon(pts,fill=(44,255,164,52)); d.line(pts+[pts[0]],fill=(44,255,164,235),width=5,joint='curve')
 d.rounded_rectangle((32,H-116,W-32,H-30),22,fill=(7,11,16,210)); d.text((58,H-94),'GREEN = answer polygon; glow = runtime touch tolerance',fill=(232,242,247,255)); return Image.alpha_composite(base,overlay)

def evidence(asset_root,scene_root,out):
 out.mkdir(parents=True,exist_ok=True)
 for p in sorted(scene_root.glob('*.scene.json')):
  m=json.loads(p.read_text()); anomaly=m['anomalyAtMs']; baseline=m['evidenceBaselineAtMs']; end=max([anomaly]+[e['atMs']+(e.get('value',{}).get('durationMs',0) if isinstance(e.get('value'),dict) else 0) for e in m['timeline']])
  for label,t in [('before',baseline),('anomaly',anomaly),('after',end+100)]: save(q(render_manifest(m,asset_root,t)),out/f"{m['id']}-{label}.png")
  save(q(semantic_coverage(m,asset_root,anomaly)),out/f"{m['id']}-tap-coverage.png")

if __name__=='__main__':
 ap=argparse.ArgumentParser(); ap.add_argument('--output-root',default='factory-native/assets/resources/assets'); ap.add_argument('--scene-root',default='factory-native/assets/resources/scenes'); ap.add_argument('--evidence-dir',default='evidence/native-visual-v1'); a=ap.parse_args(); out=Path(a.output_root)
 park(out); save(q(person((209,105,58,255),(42,55,73,255),(52,34,26,255))),out/'extra-shadow/person-a.png'); save(q(person((55,137,165,255),(48,47,65,255),(34,27,24,255),True)),out/'extra-shadow/person-b.png'); save(q(shadow((360,520))),out/'extra-shadow/shadow-natural.png'); save(q(shadow((380,560),True)),out/'extra-shadow/shadow-impossible.png'); pool(out); table(out); evidence(out,Path(a.scene_root),Path(a.evidence_dir)); print('NATIVE_VISUAL_ASSETS_GENERATED_FROM_MANIFESTS')
