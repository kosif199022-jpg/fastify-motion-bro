/** Deterministic keyframe motion tracks for editable time-driven Canvas scenes.
 * Units: x/y = relative canvas dimensions; rotation = radians; scale = multiplier.
 * Scene JSON: {motion:{tracks:{x:[{time:0,value:-0.1},{time:2,value:0,easing:"smooth"}]}}}
 * Keyframe times are seconds relative to scene.start.
 */
const finite=(n)=>typeof n==='number' && Number.isFinite(n);
export function easingValue(mode,t) {
 const p=Math.max(0,Math.min(1,t));
 switch(mode){
  case 'hold':return 0;
  case 'ease-in':return p*p;
  case 'ease-out':return 1-(1-p)*(1-p);
  case 'smooth':return p*p*(3-2*p);
  case 'ease-out-cubic':return 1-(1-p)**3;
  case 'spring': {
   const omega=9;
   const fn=x=>1-(1+omega*x)*Math.exp(-omega*x);
   return fn(p)/fn(1);
  }
  default:return p;
 }
}
export function validateKeyframes(frames) {
 if(!Array.isArray(frames)||!frames.length||frames.length>2000)throw Error('Motion track must have 1..2000 keyframes');
 let last=-Infinity;
 for(const k of frames){
  if(!k||!finite(k.time)||k.time<0||!finite(k.value)||k.time<=last)
   throw Error('Motion keyframes require strictly increasing nonnegative times and finite values');
  if(k.easing && !['hold','linear','ease-in','ease-out','smooth','ease-out-cubic','spring'].includes(k.easing))
   throw Error('Unknown easing: '+k.easing);
  last=k.time;
 }
 return frames;
}
export function sampleKeyframes(frames,seconds,fallback=0){
 if(!frames||!frames.length)return fallback;
 validateKeyframes(frames);
 if(!finite(seconds))throw Error('Sample time must be finite');
 if(seconds<=frames[0].time)return frames[0].value;
 if(seconds>=frames.at(-1).time)return frames.at(-1).value;
 let lo=0,hi=frames.length-1;
 while(hi-lo>1){const m=(lo+hi)>>1;if(frames[m].time<=seconds)lo=m;else hi=m;}
 const a=frames[lo],b=frames[hi];
 const t=(seconds-a.time)/(b.time-a.time);
 return a.value+(b.value-a.value)*easingValue(a.easing||'linear',t);
}
export function sampleMotionTracks(scene,seconds){
 const tracks=scene?.motion?.tracks || {};
 const get=(name,fallback,min,max)=>{
  const k=tracks[name];
  if(k===undefined)return fallback;
  return Math.max(min,Math.min(max,sampleKeyframes(k,seconds,fallback)));
 };
 return {
  x:get('x',0,-.35,.35),
  y:get('y',0,-.35,.35),
  rotation:get('rotation',0,-Math.PI,Math.PI),
  scale:get('scale',1,.25,3),
 };
}
export function frameToSeconds(index,fpsNumerator=30,fpsDenominator=1) {
 if(!Number.isSafeInteger(index)||index<0||!Number.isSafeInteger(fpsNumerator)
   ||fpsNumerator<=0||!Number.isSafeInteger(fpsDenominator)||fpsDenominator<=0)
  throw Error('Invalid frame index or rational FPS');
 return index*fpsDenominator/fpsNumerator;
}
