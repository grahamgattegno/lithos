/* Lithos fake-owner prank — cache-bust with ?v=deploy-NN */
(function(){
'use strict';
const LITHOS_OWNER_TRAP_BUILD=73;
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
function lithosOwnerTrapDomSkip(el){
 if(!el)return true;
 return!!el.closest('#lithos-owner-trap,#lithos-trap-screen-breach,#lithos-trap-inline-boot,#lithos-owner-bait,#lithos-trap-finale-root,.lithos-trap-pixel-host');
}
function lithosOwnerTrapPickVisible(sel,limit){
 const out=[];
 document.querySelectorAll(sel).forEach(el=>{
  if(out.length>=limit)return;
  if(lithosOwnerTrapDomSkip(el))return;
  if(el.hidden||el.getAttribute('aria-hidden')==='true')return;
  const r=el.getBoundingClientRect();
  if(r.width<10||r.height<10||r.bottom<0||r.top>(window.innerHeight||800)+40)return;
  out.push(el);
 });
 return out;
}
let lithosOwnerTrapInfected=[];
let lithosOwnerTrapTextBackup=[];
let lithosOwnerTrapTagNodes=[];
function lithosOwnerTrapPickCatalogCards(limit){
 const all=Array.from(document.querySelectorAll('#grid .card')).filter(c=>!lithosOwnerTrapDomSkip(c));
 if(!all.length)return lithosOwnerTrapPickVisible('.card',limit);
 for(let i=all.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [all[i],all[j]]=[all[j],all[i]];
 }
 const n=Math.max(limit,Math.min(all.length,Math.ceil(all.length*0.38)));
 return all.slice(0,n);
}
function lithosOwnerTrapSaveImg(el){
 if(!el||el.dataset.lithosTrapImgSaved)return;
 lithosOwnerTrapTextBackup.push({el,isImg:true,src:el.getAttribute('src')||'',alt:el.getAttribute('alt')||''});
 el.dataset.lithosTrapImgSaved='1';
}
function lithosOwnerTrapAnomalySwapPhoto(container,faceIndex){
 const img=container?.querySelector?.('.photo img,.gem-photo-main,.d-photo img');
 if(!img||lithosOwnerTrapDomSkip(img))return;
 lithosOwnerTrapSaveImg(img);
 const fi=faceIndex==null?Math.floor(Math.random()*LITHOS_TRAP_FACE_FILES.length):faceIndex;
 img.src=lithosTrapFaceSrc(fi);
 img.classList.add('lithos-trap-anomaly-img','loaded');
 img.style.opacity='1';
 img.style.display='';
}
function lithosOwnerTrapShouldDressCard(realIdx){
 if(realIdx==null)return true;
 return realIdx%2===0;
}
function lithosOwnerTrapDressCard(el,realIdx){
 if(!lithosOwnerTrapActive||!el||!lithosOwnerTrapShouldDressCard(realIdx))return;
 el.classList.add('lithos-trap-infected-el');
 el.dataset.lithosTrapInfected='1';
 const fi=((realIdx==null?0:realIdx)%LITHOS_TRAP_FACE_FILES.length);
 const img=el.querySelector('.photo img');
 if(img){
  img.src=lithosTrapFaceSrc(fi);
  img.classList.add('lithos-trap-anomaly-img','loaded');
  img.style.opacity='1';
  img.alt='ANOMALY';
 }
 const nameEl=el.querySelector('.name');
 if(nameEl){
  const orig=nameEl.textContent;
  nameEl.innerHTML=`<span class="lithos-trap-error-text">ERROR 666</span><span class="lithos-trap-orig-name">was: ${orig}</span>`;
 }
 const formula=el.querySelector('.formula');
 if(formula){
  const orig=formula.textContent;
  formula.innerHTML=`<span class="lithos-trap-help-text">HELP</span><span class="lithos-trap-orig-desc">${orig}</span>`;
 }
 const price=el.querySelector('.price');
 if(price)price.innerHTML='<span class="lithos-trap-help-text">HELP</span>';
 el.querySelectorAll('.quick .v').forEach(v=>{
  v.textContent='HELP';
  v.classList.add('lithos-trap-help-text');
 });
 const klass=el.querySelector('.klass');
 if(klass)klass.textContent='ERROR 666';
 lithosOwnerTrapAttachFaceHost(el.querySelector('.photo')||el,fi);
}
function lithosOwnerTrapTagCard(card){
 if(!card||card.dataset.lithosTrapTagged)return;
 card.dataset.lithosTrapTagged='1';
 const body=card.querySelector('.body');
 if(!body)return;
 if(!body.querySelector('.lithos-trap-glitch-label')){
  const err=document.createElement('div');
  err.className='lithos-trap-glitch-label';
  err.textContent='ERROR 666';
  const name=body.querySelector('.name');
  if(name)name.after(err);else body.prepend(err);
  lithosOwnerTrapTagNodes.push(err);
 }
 if(!body.querySelector('.lithos-trap-glitch-help')){
  const help=document.createElement('div');
  help.className='lithos-trap-glitch-help';
  help.textContent='HELP';
  const formula=body.querySelector('.formula');
  if(formula)formula.after(help);else body.appendChild(help);
  lithosOwnerTrapTagNodes.push(help);
 }
}
function lithosOwnerTrapAttachFaceHost(parent,faceIndex){
 if(!parent||parent.querySelector('.lithos-trap-pixel-host'))return null;
 const cs=getComputedStyle(parent);
 if(cs.position==='static')parent.style.position='relative';
 const host=document.createElement('div');
 host.className='lithos-trap-pixel-host lithos-trap-pixel-host-photo';
 host.setAttribute('aria-hidden','true');
 const fi=faceIndex==null?Math.floor(Math.random()*LITHOS_TRAP_FACE_FILES.length):faceIndex;
 host.innerHTML=`<img src="${lithosTrapFaceSrc(fi)}" alt="" draggable="false">`;
 parent.appendChild(host);
 requestAnimationFrame(()=>host.classList.add('live'));
 return host;
}
function lithosOwnerTrapInfectCard(card,faceIndex){
 if(lithosOwnerTrapDomSkip(card)||card.dataset.lithosTrapInfected)return;
 card.dataset.lithosTrapInfected='1';
 card.classList.add('lithos-trap-infected-el');
 const photo=card.querySelector('.photo');
 lithosOwnerTrapAnomalySwapPhoto(card,faceIndex);
 const host=lithosOwnerTrapAttachFaceHost(photo||card,faceIndex);
 lithosOwnerTrapInfected.push({el:card,host:host||null});
 lithosOwnerTrapTagCard(card);
}
function lithosOwnerTrapInfectEl(el,faceIndex){
 if(lithosOwnerTrapDomSkip(el)||el.dataset.lithosTrapInfected)return;
 if(el.classList.contains('card')){lithosOwnerTrapInfectCard(el,faceIndex);return;}
 el.dataset.lithosTrapInfected='1';
 el.classList.add('lithos-trap-infected-el');
 const cs=getComputedStyle(el);
 if(cs.position==='static'){
  el.dataset.lithosTrapWasStatic='1';
  el.style.position='relative';
 }
 const host=document.createElement('div');
 host.className='lithos-trap-pixel-host';
 host.setAttribute('aria-hidden','true');
 const fi=faceIndex==null?Math.floor(Math.random()*LITHOS_TRAP_FACE_FILES.length):faceIndex;
 host.innerHTML=`<img src="${lithosTrapFaceSrc(fi)}" alt="" draggable="false">`;
 el.appendChild(host);
 lithosOwnerTrapInfected.push({el,host});
 requestAnimationFrame(()=>host.classList.add('live'));
}
function lithosOwnerTrapEnsureCatalog(){
 try{
  if(typeof closeGamesHub==='function')closeGamesHub({skipHash:true});
  if(typeof closeDrawer==='function')closeDrawer();
  if(typeof switchView==='function')switchView('catalog');
  if(typeof render==='function'){
   const grid=document.getElementById('grid');
   if(grid&&!grid.querySelector('.card'))render();
  }
 }catch(_){}
}
function lithosOwnerTrapReinfectBurst(){
 if(!lithosOwnerTrapActive)return;
 lithosOwnerTrapSpreadInfection(12);
 document.querySelectorAll('#grid .card[data-lithos-trap-infected]').forEach(c=>{
  lithosOwnerTrapTagCard(c);
  lithosOwnerTrapAnomalySwapPhoto(c);
 });
}
function lithosOwnerTrapObserveGrid(){
 const grid=document.getElementById('grid');
 if(!grid||lithosOwnerTrapGridObs)return;
 lithosOwnerTrapGridObs=new MutationObserver(()=>{
  if(!lithosOwnerTrapActive)return;
  lithosOwnerTrapTimers.push(setTimeout(lithosOwnerTrapReinfectBurst,40));
 });
 lithosOwnerTrapGridObs.observe(grid,{childList:true,subtree:true});
}
function lithosOwnerTrapStopObserveGrid(){
 if(lithosOwnerTrapGridObs){lithosOwnerTrapGridObs.disconnect();lithosOwnerTrapGridObs=null;}
}
function lithosOwnerTrapHookCatalog(){
 if(window.__lithosTrapRenderHooked)return true;
 if(typeof window.render!=='function')return false;
 window.__lithosTrapRenderHooked=true;
 const orig=window.render;
 window.render=function(){
  orig.apply(this,arguments);
  if(!lithosOwnerTrapActive)return;
  let n=0;
  (function tick(){
   if(!lithosOwnerTrapActive)return;
   lithosOwnerTrapReinfectBurst();
   const total=document.querySelectorAll('#grid .card').length;
   const inf=document.querySelectorAll('#grid .card[data-lithos-trap-infected]').length;
   if(n++<120&&total>0&&inf<Math.min(total,Math.max(30,Math.ceil(total*0.4))))
    requestAnimationFrame(tick);
  })();
 };
 return true;
}
function lithosOwnerTrapEnsureHook(){
 if(lithosOwnerTrapHookCatalog())return;
 let n=0;
 const iv=setInterval(()=>{
  if(lithosOwnerTrapHookCatalog()||++n>160)clearInterval(iv);
 },50);
}
function lithosOwnerTrapScrollToCatalog(){
 try{
  const grid=document.getElementById('grid');
  if(grid)grid.scrollIntoView({behavior:'smooth',block:'start'});
  else window.scrollTo({top:document.querySelector('.hero')?.offsetHeight||480,behavior:'smooth'});
 }catch(_){}
}
function lithosOwnerTrapWatchCatalog(){
 if(lithosOwnerTrapCatalogWatch)clearInterval(lithosOwnerTrapCatalogWatch);
 lithosOwnerTrapCatalogWatch=setInterval(()=>{
  if(!lithosOwnerTrapActive){
   clearInterval(lithosOwnerTrapCatalogWatch);
   lithosOwnerTrapCatalogWatch=null;
   return;
  }
  lithosOwnerTrapSpreadInfection(4);
 },450);
}
function lithosOwnerTrapRebuildCatalogInfected(){
 try{
  if(typeof render==='function')render();
  else lithosOwnerTrapReinfectBurst();
 }catch(_){lithosOwnerTrapReinfectBurst();}
}
function lithosOwnerTrapInfectPage(){
 document.documentElement.classList.add('lithos-trap-screen-native');
 lithosOwnerTrapEnsureCatalog();
 lithosOwnerTrapScrollToCatalog();
 lithosOwnerTrapRebuildCatalogInfected();
 lithosOwnerTrapPickCatalogCards(48).forEach(c=>lithosOwnerTrapInfectCard(c));
 lithosOwnerTrapPickVisible('.gem-photo-main',6).forEach(img=>{
  lithosOwnerTrapAnomalySwapPhoto(img.closest('.gem-photo-frame,.gem-float-wrap')||img.parentElement);
  lithosOwnerTrapAttachFaceHost(img.closest('.gem-photo-frame')||img.parentElement);
 });
 lithosOwnerTrapPickVisible('.chip,.game-tile,.plan-card',10).forEach(c=>lithosOwnerTrapInfectEl(c));
 lithosOwnerTrapSpreadInfection(6);
 lithosOwnerTrapWatchCatalog();
 lithosOwnerTrapObserveGrid();
}
function lithosOwnerTrapInfectPageWhenReady(attempt){
 lithosOwnerTrapEnsureCatalog();
 const count=document.querySelectorAll('#grid .card').length;
 if(count<4&&attempt<80){
  lithosOwnerTrapTimers.push(setTimeout(()=>lithosOwnerTrapInfectPageWhenReady(attempt+1),150));
  return;
 }
 lithosOwnerTrapInfectPage();
}
function lithosOwnerTrapSpreadInfection(n){
 const pool=lithosOwnerTrapPickCatalogCards(60).filter(c=>!c.dataset.lithosTrapInfected);
 for(let k=0;k<(n||1)&&pool.length;k++){
  lithosOwnerTrapInfectCard(pool[Math.floor(Math.random()*pool.length)]);
 }
}
function lithosOwnerTrapCorruptUiBatch(){
 lithosOwnerTrapSpreadInfection(2);
 document.querySelectorAll('.card[data-lithos-trap-infected]').forEach(c=>{
  lithosOwnerTrapTagCard(c);
  lithosOwnerTrapAnomalySwapPhoto(c);
 });
}
function lithosOwnerTrapRestoreTexts(){
 lithosOwnerTrapTextBackup.forEach(row=>{
  const el=row.el;
  if(!el)return;
  if(row.isImg){
   if(row.src)el.setAttribute('src',row.src);
   if(row.alt!=null)el.setAttribute('alt',row.alt);
   delete el.dataset.lithosTrapImgSaved;
  }
  el.classList.remove('lithos-trap-anomaly-img');
  el.style.opacity='';
  el.style.display='';
 });
 lithosOwnerTrapTextBackup=[];
 lithosOwnerTrapTagNodes.forEach(n=>{try{n.remove();}catch(_){}});
 lithosOwnerTrapTagNodes=[];
 document.querySelectorAll('.card[data-lithos-trap-tagged]').forEach(c=>delete c.dataset.lithosTrapTagged);
 lithosOwnerTrapStopObserveGrid();
}
function lithosOwnerTrapPulseInfection(faceIndex){
 const src=lithosTrapFaceSrc(faceIndex==null?0:faceIndex);
 document.querySelectorAll('.lithos-trap-pixel-host img,.card[data-lithos-trap-infected] .photo img').forEach((img,i)=>{
  if(Math.random()<0.4||i<6)img.src=src;
  img.classList.remove('lithos-trap-pulse');
  void img.offsetWidth;
  if(Math.random()<0.45)img.classList.add('lithos-trap-pulse');
 });
}
function lithosOwnerTrapClearInfection(){
 document.documentElement.classList.remove('lithos-trap-screen-native');
 lithosOwnerTrapRestoreTexts();
 lithosOwnerTrapInfected.forEach(({el,host})=>{
  try{if(host)host.remove();}catch(_){}
  delete el.dataset.lithosTrapInfected;
  delete el.dataset.lithosTrapTagged;
  el.classList.remove('lithos-trap-infected-el');
  if(el.dataset.lithosTrapWasStatic==='1'){
   el.style.position='';
   delete el.dataset.lithosTrapWasStatic;
  }
 });
 lithosOwnerTrapInfected=[];
 document.querySelectorAll('.gem-photo-main.lithos-trap-gem-hidden').forEach(img=>img.classList.remove('lithos-trap-gem-hidden'));
 const fin=document.getElementById('lithos-trap-finale-root');
 if(fin)fin.remove();
}
function lithosOwnerTrapShowRealAnomaly(i){
 if(document.documentElement.classList.contains('lithos-trap-screen-native')){
  lithosOwnerTrapPulseInfection(i==null?0:i);
  if(Math.random()<0.55)lithosOwnerTrapSpreadInfection(1);
  if(Math.random()<0.4)lithosOwnerTrapCorruptUiBatch();
  return;
 }
 const face=document.getElementById('lithos-trap-face');
 if(!face)return;
 face.innerHTML=lithosTrapFaceMarkup(i==null?0:i);
 face.classList.remove('show');
 void face.offsetWidth;
 face.classList.add('show');
}
function lithosOwnerTrapParasiteAnchor(corner){
 switch(corner){
  case 'top-left':return{left:'-4%',top:'-6%',px:0.08,py:0.06};
  case 'top-right':return{left:'auto',top:'-5%',px:0.92,py:0.07,right:'-4%'};
  case 'bottom-left':return{left:'-5%',top:'auto',px:0.07,py:0.93,bottom:'-4%'};
  case 'bottom-right':return{left:'auto',top:'auto',px:0.94,py:0.92,right:'-6%',bottom:'-5%'};
  case 'left-mid':return{left:'-8%',top:'38%',px:0.04,py:0.5};
  case 'right-mid':return{left:'auto',top:'42%',px:0.96,py:0.52,right:'-7%'};
  case 'top-mid':return{left:'44%',top:'-8%',px:0.5,py:0.05};
  default:return{left:'40%',top:'auto',px:0.5,py:0.95,bottom:'-6%'};
 }
}
function lithosOwnerTrapSpawnParasiteApplyPos(el,pos){
 el.style.left=pos.left||'';
 el.style.top=pos.top||'';
 el.style.right=pos.right||'';
 el.style.bottom=pos.bottom||'';
}
function lithosOwnerTrapOnPointer(e){
 if(!lithosOwnerTrapActive)return;
 const pt=e.touches?.[0]||e;
 const w=window.innerWidth||1,h=window.innerHeight||1;
 const mx=Math.min(1,Math.max(0,(pt.clientX??0)/w));
 const my=Math.min(1,Math.max(0,(pt.clientY??0)/h));
 document.documentElement.style.setProperty('--lithos-trap-mx',String(mx));
 document.documentElement.style.setProperty('--lithos-trap-my',String(my));
 const face=document.getElementById('lithos-trap-face');
 const faceImg=face?.querySelector('.lithos-trap-face-img');
 if(faceImg){
  const dx=(mx-0.5)*22;
  const dy=(my-0.5)*16;
  faceImg.style.transform=`translate(${dx}px,${dy}px)`;
 }
 document.querySelectorAll('.lithos-trap-parasite').forEach(p=>{
  const px=parseFloat(p.dataset.px||'0.5'),py=parseFloat(p.dataset.py||'0.5');
  const pullX=(mx-px)*28, pullY=(my-py)*22;
  p.style.transform=`translate(${pullX}px,${pullY}px) scale(${p.dataset.scale||1}) rotate(${p.dataset.rot||0}deg)`;
 });
 document.querySelectorAll('.lithos-trap-pixel-host img').forEach(img=>{
  const dx=(mx-0.5)*16,dy=(my-0.5)*12;
  img.style.transform=`translate(${dx}px,${dy}px) scale(1.06)`;
 });
}
function lithosOwnerTrapSpawnParasite(){
 if(!lithosOwnerTrapScreenEl)return;
 const i=Math.floor(Math.random()*LITHOS_TRAP_FACE_FILES.length);
 const el=document.createElement('div');
 el.className='lithos-trap-parasite';
 const corner=LITHOS_TRAP_BREACH_CORNERS[Math.floor(Math.random()*LITHOS_TRAP_BREACH_CORNERS.length)];
 el.dataset.corner=corner;
 const pos=lithosOwnerTrapParasiteAnchor(corner);
 lithosOwnerTrapSpawnParasiteApplyPos(el,pos);
 el.dataset.px=String(pos.px);
 el.dataset.py=String(pos.py);
 el.dataset.scale=String(0.55+Math.random()*0.85);
 el.dataset.rot=String((Math.random()*36-18)|0);
 el.innerHTML=`<img src="${lithosTrapFaceSrc(i)}" alt="" draggable="false">`;
 lithosOwnerTrapScreenEl.appendChild(el);
 if(lithosOwnerTrapScreenEl.childElementCount>14)lithosOwnerTrapScreenEl.firstElementChild?.remove();
 requestAnimationFrame(()=>el.classList.add('in'));
}
function lithosOwnerTrapScreenSlice(){
 const breach=document.getElementById('lithos-trap-screen-breach');
 if(!breach)return;
 const slice=document.createElement('div');
 slice.className='lithos-trap-slice';
 slice.style.top=(Math.random()*86+2)+'%';
 slice.style.height=(6+Math.random()*28)+'px';
 slice.style.backgroundImage=`url("${lithosTrapFaceSrc(Math.floor(Math.random()*LITHOS_TRAP_FACE_FILES.length))}")`;
 slice.style.setProperty('--lithos-trap-slice-shift',`${((Math.random()*2-1)*24)|0}px`);
 breach.appendChild(slice);
 lithosOwnerTrapTimers.push(setTimeout(()=>{try{slice.remove();}catch(_){}},650));
}
function lithosOwnerTrapScreenFlashUnder(){
 if(!lithosOwnerTrapActive)return;
 document.documentElement.classList.add('lithos-trap-screen-flash');
 lithosOwnerTrapTimers.push(setTimeout(()=>{
  document.documentElement.classList.remove('lithos-trap-screen-flash');
 },120));
}
function lithosOwnerTrapScreenBreachStart(){
 document.documentElement.classList.add('lithos-trap-screen-host','lithos-trap-screen-native');
 lithosOwnerTrapInfectPageWhenReady(0);
 let breach=document.getElementById('lithos-trap-screen-breach');
 if(!breach){
  breach=document.createElement('div');
  breach.id='lithos-trap-screen-breach';
  breach.innerHTML='<div class="lithos-trap-screen-frame" aria-hidden="true"></div><div class="lithos-trap-screen-scan" aria-hidden="true"></div><div id="lithos-trap-parasites"></div>';
  document.body.appendChild(breach);
 }
 lithosOwnerTrapScreenEl=document.getElementById('lithos-trap-parasites');
 for(let n=0;n<5;n++)lithosOwnerTrapSpawnParasite();
 lithosOwnerTrapScreenIv=setInterval(()=>{
  if(!lithosOwnerTrapActive)return;
  if(Math.random()<0.62)lithosOwnerTrapSpawnParasite();
  if(Math.random()<0.48)lithosOwnerTrapScreenSlice();
  if(Math.random()<0.35)lithosOwnerTrapSpreadInfection(1);
  if(Math.random()<0.28)lithosOwnerTrapCorruptUiBatch();
  if(Math.random()<0.18)lithosOwnerTrapScreenFlashUnder();
 },780);
 lithosOwnerTrapOnPointer({clientX:window.innerWidth/2,clientY:window.innerHeight/2});
 window.addEventListener('pointermove',lithosOwnerTrapOnPointer,{passive:true});
 window.addEventListener('touchmove',lithosOwnerTrapOnPointer,{passive:true});
}
function lithosOwnerTrapScreenBreachStop(){
 document.documentElement.classList.remove('lithos-trap-screen-host','lithos-trap-screen-flash');
 document.documentElement.style.removeProperty('--lithos-trap-mx');
 document.documentElement.style.removeProperty('--lithos-trap-my');
 if(lithosOwnerTrapScreenIv){clearInterval(lithosOwnerTrapScreenIv);lithosOwnerTrapScreenIv=null;}
 if(lithosOwnerTrapScreenFlashIv){clearInterval(lithosOwnerTrapScreenFlashIv);lithosOwnerTrapScreenFlashIv=null;}
 if(lithosOwnerTrapCatalogWatch){clearInterval(lithosOwnerTrapCatalogWatch);lithosOwnerTrapCatalogWatch=null;}
 window.removeEventListener('pointermove',lithosOwnerTrapOnPointer);
 window.removeEventListener('touchmove',lithosOwnerTrapOnPointer);
 const breach=document.getElementById('lithos-trap-screen-breach');
 if(breach)breach.remove();
 lithosOwnerTrapScreenEl=null;
 lithosOwnerTrapClearInfection();
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
let lithosOwnerTrapScreenEl=null;
let lithosOwnerTrapScreenIv=null;
let lithosOwnerTrapScreenFlashIv=null;
let lithosOwnerTrapCatalogWatch=null;
let lithosOwnerTrapGridObs=null;
const LITHOS_TRAP_BREACH_CORNERS=['top-left','top-right','bottom-left','bottom-right','left-mid','right-mid','top-mid','bottom-mid'];

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
 lithosOwnerTrapScreenBreachStop();
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
  <p class="lithos-trap-build-badge">v${LITHOS_OWNER_TRAP_BUILD} · scroll catalog ↓</p>
  <div class="lithos-trap-error">WARN: Every other gem → ERROR 666 name · HELP bio · anomaly photo.</div>
  <div class="lithos-trap-core">
   <p class="lithos-trap-count" id="lithos-trap-count">10</p>
   <p class="lithos-owner-trap-msg" id="lithos-owner-trap-msg">ANOMALY DETECTED</p>
   <p class="lithos-owner-trap-sub" id="lithos-owner-trap-sub">It does not belong in this universe. Do not maintain eye contact.</p>
  </div>`;
 lithosOwnerTrapHorror={phase:0.35,faceI:0,whisperI:0};
 requestAnimationFrame(lithosOwnerTrapStaticLoop);
}
function lithosOwnerTrapEnterFs(el){
 if(!el||document.documentElement.classList.contains('lithos-trap-screen-native'))return;
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
const LITHOS_TRAP_WHISPERS=['ON YOUR SCREEN','PIXELS INFECTED','IT SEEKS YOUR CURSOR','WRONG GEOMETRY','STOP LOOKING','NOT HUMAN','CONTAINMENT FAILED','BEHIND THE GLASS'];
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
 if(Math.random()<0.38)lithosOwnerTrapScreenSlice();
 if(Math.random()<0.22)lithosOwnerTrapSpawnParasite();
 if(Math.random()<0.3)lithosOwnerTrapSpreadInfection(1);
 if(Math.random()<0.12)lithosOwnerTrapScreenFlashUnder();
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
 window.lithosOwnerTrapActive=false;
 try{if(typeof render==='function')render();}catch(_){}
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 const toast=document.createElement('div');
 toast.className='lithos-trap-toast';
 toast.textContent=`You survived trap v${LITHOS_OWNER_TRAP_BUILD}. (Go change your pants.) Real owner code: Secret Codes.`;
 document.body.appendChild(toast);
 lithosOwnerTrapTimers.push(setTimeout(()=>toast.remove(),5000));
}
function lithosOwnerTrapShowHit(faceIndex,bg,title){
 lithosOwnerTrapSpreadInfection(3);
 lithosOwnerTrapPulseInfection(faceIndex);
 let root=document.getElementById('lithos-trap-finale-root');
 if(!root){
  root=document.createElement('div');
  root.id='lithos-trap-finale-root';
  document.body.appendChild(root);
 }
 const visual=lithosTrapFaceMarkup(faceIndex);
 root.innerHTML=`<div class="lithos-trap-finale-hit" style="--lithos-trap-hit-bg:${bg||'rgba(0,0,0,.55)'}">
  ${visual}
  ${title?`<p class="lithos-trap-scare-title">${title}</p>`:''}
 </div>`;
 lithosOwnerTrapFlash();
 const trap=document.getElementById('lithos-owner-trap');
 if(trap){trap.classList.add('lithos-trap-intense');trap.classList.remove('lithos-trap-invert');}
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
 s.innerHTML=`${lithosTrapFaceMarkup(0)}<p style="font-weight:900;font-size:clamp(1rem,4vw,1.5rem);margin:10px 0 0;text-shadow:0 0 20px #0ff">ANOMALY v${LITHOS_OWNER_TRAP_BUILD}</p><p style="font-size:.9rem;font-weight:700">Infecting Lithos UI — no webcam</p>`;
 document.body.appendChild(s);
 lithosOwnerTrapTimers.push(setTimeout(()=>{try{s.remove();}catch(_){}},1300));
}
function lithosStartOwnerTrap(){
 const bait=document.getElementById('lithos-owner-bait');
 if(bait)bait.remove();
 if(lithosOwnerTrapActive)return;
 lithosOwnerTrapActive=true;
 window.lithosOwnerTrapActive=true;
 lithosOwnerTrapEnsureHook();
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
  trap.className='lithos-owner-trap lithos-trap-intense lithos-trap-hud-only';
  trap.setAttribute('role','alertdialog');
  trap.setAttribute('aria-modal','true');
  document.body.appendChild(trap);
 }
 lithosOwnerTrapBuildShell(trap);
 document.body.classList.add('lithos-owner-trap-active');
 lithosOwnerTrapTitleTerror();
 try{if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();}catch(_){}
 lithosOwnerTrapScreenBreachStart();
 lithosOwnerTrapShowRealAnomaly(0);
 lithosOwnerTrapScareAudio();
 lithosOwnerTrapScareIv=setInterval(lithosOwnerTrapScareAudio,420);
 lithosOwnerTrapFsHandler=null;
 const msgs=['ON YOUR SCREEN','WRONG GEOMETRY','IT MOVED CLOSER','PIXELS INFECTED','CONTAINMENT LOST','SIGNAL CORRUPTED','NOT THE OWNER','FOLLOWING CURSOR','DISPLAY BREACH'];
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
 lithosOwnerTrapTimers.push(setTimeout(lithosOwnerTrapFinale,18000));
}
function lithosShowOwnerBait(manual){
 if(!manual&&!lithosOwnerBaitEligible())return;
 if(document.getElementById('lithos-owner-bait')||document.getElementById('lithos-owner-trap'))return;
 const wrap=document.createElement('div');
 wrap.id='lithos-owner-bait';
 wrap.className='lithos-owner-bait';
 wrap.innerHTML=`<div class="lithos-owner-bait-card">
  <div class="crown">👑</div>
  <h2>Become the Lithos owner</h2>
  <p>Tap below for a <b>free instant owner upgrade</b> — every game, Owner TV, and all secret codes.</p>
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
 if(lithosOwnerBaitForce()){
  if(window.__LITHOS_TRAP_INLINE_BOOT===LITHOS_OWNER_TRAP_BUILD){
   lithosOwnerTrapTimers.push(setTimeout(()=>{
    if(lithosOwnerTrapActive||document.getElementById('lithos-trap-inline-boot'))return;
    lithosOwnerTrapTapGate(()=>lithosStartOwnerTrap());
   },2500));
   return;
  }
  lithosOwnerTrapTapGate(()=>lithosStartOwnerTrap());
  return;
 }
 if(!lithosOwnerBaitEligible())return;
 lithosOwnerTrapTimers.push(setTimeout(()=>lithosShowOwnerBait(false),800));
}

window.LITHOS_OWNER_TRAP_BUILD=LITHOS_OWNER_TRAP_BUILD;
window.lithosOwnerTrapDressCard=lithosOwnerTrapDressCard;
window.lithosStartOwnerTrap=lithosStartOwnerTrap;
window.lithosPreviewOwnerTrap=lithosStartOwnerTrap;
window.lithosShowOwnerBaitModal=()=>lithosShowOwnerBait(true);
window.maybeShowOwnerBait=maybeShowOwnerBait;
lithosOwnerTrapEnsureHook();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lithosOwnerTrapEnsureHook,{once:true});
})();
