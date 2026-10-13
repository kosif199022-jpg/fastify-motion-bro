/** Caption overlay for local preview and Chromium renderer; all source words remain visible over time. */
import {cueAt} from './captions-core.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

/** Convert original caption text into width-bounded pages without dropping words.
 * Caller provides CanvasRenderingContext2D.measureText-equivalent measuring function.
 * Too-long tokens are split on Unicode grapheme boundaries, never UTF-16 code units.
 */
export function paginateCaptionText(text,measure,maxWidth,maxLines=2) {
 if(typeof measure!=='function'||!Number.isFinite(maxWidth)||maxWidth<=0
  ||!Number.isSafeInteger(maxLines)||maxLines<1) throw Error('Invalid caption layout constraints');
 const segmenter = typeof Intl?.Segmenter==='function'
   ? new Intl.Segmenter(undefined,{granularity:'grapheme'}) : null;
 const graphemes = token => segmenter ? Array.from(segmenter.segment(token),x=>x.segment) : Array.from(token);
 const lines=[];let line='';
 const flush=()=>{if(line){lines.push(line);line='';}};
 const append=word=>{
  if(!word)return;
  const combined=line?line+' '+word:word;
  if(measure(combined)<=maxWidth){line=combined;return;}
  flush();
  if(measure(word)<=maxWidth){line=word;return;}
  let part='';
  for(const g of graphemes(word)) {
   if(!part||measure(part+g)<=maxWidth)part+=g;
   else {lines.push(part);part=g;}
  }
  line=part;
 };
 for(const paragraph of String(text).replace(/\r/g,'').split('\n')) {
  if(!paragraph.trim()){flush();continue;}
  for(const word of paragraph.trim().split(/\s+/u))append(word);
  flush();
 }
 flush();
 if(!lines.length)return [];
 const pages=[];
 for(let i=0;i<lines.length;i+=maxLines)pages.push(lines.slice(i,i+maxLines));
 return pages;
}

/** Allocate cue duration among caption pages by grapheme count, without duplicating words. */
export function selectCaptionPage(cue,pages,t) {
 if(!pages.length||!Number.isFinite(t)||t<cue.start||t>=cue.end)return -1;
 const counts=pages.map(p=>Math.max(1,Array.from(p.join(' ')).length));
 const total=counts.reduce((a,b)=>a+b,0);
 const progress=clamp((t-cue.start)/(cue.end-cue.start),0,1)*total;
 let cursor=0;
 for(let i=0;i<pages.length;i++){cursor+=counts[i];if(progress<cursor)return i;}
 return pages.length-1;
}

export function drawCaptionOverlay(canvas,cues,t) {
 const cue=cueAt(cues,t);
 if(!cue)return false;
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,vertical=h>w;
 if(!c)return false;
 c.save();
 const maxWidth=w*.82,maxLines=2;
 const font=Math.max(12,Math.round(w*(vertical?.049:.034)));
 c.font='700 '+font+'px Tahoma,Arial,sans-serif';
 c.direction='rtl';
 const pages=paginateCaptionText(cue.text,s=>c.measureText(s).width,maxWidth,maxLines);
 const pageIndex=selectCaptionPage(cue,pages,t);
 if(pageIndex<0){c.restore();return false;}
 const lines=pages[pageIndex];
 const lineHeight=font*1.3,boxH=lines.length*lineHeight+font*.9;
 // Keep the entire box inside the lower safe region, including landscape format.
 const x=w*.06,bw=w*.88,y=Math.min(h*(vertical?.805:.78),h*.93-boxH);
 // Page changes have a subtle temporal opacity ramp, but no original words vanish.
 const fade=Math.min(.12,(cue.end-cue.start)/8);
 const alpha=fade>0?clamp((t-cue.start)/fade,0,1)*clamp((cue.end-t)/fade,0,1):1;
 c.globalAlpha=alpha;c.textAlign='center';c.textBaseline='middle';
 c.fillStyle='rgba(5,12,27,0.9)';c.beginPath();
 c.roundRect(x,y,bw,boxH,Math.max(8,font*.4));c.fill();
 c.fillStyle='#ffffff';
 for(let i=0;i<lines.length;i++)c.fillText(lines[i],w*.5,y+font*.68+i*lineHeight,maxWidth);
 c.restore();
 return true;
}
