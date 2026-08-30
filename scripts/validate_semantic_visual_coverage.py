#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import json, math

ROOT=Path('factory-native/assets/resources')
SCENES=ROOT/'scenes'
ASSETS=ROOT/'assets'
THRESHOLD=0.995
ALPHA_MIN=32
STEP=3

def inside(p,poly):
 x,y=p; yes=False
 for i,a in enumerate(poly):
  b=poly[i-1]; xi,yi=a; xj,yj=b
  if ((yi>y)!=(yj>y)) and x < (xj-xi)*(y-yi)/((yj-yi) or 1e-9)+xi: yes=not yes
 return yes

def segdist(p,a,b):
 x,y=p; vx=b[0]-a[0]; vy=b[1]-a[1]; wx=x-a[0]; wy=y-a[1]; c1=vx*wx+vy*wy
 if c1<=0:return math.hypot(x-a[0],y-a[1])
 c2=vx*vx+vy*vy
 if c2<=c1:return math.hypot(x-b[0],y-b[1])
 t=c1/c2; return math.hypot(x-(a[0]+t*vx),y-(a[1]+t*vy))

def hit(p,semantic):
 expansion=max(0,float(semantic.get('touchExpansionPx',0)))
 for poly in semantic['hitPolygons']:
  if inside(p,poly):return True
  if expansion and any(segdist(p,poly[i],poly[(i+1)%len(poly)])<=expansion for i in range(len(poly))):return True
 return False

def state_at(manifest,actor,t):
 state=actor['initialState']; x=float(actor['x']); y=float(actor['y'])
 for event in sorted(manifest['timeline'],key=lambda e:e['atMs']):
  if event['actorId']!=actor['id'] or event['atMs']>t:continue
  if event['command']=='state': state=str(event['value'])
  elif event['command']=='move':
   v=event['value']; f=max(0,min(1,(t-event['atMs'])/v['durationMs']))
   x=float(actor['x'])+(float(v['x'])-float(actor['x']))*f
   y=float(actor['y'])+(float(v['y'])-float(actor['y']))*f
 return state,x,y

def asset_path(path):
 rel=path[7:] if path.startswith('assets/') else path
 return ASSETS/rel

fail=[]
for scene_file in sorted(SCENES.glob('*.scene.json')):
 m=json.loads(scene_file.read_text()); assets={a['id']:a for a in m['assets']}; t=m['anomalyAtMs']
 for actor in m['actors']:
  sem=actor.get('semantic')
  if not sem or sem['id'] not in m['answerObjectIds']:continue
  state,x,y=state_at(m,actor,t); st=actor['states'][state]
  if st.get('visible',True) is False:
   fail.append(f"{m['id']}/{sem['id']}: answer invisible at anomaly"); continue
  asset=assets[st['assetId']]; im=Image.open(asset_path(asset['path'])).convert('RGBA')
  total=covered=0
  for py in range(0,im.height,STEP):
   for px in range(0,im.width,STEP):
    if im.getpixel((px,py))[3] < ALPHA_MIN:continue
    total+=1
    design=(x+(px-im.width/2), y+(im.height/2-py))
    if hit(design,sem):covered+=1
  ratio=covered/total if total else 0
  print(f"SEMANTIC_ALPHA_COVERAGE {m['id']}/{sem['id']}={ratio:.4f} ({covered}/{total})")
  if total<50 or ratio<THRESHOLD:fail.append(f"{m['id']}/{sem['id']}: visible-alpha coverage {ratio:.4f} < {THRESHOLD:.4f}")

if fail:
 raise SystemExit('SEMANTIC_VISUAL_COVERAGE_FAIL\n'+'\n'.join(fail))
print('SEMANTIC_VISUAL_COVERAGE_PASS')
