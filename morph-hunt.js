/* Find The Noobies Morphs — Lithos (268 normal + 104 exclusive) */
(function(){
'use strict';

const MH_STORE_KEY='lithos_morph_hunt_v3';
const MH_WEAR_KEY='lithos_noobie_wear';
const MH_NORMAL_COUNT=268;
const MH_EXCLUSIVE_COUNT=104;
const MH_COINS_PER_FIND=15;
const MH_GACHA_COST=50;
const MH_GACHA_EX_COST=120;
const MH_WORLDS_COUNT=8;

const MH_RARITY={
 common:{label:'Common',color:'#b8c0c8',glow:'rgba(184,192,200,.4)'},
 uncommon:{label:'Uncommon',color:'#4caf7d',glow:'rgba(76,175,125,.45)'},
 rare:{label:'Rare',color:'#4ea8ff',glow:'rgba(78,168,255,.5)'},
 epic:{label:'Epic',color:'#b060e8',glow:'rgba(176,96,232,.55)'},
 legendary:{label:'Legendary',color:'#f8d030',glow:'rgba(248,208,48,.6)'},
 exclusive:{label:'Exclusive',color:'#ff6eb4',glow:'rgba(255,110,180,.6)'},
 secret:{label:'Secret',color:'#39ff14',glow:'rgba(57,255,20,.5)'}
};

const MH_WORLDS=[
 {id:'w0',name:'Buddy Plaza',emoji:'🏠',tagline:'Start here — noobies everywhere!',bg:'#87CEEB',ground:'#7ec850'},
 {id:'w1',name:'Rainbow Fair',emoji:'🎡',tagline:'Colorful fair noobies.',bg:'#ffb8d0',ground:'#98d868'},
 {id:'w2',name:'Blocky Beach',emoji:'🏖',tagline:'Sand, surf, and sunny morphs.',bg:'#70c8f0',ground:'#e8d878'},
 {id:'w3',name:'Crystal Cave',emoji:'💎',tagline:'Gem-colored noobies glimmer.',bg:'#483868',ground:'#685888'},
 {id:'w4',name:'Shadow Backrooms',emoji:'🚪',tagline:'Spooky fluorescent halls.',bg:'#c8c4a8',ground:'#a8a890'},
 {id:'w5',name:'Sky Islands',emoji:'☁',tagline:'Floating platforms in the clouds.',bg:'#a8d8ff',ground:'#88c8f0'},
 {id:'w6',name:'Lava Park',emoji:'🌋',tagline:'Hot zones — rare spawns!',bg:'#ff8860',ground:'#8a4030'},
 {id:'w7',name:'Legend Nexus',emoji:'👑',tagline:'Last normal zone before exclusives.',bg:'#6080c0',ground:'#506898'}
];

const MH_CODES={
 welcomebuddy:{morph:'ex-welcome',coins:0,title:''},
 coinplease:{coins:100},
 thanksforverified:{coins:100},
 bubblebuddy:{title:'Bubble Buddy'},
 lithosgem:{morph:'ex-gemcrown'},
 happyanniversaryftn1:{morph:'ex-party'}
};

const MH_RARITY_N=['common','common','uncommon','common','uncommon','rare','common','uncommon','rare','epic','uncommon','legendary'];

function mhHsl(i,off,s,l){
 const h=(i*137.508+off*40)%360;
 return `hsl(${Math.round(h)},${s}%,${l}%)`;
}
function mhPal(i){
 return{
  head:mhHsl(i,0,72,62),
  torso:mhHsl(i,1,68,48),
  legs:mhHsl(i,2,58,40),
  arms:mhHsl(i,0,72,62)
 };
}
function mhSpotPos(idx,total){
 const cols=11;
 const row=Math.floor(idx/cols);
 const col=idx%cols;
 return{
  x:6+col*(88/(cols-1)),
  y:22+row*(58/Math.max(1,Math.ceil(total/cols)-1))
 };
}

function mhBuildMorphs(){
 const list=[];
 const perWorld=Math.ceil(MH_NORMAL_COUNT/MH_WORLDS_COUNT);
 for(let i=0;i<MH_NORMAL_COUNT;i++){
  const wi=Math.min(MH_WORLDS_COUNT-1,Math.floor(i/perWorld));
  const idx=i-wi*perWorld;
  const pos=mhSpotPos(idx,perWorld);
  const pal=mhPal(i);
  list.push({
   id:'n-'+i,
   name:'Noobie #'+(i+1),
   exclusive:false,
   world:wi,
   x:pos.x,y:pos.y,
   scale:1,
   ...pal,
   rarity:MH_RARITY_N[i%MH_RARITY_N.length],
   hat:i%17===0?'star':i%23===0?'crown':null
  });
 }
 for(let i=0;i<MH_EXCLUSIVE_COUNT;i++){
  const pal=mhPal(i+1000);
  list.push({
   id:'ex-'+i,
   name:i===0?'Welcome Noobie':i===1?'Party Noobie':i===2?'Gem Crown Noobie':'Exclusive Noobie #'+(i+1),
   exclusive:true,
   world:MH_WORLDS_COUNT,
   x:50,y:40,
   scale:1.05+(i%5)*0.02,
   ...pal,
   rarity:i<12?'secret':i<40?'legendary':'exclusive',
   hat:i%7===0?'gem':i%5===0?'party':i%3===0?'crown':null,
   vaultOnly:true
  });
 }
 const welcome=list.find(m=>m.id==='ex-0');
 if(welcome){ welcome.id='ex-welcome'; welcome.name='Welcome Noobie'; welcome.hat='wave'; }
 const party=list.find(m=>m.id==='ex-1');
 if(party){ party.id='ex-party'; party.name='Party Noobie'; party.hat='party'; }
 const gem=list.find(m=>m.id==='ex-2');
 if(gem){ gem.id='ex-gemcrown'; gem.name='Gem Crown Noobie'; gem.hat='gem'; }
 return list;
}
const MH_MORPHS=mhBuildMorphs();
const MH_NORMALS=MH_MORPHS.filter(m=>!m.exclusive);
const MH_EXCLUSIVES=MH_MORPHS.filter(m=>m.exclusive);

function mhIsOwner(){
 if(typeof isOwner!=='undefined'&&isOwner)return true;
 if(typeof document!=='undefined'&&document.body&&document.body.classList.contains('is-owner'))return true;
 try{return localStorage.getItem('lithos_owner')==='1';}catch(_){return false;}
}

function mhLoadWearId(){
 try{
  const w=localStorage.getItem(MH_WEAR_KEY);
  if(w&&MH_MORPHS.some(m=>m.id===w))return w;
 }catch(_){}
 return null;
}
function mhSaveWearId(id){
 try{
  if(id) localStorage.setItem(MH_WEAR_KEY,id);
  else localStorage.removeItem(MH_WEAR_KEY);
 }catch(_){}
 window.LITHOS_NOOBIE_WEAR=id||null;
 try{
  document.dispatchEvent(new CustomEvent('lithos-noobie-morph',{detail:mhMorph(id)}));
 }catch(_){}
 mhRefreshTeacherNoob();
}

function mhDefaultSave(){
 return{collected:[],worldsUnlocked:1,coins:100,wearing:null,title:'',codesUsed:[]};
}
function mhLoadSave(){
 const wear=mhLoadWearId();
 if(mhIsOwner()){
  return{
   collected:MH_MORPHS.map(m=>m.id),
   worldsUnlocked:MH_WORLDS.length,
   coins:99999,
   wearing:wear||'ex-welcome',
   title:'Collector',
   codesUsed:[]
  };
 }
 try{
  const raw=JSON.parse(localStorage.getItem(MH_STORE_KEY)||'null');
  if(!raw||!Array.isArray(raw.collected))return {...mhDefaultSave(),wearing:wear};
  return{
   collected:raw.collected.filter(id=>MH_MORPHS.some(m=>m.id===id)),
   worldsUnlocked:Math.max(1,Math.min(MH_WORLDS.length,+(raw.worldsUnlocked||1))),
   coins:Math.max(0,+(raw.coins||100)),
   wearing:(raw.wearing&&MH_MORPHS.some(m=>m.id===raw.wearing))?raw.wearing:wear,
   title:typeof raw.title==='string'?raw.title:'',
   codesUsed:Array.isArray(raw.codesUsed)?raw.codesUsed:[]
  };
 }catch(_){return {...mhDefaultSave(),wearing:wear};}
}
function mhSaveSave(data){
 if(mhIsOwner()){
  if(data.wearing) mhSaveWearId(data.wearing);
  return;
 }
 try{localStorage.setItem(MH_STORE_KEY,JSON.stringify(data));}catch(_){}
 if(data.wearing) mhSaveWearId(data.wearing);
}

function mhMorph(id){return MH_MORPHS.find(m=>m.id===id);}
function mhWorldMorphs(wi){return MH_MORPHS.filter(m=>!m.exclusive&&m.world===wi);}
function mhHasMorph(save,id){return save.collected.includes(id);}
function mhWorldComplete(save,wi){
 const need=mhWorldMorphs(wi);
 return need.length>0&&need.every(m=>mhHasMorph(save,m.id));
}

/** Full R6-style body (head, torso, arms, legs) */
function mhClassicNoobSvg(m){
 if(!m) return '';
 const h=m.head||'#F5CD30', t=m.torso||'#0085DB', l=m.legs||'#A4BD47', a=m.arms||h;
 let hat='';
 if(m.hat==='crown') hat='<polygon points="50,2 58,14 42,14" fill="#ffd700"/><rect x="42" y="12" width="16" height="5" fill="#e8b020"/>';
 if(m.hat==='star') hat='<polygon points="50,0 52,10 62,10 54,16 57,26 50,20 43,26 46,16 38,10 48,10" fill="#ffe060"/>';
 if(m.hat==='wave') hat='<text x="68" y="18" font-size="12">👋</text>';
 if(m.hat==='party') hat='<circle cx="40" cy="8" r="4" fill="#ff4080"/><circle cx="60" cy="10" r="3" fill="#40c0ff"/>';
 if(m.hat==='gem') hat='<polygon points="50,0 58,14 50,20 42,14" fill="#80e0ff" stroke="#fff" stroke-width="1"/>';
 return `<g>
  <ellipse cx="50" cy="124" rx="22" ry="4" fill="#000" opacity=".2"/>
  <rect x="32" y="66" width="16" height="34" rx="2" fill="${l}"/>
  <rect x="52" y="66" width="16" height="34" rx="2" fill="${l}"/>
  <rect x="30" y="40" width="40" height="28" rx="3" fill="${t}"/>
  <rect x="14" y="42" width="14" height="28" rx="2" fill="${a}"/>
  <rect x="72" y="42" width="14" height="28" rx="2" fill="${a}"/>
  <rect x="33" y="8" width="34" height="34" rx="4" fill="${h}"/>
  <rect x="35" y="10" width="14" height="10" rx="2" fill="#fff" opacity=".12"/>
  <circle cx="42" cy="22" r="3" fill="#1a1a20"/><circle cx="58" cy="22" r="3" fill="#1a1a20"/>
  <circle cx="43" cy="21" r="1" fill="#fff" opacity=".5"/><circle cx="59" cy="21" r="1" fill="#fff" opacity=".5"/>
  <path d="M42 30 Q50 34 58 30" stroke="#1a1a20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${hat}
 </g>`;
}

function mhRefreshTeacherNoob(){
 const id=window.LITHOS_NOOBIE_WEAR||mhLoadWearId();
 const m=mhMorph(id);
 const html=m?`<svg viewBox="0 0 100 130" class="teacher-noob-svg">${mhClassicNoobSvg(m)}</svg><span class="teacher-noob-name">Rock Teacher morphed into <b>${m.name}</b></span>`:'';
 document.querySelectorAll('.teacher-noob-slot,#teacher-noob-slot,#class-teacher-noob-slot').forEach(el=>{
  if(!el) return;
  el.innerHTML=html;
  el.hidden=!m;
 });
}

let mhState=null;
let mhPendingFound=null;

function mhClose(){
 const el=document.getElementById('morphhunt');
 if(el)el.remove();
 mhState=null;
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
}

function mhToast(msg){
 const t=document.getElementById('mh-toast');
 if(!t)return;
 t.textContent=msg;
 t.classList.add('show');
 clearTimeout(t._tm);
 t._tm=setTimeout(()=>t.classList.remove('show'),2400);
}

function mhShowFound(m){
 const modal=document.getElementById('mh-found-modal');
 if(!modal)return;
 const r=MH_RARITY[m.rarity]||MH_RARITY.common;
 modal.innerHTML=`<div class="mh-found-card" style="--mh-rarity:${r.color}">
  <div class="mh-found-badge">${m.exclusive?'Exclusive':r.label} Noobie!</div>
  <svg viewBox="0 0 100 130" class="mh-found-svg">${mhClassicNoobSvg(m)}</svg>
  <h3>You found ${m.name}!</h3>
  <button type="button" class="mh-btn primary" id="mh-found-morph">Morph into this noobie!</button>
  <button type="button" class="mh-btn ghost" id="mh-found-ok">Keep hunting</button>
 </div>`;
 modal.hidden=false;
 modal.querySelector('#mh-found-morph').onclick=()=>{ mhWear(m.id,true); modal.hidden=true; mhSetTab('morph'); };
 modal.querySelector('#mh-found-ok').onclick=()=>{ modal.hidden=true; };
}

function mhWear(id,silent){
 if(!mhState)return;
 if(!mhHasMorph(mhState.save,id)&&!mhIsOwner()){ mhToast('Find this noobie first!'); return; }
 if(!mhHasMorph(mhState.save,id)&&mhIsOwner()){
  if(!mhState.save.collected.includes(id)) mhState.save.collected.push(id);
 }
 mhState.save.wearing=id;
 mhSaveSave(mhState.save);
 mhSaveWearId(id);
 if(!silent) mhToast('You morphed into '+mhMorph(id).name+'!');
 mhRender();
}

function mhCollect(id){
 const m=mhMorph(id);
 if(!m||!mhState)return;
 const save=mhState.save;
 if(mhHasMorph(save,id)){
  mhWear(id);
  return;
 }
 if(m.exclusive&&!mhIsOwner()){ mhToast('Exclusive noobies come from codes or Exclusive Gacha!'); return; }
 save.collected.push(id);
 save.coins+=MH_COINS_PER_FIND;
 mhSaveSave(save);
 const wi=m.world;
 if(!m.exclusive&&mhWorldComplete(save,wi)&&save.worldsUnlocked<=wi+1&&wi+1<MH_WORLDS.length){
  save.worldsUnlocked=Math.max(save.worldsUnlocked,wi+2);
  mhSaveSave(save);
  mhToast('Zone cleared! Unlocked: '+MH_WORLDS[wi+1].emoji+' '+MH_WORLDS[wi+1].name);
  try{if(typeof SFX!=='undefined'&&SFX.win)SFX.win();}catch(_){}
 }else try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
 mhRender();
 mhShowFound(m);
}

function mhRedeemCode(raw){
 const key=String(raw||'').trim().toLowerCase().replace(/\s+/g,'');
 if(!key||!mhState)return false;
 const pack=MH_CODES[key];
 if(!pack){ mhToast('Invalid code — try WELCOMEBUDDY'); return false; }
 const save=mhState.save;
 if(save.codesUsed.includes(key)){ mhToast('Code already used!'); return false; }
 save.codesUsed.push(key);
 if(pack.coins) save.coins+=pack.coins;
 if(pack.title) save.title=pack.title;
 if(pack.morph&&MH_MORPHS.some(m=>m.id===pack.morph)){
  if(!mhHasMorph(save,pack.morph)) save.collected.push(pack.morph);
  mhWear(pack.morph,true);
 }
 mhSaveSave(save);
 mhToast('Code redeemed!');
 mhRender();
 return true;
}

function mhGacha(exclusive){
 const save=mhState.save;
 const cost=exclusive?MH_GACHA_EX_COST:MH_GACHA_COST;
 if(save.coins<cost){ mhToast('Need '+cost+' coins!'); return; }
 const pool=MH_MORPHS.filter(m=>
  (exclusive?m.exclusive:!m.exclusive)&&!mhHasMorph(save,m.id)
 );
 if(!pool.length){ mhToast('No '+ (exclusive?'exclusive ':'')+'noobies left in gacha!'); return; }
 save.coins-=cost;
 const weights={common:40,uncommon:28,rare:18,epic:10,legendary:4,exclusive:8,secret:3};
 let bag=[];
 pool.forEach(m=>{ const w=weights[m.rarity]||5; for(let i=0;i<w;i++) bag.push(m); });
 const pick=bag[Math.floor(Math.random()*bag.length)];
 save.collected.push(pick.id);
 mhSaveSave(save);
 mhRender();
 mhShowFound(pick);
}

function mhSetWorld(wi){
 if(!mhState)return;
 if(wi>=mhState.save.worldsUnlocked)return;
 mhState.world=wi;
 mhRender();
}

function mhSetTab(tab){
 if(!mhState)return;
 mhState.tab=tab;
 mhState.page=0;
 mhRender();
}

function mhFilterList(list,q){
 q=String(q||'').trim().toLowerCase();
 if(!q) return list;
 return list.filter(m=>m.name.toLowerCase().includes(q)||m.id.includes(q));
}

function mhPaginate(arr,page,size){
 const p=Math.max(0,page||0);
 const start=p*size;
 return{slice:arr.slice(start,start+size),page:p,pages:Math.max(1,Math.ceil(arr.length/size)),total:arr.length};
}

function mhRenderHunt(save, wi){
 const world=MH_WORLDS[wi];
 const morphs=mhWorldMorphs(wi);
 const found=morphs.filter(m=>mhHasMorph(save,m.id)).length;
 const wear=mhMorph(save.wearing);
 const spots=morphs.map(m=>{
  const got=mhHasMorph(save,m.id);
  const r=MH_RARITY[m.rarity]||MH_RARITY.common;
  return `<button type="button" class="mh-spot${got?' got':''}" style="left:${m.x}%;top:${m.y}%;--mh-glow:${r.glow};--mh-rarity:${r.color};--mh-scale:${m.scale||1}" data-mh-id="${m.id}" title="${got?'Tap to morph':'Find!'}">
   <svg viewBox="0 0 100 130" class="mh-spot-svg">${mhClassicNoobSvg(m)}</svg>
   ${got?'<span class="mh-spot-check">✓</span>':''}
  </button>`;
 }).join('');
 const worldTabs=MH_WORLDS.map((w,i)=>{
  const locked=i>=save.worldsUnlocked;
  const done=mhWorldComplete(save,i);
  return `<button type="button" class="mh-world-tab${i===wi?' on':''}${locked?' locked':''}" data-mh-world="${i}" ${locked?'disabled':''}>${w.emoji} ${w.name}${done?' ✓':''}</button>`;
 }).join('');
 const nFound=save.collected.filter(id=>mhMorph(id)&&!mhMorph(id).exclusive).length;
 const xFound=save.collected.filter(id=>mhMorph(id)&&mhMorph(id).exclusive).length;
 return `<div class="mh-world-tabs">${worldTabs}</div>
 <div class="mh-hub-wrap">
  <div class="mh-hub" style="--mh-sky:${world.bg};--mh-grass:${world.ground}">
   <div class="mh-hub-path"></div><div class="mh-hub-stud"></div>${spots}
   ${wear?`<div class="mh-you morphed" style="left:6%;bottom:8%"><svg viewBox="0 0 100 130">${mhClassicNoobSvg(wear)}</svg><span>You · ${wear.name}</span></div>`:''}
  </div>
  <p class="mh-scene-hint">🔎 Tap noobies to collect. Tap again to <b>morph</b> into them!</p>
  <p class="mh-progress">Zone: <b>${found}/${morphs.length}</b> &nbsp;•&nbsp; Normal: <b>${nFound}/${MH_NORMAL_COUNT}</b> &nbsp;•&nbsp; Exclusive: <b>${xFound}/${MH_EXCLUSIVE_COUNT}</b></p>
 </div>`;
}

function mhRenderIndex(save){
 const q=mhState.filter||'';
 const kind=mhState.indexKind||'all';
 let list=MH_MORPHS.slice();
 if(kind==='normal') list=MH_NORMALS;
 if(kind==='exclusive') list=MH_EXCLUSIVES;
 list=mhFilterList(list,q);
 list.sort((a,b)=>a.exclusive!==b.exclusive? (a.exclusive?1:-1) : a.name.localeCompare(b.name));
 const pg=mhPaginate(list,mhState.page||0,48);
 const cards=pg.slice.map(m=>{
  const got=mhHasMorph(save,m.id);
  const r=MH_RARITY[m.rarity]||MH_RARITY.common;
  return `<div class="mh-codex-card${got?' got':''}" style="--mh-rarity:${r.color}">
   <div class="mh-codex-art">${got?`<svg viewBox="0 0 100 130">${mhClassicNoobSvg(m)}</svg>`:'<div class="mh-silhouette">?</div>'}</div>
   <div class="mh-codex-meta"><b>${got?m.name:'???'}</b><span class="mh-codex-rarity">${m.exclusive?'Exclusive':r.label}</span></div>
  </div>`;
 }).join('');
 return `<div class="mh-index">
  <h3>📖 Noobie Index</h3>
  <div class="mh-index-tools">
   <button type="button" class="mh-filter${kind==='all'?' on':''}" data-mh-kind="all">All ${MH_MORPHS.length}</button>
   <button type="button" class="mh-filter${kind==='normal'?' on':''}" data-mh-kind="normal">Normal ${MH_NORMAL_COUNT}</button>
   <button type="button" class="mh-filter${kind==='exclusive'?' on':''}" data-mh-kind="exclusive">Exclusive ${MH_EXCLUSIVE_COUNT}</button>
   <input type="search" id="mh-search" placeholder="Search noobies…" value="${q.replace(/"/g,'&quot;')}"/>
  </div>
  <div class="mh-codex-grid index">${cards}</div>
  <div class="mh-pager">${pg.page>0?'<button type="button" class="mh-btn" data-mh-page="'+(pg.page-1)+'">← Prev</button>':''}<span>Page ${pg.page+1} / ${pg.pages}</span>${pg.page+1<pg.pages?'<button type="button" class="mh-btn" data-mh-page="'+(pg.page+1)+'">Next →</button>':''}</div>
 </div>`;
}

function mhRenderMorph(save){
 const q=mhState.filter||'';
 let list=save.collected.map(id=>mhMorph(id)).filter(Boolean);
 list=mhFilterList(list,q);
 const pg=mhPaginate(list,mhState.page||0,24);
 if(!list.length) return `<div class="mh-morph-tab"><p class="mh-scene-hint">Find noobies in Hunt or Gacha, then morph here!</p></div>`;
 const cards=pg.slice.map(m=>{
  const on=save.wearing===m.id;
  const r=MH_RARITY[m.rarity]||MH_RARITY.common;
  return `<button type="button" class="mh-morph-wear${on?' on':''}" data-mh-wear="${m.id}" style="--mh-rarity:${r.color}">
   <svg viewBox="0 0 100 130">${mhClassicNoobSvg(m)}</svg><span>${m.name}</span>${on?'<em>Morphed</em>':'<em>Tap to morph</em>'}
  </button>`;
 }).join('');
 const wear=mhMorph(save.wearing);
 return `<div class="mh-morph-tab">
  <h3>🎭 Morph &amp; Roleplay</h3>
  <p class="mh-scene-hint">Turn into any noobie you own — your morph also shows on the Rock Teacher!</p>
  <div class="mh-morph-preview large">${wear?`<svg viewBox="0 0 100 130">${mhClassicNoobSvg(wear)}</svg><b>${wear.name}</b><button type="button" class="mh-btn primary" data-mh-wear="${wear.id}">Stay morphed</button>`:'<span>Pick a noobie below</span>'}</div>
  <input type="search" id="mh-search" placeholder="Search your morphs…" value="${q.replace(/"/g,'&quot;')}"/>
  <div class="mh-morph-grid">${cards}</div>
  <div class="mh-pager">${pg.page>0?'<button type="button" class="mh-btn" data-mh-page="'+(pg.page-1)+'">←</button>':''}<span>${pg.page+1}/${pg.pages}</span>${pg.page+1<pg.pages?'<button type="button" class="mh-btn" data-mh-page="'+(pg.page+1)+'">→</button>':''}</div>
 </div>`;
}

function mhRenderGacha(save){
 return `<div class="mh-gacha-tab">
  <h3>🎲 Noobie Gacha</h3>
  <p class="mh-scene-hint">Normal pool: ${MH_NORMAL_COUNT} · Exclusive pool: ${MH_EXCLUSIVE_COUNT}</p>
  <div class="mh-gacha-row">
   <div class="mh-gacha-machine"><div class="mh-gacha-window">?</div><button type="button" class="mh-btn primary" id="mh-gacha-roll">Normal roll — ${MH_GACHA_COST}💰</button></div>
   <div class="mh-gacha-machine exclusive"><div class="mh-gacha-window">★</div><button type="button" class="mh-btn primary" id="mh-gacha-ex">Exclusive roll — ${MH_GACHA_EX_COST}💰</button></div>
  </div>
  <p>Coins: <b>${save.coins}</b></p>
  <div class="mh-code-box"><label>Promo code</label>
   <div class="mh-code-row"><input type="text" id="mh-code-in" placeholder="WELCOMEBUDDY" autocomplete="off"/><button type="button" class="mh-btn" id="mh-code-go">Redeem</button></div>
  </div>
 </div>`;
}

function mhBind(root){
 root.querySelector('#mh-leave')?.addEventListener('click',mhClose);
 root.querySelectorAll('[data-mh-id]').forEach(btn=>btn.addEventListener('click',()=>mhCollect(btn.dataset.mhId)));
 root.querySelectorAll('[data-mh-world]').forEach(btn=>btn.addEventListener('click',()=>mhSetWorld(+btn.dataset.mhWorld)));
 root.querySelectorAll('[data-mh-tab]').forEach(btn=>btn.addEventListener('click',()=>mhSetTab(btn.dataset.mhTab)));
 root.querySelectorAll('[data-mh-wear]').forEach(btn=>btn.addEventListener('click',()=>mhWear(btn.dataset.mhWear)));
 root.querySelector('#mh-gacha-roll')?.addEventListener('click',()=>mhGacha(false));
 root.querySelector('#mh-gacha-ex')?.addEventListener('click',()=>mhGacha(true));
 root.querySelectorAll('[data-mh-kind]').forEach(btn=>btn.addEventListener('click',()=>{ mhState.indexKind=btn.dataset.mhKind; mhState.page=0; mhRender(); }));
 root.querySelectorAll('[data-mh-page]').forEach(btn=>btn.addEventListener('click',()=>{ mhState.page=+btn.dataset.mhPage; mhRender(); }));
 const search=root.querySelector('#mh-search');
 if(search){
  search.oninput=()=>{ mhState.filter=search.value; mhState.page=0; mhRender(); search.focus(); };
 }
 const codeGo=root.querySelector('#mh-code-go');
 const codeIn=root.querySelector('#mh-code-in');
 if(codeGo&&codeIn){
  codeGo.onclick=()=>mhRedeemCode(codeIn.value);
  codeIn.onkeydown=e=>{ if(e.key==='Enter') mhRedeemCode(codeIn.value); };
 }
}

function mhRender(){
 const st=mhState;
 if(!st)return;
 const root=document.getElementById('morphhunt');
 if(!root)return;
 const save=st.save;
 const wi=st.world;
 const owner=mhIsOwner();
 const tab=st.tab||'hunt';
 let body='';
 if(tab==='hunt') body=mhRenderHunt(save,wi);
 else if(tab==='index') body=mhRenderIndex(save);
 else if(tab==='morph') body=mhRenderMorph(save);
 else if(tab==='gacha') body=mhRenderGacha(save);

 root.innerHTML=`<div class="mh-panel mh-ftn">
  <header class="mh-ftn-banner">
   <div class="mh-ftn-banner-text">
    <h2 class="mh-title">Find The Noobies Morphs</h2>
    <p class="mh-ftn-tag">🔎 ${MH_NORMAL_COUNT} normal + ${MH_EXCLUSIVE_COUNT} exclusive noobies · 🎭 Morph · 🎲 Gacha · ${owner?'Owner: ALL unlocked':''}</p>
   </div>
  </header>
  <div class="mh-head">
   <div class="mh-tabs">
    <button type="button" class="mh-tab${tab==='hunt'?' on':''}" data-mh-tab="hunt">🗺️ Hunt</button>
    <button type="button" class="mh-tab${tab==='index'?' on':''}" data-mh-tab="index">📖 Index</button>
    <button type="button" class="mh-tab${tab==='morph'?' on':''}" data-mh-tab="morph">🎭 Morph</button>
    <button type="button" class="mh-tab${tab==='gacha'?' on':''}" data-mh-tab="gacha">🎲 Gacha</button>
   </div>
   <div class="mh-head-stats">
    <span class="mh-coins">💰 <b>${save.coins}</b></span>
    <span>Normal <b>${save.collected.filter(id=>!mhMorph(id)?.exclusive).length}</b>/${MH_NORMAL_COUNT} · Excl. <b>${save.collected.filter(id=>mhMorph(id)?.exclusive).length}</b>/${MH_EXCLUSIVE_COUNT}</span>
    ${owner?'<span class="mh-owner-tag">Owner — all '+MH_MORPHS.length+' unlocked</span>':''}
    <button type="button" class="mh-btn ghost" id="mh-leave">Leave</button>
   </div>
  </div>
  <div class="mh-main ftn">${body}</div>
  <div id="mh-toast" class="mh-toast"></div>
  <div id="mh-found-modal" class="mh-found-modal" hidden></div>
 </div>`;
 mhBind(root);
 if(save.wearing) mhSaveWearId(save.wearing);
}

function playMorphHunt(){
 mhClose();
 if(typeof lithosCloseGameOverlays==='function'){ try{lithosCloseGameOverlays();}catch(_){} }
 mhState={save:mhLoadSave(),world:0,tab:'hunt',page:0,filter:'',indexKind:'all'};
 const wrap=document.createElement('div');
 wrap.id='morphhunt';
 document.body.appendChild(wrap);
 mhRender();
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
}

function mhGetWearingMorph(){ return mhMorph(mhLoadWearId()||window.LITHOS_NOOBIE_WEAR); }

window.playMorphHunt=playMorphHunt;
window.mhClose=mhClose;
window.mhRedeemMorphCode=mhRedeemCode;
window.mhGetWearingMorph=mhGetWearingMorph;
window.mhClassicNoobSvg=mhClassicNoobSvg;
window.mhRefreshTeacherNoob=mhRefreshTeacherNoob;

document.addEventListener('DOMContentLoaded',()=>{ mhRefreshTeacherNoob(); });
if(document.readyState!=='loading') mhRefreshTeacherNoob();
})();
