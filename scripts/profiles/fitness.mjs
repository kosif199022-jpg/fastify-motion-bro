import {ensure,asText,cloneSession,fresh,response} from './core.mjs';
export const id='fitness';
export const CIRCUITS=Object.freeze({
 Abs:['Lying Leg Raise (lower abs)','Russian Twist (obliques)','Crunches (upper abs)','Plank Hold (deep core)','Bicycle Crunch (full core)'],
 Chest:['Incline Press (upper chest)','Flat Chest Press (mid chest)','Decline Press (lower chest)','Chest Fly Machine (pecs)','Cable Crossover (adduction)'],
 Back:['Lat Pulldown (lats)','Face Pull (traps / rear delts)','Back Extension (lower back)','Seated Row (rhomboids)','Reverse Fly (upper back)'],
 Shoulders:['Front Raise (front delt)','Lateral Raise (side delt)','Rear Delt Fly (rear delt)','Shoulder Press (overall)','Shrugs (traps)'],
 Biceps:['Barbell Curl (overall)','Incline Dumbbell Curl (long head)','Preacher Curl (short head)','Hammer Curl (brachialis)','Wrist Curl (forearm)'],
 Triceps:['Overhead Extension (long head)','Cable Pushdown (lateral head)','Close-Grip Press (medial head)','Dips (overall)','Triceps Kickback'],
 Quads:['Leg Press','Leg Extension','Smith Machine Squat','Hack Squat','Stationary Alternating Lunge'],
 Hamstrings:['Seated Leg Curl','Romanian Deadlift','Glute-Ham Raise','Good Morning','Nordic Curl'],
 Glutes:['Hip Thrust','Cable Glute Kickback','Glute Bridge','Bulgarian Split Squat','Donkey Kick'],
 Calves:['Standing Calf Raise','Seated Calf Raise','Leg Press Calf Raise','Donkey Calf Raise','Single-Leg Calf Raise']
});
export const STYLE='Character matches reference image exactly: faceless muscular sculpt-render physique, black cap, black athletic shorts, no facial features. Dark cinematic gym studio or mat area, single overhead teal-blue rim light, black background fading to shadow, photorealistic 3D-render aesthetic, shallow depth of field, high-end fitness app look.';
const COACH=['Control the lowering phase; make every rep work.','Keep your joints stacked and move the target muscle.','Slow the return; never chase momentum.','Brace your core; own the entire range.','Finish strong, clean, and controlled.'];
export function start(){return response(fresh(id,'MUSCLE'),'Which muscle group? '+Object.keys(CIRCUITS).map((x,i)=>(i+1)+'. '+x).join(' · ')+'\nUse the same provided character reference image in every Google Flow clip; black cap and shorts remain locked.');}
export function respond(previous,input){
 const s=cloneSession(previous,id);ensure(s.stage==='MUSCLE','Choose muscle group');
 const key=asText(typeof input==='object'?input.muscle:input);
 const all=Object.keys(CIRCUITS);
 const muscle=/^\d+$/.test(key)?all[Number(key)-1]:all.find(x=>x.toLowerCase()===key.toLowerCase());
 ensure(muscle,'Choose one of the listed muscle groups');
 const circuit=CIRCUITS[muscle];ensure(circuit.length===5,'Five exercise clips required');
 const clips=circuit.map((entry,i)=>{
  const exercise=entry.replace(/\s*\(.+?\)$/,'');
  const target=(entry.match(/\(([^)]+)\)/)||[])[1]||muscle.toLowerCase();
  const next=circuit[i+1]?.replace(/\s*\(.+?\)$/,'')||'final return to first-frame neutral pose';
  const cue=muscle==='Abs'?['Lift with your core, not your hip swing.','Rotate from the ribs; feel the sides work.','Curl your ribs toward your hips.','Brace your trunk and breathe steadily.','Keep the motion slow and deliberate.'][i]:
    muscle==='Chest'?['Press upward without shrugging the shoulders.','Keep your shoulder blades secure as you press.','Control the lower path and keep the chest engaged.','Bring the arms together with a soft elbow bend.','Squeeze the chest at the middle, not your wrists.'][i]:
    muscle==='Back'?['Pull your elbows down; drive through your back.','Draw the rope toward your face, not your chest.','Hinge gently at your hips with a firm core.','Lead with the elbows and squeeze behind you.','Open your arms from the upper back, not momentum.'][i]:COACH[i];
  const prompt='CLIP '+(i+1)+'/5 — '+exercise+'\n'+STYLE+'\n6-second Google Flow image-to-video, reference IMAGE attached. MAIN SHOT 0–4s: steady wide-to-medium view in the same marked gym training bay; athlete performs '+exercise+' with deliberate and anatomically plausible controlled form, no camera-angle jumps, full active range visible, equipment appears safely positioned; do not change character outfit or physique. CLOSE SHOT 4–6s: smooth push toward '+target+' at peak engagement, localized subtle RED/ORANGE anatomical heat-map glow over the relevant muscle region, rest of mannequin neutral matte tone; no internal anatomical cross-section claims. Finish close-up by easing back to the same pose and camera heading so the next clip begins at a plausible matching movement pose. Continuity toward '+next+': use action match cut or matched composition inside the same bay, not a walk, teleporting equipment or unnatural joint motion. When exercise setups differ, use a clear edit transition rather than pretending continuous uncut biomechanics.\nCOACH VOICE: "'+cue+'" [confident, brief and natural; not a scene description].\nSFX: soft controlled equipment contact, breath and a low tactile exercise beat. No visible face, no auto-generated on-screen anatomy labels.';
  return {number:i+1,exercise,target,seconds:6,voice:cue,prompt};
 });
 const output='Circuit: '+muscle+' — '+circuit.map((x,i)=>(i+1)+'. '+x).join(' → ')+'\n\n'+clips.map(c=>c.prompt).join('\n\n---\n\n')+'\n\nPost-production only: add a precise small body-icon UI badge, target region and timestamp in the editor; Flow cannot reliably render these labels. These are prompts; full form accuracy and anatomy overlays require review, and no videos have been rendered.';
 s.values={muscle,circuit,clips,styleLock:STYLE,referenceRequired:true};s.stage='DONE';s.complete=true;
 return response(s,output,{prompts:clips});
}
