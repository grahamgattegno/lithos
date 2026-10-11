/* Gem Copter — helicopter + gemstone turret vs gem zombies, bosses, upgrades, 10 maps */
(function(){
'use strict';
const GEM_COPTER_BUILD=79;
const GC_BULLET_LINES=5;

const gcSfx=(()=>{
 let ctx=null,gain=null,lastBoom=0,lastHit=0,lastGroan=0,lastPew=0,lastWhoosh=0,audioReady=false;
 function ac(){
  if(!ctx){
   try{
    ctx=new(window.AudioContext||window.webkitAudioContext)();
    gain=ctx.createGain();
    gain.gain.value=0.72;
    gain.connect(ctx.destination);
   }catch(_){}
  }
  return ctx;
 }
 function running(){return !!(ctx&&ctx.state==='running');}
 function env(g,t,att,dur,peak){
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002,peak),t+att);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 }
 function tone(type,freq,dur,vol,slideTo){
  const c=ac();if(!c||!gain)return;
  const t=c.currentTime,o=c.createOscillator(),g=c.createGain();
  o.type=type||'square';
  o.frequency.setValueAtTime(freq,t);
  if(slideTo)o.frequency.exponentialRampToValueAtTime(Math.max(24,slideTo),t+dur);
  env(g,t,0.008,dur,vol||0.07);
  o.connect(g);g.connect(gain);
  o.start(t);o.stop(t+dur+0.04);
 }
 function noise(dur,vol,hp,lp){
  const c=ac();if(!c||!gain)return;
  const t=c.currentTime,len=Math.max(1,Math.floor(c.sampleRate*dur));
  const buf=c.createBuffer(1,len,c.sampleRate),data=buf.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  const src=c.createBufferSource();src.buffer=buf;
  const g=c.createGain(),hpF=c.createBiquadFilter(),lpF=c.createBiquadFilter();
  hpF.type='highpass';hpF.frequency.value=hp||120;
  lpF.type='lowpass';lpF.frequency.value=lp||4200;
  env(g,t,0.004,dur,vol||0.06);
  src.connect(hpF);hpF.connect(lpF);lpF.connect(g);g.connect(gain);
  src.start(t);src.stop(t+dur+0.03);
 }
 return{
  unlock(){
   const c=ac();
   if(!c)return;
   const finish=()=>{
    audioReady=running();
    if(audioReady){
     try{if(typeof SFX!=='undefined'&&SFX.click)SFX.click();}catch(_){}
    }
   };
   if(c.state==='suspended'){
    try{
     const p=c.resume();
     if(p&&typeof p.then==='function')p.then(finish).catch(finish);
     else finish();
    }catch(_){finish();}
   }else finish();
  },
  ready(){return audioReady&&running();},
  boom(big){
   if(!running())return;
   const now=performance.now();
   if(now-lastBoom<(big?90:55))return;
   lastBoom=now;
   tone('sawtooth',big?72:95,big?0.35:0.22,big?0.16:0.11,big?28:42);
   noise(big?0.28:0.16,big?0.14:0.09,80,big?5200:3800);
   setTimeout(()=>tone('square',big?140:180,0.08,big?0.08:0.06),big?40:25);
  },
  hit(){
   if(!running())return;
   const now=performance.now();
   if(now-lastHit<45)return;
   lastHit=now;
   tone('square',420,0.05,0.06);
   noise(0.04,0.045,600,5000);
  },
  groan(){
   if(!running())return;
   const now=performance.now();
   if(now-lastGroan<380)return;
   lastGroan=now;
   tone('sawtooth',58,0.18,0.06,38);
   noise(0.12,0.05,90,900);
  },
  pew(){
   if(!running())return;
   const now=performance.now();
   if(now-lastPew<55)return;
   lastPew=now;
   tone('square',720,0.035,0.04);
   tone('triangle',980,0.025,0.025);
  },
  whoosh(){
   if(!running())return;
   const now=performance.now();
   if(now-lastWhoosh<120)return;
   lastWhoosh=now;
   tone('sine',220,0.08,0.05,440);
   noise(0.06,0.04,400,2800);
  }
 };
})();

function gcLithosCombatSfx(sc){
 try{
  if(typeof SFX==='undefined')return;
  if(sc>=0.7&&SFX.boom)SFX.boom();
  else if(SFX.debris)SFX.debris();
 }catch(_){}
}

function gcExplosionSfx(sc){
 if(!gcSfx.ready())return;
 if(sc>=1.15)gcSfx.boom(true);
 else gcSfx.boom(false);
 gcLithosCombatSfx(sc);
}

function gcDarken(hex,f){
 const n=parseInt(String(hex).replace('#',''),16);
 if(Number.isNaN(n))return hex;
 let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
 r=Math.max(0,Math.min(255,Math.round(r*f)));
 g=Math.max(0,Math.min(255,Math.round(g*f)));
 b=Math.max(0,Math.min(255,Math.round(b*f)));
 return `rgb(${r},${g},${b})`;
}

function gcUnlockAudio(){
 gcSfx.unlock();
 const tip=document.getElementById('gc-sound-tip');
 if(tip&&gcSfx.ready())tip.hidden=true;
}

const GC_HELIS=[
 {id:'scout',name:'Gem Scout',emoji:'🚁',desc:'Balanced · homing missile',speedMult:1,hpMult:1,dmgMult:1,hull:'#c9a94f',missileMode:'single'},
 {id:'swift',name:'Swift Sparrow',emoji:'🕊️',desc:'Fast · quick missiles',speedMult:1.38,hpMult:0.82,dmgMult:0.92,hull:'#7ec8ff',missileMode:'single',missileInterval:0.95},
 {id:'anvil',name:'Anvil Forge',emoji:'🛡️',desc:'Slow · heavy missiles',speedMult:0.78,hpMult:1.5,dmgMult:1.05,hull:'#9aa890',missileMode:'single',missileInterval:1.25},
 {id:'ruby',name:'Ruby Phantom',emoji:'💎',desc:'Strong shots · big missiles',speedMult:1.05,hpMult:0.95,dmgMult:1.3,hull:'#ff4060',missileMode:'single',missileMult:1.25},
 {id:'omega',name:'Omega Strike',emoji:'🚁',desc:'Owner · dual wing missiles',ownerOnly:true,missiles:true,missileMode:'dual',speedMult:1.12,hpMult:1.25,dmgMult:1.15,hull:'#4a5c72',trim:'#c9a94f'}
];

function gcHeliMissileMode(heli){
 if(!heli)return 'none';
 if(heli.missileMode==='dual'||heli.missiles)return 'dual';
 if(heli.missileMode==='single')return 'single';
 return 'single';
}
function gcHeliMissileInterval(s){
 const h=s.heli;
 const base=h?.missileInterval||(gcHeliMissileMode(h)==='dual'?(s.upgrades.missileInterval||0.85):1.15);
 return base*(gcHeliMissileMode(h)==='dual'?1.15:1.45);
}
function gcHeliMissileDamage(s){
 const h=s.heli;
 const mult=(s.upgrades?.missileMult||1)*(h?.missileMult||1);
 return ((gcHeliMissileMode(h)==='dual'?52:38)*mult+s.map.id*4)*0.65;
}
function gcLaneSpacing(u){
 return u.laneSpread||14;
}

let gcPickHeli='scout';

function gcIsOwner(){
 try{
  if(typeof isOwner!=='undefined'&&isOwner)return true;
  if(typeof window!=='undefined'&&window.isOwner)return true;
  if(typeof document!=='undefined'&&document.body&&document.body.classList.contains('is-owner'))return true;
  return localStorage.getItem('lithos_owner')==='1';
 }catch(_){return false;}
}

function gcApplyHeliToUpgrades(u,heli){
 if(!heli)return;
 u.maxHp=Math.max(50,Math.round(u.maxHp*heli.hpMult));
 u.speed=Math.max(120,Math.round(u.speed*heli.speedMult));
 u.damage=Math.max(6,Math.round(u.damage*heli.dmgMult));
}

let GC_W=960, GC_H=540;
function gcGroundY(){ return GC_H*0.82; }
function gcOnResize(){ gcResizeViewport(); }
function gcResizeViewport(){
 const cv=document.getElementById('gc-canvas');
 const wrap=document.getElementById('gemcopter');
 if(!cv||!wrap||!wrap.classList.contains('gc-play-mode'))return;
 GC_W=Math.max(720, window.innerWidth|0);
 GC_H=Math.max(480, window.innerHeight|0);
 cv.width=GC_W;
 cv.height=GC_H;
 if(gcState){
  gcState.x=Math.min(GC_W-30, Math.max(30, gcState.x));
  gcState.y=Math.min(GC_H-40, Math.max(50, gcState.y));
 }
 gcPointer.x=Math.min(GC_W, Math.max(0, gcPointer.x));
 gcPointer.y=Math.min(GC_H, Math.max(0, gcPointer.y));
}
function gcEnterPlayMode(){
 const wrap=document.getElementById('gemcopter');
 if(wrap)wrap.classList.add('gc-play-mode');
 gcResizeViewport();
}
function gcLeavePlayMode(){
 const wrap=document.getElementById('gemcopter');
 if(wrap)wrap.classList.remove('gc-play-mode');
}
const GC_MAPS=[
 {id:1,name:'Ruby Ridge',theme:'ridge',tag:'⛰️ ruby ridges',sky:['#1a0610','#3a1020'],ground:'#4a1828',accent:'#ff4060',boss:'Crimson Colossus',waves:4},
 {id:2,name:'Sapphire Coast',theme:'coast',tag:'🌊 ocean coast',sky:['#061018','#102838'],ground:'#183848',accent:'#4ea8ff',boss:'Tide Titan',waves:4},
 {id:3,name:'Emerald Jungle',theme:'jungle',tag:'🌿 deep jungle',sky:['#06140a','#14301a'],ground:'#1a4020',accent:'#3ecf8a',boss:'Vine Behemoth',waves:4},
 {id:4,name:'Amethyst Caves',theme:'caves',tag:'🕳️ crystal caves',sky:['#100818','#281040'],ground:'#2a1848',accent:'#b06af0',boss:'Crystal Queen',waves:5},
 {id:5,name:'Diamond Peak',theme:'peak',tag:'🏔️ icy peak',sky:['#0c1018','#1a2838'],ground:'#2a3848',accent:'#dbe4ec',boss:'Frost Giant',waves:5},
 {id:6,name:'Opal Oasis',theme:'oasis',tag:'🏝️ desert oasis',sky:['#101018','#302838'],ground:'#3a3040',accent:'#ff9ad4',boss:'Mirage Sovereign',waves:5},
 {id:7,name:'Topaz Desert',theme:'desert',tag:'🏜️ sand dunes',sky:['#181008','#382818'],ground:'#4a3820',accent:'#f0b429',boss:'Sand Tyrant',waves:5},
 {id:8,name:'Garnet Volcano',theme:'volcano',tag:'🌋 lava volcano',sky:['#180808','#401018'],ground:'#4a1818',accent:'#e04040',boss:'Magma Overlord',waves:6},
 {id:9,name:'Quartz Quarry',theme:'quarry',tag:'⛏️ quartz quarry',sky:['#101418','#283038'],ground:'#384048',accent:'#a8c0d0',boss:'Shard Emperor',waves:6},
 {id:10,name:'Rainbow Crater',theme:'rainbow',tag:'🌈 rainbow crater',sky:['#100818','#201030'],ground:'#281838',accent:'#c9a94f',boss:'Auric Apocalypse',waves:7}
];

