/** Animated on-canvas caption overlay shared by local preview and Chromium render. */
import {cueAt} from '../scripts/captions-core.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function wrap(ctx,text,maxWidth) {
 const words=String(text).replace(/\s+/g,' ').trim().split(' ');
 const lines=[];let line='';
 for(const word of words) {
  const next=line?line+' '+word:word;
  if(line&&ctx.measureText(next).width>maxWidth){lines.push(line);line=word;}
  else line=next;
 }
 if(line)lines.push(line);
 return lines;
}
export function drawCaptionOverlay(canvas,cues,t) {
 const cue=cueAt(cues,t);
 if(!cue)return false;
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,vertical=h>w;
 const fade=Math.min(.18,(cue.end-cue.start)/4);
 const a=fade>0?clamp((t-cue.start)/fade,0,1)*clamp((cue.end-t)/fade,0,1):1;
 c.save();c.globalAlpha=a;c.textAlign='center';c.textBaseline='middle';c.direction='rtl';
 const maxWidth=w*.84,maxLines=2;
 let font=Math.round(w*(vertical?.049:.034)),lines=[];
 for(let tries=0;tries<12;tries++){c.font='700 '+font+'px Tahoma,Arial,sans-serif';lines=wrap(c,cue.text,maxWidth);if(lines.length<=maxLines&&lines.every(s=>c.measureText(s).width<=maxWidth))break;font=Math.max(12,font-2);}
 // Truncate display only if a cue cannot fit even at the smallest legible size; source remains unchanged in storyboard.
 if(lines.length>maxLines)lines=lines.slice(0,maxLines);
 const lineHeight=font*1.25,boxH=lines.length*lineHeight+font*.9;
 const x=w*.06,y=h*(vertical?.805:.80),bw=w*.88;
 c.fillStyle='rgba(5,12,27,0.87)';c.beginPath();c.roundRect(x,y,bw,boxH,Math.max(8,font*.45));c.fill();
 c.font='700 '+font+'px Tahoma,Arial,sans-serif';c.fillStyle='#ffffff';
 for(let i=0;i<lines.length;i++)c.fillText(lines[i],w*.5,y+font*.67+i*lineHeight,maxWidth);
 c.restore();
 return true;
}
