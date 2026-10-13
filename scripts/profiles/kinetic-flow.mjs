import {ensure,asText,num,cloneSession,fresh,response,wordCount} from './core.mjs';
export const id='kinetic-flow';
export const THEMES=Object.freeze({
 A:{name:'Cream Minimal Luxe',background:'#ECEAE3',accent:'#3A3A3A',small:'#8A8A8A',font:'clean bold geometric sans',finish:'desaturated sepia photoreal',overlay:'thin crossing hairlines, black botanical corner silhouettes, faint 8% grid and radial light',animation:'staggered 0.25s grey-to-charcoal word fills',transition:'soft blur-dissolve and sweeping grey arc',endcard:'charcoal paper swirl, letters assemble, tagline, website, fade'},
 B:{name:'Lavender Editorial',background:'#E6D8F6',accent:'#6A1BD1',small:'#6A1BD1',font:'high-contrast condensed italic serif',finish:'glass-violet and glossy black 3D',overlay:'radial white gradient, violet petal corner haze, 8% grid',animation:'italic violet blur-wipe headline and giant cropped reframe',transition:'white flash',endcard:'violet-glow brand reveal'},
 C:{name:'Monochrome Agency',background:'#F4F3EF',accent:'#111111',small:'#2B2B2B',font:'geometric extra-bold black sans',finish:'high-gloss monochrome 3D',overlay:'soft grey vignette, black leaf corners, 8% grid, top-centre space',animation:'blur to sharp, typewriter and dark pill tag stacks',transition:'blur-dissolve and zoom-out to depth',endcard:'dark charcoal swirl, brand assembles with tiny sparks'},
 D:{name:'Midnight Neon',background:'#0B0D17',accent:'#00E5FF',small:'#DDE6F0',font:'flat electric cyan geometric heavy sans with external glow',finish:'dark glass and holographic teal/magenta',overlay:'subtle blue radial glow, perspective grid floor, tiny light particles',animation:'neon tube-style flicker on, bright rule underline',transition:'horizontal light-streak sweep',endcard:'cyan outline draws then fills'},
 E:{name:'Gold Noir Luxury',background:'#0A0A0A',accent:'#C9A24B',small:'#EDE6D6',font:'flat golden high-contrast elegant serif',finish:'polished gold, marble and crystal',overlay:'warm theatrical top spotlight, fine gold frame corners, no grid',animation:'measured gold fade-up and a controlled glint',transition:'gold light leak through black',endcard:'single gold glint across wordmark'},
 F:{name:'Swiss Bold Red',background:'#FFFFFF',accent:'#E30613',small:'#000000',font:'tight-tracked heavy black neo-grotesk sans',finish:'matte red/black/white geometric solid',overlay:'flat studio light, 10% Swiss layout grid and red corner blocks',animation:'hard grid-aligned slide snap with red rectangle wipe',transition:'crisp full-red panel',endcard:'white wordmark on red'},
 G:{name:'Candy Clay Pop',background:'#FFE8DC',accent:'#2D2A4A',small:'#2D2A4A',font:'rounded bubbly indigo heavy sans',finish:'glossy colorful pastel clay',overlay:'peach radial light, confetti dots and tiny squiggles, faint grid',animation:'letter-by-letter squash-and-stretch pop',transition:'round iris wipe and joyful zoom',endcard:'bouncing indigo type and clay confetti'},
 H:{name:'Sage Organic',background:'#DDE3D3',accent:'#2F4A3A',small:'#2F4A3A',font:'soft forest green serif plus light sans',finish:'matte ceramic, linen, stone and wood',overlay:'natural sunlight, dappled leaf shadow, 5% grid',animation:'gentle upward fade with terracotta highlight',transition:'leaf-shadow sweep',endcard:'slow organic wordmark reveal'},
 I:{name:'Corporate Blue Trust',background:'#F7F9FC',accent:'#0B2A5B',small:'#4A5A78',font:'navy heavy geometric sans',finish:'white and cobalt blue glass 3D',overlay:'pale blue gradient, faint grid, small blue data dots',animation:'left-right word wipe, bright blue underline',transition:'clean cobalt light sweep',endcard:'navy field, white wordmark and underline'},
 J:{name:'Brutalist Acid',background:'#BDBDB8',accent:'#C6FF00',small:'#0A0A0A',font:'flat black ultra-condensed heavy sans',finish:'industrial chrome and black rubber',overlay:'rough concrete grain, brutal top light, blank tape tabs and grid',animation:'hard snapping acid highlight punch',transition:'glitch cut and whip-slide',endcard:'acid-lime box slams beneath wordmark'},
 K:{name:'Retro 70s Warm',background:'#F3E3C3',accent:'#E8732C',small:'#5A3A22',font:'rounded heavy warm brown retro serif',finish:'matte lightly faded analog object',overlay:'film grain, warm vignette, orange/mustard sunburst corner',animation:'playful wobbly 70s bounce-in',transition:'sunburst stripe wipe',endcard:'sunburst rotates behind closing brand'},
 L:{name:'Cinematic Dark Documentary',background:'#141414',accent:'#E0A100',small:'#BDBDBD',font:'off-white bold condensed documentary sans',finish:'photoreal side-lit dark graphite',overlay:'fine film grain, amber top spotlight and thin smoke haze, no grid',animation:'slow deep-black fade with spacing expansion',transition:'light flare sweep through black',endcard:'wordmark emerges from charcoal haze'},
 M:{name:'Blueprint Technical',background:'#0F3B6E',accent:'#FFFFFF',small:'#A9C8EE',font:'white bold technical sans',finish:'white engineering wireframe builds to solid blue/white',overlay:'blueprint texture, dense 15% grid, unlabeled corner dimensions',animation:'typewriter + animated drawing stroke',transition:'grid zoom and drawn line wipe',endcard:'white outline brand fills in'},
 N:{name:'Paper Craft Cutout',background:'#F2EBDD',accent:'#D94032',small:'#1A1A1A',font:'flat black thick sans, tiny cut-paper shadow',finish:'layered cardstock and paper fibers',overlay:'torn-paper corners, kraft stock texture and shadows',animation:'stepped stop-motion cutout slides',transition:'physical paper sheet slide',endcard:'paper folds reveal brand'},
 O:{name:'Aurora Glass',background:'#0E0E1A',accent:'#FFFFFF',small:'#C9CBE0',font:'white heavy modern geometric sans',finish:'frosted glass with violet/cyan/peach refracted light',overlay:'aurora gradient, blurred light orbs, very faint grid',animation:'glass blur resolves to sharp bright text',transition:'frosted glass wipe',endcard:'aurora backlit wordmark inside translucent card'},
 P:{name:'Sports Energy',background:'#0B0B0B',accent:'#FFD400',small:'#FFFFFF',font:'flat yellow bold italic condensed sans',finish:'black rubber and carbon-fiber metal',overlay:'rim light, sports impact particles and corner speed marks',animation:'impact-driven motion-blur word slam',transition:'yellow speed-line whip',endcard:'yellow diagonal reveal'},
 Q:{name:'Y2K Chrome Iridescent',background:'#E9ECF2',accent:'#141414',small:'#5A5F6E',font:'flat black wide heavy sans and subtle iridescent outline',finish:'liquid chrome with iridescent reflections',overlay:'pale lilac gradient, chrome droplets and star sparkles',animation:'shimmer sweep with snap stretch',transition:'liquid silver morph wipe',endcard:'chrome blob uncovers wordmark'}
});
export const OPTIONS=[...Object.entries(THEMES).map(([k,v])=>k+'. '+v.name), 'R. Custom: choose background/accent/font/object finish', 'S. Copy a reference clip (requires inspected screenshots/video or user-supplied style DNA)'];
export function start(){return response(fresh(id,'SETUP'),'KINETIC FLOW — choose style and settings in ONE response:\n'+OPTIONS.join('\n')+'\n\nSend JSON such as {"theme":"C","ratio":"9:16","length":10,"brand":"","pace":"fast","audio":"none"}. Defaults: C / 9:16 / 10s / no brand / fast / no audio. Style source S requires visible screenshots/video or style DNA; never assume it was inspected.');}
function buildCustom(obj,name){
 const required=['background','accent','font','finish','overlay','animation','transition'];
 for(const key of required)ensure(asText(obj[key]),'Missing '+name+' '+key);
 ensure(/^#[0-9a-f]{6}$/i.test(obj.background),'Background must be #RRGGBB');
 ensure(/^#[0-9a-f]{6}$/i.test(obj.accent),'Accent must be #RRGGBB');
 return {name,background:obj.background,accent:obj.accent,small:obj.small||'#333333',font:obj.font,finish:obj.finish,overlay:obj.overlay,animation:obj.animation,transition:obj.transition,endcard:obj.endcard||'fade to black'};
}
export function respond(previous,input){
 const s=cloneSession(previous,id);
 if(asText(input).toLowerCase()==='change style')return start();
 if(s.stage==='SETUP'){
  const q=(typeof input==='object'&&input)?input:{theme:input};
  const key=asText(q.theme||'C').toUpperCase();
  ensure(key in THEMES||key==='R'||key==='S','Theme must be A–S');
  s.values.setup={theme:key,ratio:asText(q.ratio||'9:16'),length:Number(q.length??10),brand:asText(q.brand||''),pace:asText(q.pace||'fast'),audio:asText(q.audio||'none')};
  const conf=s.values.setup;
  ensure(['9:16','16:9','1:1'].includes(conf.ratio),'Ratio must be 9:16/16:9/1:1');
  ensure([8,10].includes(conf.length),'Select exactly 8 or 10 seconds per Flow clip');
  ensure(['fast','relaxed'].includes(conf.pace),'Pace: fast or relaxed');
  ensure(['none','sfx'].includes(conf.audio),'Audio: none or sfx (no voiceover/music)');
  if(key==='R'||key==='S'){
   if(q.styleDna){conf.style=buildCustom(q.styleDna,key==='R'?'Custom theme':'Reference: '+asText(q.referenceName||'User-supplied style DNA'));}
   else {s.stage=key==='S'?'REFERENCE':'CUSTOM';return response(s,key==='S'?'Upload 5–8 actual reference screenshots or video and supply a STYLE DNA card (palette hex, typography, objects, transitions, timing) after inspection. Copy the LOOK only, never the words/logos/identities. If not inspectable, describe the movement.':'Provide custom style DNA: background, accent, font, finish, overlay, animation and transition; optional small, endcard.');}
  }else conf.style=THEMES[key];
  s.stage='SCRIPT';return response(s,locked(conf)+'\n\nSend your script. For recorded voice timing, send timestamps like "0–3s: We begin with clarity"; timing overrides pace estimates. We only generate prompts, no Flow calls.');
 }
 if(s.stage==='REFERENCE'||s.stage==='CUSTOM'){
  const q=(input&&typeof input==='object')?input:{};
  s.values.setup.style=buildCustom(q,s.stage==='CUSTOM'?'Custom theme':'Reference: '+asText(q.name||'User-supplied style DNA'));
  s.stage='SCRIPT';return response(s,locked(s.values.setup)+'\n\nSend your script, optionally with line timestamps.');
 }
 if(s.stage==='SCRIPT'){
  const obj=typeof input==='object'&&input?input:{script:input};
  const script=asText(obj.script);ensure(script,'Send actual script text');
  const result=makePrompts(s.values.setup,script,obj.duration);
  s.values.script=script;s.values.production=result;s.stage='DONE';s.complete=true;
  return response(s,result.output,{prompts:result.prompts,risks:result.risks,styleLock:result.style,seconds:result.duration});
 }
 throw Error('Unexpected stage');
}
function locked(c){
 const t=c.style;return 'STYLE LOCK\nTheme: '+c.theme+' — '+t.name+'\nFrame: '+c.ratio+' / '+c.length+' seconds each\nBackground '+t.background+', hero type '+t.font+' in '+t.accent+', small '+t.small+', object '+t.finish+'\nTexture/decor: '+t.overlay+'\nAnimation: '+t.animation+'; transition '+t.transition+'\nTop wordmark: '+(c.brand||'empty')+'\nText: baked in Flow prompt (verify spelling visually)\nAudio: '+(c.audio==='sfx'?'soft transition SFX only':'none')+'; no voice/narration/music.';
}
export function parseTimestamps(script){
 const segments=[];const lines=asText(script).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 for(const line of lines){
  const m=line.match(/^(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)s?\s*:\s*(.+)$/i);
  if(m)segments.push({start:Number(m[1]),end:Number(m[2]),text:m[3].trim()});
 }
 if(segments.length===0)return null;
 ensure(segments.length===lines.length,'If using timestamps, specify one on every line');
 let prev=0;for(const x of segments){ensure(x.start>=prev&&x.end>x.start,'Timestamps must be ordered and nonoverlapping');prev=x.end;}
 return segments;
}
function splitInto(wordTokens,groups){
 const out=[];let start=0;for(let i=0;i<groups;i++){const end=Math.round((i+1)*wordTokens.length/groups);const part=wordTokens.slice(start,end);start=end;if(part.length)out.push(part);}return out;
}
function beatsFor(tokens,length){
 const n=Math.min(5,Math.max(3,Math.ceil(tokens.length/6)));ensure(tokens.length<=30,'Max 30 displayed words per clip; split your script or adjust duration/pace');
 return splitInto(tokens,n).map(arr=>{ensure(arr.length<=6,'Max six words per beat');const idx=arr.findIndex(x=>x.replace(/[^a-zA-Z0-9]/g,'').length>=3&&x.replace(/[^a-zA-Z0-9]/g,'').length<=10);const heroIndex=Math.max(0,idx);return {words:arr,lead:arr.slice(0,heroIndex).join(' '),hero:arr[heroIndex],tail:arr.slice(heroIndex+1).join(' ')};});
}
export function makePrompts(c,script,requestedDuration){
 const theme=c.style,raw=asText(script);
 ensure(theme&&raw,'Style and script needed');
 const timed=parseTimestamps(raw);
 const allTokens=(timed?timed.map(x=>x.text).join(' '):raw).split(/\s+/).filter(Boolean);
 const wps=c.pace==='relaxed'?1.8:2.5;
 const total=timed?timed.at(-1).end:requestedDuration!==undefined?Number(requestedDuration):allTokens.length/wps;
 ensure(Number.isFinite(total)&&total>0,'Invalid script duration');
 const n=Math.max(1,Math.ceil(total/c.length));
 ensure(n<=120,'Too many clips for one session');
 const chunks=Array.from({length:n},()=>[]);
 if(timed){
  for(const seg of timed){const index=Math.min(n-1,Math.floor((seg.start+0.00001)/c.length));chunks[index].push(...seg.text.split(/\s+/).filter(Boolean));}
 }else{
  for(let i=0;i<n;i++){const from=Math.round(i*allTokens.length/n),to=Math.round((i+1)*allTokens.length/n);chunks[i].push(...allTokens.slice(from,to));}
 }
 const style='STYLE: '+theme.background+' clean background, '+theme.overlay+', huge hero words '+theme.font+' color '+theme.accent+', supporting type color '+theme.small+' at one-quarter headline height, object finish '+theme.finish+' with soft contact shadows. '+(c.ratio==='9:16'?'Kinetic lockups upper middle with 10% safe margins, off-centre object lower third.':c.ratio==='16:9'?'Text on left third and objects right.':'Centered typography above object with square-crop safe zones.')+' 40–50% negative space; top-centre '+(c.brand?'small user-owned '+c.brand+' wordmark':'wordmark strip empty')+'.';
 const prompts=[],risks=[];
 const metaphor=['rocket','chess piece','hourglass','blank glass cube','magnifying glass','paper staircase','generic unbranded interface'];
 for(let i=0;i<n;i++){
  const tokens=chunks[i],beats=beatsFor(tokens,c.length);
  let sequence='',quoted=[];
  for(let j=0;j<beats.length;j++){
   const b=beats[j],start=(j*c.length/beats.length),end=((j+1)*c.length/beats.length);
   const txt=b.words.join(' ');quoted.push(txt);
   const obj=metaphor[(i*5+j)%metaphor.length];
   const line='From '+start.toFixed(2)+' to '+end.toFixed(2)+' seconds: one '+theme.finish+' '+obj+' arrives with '+theme.animation+' and soft grounded shadow, settles in an object zone without obscuring text. Display exact small lead "'+b.lead+'", huge hero "'+b.hero+'", small tail "'+b.tail+'" in sequence, use masked staggered reveals and clear all text before the next beat. No text on the '+obj+'. ';
   sequence+=line;
  }
  if(tokens.some(x=>x.replace(/[^a-zA-Z]/g,'').length>10||/\d|-/.test(x)))risks.push(i+1);
  const prompt=c.length+'-second '+(c.ratio==='9:16'?'vertical':c.ratio==='16:9'?'horizontal':'square')+' '+c.ratio+' premium kinetic-typography motion graphics for Google Flow, smooth 60fps aesthetic, locked camera with subtle optical push. '+style+' SEQUENCE: '+sequence+' FINAL SECOND: end the last beat using '+theme.transition+', connecting to the next clip’s initial clean background. TEXT RULES: the only exact on-screen script words, each in separate non-overlapping time window, are '+quoted.map(x=>'"'+x+'"').join('; ')+'. Do not alter spelling, word order or exact punctuation; no other numbers, letters, captions or watermarks; no object labels. AVOID real logos, real-person faces, copyrighted characters, script/handwritten fonts, text distortions or occlusion. AUDIO: '+(c.audio==='sfx'?'Only soft theme-appropriate transition whoosh/click, no music, no voiceover.':'No audio, no voiceover, no music.')+' '+(i===n-1&&c.brand?'END CARD after script beats only: '+theme.endcard+'; user-owned wordmark '+c.brand+'. ':'');
  prompts.push({clip:i+1,total:n,durationSeconds:c.length,ratio:c.ratio,model:c.length===10?'Flow 10-second-capable model (verify availability)':'Veo 8-second-capable model (verify availability)',words:tokens,beats,prompt,style,cleanPlate:false});
 }
 const output='Script ≈ '+allTokens.length+' words; target '+total.toFixed(1)+'s → '+n+' clips × '+c.length+'s ('+c.ratio+'). Rendering model capability must be checked in Flow.\n\n'+prompts.map(p=>'CLIP '+p.clip+' of '+p.total+' · Flow: '+p.model+' · '+p.durationSeconds+'s · '+p.ratio+' · Script: "'+p.words.join(' ')+'"\n'+p.prompt).join('\n\n---\n\n')+'\n\nFLOW TIPS:\n1. Select '+c.length+'s / '+c.ratio+' in a currently available Flow model.\n2. Risky text clips: '+(risks.length?risks.join(', '):'none flagged')+'. Check spelling; regenerate problematic clips or request a clean plate.\n3. Join 1→'+n+' with '+theme.transition+' handoffs.';
 return {prompts,output,risks,style,duration:total};
}
export function cleanPlate(production,clip){
 const n=num(clip,1,production.prompts.length,'clip');
 const p=production.prompts[n-1];
 const safeStyle=p.style.replace(/; top-centre [^.]*\./,'; top-centre strip completely empty and unmarked.');
 const base=p.durationSeconds+'-second premium cinematic motion-graphics CLEAN PLATE in '+p.ratio+'. '+safeStyle+
  ' SEQUENCE: Use the same original generic hero-object animation timing, clean studio light, layered soft shadows, smooth scene transitions and camera rhythm as the corresponding numbered clip, but leave EMPTY SPACES where headline text will later be added in the editor. All onscreen surfaces and objects are completely unlabelled. LAST SECOND: exit to the same neutral background for continuity.'+
  ' TEXT RULES: ABSOLUTELY NO ON-SCREEN TEXT, WORDS, LETTERS, NUMBERS, SYMBOLS, LABELS, CAPTIONS, SUBTITLES, LOGOS, WATERMARKS OR BRAND WORDMARKS anywhere in the rendered footage. AUDIO: No voiceover or dialogue; no music.';
 return {clip:n,prompt:base,overlaySheet:p.beats.map((b,i)=>({order:i+1,words:b.words.join(' '),hero:b.hero,animation:'masked reveal and clean exit'})),note:'Add exact words in editor using the style lock; this fallback is only on the user’s explicit request.'};
}
