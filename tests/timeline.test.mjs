import test from 'node:test';
import assert from 'node:assert/strict';
import {easingValue,sampleKeyframes,sampleMotionTracks,frameToSeconds,validateKeyframes} from '../web/timeline.js';
test('timeline interpolation is exact at endpoints and deterministic when seeking',()=>{
 const frames=[{time:0,value:0,easing:'smooth'},{time:2,value:100},{time:4,value:200}];
 assert.equal(sampleKeyframes(frames,0),0);
 assert.equal(sampleKeyframes(frames,1),50);
 assert.equal(sampleKeyframes(frames,4),200);
 assert.equal(sampleKeyframes(frames,10),200);
 const midpoint=sampleKeyframes(frames,1.234);
 assert.equal(sampleKeyframes(frames,1.234),midpoint);
 assert.equal(sampleKeyframes(frames,2),100);
});
test('holds, easing functions and rational FPS behave consistently',()=>{
 assert.equal(easingValue('hold',0.5),0);
 assert.equal(easingValue('spring',0),0);
 assert.equal(easingValue('spring',1),1);
 assert.equal(sampleKeyframes([{time:0,value:2,easing:'hold'},{time:1,value:6}],.8),2);
 assert.equal(frameToSeconds(30000,30000,1001),1001);
 assert.throws(()=>frameToSeconds(-1),/Invalid/);
});
test('track bounds and absent scene preserve legacy canvas behavior',()=>{
 assert.deepEqual(sampleMotionTracks(null,0),{x:0,y:0,rotation:0,scale:1});
 const scene={motion:{tracks:{x:[{time:0,value:-3},{time:1,value:3}],
   rotation:[{time:0,value:0},{time:1,value:9}],scale:[{time:0,value:.1},{time:1,value:4}]}}};
 assert.deepEqual(sampleMotionTracks(scene,0),{x:-.35,y:0,rotation:0,scale:.25});
 assert.deepEqual(sampleMotionTracks(scene,1),{x:.35,y:0,rotation:Math.PI,scale:3});
});
test('reject nonfinite, unsorted and unknown easing to avoid corrupt output',()=>{
 assert.throws(()=>validateKeyframes([{time:0,value:0},{time:0,value:2}]),/strictly increasing/);
 assert.throws(()=>validateKeyframes([{time:1,value:Infinity}]),/finite/);
 assert.throws(()=>validateKeyframes([{time:0,value:0,easing:'huh'}]),/Unknown easing/);
});
