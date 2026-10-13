import {drawFrame} from './motion.js';
import {drawEditorialFrame} from './editorial.js';
import {drawCaptionOverlay} from './captions.js';
const canvas=document.querySelector('#stage'),seek=document.querySelector('#seek'),play=document.querySelector('#play'),time=document.querySelector('#time'),status=document.querySelector('#status'),list=document.querySelector('#scene-list');
let story,playing=true,seconds=0,last=0;
function draw(t){
 if(!story)return;
 seconds=Math.max(0,Math.min(story.duration_seconds,t));
 if(story.profile==='viral-editorial-3d')drawEditorialFrame(canvas,story,seconds);else drawFrame(canvas,story,seconds);
 if(Array.isArray(story.captions) && story.captions.length){
  const activeScene=story.scenes.find(s=>seconds>=s.start&&seconds<s.end)||story.scenes.at(-1);
  drawCaptionOverlay(canvas,story.captions,seconds,activeScene?.caption_layout||story.caption_layout||{});
 }
 seek.value=Math.round(seconds/story.duration_seconds*1000);
 time.value=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(Math.floor(seconds%60)).padStart(2,'0');
 const active=story.scenes.find(s=>seconds>=s.start&&seconds<s.end)?.id||story.scenes.at(-1)?.id;
 for(const el of list.querySelectorAll('button'))el.classList.toggle('active',el.dataset.id===active);
}
window.renderFrame=draw;
play.addEventListener('click',()=>{playing=!playing;play.textContent=playing?'إيقاف مؤقت':'تشغيل';});
seek.addEventListener('input',()=>{playing=false;play.textContent='تشغيل';draw(story.duration_seconds*Number(seek.value)/1000);});
async function init(){
 try{
  story=window.__FMB_STORYBOARD__||await(await fetch('/project/storyboard.json',{cache:'no-store'})).json();
  if(story.aspect==='1:1'){canvas.width=720;canvas.height=720;}
  else if(story.aspect==='16:9'){canvas.width=960;canvas.height=540;}
  else{canvas.width=540;canvas.height=960;}
  canvas.style.aspectRatio=canvas.width+'/'+canvas.height;
  list.innerHTML='';
  for(const s of story.scenes){const b=document.createElement('button');b.type='button';b.textContent=(s.title||s.headline||'Scene')+' • '+s.start+'s';b.dataset.id=s.id;b.onclick=()=>{playing=false;play.textContent='تشغيل';draw(s.start);};list.append(b);}
  draw(0);status.textContent=story.profile==='viral-editorial-3d'?'Viral Editorial 3D • معاينة Vector 2.5D':'جاهز للمعاينة';window.fmbReady=true;requestAnimationFrame(tick);
 }catch(e){status.textContent='خطأ في التحميل: '+e.message;throw e;}
}
function tick(ms){if(!last)last=ms;const dt=Math.min((ms-last)/1000,.08);last=ms;if(playing&&story){seconds+=dt;if(seconds>=story.duration_seconds)seconds=0;draw(seconds);}requestAnimationFrame(tick);}
init();
