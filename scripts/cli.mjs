import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { plan, normalizeBrief } from './planner.mjs';
const rl=createInterface({input,output});
const ask=async(text,def)=>{const v=(await rl.question(text+' ['+def+']: ')).trim();return v||def;};
try {
 console.log('🎬 Fastify Motion Bro — Answer only what you know; defaults are editable.');
 const title=await ask('عنوان الفيديو','Fastify Motion Bro');
 const topic=await ask('الفكرة أو الرسالة','حكاية نجاح');
 const style=await ask('الستايل (kinetic, doodle, whiteboard, 3d, infographic)','kinetic');
 const aspect=await ask('المقاس 9:16 أو 16:9 أو 1:1','9:16');
 const duration_seconds=Number(await ask('المدة بالثواني','30'));
 const language=await ask('اللغة/اللهجة','ar-EG');
 const voiceover=await ask('التعليق الصوتي: ملف / إنشاء لاحقاً / بدون','none');
 const brief=normalizeBrief({title,topic,style,aspect,duration_seconds,language,voiceover,approved:false});
 mkdirSync('project',{recursive:true});
 writeFileSync('project/brief.json',JSON.stringify(brief,null,2)+'\n');
 const story=plan();
 console.log('✅ Project brief + '+story.scenes.length+' planned scenes. Rewrite creative placeholders after studying assets.');
 console.log('Next: npm run preview (then approve before final render).');
} finally {rl.close();}
