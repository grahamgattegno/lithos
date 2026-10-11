/* Lithos fake-owner prank — cache-bust with ?v=deploy-NN */
(function(){
'use strict';
const LITHOS_OWNER_TRAP_BUILD=64;
if(window.__LITHOS_TRAP_JS_BUILD&&window.__LITHOS_TRAP_JS_BUILD!==LITHOS_OWNER_TRAP_BUILD){
 try{
  var u=new URL(location.href);
  u.searchParams.set('_trap',String(LITHOS_OWNER_TRAP_BUILD));
  u.searchParams.set('_',String(Date.now()));
  location.replace(u.pathname+u.search+(u.hash||''));
 }catch(_){}
}
window.__LITHOS_TRAP_JS_BUILD=LITHOS_OWNER_TRAP_BUILD;
const LITHOS_TRAP_FACE_FILES=[
 'images/trap/anomaly-glitch.svg',
 'images/trap/anomaly-stretch.svg',
 'images/trap/anomaly-smile.svg',
 'images/trap/anomaly-static.svg',
 'images/trap/anomaly-hall.svg'
];
function lithosTrapAssetSrc(file){
 try{
  if(typeof lithosBasePath==='function')return lithosBasePath()+file;
 }catch(_){}
 const path=location.pathname||'/';
 const base=path.replace(/\/[^/]*$/,'/');
 return (base.endsWith('/')?base:base+'/')+file;
}
function lithosTrapFaceSrc(i){
 const n=LITHOS_TRAP_FACE_FILES.length;
 return lithosTrapAssetSrc(LITHOS_TRAP_FACE_FILES[((i%n)+n)%n]);
}
function lithosTrapFaceMarkup(i){
 const src=lithosTrapFaceSrc(i);
 return `<img class="lithos-trap-face-img lithos-trap-anomaly-img" src="${src}" alt="" width="560" height="560" decoding="sync" draggable="false">`;
}
function lithosOwnerTrapHitLayer(){
 const trap=document.getElementById('lithos-owner-trap');
 if(!trap)return null;
 let layer=document.getElementById('lithos-trap-hit-layer');
 if(!layer){
  layer=document.createElement('div');
  layer.id='lithos-trap-hit-layer';
  trap.appendChild(layer);
 }
 return layer;
}
function lithosOwnerTrapClearHitLayer(){
 const layer=document.getElementById('lithos-trap-hit-layer');
 if(layer)layer.innerHTML='';
}
function lithosOwnerTrapShowRealAnomaly(i){
 const face=document.getElementById('lithos-trap-face');
 if(!face)return;
 face.innerHTML=lithosTrapFaceMarkup(i==null?0:i);
 face.classList.remove('show');
 void face.offsetWidth;
 face.classList.add('show');
}
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
let lithosOwnerTrapAudioMuted=false;

const lithosOwnerTrapHorrorSfx=(()=>{
 let ctx=null,master=null,nodes=[],noiseBed=null;
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
  if(noiseBed){try{noiseBed.stop();}catch(_){} noiseBed=null;}
 }
 function tone(type,freq,dur,vol,slide){
  if(lithosOwnerTrapAudioMuted)return;
  const c=boot();if(!c||!master)return;
  const t=c.currentTime,o=c.createOscillator(),g=c.createGain();
  o.type=type||'sawtooth';
  o.frequency.setValueAtTime(freq,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(18,slide),t+dur);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002,vol||0.24),t+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(master);
  o.start(t);o.stop(t+dur+0.05);
  nodes.push(o,g);
 }
 function noise(dur,vol,hp,lp){
  if(lithosOwnerTrapAudioMuted)return;
  const c=boot();if(!c||!master)return;
  const t=c.currentTime,len=Math.max(1,Math.floor(c.sampleRate*dur));
  const buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const src=c.createBufferSource();src.buffer=buf;
  const g=c.createGain(),hpF=c.createBiquadFilter(),lpF=c.createBiquadFilter();
  hpF.type='highpass';hpF.frequency.value=hp||60;
  lpF.type='lowpass';lpF.frequency.value=lp||10000;
  g.gain.setValueAtTime(vol||0.2,t);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  src.connect(hpF);hpF.connect(lpF);lpF.connect(g);g.connect(master);
  src.start(t);src.stop(t+dur+0.02);
  nodes.push(src,g,hpF,lpF);
 }
 function startNoiseBed(){
  if(lithosOwnerTrapAudioMuted)return;
  const c=boot();if(!c||!master||noiseBed)return;
  const t=c.currentTime,len=c.sampleRate*2;
  const buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  noiseBed=c.createBufferSource();
  noiseBed.buffer=buf;noiseBed.loop=true;
  const g=c.createGain(),hp=c.createBiquadFilter(),lp=c.createBiquadFilter();
  hp.type='highpass';hp.frequency.value=120;
  lp.type='lowpass';lp.frequency.value=3200;
  g.gain.value=0.06;
  noiseBed.connect(hp);hp.connect(lp);lp.connect(g);g.connect(master);
  noiseBed.start(t);
  nodes.push(noiseBed,g,hp,lp);
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
   startNoiseBed();
   const c=boot();if(!c||!master)return;
   const t=c.currentTime;
   [[24,'sawtooth',0.32],[28.5,'square',0.24],[39,'sine',0.18],[52,'sawtooth',0.14],[73,'square',0.1]].forEach(([f,type,v])=>{
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
   tone('sawtooth',55+p*70,0.45,0.22+p*0.12,24);
   tone('square',160+p*120,0.16,0.14+p*0.08);
   tone('triangle',400+p*200,0.08,0.1+p*0.06);
   noise(0.35+p*0.25,0.18+p*0.16,40,9000);
   try{if(typeof SFX!=='undefined'&&SFX.heartbeat)SFX.heartbeat();}catch(_){}
  },
  whisper(){
   resumeSync();
   noise(0.65,0.16,250,2600);
   tone('sawtooth',140,0.3,0.12,55);
   tone('sawtooth',90,0.35,0.1,40);
  },
  burst(){
   resumeSync();
   tone('square',520,0.08,0.32);
   noise(0.2,0.26,180,8000);
  },
  silence(){
   lithosOwnerTrapAudioMuted=true;
   stop();
  },
  unmute(){
   lithosOwnerTrapAudioMuted=false;
  },
  hit(n){
   resumeSync();
   noise(0.35,0.28,80,11000);
   tone('sawtooth',200-n*20,0.15,0.35,45);
   tone('square',800+n*100,0.06,0.3);
   tone('sawtooth',60+n*15,0.4,0.28,22);
  },
  scream(){
   resumeSync();stop();
   noise(1.1,0.42,30,12000);
   tone('sawtooth',100,0.3,0.38,30);
   tone('square',980,0.12,0.34);
   tone('sawtooth',42,0.85,0.34,18);
   setTimeout(()=>noise(0.75,0.36,50,6000),40);
   setTimeout(()=>tone('square',1600,0.1,0.28),70);
   setTimeout(()=>tone('sawtooth',70,0.5,0.3,25),120);
   setTimeout(()=>noise(0.4,0.3,50,8000),150);
   setTimeout(()=>tone('square',200,0.15,0.26),200);
  }
 };
})();

function lithosOwnerBaitForce(){
 try{
  if(new URLSearchParams(location.search).get('ownerbait')==='1')return true;
  if(new URLSearchParams(location.search).get('scare')==='1')return true;
  if(new URLSearchParams(location.search).get('trap')==='1')return true;
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
 lithosOwnerTrapAudioMuted=false;
 try{lithosOwnerTrapHorrorSfx.unmute();}catch(_){}
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
 const img=x.createImageData(Math.min(w,640),Math.min(h,400));
 const d=img.data;
 const red=Math.random()<0.35;
 for(let i=0;i<d.length;i+=4){
  const v=Math.random()*255|0;
  if(red){d[i]=255;d[i+1]=v>>2;d[i+2]=v>>3;}
  else{d[i]=d[i+1]=d[i+2]=v;}
  d[i+3]=70+Math.random()*120|0;
 }
 x.clearRect(0,0,w,h);
 x.putImageData(img,(w-img.width)/2|0,(h-img.height)/2|0);
 if(lithosOwnerTrapActive)requestAnimationFrame(lithosOwnerTrapStaticLoop);
}
function lithosOwnerTrapFlash(){
 const el=document.getElementById('lithos-trap-flash');
 if(!el)return;
 el.classList.remove('on');
 void el.offsetWidth;
 el.classList.add('on');
}
function lithosOwnerTrapGlitch(){
 const el=document.getElementById('lithos-trap-glitch');
 if(!el)return;
 el.classList.remove('on');
 void el.offsetWidth;
 el.classList.add('on');
}
function lithosOwnerTrapWhisper(text){
 const el=document.getElementById('lithos-trap-whisper');
 if(!el)return;
 el.textContent=text;
 el.classList.remove('on');
 void el.offsetWidth;
 el.classList.add('on');
}
function lithosOwnerTrapShowFace(faceIndex){
 lithosOwnerTrapShowRealAnomaly(faceIndex);
}
function lithosOwnerTrapBuildShell(trap){
 trap.innerHTML=`
  <div class="lithos-trap-vignette"></div>
  <div class="lithos-trap-blood"></div>
  <div class="lithos-trap-face" id="lithos-trap-face"></div>
  <canvas class="lithos-trap-static" id="lithos-trap-static-cv" aria-hidden="true"></canvas>
  <div class="lithos-trap-flash" id="lithos-trap-flash"></div>
  <div class="lithos-trap-glitch" id="lithos-trap-glitch"></div>
  <p class="lithos-trap-whisper" id="lithos-trap-whisper"></p>
  <p class="lithos-trap-build-badge">ANOMALY v${LITHOS_OWNER_TRAP_BUILD} · NO WEBCAM</p>
  <div class="lithos-trap-error">WARN: Non-catalog entity breach. Owner protocol failed. Anomaly is adapting to your screen.</div>
  <div class="lithos-trap-core">
   <p class="lithos-trap-count" id="lithos-trap-count">10</p>
   <p class="lithos-owner-trap-msg" id="lithos-owner-trap-msg">ANOMALY DETECTED</p>
   <p class="lithos-owner-trap-sub" id="lithos-owner-trap-sub">It does not belong in this universe. Do not maintain eye contact.</p>
  </div>`;
 lithosOwnerTrapHorror={phase:0.35,faceI:0,whisperI:0};
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
 const titles=['⛔ GET OUT ⛔','👁 IT SEES YOU','💀 NOT THE OWNER','🩸 RUN','⛔ GET OUT ⛔'];
 let i=0;
 lithosOwnerTrapTitleIv=setInterval(()=>{
  document.title=titles[i++%titles.length];
 },280);
}
const LITHOS_TRAP_WHISPERS=['ANOMALY IN THE ROOM','WRONG GEOMETRY','STOP LOOKING','BEHIND THE DOOR','NOT HUMAN','CONTAINMENT FAILED','SIGNAL BREACH','IT MOVED'];
function lithosOwnerTrapScareAudio(){
 if(!lithosOwnerTrapHorror)lithosOwnerTrapHorror={phase:0.35,faceI:0,whisperI:0};
 lithosOwnerTrapHorror.phase=Math.min(1,lithosOwnerTrapHorror.phase+0.1);
 lithosOwnerTrapHorrorSfx.stinger(lithosOwnerTrapHorror.phase);
 if(lithosOwnerTrapHorror.phase>0.25&&Math.random()<0.65)lithosOwnerTrapHorrorSfx.whisper();
 lithosOwnerTrapFlash();
 lithosOwnerTrapGlitch();
 const trap=document.getElementById('lithos-owner-trap');
 if(trap&&Math.random()<0.4)trap.classList.toggle('lithos-trap-invert');
 if(Math.random()<0.35){
  lithosOwnerTrapWhisper(LITHOS_TRAP_WHISPERS[lithosOwnerTrapHorror.whisperI++%LITHOS_TRAP_WHISPERS.length]);
 }
 if(Math.random()<0.5)lithosOwnerTrapShowRealAnomaly(lithosOwnerTrapHorror.faceI++);
 try{if(navigator.vibrate)navigator.vibrate([120,60,160,40,200]);}catch(_){}
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
 toast.textContent=`You survived trap v${LITHOS_OWNER_TRAP_BUILD}. (Go change your pants.) Real owner code: Secret Codes.`;
 document.body.appendChild(toast);
 lithosOwnerTrapTimers.push(setTimeout(()=>toast.remove(),5000));
}
function lithosOwnerTrapShowHit(faceIndex,bg,title){
 const trap=document.getElementById('lithos-owner-trap');
 const layer=lithosOwnerTrapHitLayer();
 if(!trap||!layer)return;
 trap.classList.add('lithos-trap-intense');
 trap.classList.remove('lithos-trap-invert');
 const visual=lithosTrapFaceMarkup(faceIndex);
 layer.style.cssText='position:absolute;inset:0;z-index:10055;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none';
 layer.innerHTML=`<div class="pp-jumpscare lithos-trap-scare" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${bg||'#000'}">
  ${visual}
  ${title?`<p class="lithos-trap-scare-title">${title}</p>`:''}
 </div>`;
 lithosOwnerTrapFlash();
}
function lithosOwnerTrapFinale(){
 if(lithosOwnerTrapScareIv){clearInterval(lithosOwnerTrapScareIv);lithosOwnerTrapScareIv=null;}
 lithosOwnerTrapHorrorSfx.silence();
 const trap=document.getElementById('lithos-owner-trap');
 const layer=lithosOwnerTrapHitLayer();
 if(trap){
  trap.classList.remove('lithos-trap-intense','lithos-trap-invert');
  const core=trap.querySelector('.lithos-trap-core');
  if(core)core.style.opacity='0';
 }
 if(layer){
  layer.style.cssText='position:absolute;inset:0;z-index:10054;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);color:#330000;font:900 2rem Courier New,monospace';
  layer.innerHTML='...';
 }
 lithosOwnerTrapWhisper('...');
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  lithosOwnerTrapHorrorSfx.unmute();
  lithosOwnerTrapHorrorSfx.scream();
  lithosOwnerTrapShowHit(0,'#fff','ANOMALY #7');
  try{if(navigator.vibrate)navigator.vibrate([400,100,400]);}catch(_){}
 },900));
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  lithosOwnerTrapHorrorSfx.hit(1);
  lithosOwnerTrapShowHit(1,'#1a0008','WRONG PROPORTIONS');
 },1350));
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  lithosOwnerTrapHorrorSfx.hit(2);
  lithosOwnerTrapShowHit(2,'#fff','DO NOT OBSERVE');
 },1750));
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  lithosOwnerTrapHorrorSfx.hit(3);
  lithosOwnerTrapShowHit(3,'#200010','NOT THE OWNER');
 },2150));
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  lithosOwnerTrapHorrorSfx.scream();
  lithosOwnerTrapShowHit(4,'#fff','BREACH');
  try{if(navigator.vibrate)navigator.vibrate([500,200,500,200,600]);}catch(_){}
 },2550));
 lithosOwnerTrapTimers.push(setTimeout(lithosOwnerTrapEnd,3800));
}
function lithosOwnerTrapOutsiderSplash(){
 const s=document.createElement('div');
 s.id='lithos-trap-outsider-splash';
 s.style.cssText='position:fixed;inset:0;z-index:100003;background:linear-gradient(135deg,#0ff 0%,#f0f 50%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:"Courier New",Courier,monospace;text-align:center;padding:16px';
 s.innerHTML=`${lithosTrapFaceMarkup(0)}<p style="font-weight:900;font-size:clamp(1rem,4vw,1.5rem);margin:10px 0 0;text-shadow:0 0 20px #0ff">ANOMALY v${LITHOS_OWNER_TRAP_BUILD}</p><p style="font-size:.9rem;font-weight:700">No webcam · SVG anomalies only</p>`;
 document.body.appendChild(s);
 lithosOwnerTrapTimers.push(setTimeout(()=>{try{s.remove();}catch(_){}},1300));
}
function lithosStartOwnerTrap(){
 const bait=document.getElementById('lithos-owner-bait');
 if(bait)bait.remove();
 if(lithosOwnerTrapActive)return;
 lithosOwnerTrapActive=true;
 lithosOwnerTrapClearTimers();
 lithosOwnerTrapOutsiderSplash();
 lithosOwnerTrapHorrorSfx.htmlUnlock();
 lithosOwnerTrapHorrorSfx.resume();
 lithosOwnerTrapHorrorSfx.burst();
 setTimeout(()=>{try{lithosOwnerTrapHorrorSfx.startDrone();}catch(_){}},80);
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
 lithosOwnerTrapEnterFs(trap);
 lithosOwnerTrapShowRealAnomaly(0);
 lithosOwnerTrapScareAudio();
 lithosOwnerTrapScareIv=setInterval(lithosOwnerTrapScareAudio,420);
 let fsRetries=0;
 lithosOwnerTrapFsHandler=()=>{
  if(!lithosOwnerTrapActive)return;
  if(document.fullscreenElement||document.webkitFullscreenElement)return;
  fsRetries++;
  if(fsRetries<30)lithosOwnerTrapTimers.push(setTimeout(()=>lithosOwnerTrapEnterFs(trap),50));
 };
 document.addEventListener('fullscreenchange',lithosOwnerTrapFsHandler);
 document.addEventListener('webkitfullscreenchange',lithosOwnerTrapFsHandler);
 const msgs=['ANOMALY DETECTED','WRONG GEOMETRY','IT MOVED CLOSER','DO NOT OBSERVE','CONTAINMENT LOST','SIGNAL CORRUPTED','NOT THE OWNER','IT IS IN THE HALL','SIGNAL BREACH'];
 let mi=0,count=10;
 lithosOwnerTrapIntervals.push(setInterval(()=>{
  mi=(mi+1)%msgs.length;
  const el=document.getElementById('lithos-owner-trap-msg');
  if(el)el.textContent=msgs[mi];
  if(lithosOwnerTrapHorror){
   lithosOwnerTrapShowFace(lithosOwnerTrapHorror.faceI++);
  }
  trap.classList.toggle('lithos-trap-intense');
 },720));
 lithosOwnerTrapIntervals.push(setInterval(()=>{
  count=Math.max(0,count-1);
  const cEl=document.getElementById('lithos-trap-count');
  if(cEl)cEl.textContent=count?String(count):'NOW';
  if(count<=2)lithosOwnerTrapHorrorSfx.whisper();
 },1100));
 lithosOwnerTrapTimers.push(setTimeout(lithosOwnerTrapFinale,11000));
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
function lithosOwnerTrapTapGate(thenFn){
 if(document.getElementById('lithos-trap-tapgate'))return;
 const run=()=>{
  const g=document.createElement('div');
  g.id='lithos-trap-tapgate';
  g.className='lithos-trap-tapgate';
  g.innerHTML=`<div class="lithos-trap-tapgate-eye">👁</div>
   <p class="lithos-trap-tapgate-title">HORROR TRAP v${LITHOS_OWNER_TRAP_BUILD}</p>
   <p class="lithos-trap-tapgate-sub">TAP ANYWHERE ONCE<br><span>Your browser blocks scary sound until you tap.</span></p>`;
  const go=e=>{
   if(e){e.preventDefault();e.stopPropagation();}
   g.remove();
   lithosOwnerTrapHorrorSfx.htmlUnlock();
   lithosOwnerTrapHorrorSfx.resume();
   try{if(typeof SFX!=='undefined'&&SFX.poke)SFX.poke();}catch(_){}
   if(typeof thenFn==='function')thenFn();
  };
  g.addEventListener('pointerdown',go,{once:true,capture:true});
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')go(e);},{once:true,capture:true});
  document.body.appendChild(g);
 };
 if(document.body)run();
 else document.addEventListener('DOMContentLoaded',run,{once:true});
}
function maybeShowOwnerBait(){
 if(!lithosOwnerBaitForce())return;
 if(window.__LITHOS_TRAP_INLINE_BOOT===LITHOS_OWNER_TRAP_BUILD)return;
 lithosOwnerTrapTapGate(()=>lithosStartOwnerTrap());
}

window.LITHOS_OWNER_TRAP_BUILD=LITHOS_OWNER_TRAP_BUILD;
window.lithosStartOwnerTrap=lithosStartOwnerTrap;
window.lithosPreviewOwnerTrap=lithosStartOwnerTrap;
window.lithosShowOwnerBaitModal=()=>lithosShowOwnerBait(true);
window.maybeShowOwnerBait=maybeShowOwnerBait;
})();
