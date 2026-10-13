/** Pure SRT parser for timed captions; no speech-to-text claim or cloud access. */
export function parseTimestamp(input) {
 const m=/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/.exec(String(input).trim());
 if(!m)throw Error('Bad subtitle timestamp: '+input);
 const [,hh,mm,ss,ms]=m.map(Number);
 if(mm>59||ss>59)throw Error('Subtitle timestamp range error: '+input);
 return hh*3600+mm*60+ss+ms/1000;
}
export function parseSrt(raw) {
 if(typeof raw!=='string')throw Error('SRT input must be text');
 const source=raw.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
 if(!source)throw Error('SRT is empty');
 const blocks=source.split(/\n\s*\n/);
 if(blocks.length>10000)throw Error('Too many caption cues');
 const cues=[];
 for(const [index,block] of blocks.entries()){
  const lines=block.split('\n').map(x=>x.trim()).filter(Boolean);
  const at=lines.findIndex(line=>line.includes('-->'));
  if(at<0||at>1)throw Error('Missing time range in SRT cue '+(index+1));
  const sides=lines[at].split('-->').map(x=>x.trim());
  if(sides.length!==2)throw Error('Invalid time range in SRT cue '+(index+1));
  const start=parseTimestamp(sides[0]),end=parseTimestamp(sides[1].split(/\s+/)[0]);
  const text=lines.slice(at+1).join('\n');
  if(!text||text.length>500)throw Error('Missing or too-long cue text '+(index+1));
  if(end<=start)throw Error('Nonpositive duration in SRT cue '+(index+1));
  if(cues.length && start<cues.at(-1).end-0.001)throw Error('Caption overlap or unsorted cues at '+(index+1));
  cues.push({id:'caption-'+String(index+1).padStart(4,'0'),start,end,text});
 }
 return cues;
}
export function cueAt(cues,time) {
 if(!Array.isArray(cues)||!Number.isFinite(time))return null;
 return cues.find(x=>time>=x.start && time<x.end)||null;
}
export function validateCaptionDuration(cues,duration) {
 if(!Number.isFinite(duration)||duration<=0)throw Error('Storyboard duration must be positive');
 if(cues.some(x=>x.end>duration+0.001))throw Error('Caption extends beyond approved storyboard duration');
 return true;
}
