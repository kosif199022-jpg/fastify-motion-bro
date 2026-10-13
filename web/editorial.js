// Original seekable vector 2.5D editorial collage renderer.
// Every frame is a pure function of absolute time; there are exactly two drifting diagonal BACKGROUND lines.
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>1-(1-clamp(x))**3;
const mix=(a,b,t)=>a+(b-a)*t;
const PI=Math.PI;
const hexRgb=hex=>{const m=hex.replace('#','');return [parseInt(m.slice(0,2),16),parseInt(m.slice(2,4),16),parseInt(m.slice(4,6),16)];};
const rgba=(color,a)=>{const [r,g,b]=hexRgb(color);return 'rgba('+r+','+g+','+b+','+clamp(a)+')';};
function rect(c,x,y,w,h,r=0){c.beginPath();if(r)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);}
function ellipse(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,PI*2);}
function spring(t){const v=clamp(t);return Math.min(1.07,1-Math.exp(-7*v)*Math.cos(10*v));}
function icon(c,name,r,accent,ink){
 c.lineJoin='round';c.lineCap='round';c.strokeStyle=ink;c.fillStyle=accent;c.lineWidth=r*.08;
 const circle=(x,y,radius,fill)=>{ellipse(c,x,y,radius,radius);c.fillStyle=fill;c.fill();};
 switch(name){
 case 'eye':{c.beginPath();c.moveTo(-r,0);c.quadraticCurveTo(0,-r*.95,r,0);c.quadraticCurveTo(0,r*.95,-r,0);c.closePath();c.fillStyle='#F9F7F1';c.fill();c.stroke();circle(0,0,r*.45,accent);circle(0,0,r*.24,ink);circle(-r*.12,-r*.14,r*.07,'white');break;}
 case 'brain':{c.fillStyle=accent;for(const [x,y] of [[-.45,-.35],[0,-.55],[.45,-.35],[-.48,.14],[.04,.18],[.4,.18]])circle(r*x,r*y,r*.42,accent);c.beginPath();c.moveTo(0,-r*.85);c.lineTo(0,r*.61);c.stroke();break;}
 case 'wallet':{rect(c,-r*.85,-r*.54,r*1.7,r*1.12,r*.12);c.fillStyle=accent;c.fill();c.stroke();rect(c,r*.05,-r*.12,r*.95,r*.42,r*.08);c.fillStyle='#F9F2E5';c.fill();c.stroke();circle(r*.55,r*.1,r*.05,ink);break;}
 case 'money':{for(let i=0;i<3;i++){c.save();c.rotate((i-1)*.17);rect(c,-r*.83,-r*.5+i*r*.10,r*1.66,r*.88,r*.06);c.fillStyle=i%2?accent:'#FBF8F0';c.fill();c.stroke();c.restore();}circle(0,0,r*.23,ink);break;}
 case 'screen':{rect(c,-r,-r*.73,r*2,r*1.36,r*.1);c.fillStyle='#EEE9E5';c.fill();c.stroke();rect(c,-r*.84,-r*.53,r*1.68,r*.93,r*.04);c.fillStyle=accent;c.fill();c.stroke();c.beginPath();c.moveTo(0,r*.64);c.lineTo(0,r*.93);c.moveTo(-r*.4,r*.93);c.lineTo(r*.4,r*.93);c.stroke();break;}
 case 'hourglass':{c.beginPath();c.moveTo(-r*.63,-r*.85);c.lineTo(r*.63,-r*.85);c.quadraticCurveTo(r*.6,-r*.18,0,0);c.quadraticCurveTo(-r*.6,-r*.18,-r*.63,-r*.85);c.moveTo(-r*.63,r*.85);c.lineTo(r*.63,r*.85);c.quadraticCurveTo(r*.6,r*.18,0,0);c.quadraticCurveTo(-r*.6,r*.18,-r*.63,r*.85);c.closePath();c.fillStyle=accent;c.fill();c.stroke();break;}
 case 'lightbulb':{circle(0,-r*.22,r*.65,accent);rect(c,-r*.29,r*.31,r*.58,r*.43,r*.08);c.fillStyle=ink;c.fill();c.beginPath();c.moveTo(-r*.18,r*.85);c.lineTo(r*.18,r*.85);c.stroke();break;}
 case 'rocket':{c.beginPath();c.moveTo(0,-r);c.bezierCurveTo(r*.7,-r*.4,r*.55,r*.4,0,r*.7);c.bezierCurveTo(-r*.55,r*.4,-r*.7,-r*.4,0,-r);c.fillStyle=accent;c.fill();c.stroke();circle(0,-r*.12,r*.20,'#fff');c.beginPath();c.moveTo(-r*.3,r*.45);c.lineTo(-r*.7,r*.8);c.moveTo(r*.3,r*.45);c.lineTo(r*.7,r*.8);c.stroke();break;}
 case 'clock':{circle(0,0,r*.84,accent);c.beginPath();c.moveTo(0,-r*.51);c.lineTo(0,.02*r);c.lineTo(r*.43,r*.27);c.stroke();break;}
 case 'cursor':{c.beginPath();c.moveTo(-r*.67,-r*.9);c.lineTo(r*.62,r*.1);c.lineTo(r*.13,r*.24);c.lineTo(r*.4,r*.85);c.lineTo(r*.06,r);c.lineTo(-r*.24,r*.34);c.lineTo(-r*.67,r*.68);c.closePath();c.fillStyle=accent;c.fill();c.stroke();break;}
 case 'chart':{rect(c,-r*.88,-r*.84,r*1.76,r*1.64,r*.06);c.fillStyle='#faf8f4';c.fill();c.stroke();for(let i=0;i<4;i++){const barH=r*(.26+i*.35);rect(c,-r*.72+i*r*.41,r*.58-barH,r*.28,barH,r*.04);c.fillStyle=accent;c.fill();}break;}
 case 'stairs':{c.beginPath();c.moveTo(-r,-r*.1);c.lineTo(-r*.45,-r*.1);c.lineTo(-r*.45,-r*.45);c.lineTo(r*.1,-r*.45);c.lineTo(r*.1,-r*.8);c.lineTo(r*.8,-r*.8);c.lineTo(r*.8,r*.8);c.lineTo(-r,r*.8);c.closePath();c.fillStyle=accent;c.fill();c.stroke();break;}
 case 'domino':{for(let i=0;i<3;i++){c.save();c.translate((i-1)*r*.58,(1-i)*r*.13);c.rotate((i-1)*.25);rect(c,-r*.26,-r*.66,r*.52,r*1.32,r*.08);c.fillStyle=i===1?accent:'#FFF9EC';c.fill();c.stroke();circle(0,-r*.3,r*.07,ink);circle(0,r*.3,r*.07,ink);c.restore();}break;}
 case 'book':{for(const direction of [-1,1]){c.beginPath();c.moveTo(0,-r*.7);c.quadraticCurveTo(direction*r*.45,-r*.95,direction*r*.85,-r*.72);c.lineTo(direction*r*.85,r*.63);c.quadraticCurveTo(direction*r*.46,r*.44,0,r*.74);c.closePath();c.fillStyle=direction>0?accent:'#fefbf4';c.fill();c.stroke();}break;}
 case 'people':{for(let i=-1;i<=1;i++){circle(i*r*.58,-r*.25,r*.23,i===0?accent:'#fefcf7');rect(c,i*r*.58-r*.23,r*.10,r*.46,r*.62,r*.16);c.fillStyle=i===0?accent:'#fefcf7';c.fill();c.stroke();}break;}
 case 'chess':{circle(0,-r*.62,r*.25,accent);c.beginPath();c.moveTo(-r*.3,-r*.35);c.lineTo(r*.3,-r*.35);c.lineTo(r*.55,r*.63);c.lineTo(-r*.55,r*.63);c.closePath();c.fillStyle=accent;c.fill();c.stroke();rect(c,-r*.72,r*.67,r*1.44,r*.21,r*.04);c.fillStyle=ink;c.fill();break;}
 default:{circle(0,0,r*.65,accent);c.beginPath();for(let i=0;i<4;i++){c.moveTo(0,-r);c.lineTo(0,r);c.rotate(PI/4);}c.stroke();}
 }
}
export function drawEditorialFrame(canvas,story,time){
 const c=canvas.getContext('2d',{alpha:false}),w=canvas.width,h=canvas.height,scale=w/540;
 const sec=Math.max(0,Number(time)||0),scenes=story.scenes||[],scene=scenes.find(s=>sec>=s.start&&sec<s.end)||scenes.at(-1);
 if(!scene)return;
 const p=story.palette||{background:'#F4F1EC',grid:'#D7D4D0',accent:'#6134B9',text:'#24212A',line:'#D5CFD9',shape:'#E6DFF5'};
 const local=clamp(sec-scene.start,0,6),i=scenes.indexOf(scene),enter=local<=.5?0:spring((local-.5)/3),exit=local<=4.7?1:1-ease((local-4.7)/1.3);
 const heroAlpha=clamp(enter)*clamp(exit),move=1-enter,phase=sec*1.06;
 c.clearRect(0,0,w,h);c.fillStyle=p.background;c.fillRect(0,0,w,h);
 // Fine stationary modular grid, no diagonal motifs in the grid.
 c.lineWidth=Math.max(.5,scale*.7);c.strokeStyle=rgba(p.grid,.55);
 for(let x=w*.07;x<w;x+=w*.10){c.beginPath();for(let y=h*.05;y<h;y+=h*.051){c.moveTo(x,y);c.lineTo(x,y+scale*2);}c.stroke();}
 for(let y=h*.04;y<h;y+=h*.051){c.beginPath();for(let x=w*.06;x<w;x+=w*.10){c.moveTo(x,y);c.lineTo(x+scale*2,y);}c.stroke();}
 // Exactly two translucent drifting diagonal environmental lines behind everything.
 c.save();c.lineWidth=scale*1.6;c.strokeStyle=rgba(p.line,.50);
 for(let k=0;k<2;k++){const ox=Math.sin(phase*.20+k*2.3)*w*.035,oy=Math.cos(phase*.16+k)*h*.02;c.beginPath();c.moveTo(-w*.20+ox+k*w*.63,h*.93+oy);c.quadraticCurveTo(w*.30+ox+k*w*.41,h*.43+oy,w*.65+ox+k*w*.50,-h*.10+oy);c.stroke();}c.restore();
 // Large soft graphic block is part of environmental base, not an added hero.
 c.save();c.globalAlpha=.65;c.fillStyle=p.shape;c.beginPath();c.ellipse(w*.93,h*.14,w*.35,h*.13,PI/5,0,PI*2);c.fill();c.restore();
 // Editorial ghost typography moving opposite the main headline.
 c.save();c.textAlign='center';c.textBaseline='middle';c.globalAlpha=.075*heroAlpha;c.fillStyle=p.text;c.font='900 '+Math.round(w*.16)+'px Arial,sans-serif';c.translate(w*.5+Math.sin(phase*.22)*w*.035,h*.18);c.fillText(String(scene.headline||'MOTION'),0,0,w*.92);c.restore();
 // Physical shadow + 2.5D plane / hero, all time-seekable.
 const depth=1+Math.sin(phase*.77+i)*.023;const yoff=Math.sin(phase*.95+i)*h*.009;
 const hx=w*.50+(1-enter)*w*.32,hy=h*.405+(1-enter)*h*.49+yoff+(1-exit)*h*.13;
 c.save();c.globalAlpha=heroAlpha;c.translate(hx,hy);c.rotate(Math.sin(phase*.55+i)*.018+(1-enter)*.15);
 c.scale(depth,depth);
 c.fillStyle='rgba(0,0,0,.12)';c.beginPath();c.ellipse(16*scale,120*scale,w*.18,h*.036,0,0,PI*2);c.fill();
 c.shadowColor='rgba(0,0,0,.18)';c.shadowBlur=30*scale;c.shadowOffsetY=15*scale;
 rect(c,-w*.235,-w*.245,w*.47,w*.49,w*.06);c.fillStyle=p.shape;c.fill();
 c.shadowBlur=0;c.shadowOffsetY=0;
 // Halftone texture on one compositional cutout.
 c.save();c.beginPath();c.rect(-w*.235,-w*.245,w*.47,w*.49);c.clip();
 for(let yy=-w*.24;yy<w*.25;yy+=10*scale){for(let xx=-w*.23;xx<w*.25;xx+=10*scale){if(((Math.floor(xx/(10*scale))+Math.floor(yy/(10*scale)))%4)===0){c.fillStyle=rgba(p.text,.08);c.beginPath();c.arc(xx,yy,1.7*scale,0,PI*2);c.fill();}}}c.restore();
 c.save();c.translate(0,0);icon(c,scene.hero||'eye',w*.174,p.accent,p.text);c.restore();c.restore();
 // One primary vector accent: starburst. One secondary: orbital ring. Both foreground, not background lines.
 c.save();c.globalAlpha=heroAlpha;
 c.strokeStyle=p.accent;c.lineWidth=2.5*scale;c.beginPath();c.ellipse(w*.5,h*.405,w*.283,h*.157,Math.sin(phase*.1)*.12,0,PI*2);c.stroke();
 c.translate(w*.82,h*.273);c.rotate(phase*.21);
 for(let k=0;k<4;k++){c.beginPath();c.moveTo(0,-10*scale);c.lineTo(0,-24*scale);c.stroke();c.rotate(PI/2);}c.restore();
 // 1-4 word typography, masked and animated, mobile safe.
 const headline=String(scene.headline||scene.title||'MOTION').split(/\s+/).slice(0,4).join(' ');
 const alpha=clamp((local-.58)/.55)*exit;
 c.save();c.globalAlpha=clamp(alpha);c.direction=/[\u0600-\u06ff]/.test(headline)?'rtl':'ltr';c.textAlign='center';c.textBaseline='middle';
 c.fillStyle=p.text;c.font='900 '+Math.round(w*.114)+'px Arial,Tahoma,sans-serif';
 const y=h*.735+(1-ease(clamp((local-.58)/.65)))*h*.065;
 c.fillText(headline,w*.5,y,w*.84);
 c.fillStyle=p.accent;c.font='italic 600 '+Math.round(w*.048)+'px Georgia,Tahoma,serif';
 c.fillText('THE HIDDEN MECHANISM',w*.5,h*.810,w*.84);c.restore();
 c.fillStyle=p.text;c.globalAlpha=.42;c.font=Math.round(w*.021)+'px Arial';c.textAlign='center';
 c.fillText('FASTIFY MOTION BRO  /  '+String(i+1).padStart(2,'0'),w*.5,h*.91);
 c.globalAlpha=1;c.fillStyle=rgba(p.text,.12);rect(c,w*.10,h*.955,w*.80,Math.max(2,scale*3),1);c.fill();
 c.fillStyle=p.accent;rect(c,w*.10,h*.955,w*.80*clamp(sec/story.duration_seconds),Math.max(2,scale*3),1);c.fill();
 return {id:scene.id,local,backgroundLines:2,hero:scene.hero};
}
