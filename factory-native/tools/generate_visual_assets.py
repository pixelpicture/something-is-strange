#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from io import BytesIO
from urllib.request import Request, urlopen
import argparse, json

W,H=1080,1920
PHOTO_URLS={
 'park':'https://images.unsplash.com/photo-1686586445242-cbf8805306db?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
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
  print(f'PHOTO_FALLBACK {name}: {e}'); return Image.new('RGBA',(W,H),(55,75,85,255))

def park(out):
 im=photo('park',.54); im=Image.alpha_composite(im,Image.new('RGBA',(W,H),(13,24,38,30))); save(im,out/'extra-shadow/park.png')

def person(*_args,**_kwargs):
 # The validation plate already contains two real people. Keep actor slots transparent so
 # gameplay/timeline structure stays unchanged while avoiding cartoon-over-photo compositing.
 return Image.new('RGBA',(260,620),(0,0,0,0))

def shadow(size,extra=False):
 w,h=size; m=Image.new('L',size,0); d=ImageDraw.Draw(m); cx=w*.5; d.ellipse((cx-46,52,cx+46,144),fill=145); d.polygon([(cx-52,132),(cx+55,132),(cx+78,h*.53),(cx+40,h*.63),(cx+24,h-34),(cx-8,h-24),(cx-18,h*.65),(cx-70,h*.55)],fill=145)
 if extra: d.polygon([(cx+36,h*.51),(w-20,h*.71),(w-32,h*.78),(cx+18,h*.61)],fill=138)
 m=m.filter(ImageFilter.GaussianBlur(26)); col=Image.new('RGBA',size,(7,10,15,0)); col.putalpha(m); return col

def pool(out):
 im=photo('pool',.58); im=Image.alpha_composite(im,Image.new('RGBA',(W,H),(8,86,142,26))); save(im,out/'early-splash/pool.png')
 ball=Image.new('RGBA',(180,180),(0,0,0,0)); px=ball.load()
 for y in range(180):
  for x in range(180):
   dx,dy=x-86,y-82; r=(dx*dx+dy*dy)**.5
   if r<=76:
    light=max(0,min(1,(1-r/76))); highlight=max(0,1-(((x-56)**2+(y-48)**2)**.5)/58); px[x,y]=(min(255,int(224+28*highlight)),int(68+38*light),int(33+16*light),255)
 b=ImageDraw.Draw(ball); b.arc((10,10,166,166),12,345,fill=(105,40,27,210),width=5); b.arc((32,34,150,145),205,330,fill=(251,194,59,230),width=28); save(q(ball),out/'early-splash/ball.png')
 sp=Image.new('RGBA',(520,430),(0,0,0,0)); s=ImageDraw.Draw(sp); s.ellipse((55,286,470,405),fill=(178,235,248,120)); s.polygon([(70,330),(116,222),(153,296),(191,126),(229,275),(264,58),(303,267),(355,111),(392,288),(452,196),(477,339)],fill=(224,251,255,195))
 for cx,cy,r in [(150,102,18),(252,40,23),(371,75,16),(82,170,13),(442,142,12),(316,30,9),(205,86,8)]: s.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(245,255,255,225))
 save(q(sp.filter(ImageFilter.GaussianBlur(1.1))),out/'early-splash/splash.png')

def table(out):
 im=photo('table',.64); im=Image.alpha_composite(im,Image.new('RGBA',(W,H),(28,20,18,18))); save(im,out/'color-theft/table.png')
 def vase(color):
  mask=Image.new('L',(300,560),0); md=ImageDraw.Draw(mask); md.polygon([(112,34),(188,34),(194,105),(226,168),(246,430),(214,503),(86,503),(54,430),(74,168),(106,105)],fill=255); md.rounded_rectangle((100,20,200,67),17,fill=255)
  v=Image.new('RGBA',(300,560),(0,0,0,0)); base=color[:3]
  for x in range(300):
   nx=(x-150)/115; shade=.70+.30*max(0,1-nx*nx); hi=.23*max(0,1-abs(x-105)/38); c=tuple(min(255,int(ch*shade+255*hi)) for ch in base); ImageDraw.Draw(v).line((x,0,x,559),fill=c+(255,))
  v.putalpha(mask.filter(ImageFilter.GaussianBlur(.35))); x=ImageDraw.Draw(v,'RGBA'); x.ellipse((42,500,258,548),fill=(10,8,8,55)); x.polygon([(94,145),(114,118),(109,444),(91,432)],fill=(255,255,255,48)); return v
 def ball(c):
  b=Image.new('RGBA',(170,170),(0,0,0,0)); px=b.load(); base=c[:3]
  for y in range(170):
   for x in range(170):
    dx,dy=x-83,y-84; r=(dx*dx+dy*dy)**.5
    if r<=77:
     n=max(0,1-r/77); h=max(0,1-(((x-55)**2+(y-50)**2)**.5)/55); px[x,y]=tuple(min(255,int(ch*(.76+.24*n)+255*.22*h)) for ch in base)+(255,)
  return b
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
 park(out); save(person(),out/'extra-shadow/person-a.png'); save(person(),out/'extra-shadow/person-b.png'); save(q(shadow((360,520))),out/'extra-shadow/shadow-natural.png'); save(q(shadow((380,560),True)),out/'extra-shadow/shadow-impossible.png'); pool(out); table(out); evidence(out,Path(a.scene_root),Path(a.evidence_dir)); print('NATIVE_VISUAL_ASSETS_GENERATED_FROM_MANIFESTS')
