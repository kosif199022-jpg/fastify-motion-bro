import test from 'node:test';import assert from 'node:assert/strict';import {normalizeBrief,makeStoryboard} from '../scripts/planner.mjs';
test('valid default brief',()=>assert.equal(normalizeBrief({}).aspect,'9:16'));
test('invalid aspect blocked',()=>assert.throws(()=>normalizeBrief({aspect:'0:0'})));
test('invalid length blocked',()=>assert.throws(()=>normalizeBrief({duration_seconds:-2})));
test('short film gets three scenes',()=>assert.equal(makeStoryboard({duration_seconds:8}).scenes.length,3));
test('scenes contiguous and bounded',()=>{const s=makeStoryboard({duration_seconds:45});assert.equal(s.scenes[0].start,0);assert.equal(s.scenes.at(-1).end,45);for(let i=1;i<s.scenes.length;i++)assert.equal(s.scenes[i].start,s.scenes[i-1].end);});