function gcMapUnlockProgress(){
 if(gcIsOwner())return 10;
 return +(localStorage.getItem('lithos_gc_map')||'1');
}

function gcDrawMapTheme(ctx,s,m,gy){
 const W=GC_W,H=GC_H,t=s.rotor||0;
 const th=m.theme||'ridge';
 ctx.save();
 if(th==='ridge'){
  ctx.fillStyle=gcDarken(m.accent,0.35); ctx.globalAlpha=0.78;
  for(let i=0;i<8;i++){
   const bx=(i*200+(t*2))%(W+160)-80;
   ctx.beginPath(); ctx.moveTo(bx,gy); ctx.lineTo(bx+35,gy-90); ctx.lineTo(bx+75,gy-55);
   ctx.lineTo(bx+110,gy-110); ctx.lineTo(bx+150,gy); ctx.fill();
  }
 }else if(th==='coast'){
  const sea=gy+18;
  ctx.fillStyle='#0a2838'; ctx.globalAlpha=0.92;
  ctx.fillRect(0,sea,W,H-sea);
  ctx.strokeStyle=m.accent; ctx.globalAlpha=0.5; ctx.lineWidth=2;
  for(let x=0;x<W;x+=28){
   const y=sea+Math.sin(x*0.04+t*0.15)*6;
   ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+14,y+4); ctx.stroke();
  }
  ctx.fillStyle='rgba(120,200,255,0.15)'; ctx.fillRect(0,gy+8,W,22);
 }else if(th==='jungle'){
  ctx.fillStyle=gcDarken(m.accent,0.4); ctx.globalAlpha=0.65;
  for(let i=0;i<14;i++){
   const tx=(i*95+(t*1.5))%(W+60)-30;
   ctx.beginPath(); ctx.moveTo(tx,gy); ctx.lineTo(tx+8,gy-55); ctx.lineTo(tx+16,gy); ctx.fill();
  }
  ctx.strokeStyle='#2a6038'; ctx.lineWidth=2; ctx.globalAlpha=0.45;
  for(let i=0;i<6;i++){
   const vx=80+i*140;
   ctx.beginPath(); ctx.moveTo(vx,gy-20); ctx.quadraticCurveTo(vx+20,gy-50,vx+40,gy-15); ctx.stroke();
  }
 }else if(th==='caves'){
  ctx.fillStyle='#1a1028'; ctx.globalAlpha=0.9;
  ctx.fillRect(0,0,W,gy*0.45);
  ctx.fillStyle=m.accent; ctx.globalAlpha=0.35;
  for(let i=0;i<16;i++){
   const cx=(i*67)%W,st=12+(i%4)*6;
   ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx-st,gy*0.35); ctx.lineTo(cx+st,gy*0.35); ctx.fill();
  }
  ctx.globalAlpha=0.5;
  for(let i=0;i<10;i++){
   const px=(i*110+(t*3))%(W+40);
   ctx.fillRect(px,gy-8,6,14);
  }
 }else if(th==='peak'){
  ctx.fillStyle='rgba(230,240,255,0.25)'; ctx.globalAlpha=1;
  for(let i=0;i<7;i++){
   const bx=(i*170+(t*1.2))%(W+120)-60;
   ctx.beginPath(); ctx.moveTo(bx,gy); ctx.lineTo(bx+50,gy-120); ctx.lineTo(bx+100,gy); ctx.fill();
   ctx.fillStyle='rgba(255,255,255,0.35)';
   ctx.beginPath(); ctx.moveTo(bx+35,gy-75); ctx.lineTo(bx+50,gy-120); ctx.lineTo(bx+65,gy-75); ctx.fill();
   ctx.fillStyle='rgba(230,240,255,0.25)';
  }
 }else if(th==='oasis'){
  ctx.fillStyle='#1a3848'; ctx.globalAlpha=0.7;
  ctx.beginPath(); ctx.ellipse(W*0.72,gy+18,70,14,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#2a5030'; ctx.globalAlpha=0.8;
  [[0.25,0.7],[0.82,0.65]].forEach(([fx,fy])=>{
   const px=W*fx,py=gy-10;
   ctx.fillRect(px-3,py,6,28);
   ctx.beginPath(); ctx.arc(px-12,py+8,12,0,Math.PI*2); ctx.arc(px+12,py+6,10,0,Math.PI*2); ctx.fill();
  });
 }else if(th==='desert'){
  ctx.fillStyle=gcDarken(m.ground,0.85); ctx.globalAlpha=0.45;
  for(let i=0;i<9;i++){
   const dx=(i*130+(t*2.5))%(W+100)-50;
   ctx.beginPath(); ctx.moveTo(dx,gy); ctx.quadraticCurveTo(dx+60,gy-35,dx+120,gy); ctx.fill();
  }
  ctx.fillStyle='#3a5020'; ctx.globalAlpha=0.7;
  [0.2,0.55,0.88].forEach(f=>{
   const cx=W*f; ctx.fillRect(cx,gy-22,4,22); ctx.beginPath(); ctx.arc(cx+2,gy-26,5,0,Math.PI*2); ctx.fill();
  });
 }else if(th==='volcano'){
  ctx.fillStyle=gcDarken(m.accent,0.3); ctx.globalAlpha=0.6;
  ctx.beginPath(); ctx.moveTo(W*0.38,gy); ctx.lineTo(W*0.5,gy-130); ctx.lineTo(W*0.62,gy); ctx.fill();
  ctx.fillStyle='#ff6040'; ctx.globalAlpha=0.55+Math.sin(t*0.2)*0.2;
  ctx.beginPath(); ctx.arc(W*0.5,gy-125,10,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(80,40,30,0.35)'; ctx.globalAlpha=0.5;
  for(let i=0;i<5;i++){
   const sx=W*0.5+(i-2)*18, sy=gy-130-Math.sin(t*0.3+i)*20;
   ctx.beginPath(); ctx.arc(sx,sy,8+i*2,0,Math.PI*2); ctx.fill();
  }
 }else if(th==='quarry'){
  ctx.strokeStyle=m.accent; ctx.globalAlpha=0.45; ctx.lineWidth=2;
  for(let i=0;i<12;i++){
   const px=(i*88+(t*2))%(W+50), h=20+(i%5)*12;
   ctx.strokeRect(px,gy-h,14,h);
   ctx.beginPath(); ctx.moveTo(px+7,gy-h-10); ctx.lineTo(px+7,gy-h); ctx.stroke();
  }
  ctx.fillStyle='rgba(200,220,235,0.25)';
  for(let i=0;i<8;i++)ctx.fillRect((i*120+30)%W,gy-6,10,6);
 }else if(th==='rainbow'){
  const cx=W*0.5,cy=gy-100;
  const colors=['#ff4060','#f0b429','#3ecf8a','#4ea8ff','#b06af0'];
  colors.forEach((col,i)=>{
   ctx.strokeStyle=col; ctx.globalAlpha=0.35; ctx.lineWidth=5;
   ctx.beginPath(); ctx.arc(cx,cy+40,120+i*14,Math.PI*1.05,Math.PI*1.95); ctx.stroke();
  });
  ctx.strokeStyle=m.accent; ctx.globalAlpha=0.4; ctx.lineWidth=3;
  ctx.beginPath(); ctx.arc(W*0.5,gy+30,W*0.35,Math.PI,0); ctx.stroke();
 }
 ctx.restore();
}

const GC_UPGRADES=[
 {id:'firerate',name:'Rapid Crystal',desc:'Shoot faster',max:5,cost:40,fn:u=>{u.cooldown=Math.max(0.05,0.12-u.levels.firerate*0.014);}},
 {id:'damage',name:'Harder Gems',desc:'More bullet damage',max:5,cost:45,fn:u=>{u.damage=10+u.levels.damage*6;}},
 {id:'spread',name:'Wide Volley',desc:'Widen the 5 bullet lines',max:3,cost:70,fn:u=>{u.laneSpread=14+u.levels.spread*7;}},
 {id:'armor',name:'Jade Hull',desc:'More helicopter HP',max:5,cost:50,fn:u=>{u.maxHp=100+u.levels.armor*25;}},
 {id:'speed',name:'Spinel Thrusters',desc:'Fly faster',max:4,cost:40,fn:u=>{u.speed=220+u.levels.speed*35;}},
 {id:'magnet',name:'Lode Magnet',desc:'Pick up gems from farther',max:3,cost:35,fn:u=>{u.magnet=40+u.levels.magnet*30;}}
];

const GC_OWNER_UPGRADES=[
 {id:'auric',name:'Auric Overdrive',ownerOnly:true,desc:'Fastest rapid fire in Lithos',max:4,cost:45,fn:u=>{u.cooldown=Math.max(0.025,0.12-(u.levels.firerate||0)*0.014-(u.levels.auric||0)*0.026);}},
 {id:'devastator',name:'Devastator Core',ownerOnly:true,desc:'Huge gem bullet damage',max:4,cost:50,fn:u=>{u.damage=10+(u.levels.damage||0)*6+(u.levels.devastator||0)*18;}},
 {id:'titan',name:'Titan Plating',ownerOnly:true,desc:'+100 hull per level',max:5,cost:55,fn:u=>{u.maxHp=100+(u.levels.armor||0)*25+(u.levels.titan||0)*100;}},
 {id:'warpath',name:'Warpath Command',ownerOnly:true,desc:'Ground squad shoots harder',max:3,cost:40,fn:u=>{u.militaryMult=1+(u.levels.warpath||0)*0.5;}},
 {id:'stragem',name:'Stragem Missiles',ownerOnly:true,desc:'Missile power & faster salvo',max:4,cost:55,fn:u=>{u.missileMult=1+(u.levels.stragem||0)*0.6;u.missileInterval=Math.max(0.32,0.85-(u.levels.stragem||0)*0.13);}},
 {id:'prism',name:'Prism Crown',ownerOnly:true,desc:'Extra-wide 5-line volley',max:2,cost:70,fn:u=>{u.laneSpread=14+(u.levels.spread||0)*7+(u.levels.prism||0)*10;}}
];

let gcRaf=null, gcKeys={}, gcPointer={x:GC_W/2,y:GC_H/2,down:false}, gcState=null;

function gcDefaultUpgrades(){
 return {
  levels:{firerate:0,damage:0,spread:0,armor:0,speed:0,magnet:0,auric:0,devastator:0,titan:0,warpath:0,stragem:0,prism:0},
  cooldown:0.22,damage:7,spread:0,laneSpread:14,maxHp:100,speed:220,magnet:40,
  militaryMult:1,missileMult:1,missileInterval:0.85
 };
}
function gcMaxAllUpgrades(u){
 GC_UPGRADES.forEach(up=>{ u.levels[up.id]=up.max; });
 GC_OWNER_UPGRADES.forEach(up=>{ u.levels[up.id]=up.max; });
}

function gcApplyUpgrades(u){
 GC_UPGRADES.forEach(up=>up.fn(u));
 if(gcIsOwner()) GC_OWNER_UPGRADES.forEach(up=>up.fn(u));
}

function gcPrepareUpgrades(u){
 if(gcIsOwner()) gcMaxAllUpgrades(u);
 gcApplyUpgrades(u);
}
function gcShopUpgrades(){
 return GC_UPGRADES.concat(GC_OWNER_UPGRADES);
}

function gcClose(){
 if(gcRaf){cancelAnimationFrame(gcRaf);gcRaf=null;}
 window.removeEventListener('keydown',gcKeyDown);
 window.removeEventListener('keyup',gcKeyUp);
 window.removeEventListener('resize',gcOnResize);
 gcLeavePlayMode();
 const w=document.getElementById('gemcopter');
 if(w)w.remove();
 gcState=null;
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 try{if(typeof lithos8bitSync==='function')lithos8bitSync();}catch(_){}
}

function gcGravastarChord(e){
 return !!(e.shiftKey&&e.ctrlKey&&(e.metaKey||e.altKey));
}

function gcKeyDown(e){
 if(!gcState)return;
 const k=e.key.toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d','e','escape'].includes(k)||e.code==='Space'){
  e.preventDefault();
 }
 gcUnlockAudio();
 if(k==='escape'){gcClose();return;}
 if(gcGravastarChord(e)&&gcState.map.id===10&&gcState.boss&&!gcState.cutscene&&!gcState.over){
  e.preventDefault();
  gcStartGravastarCutscene();
  return;
 }
 gcKeys[k]=true;
 if(e.code==='Space')gcKeys.space=true;
}
function gcKeyUp(e){
 const k=e.key.toLowerCase();
 gcKeys[k]=false;
 if(e.code==='Space')gcKeys.space=false;
}

