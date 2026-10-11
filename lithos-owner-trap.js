/* Lithos fake-owner prank — cache-bust with ?v=deploy-NN */
(function(){
'use strict';
const LITHOS_OWNER_TRAP_BUILD=55;
const LITHOS_OWNER_BAIT_KEY='lithos_owner_bait_done';
let lithosOwnerTrapActive=false;
let lithosOwnerTrapTimers=[];
let lithosOwnerTrapIntervals=[];
let lithosOwnerTrapScareIv=null;
let lithosOwnerTrapFsHandler=null;
let lithosOwnerTrapHorror=null;
let lithosOwnerTrapTitleIv=null;
let lithosOwnerTrapOrigTitle='';
let lithosOwnerTrapUnlockEl=null;

const lithosOwnerTrapHorrorSfx=(()=>{
 let ctx=null,master=null,nodes=[];
 function boot(){
  if(ctx)return ctx;
  try{
   ctx=new(window.AudioContext||window.webkitAudioContext)();
   master=ctx.createGain();
   master.gain.value=1;
   master.connect(ctx.destination);
  }catch(_){}
  return ctx;
 }
 function resumeSync(){
  const c=boot();if(!c)return;
  try{if(c.state==='suspended')c.resume();}catch(_){}
 }
 function stop(){
  nodes.forEach(n=>{try{if(n.stop)n.stop(0);}catch(_){} try{n.disconnect();}catch(_){}});
  nodes=[];
 }
 function tone(type,freq,dur,vol,slide){
  const c=boot();if(!c||!master)return;
  const t=c.currentTime,o=c.createOscillator(),g=c.createGain();
  o.type=type||'sawtooth';
  o.frequency.setValueAtTime(freq,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t+dur);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002,vol||0.2),t+0.015);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(master);
  o.start(t);o.stop(t+dur+0.05);
  nodes.push(o,g);
 }
 function noise(dur,vol,hp,lp){
  const c=boot();if(!c||!master)return;
  const t=c.currentTime,len=Math.max(1,Math.floor(c.sampleRate*dur));
  const buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const src=c.createBufferSource();src.buffer=buf;
  const g=c.createGain(),hpF=c.createBiquadFilter(),lpF=c.createBiquadFilter();
  hpF.type='highpass';hpF.frequency.value=hp||80;
  lpF.type='lowpass';lpF.frequency.value=lp||9000;
  g.gain.setValueAtTime(vol||0.16,t);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  src.connect(hpF);hpF.connect(lpF);lpF.connect(g);g.connect(master);
  src.start(t);src.stop(t+dur+0.02);
  nodes.push(src,g,hpF,lpF);
 }
 return{
  resume:resumeSync,stop,
  htmlUnlock(){
   try{
    if(!lithosOwnerTrapUnlockEl){
     lithosOwnerTrapUnlockEl=new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
     lithosOwnerTrapUnlockEl.volume=0.02;
    }
    const p=lithosOwnerTrapUnlockEl.play();
    if(p&&p.catch)p.catch(()=>{});
   }catch(_){}
  },
  startDrone(){
   resumeSync();stop();
   const c=boot();if(!c||!master)return;
   const t=c.currentTime;
   [[32,'sawtooth',0.28],[37,'square',0.2],[49,'sine',0.14],[63,'sawtooth',0.1]].forEach(([f,type,v])=>{
    const o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.value=f;
    g.gain.value=v;
    o.connect(g);g.connect(master);
    o.start(t);
    nodes.push(o,g);
   });
  },
  stinger(phase){
   resumeSync();
   const p=Math.min(1,Math.max(0,phase||0));
   tone('sawtooth',70+p*50,0.4,0.18+p*0.1,28);
   tone('square',200+p*80,0.14,0.12+p*0.06);
   noise(0.3+p*0.2,0.14+p*0.14,60,8000);
   try{if(typeof SFX!=='undefined'&&SFX.heartbeat)SFX.heartbeat();}catch(_){}
  },
  whisper(){
   resumeSync();
   noise(0.55,0.12,300,2400);
   tone('sawtooth',180,0.25,0.1,70);
   try{if(typeof SFX!=='undefined'&&SFX.talk)SFX.talk('foxy');}catch(_){}
  },
  burst(){
   resumeSync();
   tone('square',440,0.06,0.25);
   noise(0.15,0.2,200,7000);
  },
  scream(){
   resumeSync();stop();
   noise(0.9,0.38,40,11000);
   tone('sawtooth',120,0.25,0.32,35);
   tone('square',920,0.1,0.28);
   tone('sawtooth',48,0.75,0.3,20);
   setTimeout(()=>noise(0.6,0.32,70,5500),50);
   setTimeout(()=>tone('square',1400,0.08,0.24),80);
   try{
    if(typeof SFX!=='undefined'&&SFX.poke)SFX.poke();
    if(typeof SFX!=='undefined'&&SFX.jumpscare)SFX.jumpscare('golden');
    if(typeof SFX!=='undefined'&&SFX.jumpscare)setTimeout(()=>SFX.jumpscare('freddy'),100);
    if(typeof SFX!=='undefined'&&SFX.jumpscare)setTimeout(()=>SFX.jumpscare('chica'),220);
    if(typeof SFX!=='undefined'&&SFX.lose)setTimeout(()=>SFX.lose(),180);
    if(typeof SFX!=='undefined'&&SFX.boss)setTimeout(()=>SFX.boss(),300);
   }catch(_){}
  }
 };
})();

