// Fastify Motion Bro: optional gate-controlled Viral Editorial 3D mode.
// Prompts and vector staging, not a connected AI image/video generator.
export const PROFILE = 'viral-editorial-3d';
export const SCENE_SECONDS = 6;
export const PALETTES = Object.freeze({
 '1': {name:'Signature Editorial',background:'#F4F1EC',grid:'#D7D4D0',accent:'#6134B9',text:'#24212A',line:'#D5CFD9',shape:'#E6DFF5'},
 '2': {name:'Dark Technical / Minimal',background:'#1B252C',grid:'#36414A',accent:'#24DAD1',text:'#EFF8F7',line:'#364B50',shape:'#24373B'},
 '3': {name:'High-Contrast Academic',background:'#F1E9DD',grid:'#D8CAB8',accent:'#BC5935',text:'#2C2928',line:'#DFCEBD',shape:'#E9D1C0'}
});
export const TOPICS = Object.freeze([
 {title:'The Attention Trap Nobody Talks About',hero:['eye','screen','hourglass','cursor','brain'],type:['EYE','SCROLL','TIME','CLICK','FOCUS'],lines:[
 'Your attention is not disappearing.','It is being sold in tiny pieces.',
 'Every notification interrupts the moment your mind begins to think deeply.',
 'That quick glance has a hidden price.','Your focus grows when you decide what deserves your eyes.']},
 {title:'Why Saving Money Feels So Hard',hero:['wallet','money','hourglass','chart','chess'],type:['MONEY','HABIT','TIME','CHOICE','FREEDOM'],lines:[
 'Your salary is not your freedom.','A bigger number can hide a smaller future.',
 'Each unnoticed purchase trades a piece of tomorrow for comfort today.',
 'Count the trade, not only the price.','Wealth starts when your choices become stronger than your impulses.']},
 {title:'Stop Learning Technology the Wrong Way',hero:['screen','book','stairs','rocket','lightbulb'],type:['LEARN','WATCH','BUILD','REPEAT','GROW'],lines:[
 'Watching tutorials is not the same as learning.','Knowledge feels powerful until you need to use it.',
 'Each small project exposes gaps that another video can never reveal.',
 'Build before you feel fully ready.','Your real education starts when your hands catch up with your curiosity.']},
 {title:'The Real Reason Some Ideas Spread',hero:['lightbulb','eye','domino','people','rocket'],type:['IDEA','NOTICE','TENSION','SHARE','SPREAD'],lines:[
 'Good ideas are not always the ones people remember.','Attention follows tension, not information alone.',
 'When a simple story challenges an assumption, the mind wants resolution.',
 'Show the conflict before the answer.','An idea spreads when people feel compelled to finish its story.']},
 {title:'The Motivation Myth You Never See',hero:['brain','stairs','clock','chess','star'],type:['DRIVE','WAIT','ACTION','ROUTINE','CHANGE'],lines:[
 'Motivation does not always arrive before action.','Waiting to feel ready can become your longest delay.',
 'Small repeatable steps teach your brain that progress is already happening.',
 'Move before your mood agrees.','Consistency is often the spark that creates the motivation you expected first.']}
]);
function check(ok,msg){if(!ok)throw Error(msg);}
const topic=s=>{check(Number.isInteger(s.selectedTopic)&&s.selectedTopic>=1&&s.selectedTopic<=5,'Select topic in Stage 1');return TOPICS[s.selectedTopic-1];};
const palette=s=>{check(s.selectedPalette&&PALETTES[s.selectedPalette],'Lock palette in Stage 3');return PALETTES[s.selectedPalette];};
export function newSession(){return {schema:'fmb.viral-editorial.v1',profile:PROFILE,stage:'IDEAS',selectedTopic:null,selectedPalette:null,approved:{script:false,palette:false,posters:false},target:{aspect:'9:16',width:1080,height:1920,fps:30},sound:{voiceover:false,music:false,sfx:'cues-only'}};}
export function advance(state,command){
 const s=structuredClone(state);check(s&&s.profile===PROFILE,'Invalid profile');
 const c=String(command).trim().toLowerCase();
 if(s.stage==='IDEAS'){check(/^[1-5]$/.test(c),'Reply with idea 1–5');s.selectedTopic=Number(c);s.stage='SCRIPT';}
 else if(s.stage==='SCRIPT'){check(c==='next','Type NEXT to approve narration');s.approved.script=true;s.stage='PALETTE';}
 else if(s.stage==='PALETTE'){check(/^[1-3]$/.test(c),'Reply with palette 1–3');s.selectedPalette=c;s.approved.palette=true;s.stage='POSTERS';}
 else if(s.stage==='POSTERS'){check(c==='next','Type NEXT to approve posters');s.approved.posters=true;s.stage='MOTION';}
 else if(s.stage==='MOTION'){check(c==='next','Type NEXT to conclude motion prompts');s.stage='DONE';}
 else throw Error('Session complete');
 return s;
}
export function makePosters(s){
 const p=palette(s),t=topic(s);
 return t.lines.map((line,i)=>({number:i+1,scriptLine:line,hero:t.hero[i],typography:t.type[i],
  prompt:'Vertical 9:16 editorial mixed-media KEYFRAME REFERENCE PROMPT, aspirational 8K detail (no file generated). Locked '+p.name+' environment: '+p.background+' warm/tinted base, low contrast '+p.grid+' modular dotted/dashed grid, '+p.accent+' accent, 80% neutrals / 20% single dominant punchy accent. Exactly two very subtle translucent diagonal environmental background lines in '+p.line+' behind every foreground element. EXACTLY ONE main 3D-looking '+t.hero[i]+' cutout object, retro halftone edging, ONE corner starburst and ONE dotted vector orbit as the only two supporting accents. 2.5D spatial plane, believable directional editorial shadows, fine paper grain, negative space, controlled asymmetry. Center mobile-safe layout, 10% minimum side margin. Main typography is one to four large words, pairing bold sans-serif with elegant italic serif. Do not bake paragraphs, watermarks, trademarks or extra hero objects into picture. Visual metaphor of narration: '+line
 }));
}
export function makeMotionPrompts(s){
 const p=palette(s),t=topic(s);
 return t.lines.map((line,i)=>({number:i+1,scriptLine:line,hero:t.hero[i],typography:t.type[i],durationSeconds:6,
  style:'2.5D mixed-media editorial; one hero '+t.hero[i]+' with halftone edge and oversized '+t.type[i]+' kinetic lettering',
  backgroundMotion:'Exactly TWO translucent independent softly curving diagonal lines in '+p.line+' behind all foreground layers continuously; no third environmental line.',
  timeline:{
   base:'0.0–0.5s empty '+p.background+' fine '+p.grid+' grid; background two lines already drifting and all heroes/text off screen.',
   entrance:'0.5–3.5s hero slides diagonally in with easeOutCubic and 7% overshoot, planes stagger 6–9 frames; word-by-word masked kinetic reveal; one 4-point vector star or UI cursor micro click; low-opacity ghost typography drifts opposite.',
   hold:'3.5–4.7s hero 2.5D floats on restrained sine-wave, 0.6deg optical wobble, shadow lag and light shimmer; steady 4% push-in; two background lines never pause.',
   exit:'4.7–6.0s masked vertical text wipe, tracking expansion and slow geometric shape exit to connect with next shot; two background lines continue behind transition.'
  },camera:'Locked lens, 4% slow optical push, slight Z-axis drift; no shake',
  easing:'heavy ease-out with 5–10% spring settling',sfx:'paper whoosh + subtle UI click + light mechanical thud; cues only',
  music:false,voiceover:false
 }));
}
export function currentOutput(state){
 check(state&&state.profile===PROFILE,'Invalid profile');
 switch(state.stage){
 case 'IDEAS':return '# | Video Title\n--- | ---\n'+TOPICS.map((t,i)=>(i+1)+' | '+t.title).join('\n')+'\n\nWhich idea do you want to develop? Reply with a number (1–5).';
 case 'SCRIPT':return topic(state).lines.join('\n\n');
 case 'PALETTE':return Object.entries(PALETTES).map(([n,p])=>n+'. '+p.name+': '+p.background+' + '+p.accent+'; grid '+p.grid+'; exactly two background lines '+p.line).join('\n');
 case 'POSTERS':return makePosters(state).map(x=>'Script line: "'+x.scriptLine+'"\n\nText-to-image prompt:\n\n'+x.prompt+'\n\nTypography text:\n\n'+x.typography).join('\n\n---\n\n')+'\n\nType "NEXT" to generate video motion prompts.';
 case 'MOTION':return makeMotionPrompts(state).map(x=>'Scene '+x.number+' — "'+x.scriptLine+'"\n\n• Motion Style: '+x.style+'\n\n• Background Motion: '+x.backgroundMotion+'\n\n• 0.0–0.5s: '+x.timeline.base+'\n\n• 0.5–3.5s: '+x.timeline.entrance+'\n\n• 3.5–4.7s: '+x.timeline.hold+'\n\n• 4.7–6.0s: '+x.timeline.exit+'\n\n• Camera: '+x.camera+'\n\n• SFX Track: '+x.sfx+'\n\n• No voice-over. No background music.').join('\n\n---\n\n');
 default:return 'Planning stages complete. Preview must be reviewed; final render requires separate authorization.';
 }
}
export function compileStoryboard(state){
 check(state.stage==='MOTION'||state.stage==='DONE','Finish explicit stage approvals first');
 const p=palette(state),t=topic(state),shots=makeMotionPrompts(state);
 return {version:1,profile:PROFILE,brief:{title:t.title,topic:t.title,style:PROFILE,aspect:'9:16',language:'en',voiceover:'none',music:'none',approved:false},
  duration_seconds:shots.length*SCENE_SECONDS,aspect:'9:16',fps:30,palette:p,exact_background_lines:2,
  approval:{script:state.approved.script,palette:state.approved.palette,posters:state.approved.posters,final_render:false},
  sound:state.sound,scenes:shots.map((x,i)=>({id:'editorial-'+String(i+1).padStart(2,'0'),start:i*6,end:(i+1)*6,title:x.typography,text:x.scriptLine,headline:x.typography,hero:x.hero,visual:'2.5D kinetic editorial collage',motionPrompt:x,sfx:x.sfx})),
  caveat:'Native Canvas renders original vector 2.5D heroes, not physical 3D models or actual 8K-generated posters. SFX descriptions are timing cues only.'};
}