function playGemCopter(){
 if(window.GEM_COPTER_BUILD!==GEM_COPTER_BUILD){
  try{
   const u=new URL(location.href);
   u.searchParams.set('_gc',String(GEM_COPTER_BUILD));
   u.searchParams.set('_',String(Date.now()));
   location.replace(u.pathname+u.search+(location.hash||'#gemcopter'));
  }catch(_){ location.reload(); }
  return;
 }
 try{if(typeof lithosCloseGameOverlays==='function')lithosCloseGameOverlays();}catch(_){}
 gcClose();
 const wrap=document.createElement('div');
 wrap.id='gemcopter';
 wrap.innerHTML=`
  <div class="gc-box">
   <div class="gc-top">
    <div>
     <div class="gc-title">GEM COPTER</div>
     <div class="gc-sub" style="color:#7dffd4;font-size:11px;margin-top:2px">Current game · build ${GEM_COPTER_BUILD}</div>
     <div class="gc-sub" id="gc-mapname">Pick a mission map</div>
    </div>
    <button type="button" class="gc-btn ghost" id="gc-leave">Leave</button>
   </div>
   <div id="gc-menu" class="gc-menu">
    <p class="gc-lede">Fly your gem-chopper vs <b>hostile helicopter drones</b> — your <b>tech squad</b> on the ground backs you up!</p>
    <div class="gc-heli-grid" id="gc-heli-grid"></div>
    <div class="gc-map-grid" id="gc-map-grid"></div>
    <p class="gc-version-banner" id="gc-version-banner">Build ${GEM_COPTER_BUILD} — pick a helicopter, then a map ↓</p>
    <p class="gc-hint">WASD fly · aim · Space fires <b>5 straight bullet lines</b> · missiles auto · <b>E</b> salvo · Esc quit</p>
   </div>
   <div id="gc-play" hidden>
    <div class="gc-play-frame">
    <canvas id="gc-canvas" width="${GC_W}" height="${GC_H}"></canvas>
    <p class="gc-sound-tip" id="gc-sound-tip">🔊 Tap <b>Fire</b> or press <b>Space</b> once to turn on battle sounds</p>
    <div class="gc-hud gc-hud-float">
     <span id="gc-hp">HP 100</span>
     <span id="gc-gems">💎 0</span>
     <span id="gc-wave">Wave 1</span>
     <span id="gc-kills">Kills 0</span>
     <span id="gc-army">Squad 4</span>
    </div>
    <div class="gc-touch gc-touch-float">
     <button type="button" id="gc-fire">🔥 Fire</button>
    </div>
    </div>
   </div>
   <div id="gc-shop" class="gc-shop" hidden></div>
   <div id="gc-overlay" class="gc-overlay" hidden></div>
  </div>`;
 document.body.appendChild(wrap);
 if(!document.getElementById('gc-heli-grid')){
  try{
   const u=new URL(location.href);
   u.searchParams.set('_gc',String(GEM_COPTER_BUILD));
   u.searchParams.set('_',String(Date.now()));
   location.replace(u.pathname+u.search+(location.hash||'#gemcopter'));
  }catch(_){ location.reload(); }
  return;
 }
 document.getElementById('gc-leave').onclick=()=>gcClose();
 const heliGrid=document.getElementById('gc-heli-grid');
 const ownerOn=gcIsOwner();
 const ownerNote=document.createElement('p');
 ownerNote.className='gc-owner-shop-tag';
 ownerNote.textContent=ownerOn?'👑 Owner mode ON — ALL upgrades MAXED every mission + Omega Strike + missiles!':'🔒 Owner? Enter your code in Games → Secret Codes to unlock 👑 upgrades + Omega Strike.';
 heliGrid.parentElement.insertBefore(ownerNote,heliGrid);
 heliGrid.innerHTML=GC_HELIS.map(h=>{
  const locked=!!(h.ownerOnly&&!gcIsOwner());
  const on=h.id===gcPickHeli;
  return `<button type="button" class="gc-heli${on?' on':''}${h.ownerOnly?' owner':''}${locked?' locked':''}" data-heli="${h.id}" ${locked?'disabled':''}>
   <div class="gc-heli-emoji">${h.emoji}</div>
   <b>${h.name}${h.ownerOnly?' · OWNER':''}</b>
   <span>${locked?'Unlock owner code':h.desc}</span>
  </button>`;
 }).join('');
 heliGrid.onclick=e=>{
  gcUnlockAudio();
  const b=e.target.closest('[data-heli]');
  if(!b||b.disabled)return;
  gcPickHeli=b.dataset.heli;
  heliGrid.querySelectorAll('.gc-heli').forEach(el=>el.classList.toggle('on',el.dataset.heli===gcPickHeli));
 };
 const grid=document.getElementById('gc-map-grid');
 const progress=gcMapUnlockProgress();
 if(ownerOn){
  const mapNote=document.createElement('p');
  mapNote.className='gc-owner-shop-tag';
  mapNote.textContent='👑 Owner — all 10 maps unlocked · pick any biome';
  grid.parentElement.insertBefore(mapNote,grid);
 }
 grid.innerHTML=GC_MAPS.map(m=>{
  const locked=!ownerOn&&m.id>progress;
  return `<button type="button" class="gc-map${locked?' locked':''}" data-map="${m.id}" ${locked?'disabled':''}>
   <b>${m.id}. ${m.name}</b>
   <span>${locked?'🔒 Clear previous map':((m.tag||'')+' · Boss: '+m.boss)}</span>
  </button>`;
 }).join('');
 grid.onclick=e=>{
  gcUnlockAudio();
  const b=e.target.closest('[data-map]');
  if(!b||b.disabled)return;
  gcStartMap(+b.dataset.map,null,gcPickHeli);
 };
 window.addEventListener('keydown',gcKeyDown);
 window.addEventListener('keyup',gcKeyUp);
 window.addEventListener('resize',gcOnResize);
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 try{if(typeof lithos8bitSync==='function')lithos8bitSync();}catch(_){}
}

function gcStartMap(mapId, carry, heliId){
 const progress=gcMapUnlockProgress();
 if(!gcIsOwner()&&mapId>progress){
  mapId=Math.min(10,Math.max(1,progress));
 }
 const map=GC_MAPS.find(m=>m.id===mapId)||GC_MAPS[0];
 let heli=GC_HELIS.find(h=>h.id===(carry?.heliId||heliId||gcPickHeli))||GC_HELIS[0];
 if(heli.ownerOnly&&!gcIsOwner())heli=GC_HELIS[0];
 if(gcIsOwner()){
  const omega=GC_HELIS.find(h=>h.id==='omega');
  if(omega)heli=omega;
 }
 const upgrades=carry&&carry.upgrades?JSON.parse(JSON.stringify(carry.upgrades)):gcDefaultUpgrades();
 gcPrepareUpgrades(upgrades);
 gcApplyHeliToUpgrades(upgrades,heli);
 let gems=carry&&typeof carry.gems==='number'?carry.gems:0;
 if(gcIsOwner()&&!carry)gems+=120;
 document.getElementById('gc-menu').hidden=true;
 document.getElementById('gc-shop').hidden=true;
 document.getElementById('gc-overlay').hidden=true;
 document.getElementById('gc-play').hidden=false;
 gcEnterPlayMode();
 const sndTip=document.getElementById('gc-sound-tip');
 if(sndTip)sndTip.hidden=gcSfx.ready();
 document.getElementById('gc-mapname').textContent=`${heli.emoji} ${heli.name} · Map ${map.id}: ${map.name}`;
 gcState={
  map, upgrades, gems, heli,
  x:GC_W*0.5, y:GC_H*0.38, vx:0, vy:0,
  hp:upgrades.maxHp, maxHp:upgrades.maxHp,
  fireT:0, missileT:0, wave:1, waveT:0, spawnLeft:0, spawnGap:0,
  kills:0, boss:null, bossSpawned:false, cleared:false, over:false,
  zombies:[], bullets:[], missiles:[], particles:[], pickups:[],
  military:[],
  rotor:0, shake:0, shopPause:false, waveShopPending:false
 };
 gcInitMilitary(gcState);
 gcBindCanvas();
 gcStartLoop();
}

function gcStartLoop(){
 if(gcRaf)cancelAnimationFrame(gcRaf);
 let last=performance.now();
 function loop(t){
  if(!gcState||gcState.shopPause)return;
  if(gcState.over&&!gcState.cutscene)return;
  const dt=Math.min(0.05,(t-last)/1000); last=t;
  gcUpdate(dt);
  gcDraw();
  gcRaf=requestAnimationFrame(loop);
 }
 gcRaf=requestAnimationFrame(loop);
}

function gcBindCanvas(){
 const cv=document.getElementById('gc-canvas');
 if(!cv)return;
 const toLocal=e=>{
  const r=cv.getBoundingClientRect();
  gcPointer.x=(e.clientX-r.left)*(GC_W/r.width);
  gcPointer.y=(e.clientY-r.top)*(GC_H/r.height);
 };
 cv.onpointermove=toLocal;
 cv.onpointerdown=e=>{gcUnlockAudio();toLocal(e);gcPointer.down=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}};
 cv.onpointerup=()=>{gcPointer.down=false;};
 cv.onpointerleave=()=>{gcPointer.down=false;};
 const fire=document.getElementById('gc-fire');
 if(fire){
  fire.onpointerdown=e=>{e.preventDefault();gcUnlockAudio();gcPointer.down=true;};
  fire.onpointerup=()=>{gcPointer.down=false;};
 }
}

function gcZombieMaxHp(elite,map,wave){
 let hp=(elite?340:135)+map.id*42+wave*24;
 if(gcIsOwner())hp=Math.round(hp*2.8);
 return hp;
}

