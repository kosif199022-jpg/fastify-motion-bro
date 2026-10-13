#!/usr/bin/env node
import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {newSession,advance,currentOutput,compileStoryboard,makePosters,makeMotionPrompts} from './viral-editorial.mjs';
const base=resolve(process.cwd(),'projects/viral-editorial'), file=resolve(base,'session.json');
const cmd=process.argv[2]||'status';
function save(s){mkdirSync(base,{recursive:true});writeFileSync(file,JSON.stringify(s,null,2)+'\n');}
const state=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):null;
try {
 if(cmd==='start'){const s=newSession();save(s);console.log(currentOutput(s));}
 else if(cmd==='reply'){if(!state)throw Error('Start with npm run viral -- start');if(!process.argv[3])throw Error('Reply with a number or NEXT');const s=advance(state,process.argv[3]);save(s);console.log(currentOutput(s));}
 else if(cmd==='status'){if(!state)throw Error('Start with npm run viral -- start');console.error('Stage: '+state.stage);console.log(currentOutput(state));}
 else if(cmd==='compile'||cmd==='preview-project'){
  if(!state)throw Error('Start with npm run viral -- start');
  const board=compileStoryboard(state);
  mkdirSync(base,{recursive:true});
  writeFileSync(resolve(base,'storyboard.json'),JSON.stringify(board,null,2)+'\n');
  writeFileSync(resolve(base,'posters.json'),JSON.stringify(makePosters(state),null,2)+'\n');
  writeFileSync(resolve(base,'motion-prompts.json'),JSON.stringify(makeMotionPrompts(state),null,2)+'\n');
  if(cmd==='preview-project'){mkdirSync('project',{recursive:true});writeFileSync(resolve('project','storyboard.json'),JSON.stringify(board,null,2)+'\n');}
  console.log('Prepared '+board.scenes.length+' scenes ('+board.duration_seconds+'s). Prompts and local storyboard only; no paid AI media or final MP4 rendered.');
 }else throw Error('Usage: npm run viral -- start | reply 1..5 | reply NEXT | status | compile | preview-project');
}catch(e){console.error('Error: '+e.message);process.exitCode=1;}
