import {ensure,asText,num,cloneSession,fresh,response,wordCount} from './core.mjs';
export const id='vox-history';
export const CATEGORIES=[
 'Aviation & Exploration firsts (Wright Brothers, Moon Landing, Everest)',
 'War & Military History (D-Day, WWI trenches, Cold War events)',
 'Science & Invention breakthroughs (electricity, vaccines, space race)',
 'Disasters & Turning Points (Titanic, Chernobyl, market crashes)',
 'Political & Social History (revolutions, civil rights milestones)',
 'Ask me — I’ll type my own topic'
];
export const STYLE='Vintage archival scrapbook / mixed-media historical documentary: sepia aged newspaper surface, film grain, scan lines, halftone print texture, distressed and warped paper corners, torn-photo cutouts with white borders, label stickers, brass tacks, occasional red thread and original generic ARCHIVE rubber-stamp marks. Muted sepia / grey; projector flicker and dust-scratch overlays throughout. FAST stop-motion-style snappy entrances, NOT slow floating CGI.';
export const VOICE='Deep, serious male documentary narrator voice, slightly reverberant like an old film reel, speaking over the visuals:';
const STAGES=['origins','first signal','people involved','turning point','public response','lasting legacy'];
const INVENTORY=[
 ['torn archival photo cutout','typed paper label','folded era map fragment','brass tack','red string segment','ARCHIVE stamp'],
 ['front-page clipping','small date sticker without invented numbers','old schematic illustration','creased telegram','wax-paper corner','photo border'],
 ['hand-drawn timeline strip','archival contact-sheet rectangle','map inset','film leader strip','paper tape','file-folder tab'],
 ['official-looking document without fake authentic seals','folded clipping','halftone equipment illustration','string crossing map','round brass fastener','weathered cardboard frame']
];
function narrate(topic,i,n){
 if(i===0)return 'To understand '+topic+', begin with the world that existed before the turning point.';
 if(i===n-1)return 'The lasting meaning of '+topic+' lies in the questions its history still leaves behind.';
 const options=[
  'Early signs emerged, but their importance was not immediately clear to everyone watching.',
  'People made choices with limited knowledge, each decision changing what could happen next.',
  'The central event became impossible to ignore, drawing attention far beyond its first witnesses.',
  'News spread through documents, voices, and images, changing how communities understood events.',
  'In the aftermath, institutions and individuals struggled to explain what had happened.'
 ];
 return options[(i-1)%options.length];
}
export function start(){return response(fresh(id,'TOPIC'),'What kind of historical documentary do you want?\n'+CATEGORIES.map((x,i)=>(i+1)+'. '+x).join('\n')+'\nChoose one category, or type your own specific historical subject.');}
export function respond(previous,input){
 const s=cloneSession(previous,id),v=asText(typeof input==='object'?input.value??input.topic??input.count:input);
 if(s.stage==='TOPIC'){
  if(/^[1-6]$/.test(v)){
   const k=Number(v);if(k===6){s.stage='CUSTOM';return response(s,'Type the exact historical event, figure, date or topic you want, e.g. Apollo 11 Moon Landing.');}
   const suggested=['Apollo 11 Moon Landing','D-Day landings','Development of the modern electric light','Titanic sinking','The civil rights movement'][k-1];
   s.values.topic=suggested;s.values.category=CATEGORIES[k-1];
  }else{ensure(v.length>=3,'Please name a historical subject');s.values.topic=v;s.values.category='custom';}
  s.stage='COUNT';return response(s,'Topic: '+s.values.topic+'. How many 10-second clips? Choose 5, 10, 15, 20, or enter any positive integer.');
 }
 if(s.stage==='CUSTOM'){ensure(v.length>=3,'Please provide a clear historical topic');s.values.topic=v;s.values.category='custom';s.stage='COUNT';return response(s,'Topic locked: '+v+'. How many 10-second clips? Choose 5, 10, 15, 20, or enter a positive integer.');}
 ensure(s.stage==='COUNT','Stage order violation');
 const n=num(v,1,120,'clip count');const topic=s.values.topic;
 const clips=Array.from({length:n},(_,i)=>{
  const inv=INVENTORY[i%INVENTORY.length];const next=INVENTORY[(i+1)%INVENTORY.length];
  const narration=narrate(topic,i,n).split(/\s+/).slice(0,19).join(' ');ensure(wordCount(narration)<20,'Narration too long');
  const context=STAGES[Math.min(STAGES.length-1,Math.floor(i*STAGES.length/n))];
  const prompt='CLIP '+(i+1)+' of '+n+'\n'+STYLE+'\nStory subject: '+topic+'. Historical narrative phase: '+context+'. Archive designs and paper elements must be visually evocative but NOT presented as verified original historical photographs unless authenticated sources are supplied.\nAnimation sequence (10 seconds, FAST new elements every 1.5–2 seconds):\n0–2s: '+inv[0]+' and '+inv[1]+' snap/drop in together from different edges, stop-motion bounce settle.\n2–4s: '+inv[2]+' and '+inv[3]+' strike quickly into different picture planes, overlapping one earlier element.\n4–6s: '+inv[4]+' reveals a link or raises a conflict in the timeline while a cropped clue moves on top.\n6–8s: '+inv[5]+' lands as another torn-paper detail shifts the viewer’s attention.\n8–10s: one fresh '+next[0]+' enters and the six-element archival spread briefly holds as the camera steadies for the next connected spread.\nStyle: repeat identical sepia/grey paper textures, grain, tiny projector flicker and dust, snappy pop/drop/slide with short settle; no slow CGI drifts; each beat has multiple distinct collage assets.\nAudio: '+VOICE+'\n"'+narration+'"\nLow original film projector hum, paper rustling, fast paper snaps and soft archival-room ambience precisely timed to element entrances. No invented claims about real evidence.';
  return {clip:i+1,durationSeconds:10,narration,phase:context,elements:inv,prompt};
 });
 const output='Historical documentary: '+topic+' — '+n+' × 10s = '+n*10+'s\n\n'+clips.map(c=>c.prompt).join('\n\n---\n\n')+'\n\nSource check: narration lines are editorial placeholders, not a verified historical timeline. For factual release, research specific events and use authenticated archival images and accurate dates. Revise a single clip in place without regenerating the rest.';
 s.values={...s.values,clips,count:n,styleLock:STYLE,voiceLock:VOICE,needsFactCheck:true};s.complete=true;s.stage='DONE';
 return response(s,output,{prompts:clips,styleLock:STYLE,voiceLock:VOICE,needsFactCheck:true});
}