function gcInitMilitary(s){
 const gy=gcGroundY();
 const pad=GC_W*0.07;
 const patrol=[pad,GC_W-pad];
 const mk=(kind,f,extra)=>({
  kind,x:GC_W*f,y:gy,gy,
  fireT:0.1+Math.random()*0.15,t:Math.random()*6,face:1,aim:0,spin:0,
  patrol,moveTarget:null,strafeDir:Math.random()<0.5?-1:1,sfxT:0,
  ...extra
 });
 const mapBonus=Math.round(s.map.id*0.35);
 s.military=[
  mk('soldier',0.2,{hp:85,r:13,dmg:1.1+mapBonus*0.15,range:310,vx:54,fireRate:0.065}),
  mk('soldier',0.35,{hp:85,r:13,dmg:1.1+mapBonus*0.15,range:310,vx:54,fireRate:0.065}),
  mk('tank',0.55,{hp:220,r:26,dmg:2.8+mapBonus*0.2,range:380,vx:34,fireRate:0.09}),
  mk('jeep',0.72,{hp:105,r:19,dmg:1.6+mapBonus*0.15,range:330,vx:82,fireRate:0.075}),
  mk('jeep',0.88,{hp:105,r:19,dmg:1.6+mapBonus*0.15,range:330,vx:82,fireRate:0.075}),
 ];
}

function gcMilitaryPickTarget(s,unit){
 let best=null,bd=1e12;
 const r2=unit.range*unit.range;
 s.zombies.forEach(z=>{
  const d=(z.x-unit.x)**2+(z.y-unit.y)**2;
  if(d<bd&&d<r2){bd=d;best=z;}
 });
 if(!best&&s.boss){
  const d=(s.boss.x-unit.x)**2+(s.boss.y-unit.y)**2;
  if(d<r2)best=s.boss;
 }
 return best;
}

function gcMilitaryMove(unit,dt,s){
 const gy=unit.gy!=null?unit.gy:gcGroundY();
 const [pLo,pHi]=unit.patrol||[40,GC_W-40];
 const spd=unit.vx||48;
 let best=gcMilitaryPickTarget(s,unit);
 if(best){
  const dx=best.x-unit.x;
  const hold=unit.range*(unit.kind==='tank'?0.55:unit.kind==='jeep'?0.62:0.5);
  if(Math.abs(dx)>hold){
   unit.x+=Math.sign(dx)*spd*dt*(unit.kind==='soldier'?1:0.9);
  }else{
   unit.strafeT=(unit.strafeT||0)-dt;
   if(unit.strafeT<=0){
    unit.strafeDir=Math.random()<0.5?-1:1;
    unit.strafeT=0.4+Math.random()*0.8;
   }
   const str=unit.kind==='soldier'?36:unit.kind==='jeep'?48:22;
   unit.x+=unit.strafeDir*str*dt;
  }
 }else{
  if(unit.moveTarget==null||Math.abs(unit.x-unit.moveTarget)<10){
   unit.moveTarget=pLo+Math.random()*(pHi-pLo);
  }
  const dx=unit.moveTarget-unit.x;
  if(Math.abs(dx)>6)unit.x+=Math.sign(dx)*spd*dt;
  else unit.moveTarget=null;
 }
 unit.x=Math.max(pLo,Math.min(pHi,unit.x));
 unit.y=gy-(unit.kind==='tank'?5:unit.kind==='jeep'?7:0);
 unit.face=best?(best.x>=unit.x?1:-1):(unit.moveTarget!=null&&unit.moveTarget<unit.x?-1:1);
}

function gcMilitaryMinigunFire(s,unit,best){
 const mult=s.upgrades.militaryMult||1;
 const aimY=best.y-(unit.kind==='tank'?10:unit.kind==='jeep'?14:12);
 const base=Math.atan2(aimY-unit.y,best.x-unit.x);
 const shots=unit.kind==='soldier'?3:2;
 for(let i=0;i<shots;i++){
  const spread=(Math.random()-0.5)*(unit.kind==='tank'?0.05:0.11);
  const ang=base+spread;
  const muzzle=unit.kind==='tank'?26:unit.kind==='jeep'?22:18;
  s.bullets.push({
   x:unit.x+Math.cos(ang)*muzzle*0.35,
   y:unit.y-10+Math.sin(ang)*muzzle*0.35,
   vx:Math.cos(ang)*480,vy:Math.sin(ang)*480,
   life:0.85,dmg:unit.dmg*mult,r:2,ally:true,minigun:true
  });
 }
 unit.spin+=0.35;
 unit.sfxT=(unit.sfxT||0)-1;
 if(unit.sfxT<=0){unit.sfxT=2;gcSfx.pew();}
}

function gcSpawnZombie(elite){
 const s=gcState;
 const gy=gcGroundY();
 const fromLeft=Math.random()<0.5;
 const x=fromLeft?-110:GC_W+110;
 const hp=gcZombieMaxHp(!!elite,s.map,s.wave);
 s.zombies.push({
  x,y:gy,gy,hp,maxHp:hp,elite:!!elite,
  speed:(elite?48:58)+Math.random()*18+s.map.id*1.5,
  r:elite?22:16, hurt:0, t:Math.random()*6, face:1, hitCD:0, missCD:0
 });
}

function gcSpawnBoss(){
 const s=gcState, m=s.map;
 const gy=gcGroundY();
 const hp=m.id===10?12000:420+m.id*160;
 s.boss={
  name:m.boss, x:GC_W/2, y:gy, gy,
  hp, maxHp:hp,
  r:40+m.id*1.35, t:0, phase:0, shootT:2, hurt:0,
  gravastarCore:m.id===10
 };
 s.bossSpawned=true;
}

function gcBossTakeDamage(s,dmg){
 if(!s.boss)return;
 if(s.cutscene)return;
 if(s.boss.gravastarCore){
  const floor=s.boss.maxHp*0.78;
  s.boss.hp=Math.max(floor,s.boss.hp-dmg*0.04);
  s.boss.hurt=0.12;
  return;
 }
 s.boss.hp-=dmg;
 s.boss.hurt=0.12;
}

function gcOnBossDefeated(){
 const s=gcState; if(!s||s.cleared)return;
 s.gems+=80+s.map.id*15;
 if(s.boss){
  gcBoom(s.boss.x,s.boss.y,s.map.accent,2.2);
  for(let i=0;i<4;i++)gcBoom(s.boss.x+(Math.random()-0.5)*80,s.boss.y+(Math.random()-0.5)*40,s.map.accent,1.2);
  s.boss=null;
 }
 s.cutscene=null;
 s.cleared=true;
 s.over=true;
 const unlocked=Math.max(+(localStorage.getItem('lithos_gc_map')||'1'), s.map.id+1);
 localStorage.setItem('lithos_gc_map', String(Math.min(10,unlocked)));
 setTimeout(()=>gcShowVictory(),200);
}

function gcStartGravastarCutscene(){
 const s=gcState; if(!s||!s.boss)return;
 const base=window.GcGravastarScene?GcGravastarScene.create({
  bossName:s.boss.name,bossAccent:s.map.accent,map:s.map
 }):{t:0,bossName:s.boss.name,bossAccent:s.map.accent,planetIdx:0,planetT:0,map:s.map};
 s.cutscene=Object.assign(base,{type:'gravastar',finishQueued:false});
 s.bullets=[]; s.missiles=[]; s.zombies=[];
 s.shake=0;
 gcBoom(s.x,s.y,'#7dffd4',1.4);
 try{if(typeof SFX!=='undefined'&&SFX.boom)SFX.boom();}catch(_){}
}

function gcUpdateGravastar(dt){
 const s=gcState,c=s.cutscene; if(!c||c.type!=='gravastar')return;
 if(window.GcGravastarScene){
  const prevPlanet=c.planetIdx||0;
  GcGravastarScene.update(c,dt,GC_W,GC_H);
  if((c.planetIdx||0)>prevPlanet&&prevPlanet<GcGravastarScene.PLANETS.length){
   const p=GcGravastarScene.PLANETS[prevPlanet];
   gcBoom(GC_W/2,GC_H*0.52,p.color,1.75);
   gcBoom(GC_W/2,GC_H*0.52,'#fff',1.15);
   try{if(typeof SFX!=='undefined'&&SFX.boom)SFX.boom();}catch(_){}
  }
 }else c.t+=dt;
 s.shake=c.shake!=null?c.shake:Math.min(6,c.t*0.15);
 if(window.GcGravastarScene&&GcGravastarScene.isDone(c)&&!c.finishQueued){
  c.finishQueued=true;
  gcBoom(GC_W/2,GC_H*0.55,'#fff',3);
  gcBoom(GC_W/2,GC_H*0.55,s.map.accent,2.5);
  for(let i=0;i<8;i++)gcBoom(GC_W/2+(Math.random()-0.5)*120,GC_H*0.5+(Math.random()-0.5)*80,'#fff',1.5);
  setTimeout(()=>{
   if(s.boss)s.boss.hp=0;
   gcOnBossDefeated();
  },400);
 }
}

function gcDrawGravastar(ctx,c,s){
 if(window.GcGravastarScene){
  GcGravastarScene.draw(ctx,c,GC_W,GC_H);
  return;
 }
 ctx.fillStyle='#020208'; ctx.fillRect(0,0,GC_W,GC_H);
}

function gcStartWave(){
 const s=gcState;
 s.spawnLeft=22+s.wave*8+s.map.id*5;
 s.spawnGap=0.22;
 s.waveT=0;
 if(s.wave===s.map.waves) gcSpawnBoss();
}

function gcPickTarget(s){
 let best=null,bd=1e12;
 const tryT=(t,x,y,r)=>{
  const d=(x-s.x)**2+(y-s.y)**2;
  if(d<bd){bd=d;best={x,y,r:(r||14)};}
 };
 s.zombies.forEach(z=>tryT(z,z.x,z.y,z.r));
 if(s.boss)tryT(s.boss,s.boss.x,s.boss.y,s.boss.r);
 return best;
}

function gcLaunchMissile(s,x0,y0,target){
 if(!target)return;
 const ang=Math.atan2(target.y-y0,target.x-x0);
 s.missiles.push({
  x:x0,y:y0,vx:Math.cos(ang)*200,vy:Math.sin(ang)*200,
  life:2.8,dmg:gcHeliMissileDamage(s),r:7,homing:true
 });
}

function gcFireMissilesFromState(manual){
 const s=gcState;
 const mode=gcHeliMissileMode(s.heli);
 if(mode==='none')return;
 if(!manual&&s.missileT>0)return;
 const t=gcPickTarget(s);
 if(!t)return;
 s.missileT=manual?0.28:gcHeliMissileInterval(s);
 if(mode==='dual'){
  gcLaunchMissile(s,s.x-16,s.y-4,t);
  gcLaunchMissile(s,s.x+16,s.y-4,t);
 }else{
  gcLaunchMissile(s,s.x,s.y-6,t);
 }
 gcSfx.whoosh();
 try{if(typeof SFX!=='undefined'&&SFX.debris)SFX.debris();}catch(_){}
}

