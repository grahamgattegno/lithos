/* Find The Noobies Morphs — Lithos (268 normal + 104 exclusive) */
(function(){
'use strict';

const MH_STORE_KEY='lithos_morph_hunt_v4';
const MH_BUILD='walk-fusion-v6';
const MH_TILE=34;
const MH_MAP_W=46;
const MH_MAP_H=34;
const MH_WALK_SPEED=3.4;
const MH_INTERACT_R=52;
const MH_BODIES=['classic','tall','chibi','robot','ghost','builder','wide'];
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

const MH_ADJS=['Sunny','Blocky','Turbo','Chill','Neon','Lucky','Cosmic','Minty','Shadow','Golden','Pixel','Hyper','Jolly','Brave','Silly','Zappy','Frosty','Lava','Cloudy','Spark','Retro','Mega','Tiny','Giant','Wacky','Snappy','Bouncy','Glitch','Prism','Amber','Velvet','Coral','Indigo','Mossy','Candy','Storm','Dizzy','Royal','Rusty','Sonic','Bubble'];
const MH_NOUNS=['Buddy','Bloxxer','Pal','Morph','Runner','Rider','Scout','Champ','Star','Builder','Skater','Surfer','Explorer','Guardian','Wizard','Knight','Pilot','DJ','Chef','Gamer','Hero','Ranger','Captain','Comet','Penguin','Fox','Panda','Tiger','Dragon','Phoenix','Robot','Alien','Ghost','Slime','Unicorn','Pirate','Ninja','Viking','Yeti','Yet'];
const MH_ZONE_FLAVOR=[
 ['Plaza','Starter','Town','Park','Green','Spawn','Hub','Square'],
 ['Fair','Cotton','Ferris','Carousel','Rainbow','Ticket','Carnival','Treat'],
 ['Beach','Sand','Wave','Tide','Shell','Surf','Palm','Boardwalk'],
 ['Crystal','Cave','Gem','Shard','Glow','Mine','Prism','Stalactite'],
 ['Backroom','Fluoro','Hall','Liminal','Tape','Buzz','Office','Yellow'],
 ['Sky','Cloud','Island','Float','Breeze','Nest','Drift','Feather'],
 ['Lava','Volcano','Magma','Ash','Ember','Heat','Basalt','Flame'],
 ['Legend','Nexus','Crown','Throne','Myth','Epic','Final','Master']
];
const MH_EX_STEMS=['Vault','Neon','VIP','Turbo','Shadow','Prism','Apex','Glitch','Cosmic','Hyper','Lucky','Mint','Ruby','Bubble','Pixel','Ultra','Omega','Nova','Quantum','Stellar','Mythic','Radiant','Eclipse','Phantom','Crystal','Golden','Silver','Bronze','Diamond','Platinum','Inferno','Frost','Thunder','Solar','Lunar','Aurora','Vortex','Zenith','Nimbus','Pulse'];
const MH_EX_TAGS=['Noobie','Morph','Legend','Star','Buddy','King','Queen','Rider','Scout','Phantom','VIP','Spark','Comet','Warden','Seeker','Champion','Oracle','Sprite','Titan','Sage'];

const MH_ROBLOX_PALS=[
 {head:'#F5CD30',torso:'#0085DB',legs:'#A4BD47',arms:'#F5CD30',label:'Classic Blue Noob'},
 {head:'#F5CD30',torso:'#C4281C',legs:'#0085DB',arms:'#F5CD30',label:'Red Torso Noob'},
 {head:'#F5CD30',torso:'#0085DB',legs:'#C4281C',arms:'#F5CD30',label:'Red Legs Noob'},
 {head:'#D9BC00',torso:'#0D69AC',legs:'#A3A2A5',arms:'#D9BC00',label:'Stud Blue Noob'},
 {head:'#F5CD30',torso:'#A3A2A5',legs:'#A3A2A5',arms:'#F5CD30',label:'Grey Team Noob'},
 {head:'#F5CD30',torso:'#0085DB',legs:'#F5CD30',arms:'#F5CD30',label:'Yellow Legs Noob'},
 {head:'#FF98DC',torso:'#0085DB',legs:'#A4BD47',arms:'#FF98DC',label:'Pink Head Noob'},
 {head:'#F5CD30',torso:'#008000',legs:'#0085DB',arms:'#F5CD30',label:'Green Shirt Noob'},
 {head:'#F5CD30',torso:'#800080',legs:'#A4BD47',arms:'#F5CD30',label:'Purple Shirt Noob'},
 {head:'#F5CD30',torso:'#0085DB',legs:'#800080',arms:'#F5CD30',label:'Purple Pants Noob'},
 {head:'#BFA029',torso:'#004080',legs:'#6B8E23',arms:'#BFA029',label:'Ocean Builder Noob'},
 {head:'#E0AC00',torso:'#CC0000',legs:'#004080',arms:'#E0AC00',label:'Patriot Noob'}
];

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
function mhPick(arr,seed){ return arr[((seed%arr.length)+arr.length)%arr.length]; }
function mhNormalName(i,wi){
 const a=mhPick(MH_ADJS,i*5+wi*17);
 const n=mhPick(MH_NOUNS,i*11+wi*3);
 const z=mhPick(MH_ZONE_FLAVOR[wi],i*7+wi);
 const p=i%5;
 if(p===0) return a+' '+n;
 if(p===1) return z+' '+n;
 if(p===2) return a+' '+z+' '+n;
 if(p===3) return n+' of '+z;
 return a+' '+z;
}
function mhExclusiveName(i){
 if(i===0) return 'Welcome Noobie';
 if(i===1) return 'Party Noobie';
 if(i===2) return 'Gem Crown Noobie';
 return mhPick(MH_EX_STEMS,i*9+3)+' '+mhPick(MH_EX_TAGS,i*13+7);
}
function mhUniqueNames(count,fn){
 const used=new Set();
 const out=[];
 for(let i=0;i<count;i++){
  let name=fn(i);
  let n=2;
  while(used.has(name)){ name=fn(i)+' '+n; n++; }
  used.add(name);
  out.push(name);
 }
 return out;
}
const MH_NORMAL_NAMES=mhUniqueNames(MH_NORMAL_COUNT,(i)=>mhNormalName(i,Math.min(MH_WORLDS_COUNT-1,Math.floor(i/Math.ceil(MH_NORMAL_COUNT/MH_WORLDS_COUNT)))));
const MH_EXCLUSIVE_NAMES=mhUniqueNames(MH_EXCLUSIVE_COUNT,mhExclusiveName);
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
  const classic=MH_ROBLOX_PALS[i%MH_ROBLOX_PALS.length];
  const pal=i%6===0?{head:classic.head,torso:classic.torso,legs:classic.legs,arms:classic.arms}:mhPal(i);
  const name=i%6===0?classic.label:MH_NORMAL_NAMES[i];
  list.push({
   id:'n-'+i,
   name,
   exclusive:false,
   world:wi,
   x:pos.x,y:pos.y,
   scale:0.92+(i%7)*0.03,
   ...pal,
   rarity:MH_RARITY_N[i%MH_RARITY_N.length],
   face:['smile','grin','o','flat','w'][i%5],
   stripe:i%4===1,
   glasses:i%9===2,
   hat:i%17===0?'star':i%23===0?'crown':i%31===0?'headphones':i%29===0?'bow':null,
   body:MH_BODIES[i%MH_BODIES.length]
  });
 }
 for(let i=0;i<MH_EXCLUSIVE_COUNT;i++){
  const pal=i%4===0?MH_ROBLOX_PALS[(i+3)%MH_ROBLOX_PALS.length]:mhPal(i+1000);
  list.push({
   id:'ex-'+i,
   name:MH_EXCLUSIVE_NAMES[i],
   exclusive:true,
   world:MH_WORLDS_COUNT,
   x:50,y:40,
   scale:1.05+(i%5)*0.02,
   head:pal.head||pal.torso,torso:pal.torso,legs:pal.legs,arms:pal.arms||pal.head,
   rarity:i<12?'secret':i<40?'legendary':'exclusive',
   face:['grin','smile','o'][i%3],
   stripe:i%3===0,
   glasses:i%5===1,
   hat:i%7===0?'gem':i%5===0?'party':i%3===0?'crown':i%11===0?'star':null,
   body:MH_BODIES[(i+2)%MH_BODIES.length],
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

function mhHashStr(s){
 let h=2166136261;
 for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
 return h>>>0;
}
function mhGenWorldMap(wi){
 const w=MH_MAP_W,h=MH_MAP_H;
 const tiles=new Uint8Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(x<1||y<1||x>=w-1||y>=h-1) tiles[y*w+x]=1;
  else tiles[y*w+x]=0;
 }
 const mid=Math.floor(h/2);
 const door=8+(mhHashStr('door'+wi)% (w-16));
 for(let x=2;x<w-2;x++) if(Math.abs(x-door)>2) tiles[mid*w+x]=1;
 for(let r=0;r<4+wi;r++){
  const rx=4+mhHashStr('rx'+wi+r)%(w-8);
  const ry=4+mhHashStr('ry'+wi+r)%(h-8);
  if(tiles[ry*w+rx]===0) tiles[ry*w+rx]=2;
 }
 for(let x=2;x<w-2;x+=6) for(let y=2;y<h-2;y+=5){
  if(tiles[y*w+x]===0&&mhHashStr('p'+x+y+wi)%7===0) tiles[y*w+x]=2;
 }
 return {w,h,tiles,spawnTx:3,spawnTy:3,doorTx:door,doorTy:mid,wi};
}
const MH_WORLD_MAPS=MH_WORLDS.map((_,i)=>mhGenWorldMap(i));
(function mhScatterMorphTiles(){
 const occ=new Map();
 MH_WORLDS.forEach((_,wi)=>{
  const map=MH_WORLD_MAPS[wi];
  if(!occ.has(wi)) occ.set(wi,new Set());
  const set=occ.get(wi);
  MH_MORPHS.filter(m=>!m.exclusive&&m.world===wi).forEach(m=>{
   for(let t=0;t<400;t++){
    const tx=3+mhHashStr(m.id+'x'+t)%(map.w-6);
    const ty=3+mhHashStr(m.id+'y'+t)%(map.h-6);
    const k=tx+','+ty;
    if(map.tiles[ty*map.w+tx]!==0||set.has(k)) continue;
    set.add(k);
    m.tileX=tx; m.tileY=ty;
    break;
   }
  });
 });
})();

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

function mhFacePath(face){
 if(face==='grin') return '<path d="M40 29 Q50 36 60 29" stroke="#1a1a20" stroke-width="2" fill="none"/><rect x="46" y="31" width="8" height="3" rx="1" fill="#fff" opacity=".85"/>';
 if(face==='o') return '<ellipse cx="50" cy="31" rx="4" ry="5" fill="none" stroke="#1a1a20" stroke-width="1.8"/>';
 if(face==='flat') return '<line x1="43" y1="31" x2="57" y2="31" stroke="#1a1a20" stroke-width="2" stroke-linecap="round"/>';
 if(face==='w') return '<path d="M42 28 L46 32 L50 28 L54 32 L58 28" stroke="#1a1a20" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
 return '<path d="M42 30 Q50 34 58 30" stroke="#1a1a20" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
}

function mhBodyShape(m){
 const h=m.head||'#F5CD30', t=m.torso||'#0085DB', l=m.legs||'#A4BD47', a=m.arms||h;
 const body=m.body||'classic';
 if(body==='ghost'){
  return `<ellipse cx="50" cy="124" rx="18" ry="3" fill="#000" opacity=".15"/>
   <path d="M34 44 Q50 36 66 44 L66 98 Q58 92 50 98 Q42 92 34 98 Z" fill="${t}" opacity=".95"/>
   <rect x="33" y="8" width="34" height="34" rx="4" fill="${h}"/>`;
 }
 if(body==='robot'){
  return `<ellipse cx="50" cy="124" rx="22" ry="4" fill="#000" opacity=".2"/>
   <rect x="32" y="68" width="14" height="32" rx="1" fill="${l}"/><rect x="54" y="68" width="14" height="32" rx="1" fill="${l}"/>
   <rect x="28" y="42" width="44" height="26" rx="2" fill="${t}"/>
   <rect x="10" y="44" width="16" height="24" rx="1" fill="${a}"/><rect x="74" y="44" width="16" height="24" rx="1" fill="${a}"/>
   <rect x="31" y="6" width="38" height="36" rx="2" fill="${h}"/>
   <rect x="38" y="16" width="8" height="8" fill="#00e8ff"/><rect x="54" y="16" width="8" height="8" fill="#00e8ff"/>
   <rect x="42" y="30" width="16" height="4" fill="#303840"/>`;
 }
 if(body==='chibi'){
  return `<ellipse cx="50" cy="118" rx="16" ry="3" fill="#000" opacity=".2"/>
   <rect x="36" y="72" width="12" height="22" rx="2" fill="${l}"/><rect x="52" y="72" width="12" height="22" rx="2" fill="${l}"/>
   <rect x="34" y="52" width="32" height="20" rx="3" fill="${t}"/>
   <rect x="22" y="54" width="10" height="18" rx="2" fill="${a}"/><rect x="68" y="54" width="10" height="18" rx="2" fill="${a}"/>
   <rect x="28" y="14" width="44" height="40" rx="5" fill="${h}"/>`;
 }
 if(body==='tall'){
  return `<ellipse cx="50" cy="126" rx="20" ry="4" fill="#000" opacity=".2"/>
   <rect x="33" y="62" width="14" height="42" rx="2" fill="${l}"/><rect x="53" y="62" width="14" height="42" rx="2" fill="${l}"/>
   <rect x="31" y="38" width="38" height="26" rx="3" fill="${t}"/>
   <rect x="16" y="40" width="12" height="26" rx="2" fill="${a}"/><rect x="72" y="40" width="12" height="26" rx="2" fill="${a}"/>
   <rect x="35" y="10" width="30" height="28" rx="4" fill="${h}"/>`;
 }
 if(body==='wide'){
  return `<ellipse cx="50" cy="124" rx="26" ry="4" fill="#000" opacity=".2"/>
   <rect x="30" y="66" width="18" height="34" rx="2" fill="${l}"/><rect x="52" y="66" width="18" height="34" rx="2" fill="${l}"/>
   <rect x="24" y="40" width="52" height="28" rx="3" fill="${t}"/>
   <rect x="8" y="42" width="18" height="28" rx="2" fill="${a}"/><rect x="74" y="42" width="18" height="28" rx="2" fill="${a}"/>
   <rect x="33" y="8" width="34" height="34" rx="4" fill="${h}"/>`;
 }
 if(body==='builder'){
  return `<ellipse cx="50" cy="124" rx="22" ry="4" fill="#000" opacity=".2"/>
   <rect x="32" y="66" width="16" height="34" rx="2" fill="${l}"/><rect x="52" y="66" width="16" height="34" rx="2" fill="${l}"/>
   <rect x="30" y="40" width="40" height="28" rx="3" fill="${t}"/>
   <rect x="14" y="42" width="14" height="28" rx="2" fill="${a}"/><rect x="72" y="42" width="14" height="28" rx="2" fill="${a}"/>
   <rect x="33" y="8" width="34" height="34" rx="4" fill="${h}"/>
   <polygon points="50,0 62,10 38,10" fill="#f4c430"/>`;
 }
 return `<ellipse cx="50" cy="124" rx="22" ry="4" fill="#000" opacity=".2"/>
  <rect x="32" y="66" width="16" height="34" rx="2" fill="${l}"/>
  <rect x="52" y="66" width="16" height="34" rx="2" fill="${l}"/>
  <rect x="30" y="40" width="40" height="28" rx="3" fill="${t}"/>
  <rect x="14" y="42" width="14" height="28" rx="2" fill="${a}"/>
  <rect x="72" y="42" width="14" height="28" rx="2" fill="${a}"/>
  <rect x="33" y="8" width="34" height="34" rx="4" fill="${h}"/>`;
}

/** Full R6-style body (head, torso, arms, legs) + archetypes */
function mhClassicNoobSvg(m){
 if(!m) return '';
 let hat='';
 if(m.hat==='crown') hat='<polygon points="50,2 58,14 42,14" fill="#ffd700"/><rect x="42" y="12" width="16" height="5" fill="#e8b020"/>';
 if(m.hat==='star') hat='<polygon points="50,0 52,10 62,10 54,16 57,26 50,20 43,26 46,16 38,10 48,10" fill="#ffe060"/>';
 if(m.hat==='wave') hat='<text x="68" y="18" font-size="12">👋</text>';
 if(m.hat==='party') hat='<circle cx="40" cy="8" r="4" fill="#ff4080"/><circle cx="60" cy="10" r="3" fill="#40c0ff"/>';
 if(m.hat==='gem') hat='<polygon points="50,0 58,14 50,20 42,14" fill="#80e0ff" stroke="#fff" stroke-width="1"/>';
 if(m.hat==='headphones') hat='<path d="M32 24 Q32 8 50 8 Q68 8 68 24" fill="none" stroke="#303840" stroke-width="4"/><rect x="28" y="22" width="8" height="14" rx="2" fill="#404850"/><rect x="64" y="22" width="8" height="14" rx="2" fill="#404850"/>';
 if(m.hat==='bow') hat='<polygon points="50,10 58,4 58,16" fill="#ff5090"/><polygon points="50,10 42,4 42,16" fill="#ff5090"/><circle cx="50" cy="10" r="3" fill="#ffc0d8"/>';
 const stripe=m.stripe&&m.body!=='ghost'?`<rect x="30" y="48" width="40" height="7" fill="rgba(255,255,255,.28)"/><rect x="30" y="58" width="40" height="5" fill="rgba(0,0,0,.12)"/>`:'';
 const glasses=m.glasses&&m.body!=='robot'?'<rect x="36" y="18" width="11" height="9" rx="2" fill="rgba(200,230,255,.35)" stroke="#1a1a20" stroke-width="1.2"/><rect x="53" y="18" width="11" height="9" rx="2" fill="rgba(200,230,255,.35)" stroke="#1a1a20" stroke-width="1.2"/><line x1="47" y1="22" x2="53" y2="22" stroke="#1a1a20" stroke-width="1.2"/>':'';
 const face=m.body==='robot'?'':mhFacePath(m.face||'smile');
 const headShine=m.body==='robot'?'':`<rect x="35" y="10" width="14" height="10" rx="2" fill="#fff" opacity=".12"/>
  <circle cx="42" cy="22" r="3" fill="#1a1a20"/><circle cx="58" cy="22" r="3" fill="#1a1a20"/>
  <circle cx="43" cy="21" r="1" fill="#fff" opacity=".5"/><circle cx="59" cy="21" r="1" fill="#fff" opacity=".5"/>`;
 return `<g>
  ${mhBodyShape(m)}
  ${stripe}
  ${headShine}
  ${glasses}
  ${face}
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
 mhWalkStop();
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

function mhHex(c,a){
 if(!c||c[0]!=='#') return c||'#888';
 const n=parseInt(c.slice(1),16);
 const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
 return `rgba(${r},${g},${b},${a==null?1:a})`;
}
function mhShade(hex,amt){
 if(!hex||hex[0]!=='#') return hex||'#888';
 let n=parseInt(hex.slice(1),16);
 let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
 r=Math.max(0,Math.min(255,r+amt)); g=Math.max(0,Math.min(255,g+amt)); b=Math.max(0,Math.min(255,b+amt));
 return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function mhGradRect(ctx,x,y,w,h,c1,c2){
 const g=ctx.createLinearGradient(x,y,x,y+h);
 g.addColorStop(0,c1); g.addColorStop(1,c2);
 ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
}
function mhPaintNoob3D(ctx,m,x,y,sc,alpha,silhouette){
 if(!m) return;
 ctx.save();
 ctx.translate(x,y);
 ctx.scale(sc,sc);
 ctx.globalAlpha=alpha==null?1:alpha;
 if(silhouette){
  ctx.fillStyle='#0a0c14';
  ctx.fillRect(-18,-52,36,64);
  ctx.restore();
  return;
 }
 const h=m.head||'#F5CD30', t=m.torso||'#0085DB', l=m.legs||'#A4BD47', a=m.arms||h;
 ctx.fillStyle='rgba(0,0,0,.35)';
 ctx.beginPath(); ctx.ellipse(0,58,20,5,0,0,Math.PI*2); ctx.fill();
 if(m.body==='ghost'){
  mhGradRect(ctx,-16,-8,32,52,t,mhShade(t,-40));
  const hg=ctx.createRadialGradient(-6,-36,2,0,-28,24);
  hg.addColorStop(0,mhShade(h,35)); hg.addColorStop(1,mhShade(h,-25));
  ctx.fillStyle=hg; ctx.fillRect(-16,-48,32,32);
 }else if(m.body==='robot'){
  mhGradRect(ctx,-12,18,10,34,l,mhShade(l,-35)); mhGradRect(ctx,2,18,10,34,l,mhShade(l,-35));
  mhGradRect(ctx,-18,0,36,22,t,mhShade(t,-30));
  mhGradRect(ctx,-20,-2,12,20,a,mhShade(a,-20)); mhGradRect(ctx,8,-2,12,20,a,mhShade(a,-20));
  ctx.fillStyle='#505860'; ctx.fillRect(-14,-46,28,28);
  ctx.fillStyle='#00eaff'; ctx.fillRect(-10,-36,8,8); ctx.fillRect(2,-36,8,8);
 }else{
  mhGradRect(ctx,-10,22,9,32,l,mhShade(l,-30)); mhGradRect(ctx,1,22,9,32,l,mhShade(l,-30));
  mhGradRect(ctx,-16,0,32,24,t,mhShade(t,-35));
  if(m.stripe){ ctx.fillStyle='rgba(255,255,255,.25)'; ctx.fillRect(-16,8,32,6); }
  mhGradRect(ctx,-22,2,10,22,a,mhShade(a,-25)); mhGradRect(ctx,12,2,10,22,a,mhShade(a,-25));
  ctx.fillStyle='#303840'; ctx.beginPath(); ctx.arc(-16,14,3,0,Math.PI*2); ctx.arc(16,14,3,0,Math.PI*2); ctx.fill();
  const hg=ctx.createRadialGradient(-8,-36,1,0,-32,26);
  hg.addColorStop(0,mhShade(h,40)); hg.addColorStop(.55,h); hg.addColorStop(1,mhShade(h,-35));
  ctx.fillStyle=hg; ctx.fillRect(-14,-48,28,28);
  ctx.fillStyle='#1a1a20'; ctx.fillRect(-8,-36,5,5); ctx.fillRect(3,-36,5,5);
  ctx.fillStyle='rgba(255,255,255,.7)'; ctx.fillRect(-7,-35,2,2); ctx.fillRect(4,-35,2,2);
  const r=MH_RARITY[m.rarity];
  if(r&&(m.rarity==='legendary'||m.rarity==='epic'||m.rarity==='secret')){
   ctx.shadowColor=r.color; ctx.shadowBlur=8;
   ctx.fillStyle=r.color; ctx.fillRect(-6,-34,3,3); ctx.fillRect(4,-34,3,3);
   ctx.shadowBlur=0;
  }
  if(m.glasses){
   ctx.strokeStyle='#101820'; ctx.lineWidth=1.2;
   ctx.strokeRect(-10,-38,9,8); ctx.strokeRect(1,-38,9,8);
  }
 }
 if(m.hat==='crown'){ ctx.fillStyle='#ffd700'; ctx.fillRect(-8,-54,16,6); }
 if(m.hat==='gem'){ ctx.fillStyle='#80e0ff'; ctx.beginPath(); ctx.moveTo(0,-56); ctx.lineTo(8,-44); ctx.lineTo(0,-38); ctx.lineTo(-8,-44); ctx.fill(); }
 ctx.restore();
}

function mhWalkTileBlocked(map,tx,ty){
 if(tx<0||ty<0||tx>=map.w||ty>=map.h) return true;
 const v=map.tiles[ty*map.w+tx];
 return v===1||v===2;
}
function mhWalkCollide(map,px,py,r){
 const tx0=Math.floor((px-r)/MH_TILE), tx1=Math.floor((px+r)/MH_TILE);
 const ty0=Math.floor((py-r)/MH_TILE), ty1=Math.floor((py+r)/MH_TILE);
 for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++) if(mhWalkTileBlocked(map,tx,ty)) return true;
 return false;
}
function mhWalkEnsurePos(st,wi){
 const map=MH_WORLD_MAPS[wi];
 if(!st.walkPos) st.walkPos={};
 if(!st.walkPos[wi]){
  st.walkPos[wi]={px:map.spawnTx*MH_TILE+MH_TILE/2, py:map.spawnTy*MH_TILE+MH_TILE/2};
 }
 return st.walkPos[wi];
}
function mhWalkNearMorph(save,wi,pos){
 const morphs=mhWorldMorphs(wi);
 let best=null,bd=1e9;
 morphs.forEach(m=>{
  if(m.tileX==null) return;
  const mx=m.tileX*MH_TILE+MH_TILE/2, my=m.tileY*MH_TILE+MH_TILE/2;
  const d=Math.hypot(mx-pos.px,my-pos.py);
  if(d<bd){ bd=d; best={m,d}; }
 });
 if(!best||best.d>MH_INTERACT_R) return null;
 return best.m;
}
function mhWalkStop(){
 if(mhState&&mhState.walkRaf) cancelAnimationFrame(mhState.walkRaf);
 if(mhState) mhState.walkRaf=0;
 document.removeEventListener('keydown',mhWalkKeysDown);
 document.removeEventListener('keyup',mhWalkKeysUp);
}
function mhWalkKeysDown(e){
 if(!mhState||mhState.tab!=='hunt') return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D',' '].includes(e.key)) e.preventDefault();
 if(!mhState.walkKeys) mhState.walkKeys={};
 mhState.walkKeys[e.key]=true;
 if((e.key==='e'||e.key==='E'||e.key===' ')&&mhState.walkNearId) mhCollect(mhState.walkNearId);
}
function mhWalkKeysUp(e){
 if(!mhState||!mhState.walkKeys) return;
 mhState.walkKeys[e.key]=false;
}
function mhWalkDrawFrame(){
 const st=mhState;
 if(!st||st.tab!=='hunt') return;
 const canvas=document.getElementById('mh-walk-canvas');
 if(!canvas) return;
 const ctx=canvas.getContext('2d');
 const wi=st.world;
 const save=st.save;
 const map=MH_WORLD_MAPS[wi];
 const world=MH_WORLDS[wi];
 const pos=mhWalkEnsurePos(st,wi);
 const keys=st.walkKeys||{};
 let vx=0,vy=0;
 if(keys.ArrowLeft||keys.a||keys.A) vx-=1;
 if(keys.ArrowRight||keys.d||keys.D) vx+=1;
 if(keys.ArrowUp||keys.w||keys.W) vy-=1;
 if(keys.ArrowDown||keys.s||keys.S) vy+=1;
 if(vx||vy){
  const len=Math.hypot(vx,vy)||1;
  vx=vx/len*MH_WALK_SPEED; vy=vy/len*MH_WALK_SPEED;
  const npx=pos.px+vx,npy=pos.py+vy;
  if(!mhWalkCollide(map,npx,pos.py,10)) pos.px=npx;
  if(!mhWalkCollide(map,pos.px,npy,10)) pos.py=npy;
 }
 const morphs=mhWorldMorphs(wi);
 const near=mhWalkNearMorph(save,wi,pos);
 st.walkNearId=near?near.id:null;
 const W=canvas.width,H=canvas.height;
 const camX=pos.px-W/2,camY=pos.py-H/2;
 ctx.fillStyle=world.bg;
 ctx.fillRect(0,0,W,H);
 ctx.save();
 ctx.translate(-camX,-camY);
 for(let ty=0;ty<map.h;ty++)for(let tx=0;tx<map.w;tx++){
  const v=map.tiles[ty*map.w+tx];
  const x=tx*MH_TILE,y=ty*MH_TILE;
  if(v===1){
   mhGradRect(ctx,x,y,MH_TILE,MH_TILE,'#3a4048','#1a1e24');
   ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.strokeRect(x+.5,y+.5,MH_TILE-1,MH_TILE-1);
  }else{
   const g=ctx.createLinearGradient(x,y,x,y+MH_TILE);
   g.addColorStop(0,mhShade(world.ground,25)); g.addColorStop(1,world.ground);
   ctx.fillStyle=g; ctx.fillRect(x,y,MH_TILE,MH_TILE);
   ctx.strokeStyle='rgba(0,0,0,.06)'; ctx.strokeRect(x+.5,y+.5,MH_TILE-1,MH_TILE-1);
  }
  if(v===2){
   mhGradRect(ctx,x+6,y+4,MH_TILE-12,MH_TILE-8,'#6a5848','#3a2820');
   ctx.fillStyle='rgba(0,0,0,.2)'; ctx.fillRect(x+8,y+MH_TILE-10,MH_TILE-16,4);
  }
 }
 morphs.sort((a,b)=>(a.tileY||0)-(b.tileY||0));
 morphs.forEach(m=>{
  if(m.tileX==null) return;
  const mx=m.tileX*MH_TILE+MH_TILE/2, my=m.tileY*MH_TILE+MH_TILE/2;
  const got=mhHasMorph(save,m.id);
  const dist=Math.hypot(mx-pos.px,my-pos.py);
  const seen=got||dist<110;
  if(!seen) return;
  const sc=(m.scale||1)*0.72;
  mhPaintNoob3D(ctx,m,mx,my-8,sc,got?0.55:1,!got&&dist>MH_INTERACT_R);
  if(dist<MH_INTERACT_R&&!got){
   ctx.fillStyle='rgba(0,0,0,.65)'; ctx.fillRect(mx-42,my-78,84,14);
   ctx.fillStyle='#ffe8a0'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
   ctx.fillText('?',mx,my-68);
  }else if(got||dist<MH_INTERACT_R){
   ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(mx-48,my-78,96,14);
   ctx.fillStyle='#fff'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
   ctx.fillText(got?m.name.slice(0,14):'???',mx,my-68);
  }
 });
 const wear=mhMorph(save.wearing);
 mhPaintNoob3D(ctx,wear||{head:'#F5CD30',torso:'#0085DB',legs:'#A4BD47',body:'classic'},pos.px,pos.py-8,0.78,1,false);
 ctx.restore();
 if(wi===3||wi===4){
  const grd=ctx.createRadialGradient(W/2,H/2,40,W/2,H/2,Math.max(W,H)*0.65);
  grd.addColorStop(0,'rgba(0,0,0,0)'); grd.addColorStop(1,'rgba(0,0,0,.82)');
  ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
  ctx.save();
  ctx.globalCompositeOperation='destination-out';
  const lg=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,130);
  lg.addColorStop(0,'rgba(0,0,0,1)'); lg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=lg; ctx.fillRect(0,0,W,H);
  ctx.restore();
 }
 const hud=document.getElementById('mh-walk-hud');
 if(hud){
  const found=morphs.filter(m=>mhHasMorph(save,m.id)).length;
  hud.querySelector('.mh-walk-zone').textContent=world.emoji+' '+world.name+' · '+found+'/'+morphs.length;
  const prompt=hud.querySelector('.mh-walk-prompt');
  if(near){
   const got=mhHasMorph(save,near.id);
   prompt.textContent=got?'E — morph into '+near.name:'E / Space — collect noobie!';
   prompt.hidden=false;
  }else prompt.hidden=true;
 }
 st.walkRaf=requestAnimationFrame(mhWalkDrawFrame);
}
function mhWalkStart(){
 mhWalkStop();
 if(!mhState) return;
 mhState.walkKeys={};
 document.addEventListener('keydown',mhWalkKeysDown);
 document.addEventListener('keyup',mhWalkKeysUp);
 mhWalkDrawFrame();
 const root=document.getElementById('morphhunt');
 root?.querySelectorAll('[data-mh-dpad]').forEach(btn=>{
  const dir=btn.dataset.mhDpad;
  const down=()=>{ if(!mhState.walkKeys) mhState.walkKeys={}; mhState.walkKeys[dir]=true; };
  const up=()=>{ if(mhState.walkKeys) mhState.walkKeys[dir]=false; };
  btn.addEventListener('pointerdown',e=>{ e.preventDefault(); down(); });
  btn.addEventListener('pointerup',up);
  btn.addEventListener('pointerleave',up);
 });
 root?.querySelector('#mh-walk-interact')?.addEventListener('click',()=>{
  if(mhState?.walkNearId) mhCollect(mhState.walkNearId);
 });
}

function mhRenderHunt(save, wi){
 const world=MH_WORLDS[wi];
 const morphs=mhWorldMorphs(wi);
 const found=morphs.filter(m=>mhHasMorph(save,m.id)).length;
 const worldTabs=MH_WORLDS.map((w,i)=>{
  const locked=i>=save.worldsUnlocked;
  const done=mhWorldComplete(save,i);
  return `<button type="button" class="mh-world-tab${i===wi?' on':''}${locked?' locked':''}" data-mh-world="${i}" ${locked?'disabled':''}>${w.emoji} ${w.name}${done?' ✓':''}</button>`;
 }).join('');
 const nFound=save.collected.filter(id=>mhMorph(id)&&!mhMorph(id).exclusive).length;
 const xFound=save.collected.filter(id=>mhMorph(id)&&mhMorph(id).exclusive).length;
 return `<div class="mh-world-tabs">${worldTabs}</div>
 <div class="mh-walk-wrap">
  <canvas id="mh-walk-canvas" class="mh-walk-canvas" width="960" height="520" tabindex="0"></canvas>
  <div id="mh-walk-hud" class="mh-walk-hud">
   <span class="mh-walk-zone">${world.emoji} ${world.name}</span>
   <span class="mh-walk-prompt" hidden>Walk close — then collect</span>
   <div class="mh-walk-dpad" aria-label="Move">
    <button type="button" data-mh-dpad="ArrowUp">▲</button>
    <button type="button" data-mh-dpad="ArrowLeft">◀</button>
    <button type="button" data-mh-dpad="ArrowDown">▼</button>
    <button type="button" data-mh-dpad="ArrowRight">▶</button>
   </div>
   <button type="button" class="mh-btn primary" id="mh-walk-interact">Collect / Morph</button>
  </div>
 </div>
 <p class="mh-scene-hint">🚶 <b>Walk</b> with WASD / arrows (Fusion-style rooms). Noobies hide until you get close — like a 3ds Max–shaded hunt! Exclusives: Gacha &amp; codes.</p>
 <p class="mh-progress">Zone: <b>${found}/${morphs.length}</b> &nbsp;•&nbsp; Normal: <b>${nFound}/${MH_NORMAL_COUNT}</b> &nbsp;•&nbsp; Exclusive: <b>${xFound}/${MH_EXCLUSIVE_COUNT}</b></p>`;
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
   <div class="mh-codex-meta"><b class="mh-noob-name">${got?m.name:'???'}</b><span class="mh-codex-rarity">${m.exclusive?'Exclusive':r.label}${got?'':' · walk & find'}</span></div>
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
    <p class="mh-ftn-tag">🚶 Walk-around hunt (Clickteam Fusion–style rooms) · 3D-shaded noobies · Build <b>${MH_BUILD}</b> · ${owner?'Owner: ALL unlocked':''}</p>
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
 mhWalkStop();
 if(tab==='hunt'){
  mhWalkStart();
  root.querySelector('#mh-walk-canvas')?.focus();
 }
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
