import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { scoreSession } = require('../factory/perception-score-v1.js');
const { semanticHit } = require('../factory/semantic-hit-v1.js');

const spec = JSON.parse(fs.readFileSync('factory/reference-game-01.json', 'utf8'));
assert.equal(spec.schemaVersion, 1);
assert.equal(spec.session.roundCount, 3);
assert.equal(spec.rounds.length, 3);
assert.deepEqual(spec.rounds.map(r => r.id), ['extra-shadow','early-splash','color-theft']);
for (const round of spec.rounds) {
  assert.equal(round.interactionPolicy, 'semantic-visible-mask-expanded');
  assert.ok(round.answerObjects.length >= 1);
  assert.ok(round.assetManifest.endsWith('.scene.json'));
}
assert.ok(!JSON.stringify(spec).includes('percentile'));

const perfect = scoreSession([
  { correct:true,reactionMs:450 },
  { correct:true,reactionMs:450 },
  { correct:true,reactionMs:450 }
]);
assert.equal(perfect.total, 3000);
assert.equal(perfect.rank, 'UNCANNY');
const noisy = scoreSession([{correct:true,reactionMs:1800,falseTaps:2,prematureTaps:1,replays:1}]);
assert.ok(noisy.total < 1000 && noisy.total > 0);

// Regression for the physical-phone failure: distant parts of one semantic object
// can be represented by multiple polygons and must all resolve to the same object.
const splash = { id:'splash', z:2, touchExpansionPx:16, hitPolygons:[
  [[100,300],[220,300],[220,340],[100,340]],
  [[120,245],[145,245],[145,290],[120,290]],
  [[180,240],[205,240],[205,290],[180,290]]
]};
assert.equal(semanticHit({x:130,y:260}, [splash])?.id, 'splash'); // upper droplet
assert.equal(semanticHit({x:160,y:320}, [splash])?.id, 'splash'); // lower body

const architecture = fs.readFileSync('FACTORY_ARCHITECTURE_V1.md','utf8');
for (const token of ['TikTok Mini Games Native Runtime','Cocos Creator 3.x','semantic','Perception','Machine CI must never claim PASS']) {
  assert.ok(architecture.includes(token), `missing architecture invariant: ${token}`);
}
console.log('FACTORY_V1_CONTRACT_PASS');
