import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalog,validateCatalog,searchIdeas,getIdea,makeHandoff,run} from '../scripts/ideas-cli.mjs';

test('exactly 500 indexed ideas in 20 distinct domains',()=>{
 const c=readCatalog();
 assert.deepEqual(validateCatalog(c),{count:500,categories:20});
 assert.equal(c.ideas[0].id,'MB-001');
 assert.equal(c.ideas.at(-1).id,'MB-500');
});
test('every proposal is explicitly unimplemented and uniquely titled',()=>{
 const c=readCatalog();
 assert(c.ideas.every(x=>x.status==='proposed-not-implemented' && x.verified===false));
 assert.equal(new Set(c.ideas.map(x=>x.title.toLowerCase())).size,500);
});
test('Arabic query and case insensitive domain filter are supported',()=>{
 assert(searchIdeas('arabic').length>0);
 assert.equal(searchIdeas('',{category:'motion physics',limit:500}).length,25);
 assert.equal(searchIdeas('nonexistent_zzzz').length,0);
});
test('handoff preserves approvals and does not pretend providers are connected',()=>{
 const s=makeHandoff('mb-001');
 assert.match(s,/MB-001/);
 assert.match(s,/separate approval before final render/);
 assert.match(s,/Veo\/Flow\/Higgsfield/);
 assert.match(s,/real editable time-driven behavior/);
});
test('CLI text commands and invalid inputs give actionable errors',()=>{
 assert.match(run(['list']),/500 proposals/);
 assert.match(run(['validate']),/20 domains/);
 assert.match(run(['search','Arabic']),/MB-/);
 assert.match(run(['show','MB-500']),/MB-500/);
 assert.throws(()=>getIdea('MB-999'),/Unknown idea/);
 assert.throws(()=>searchIdeas('x',{limit:501}),/limit/);
 assert.throws(()=>run(['unknown']),/Unknown command/);
});
