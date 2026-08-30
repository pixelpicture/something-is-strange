import fs from 'node:fs';import assert from 'node:assert/strict';
const scenePaths=['extra-shadow','early-splash','color-theft'].map(x=>`factory-native/scenes/${x}.scene.json`);
const scenes=scenePaths.map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
assert.equal(scenes.length,3);assert.equal(new Set(scenes.map(s=>s.id)).size,3);
for(const s of scenes){
 assert.equal(s.schemaVersion,1);assert.deepEqual(s.canvas,{width:1080,height:1920});assert.ok(s.assets.length>=3);assert.ok(s.actors.length>=3);assert.ok(s.timeline.length>=1);assert.ok(s.humanIntent.normalExpectation&&s.humanIntent.impossibleEvent&&s.humanIntent.visualQuestion);
 const semantic=s.actors.flatMap(a=>a.semantic?[a.semantic]:[]);const ids=new Set(semantic.map(x=>x.id));for(const id of s.answerObjectIds)assert.ok(ids.has(id),`${s.id} answer ${id} missing semantic object`);
 for(const o of semantic){assert.ok(o.touchExpansionPx>=20,`${s.id}/${o.id} touch expansion too small`);assert.ok(o.hitPolygons.length>=1);for(const poly of o.hitPolygons)assert.ok(poly.length>=3);}
}
const splash=scenes.find(s=>s.id==='early-splash').actors.find(a=>a.semantic?.id==='splash').semantic;
assert.ok(splash.hitPolygons.length>=3,'splash must include body + upper droplets as one semantic answer');
const shadow=scenes.find(s=>s.id==='extra-shadow').actors.find(a=>a.semantic?.id==='impossible_shadow').semantic;
const ys=shadow.hitPolygons[0].map(p=>p[1]);assert.ok(Math.max(...ys)-Math.min(...ys)>=400,'full shadow geometry must be tappable');
const domain=['PerceptionScore.ts','SemanticHit.ts','Runtime.ts','SceneManifest.ts','Session.ts'].map(x=>fs.readFileSync(`factory-native/domain/${x}`,'utf8')).join('\n');
for(const forbidden of ["from 'cc'",'document.','window.','WebView','android.'])assert.ok(!domain.includes(forbidden),`domain leaked platform dependency ${forbidden}`);
const controller=fs.readFileSync('factory-native/cocos/ReferenceGameController.ts','utf8');assert.ok(controller.includes("from 'cc'"));assert.ok(controller.includes('semanticHit'));assert.ok(controller.includes('scoreSession'));
console.log('FACTORY_NATIVE_CONTRACT_PASS');
