import test from 'node:test';
import assert from 'node:assert/strict';
import * as stick from '../scripts/profiles/stickman.mjs';
import * as romance from '../scripts/profiles/character-romance.mjs';
import * as gym from '../scripts/profiles/fitness.mjs';
import * as car from '../scripts/profiles/car-exploded.mjs';
import * as vox from '../scripts/profiles/vox-history.mjs';
import * as food from '../scripts/profiles/food-flow.mjs';
import * as kinetic from '../scripts/profiles/kinetic-flow.mjs';
test('stickman setup cannot be skipped; five clips, stable paper background and identity',()=>{
 const start=stick.start();assert.equal(start.state.stage,'SETUP');assert.throws(()=>stick.respond(start.state,{}));
 const r=stick.respond(start.state,{image:'no',background:'paper',genre:4,direction:'coffee shop'});
 assert.equal(r.artifacts.prompts.length,5);assert.equal(r.artifacts.continuity.backgroundLock,true);
 for(const clip of r.artifacts.prompts){assert.ok(clip.imagePrompt.includes(stick.BIBLE));assert.ok(clip.imagePrompt.includes(stick.BACKGROUNDS.paper));assert.ok(clip.durationSeconds>=6&&clip.durationSeconds<=8);}
 assert.throws(()=>stick.respond(r.state,{image:'no'}));
});
test('stickman user reference requires image input, no invented character bible',()=>{
 const s=stick.start().state;
 assert.throws(()=>stick.respond(s,{image:'yes',background:'2',genre:1,referenceTool:'text-only'}));
 const r=stick.respond(s,{image:'yes',background:'real',genre:1});
 assert.equal(r.artifacts.prompts.length,5);
 assert.ok(r.artifacts.prompts.every(x=>x.imagePrompt.includes(stick.REF)&&!x.imagePrompt.includes('CHARACTER BIBLE')));
});
test('romance has two original locked characters and 10 separate image frames',()=>{
 const s=romance.start().state;const r=romance.respond(s,'rainy evening');
 assert.equal(r.artifacts.imagePrompts.length,10);assert.equal(r.artifacts.narration.length,5);
 assert.ok(r.artifacts.imagePrompts.every(x=>x.prompt.includes('[CHARACTER A LOCK]')&&x.prompt.includes('[CHARACTER B LOCK]')&&x.prompt.includes('[WORLD LOCK]')));
});
test('fitness ten circuit choices and five exercises with locked reference style',()=>{
 const keys=Object.keys(gym.CIRCUITS);assert.equal(keys.length,10);
 for(const k of keys){const r=gym.respond(gym.start().state,k);assert.equal(r.artifacts.prompts.length,5);assert.ok(r.artifacts.prompts.every(x=>x.durationSeconds===6&&x.prompt.includes(gym.STYLE)&&x.prompt.includes('CLOSE SHOT 4–6s')));}
});
test('car strict brand model details and 3 prompts',()=>{
 assert.ok(car.ALL.length>=40&&car.ALL.length<=60);
 const s=car.start().state;assert.throws(()=>car.respond(s,'999'));
 let b=car.respond(s,'Toyota');assert.equal(b.state.stage,'MODEL');
 let m=car.respond(b.state,'Corolla');assert.equal(m.state.stage,'DETAILS');
 let p=car.respond(m.state,{year:'2024',trim:'LE',color:'white'});
 assert.equal(p.artifacts.prompts.length,3);assert.ok(p.artifacts.prompts[1].includes('Prompt 1'));assert.ok(p.artifacts.prompts[2].includes('BOTH'));
});
test('vox clip count and narration and fixed style',()=>{
 let x=vox.respond(vox.start().state,'6');assert.equal(x.state.stage,'CUSTOM');
 x=vox.respond(x.state,'Apollo 11 moon landing');assert.equal(x.state.stage,'COUNT');
 x=vox.respond(x.state,'10');assert.equal(x.artifacts.prompts.length,10);
 assert.equal(x.state.values.clips.length,10);
 assert.ok(x.state.values.clips.every(c=>c.durationSeconds===10&&c.elements.length>=4&&c.narration.split(/\s+/).length<20&&c.prompt.includes(vox.VOICE)));
});
test('food action stages no duplicate last eating and consistent lock',()=>{
 let x=food.respond(food.start().state,'2');assert.equal(x.state.stage,'COUNT');
 x=food.respond(x.state,'4');
 assert.equal(x.artifacts.prompts.length,4);assert.ok(x.artifacts.prompts[3].isEating);assert.ok(x.artifacts.prompts.slice(0,3).every(p=>!p.isEating));
 assert.ok(x.artifacts.prompts.every(p=>p.durationSeconds===10&&p.prompt.includes('Same adult chef')));
 let single=food.respond(food.respond(food.start().state,'Fresh Juice').state,'1');
 assert.equal(single.artifacts.prompts.length,1);assert.ok(single.artifacts.prompts[0].isEating);
});
test('kinetic 17 ready themes A–Q + custom and reference, 8/10s',()=>{
 assert.equal(Object.keys(kinetic.THEMES).length,17);
 const init=kinetic.start().state;assert.equal(init.stage,'SETUP');
 const x=kinetic.respond(init,{theme:'C',ratio:'9:16',length:10,brand:'KOSIF',pace:'fast',audio:'none'});
 assert.equal(x.state.stage,'SCRIPT');
 const r=kinetic.respond(x.state,'We start with clarity. Then build one better idea. Keep your focus.');
 assert.ok(r.artifacts.prompts.length>=1);
 assert.ok(r.artifacts.prompts.every(p=>p.durationSeconds===10&&p.style===r.artifacts.styleLock&&p.beats.every(b=>b.words.length<=6)));
 assert.equal(r.state.complete,true);
 const cp=kinetic.cleanPlate(r.state.values.production,1);assert.equal(cp.clip,1);assert.ok(cp.overlaySheet.length>=1);
});
test('kinetic reference and custom never assert inspection, stage needs DNA',()=>{
 let x=kinetic.respond(kinetic.start().state,{theme:'S'});
 assert.equal(x.state.stage,'REFERENCE');
 assert.throws(()=>kinetic.respond(x.state,{background:'#eee'}));
 const dna={background:'#ECEAE3',accent:'#224466',font:'geometric sans',finish:'matte sculpture',overlay:'low grid',animation:'masked reveal',transition:'paper wipe'};
 x=kinetic.respond(x.state,dna);assert.equal(x.state.stage,'SCRIPT');
 assert.match(x.output,/Reference:/);
});
test('kinetic timestamp order gate, exact 10s segments when timecoded',()=>{
 const c=kinetic.respond(kinetic.start().state,{theme:'D',length:10,ratio:'16:9'}).state;
 const result=kinetic.respond(c,'0–3s: Your attention is a choice.\n10–15s: Protect it every day.');
 assert.equal(result.artifacts.prompts.length,2);
 assert.ok(result.artifacts.prompts[0].words.includes('attention'));
 assert.ok(result.artifacts.prompts[1].words.includes('Protect'));
});
