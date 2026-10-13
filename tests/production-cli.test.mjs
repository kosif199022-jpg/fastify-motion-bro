import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const script=fileURLToPath(new URL('../scripts/profiles-cli.mjs',import.meta.url));
function execute(root,...args){return execFileSync(process.execPath,[script,...args],{cwd:root,encoding:'utf8'});}
test('CLI list, independently persisted stickman Q&A and 5 text prompts',()=>{
 const cwd=mkdtempSync(join(tmpdir(),'fmb-profile-'));
 try{
  const menu=execute(cwd,'list');
  for(const mode of ['stickman','fitness','car-exploded','vox-history','food-flow','kinetic-flow','character-romance'])assert.ok(menu.includes(mode));
  const first=execute(cwd,'start','stickman');
  assert.match(first,/three together/);
  const next=execute(cwd,'answer','stickman',JSON.stringify({image:'no',background:'paper',genre:1}));
  assert.match(next,/CLIP 5/);
  const dir=resolve(cwd,'projects','profiles','stickman');
  const session=JSON.parse(readFileSync(resolve(dir,'session.json'),'utf8'));
  const prompts=JSON.parse(readFileSync(resolve(dir,'artifacts.json'),'utf8'));
  assert.equal(session.stage,'DONE');
  assert.equal(prompts.prompts.length,5);
  assert.ok(existsSync(resolve(dir,'prompts.txt')));
 }finally{rmSync(cwd,{recursive:true,force:true});}
});
test('CLI Kinetic profile setup, timed script, explicit clean plate only',()=>{
 const cwd=mkdtempSync(join(tmpdir(),'fmb-kinetic-'));
 try{
  execute(cwd,'start','kinetic-flow');
  const lock=execute(cwd,'answer','kinetic-flow',JSON.stringify({theme:'B',ratio:'9:16',length:8}));
  assert.match(lock,/STYLE LOCK/);
  const x=execute(cwd,'answer','kinetic-flow','Focus follows action. Build something real.');
  assert.match(x,/CLIP 1 of/);
  const sheet=JSON.parse(execute(cwd,'clean-plate','kinetic-flow','1'));
  assert.equal(sheet.clip,1);
  assert.match(sheet.prompt,/ABSOLUTELY NO ON-SCREEN TEXT/);
  assert.equal(sheet.prompt.includes('Focus follows action'),false);
  assert.ok(sheet.overlaySheet.length>0);
 }finally{rmSync(cwd,{recursive:true,force:true});}
});
