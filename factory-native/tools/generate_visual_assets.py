#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from io import BytesIO
from urllib.request import Request, urlopen
import argparse, json

W,H=1080,1920
PHOTO_URLS={
 'park':'https://images.unsplash.com/photo-1774866563481-d9a5793de1b7?auto=format&fit=crop&fm=jpg&q=78&w=1600',
 'pool':'https://images.unsplash.com/photo-1674986225574-d00a626cc2db?auto=format&fit=crop&fm=jpg&q=78&w=1600',
 'table':'https://images.unsplash.com/photo-1519219788971-8d9797e0928e?auto=format&fit=crop&fm=jpg&q=78&w=1800',
}

def save(im,p): p.parent.mkdir(parents=True,exist_ok=True); im.convert('RGBA').save(p,'PNG',optimize=True)
def q(im): return im.convert('RGBA').quantize(colors=224,method=Image.Quantize.FASTOCTREE).convert('RGBA')
def cover(im,w=W,h=H,focus_y=.5):
 im=im.convert('RGB'); scale=max(w/im.width,h/im.height); nw,nh=round(im.width*scale),round(im.height*scale); im=im.resize((nw,nh),Image.Resampling.LANCZOS)
 left=max(0,(nw-w)//2); max_top=max(0,nh-h); top=round(max_top*max(0,min(1,focus_y))); return im.crop((left,top,left+w,top+h)).convert('RGBA')
def photo(name,focus_y=.5):
 try:
  req=Request(PHOTO_URLS[name],headers={'User-Agent':'something-is-strange-build/1.0'}); raw=urlopen(req,timeout=25).read(); im=cover(Image.open(BytesIO(raw)),focus_y=focus_y)
  im=ImageEnhance.Contrast(im).enhance(1.06); im=ImageEnhance.Color(im).enhance(.96); return im
 except Exception as e:
  print(f'PHOTO_FALLBACK {name}: {e}'); base=Image.new('RGBA',(W,H),(55,75,85,255)); return base

def park(out):
 im=photo('park',.50); tone=Image.new('RGBA',(W,H),(15,28,48,42)); im=Image.alpha_composite(im,tone); save(im,out/'extra-shadow/park.png')

def person(shirt,pants,hair,flip=False):
 im=Image.new('RGBA',(260,620),(0,0,0,0)); d=ImageDraw.Draw(im); skin=(207,158,123,255)
 d.ellipse((65,560,125,602),fill=(15,18,24,70)); d.ellipse((138,560,198,602),fill=(15,18,24,70)); d.rounded_rectangle((80,378,118,574),16,fill=pants); d.rounded_rectangle((142,378,180,574),16,fill=pants); d.rounded_rectangle((57,185,203,410),42,fill=shirt); d.polygon([(60,225),(27,352),(60,365),(84,270)],fill=skin); d.polygon([(200,225),(233,350),(202,364),(178,270)],fill=skin); d.rectangle((112,146,148,203),fill=skin); d.ellipse((84,52,176,164),fill=skin); d.pieslice((80,42,180,145),180,360,fill=hair)
 # soft rim and slight camera blur to integrate with photo plate
 return im.filter(ImageFilter.GaussianBlur(.45)).transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else im.filter(ImageFilter.GaussianBlur(.45))

def shadow(size,extra=False):
 w,h=size; m=Image.new('L',size,0); d=ImageDraw.Draw(m); cx=w*.5; d.ellipse((cx-46,52,cx+46,144),fill=155); d.polygon([(cx-52,132),(cx+55,132),(cx+78,h*.53),(cx+40,h*.63),(cx+24,h-34),(cx-8,h-24),(cx-18,h*.65),(cx-70,h*.55)],fill=155)
 if extra: d.polygon([(cx+36,h*.51),(w-20,h*.71),(w-32,h*.78),(cx+18,h*.61)],fill=145)
 m=m.filter(ImageFilter.GaussianBlur(24)); col=Image.new('RGBA',size,(9,13,19,0)); col.putalpha(m); return col

def pool(out):
 im=photo('pool',.58); # the source is an empty pool; deepen water and preserve lane perspective
 tint=Image.new('RGBA',(W,H),(8,86,142,26)); im=Image.alpha_composite(im,tint); save(im,out/'early-splash/pool.png')
 ball=Image.new('RGBA',(180,180),(0,0,0,0)); b=ImageDraw.Draw(ball); b.ellipse((13,16,167,170),fill=(240,82,39,255),outline=(116,40,24,220),width=5); b.pieslice((23,26,157,160),205,330,fill=(248,198,64,255)); b.ellipse((38,34,76,70),fill=(255,255,255,135)); save(q(ball),out/'early-splash/ball.png')
 sp=Image.new('RGBA',(520,430),(0,0,0,0)); s=ImageDraw.Draw(sp); s.polygon([(42,338),(92,238),(142,286),(178,145),(222,260),(262,74),(308,252),(364,126),(397,282),(458,205),(490,342)],fill=(218,250,255,225)); s.ellipse((45,278,490,414),fill=(172,235,249,190))
 for cx,cy,r in [(150,102,21),(252,40,25),(371,75,18),(82,170,15),(442,142,14),(316,30,10)]: s.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(240,254,255,245))
 save(q(sp.filter(ImageFilter.GaussianBlur(.65))),out/'early-splash/splash.png')

