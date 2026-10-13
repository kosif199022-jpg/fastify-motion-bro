import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const ROOT = resolve(new URL('../', import.meta.url).pathname);
export const defaultBrief = {title:'Fastify Motion Bro',topic:'جمال الحركة',duration_seconds:30,aspect:'9:16',style:'kinetic',language:'ar',voiceover:'none'};
export function normalizeBrief(input={}) {
  const b = {...defaultBrief,...input};
  b.duration_seconds = Number(b.duration_seconds);
  if(!Number.isFinite(b.duration_seconds)||b.duration_seconds<3||b.duration_seconds>600) throw Error('Duration must be 3–600 seconds');
  if(!['9:16','16:9','1:1'].includes(b.aspect)) throw Error('Invalid aspect ratio');
  for(const k of ['title','topic','style','language']) if(typeof b[k]!=='string'||!b[k].trim()) throw Error('Missing '+k);
  return b;
}
export function makeStoryboard(input) {
  const b=normalizeBrief(input); const beats= b.duration_seconds<=12?3:b.duration_seconds<=35?5:Math.min(12,Math.ceil(b.duration_seconds/6));
  const names=['افتتاحية','الفكرة','التوضيح','التحول','النتيجة','الخاتمة'];
  const dur=b.duration_seconds/beats; const scenes=[];
  for(let i=0;i<beats;i++){
    const start=Math.round(i*dur*1000)/1000;
    const end=i===beats-1?b.duration_seconds:Math.round((i+1)*dur*1000)/1000;
    scenes.push({id:'scene-'+String(i+1).padStart(2,'0'),start,end,title:names[Math.min(i,names.length-1)],text:i===0?b.topic:i===beats-1?'القصة تبدأ بالحركة':names[Math.min(i,names.length-1)]+' • '+b.topic,visual:i%3===0?'kinetic-typography':i%3===1?'dynamic-infographic':'hand-drawn-shapes',motion:'Continuous camera and vector keyframe animation; no still-slide fades',sfx:'soft-whoosh'});
  }
  return {version:1,brief:b,duration_seconds:b.duration_seconds,aspect:b.aspect,fps:30,scenes,note:'These are editable starter scenes. Rewrite visual direction and timing for actual script/audio.'};
}
export function plan(root=ROOT) {
  const p=resolve(root,'project');
  mkdirSync(p,{recursive:true});
  const b=normalizeBrief(JSON.parse(readFileSync(resolve(p,'brief.json'),'utf8')));
  const s=makeStoryboard(b);
  writeFileSync(resolve(p,'storyboard.json'),JSON.stringify(s,null,2)+'\n');
  writeFileSync(resolve(p,'STYLE.md'),'# STYLE BIBLE\n\nLanguage: '+b.language+'\nAspect: '+b.aspect+'\nStyle: '+b.style+'\nUse moving compositions, Arabic RTL typography and frame accurate cues.\n');
  writeFileSync(resolve(p,'PLAN.md'),'# '+b.title+'\n\nTopic: '+b.topic+'\n\n'+s.scenes.map(x=>'- [ ] '+x.id+' | '+x.start+'s–'+x.end+'s | '+x.text+' | '+x.visual).join('\n')+'\n\n- [ ] Preview reviewed\n- [ ] Explicit final export approval\n- [ ] QA frames / audio\n');
  return s;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) console.log('Planned '+plan().scenes.length+' scenes in project/');