function lithosOwnerBaitForce(){
 try{
  if(new URLSearchParams(location.search).get('ownerbait')==='1')return true;
  if(new URLSearchParams(location.search).get('scare')==='1')return true;
  const h=(location.hash||'').replace(/^#/,'').toLowerCase();
  if(h==='ownerbait'||h==='previewownertrap'||h==='scare')return true;
 }catch(_){}
 return false;
}
function lithosOwnerBaitResetSession(){
 try{sessionStorage.removeItem(LITHOS_OWNER_BAIT_KEY);}catch(_){}
}
function lithosOwnerBaitEligible(){
 if(window.LITHOS_STRATUM)return false;
 const force=lithosOwnerBaitForce();
 if(force)lithosOwnerBaitResetSession();
 if(!force){
  try{if(sessionStorage.getItem(LITHOS_OWNER_BAIT_KEY)==='1')return false;}catch(_){}
 }
 return true;
}
function lithosOwnerTrapClearTimers(){
 lithosOwnerTrapTimers.forEach(t=>clearTimeout(t));
 lithosOwnerTrapTimers=[];
 lithosOwnerTrapIntervals.forEach(t=>clearInterval(t));
 lithosOwnerTrapIntervals=[];
 if(lithosOwnerTrapScareIv){clearInterval(lithosOwnerTrapScareIv);lithosOwnerTrapScareIv=null;}
 if(lithosOwnerTrapTitleIv){clearInterval(lithosOwnerTrapTitleIv);lithosOwnerTrapTitleIv=null;}
 if(lithosOwnerTrapOrigTitle)document.title=lithosOwnerTrapOrigTitle;
 if(lithosOwnerTrapFsHandler){
  document.removeEventListener('fullscreenchange',lithosOwnerTrapFsHandler);
  document.removeEventListener('webkitfullscreenchange',lithosOwnerTrapFsHandler);
  lithosOwnerTrapFsHandler=null;
 }
 try{lithosOwnerTrapHorrorSfx.stop();}catch(_){}
 lithosOwnerTrapHorror=null;
}
function lithosOwnerTrapStaticLoop(){
 const cv=document.getElementById('lithos-trap-static-cv');
 if(!cv||!lithosOwnerTrapActive)return;
 const x=cv.getContext('2d');
 if(!x)return;
 const w=cv.width=cv.clientWidth||window.innerWidth;
 const h=cv.height=cv.clientHeight||window.innerHeight;
 const img=x.createImageData(Math.min(w,480),Math.min(h,320));
 const d=img.data;
 for(let i=0;i<d.length;i+=4){
  const v=Math.random()*255|0;
  d[i]=d[i+1]=d[i+2]=v;
  d[i+3]=55+Math.random()*80|0;
 }
 x.clearRect(0,0,w,h);
 x.putImageData(img,0,0);
 if(lithosOwnerTrapActive)requestAnimationFrame(lithosOwnerTrapStaticLoop);
}
function lithosOwnerTrapFlash(){
 const el=document.getElementById('lithos-trap-flash');
 if(!el)return;
 el.classList.remove('on');
 void el.offsetWidth;
 el.classList.add('on');
}
function lithosOwnerTrapShowFace(bot){
 const face=document.getElementById('lithos-trap-face');
 if(!face)return;
 let art='';
 try{if(typeof nsBotSVG==='function')art=nsBotSVG(bot||'golden',520);}catch(_){}
 face.innerHTML=art?`<div class="ns-jumpscare-art pose-jumpscare">${art}</div>`:'';
 face.classList.remove('show');
 void face.offsetWidth;
 face.classList.add('show');
}
function lithosOwnerTrapBuildShell(trap){
 const bots=['golden','freddy','foxy','chica'];
 trap.innerHTML=`
  <div class="lithos-trap-vignette"></div>
  <div class="lithos-trap-face" id="lithos-trap-face"></div>
  <canvas class="lithos-trap-static" id="lithos-trap-static-cv" aria-hidden="true"></canvas>
  <div class="lithos-trap-flash" id="lithos-trap-flash"></div>
  <p class="lithos-trap-build-badge">HORROR TRAP v${LITHOS_OWNER_TRAP_BUILD}</p>
  <div class="lithos-trap-core">
   <p class="lithos-trap-count" id="lithos-trap-count">5</p>
   <p class="lithos-owner-trap-msg" id="lithos-owner-trap-msg">OWNER LOCK ENGAGED</p>
   <p class="lithos-owner-trap-sub" id="lithos-owner-trap-sub">You cannot leave. Something is already inside your screen.</p>
  </div>`;
 lithosOwnerTrapHorror={phase:0.25,bots,faceI:0};
 requestAnimationFrame(lithosOwnerTrapStaticLoop);
}
function lithosOwnerTrapEnterFs(el){
 if(!el)return;
 document.documentElement.classList.add('lithos-trap-fs-wanted');
 const req=el.requestFullscreen||el.webkitRequestFullscreen||el.msRequestFullscreen;
 if(!req)return;
 try{const p=req.call(el);if(p&&p.catch)p.catch(()=>{});}catch(_){}
}
function lithosOwnerTrapExitFs(){
 document.documentElement.classList.remove('lithos-trap-fs-wanted');
 try{
  if(document.fullscreenElement||document.webkitFullscreenElement){
   const exit=document.exitFullscreen||document.webkitExitFullscreen||document.msExitFullscreen;
   if(exit){const p=exit.call(document);if(p&&p.catch)p.catch(()=>{});}
  }
 }catch(_){}
 document.body.classList.remove('lithos-owner-trap-active');
}
function lithosOwnerTrapTitleTerror(){
 lithosOwnerTrapOrigTitle=document.title||'Lithos';
 let flip=false;
 lithosOwnerTrapTitleIv=setInterval(()=>{
  flip=!flip;
  document.title=flip?'⛔ GET OUT ⛔':lithosOwnerTrapOrigTitle;
 },350);
}
function lithosOwnerTrapScareAudio(){
 if(!lithosOwnerTrapHorror)lithosOwnerTrapHorror={phase:0.25,bots:['golden'],faceI:0};
 lithosOwnerTrapHorror.phase=Math.min(1,lithosOwnerTrapHorror.phase+0.09);
 lithosOwnerTrapHorrorSfx.stinger(lithosOwnerTrapHorror.phase);
 if(lithosOwnerTrapHorror.phase>0.3&&Math.random()<0.55)lithosOwnerTrapHorrorSfx.whisper();
 lithosOwnerTrapFlash();
 try{if(navigator.vibrate)navigator.vibrate([100,50,140]);}catch(_){}
}
function lithosOwnerTrapEnd(){
 if(!lithosOwnerTrapActive)return;
 lithosOwnerTrapActive=false;
 lithosOwnerTrapClearTimers();
 lithosOwnerTrapExitFs();
 const trap=document.getElementById('lithos-owner-trap');
 if(trap)trap.remove();
 const bait=document.getElementById('lithos-owner-bait');
 if(bait)bait.remove();
 try{sessionStorage.setItem(LITHOS_OWNER_BAIT_KEY,'1');}catch(_){}
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 const toast=document.createElement('div');
 toast.className='lithos-trap-toast';
 toast.textContent=`You escaped. (Trap v${LITHOS_OWNER_TRAP_BUILD} — real owner code is still in Secret Codes.)`;
 document.body.appendChild(toast);
 lithosOwnerTrapTimers.push(setTimeout(()=>toast.remove(),4500));
}
function lithosOwnerTrapJumpscare(){
 const trap=document.getElementById('lithos-owner-trap');
 if(trap){
  trap.classList.add('lithos-trap-intense');
  trap.innerHTML='';
  const scare=document.createElement('div');
  scare.className='pp-jumpscare lithos-trap-scare';
  scare.style.cssText='position:fixed;inset:0;z-index:10055;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;';
  let art='';
  try{if(typeof nsBotSVG==='function')art=nsBotSVG('golden',560);}catch(_){}
  scare.innerHTML=`${art?`<div class="ns-jumpscare-art pose-jumpscare">${art}</div>`:''}<p class="lithos-trap-scare-title">NOT THE OWNER</p><p style="color:#ff8090;font-size:1.1rem;margin:0;font-weight:700">GET OUT</p>`;
  trap.appendChild(scare);
 }
 lithosOwnerTrapHorrorSfx.scream();
 try{if(navigator.vibrate)navigator.vibrate([300,120,300,120,500]);}catch(_){}
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  lithosOwnerTrapJumpscareFlash();
 },650));
 lithosOwnerTrapTimers.push(setTimeout(lithosOwnerTrapEnd,1800));
}
function lithosOwnerTrapJumpscareFlash(){
 lithosOwnerTrapFlash();
 try{if(typeof nsBotSVG==='function'){
  const trap=document.getElementById('lithos-owner-trap');
  if(trap){
   const art=nsBotSVG('freddy',480);
   trap.innerHTML=`<div class="pp-jumpscare lithos-trap-scare" style="position:fixed;inset:0;z-index:10056;display:flex;align-items:center;justify-content:center;background:#fff"><div class="ns-jumpscare-art pose-jumpscare">${art}</div></div>`;
  }
  lithosOwnerTrapHorrorSfx.burst();
 }}catch(_){}
}
function lithosStartOwnerTrap(){
 const bait=document.getElementById('lithos-owner-bait');
 if(bait)bait.remove();
 if(lithosOwnerTrapActive)return;
 lithosOwnerTrapActive=true;
 lithosOwnerTrapClearTimers();
 lithosOwnerTrapHorrorSfx.htmlUnlock();
 lithosOwnerTrapHorrorSfx.resume();
 lithosOwnerTrapHorrorSfx.burst();
 try{if(typeof SFX!=='undefined'&&SFX.poke)SFX.poke();}catch(_){}
 let trap=document.getElementById('lithos-owner-trap');
 if(!trap){
  trap=document.createElement('div');
  trap.id='lithos-owner-trap';
  trap.className='lithos-owner-trap lithos-trap-intense';
  trap.setAttribute('role','alertdialog');
  trap.setAttribute('aria-modal','true');
  document.body.appendChild(trap);
 }
 lithosOwnerTrapBuildShell(trap);
 document.body.classList.add('lithos-owner-trap-active');
 lithosOwnerTrapTitleTerror();
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 lithosOwnerTrapHorrorSfx.startDrone();
 lithosOwnerTrapEnterFs(trap);
 lithosOwnerTrapShowFace('freddy');
 lithosOwnerTrapScareAudio();
 lithosOwnerTrapScareIv=setInterval(lithosOwnerTrapScareAudio,580);
 let fsRetries=0;
 lithosOwnerTrapFsHandler=()=>{
  if(!lithosOwnerTrapActive)return;
  if(document.fullscreenElement||document.webkitFullscreenElement)return;
  fsRetries++;
  if(fsRetries<20)lithosOwnerTrapTimers.push(setTimeout(()=>lithosOwnerTrapEnterFs(trap),60));
 };
 document.addEventListener('fullscreenchange',lithosOwnerTrapFsHandler);
 document.addEventListener('webkitfullscreenchange',lithosOwnerTrapFsHandler);
 const msgs=['OWNER LOCK ENGAGED','WE SEE YOU','WRONG CROWN','DO NOT RUN','IT IS BEHIND YOU','STAY IN YOUR SEAT','YOU ARE NOT THE OWNER'];
 let mi=0,count=5;
 lithosOwnerTrapIntervals.push(setInterval(()=>{
  mi=(mi+1)%msgs.length;
  const el=document.getElementById('lithos-owner-trap-msg');
  if(el)el.textContent=msgs[mi];
  if(lithosOwnerTrapHorror&&lithosOwnerTrapHorror.bots){
   lithosOwnerTrapShowFace(lithosOwnerTrapHorror.bots[lithosOwnerTrapHorror.faceI%lithosOwnerTrapHorror.bots.length]);
   lithosOwnerTrapHorror.faceI++;
  }
  trap.classList.toggle('lithos-trap-intense');
 },850));
 lithosOwnerTrapIntervals.push(setInterval(()=>{
  count=Math.max(0,count-1);
  const cEl=document.getElementById('lithos-trap-count');
  if(cEl)cEl.textContent=count?String(count):'NOW';
  if(count<=1)lithosOwnerTrapHorrorSfx.whisper();
 },1400));
 lithosOwnerTrapTimers.push(setTimeout(lithosOwnerTrapJumpscare,7500));
}
function lithosShowOwnerBait(manual){
 if(!manual&&!lithosOwnerBaitEligible())return;
 if(document.getElementById('lithos-owner-bait')||document.getElementById('lithos-owner-trap'))return;
 const wrap=document.createElement('div');
 wrap.id='lithos-owner-bait';
 wrap.className='lithos-owner-bait';
 wrap.innerHTML=`<div class="lithos-owner-bait-card lithos-owner-bait-creepy">
  <div class="crown">👑</div>
  <p class="lithos-trap-build-badge" style="position:static;margin-bottom:8px">TRAP v${LITHOS_OWNER_TRAP_BUILD}</p>
  <h2>Become the Lithos owner</h2>
  <p>Click below for a <b>free instant owner upgrade</b> — every game, Owner TV, all secrets.</p>
  <button type="button" class="lithos-owner-bait-go" id="lithos-owner-bait-go">Become the Owner</button>
  <button type="button" class="lithos-owner-bait-dismiss" id="lithos-owner-bait-no">No thanks</button>
 </div>`;
 document.body.appendChild(wrap);
 wrap.querySelector('#lithos-owner-bait-go')?.addEventListener('click',e=>{
  e.preventDefault();
  lithosStartOwnerTrap();
 });
 wrap.querySelector('#lithos-owner-bait-no')?.addEventListener('click',e=>{
  e.preventDefault();
  wrap.remove();
  try{sessionStorage.setItem(LITHOS_OWNER_BAIT_KEY,'1');}catch(_){}
 });
}
function maybeShowOwnerBait(){
 if(lithosOwnerBaitForce()){
  lithosOwnerTrapTimers.push(setTimeout(lithosStartOwnerTrap,450));
  return;
 }
 if(!lithosOwnerBaitEligible())return;
 lithosOwnerTrapTimers.push(setTimeout(()=>lithosShowOwnerBait(false),800));
}

window.LITHOS_OWNER_TRAP_BUILD=LITHOS_OWNER_TRAP_BUILD;
window.lithosStartOwnerTrap=lithosStartOwnerTrap;
window.lithosPreviewOwnerTrap=lithosStartOwnerTrap;
window.lithosShowOwnerBaitModal=()=>lithosShowOwnerBait(true);
window.maybeShowOwnerBait=maybeShowOwnerBait;
})();
