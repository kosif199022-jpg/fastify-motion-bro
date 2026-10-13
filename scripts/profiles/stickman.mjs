import {ensure,asText,cloneSession,fresh,num,response,wordCount,repeated} from './core.mjs';
export const id='stickman';
export const BACKGROUNDS=Object.freeze({
 paper:'[BACKGROUND STYLE — flat hand-drawn/paper background, simple sketched props and scenery, plain paper or whiteboard texture, no photorealistic shading or depth, matches a 2D hand-drawn stick figure]',
 real:'[BACKGROUND STYLE — photorealistic rendered background and environment (real rooms/streets/lighting/depth), stick figure remains flat/2D and visually distinct from the realistic background rather than blended into it]'
});
export const REF='[Use the provided stick man reference image. Keep the character’s design, proportions, and color exactly as shown — do not redesign the figure.]';
export const BIBLE='[CHARACTER BIBLE — paste this into every image prompt below]\nA single original 2D hand-drawn stick character, uniform charcoal black 5-pixel brush strokes at 1080px image width, circular head one-quarter of full height, slim straight torso, single-line arms and legs with limb segments each half a torso length, two dot eyes and one simple expressive mouth stroke. A tiny teal scarf tied at the left side of the neck repeats identically in every shot. Strict palette: black figure, teal scarf, one muted warm accent only where needed; no realistic skin, hair, anatomy or clothing variation. Flat ink illustration, consistent scale, fixed line weight, never redesign.';
const GENRES=['funny','love','heart','twist','dark','surprise'];
const arcs=[
 ['A tiny misunderstanding turns a normal commute into a ridiculous adventure.','Walks toward a harmless problem','Unlikely obstacle grows','First attempt backfires','The situation reaches impossible proportions','A clever visual joke reveals an obvious solution'],
 ['A shy stick figure learns that a small gesture can say more than a speech.','Spots a stranger in need','Offers a simple kindness','Clumsy misunderstanding builds','A quiet choice proves sincere','They share a warm connection'],
 ['A small act of care changes a lonely day.','Alone in a crowded space','Notices someone overlooked','Tries to help without attention','Makes a sacrifice no one sees','A small returned kindness completes the moment'],
 ['What seems like bad luck hides a surprising advantage.','Sets off with confidence','First problem appears','Second problem confirms the wrong assumption','Everything seems lost','Reveal: the obstacle was secretly helping'],
 ['A character learns that even a clever shortcut has consequences.','Spots an easy trick','Tests the shortcut','Gains a little too much confidence','The shortcut creates trouble','Unexpected ironic payoff'],
 ['A simple day becomes a playful visual surprise.','Begins an ordinary routine','Finds a strange clue','Follows the clue','Reality flips for a moment','Returns home with a delightful surprise']
];
export function start(){return response(fresh(id,'SETUP'),'Answer these three together:\nA. Do you already have a stick man image? yes / no\nB. Background style? 1 Paper / 2 Real (flat figure over realistic environment)\nC. Story? 1 Funny / 2 Love / 3 Heart-touching / 4 Plot-twist / 5 Dark comedy / 6 Surprise me.\nOptional: setting, idea, character trait.');}
export function respond(previous,answer){
 const s=cloneSession(previous,id);ensure(s.stage==='SETUP','Stickman accepts setup only');
 ensure(answer&&typeof answer==='object'&&!Array.isArray(answer),'Send {image:"yes/no",background:"paper/real",genre:1..6}');
 const image=asText(answer.image).toLowerCase(), b=asText(answer.background).toLowerCase();
 ensure(['yes','no'].includes(image),'A: image must be yes or no');
 const bg=(b==='1'?'paper':b==='2'?'real':b);ensure(bg in BACKGROUNDS,'B: background must be paper or real');
 const genre=num(answer.genre,1,6,'genre');const extra=asText(answer.direction);
 const setting=extra||'a quiet city plaza with a bench and a small paper bag';
 if(image==='yes'&&asText(answer.referenceTool).toLowerCase()==='text-only')throw Error('A reference character requires image-to-image input. Choose an image-capable tool or restart with image=no to create a Character Bible.');
 const background=BACKGROUNDS[bg], character=image==='yes'?REF:BIBLE;
 const plot=arcs[genre-1];const durations=[7,7,7,7,7];let seconds=0;
 const clips=plot.slice(1).map((beat,i)=>{
  const shots=['wide establishing shot','medium shot at eye-level','over-the-shoulder three-quarter angle','slightly low angle','close-up on posture with space for reveal'];
  const gestures=['walks carefully, arms swinging and eyes searching','tilts head and stretches one arm with two tiny motion strokes','leans backward with arms spread, then points at the discovery','takes one exaggerated step and freezes with shoulders raised','settles into a final pose and delivers a clear visual payoff'];
  const soundtrack=['soft steps, light wind and cloth rustle','shoe scuff, fingertip tap and quiet paper rustle','quick squeak, double footstep and cartoon pop','paper flutter, soft thud and short silence','one light whoosh, satisfying tap and restrained ending sting'];
  const line=i===3?'Wait. What?':'';
  const imagePrompt=character+'\n'+background+'\nSCENE '+(i+1)+': '+beat+'. Story setting: '+setting+'. Original hand-drawn stick figure with '+gestures[i]+'. Camera: '+shots[i]+', 9:16 composition, no drifting proportions, defined floor line, no logos. Mood follows the story arc. Maintain one consistent background rendering approach across ALL five clips.';
  const videoPrompt='GOOGLE FLOW IMAGE-TO-VIDEO — '+durations[i]+'s clip '+(i+1)+'/5. Use generated image as the first-frame reference, preserve silhouette and scarf/reference identity. Camera: '+(i===4?'very slow push-in':'steady with subtle horizontal follow')+'. Animation: '+gestures[i]+', continuous 2D pose-driven movement, no still slideshow or morphing character. '+(line?'Dialogue: "'+line+'" [quiet, surprised]. ':'No dialogue. ')+'Foley: '+soundtrack[i]+'. Atmosphere: understated continuity, no abrupt style changes. Clip exits in an identifiable matching action pose for the next shot.';seconds+=durations[i];
  return {clip:i+1,beat,imagePrompt,videoPrompt,durationSeconds:durations[i],dialogue:line};
 });
 ensure(clips.length===5,'Exactly five clips');
 ensure(repeated(background,clips.map(c=>c.imagePrompt)),'Background lock failed');
 ensure(repeated(character,clips.map(c=>c.imagePrompt)),'Character lock failed');
 const output=[
 'Title: '+(genre===2?'The Smallest Hello':genre===4?'The Unexpected Shortcut':'The Little Surprise'),
 'Premise: '+plot[0],
 'Runtime target: '+seconds+' seconds (5 × 7s; edit-ready, no sixth clip).',
 'Beat breakdown: '+clips.map(c=>c.clip+'. '+c.beat).join(' | '),
 bg==='real'?'Style note: the flat 2D stick figure over photorealistic scenery is intentional. If you want a fully realistic human character, that is a different brief.':'',
 image==='no'?character:'Reference image mode: attach the SAME actual image to every image-generation request.',
 background,
 ...clips.map(c=>'---\n### CLIP '+c.clip+' — '+c.beat+' (target: '+c.durationSeconds+' sec)\nIMAGE PROMPT:\n'+c.imagePrompt+'\nVIDEO MOTION PROMPT:\n'+c.videoPrompt),
 'Continuity check: character lock and background lock are identical in all five images. Max dialogue length: '+Math.max(...clips.map(c=>wordCount(c.dialogue)))+' words (≤8s safe). Runtime: '+seconds+'s. Generate in order and join.',
 'Want a different ending, a punchier clip 5, or a full re-roll with the same genre?'
 ].filter(Boolean).join('\n\n');
 s.values={image,background:bg,genre,direction:setting,bible:character,backgroundLock:background,clips};s.stage='DONE';s.complete=true;return response(s,output,{prompts:clips,continuity:{characterLock:true,backgroundLock:true,totalSeconds:seconds}});
}
