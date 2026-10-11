/* Morph Hunt — find unique morphs across worlds (Lithos) */
(function(){
'use strict';

const MH_STORE_KEY='lithos_morph_hunt_v1';
const MH_RARITY={
 common:{label:'Common',color:'#8a9aaa',glow:'rgba(138,154,170,.35)'},
 uncommon:{label:'Uncommon',color:'#4caf7d',glow:'rgba(76,175,125,.4)'},
 rare:{label:'Rare',color:'#4ea8ff',glow:'rgba(78,168,255,.45)'},
 epic:{label:'Epic',color:'#b060e8',glow:'rgba(176,96,232,.5)'},
 legendary:{label:'Legendary',color:'#f8d030',glow:'rgba(248,208,48,.55)'},
 exclusive:{label:'Exclusive',color:'#ff6eb4',glow:'rgba(255,110,180,.55)'}
};
const MH_CATS={fun:'Fun',weird:'Weird',spooky:'Spooky',cosmic:'Cosmic',noobie:'Noobie'};

const MH_WORLDS=[
 {id:'quarry',name:'Quarry Gleam',tagline:'Bright rocks hide silly wanderers.',bg:'linear-gradient(180deg,#87b8d8 0%,#c9e8a8 45%,#8a7a58 100%)',prop:'quarry'},
 {id:'fungal',name:'Fungal Overpass',tagline:'Caps, spores, and things with too many eyes.',bg:'linear-gradient(180deg,#2a1840 0%,#4a2860 40%,#1a3028 100%)',prop:'fungal'},
 {id:'hollow',name:'Hollow Signal',tagline:'Static, silhouettes, and distant humming.',bg:'linear-gradient(180deg,#0a0814 0%,#1a1428 50%,#081018 100%)',prop:'hollow'},
 {id:'nexus',name:'Noob Nexus',tagline:'Block legends and the rarest noobies.',bg:'linear-gradient(180deg,#1a2040 0%,#304878 35%,#181828 100%)',prop:'nexus'}
];

/** @type {{id:string,name:string,cat:keyof MH_CATS,rarity:keyof MH_RARITY,world:number,x:number,y:number,scale?:number}[]} */
const MH_MORPHS=[
 {id:'pebble-hopper',name:'Pebble Hopper',cat:'fun',rarity:'common',world:0,x:18,y:72,scale:1},
 {id:'spring-snout',name:'Spring Snout',cat:'fun',rarity:'uncommon',world:0,x:42,y:58,scale:1.05},
 {id:'tri-tooth',name:'Tri-Tooth Grin',cat:'fun',rarity:'common',world:0,x:68,y:70,scale:.95},
 {id:'loop-tail',name:'Loop-Tail Scout',cat:'fun',rarity:'rare',world:0,x:82,y:48,scale:1},
 {id:'kite-fin',name:'Kite Fin Diver',cat:'fun',rarity:'uncommon',world:0,x:28,y:38,scale:1.1},
 {id:'sun-chime',name:'Sun Chime Blob',cat:'fun',rarity:'legendary',world:0,x:55,y:28,scale:1.15},

 {id:'cap-walker',name:'Cap Walker',cat:'weird',rarity:'common',world:1,x:15,y:65,scale:1},
 {id:'tube-eye',name:'Tube-Eye Floater',cat:'weird',rarity:'uncommon',world:1,x:38,y:55,scale:1},
 {id:'fork-root',name:'Fork-Root Crawler',cat:'weird',rarity:'rare',world:1,x:62,y:68,scale:1.05},
 {id:'bell-jelly',name:'Bell Jelly',cat:'weird',rarity:'common',world:1,x:78,y:42,scale:1},
 {id:'spiral-maw',name:'Spiral Maw',cat:'weird',rarity:'epic',world:1,x:48,y:32,scale:1.1},
 {id:'puff-ladder',name:'Puff Ladder Beast',cat:'weird',rarity:'legendary',world:1,x:22,y:28,scale:1.2},

 {id:'wire-wisp',name:'Wire Wisp',cat:'spooky',rarity:'common',world:2,x:20,y:60,scale:1},
 {id:'hinge-face',name:'Hinge-Face Stalker',cat:'spooky',rarity:'uncommon',world:2,x:45,y:72,scale:1},
 {id:'antenna-kneel',name:'Antenna Kneeler',cat:'spooky',rarity:'rare',world:2,x:70,y:55,scale:1.05},
 {id:'void-moth',name:'Void Moth',cat:'spooky',rarity:'epic',world:2,x:85,y:38,scale:1},
 {id:'rack-spine',name:'Rack Spine',cat:'spooky',rarity:'legendary',world:2,x:52,y:30,scale:1.15},
 {id:'echo-hand',name:'Echo Hand',cat:'spooky',rarity:'rare',world:2,x:30,y:35,scale:1},

 {id:'prism-skate',name:'Prism Skater',cat:'cosmic',rarity:'rare',world:3,x:12,y:68,scale:1},
 {id:'orbit-key',name:'Orbit Key',cat:'cosmic',rarity:'epic',world:3,x:35,y:55,scale:1},
 {id:'rivet-noob',name:'Rivet Noobie',cat:'noobie',rarity:'exclusive',world:3,x:58,y:72,scale:1.12},
 {id:'vault-noob',name:'Vault Noobie',cat:'noobie',rarity:'exclusive',world:3,x:75,y:48,scale:1.15},
 {id:'shard-noob',name:'Shard Noobie',cat:'noobie',rarity:'exclusive',world:3,x:48,y:28,scale:1.18},
 {id:'apex-noob',name:'Apex Noobie',cat:'noobie',rarity:'exclusive',world:3,x:22,y:32,scale:1.25},
 {id:'comet-latch',name:'Comet Latch',cat:'cosmic',rarity:'legendary',world:3,x:88,y:62,scale:1},
 {id:'gate-crawler',name:'Gate Crawler',cat:'weird',rarity:'epic',world:3,x:65,y:38,scale:1.05}
];

function mhIsOwner(){
 if(typeof isOwner!=='undefined'&&isOwner)return true;
 if(typeof document!=='undefined'&&document.body&&document.body.classList.contains('is-owner'))return true;
 try{return localStorage.getItem('lithos_owner')==='1';}catch(_){return false;}
}

function mhDefaultSave(){
 return{collected:[],worldsUnlocked:1};
}
function mhLoadSave(){
 if(mhIsOwner()){
  return{collected:MH_MORPHS.map(m=>m.id),worldsUnlocked:MH_WORLDS.length};
 }
 try{
  const raw=JSON.parse(localStorage.getItem(MH_STORE_KEY)||'null');
  if(!raw||!Array.isArray(raw.collected))return mhDefaultSave();
  return{
   collected:raw.collected.filter(id=>MH_MORPHS.some(m=>m.id===id)),
   worldsUnlocked:Math.max(1,Math.min(MH_WORLDS.length,+(raw.worldsUnlocked||1)))
  };
 }catch(_){return mhDefaultSave();}
}
function mhSaveSave(data){
 if(mhIsOwner())return;
 try{localStorage.setItem(MH_STORE_KEY,JSON.stringify(data));}catch(_){}
}

function mhMorph(id){return MH_MORPHS.find(m=>m.id===id);}
function mhWorldMorphs(wi){return MH_MORPHS.filter(m=>m.world===wi);}
function mhHasMorph(save,id){return save.collected.includes(id);}
function mhWorldComplete(save,wi){
 const need=mhWorldMorphs(wi);
 return need.length>0&&need.every(m=>mhHasMorph(save,m.id));
}

function mhSvgArt(id){
 switch(id){
 case 'pebble-hopper':
  return '<ellipse cx="32" cy="52" rx="22" ry="14" fill="#6a8a5a"/><circle cx="44" cy="38" r="12" fill="#7a9a6a"/><rect x="18" y="48" width="8" height="14" rx="2" fill="#5a7a4a" transform="rotate(-25 22 55)"/>';
 case 'spring-snout':
  return '<path d="M20 50 Q32 20 44 50 Q56 20 68 50" fill="none" stroke="#e08040" stroke-width="8" stroke-linecap="round"/><circle cx="52" cy="42" r="10" fill="#f0a060"/>';
 case 'tri-tooth':
  return '<rect x="22" y="36" width="36" height="28" rx="8" fill="#5090c0"/><polygon points="28,36 32,24 36,36" fill="#fff"/><polygon points="38,36 42,22 46,36" fill="#fff"/><polygon points="48,36 52,26 56,36" fill="#fff"/>';
 case 'loop-tail':
  return '<circle cx="36" cy="40" r="14" fill="#c06090"/><path d="M48 44 C70 20 70 70 48 58" fill="none" stroke="#804060" stroke-width="6"/>';
 case 'kite-fin':
  return '<polygon points="32,55 50,25 68,55 50,45" fill="#40a0d0"/><line x1="50" y1="25" x2="50" y2="60" stroke="#2080a0" stroke-width="3"/>';
 case 'sun-chime':
  return '<circle cx="50" cy="42" r="18" fill="#ffd060"/><line x1="50" y1="10" x2="50" y2="24" stroke="#c9a040" stroke-width="4"/><line x1="30" y1="18" x2="40" y2="28" stroke="#c9a040" stroke-width="3"/><line x1="70" y1="18" x2="60" y2="28" stroke="#c9a040" stroke-width="3"/>';

 case 'cap-walker':
  return '<ellipse cx="50" cy="58" rx="26" ry="10" fill="#503868"/><path d="M30 58 Q50 18 70 58 Z" fill="#8060a8"/><circle cx="42" cy="48" r="4" fill="#ffe080"/><circle cx="58" cy="48" r="7" fill="#ffe080"/>';
 case 'tube-eye':
  return '<rect x="38" y="30" width="24" height="40" rx="12" fill="#60a080"/><circle cx="50" cy="38" r="8" fill="#102018"/><circle cx="50" cy="38" r="3" fill="#80ffc0"/>';
 case 'fork-root':
  return '<path d="M50 20 L50 65 M50 45 L25 65 M50 45 L75 65" stroke="#a07050" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="18" r="8" fill="#c09060"/>';
 case 'bell-jelly':
  return '<path d="M30 55 Q50 25 70 55 L65 62 Q50 50 35 62 Z" fill="#80d0e0" opacity=".9"/><line x1="50" y1="25" x2="50" y2="12" stroke="#608090" stroke-width="2"/>';
 case 'spiral-maw':
  return '<path d="M50 50 m-20 0 a20 20 0 1 1 40 0 a16 16 0 1 1 -32 0 a12 12 0 1 1 24 0" fill="none" stroke="#d04080" stroke-width="5"/><circle cx="50" cy="50" r="4" fill="#ff80a0"/>';
 case 'puff-ladder':
  return '<rect x="28" y="22" width="14" height="14" fill="#90c070"/><rect x="42" y="36" width="14" height="14" fill="#70a050"/><rect x="56" y="50" width="14" height="14" fill="#508030"/><circle cx="35" cy="29" r="5" fill="#ffe0a0"/>';

 case 'wire-wisp':
  return '<path d="M25 55 Q40 15 55 55 T85 55" fill="none" stroke="#a0a8b8" stroke-width="2"/><circle cx="40" cy="35" r="6" fill="#6080a0"/>';
 case 'hinge-face':
  return '<rect x="28" y="32" width="44" height="32" rx="4" fill="#303038"/><line x1="50" y1="32" x2="50" y2="64" stroke="#101018" stroke-width="3"/><circle cx="38" cy="48" r="5" fill="#ff4040"/><rect x="58" y="44" width="10" height="3" fill="#808088"/>';
 case 'antenna-kneel':
  return '<line x1="50" y1="20" x2="50" y2="35" stroke="#8090a0" stroke-width="3"/><circle cx="50" cy="16" r="5" fill="#ff6060"/><path d="M35 65 L45 40 L55 65 Z" fill="#404858"/><path d="M55 65 L65 40 L75 65 Z" fill="#404858"/>';
 case 'void-moth':
  return '<ellipse cx="50" cy="45" rx="8" ry="14" fill="#181820"/><path d="M20 40 Q50 10 80 40 L50 55 Z" fill="#282830" opacity=".85"/>';
 case 'rack-spine':
  return '<line x1="50" y1="18" x2="50" y2="62" stroke="#909098" stroke-width="4"/><line x1="35" y1="28" x2="65" y2="28" stroke="#707078" stroke-width="3"/><line x1="32" y1="38" x2="68" y2="38" stroke="#707078" stroke-width="3"/><line x1="35" y1="48" x2="65" y2="48" stroke="#707078" stroke-width="3"/>';
 case 'echo-hand':
  return '<path d="M30 60 L30 35 L38 35 L38 45 L46 25 L54 45 L54 35 L62 35 L62 60 Z" fill="#506070" opacity=".9"/>';

 case 'prism-skate':
  return '<polygon points="25,55 45,30 65,55 45,48" fill="#80a0ff"/><polygon points="45,30 55,55 35,55" fill="#c0d8ff" opacity=".6"/>';
 case 'orbit-key':
  return '<circle cx="50" cy="45" r="16" fill="none" stroke="#60c0ff" stroke-width="4"/><rect x="46" y="20" width="8" height="18" rx="2" fill="#f0d060"/><circle cx="50" cy="58" r="6" fill="#4080c0"/>';

 case 'rivet-noob':
  return '<rect x="38" y="22" width="24" height="22" rx="2" fill="#d0a858"/><rect x="34" y="44" width="32" height="26" rx="2" fill="#3060a8"/><rect x="28" y="46" width="10" height="22" fill="#d0a858"/><rect x="62" y="44" width="14" height="8" fill="#8090a0" transform="rotate(-20 69 48)"/><rect x="40" y="70" width="10" height="14" fill="#208040"/><rect x="52" y="70" width="10" height="14" fill="#208040"/>';
 case 'vault-noob':
  return '<rect x="36" y="20" width="28" height="24" rx="3" fill="#e8c878"/><rect x="32" y="44" width="36" height="28" rx="2" fill="#505868"/><rect x="32" y="50" width="36" height="6" fill="#9098a8"/><rect x="38" y="72" width="12" height="12" fill="#303840"/><rect x="52" y="72" width="12" height="12" fill="#303840"/><polygon points="50,44 58,36 42,36" fill="#c0a040"/>';
 case 'shard-noob':
  return '<polygon points="50,18 62,32 58,48 42,48 38,32" fill="#90e0ff"/><rect x="36" y="48" width="28" height="22" fill="#4080c0"/><polygon points="30,52 36,48 36,72 24,68" fill="#90e0ff"/><polygon points="70,52 64,48 64,72 76,68" fill="#90e0ff"/><rect x="40" y="70" width="8" height="14" fill="#2060a0"/><rect x="52" y="70" width="8" height="14" fill="#2060a0"/>';
 case 'apex-noob':
  return '<polygon points="50,12 58,28 42,28" fill="#ffd700"/><rect x="38" y="28" width="24" height="20" rx="1" fill="#f0c060"/><rect x="34" y="48" width="32" height="24" fill="#8020a0"/><rect x="30" y="50" width="8" height="20" fill="#f0c060"/><rect x="62" y="50" width="8" height="20" fill="#f0c060"/><rect x="38" y="72" width="10" height="12" fill="#401060"/><rect x="52" y="72" width="10" height="12" fill="#401060"/><line x1="50" y1="12" x2="50" y2="6" stroke="#ffd700" stroke-width="3"/>';

 case 'comet-latch':
  return '<polygon points="20,50 55,25 75,45 45,60" fill="#ffa060"/><circle cx="72" cy="42" r="8" fill="#fff8e0"/>';
 case 'gate-crawler':
  return '<rect x="22" y="40" width="56" height="8" fill="#607080"/><circle cx="32" cy="52" r="10" fill="#8090a0"/><circle cx="50" cy="58" r="8" fill="#708898"/><circle cx="68" cy="52" r="10" fill="#8090a0"/>';
 default:
  return '<circle cx="50" cy="45" r="16" fill="#808890"/>';
 }
}

function mhPropsHtml(prop){
 if(prop==='quarry'){
  return '<div class="mh-prop mh-prop-boulder" style="left:8%;bottom:18%;width:28%;height:22%"></div><div class="mh-prop mh-prop-boulder" style="right:10%;bottom:22%;width:22%;height:18%;opacity:.7"></div>';
 }
 if(prop==='fungal'){
  return '<div class="mh-prop mh-prop-cap" style="left:5%;bottom:25%"></div><div class="mh-prop mh-prop-cap" style="left:55%;bottom:15%;transform:scale(1.3)"></div><div class="mh-prop mh-prop-cap" style="right:8%;bottom:30%;transform:scale(.85)"></div>';
 }
 if(prop==='hollow'){
  return '<div class="mh-prop mh-prop-antenna" style="left:12%;top:18%"></div><div class="mh-prop mh-prop-antenna" style="right:18%;top:22%"></div><div class="mh-prop mh-prop-fog"></div>';
 }
 return '<div class="mh-prop mh-prop-grid" style="inset:15%"></div><div class="mh-prop mh-prop-beam" style="left:50%;top:0"></div>';
}

let mhState=null;

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
 t._tm=setTimeout(()=>t.classList.remove('show'),2200);
}

function mhCollect(id){
 const m=mhMorph(id);
 if(!m||!mhState)return;
 const save=mhState.save;
 if(mhHasMorph(save,id)){
  mhToast('Already logged: '+m.name);
  return;
 }
 save.collected.push(id);
 mhSaveSave(save);
 const wi=m.world;
 if(mhWorldComplete(save,wi)&&save.worldsUnlocked<=wi+1&&wi+1<MH_WORLDS.length){
  save.worldsUnlocked=Math.max(save.worldsUnlocked,wi+2);
  mhSaveSave(save);
  mhToast('World complete! Unlocked: '+MH_WORLDS[wi+1].name);
  try{if(typeof SFX!=='undefined'&&SFX.win)SFX.win();}catch(_){}
 }else{
  mhToast('Found: '+m.name+' ('+MH_RARITY[m.rarity].label+')');
  try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
 }
 mhRender();
}

function mhSetWorld(wi){
 if(!mhState)return;
 if(wi>=mhState.save.worldsUnlocked)return;
 mhState.world=wi;
 mhRender();
}

function mhSetFilter(cat){
 if(!mhState)return;
 mhState.filter=cat;
 mhRender();
}

function mhRender(){
 const st=mhState;
 if(!st)return;
 const root=document.getElementById('morphhunt');
 if(!root)return;
 const save=st.save;
 const wi=st.world;
 const world=MH_WORLDS[wi];
 const morphs=mhWorldMorphs(wi);
 const found=morphs.filter(m=>mhHasMorph(save,m.id)).length;
 const owner=mhIsOwner();

 let codex=MH_MORPHS.filter(m=>{
  if(st.filter!=='all'&&m.cat!==st.filter)return false;
  if(!mhHasMorph(save,m.id)&&m.world>save.worldsUnlocked-1)return false;
  return true;
 });
 codex.sort((a,b)=>{
  const ro=Object.keys(MH_RARITY);
  return ro.indexOf(b.rarity)-ro.indexOf(a.rarity)||a.name.localeCompare(b.name);
 });

 const spots=morphs.map(m=>{
  const got=mhHasMorph(save,m.id);
  const r=MH_RARITY[m.rarity];
  const sc=m.scale||1;
  return `<button type="button" class="mh-spot${got?' got':''}" style="left:${m.x}%;top:${m.y}%;--mh-glow:${r.glow};--mh-rarity:${r.color};--mh-scale:${sc}" data-mh-id="${m.id}" title="${got?'Collected':'Tap to scan'}">
   <svg viewBox="0 0 100 80" class="mh-spot-svg" aria-hidden="true">${mhSvgArt(m.id)}</svg>
   ${got?'<span class="mh-spot-check"></span>':''}
  </button>`;
 }).join('');

 const worldTabs=MH_WORLDS.map((w,i)=>{
  const locked=i>=save.worldsUnlocked;
  const done=mhWorldComplete(save,i);
  return `<button type="button" class="mh-world-tab${i===wi?' on':''}${locked?' locked':''}" data-mh-world="${i}" ${locked?'disabled':''}>${w.name}${done?' ✓':''}</button>`;
 }).join('');

 const filters=['all',...Object.keys(MH_CATS)].map(c=>{
  const on=st.filter===c;
  const label=c==='all'?'All':MH_CATS[c];
  return `<button type="button" class="mh-filter${on?' on':''}" data-mh-filter="${c}">${label}</button>`;
 }).join('');

 const codexHtml=codex.map(m=>{
  const got=mhHasMorph(save,m.id);
  const r=MH_RARITY[m.rarity];
  return `<div class="mh-codex-card${got?' got':''}" style="--mh-rarity:${r.color}">
   <div class="mh-codex-art">${got?`<svg viewBox="0 0 100 80">${mhSvgArt(m.id)}</svg>`:'<div class="mh-silhouette"></div>'}</div>
   <div class="mh-codex-meta">
    <b>${got?m.name:'???'}</b>
    <span class="mh-codex-rarity">${r.label}</span>
    <span class="mh-codex-cat">${MH_CATS[m.cat]}</span>
   </div>
  </div>`;
 }).join('');

 root.innerHTML=`<div class="mh-panel">
  <header class="mh-head">
   <div>
    <h2 class="mh-title">Morph Hunt</h2>
    <p class="mh-sub">${world.tagline}</p>
   </div>
   <div class="mh-head-stats">
    <span><b>${save.collected.length}</b> / ${MH_MORPHS.length} morphs</span>
    ${owner?'<span class="mh-owner-tag">Owner — full codex</span>':''}
    <button type="button" class="mh-btn ghost" id="mh-leave">Leave</button>
   </div>
  </header>
  <div class="mh-world-tabs">${worldTabs}</div>
  <div class="mh-main">
   <div class="mh-scene-wrap">
    <div class="mh-scene" style="background:${world.bg}">
     ${mhPropsHtml(world.prop)}
     ${spots}
    </div>
    <p class="mh-scene-hint">Tap creatures hiding in the scene. Find every morph in this world to unlock the next.</p>
    <p class="mh-progress">This world: <b>${found}</b> / ${morphs.length}</p>
   </div>
   <aside class="mh-codex">
    <h3>Codex</h3>
    <div class="mh-filters">${filters}</div>
    <div class="mh-codex-grid">${codexHtml}</div>
   </aside>
  </div>
  <div id="mh-toast" class="mh-toast"></div>
 </div>`;

 root.querySelector('#mh-leave')?.addEventListener('click',mhClose);
 root.querySelectorAll('[data-mh-id]').forEach(btn=>{
  btn.addEventListener('click',()=>mhCollect(btn.dataset.mhId));
 });
 root.querySelectorAll('[data-mh-world]').forEach(btn=>{
  btn.addEventListener('click',()=>mhSetWorld(+btn.dataset.mhWorld));
 });
 root.querySelectorAll('[data-mh-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>mhSetFilter(btn.dataset.mhFilter));
 });
}

function playMorphHunt(){
 mhClose();
 if(typeof lithosCloseGameOverlays==='function'){
  try{lithosCloseGameOverlays();}catch(_){}
 }
 mhState={save:mhLoadSave(),world:0,filter:'all'};
 const wrap=document.createElement('div');
 wrap.id='morphhunt';
 document.body.appendChild(wrap);
 mhRender();
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
}

window.playMorphHunt=playMorphHunt;
window.mhClose=mhClose;
})();
