import fs from 'node:fs';
import assert from 'node:assert/strict';

const scenePaths=['extra-shadow','early-splash','color-theft'].map(x=>`factory-native/scenes/${x}.scene.json`);
const scenes=scenePaths.map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
assert.equal(scenes.length,3);
assert.equal(new Set(scenes.map(s=>s.id)).size,3);

for(const s of scenes){
  assert.equal(s.schemaVersion,1);
  assert.deepEqual(s.canvas,{width:1080,height:1920});
  assert.ok(s.assets.length>=3);
  assert.ok(s.actors.length>=3);
  assert.ok(s.timeline.length>=1);
  assert.ok(s.humanIntent.normalExpectation&&s.humanIntent.impossibleEvent&&s.humanIntent.visualQuestion);
  for(const a of s.assets){
    assert.ok(/\.(webp|png)$/.test(a.path),`${s.id}/${a.id} must use raster layered asset`);
    assert.ok(!a.path.endsWith('.svg'),`${s.id}/${a.id} rejected SVG production asset`);
  }
  const semantic=s.actors.flatMap(a=>a.semantic?[a.semantic]:[]);
  const ids=new Set(semantic.map(x=>x.id));
  for(const id of s.answerObjectIds)assert.ok(ids.has(id),`${s.id} answer ${id} missing semantic object`);
  for(const o of semantic){
    assert.ok(o.touchExpansionPx>=20,`${s.id}/${o.id} touch expansion too small`);
    assert.ok(o.hitPolygons.length>=1);
    for(const poly of o.hitPolygons)assert.ok(poly.length>=3);
  }
}

const splash=scenes.find(s=>s.id==='early-splash').actors.find(a=>a.semantic?.id==='splash').semantic;
assert.ok(splash.hitPolygons.length>=3,'splash must include body + upper droplets as one semantic answer');
const shadow=scenes.find(s=>s.id==='extra-shadow').actors.find(a=>a.semantic?.id==='impossible_shadow').semantic;
const ys=shadow.hitPolygons[0].map(p=>p[1]);
assert.ok(Math.max(...ys)-Math.min(...ys)>=400,'full shadow geometry must be tappable');

const domainFiles=['PerceptionScore.ts','SemanticHit.ts','Runtime.ts','SceneManifest.ts','Session.ts'];
const domain=domainFiles.map(x=>fs.readFileSync(`factory-native/domain/${x}`,'utf8')).join('\n');
for(const forbidden of ["from 'cc'",'document.','window.','WebView','android.'])assert.ok(!domain.includes(forbidden),`domain leaked platform dependency ${forbidden}`);

for(const required of [
  'factory-native/cocos/ReferenceGameController.ts',
  'factory-native/cocos/LayeredSceneRenderer.ts',
  'factory-native/cocos/ResultCardController.ts',
  'factory-native/cocos/ReferenceGameFlow.ts',
  'factory-native/platform/PlatformAdapter.ts',
  'factory-native/VISUAL_PIPELINE_V1.md'
]) assert.ok(fs.existsSync(required),`missing native factory component ${required}`);

const controller=fs.readFileSync('factory-native/cocos/ReferenceGameController.ts','utf8');
assert.ok(controller.includes("from 'cc'"));
assert.ok(controller.includes('semanticHit'));
assert.ok(controller.includes('scoreSession'));
const renderer=fs.readFileSync('factory-native/cocos/LayeredSceneRenderer.ts','utf8');
assert.ok(renderer.includes('LayeredSceneManifest'));
assert.ok(renderer.includes('manifest.timeline'));
const flow=fs.readFileSync('factory-native/cocos/ReferenceGameFlow.ts','utf8');
assert.ok(flow.includes("['extra-shadow','early-splash','color-theft']"));
assert.ok(flow.includes('session_result'));
const visual=fs.readFileSync('factory-native/VISUAL_PIPELINE_V1.md','utf8');
for(const phrase of ['stylized editorial illustration','any visible part','Machine gates cannot certify recognizability'])assert.ok(visual.includes(phrase),`visual policy missing ${phrase}`);

console.log('FACTORY_NATIVE_CONTRACT_PASS');