function gcFire(){
 const s=gcState, u=s.upgrades;
 if(s.fireT>0)return;
 s.fireT=u.cooldown;
 const ang=Math.atan2(gcPointer.y-s.y, gcPointer.x-s.x);
 const perp=ang+Math.PI/2;
 const spacing=gcLaneSpacing(u);
 const mid=(GC_BULLET_LINES-1)/2;
 const bulletDmg=Math.max(2,Math.round(u.damage*0.2));
 for(let i=0;i<GC_BULLET_LINES;i++){
  const off=(i-mid)*spacing;
  const ox=Math.cos(perp)*off, oy=Math.sin(perp)*off;
  s.bullets.push({
   x:s.x+ox, y:s.y-8+oy,
   vx:Math.cos(ang)*540, vy:Math.sin(ang)*540,
   life:1.45, dmg:bulletDmg, r:3, line:true, ang
  });
 }
 gcSfx.pew();
}

function gcUpdate(dt){
 const s=gcState; if(!s||s.over||s.shopPause)return;
 if(s.cutscene?.type==='gravastar'){
  gcUpdateGravastar(dt);
  gcHud();
  return;
 }
 s.rotor+=dt*28;
 if(s.shake>0)s.shake=Math.max(0,s.shake-dt*8);
 s.fireT=Math.max(0,s.fireT-dt);
 s.missileT=Math.max(0,s.missileT-dt);
 if(gcHeliMissileMode(s.heli)!=='none'&&s.missileT<=0)gcFireMissilesFromState(false);
 if(gcKeys.e){gcFireMissilesFromState(true);gcKeys.e=false;}

 // movement
 let mx=0,my=0;
 if(gcKeys.a||gcKeys.arrowleft)mx-=1;
 if(gcKeys.d||gcKeys.arrowright)mx+=1;
 if(gcKeys.w||gcKeys.arrowup)my-=1;
 if(gcKeys.s||gcKeys.arrowdown)my+=1;
 const len=Math.hypot(mx,my)||1;
 const sp=s.upgrades.speed;
 s.vx=mx/len*sp; s.vy=my/len*sp;
 s.x=Math.max(30,Math.min(GC_W-30,s.x+s.vx*dt));
 s.y=Math.max(40,Math.min(GC_H-30,s.y+s.vy*dt));
 if(gcPointer.down||gcKeys.space||gcKeys[' ']) gcFire();

 // waves — open upgrade shop between waves
 if(!s.bossSpawned && s.spawnLeft<=0 && s.zombies.length===0&&!s.waveShopPending){
  if(s.wave<s.map.waves){
   s.waveShopPending=true;
   gcShowWaveShop();
   return;
  }
 }
 const maxZ=22+s.wave*3+s.map.id*2;
 if(s.spawnLeft>0&&s.zombies.length<maxZ){
  s.spawnGap-=dt;
  if(s.spawnGap<=0){
   gcSpawnZombie(s.spawnLeft%5===0);
   s.spawnLeft--;
   s.spawnGap=Math.max(0.28,0.72-s.wave*0.018);
  }
 }
 if(s.military){
  s.military.forEach(unit=>{
   unit.t+=dt;
   unit.fireT-=dt;
   gcMilitaryMove(unit,dt,s);
   const best=gcMilitaryPickTarget(s,unit);
   if(best){
    unit.aim=Math.atan2((best.y-10)-unit.y,best.x-unit.x);
    if(unit.fireT<=0){
     unit.fireT=unit.fireRate||0.07;
     gcMilitaryMinigunFire(s,unit,best);
    }
   }
  });
 }
 if(s.wave===1&&s.spawnLeft===0&&s.zombies.length===0&&!s.bossSpawned&&s.waveT===0){
  gcStartWave();
 }

 // zombies (ground only — shuffle toward your shadow)
 s.zombies.forEach(z=>{
  z.t+=dt; z.hurt=Math.max(0,z.hurt-dt);
  z.hitCD=Math.max(0,(z.hitCD||0)-dt);
  z.missCD=Math.max(0,(z.missCD||0)-dt);
  const gy=z.gy!=null?z.gy:gcGroundY();
  const dir=s.x>z.x?1:-1;
  z.face=dir;
  z.x+=dir*z.speed*dt;
  z.y=gy+Math.sin(z.t*5)*2.5;
  const hDist=Math.abs(s.x-z.x);
  const vGap=s.y-gy;
  if(hDist<z.r+32&&vGap>-35&&vGap<130){
   s.hp-=(z.elite?32:20)*dt;
   s.shake=4;
   gcSfx.groan();
  }
 });

 // boss
 if(s.boss){
  const b=s.boss; b.t+=dt; b.hurt=Math.max(0,b.hurt-dt);
  const gy=b.gy!=null?b.gy:gcGroundY();
  b.x=GC_W/2+Math.sin(b.t*0.7)*Math.min(220,GC_W*0.38);
  b.y=gy-b.r+Math.sin(b.t*1.3)*4;
  b.shootT-=dt;
  if(b.shootT<=0){
   b.shootT=1.1-Math.min(0.5,s.map.id*0.04);
   for(let i=0;i<8;i++){
    const a=(Math.PI*2*i)/8+b.t;
    s.bullets.push({x:b.x,y:b.y,vx:Math.cos(a)*180,vy:Math.sin(a)*180,life:2.5,dmg:0,r:6,enemy:true});
   }
   // aimed shard
   const a2=Math.atan2(s.y-b.y,s.x-b.x);
   s.bullets.push({x:b.x,y:b.y,vx:Math.cos(a2)*260,vy:Math.sin(a2)*260,life:2,dmg:0,r:7,enemy:true});
  }
  if(Math.hypot(b.x-s.x,b.y-s.y)<b.r+14){
   s.hp-=22*dt; s.shake=4;
  }
 }

 // bullets
 s.bullets.forEach(bu=>{
  bu.x+=bu.vx*dt; bu.y+=bu.vy*dt; bu.life-=dt;
  if(bu.enemy){
   if(Math.hypot(bu.x-s.x,bu.y-s.y)<14+bu.r){
    s.hp-=12; bu.life=0; s.shake=4;
   }
   return;
  }
  if(bu.ally){
   s.zombies.forEach(z=>{
    if(bu.life<=0)return;
    if(Math.hypot(bu.x-z.x,bu.y-z.y)<z.r+bu.r){
     z.hp-=bu.dmg; z.hurt=0.15; bu.life=0;
     gcSpark(bu.x,bu.y,'#7dff9a',4);
     gcSfx.hit();
    }
   });
   if(s.boss&&bu.life>0&&Math.hypot(bu.x-s.boss.x,bu.y-s.boss.y)<s.boss.r+bu.r){
    gcBossTakeDamage(s,bu.dmg); bu.life=0;
    gcSpark(bu.x,bu.y,'#7dff9a',4);
   }
   return;
  }
  s.zombies.forEach(z=>{
   if(bu.life<=0)return;
   if(Math.hypot(bu.x-z.x,bu.y-z.y)<z.r+bu.r){
    bu.life=0;
    z.hurt=0.15;
    if((z.hitCD||0)<=0){
     z.hp-=bu.dmg;
     z.hitCD=0.42;
     gcSpark(bu.x,bu.y,s.map.accent,4);
     gcSfx.hit();
    }else{
     gcSpark(bu.x,bu.y,s.map.accent,2);
    }
   }
  });
  if(s.boss&&bu.life>0&&Math.hypot(bu.x-s.boss.x,bu.y-s.boss.y)<s.boss.r+bu.r){
   gcBossTakeDamage(s,bu.dmg); bu.life=0;
   gcSpark(bu.x,bu.y,s.map.accent);
  }
 });
 s.bullets=s.bullets.filter(bu=>bu.life>0&&bu.x>-40&&bu.x<GC_W+40&&bu.y>-40&&bu.y<GC_H+40);

 // wing missiles (owner Omega Strike)
 s.missiles.forEach(ms=>{
  if(ms.homing){
   const t=gcPickTarget(s);
   if(t){
    const ang=Math.atan2(t.y-ms.y,t.x-ms.x);
    ms.vx=Math.cos(ang)*340; ms.vy=Math.sin(ang)*340;
   }
  }
  ms.x+=ms.vx*dt; ms.y+=ms.vy*dt; ms.life-=dt;
  const hit=(x,y,r)=>{
   if(ms.life<=0)return true;
   if(Math.hypot(ms.x-x,ms.y-y)<r+ms.r){
    ms.life=0;
    return true;
   }
   return false;
  };
  s.zombies.forEach(z=>{
   if(!hit(z.x,z.y,z.r))return;
   z.hurt=0.2;
   if((z.missCD||0)<=0){
    z.hp-=ms.dmg;
    z.missCD=0.95;
    gcBoom(z.x,z.y-8,s.map.accent,0.75);
   }else gcSpark(ms.x,ms.y,'#f8d030',3);
  });
  if(s.boss&&hit(s.boss.x,s.boss.y,s.boss.r)){gcBossTakeDamage(s,ms.dmg);gcBoom(ms.x,ms.y,'#f8d030',0.9);}
 });
 s.missiles=s.missiles.filter(ms=>ms.life>0&&ms.x>-60&&ms.x<GC_W+60&&ms.y>-60&&ms.y<GC_H+60);

 // deaths / pickups
 s.zombies=s.zombies.filter(z=>{
  if(z.hp>0)return true;
  s.kills++;
  const pay=z.elite?12:5;
  s.pickups.push({x:z.x,y:z.y,v:pay,life:8});
  gcBoom(z.x,z.y-8,s.map.accent,z.elite?1.1:0.75);
  return false;
 });
 if(s.boss&&s.boss.hp<=0) gcOnBossDefeated();

 // magnet pickups
 s.pickups.forEach(p=>{
  p.life-=dt;
  const d=Math.hypot(p.x-s.x,p.y-s.y);
  if(d<s.upgrades.magnet){
   p.x+=(s.x-p.x)*dt*6; p.y+=(s.y-p.y)*dt*6;
  }
  if(d<18){ s.gems+=p.v; p.life=0; }
 });
 s.pickups=s.pickups.filter(p=>p.life>0);
 s.particles=s.particles.filter(p=>{
  p.life-=dt;
  if(p.kind==='spark'||p.kind==='debris'||p.kind==='smoke'||!p.kind){
   p.x+=p.vx*dt; p.y+=p.vy*dt;
   if(p.kind==='debris')p.vy+=180*dt;
   if(p.kind==='smoke'){p.vy-=28*dt;p.vx*=0.98;}
  }
  return p.life>0;
 });

 if(s.hp<=0){
  s.hp=0; s.over=true;
  setTimeout(()=>gcShowDefeat(),150);
 }
 gcHud();
}

function gcSpark(x,y,color,n){
 if(!gcState)return;
 const count=n||6;
 for(let i=0;i<count;i++){
  const a=Math.random()*Math.PI*2;
  gcState.particles.push({
   kind:'spark',x,y,
   vx:Math.cos(a)*(40+Math.random()*80),vy:Math.sin(a)*(40+Math.random()*80),
   life:0.35+Math.random()*0.25,maxLife:0.5,color
  });
 }
}

