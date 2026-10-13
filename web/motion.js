const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));const ease=t=>1-Math.pow(1-clamp(t,0,1),3);const PI=Math.PI;
function roundRect(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);}
function splitArabic(text,maxChars=18){const words=String(text).split(/\s+/),out=[];let row='';for(const word of words){if((row+' '+word).trim().length>maxChars&&row){out.push(row);row=word;}else row=(row+' '+word).trim();}if(row)out.push(row);return out.slice(0,4);}
export function drawFrame(canvas,story,t){
 const c=canvas.getContext('2d',{alpha:false});const w=canvas.width,h=canvas.height,vertical=h>w;const duration=story.duration_seconds||8;
 const scene=story.scenes.find(s=>t>=s.start && t<s.end)||story.scenes[story.scenes.length-1]||{start:0,end:duration,text:story.brief?.topic||'Fastify Motion Bro',title:'Motion'};
 const p=clamp((t-scene.start)/Math.max(.001,scene.end-scene.start),0,1),phase=t*1.3,i=story.scenes.indexOf(scene);
 c.clearRect(0,0,w,h);
 const grd=c.createLinearGradient(0,0,w,h);grd.addColorStop(0,i%2===0?'#0c1728':'#132337');grd.addColorStop(1,'#090d1d');c.fillStyle=grd;c.fillRect(0,0,w,h);
 // Time-dependent particles and vector geometry.
 for(let k=0;k<26;k++){let xx=(w*(k*.618%1)+Math.sin(phase+k)*15+w)%w;let yy=(h*(k*.381%1)+Math.cos(phase*.67+k)*20+h)%h;c.fillStyle='rgba(159,236,226,'+(.07+.08*(1+Math.sin(phase+k)))+')';c.beginPath();c.arc(xx,yy,1.2+(k%3),0,PI*2);c.fill();}
 c.save();c.translate(w*.5,h*.34);c.rotate(Math.sin(phase*.31)*.12);
 for(let k=0;k<6;k++){const angle=phase*.5+k*PI/3,dist=w*(.15+.055*Math.sin(phase+k));c.strokeStyle=k%2?'#89d6ce':'#d5f375';c.globalAlpha=.24+.25*Math.sin(phase*.7+k)**2;c.lineWidth=Math.max(2,w*.007);c.beginPath();c.arc(Math.cos(angle)*dist,Math.sin(angle)*dist,Math.max(8,w*(.04+.016*Math.sin(phase+k))),angle,angle+PI*1.5);c.stroke();}
 c.globalAlpha=1;const r=w*(.12+.025*Math.sin(phase*1.25));c.fillStyle='#c9f96d';c.beginPath();c.arc(0,0,r,0,PI*2);c.fill();c.fillStyle='#0a1724';c.beginPath();c.arc(0,0,r*.58,0,PI*2);c.fill();c.restore();
 // Animated hand-drawn infographic waves.
 for(let line=0;line<3;line++){c.beginPath();c.strokeStyle=['#d3f66a','#6ad8d1','#e995ff'][line];c.globalAlpha=.42;c.lineWidth=Math.max(2,w*.004);for(let x=0;x<=w;x+=4){const yy=h*(.55+.07*line)+Math.sin(x/w*PI*3+phase*2+line*1.9)*(10+12*p);if(x===0)c.moveTo(x,yy);else c.lineTo(x,yy);}c.stroke();}c.globalAlpha=1;
 const text=String(scene.text||story.brief?.topic||'FASTIFY MOTION BRO'),font=Math.round(w*(vertical?.074:.051)),lines=splitArabic(text,vertical?16:26);
 c.textAlign='center';c.textBaseline='middle';c.direction='rtl';c.fillStyle='#eef7ff';c.font='700 '+font+'px Tahoma, Arial, sans-serif';c.shadowColor='#0b1228';c.shadowBlur=w*.03;
 const y=h*.68;lines.forEach((s,k)=>{const a=clamp((p*4-k*.18),0,1);c.globalAlpha=a;c.fillText(s,w/2+(1-ease(a))*w*.4,y+k*font*1.25, w*.9);});c.globalAlpha=1;c.shadowBlur=0;
 c.fillStyle='#c9f96d';c.font='600 '+Math.round(w*.024)+'px Arial,sans-serif';c.direction='ltr';c.fillText('FASTIFY MOTION BRO / '+scene.id,w/2,h*.92);
 c.fillStyle='#293951';roundRect(c,w*.09,h*.96,w*.82,Math.max(3,h*.004),5);c.fill();c.fillStyle='#c9f96d';roundRect(c,w*.09,h*.96,w*.82*clamp(t/duration,0,1),Math.max(3,h*.004),5);c.fill();
 return {scene:scene.id,time:t};
}