def table(out):
 im=photo('table',.64); # crop keeps the wooden surface dominant and leaves clean wall space
 shade=Image.new('RGBA',(W,H),(28,20,18,18)); im=Image.alpha_composite(im,shade); save(im,out/'color-theft/table.png')
 def vase(color):
  v=Image.new('RGBA',(300,560),(0,0,0,0)); x=ImageDraw.Draw(v); x.ellipse((42,500,258,548),fill=(10,8,8,72)); x.polygon([(112,34),(188,34),(194,105),(226,168),(246,430),(214,503),(86,503),(54,430),(74,168),(106,105)],fill=color,outline=(61,44,39,175)); x.rounded_rectangle((100,20,200,67),17,fill=tuple(min(255,c+18) for c in color[:3])+(255,)); x.polygon([(92,145),(114,116),(109,450),(89,437)],fill=(255,255,255,48)); return v.filter(ImageFilter.GaussianBlur(.25))
 def ball(c):
  b=Image.new('RGBA',(170,170),(0,0,0,0)); x=ImageDraw.Draw(b); x.ellipse((7,10,163,166),fill=c,outline=(70,45,40,180),width=4); x.ellipse((30,27,72,65),fill=(255,255,255,125)); return b
 save(q(vase((215,207,181,255))),out/'color-theft/vase-pale.png'); save(q(vase((203,50,43,255))),out/'color-theft/vase-red.png'); save(q(ball((211,45,38,255))),out/'color-theft/ball-red.png'); save(q(ball((219,212,190,255))),out/'color-theft/ball-pale.png')

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
  canvas.alpha_composite(sprite,(round(x-sprite.width/2),round(H-y-sprite.height/2)))
 return canvas

def semantic_coverage(manifest,asset_root,t):
 base=render_manifest(manifest,asset_root,t); overlay=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(overlay,'RGBA'); answers=set(manifest['answerObjectIds'])
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
  for label,t in [('before',baseline),('anomaly',anomaly),('after',end+100)]: save(render_manifest(m,asset_root,t),out/f"{m['id']}-{label}.png")
  save(semantic_coverage(m,asset_root,anomaly),out/f"{m['id']}-tap-coverage.png")

if __name__=='__main__':
 ap=argparse.ArgumentParser(); ap.add_argument('--output-root',default='factory-native/assets/resources/assets'); ap.add_argument('--scene-root',default='factory-native/assets/resources/scenes'); ap.add_argument('--evidence-dir',default='evidence/native-visual-v1'); a=ap.parse_args(); out=Path(a.output_root)
 park(out); save(q(person((189,83,51,255),(39,48,62,255),(47,31,25,255))),out/'extra-shadow/person-a.png'); save(q(person((47,110,132,255),(45,43,55,255),(31,26,23,255),True)),out/'extra-shadow/person-b.png'); save(q(shadow((360,520))),out/'extra-shadow/shadow-natural.png'); save(q(shadow((380,560),True)),out/'extra-shadow/shadow-impossible.png'); pool(out); table(out); evidence(out,Path(a.scene_root),Path(a.evidence_dir)); print('NATIVE_VISUAL_ASSETS_GENERATED_FROM_MANIFESTS')
