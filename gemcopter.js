/* Gem Copter — helicopter + gemstone turret vs gem zombies, bosses, upgrades, 10 maps */
(function(){
'use strict';

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
 {id:1,name:'Ruby Ridge',sky:['#1a0610','#3a1020'],ground:'#4a1828',accent:'#ff4060',boss:'Crimson Colossus',waves:4},
 {id:2,name:'Sapphire Coast',sky:['#061018','#102838'],ground:'#183848',accent:'#4ea8ff',boss:'Tide Titan',waves:4},
 {id:3,name:'Emerald Jungle',sky:['#06140a','#14301a'],ground:'#1a4020',accent:'#3ecf8a',boss:'Vine Behemoth',waves:4},
 {id:4,name:'Amethyst Caves',sky:['#100818','#281040'],ground:'#2a1848',accent:'#b06af0',boss:'Crystal Queen',waves:5},
 {id:5,name:'Diamond Peak',sky:['#0c1018','#1a2838'],ground:'#2a3848',accent:'#dbe4ec',boss:'Frost Giant',waves:5},
 {id:6,name:'Opal Oasis',sky:['#101018','#302838'],ground:'#3a3040',accent:'#ff9ad4',boss:'Mirage Sovereign',waves:5},
 {id:7,name:'Topaz Desert',sky:['#181008','#382818'],ground:'#4a3820',accent:'#f0b429',boss:'Sand Tyrant',waves:5},
 {id:8,name:'Garnet Volcano',sky:['#180808','#401018'],ground:'#4a1818',accent:'#e04040',boss:'Magma Overlord',waves:6},
 {id:9,name:'Quartz Quarry',sky:['#101418','#283038'],ground:'#384048',accent:'#a8c0d0',boss:'Shard Emperor',waves:6},
 {id:10,name:'Rainbow Crater',sky:['#100818','#201030'],ground:'#281838',accent:'#c9a94f',boss:'Auric Apocalypse',waves:7}
];

const GC_UPGRADES=[
 {id:'firerate',name:'Rapid Crystal',desc:'Shoot faster',max:5,cost:40,fn:u=>{u.cooldown=Math.max(0.08,0.28-u.levels.firerate*0.035);}},
 {id:'damage',name:'Harder Gems',desc:'More bullet damage',max:5,cost:45,fn:u=>{u.damage=10+u.levels.damage*6;}},
 {id:'spread',name:'Prism Spread',desc:'Extra side shots',max:3,cost:70,fn:u=>{u.spread=u.levels.spread;}},
 {id:'armor',name:'Jade Hull',desc:'More helicopter HP',max:5,cost:50,fn:u=>{u.maxHp=100+u.levels.armor*25;}},
 {id:'speed',name:'Spinel Thrusters',desc:'Fly faster',max:4,cost:40,fn:u=>{u.speed=220+u.levels.speed*35;}},
 {id:'magnet',name:'Lode Magnet',desc:'Pick up gems from farther',max:3,cost:35,fn:u=>{u.magnet=40+u.levels.magnet*30;}}
];

let gcRaf=null, gcKeys={}, gcPointer={x:GC_W/2,y:GC_H/2,down:false}, gcState=null;

function gcDefaultUpgrades(){
 return {levels:{firerate:0,damage:0,spread:0,armor:0,speed:0,magnet:0},cooldown:0.28,damage:10,spread:0,maxHp:100,speed:220,magnet:40};
}
function gcApplyUpgrades(u){
 GC_UPGRADES.forEach(up=>up.fn(u));
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

function gcKeyDown(e){
 if(!gcState)return;
 const k=e.key.toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d','escape'].includes(k)||e.code==='Space'){
  e.preventDefault();
 }
 if(k==='escape'){gcClose();return;}
 gcKeys[k]=true;
 if(e.code==='Space')gcKeys.space=true;
}
function gcKeyUp(e){
 const k=e.key.toLowerCase();
 gcKeys[k]=false;
 if(e.code==='Space')gcKeys.space=false;
}

function playGemCopter(){
 try{if(typeof lithosCloseGameOverlays==='function')lithosCloseGameOverlays();}catch(_){}
 gcClose();
 const wrap=document.createElement('div');
 wrap.id='gemcopter';
 wrap.innerHTML=`
  <div class="gc-box">
   <div class="gc-top">
    <div>
     <div class="gc-title">GEM COPTER</div>
     <div class="gc-sub" id="gc-mapname">Pick a mission map</div>
    </div>
    <button type="button" class="gc-btn ghost" id="gc-leave">Leave</button>
   </div>
   <div id="gc-menu" class="gc-menu">
    <p class="gc-lede">Pilot a helicopter with a <b>gemstone turret</b>. Blast gemstone zombies, beat bosses, buy upgrades, clear all <b>10 maps</b>!</p>
    <div class="gc-map-grid" id="gc-map-grid"></div>
    <p class="gc-hint">WASD / arrows fly in 4 directions · mouse aim · click or Space fire · Esc quit</p>
   </div>
   <div id="gc-play" hidden>
    <div class="gc-play-frame">
    <canvas id="gc-canvas" width="${GC_W}" height="${GC_H}"></canvas>
    <div class="gc-hud gc-hud-float">
     <span id="gc-hp">HP 100</span>
     <span id="gc-gems">💎 0</span>
     <span id="gc-wave">Wave 1</span>
     <span id="gc-kills">Kills 0</span>
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
 document.getElementById('gc-leave').onclick=()=>gcClose();
 const grid=document.getElementById('gc-map-grid');
 const progress=+(localStorage.getItem('lithos_gc_map')||'1');
 grid.innerHTML=GC_MAPS.map(m=>{
  const locked=m.id>progress;
  return `<button type="button" class="gc-map${locked?' locked':''}" data-map="${m.id}" ${locked?'disabled':''}>
   <b>${m.id}. ${m.name}</b>
   <span>${locked?'🔒 Clear previous map':'Boss: '+m.boss}</span>
  </button>`;
 }).join('');
 grid.onclick=e=>{
  const b=e.target.closest('[data-map]');
  if(!b||b.disabled)return;
  gcStartMap(+b.dataset.map);
 };
 window.addEventListener('keydown',gcKeyDown);
 window.addEventListener('keyup',gcKeyUp);
 window.addEventListener('resize',gcOnResize);
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 try{if(typeof lithos8bitSync==='function')lithos8bitSync();}catch(_){}
}

function gcStartMap(mapId, carry){
 const map=GC_MAPS.find(m=>m.id===mapId)||GC_MAPS[0];
 const upgrades=carry&&carry.upgrades?carry.upgrades:gcDefaultUpgrades();
 gcApplyUpgrades(upgrades);
 const gems=carry&&typeof carry.gems==='number'?carry.gems:0;
 document.getElementById('gc-menu').hidden=true;
 document.getElementById('gc-shop').hidden=true;
 document.getElementById('gc-overlay').hidden=true;
 document.getElementById('gc-play').hidden=false;
 gcEnterPlayMode();
 document.getElementById('gc-mapname').textContent=`Map ${map.id}: ${map.name}`;
 gcState={
  map, upgrades, gems,
  x:GC_W*0.5, y:GC_H*0.38, vx:0, vy:0,
  hp:upgrades.maxHp, maxHp:upgrades.maxHp,
  fireT:0, wave:1, waveT:0, spawnLeft:0, spawnGap:0,
  kills:0, boss:null, bossSpawned:false, cleared:false, over:false,
  zombies:[], bullets:[], particles:[], pickups:[],
  rotor:0, shake:0
 };
 gcBindCanvas();
 let last=performance.now();
 function loop(t){
  if(!gcState||gcState.over)return;
  const dt=Math.min(0.05,(t-last)/1000); last=t;
  gcUpdate(dt);
  gcDraw();
  gcRaf=requestAnimationFrame(loop);
 }
 if(gcRaf)cancelAnimationFrame(gcRaf);
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
 cv.onpointerdown=e=>{toLocal(e);gcPointer.down=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}};
 cv.onpointerup=()=>{gcPointer.down=false;};
 cv.onpointerleave=()=>{gcPointer.down=false;};
 const fire=document.getElementById('gc-fire');
 if(fire){
  fire.onpointerdown=e=>{e.preventDefault();gcPointer.down=true;};
  fire.onpointerup=()=>{gcPointer.down=false;};
 }
}

function gcSpawnZombie(elite){
 const s=gcState;
 const gy=gcGroundY();
 const fromLeft=Math.random()<0.5;
 const x=fromLeft?-28:GC_W+28;
 const hp=(elite?70:28)+s.map.id*8+s.wave*4;
 s.zombies.push({
  x,y:gy,gy,hp,maxHp:hp,elite:!!elite,
  speed:(elite?70:92)+Math.random()*28+s.map.id*3,
  r:elite?20:14, hurt:0, t:Math.random()*6
 });
}

function gcSpawnBoss(){
 const s=gcState, m=s.map;
 const gy=gcGroundY();
 s.boss={
  name:m.boss, x:GC_W/2, y:gy, gy,
  hp:420+m.id*160, maxHp:420+m.id*160,
  r:36+m.id*1.2, t:0, phase:0, shootT:2, hurt:0
 };
 s.bossSpawned=true;
}

function gcStartWave(){
 const s=gcState;
 s.spawnLeft=16+s.wave*6+s.map.id*4;
 s.spawnGap=0.22;
 s.waveT=0;
 if(s.wave===s.map.waves) gcSpawnBoss();
}

function gcFire(){
 const s=gcState, u=s.upgrades;
 if(s.fireT>0)return;
 s.fireT=u.cooldown;
 const ang=Math.atan2(gcPointer.y-s.y, gcPointer.x-s.x);
 const shots=[{ang}];
 for(let i=1;i<=u.spread;i++){
  shots.push({ang:ang-0.14*i});
  shots.push({ang:ang+0.14*i});
 }
 shots.forEach(sh=>{
  s.bullets.push({
   x:s.x, y:s.y-8,
   vx:Math.cos(sh.ang)*520, vy:Math.sin(sh.ang)*520,
   life:1.2, dmg:u.damage, r:4
  });
 });
}

function gcUpdate(dt){
 const s=gcState; if(!s||s.over)return;
 s.rotor+=dt*28;
 if(s.shake>0)s.shake=Math.max(0,s.shake-dt*8);
 s.fireT=Math.max(0,s.fireT-dt);

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

 // waves
 if(!s.bossSpawned && s.spawnLeft<=0 && s.zombies.length===0){
  if(s.wave<s.map.waves){
   s.wave++;
   gcStartWave();
  }
 }
 const maxZ=24+s.wave*3+s.map.id*3;
 if(s.spawnLeft>0&&s.zombies.length<maxZ){
  s.spawnGap-=dt;
  if(s.spawnGap<=0){
   gcSpawnZombie(s.spawnLeft%7===0);
   s.spawnLeft--;
   s.spawnGap=Math.max(0.08,0.42-s.wave*0.025);
  }
 }
 if(s.wave===1&&s.spawnLeft===0&&s.zombies.length===0&&!s.bossSpawned&&s.waveT===0){
  gcStartWave();
 }

 // zombies (ground only — shuffle toward your shadow)
 s.zombies.forEach(z=>{
  z.t+=dt; z.hurt=Math.max(0,z.hurt-dt);
  const gy=z.gy!=null?z.gy:gcGroundY();
  const dir=s.x>z.x?1:-1;
  z.x+=dir*z.speed*dt;
  z.y=gy+Math.sin(z.t*5)*2.5;
  const hDist=Math.abs(s.x-z.x);
  const vGap=s.y-gy;
  if(hDist<z.r+20&&vGap>-20&&vGap<110){
   s.hp-=(z.elite?18:10)*dt;
   s.shake=3;
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
  s.zombies.forEach(z=>{
   if(bu.life<=0)return;
   if(Math.hypot(bu.x-z.x,bu.y-z.y)<z.r+bu.r){
    z.hp-=bu.dmg; z.hurt=0.15; bu.life=0;
    gcSpark(bu.x,bu.y,s.map.accent);
   }
  });
  if(s.boss&&bu.life>0&&Math.hypot(bu.x-s.boss.x,bu.y-s.boss.y)<s.boss.r+bu.r){
   s.boss.hp-=bu.dmg; s.boss.hurt=0.12; bu.life=0;
   gcSpark(bu.x,bu.y,s.map.accent);
  }
 });
 s.bullets=s.bullets.filter(bu=>bu.life>0&&bu.x>-40&&bu.x<GC_W+40&&bu.y>-40&&bu.y<GC_H+40);

 // deaths / pickups
 s.zombies=s.zombies.filter(z=>{
  if(z.hp>0)return true;
  s.kills++;
  const pay=z.elite?12:5;
  s.pickups.push({x:z.x,y:z.y,v:pay,life:8});
  gcSpark(z.x,z.y,s.map.accent);
  return false;
 });
 if(s.boss&&s.boss.hp<=0){
  s.gems+=80+s.map.id*15;
  gcSpark(s.boss.x,s.boss.y,s.map.accent);
  for(let i=0;i<18;i++)gcSpark(s.boss.x+(Math.random()-0.5)*60,s.boss.y+(Math.random()-0.5)*60,s.map.accent);
  s.boss=null;
  s.cleared=true;
  s.over=true;
  const unlocked=Math.max(+(localStorage.getItem('lithos_gc_map')||'1'), s.map.id+1);
  localStorage.setItem('lithos_gc_map', String(Math.min(10,unlocked)));
  setTimeout(()=>gcShowVictory(),200);
 }

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
 s.particles=s.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;return p.life>0;});

 if(s.hp<=0){
  s.hp=0; s.over=true;
  setTimeout(()=>gcShowDefeat(),150);
 }
 gcHud();
}

function gcSpark(x,y,color){
 if(!gcState)return;
 for(let i=0;i<6;i++){
  const a=Math.random()*Math.PI*2;
  gcState.particles.push({x,y,vx:Math.cos(a)*(40+Math.random()*80),vy:Math.sin(a)*(40+Math.random()*80),life:0.35+Math.random()*0.25,color});
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
}

function gcDraw(){
 const s=gcState; if(!s)return;
 const cv=document.getElementById('gc-canvas'); if(!cv)return;
 const ctx=cv.getContext('2d');
 const m=s.map;
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

 // pickups
 s.pickups.forEach(p=>{
  ctx.fillStyle='#c9a94f';
  ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill();
 });

 // zombies
 s.zombies.forEach(z=>{
  ctx.save();
  ctx.translate(z.x,z.y);
  ctx.rotate(Math.sin(z.t*6)*0.08);
  ctx.fillStyle=z.hurt>0?'#fff':(z.elite?m.accent:'#6a8a6a');
  ctx.beginPath(); ctx.arc(0,0,z.r,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#1a2018';
  ctx.fillRect(-5,-2,3,3); ctx.fillRect(2,-2,3,3);
  // gem crack
  ctx.strokeStyle=m.accent; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-4,4); ctx.lineTo(0,8); ctx.lineTo(5,3); ctx.stroke();
  // hp
  ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(-z.r, -z.r-8, z.r*2, 4);
  ctx.fillStyle='#3ecf8a'; ctx.fillRect(-z.r, -z.r-8, z.r*2*(z.hp/z.maxHp), 4);
  ctx.restore();
 });

 // boss
 if(s.boss){
  const b=s.boss;
  ctx.save(); ctx.translate(b.x,b.y);
  ctx.fillStyle=b.hurt>0?'#fff':m.accent;
  ctx.beginPath();
  for(let i=0;i<8;i++){
   const a=(Math.PI*2*i)/8, r=b.r*(i%2?0.72:1);
   const px=Math.cos(a)*r, py=Math.sin(a)*r;
   if(i===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle='#0a0b0f'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
  ctx.fillText(b.name,0,-b.r-14);
  ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(-60,b.r+8,120,8);
  ctx.fillStyle='#ff4060'; ctx.fillRect(-60,b.r+8,120*(b.hp/b.maxHp),8);
  ctx.restore();
 }

 // bullets
 s.bullets.forEach(bu=>{
  ctx.fillStyle=bu.enemy?'#ff6080':m.accent;
  ctx.beginPath(); ctx.arc(bu.x,bu.y,bu.r,0,Math.PI*2); ctx.fill();
 });

 // particles
 s.particles.forEach(p=>{
  ctx.globalAlpha=Math.max(0,p.life*2);
  ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,3,3);
  ctx.globalAlpha=1;
 });

 // helicopter
 ctx.save();
 ctx.translate(s.x,s.y);
 const tilt=(gcPointer.x-s.x)*0.0015;
 ctx.rotate(Math.max(-0.35,Math.min(0.35,tilt)));
 // rotor
 ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=3;
 ctx.beginPath(); ctx.moveTo(Math.cos(s.rotor)*28, -22+Math.sin(s.rotor)*3); ctx.lineTo(Math.cos(s.rotor+Math.PI)*28,-22+Math.sin(s.rotor+Math.PI)*3); ctx.stroke();
 ctx.beginPath(); ctx.moveTo(Math.cos(s.rotor+1.2)*22,-22); ctx.lineTo(Math.cos(s.rotor+1.2+Math.PI)*22,-22); ctx.stroke();
 // body
 ctx.fillStyle='#c9a94f';
 ctx.beginPath(); ctx.ellipse(0,0,18,10,0,0,Math.PI*2); ctx.fill();
 ctx.fillStyle='#1a1520'; ctx.beginPath(); ctx.ellipse(4,-2,7,5,0,0,Math.PI*2); ctx.fill();
 // tail
 ctx.fillStyle='#a89040'; ctx.fillRect(-28,-2,14,4);
 // turret
 const ang=Math.atan2(gcPointer.y-s.y,gcPointer.x-s.x);
 ctx.rotate(ang);
 ctx.fillStyle=m.accent; ctx.fillRect(8,-3,16,6);
 ctx.beginPath(); ctx.arc(8,0,6,0,Math.PI*2); ctx.fill();
 ctx.restore();

 // aim laser
 ctx.strokeStyle=m.accent; ctx.globalAlpha=0.25; ctx.setLineDash([6,6]);
 ctx.beginPath(); ctx.moveTo(s.x,s.y-8); ctx.lineTo(gcPointer.x,gcPointer.y); ctx.stroke();
 ctx.setLineDash([]); ctx.globalAlpha=1;
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
 document.getElementById('gc-retry').onclick=()=>gcStartMap(gcState.map.id,{upgrades:gcState.upgrades,gems:gcState.gems});
 document.getElementById('gc-menu-btn').onclick=()=>{gcClose();playGemCopter();};
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
   <div class="gc-up-grid" id="gc-up-grid"></div>
   <div class="gc-shop-actions">
    ${next?`<button type="button" class="gc-btn" id="gc-next">Next Map → ${GC_MAPS[next-1].name}</button>`:`<button type="button" class="gc-btn" id="gc-winall">You beat all 10 maps! 🎉</button>`}
    <button type="button" class="gc-btn ghost" id="gc-shop-leave">Leave</button>
   </div>
  </div>`;
 gcRenderShop();
 const nextBtn=document.getElementById('gc-next');
 if(nextBtn) nextBtn.onclick=()=>gcStartMap(next,{upgrades:s.upgrades,gems:s.gems});
 const winall=document.getElementById('gc-winall');
 if(winall) winall.onclick=()=>{gcClose();playGemCopter();};
 document.getElementById('gc-shop-leave').onclick=()=>gcClose();
}

function gcRenderShop(){
 const s=gcState; if(!s)return;
 const grid=document.getElementById('gc-up-grid');
 const gemEl=document.getElementById('gc-shop-gems');
 if(gemEl)gemEl.textContent=s.gems;
 grid.innerHTML=GC_UPGRADES.map(up=>{
  const lvl=s.upgrades.levels[up.id]||0;
  const maxed=lvl>=up.max;
  const cost=up.cost+lvl*15;
  const can=s.gems>=cost&&!maxed;
  return `<button type="button" class="gc-up${maxed?' maxed':''}" data-up="${up.id}" ${can?'':'disabled'}>
   <b>${up.name}</b>
   <span>${up.desc}</span>
   <span class="gc-up-meta">${maxed?'MAX':`Lv ${lvl}/${up.max} · 💎 ${cost}`}</span>
  </button>`;
 }).join('');
 grid.onclick=e=>{
  const b=e.target.closest('[data-up]'); if(!b||b.disabled)return;
  const up=GC_UPGRADES.find(u=>u.id===b.dataset.up); if(!up)return;
  const lvl=s.upgrades.levels[up.id]||0;
  if(lvl>=up.max)return;
  const cost=up.cost+lvl*15;
  if(s.gems<cost)return;
  s.gems-=cost;
  s.upgrades.levels[up.id]=lvl+1;
  gcApplyUpgrades(s.upgrades);
  s.maxHp=s.upgrades.maxHp;
  gcRenderShop();
 };
}

window.playGemCopter=playGemCopter;
window.gcClose=gcClose;
})();
