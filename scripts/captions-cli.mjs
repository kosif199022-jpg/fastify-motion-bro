#!/usr/bin/env node
/** Import existing SRT; attach requires explicit invocation and creates a backup. */
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseSrt,validateCaptionDuration} from './captions-core.mjs';
export function summarize(source) {
 const cues=parseSrt(source);
 return {count:cues.length,seconds:cues.at(-1).end,cues};
}
export function run(args=process.argv.slice(2)) {
 const [command,path,storyboardPath]=args;
 if(!['check','export','attach'].includes(command)||!path)throw Error('Usage: node scripts/captions-cli.mjs check|export|attach input.srt [storyboard.json]');
 const info=summarize(readFileSync(resolve(path),'utf8'));
 if(command==='check')return 'VALID: '+info.count+' cues, last cue ends at '+info.seconds.toFixed(3)+'s';
 if(command==='export'){
  const destination=resolve(storyboardPath||'project/captions.json');
  writeFileSync(destination,JSON.stringify(info,null,2)+'\n');
  return 'Wrote '+info.count+' captions: '+destination+' (not attached to storyboard yet)';
 }
 if(!storyboardPath)throw Error('attach requires an explicit storyboard JSON path');
 const destination=resolve(storyboardPath),story=JSON.parse(readFileSync(destination,'utf8'));
 validateCaptionDuration(info.cues,Number(story.duration_seconds));
 const backup=destination+'.backup.'+Date.now()+'.json';
 copyFileSync(destination,backup,0);
 story.captions=info.cues;
 writeFileSync(destination,JSON.stringify(story,null,2)+'\n');
 return 'Attached '+info.count+' subtitle cues to '+destination+'; backup: '+backup;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log(run())}catch(e){console.error('ERROR: '+e.message);process.exitCode=1}
}