function gcBoom(x,y,color,scale){
 if(!gcState)return;
 const s=gcState;
 const sc=scale||1;
 const col=color||'#ff9040';
 const life=0.52+sc*0.14;
 s.shake=Math.max(s.shake||0,2+sc*3.5);
 s.particles.push({kind:'flash',x,y,life,maxLife:life,color:col,size:22*sc});
 s.particles.push({kind:'starburst',x,y,life,maxLife:life,maxR:34*sc,color:col,rot:Math.random()*Math.PI});
 s.particles.push({kind:'ring',x,y,life,maxLife:life,maxR:32*sc,color:col});
 s.particles.push({kind:'ring',x,y,life:life*0.88,maxLife:life*0.88,maxR:22*sc,color:'#ffe8c0'});
 s.particles.push({kind:'ring',x,y,life:life*0.65,maxLife:life*0.65,maxR:14*sc,color:'#fff'});
 for(let i=0;i<8+sc*10|0;i++){
  const a=Math.random()*Math.PI*2,sp=70+Math.random()*160*sc;
  s.particles.push({
   kind:'debris',x,y,
   vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-Math.random()*50,
   life:0.4+Math.random()*0.4,maxLife:0.75,
   color:Math.random()<0.45?col:(Math.random()<0.5?'#ffe06a':'#3a3028'),size:2+Math.random()*4*sc
  });
 }
 for(let i=0;i<3+sc*4|0;i++){
  s.particles.push({
   kind:'smoke',x:x+(Math.random()-0.5)*16,y:y+(Math.random()-0.5)*10,
   vx:(Math.random()-0.5)*30,vy:-20-Math.random()*40,
   life:0.5+Math.random()*0.35,maxLife:0.85,size:8+Math.random()*10*sc,color:'rgba(40,36,32,.55)'
  });
 }
 gcSpark(x,y,col,6+sc*4|0);
 gcExplosionSfx(sc);
}

function gcDrawHostileHeli(ctx,z,m){
 const elite=z.elite;
 const sc=elite?1.28:1;
 const hop=Math.sin(z.t*8)*2.2;
 const hull=z.hurt>0?'#a0a8b0':(elite?'#3a5048':'#424c44');
 ctx.scale(z.face,1);
 ctx.translate(0,hop);
 ctx.strokeStyle='#353a40'; ctx.lineWidth=2;
 ctx.beginPath(); ctx.moveTo(-10*sc,7*sc); ctx.lineTo(-5*sc,11*sc); ctx.lineTo(10*sc,11*sc); ctx.lineTo(14*sc,7*sc); ctx.stroke();
 ctx.fillStyle=hull;
 ctx.beginPath();
 ctx.moveTo(-14*sc,8*sc); ctx.lineTo(14*sc,8*sc); ctx.lineTo(18*sc,0); ctx.lineTo(12*sc,-8*sc); ctx.lineTo(-14*sc,-8*sc); ctx.lineTo(-18*sc,0);
 ctx.closePath(); ctx.fill();
 ctx.fillStyle='#2a3028';
 ctx.fillRect(-16*sc,-3*sc,7*sc,4*sc);
 ctx.fillStyle='#1a2820';
 ctx.beginPath(); ctx.ellipse(5*sc,-1*sc,7*sc,5*sc,0,0,Math.PI*2); ctx.fill();
 ctx.fillStyle=m.accent; ctx.globalAlpha=0.75;
 ctx.fillRect(3*sc,-2*sc,4*sc,3*sc); ctx.globalAlpha=1;
 ctx.strokeStyle=m.accent; ctx.lineWidth=1.5;
 ctx.beginPath(); ctx.moveTo(-6*sc,2*sc); ctx.lineTo(0,6*sc); ctx.lineTo(7*sc,1*sc); ctx.stroke();
 const spin=z.t*22;
 ctx.save(); ctx.translate(0,-10*sc);
 ctx.strokeStyle=elite?'rgba(255,120,120,.75)':'rgba(160,100,100,.55)'; ctx.lineWidth=2;
 ctx.beginPath(); ctx.moveTo(Math.cos(spin)*15*sc,0); ctx.lineTo(Math.cos(spin+Math.PI)*15*sc,0); ctx.stroke();
 if(elite){
  ctx.beginPath(); ctx.moveTo(Math.cos(spin+1.2)*11*sc,-2); ctx.lineTo(Math.cos(spin+1.2+Math.PI)*11*sc,-2); ctx.stroke();
  ctx.strokeStyle=m.accent; ctx.lineWidth=2; ctx.strokeRect(-15*sc,-9*sc,28*sc,16*sc);
 }
 ctx.restore();
}

function gcDrawMinigun(ctx,u,ox,oy,sc,noAim){
 const spin=(u.spin||0)*0.9+u.t*18;
 ctx.save();
 ctx.translate(ox,oy);
 if(!noAim)ctx.rotate(u.aim||0);
 ctx.fillStyle='#2a3238';
 ctx.fillRect(-4*sc,-5*sc,20*sc,10*sc);
 ctx.fillStyle='#4a5560';
 ctx.fillRect(2*sc,-3*sc,10*sc,6*sc);
 ctx.fillStyle='#1a2028';
 for(let i=0;i<6;i++){
  const a=spin+i*(Math.PI*2/6);
  ctx.save();
  ctx.translate(10*sc,0);
  ctx.rotate(a);
  ctx.fillRect(0,-1.2*sc,14*sc,2.4*sc);
  ctx.restore();
 }
 ctx.fillStyle='#7dffd4'; ctx.globalAlpha=0.5;
 ctx.beginPath(); ctx.arc(4*sc,0,4*sc,0,Math.PI*2); ctx.fill();
 ctx.globalAlpha=1;
 ctx.restore();
}

function gcDrawSoldierBody(ctx,u,m){
 const sc=1.12;
 const walk=Math.sin(u.t*9)*0.38;
 const leg=Math.sin(u.t*9+Math.PI)*0.38;
 ctx.scale(u.face,1);
 ctx.fillStyle='#243040';
 ctx.fillRect(-5*sc,0+walk*3,4*sc,11*sc);
 ctx.fillRect(1*sc,0+leg*3,4*sc,11*sc);
 ctx.fillStyle='#4ec8ff'; ctx.globalAlpha=0.55;
 ctx.fillRect(-4*sc,8+walk*2,2*sc,2*sc);
 ctx.fillRect(2*sc,8+leg*2,2*sc,2*sc);
 ctx.globalAlpha=1;
 ctx.fillStyle='#3a4a5c';
 ctx.fillRect(-8*sc,-18*sc,16*sc,16*sc);
 ctx.fillStyle='#1e2838';
 ctx.fillRect(-6*sc,-15*sc,12*sc,9*sc);
 ctx.strokeStyle='#7dffd4'; ctx.lineWidth=1;
 ctx.strokeRect(-5*sc,-13*sc,10*sc,6*sc);
 ctx.fillStyle=m.accent;
 ctx.beginPath(); ctx.arc(0,-10*sc,3*sc,0,Math.PI*2); ctx.fill();
 ctx.fillStyle='#586878';
 ctx.fillRect(-10*sc,-17*sc,4*sc,7*sc); ctx.fillRect(6*sc,-17*sc,4*sc,7*sc);
 ctx.fillStyle='#2a3848';
 ctx.beginPath(); ctx.arc(0,-21*sc,6*sc,0,Math.PI*2); ctx.fill();
 ctx.fillStyle='#7dffd4'; ctx.globalAlpha=0.9;
 ctx.fillRect(-5*sc,-22*sc,10*sc,3*sc); ctx.globalAlpha=1;
 gcDrawMinigun(ctx,u,4*sc,-14*sc,0.95);
}

