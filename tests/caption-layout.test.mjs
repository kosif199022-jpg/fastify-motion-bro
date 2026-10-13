import test from 'node:test';
import assert from 'node:assert/strict';
import {paginateCaptionText,selectCaptionPage,drawCaptionOverlay} from '../web/captions.js';

const measure=s=>Array.from(s).length*9;
test('long captions are paginated without truncating any original word',()=>{
 const words=Array.from({length:30},(_,i)=>'كلمة'+i);
 const pages=paginateCaptionText(words.join(' '),measure,110,2);
 assert(pages.length>2);
 assert(pages.every(p=>p.length<=2 && p.every(l=>measure(l)<=110)));
 assert.equal(pages.flat().join(' ').replace(/\s+/g,' '),words.join(' '));
});
test('grapheme safe splitting keeps a long token fully represented',()=>{
 const word='تَجرِبَةمتّصلة'.repeat(5);
 const pages=paginateCaptionText(word,measure,45,2);
 assert(pages.length>1);
 assert.equal(pages.flat().join(''),word);
 assert(pages.every(p=>p.every(l=>measure(l)<=45)));
});
test('pages change deterministically and never exceed cue boundaries',()=>{
 const pages=[['أولًا'],['ثانيًا'],['ثالثًا']];
 const cue={start:1,end:7,text:'أولًا ثانيًا ثالثًا'};
 assert.equal(selectCaptionPage(cue,pages,.99),-1);
 assert.equal(selectCaptionPage(cue,pages,1.2),0);
 assert.equal(selectCaptionPage(cue,pages,4),1);
 assert.equal(selectCaptionPage(cue,pages,6.9),2);
 assert.equal(selectCaptionPage(cue,pages,7),-1);
});
test('Canvas overlay draws multiple pages without mutating original source',()=>{
 const printed=[];
 const ctx={
  save(){},restore(){},beginPath(){},roundRect(){},fill(){},
  measureText(s){return {width:measure(s)};},
  fillText(s){printed.push(s);},
 };
 const canvas={width:540,height:960,getContext(){return ctx;}};
 const text=Array.from({length:45},(_,i)=>'اختبار'+i).join(' ');
 const cues=[{id:'caption-0001',start:0,end:9,text}];
 assert(drawCaptionOverlay(canvas,cues,0.5));
 const first=printed.join('|');printed.length=0;
 assert(drawCaptionOverlay(canvas,cues,8.5));
 assert.notEqual(printed.join('|'),first);
 assert.equal(cues[0].text,text);
 assert(!drawCaptionOverlay(canvas,cues,9.1));
});

test('caption top/center/bottom placement obeys adjustable safe area',()=>{
 let ys=[];
 const ctx={
  save(){},restore(){},beginPath(){},roundRect(x,y,w,h){ys.push({y,h});},
  fill(){},fillText(){},measureText(s){return {width:measure(s)};},
 };
 const canvas={width:540,height:960,getContext(){return ctx;}};
 const cues=[{start:0,end:3,text:'عنوان واضح'}];
 assert(drawCaptionOverlay(canvas,cues,1,{placement:'top'}));
 assert(drawCaptionOverlay(canvas,cues,1,{placement:'center'}));
 assert(drawCaptionOverlay(canvas,cues,1,{placement:'bottom'}));
 assert(ys[0].y<ys[1].y && ys[1].y<ys[2].y);
 assert(drawCaptionOverlay(canvas,cues,1,{placement:'bottom',offsetY:10}));
 assert(ys[3].y>=0 && ys[3].y+ys[3].h<=canvas.height*.931);
});
