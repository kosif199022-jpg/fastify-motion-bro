#!/usr/bin/env node
// Local stage-gated director CLI. Pure text prompts & saved project JSON, no paid APIs.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import * as stickman from './profiles/stickman.mjs';
import * as romance from './profiles/character-romance.mjs';
import * as fitness from './profiles/fitness.mjs';
import * as car from './profiles/car-exploded.mjs';
import * as vox from './profiles/vox-history.mjs';
import * as food from './profiles/food-flow.mjs';
import * as kinetic from './profiles/kinetic-flow.mjs';
import {cleanPlate} from './profiles/kinetic-flow.mjs';
const modules=[stickman,romance,fitness,car,vox,food,kinetic];
const registry=Object.fromEntries(modules.map(m=>[m.id,m]));
const usage='Usage:\n npm run profile -- list\n npm run profile -- start <profile>\n npm run profile -- answer <profile> <reply or JSON>\n npm run profile -- status <profile>\n npm run profile -- clean-plate kinetic-flow <clip number>\n npm run profile -- reset <profile>\n\nRun "npm run profile -- list" to discover modes. Every stage requires an explicit user reply.';
const [cmd,id,...rest]=process.argv.slice(2);
function files(name){
 const root=resolve(process.cwd(),'projects','profiles',name);
 return {root,session:resolve(root,'session.json'),output:resolve(root,'prompts.txt'),artifacts:resolve(root,'artifacts.json')};
}
function show(x){if(x?.output)process.stdout.write(x.output+'\n');}
function save(id,x){
 const f=files(id);mkdirSync(f.root,{recursive:true});writeFileSync(f.session,JSON.stringify(x.state,null,2)+'\n');
 if(x.state?.complete){writeFileSync(f.output,String(x.output||'')+'\n');writeFileSync(f.artifacts,JSON.stringify(x.artifacts||{},null,2)+'\n');}
}
function load(id){const f=files(id);if(!existsSync(f.session))throw Error('Session missing: run npm run profile -- start '+id);return JSON.parse(readFileSync(f.session,'utf8'));}
function parseArg(args){const str=args.join(' ').trim();if(!str)throw Error('Reply cannot be empty');if(str.startsWith('{')||str.startsWith('[')){try{return JSON.parse(str);}catch(e){throw Error('Invalid JSON reply: '+e.message);}}return str;}
try{
 if(cmd==='list'){console.log('Available original prompt-only production profiles:\n'+modules.map((m,i)=>(i+1)+'. '+m.id).join('\n')+'\n\nA generic "start" requires choosing one mode to prevent conflicting profile triggers.');}
 else {
  if(!registry[id])throw Error('Unknown profile: '+id+'\n'+usage);
  const m=registry[id],f=files(id);
  if(cmd==='start'){const x=m.start();save(id,x);show(x);}
  else if(cmd==='status'){const s=load(id);console.log('PROFILE '+id+' STAGE '+s.stage+(s.complete?' COMPLETE':' AWAITING REPLY'));if(s.complete&&existsSync(f.output))console.log('Output: '+f.output);}
  else if(cmd==='answer'){const ans=parseArg(rest);const x=m.respond(load(id),ans);save(id,x);show(x);}
  else if(cmd==='reset'){const x=m.start();save(id,x);show(x);}
  else if(cmd==='clean-plate'){if(id!=='kinetic-flow')throw Error('Clean plate only applies to Kinetic Flow');const s=load(id);if(!s.complete||!s.values.production)throw Error('Generate script-based prompts first');const x=cleanPlate(s.values.production,Number(rest[0]));console.log(JSON.stringify(x,null,2));}
  else throw Error(usage);
 }
}catch(err){console.error('ERROR: '+err.message);process.exitCode=1;}