function gcDrawTankBody(ctx,u,m){
 const sc=1.15;
 const pulse=0.55+Math.sin(u.t*5)*0.2;
 ctx.scale(u.face,1);
 ctx.fillStyle='#121820';
 ctx.fillRect(-30*sc,4*sc,60*sc,6*sc);
 ctx.strokeStyle='#7dffd4'; ctx.globalAlpha=pulse*0.45; ctx.lineWidth=2*sc;
 ctx.strokeRect(-30*sc,4*sc,60*sc,6*sc); ctx.globalAlpha=1;
 ctx.fillStyle='#2a3848';
 ctx.beginPath();
 ctx.moveTo(-26*sc,4*sc); ctx.lineTo(-22*sc,-6*sc); ctx.lineTo(22*sc,-6*sc); ctx.lineTo(26*sc,4*sc);
 ctx.closePath(); ctx.fill();
 ctx.strokeStyle='#586878'; ctx.lineWidth=1.5*sc; ctx.stroke();
 ctx.fillStyle='#1e2838';
 [-18,-6,6,18].forEach(px=>{
  ctx.beginPath(); ctx.arc(px*sc,11*sc,5*sc,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#7dffd4'; ctx.globalAlpha=0.35;
  ctx.beginPath(); ctx.arc(px*sc,11*sc,2*sc,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1; ctx.fillStyle='#1e2838';
 });
 ctx.fillStyle='#3a4a58';
 ctx.beginPath(); ctx.arc(-6*sc,-2*sc,11*sc,0,Math.PI*2); ctx.fill();
 ctx.strokeStyle=m.accent; ctx.lineWidth=2*sc;
 ctx.beginPath(); ctx.arc(-6*sc,-2*sc,11*sc,0,Math.PI*2); ctx.stroke();
 ctx.save(); ctx.translate(-6*sc,-2*sc); ctx.rotate(u.aim||0);
 ctx.fillStyle='#2a3848';
 ctx.fillRect(-7*sc,-6*sc,20*sc,12*sc);
 ctx.strokeStyle='#7dffd4'; ctx.strokeRect(-5*sc,-4*sc,16*sc,8*sc);
 gcDrawMinigun(ctx,u,8*sc,0,0.75,true);
 ctx.restore();
 ctx.fillStyle=m.accent; ctx.globalAlpha=0.5;
 ctx.fillRect(-24*sc,-8*sc,10*sc,3*sc);
 ctx.fillStyle='#7dffd4'; ctx.fillRect(-23*sc,-7*sc,3*sc,1*sc);
 ctx.globalAlpha=1;
 ctx.strokeStyle='#7dffd4'; ctx.lineWidth=1;
 ctx.beginPath(); ctx.moveTo(20*sc,-8*sc); ctx.lineTo(24*sc,-16*sc); ctx.stroke();
 ctx.fillStyle=m.accent; ctx.beginPath(); ctx.arc(24*sc,-16*sc,2*sc,0,Math.PI*2); ctx.fill();
}

function gcDrawJeepBody(ctx,u,m){
 const sc=1.05;
 const pulse=0.5+Math.sin(u.t*6+1)*0.25;
 ctx.scale(u.face,1);
 ctx.fillStyle='#1a2430';
 ctx.fillRect(-24*sc,2*sc,48*sc,10*sc);
 ctx.strokeStyle='#7dffd4'; ctx.globalAlpha=pulse*0.4; ctx.lineWidth=1.5*sc;
 ctx.strokeRect(-24*sc,2*sc,48*sc,10*sc); ctx.globalAlpha=1;
 ctx.fillStyle='#2a3848';
 ctx.beginPath();
 ctx.moveTo(-20*sc,2*sc); ctx.lineTo(-16*sc,-10*sc); ctx.lineTo(14*sc,-10*sc); ctx.lineTo(18*sc,2*sc);
 ctx.closePath(); ctx.fill();
 ctx.fillStyle='#141c28';
 ctx.fillRect(-14*sc,-8*sc,22*sc,7*sc);
 ctx.fillStyle='#7dffd4'; ctx.globalAlpha=0.55;
 ctx.fillRect(-12*sc,-7*sc,18*sc,2*sc); ctx.globalAlpha=1;
 ctx.strokeStyle=m.accent; ctx.lineWidth=1.5*sc;
 ctx.strokeRect(-12*sc,-8*sc,22*sc,7*sc);
 [-16,12].forEach(px=>{
  ctx.fillStyle='#101820';
  ctx.fillRect(px*sc,8*sc,9*sc,5*sc);
  ctx.fillStyle='#7dffd4'; ctx.globalAlpha=0.7;
  ctx.beginPath(); ctx.arc((px+(px<0?4:5))*sc,11*sc,3*sc,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1;
 });
 ctx.save(); ctx.translate(8*sc,-11*sc); ctx.rotate((u.aim||0)*0.85);
 ctx.fillStyle='#384858';
 ctx.fillRect(-4*sc,-4*sc,10*sc,8*sc);
 gcDrawMinigun(ctx,u,0,0,0.85,true);
 ctx.restore();
 ctx.fillStyle=m.accent;
 ctx.fillRect(-22*sc,0,4*sc,2*sc); ctx.fillRect(18*sc,0,4*sc,2*sc);
}

function gcDrawMilitaryUnit(ctx,u,m){
 if(u.kind==='tank')gcDrawTankBody(ctx,u,m);
 else if(u.kind==='jeep')gcDrawJeepBody(ctx,u,m);
 else gcDrawSoldierBody(ctx,u,m);
}

function gcDrawBossBody(ctx,b,m){
 if(window.GcBossShapes&&window.GcBossShapes.drawBossBody){
  window.GcBossShapes.drawBossBody(ctx,b,m);
  return;
 }
}

function gcHud(){
 const s=gcState; if(!s)return;
 const hp=document.getElementById('gc-hp');
 const gems=document.getElementById('gc-gems');
 const wave=document.getElementById('gc-wave');
 const kills=document.getElementById('gc-kills');
 if(hp)hp.textContent=`HP ${Math.max(0,Math.ceil(s.hp))}/${s.maxHp}`;
 if(gems)gems.textContent=`💎 ${s.gems}`;
 if(wave)wave.textContent=s.boss?`BOSS`:`Wave ${s.wave}/${s.map.waves}`;
 if(kills)kills.textContent=`Kills ${s.kills}`;
 const armyEl=document.getElementById('gc-army');
 if(armyEl&&s.military){
  const foot=s.military.filter(u=>u.kind==='soldier'||!u.kind).length;
  const veh=s.military.length-foot;
  armyEl.textContent=veh?`${foot} on foot · ${veh} vehicles`:`Squad ${s.military.length}`;
 }
}

function gcDraw(){
 const s=gcState; if(!s)return;
 const cv=document.getElementById('gc-canvas'); if(!cv)return;
 const ctx=cv.getContext('2d');
 const m=s.map;
 if(s.cutscene?.type==='gravastar'){
  const sh=s.shake? (Math.random()-0.5)*s.shake*2:0;
  ctx.save(); ctx.translate(sh,0);
  gcDrawGravastar(ctx,s.cutscene,s);
  ctx.restore();
  return;
 }
 const sh=s.shake? (Math.random()-0.5)*s.shake*2:0;
 const sv=s.shake? (Math.random()-0.5)*s.shake*2:0;
 ctx.save();
 ctx.translate(sh,sv);
 const grd=ctx.createLinearGradient(0,0,0,GC_H);
 grd.addColorStop(0,m.sky[0]); grd.addColorStop(1,m.sky[1]);
 ctx.fillStyle=grd; ctx.fillRect(0,0,GC_W,GC_H);
 const gy=gcGroundY();
 // ground band
 ctx.fillStyle=m.ground; ctx.globalAlpha=0.72;
 ctx.fillRect(0,gy-8,GC_W,GC_H-gy+8);
 ctx.globalAlpha=1;
 ctx.strokeStyle=m.accent; ctx.lineWidth=3; ctx.globalAlpha=0.45;
 ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(GC_W,gy); ctx.stroke();
 ctx.globalAlpha=1;
 // hills behind ground
 ctx.fillStyle=m.accent; ctx.globalAlpha=0.12;
 for(let i=0;i<12;i++){
  const hx=(i*140+(s.rotor*3))% (GC_W+120)-60;
  ctx.beginPath(); ctx.moveTo(hx,gy); ctx.lineTo(hx+60,gy-48); ctx.lineTo(hx+120,gy); ctx.fill();
 }
 ctx.globalAlpha=1;
 gcDrawMapTheme(ctx,s,m,gy);

 if(s.military){
  s.military.forEach(u=>{
   ctx.save();
   ctx.translate(u.x,u.y);
   gcDrawMilitaryUnit(ctx,u,m);
   ctx.restore();
  });
 }

 // pickups
 s.pickups.forEach(p=>{
  ctx.fillStyle='#c9a94f';
  ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill();
 });

 // zombies
 s.zombies.forEach(z=>{
  ctx.save();
  ctx.translate(z.x,z.y);
  ctx.rotate(Math.sin(z.t*6)*0.06);
  gcDrawHostileHeli(ctx,z,m);
  const barY=-36*(z.elite?1.28:1);
  ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(-z.r, barY, z.r*2, 4);
  ctx.fillStyle='#3ecf8a'; ctx.fillRect(-z.r, barY, z.r*2*(z.hp/z.maxHp), 4);
  ctx.restore();
 });

 // boss — mega hostile gunship
 if(s.boss){
  const b=s.boss;
  ctx.save(); ctx.translate(b.x,b.y);
  gcDrawBossBody(ctx,b,m);
  ctx.restore();
 }

 // bullets
 s.missiles.forEach(ms=>{
  ctx.save(); ctx.translate(ms.x,ms.y);
  ctx.rotate(Math.atan2(ms.vy,ms.vx));
  ctx.fillStyle='#f8d030'; ctx.fillRect(-10,-3,14,6);
  ctx.fillStyle='#ff6040'; ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(14,-4); ctx.lineTo(14,4); ctx.fill();
  ctx.restore();
 });
 s.bullets.forEach(bu=>{
  if(bu.line){
   const a=bu.ang!=null?bu.ang:Math.atan2(bu.vy,bu.vx);
   const len=26;
   ctx.strokeStyle=bu.ally?'#7dff9a':m.accent;
   ctx.lineWidth=3; ctx.lineCap='round';
   ctx.globalAlpha=0.92;
   ctx.beginPath();
   ctx.moveTo(bu.x,bu.y);
   ctx.lineTo(bu.x-Math.cos(a)*len,bu.y-Math.sin(a)*len);
   ctx.stroke();
   ctx.globalAlpha=1;
   return;
  }
  if(bu.minigun){
   const a=Math.atan2(bu.vy,bu.vx);
   ctx.strokeStyle='#ffe066';
   ctx.lineWidth=2; ctx.lineCap='round';
   ctx.beginPath();
   ctx.moveTo(bu.x,bu.y);
   ctx.lineTo(bu.x-Math.cos(a)*10,bu.y-Math.sin(a)*10);
   ctx.stroke();
   return;
  }
  ctx.fillStyle=bu.enemy?'#ff6080':(bu.ally?'#7dff9a':m.accent);
  ctx.beginPath(); ctx.arc(bu.x,bu.y,bu.r,0,Math.PI*2); ctx.fill();
 });

 // particles & explosions
 s.particles.forEach(p=>{
  const maxL=p.maxLife||0.5;
  const a=Math.max(0,p.life/maxL);
  if(p.kind==='ring'){
   const prog=1-a;
   ctx.globalAlpha=a*0.9;
   ctx.strokeStyle=p.color||'#ff9040';
   ctx.lineWidth=2+prog*4;
   ctx.beginPath(); ctx.arc(p.x,p.y,(p.maxR||24)*prog,0,Math.PI*2); ctx.stroke();
  }else if(p.kind==='flash'){
   const r=(p.size||16)*(1-a*0.3);
   const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
   g.addColorStop(0,'#fff'); g.addColorStop(0.35,p.color||'#ff9040'); g.addColorStop(1,'rgba(255,80,20,0)');
   ctx.globalAlpha=a;
   ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
  }else if(p.kind==='debris'){
   ctx.globalAlpha=a;
   ctx.fillStyle=p.color||'#554';
   ctx.fillRect(p.x,p.y,p.size||3,p.size||3);
  }else if(p.kind==='starburst'){
   const prog=1-a,r=(p.maxR||30)*prog;
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot||0);
   ctx.globalAlpha=a*0.95;
   const g=ctx.createRadialGradient(0,0,0,0,0,r);
   g.addColorStop(0,'#fff');g.addColorStop(0.35,p.color||'#ff9040');g.addColorStop(0.72,'#ff8a2a');g.addColorStop(1,'rgba(208,48,26,0)');
   ctx.fillStyle=g;
   ctx.beginPath();
   for(let i=0;i<8;i++){
    const ang=(Math.PI*2*i)/8-Math.PI/2;
    const inner=r*0.38,outer=r*(i%2?1:0.72);
    ctx.lineTo(Math.cos(ang)*outer,Math.sin(ang)*outer);
    ctx.lineTo(Math.cos(ang+0.35)*inner,Math.sin(ang+0.35)*inner);
   }
   ctx.closePath();ctx.fill();
   ctx.fillStyle='#fff';ctx.globalAlpha=a*0.85;
   ctx.beginPath();ctx.arc(0,0,r*0.22,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }else if(p.kind==='smoke'){
   ctx.globalAlpha=a*0.65;
   ctx.fillStyle=p.color||'rgba(60,56,52,.5)';
   ctx.beginPath();ctx.arc(p.x,p.y,(p.size||8)*(0.6+a*0.5),0,Math.PI*2);ctx.fill();
  }else{
   ctx.globalAlpha=Math.max(0,p.life*2);
   ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,3,3);
  }
  ctx.globalAlpha=1;
 });

 // helicopter (side-view attack chopper — not a yellow blob)
 ctx.save();
 ctx.translate(s.x,s.y);
 const tilt=(gcPointer.x-s.x)*0.0015;
 ctx.rotate(Math.max(-0.35,Math.min(0.35,tilt)));
 const hull=s.heli?.hull||'#6a7a62';
 const trim=s.heli?.trim||m.accent;
 const tailCol=gcDarken(hull,0.75);
 // rotor mast + spinning blades
 ctx.fillStyle='#3a4048';
 ctx.fillRect(-2,-26,4,8);
 ctx.strokeStyle='rgba(230,240,255,.5)'; ctx.lineWidth=2.5;
 ctx.beginPath(); ctx.moveTo(Math.cos(s.rotor)*30,-28+Math.sin(s.rotor)*2); ctx.lineTo(Math.cos(s.rotor+Math.PI)*30,-28+Math.sin(s.rotor+Math.PI)*2); ctx.stroke();
 ctx.lineWidth=2;
 ctx.beginPath(); ctx.moveTo(Math.cos(s.rotor+1.1)*24,-28); ctx.lineTo(Math.cos(s.rotor+1.1+Math.PI)*24,-28); ctx.stroke();
 // tail boom + fin
 ctx.fillStyle=tailCol;
 ctx.fillRect(-36,-3,22,5);
 ctx.fillRect(-36,-14,4,12);
 ctx.fillRect(-38,-14,3,4);
 // skids
 ctx.strokeStyle='#7a8490'; ctx.lineWidth=2;
 ctx.beginPath(); ctx.moveTo(-10,9); ctx.lineTo(-6,13); ctx.lineTo(10,13); ctx.lineTo(14,9); ctx.stroke();
 // fuselage
 ctx.fillStyle=hull;
 ctx.beginPath();
 ctx.moveTo(-14,9); ctx.lineTo(16,9); ctx.lineTo(20,2); ctx.lineTo(16,-9); ctx.lineTo(-14,-9); ctx.lineTo(-18,0);
 ctx.closePath(); ctx.fill();
 ctx.strokeStyle=trim; ctx.lineWidth=1.5; ctx.stroke();
 // cockpit glass
 ctx.fillStyle='#2a4860';
 ctx.beginPath(); ctx.ellipse(8,-1,9,6.5,0,0,Math.PI*2); ctx.fill();
 ctx.fillStyle='rgba(120,180,220,.35)';
 ctx.beginPath(); ctx.ellipse(10,-2,5,3.5,0,0,Math.PI*2); ctx.fill();
 // engine / gem stripe + tech HUD
 ctx.fillStyle=trim; ctx.globalAlpha=0.85;
 ctx.fillRect(-4,-5,14,3); ctx.globalAlpha=1;
 ctx.strokeStyle='#7dffd4'; ctx.lineWidth=1; ctx.globalAlpha=0.65;
 ctx.strokeRect(-6,-7,18,7);
 ctx.fillStyle='#7dffd4'; ctx.globalAlpha=0.35;
 ctx.fillRect(10,-6,3,2); ctx.globalAlpha=1;
 // wing hardpoints + missiles
 if(gcHeliMissileMode(s.heli)!=='none'){
  const dual=gcHeliMissileMode(s.heli)==='dual';
  const pods=dual?[-20,14]:[0];
  pods.forEach(px=>{
   ctx.fillStyle='#505868';
   ctx.fillRect(px,-5,11,4);
   ctx.fillStyle='#707880';
   ctx.fillRect(px+(dual?-3:2),-3,8,2);
   ctx.fillStyle='#a04038';
   ctx.fillRect(px+(dual?-5:0),-2.5,2,3);
  });
 }
 // belly gem turret (under nose, rotates toward aim)
 const ang=Math.atan2(gcPointer.y-s.y,gcPointer.x-s.x);
 ctx.save();
 ctx.translate(12,4);
 ctx.rotate(ang);
 ctx.fillStyle='#3a4048';
 ctx.fillRect(-2,-4,10,8);
 ctx.fillStyle=m.accent;
 ctx.fillRect(4,-2,14,4);
 ctx.beginPath(); ctx.arc(4,0,5,0,Math.PI*2); ctx.fill();
 ctx.fillStyle=trim;
 ctx.fillRect(16,-1.5,4,3);
 ctx.restore();
 ctx.restore();

 // five parallel aim lines
 const aimAng=Math.atan2(gcPointer.y-s.y,gcPointer.x-s.x);
 const aimPerp=aimAng+Math.PI/2;
 const aimLen=Math.min(420,Math.hypot(gcPointer.x-s.x,gcPointer.y-s.y)+80);
 const laneGap=gcLaneSpacing(s.upgrades);
 const laneMid=(GC_BULLET_LINES-1)/2;
 ctx.strokeStyle=m.accent; ctx.globalAlpha=0.22; ctx.setLineDash([8,8]); ctx.lineWidth=2;
 for(let i=0;i<GC_BULLET_LINES;i++){
  const off=(i-laneMid)*laneGap;
  const sx=s.x+Math.cos(aimPerp)*off, sy=s.y-8+Math.sin(aimPerp)*off;
  ctx.beginPath();
  ctx.moveTo(sx,sy);
  ctx.lineTo(sx+Math.cos(aimAng)*aimLen,sy+Math.sin(aimAng)*aimLen);
  ctx.stroke();
 }
 ctx.setLineDash([]); ctx.globalAlpha=1;
 ctx.fillStyle='rgba(125,255,212,.85)'; ctx.font='10px monospace'; ctx.textAlign='left';
 const mm=gcHeliMissileMode(s.heli);
 ctx.fillText(`GEM COPTER · build ${GEM_COPTER_BUILD} · ${s.heli?s.heli.name:'Scout'}${mm!=='none'?(mm==='dual'?' · dual missiles':' · missile'):''}`,12,18);
 if(s.map.id===10&&s.boss&&s.boss.gravastarCore){
  ctx.fillStyle='rgba(255,200,120,0.75)'; ctx.font='10px system-ui,sans-serif';
  ctx.fillText('Final shields — try Gravastar Counterstrike: Ctrl+⌘+Shift',12,32);
 }
 ctx.restore();
}

function gcShowDefeat(){
 const ov=document.getElementById('gc-overlay'); if(!ov||!gcState)return;
 ov.hidden=false;
 ov.innerHTML=`<div class="gc-card">
  <h2>Helicopter Down</h2>
  <p>Map ${gcState.map.id}: ${gcState.map.name}</p>
  <p>💎 ${gcState.gems} · Kills ${gcState.kills}</p>
  <button type="button" class="gc-btn" id="gc-retry">Retry Map</button>
  <button type="button" class="gc-btn ghost" id="gc-menu-btn">Maps</button>
 </div>`;
 document.getElementById('gc-retry').onclick=()=>gcStartMap(gcState.map.id,{upgrades:gcState.upgrades,gems:gcState.gems,heliId:gcState.heli?.id});
 document.getElementById('gc-menu-btn').onclick=()=>{gcClose();playGemCopter();};
}

function gcShowWaveShop(){
 const s=gcState; if(!s)return;
 if(gcRaf){cancelAnimationFrame(gcRaf);gcRaf=null;}
 s.shopPause=true;
 document.getElementById('gc-play').hidden=true;
 gcLeavePlayMode();
 const shop=document.getElementById('gc-shop');
 shop.hidden=false;
 document.getElementById('gc-mapname').textContent=`Wave ${s.wave} cleared — upgrade!`;
 shop.innerHTML=`
  <div class="gc-shop-inner">
   <h2>Wave ${s.wave} cleared!</h2>
   <p>Spend 💎 <b id="gc-shop-gems">${s.gems}</b> · ${gcIsOwner()?'👑 Owner gold upgrades unlocked':'Regular upgrades only (owner code unlocks 👑)'}</p>
   ${gcIsOwner()?'<p class="gc-owner-shop-tag">👑 Owner arsenal</p>':''}
   <div class="gc-up-grid" id="gc-up-grid"></div>
   <div class="gc-shop-actions">
    <button type="button" class="gc-btn" id="gc-wave-continue">Continue → Wave ${s.wave+1}</button>
   </div>
  </div>`;
 gcRenderShop();
 document.getElementById('gc-wave-continue').onclick=()=>{
  s.shopPause=false;
  s.waveShopPending=false;
  s.wave++;
  shop.hidden=true;
  document.getElementById('gc-play').hidden=false;
  gcEnterPlayMode();
  gcStartWave();
  gcStartLoop();
 };
}

function gcShowVictory(){
 const s=gcState; if(!s)return;
 if(gcRaf){cancelAnimationFrame(gcRaf);gcRaf=null;}
 document.getElementById('gc-play').hidden=true;
 gcLeavePlayMode();
 const shop=document.getElementById('gc-shop');
 shop.hidden=false;
 document.getElementById('gc-mapname').textContent=`Cleared ${s.map.name}! Upgrade shop`;
 const next=s.map.id<10?s.map.id+1:null;
 shop.innerHTML=`
  <div class="gc-shop-inner">
   <h2>🏆 Map Cleared!</h2>
   <p>Boss defeated · 💎 <b id="gc-shop-gems">${s.gems}</b> gems</p>
   ${gcIsOwner()?'<p class="gc-owner-shop-tag">👑 Owner arsenal — strongest upgrades in the game</p>':''}
   <div class="gc-up-grid" id="gc-up-grid"></div>
   <div class="gc-shop-actions">
    ${next?`<button type="button" class="gc-btn" id="gc-next">Next Map → ${GC_MAPS[next-1].name}</button>`:`<button type="button" class="gc-btn" id="gc-winall">You beat all 10 maps! 🎉</button>`}
    <button type="button" class="gc-btn ghost" id="gc-shop-leave">Leave</button>
   </div>
  </div>`;
 gcRenderShop();
 const nextBtn=document.getElementById('gc-next');
 if(nextBtn) nextBtn.onclick=()=>gcStartMap(next,{upgrades:s.upgrades,gems:s.gems,heliId:s.heli?.id});
 const winall=document.getElementById('gc-winall');
 if(winall) winall.onclick=()=>{gcClose();playGemCopter();};
 document.getElementById('gc-shop-leave').onclick=()=>gcClose();
}

function gcRenderShop(){
 const s=gcState; if(!s)return;
 const grid=document.getElementById('gc-up-grid');
 const gemEl=document.getElementById('gc-shop-gems');
 if(gemEl)gemEl.textContent=s.gems;
 grid.innerHTML=gcShopUpgrades().map(up=>{
  const lvl=s.upgrades.levels[up.id]||0;
  const maxed=lvl>=up.max;
  const cost=up.cost+lvl*(up.ownerOnly?12:15);
  const ownerLocked=!!(up.ownerOnly&&!gcIsOwner());
  const can=!ownerLocked&&s.gems>=cost&&!maxed;
  const meta=maxed?'MAX':ownerLocked?'🔒 Secret Codes → owner unlock':`Lv ${lvl}/${up.max} · 💎 ${cost}`;
  return `<button type="button" class="gc-up${maxed?' maxed':''}${up.ownerOnly?' owner':''}${ownerLocked?' locked':''}" data-up="${up.id}" ${can?'':'disabled'}>
   <b>${up.ownerOnly?'👑 ':''}${up.name}</b>
   <span>${up.desc}</span>
   <span class="gc-up-meta">${meta}</span>
  </button>`;
 }).join('');
 grid.onclick=e=>{
  const b=e.target.closest('[data-up]'); if(!b||b.disabled)return;
  const up=gcShopUpgrades().find(u=>u.id===b.dataset.up); if(!up)return;
  if(up.ownerOnly&&!gcIsOwner())return;
  const lvl=s.upgrades.levels[up.id]||0;
  if(lvl>=up.max)return;
  const cost=up.cost+lvl*(up.ownerOnly?12:15);
  if(s.gems<cost)return;
  if(!gcIsOwner()){
   s.gems-=cost;
   s.upgrades.levels[up.id]=lvl+1;
  }
  gcPrepareUpgrades(s.upgrades);
  const prevMax=s.maxHp;
  s.maxHp=s.upgrades.maxHp;
  s.hp=Math.min(s.upgrades.maxHp,s.hp+(s.maxHp-prevMax));
  gcRenderShop();
 };
}

window.GEM_COPTER_BUILD=GEM_COPTER_BUILD;
window.playGemCopter=playGemCopter;
window.gcClose=gcClose;
})();
