/* Find The Noobies Morphs — Lithos (820+180+100 Male Void Fallen + King = 1101 · 5D Abyss) */
(function(){
'use strict';

const MH_STORE_KEY='lithos_morph_hunt_v9';
/* loader bridge: MH_BUILD='void-2d-v46' MH_BUILD='void-2d-v47' MH_BUILD='void-2d-v48' MH_BUILD='void-2d-v49' */
/* loader bridge: MH_BUILD='void-2d-v50' */
const MH_BUILD='void-2d-v82';
const MH_SCENERY_STAMP='PLAGUE_DOCTOR_v82';
const MH_CHAT_LOG_KEY='lithos_mh_chat_log_v1';
const MH_CHAT_POLL_MS=3500;
const MH_CHAT_BROADCAST='lithos-mh-chat';
const MH_KING_CUTSCENE_TITLE='Axe → Sword · Void Judgment';
const MH_SCRIPT_FILE='morph-hunt.js';
const MH_ANCIENT_GLYPHS=['⌬','☵','⛧','◈','☒'];
const MH_ANCIENT_NAMES=['Void Seal','Rift Mark','Depth Eye','Abyss Gate','King Ward'];
const MH_VOID_STORM_NAME='Void Storm';
const MH_VOID_STORM_POWER={id:'void_storm',name:'Void Storm',color:'#ff2020',kind:'storm',range:200};
const MH_KING_STAMP='RED_BLACK_KING_v31';
const MH_MEGA_W=7;
const MH_MEGA_H=6;
const MH_MEGA_BUILDING_KINDS=new Set(['house','shop','stall','booth','tent','cloud_house','sky_bridge','beach_hut','lifeguard','burned_house','ruined_house','void_fallen_building','void_cathedral','fluoro_hall','liminal_door','vault','expedition_tent','expedition_camp','crystal','nexus_ruins','neon_sign']);
const MH_WORLD_MEGA_BUILDINGS=[
 ['house','shop'],
 ['stall','booth','tent'],
 ['beach_hut','lifeguard'],
 ['expedition_tent','crystal'],
 ['fluoro_hall','liminal_door'],
 ['cloud_house','sky_bridge'],
 ['burned_house','expedition_camp'],
 ['nexus_ruins','vault'],
 ['vault','neon_sign'],
 ['void_fallen_building','void_cathedral','ruined_house']
];
const MH_WORLD_PARK_NAMES=[
 ['Buddy North','Buddy East','Buddy South','Buddy West'],
 ['Midway Green','Tent Row','Fair South','Carousel Park'],
 ['Dune Park','Pier Lawn','Surf Green','Shore Rest'],
 ['Crystal Glade','Mine Rest','Gem Grove','Cavern Picnic'],
 ['Liminal Lawn','Fluoro Picnic','Office Patch','Yellow Zone'],
 ['Cloud Rest','Sky Garden','Nest Green','Bridge Park'],
 ['Ash Rest','Lava View','Camp Green','Obsidian Park'],
 ['Nexus Green','Portal Park','Legend Rest','Shrine Lawn'],
 ['Neon Park','Vault Green','Exotic Rest','Prism Lawn'],
 ['Fallen Rest','Void Garden','Abyss Green','King Memorial']
];
const MH_TOTAL_COUNT=1106;
const MH_VOID_KING_DEPTH=100;
const MH_VOID_KING_DIM='5th Dimensional';
const MH_1000D=false;
const MH_2D=true;
const MH_DEPTH_LABEL='Abyss Depth';
const MH_DIM_LABEL='2nd Dimensional';
const MH_VOID_DIM_LABEL='2nd Dimensional';
const MH_VOID_ABYSS_LABEL='Void Fallen Abyss';
const MH_NPC_SPEED=1.25;
const MH_TILE=34;
const MH_MAP_W=46;
const MH_MAP_H=34;
const MH_WALK_SPEED=3.4;
const MH_RUN_SPEED=6.6;
const MH_INTERACT_R=52;
const MH_MAP_NPC_DRAW_R=190;
const MH_HIDDEN_REVEAL_R=108;
const MH_GROVES_PER_NORMAL=10;
const MH_GROVES_EPIC=12;
const MH_GROVES_VOID=8;
const MH_PARK_W=14;
const MH_PARK_H=7;
const MH_ANIMS=['bounce','sway','hop','pulse','float','wiggle','spin','glitch'];
const MH_PROPS=['balloon','gemstick','sword','pet','skate','umbrella','sparkler','book','trophy','rocket'];
const MH_HIGH_RARITY=new Set(['epic','legendary','secret','exclusive','exotic','voidfallen']);
const MH_VOID_FALLEN_COUNT=100;
const MH_BODIES=['classic','tall','chibi','robot','ghost','builder','wide'];
const MH_WEAR_KEY='lithos_noobie_wear';
const MH_NORMAL_COUNT=820;
const MH_EXCLUSIVE_COUNT=180;
const MH_NORMAL_WORLDS=8;
const MH_EXOTIC_WORLD=8;
const MH_VOID_WORLD=9;
const MH_COINS_PER_FIND=15;
const MH_GACHA_COST=50;
const MH_GACHA_EX_COST=120;
const MH_WORLDS_COUNT=10;

const MH_RARITY={
 common:{label:'Common',color:'#b8c0c8',glow:'rgba(184,192,200,.4)'},
 uncommon:{label:'Uncommon',color:'#4caf7d',glow:'rgba(76,175,125,.45)'},
 rare:{label:'Rare',color:'#4ea8ff',glow:'rgba(78,168,255,.5)'},
 epic:{label:'Epic',color:'#b060e8',glow:'rgba(176,96,232,.55)'},
 legendary:{label:'Legendary',color:'#f8d030',glow:'rgba(248,208,48,.6)'},
 exclusive:{label:'Exclusive',color:'#ff6eb4',glow:'rgba(255,110,180,.6)'},
 secret:{label:'Secret',color:'#39ff14',glow:'rgba(57,255,20,.5)'},
 exotic:{label:'Exotic',color:'#ff48e8',glow:'rgba(255,72,232,.75)'},
 voidfallen:{label:'Male Void Fallen',color:'#9040ff',glow:'rgba(120,40,255,.85)'}
};

const MH_WORLDS=[
 {id:'w0',name:'Buddy Plaza',emoji:'🏠',tagline:'Common · Uncommon · Rare — hidden in groves only.',bg:'#87CEEB',ground:'#7ec850',wall:'#6a9850',prop:'#508040'},
 {id:'w1',name:'Rainbow Fair',emoji:'🎡',tagline:'Flat fairground tiles.',bg:'#ffb8d0',ground:'#98d868',wall:'#c06090',prop:'#e04080'},
 {id:'w2',name:'Blocky Beach',emoji:'🏖',tagline:'Flat sand & surf.',bg:'#70c8f0',ground:'#e8d878',wall:'#c0a858',prop:'#40a0c0'},
 {id:'w3',name:'Crystal Cave',emoji:'💎',tagline:'Flat crystal floor — no fog.',bg:'#483868',ground:'#685888',wall:'#302848',prop:'#9080c0'},
 {id:'w4',name:'Shadow Backrooms',emoji:'🚪',tagline:'Flat fluorescent halls.',bg:'#c8c4a8',ground:'#a8a890',wall:'#888878',prop:'#707060'},
 {id:'w5',name:'Sky Islands',emoji:'☁',tagline:'Flat cloud platforms.',bg:'#a8d8ff',ground:'#88c8f0',wall:'#6090c0',prop:'#ffffff'},
 {id:'w6',name:'Lava Park',emoji:'🌋',tagline:'Flat lava tiles.',bg:'#ff8860',ground:'#8a4030',wall:'#602818',prop:'#ff6040'},
 {id:'w7',name:'Legend Nexus',emoji:'👑',tagline:'Flat nexus floor.',bg:'#6080c0',ground:'#506898',wall:'#384868',prop:'#ffd060'},
 {id:'w8',name:'Epic+ Realm',emoji:'💎',tagline:'TELEPORT HERE — Epic · Legendary · Secret · Exotic · Exclusive.',bg:'#281040',ground:'#502868',wall:'#381838',prop:'#ff48e8'},
 {id:'w9',name:'Void Fallen Abyss',emoji:'🕳',tagline:'TELEPORT HERE — Male Void Fallen + King.',bg:'#050008',ground:'#120818',wall:'#282038',prop:'#402060'}
];
const MH_WORLD_DECORS=[
 ['house','shop','park','noobie_statue','fountain','playground'],
 ['ferris','tent','booth','banner','stall','broken_ride'],
 ['beach_hut','pier','palm','surf','lifeguard','wrecked_boat'],
 ['crystal','expedition_tent','mine_cart','stalagmite','drill','crate'],
 ['fluoro_hall','office_desk','carpet','broken_tile','chair','liminal_door'],
 ['cloud_house','sky_bridge','balloon','nest','wreckage','expedition_flag'],
 ['burned_house','lava_rock','expedition_camp','obsidian','broken_statue','ash_pile'],
 ['nexus_ruins','portal','statue','camp','banner','crystal_shrine'],
 ['vault','neon_sign','exotic_wreck','pillar','expedition_tent','gate'],
 ['void_pillar','red_altar','broken_armor','expedition_bones','ruined_house','forbidden_stone','void_fallen_building','void_cathedral']
];

const MH_CODES={
 welcomebuddy:{morph:'ex-welcome',coins:0,title:''},
 coinplease:{coins:100},
 thanksforverified:{coins:100},
 bubblebuddy:{title:'Bubble Buddy'},
 lithosgem:{morph:'ex-gemcrown'},
 happyanniversaryftn1:{morph:'ex-party'},
 glitchhouse:{morph:'code-glitch',coins:120,title:'Glitch Hunter'},
 mythinside:{morph:'code-myth',coins:120,title:'Myth Seeker'},
 minigamevault:{morph:'code-minigame',coins:120,title:'Minigame Master'},
 enterhouse:{coins:60}
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
  arms:mhHsl(i,3,65,52)
 };
}
function mhMorphTraits(i){
 const h=mhHashStr('trait'+i);
 const body=MH_BODIES[h%MH_BODIES.length];
 const hatPool=['star','crown','headphones','bow','gem','party','wave','voidhalo',null];
 return{
  body,
  anim:MH_ANIMS[(h>>>3)%MH_ANIMS.length],
  face:['smile','grin','o','flat','w'][(h>>>6)%5],
  stripe:((h>>>4)&3)!==2,
  sleeves:((h>>>8)&3)===0,
  glasses:((h>>>5)&5)===0,
  hat:hatPool[(h>>>7)%hatPool.length],
  prop:MH_PROPS[(h>>>10)%MH_PROPS.length],
  accent:mhHsl((h>>>11)%360,62,55),
  shoe:mhHsl((h>>>13)%360,45,32)
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
const MH_NORMAL_NAMES=mhUniqueNames(MH_NORMAL_COUNT,(i)=>mhNormalName(i,Math.min(MH_NORMAL_WORLDS-1,Math.floor(i/Math.ceil(MH_NORMAL_COUNT/MH_NORMAL_WORLDS)))));
const MH_EXCLUSIVE_NAMES=mhUniqueNames(MH_EXCLUSIVE_COUNT,mhExclusiveName);
const MH_VOID_MALE_PRE=['Abyss','Fallen','Void','Null','Rift','Dark','Hollow','Fractal','Obsidian','Eclipse','Quantum','Silent','Nebula','Zero','Lost'];
const MH_VOID_MALE_SUF=['King','Knight','Walker','Guardian','Reaper','Strider','Lord','Phantom','Exile','Drifter','Monarch','Oracle','Wraith','Nomad','Brother'];
function mhVoidName(i){
 return mhPick(MH_VOID_MALE_PRE,i*5+1)+' '+mhPick(MH_VOID_MALE_SUF,i*11+3);
}
const MH_VOID_MALE_BODIES=['classic','tall','builder','wide','robot','ghost'];
const MH_VOID_HATS=['voidhorn','voidhalo','riftshard','gem','crown','headphones','bow','party','star',null,null];
const MH_VOID_ATTACKS=[
 {id:'rift_slash',name:'Rift Slash',color:'#c080ff',kind:'arc',speed:9,range:95},
 {id:'abyss_bolt',name:'Abyss Bolt',color:'#9040ff',kind:'beam',speed:11,range:140},
 {id:'shadow_lance',name:'Shadow Lance',color:'#6080c0',kind:'beam',speed:13,range:120},
 {id:'void_orbs',name:'Void Orbs',color:'#ff48e8',kind:'orbs',speed:7,range:80},
 {id:'maelstrom_cut',name:'Maelstrom Cut',color:'#80e0ff',kind:'arc',speed:10,range:100},
 {id:'fallen_rend',name:'Fallen Rend',color:'#b010ff',kind:'arc',speed:8,range:110},
 {id:'depth_spike',name:'Depth Spike',color:'#7040c0',kind:'beam',speed:12,range:130},
 {id:'king_breaker',name:'King Breaker',color:'#ff4040',kind:'nova',speed:6,range:90}
];
const MH_VOID_POWERS=[
 {id:'void_step',name:'Void Step',color:'#c898ff',kind:'dash',dist:90,cooldown:1.2},
 {id:'shadow_shield',name:'Shadow Shield',color:'#5060a0',kind:'shield',time:2.8,cooldown:2.5},
 {id:'abyss_surge',name:'Abyss Surge',color:'#9040ff',kind:'nova',range:100,cooldown:2},
 {id:'rift_heal',name:'Rift Mend',color:'#80ffb0',kind:'heal',coins:8,cooldown:3},
 {id:'fallen_rage',name:'Fallen Rage',color:'#ff6080',kind:'buff',time:4,cooldown:4},
 {id:'mirror_clone',name:'Mirror Echo',color:'#80e8ff',kind:'echo',count:3,cooldown:2.2},
 {id:'gravity_well',name:'Gravity Well',color:'#6040a0',kind:'pull',range:120,cooldown:2.8},
 {id:'forbidden_storm',name:'Forbidden Storm',color:'#ff2020',kind:'storm',range:150,cooldown:3.5}
];
function mhAssignVoidCombat(m){
 if(m.rarity!=='voidfallen'&&!m.voidFallen) return;
 if(m.voidKing){
  m.voidAttack={id:'king_cleave',name:'Greataxe Cleave',color:'#ff3030',kind:'arc',speed:9,range:130};
  m.voidPower={...MH_VOID_STORM_POWER,id:'forbidden_storm',name:'Forbidden Void Storm',range:240};
  return;
 }
 const h=mhHashStr(m.id+'vfc');
 m.voidAttack=MH_VOID_ATTACKS[h%MH_VOID_ATTACKS.length];
 m.voidPower={...MH_VOID_STORM_POWER};
}
function mhVoidTraits(i){
 const h=mhHashStr('vftrait'+i);
 return{
  body:MH_VOID_MALE_BODIES[(h>>>1)%MH_VOID_MALE_BODIES.length],
  anim:MH_ANIMS[(h>>>3)%MH_ANIMS.length],
  face:['flat','grin','w','smile','o'][(h>>>6)%5],
  stripe:((h>>>4)&3)===0,
  glasses:((h>>>5)&9)===0,
  hat:MH_VOID_HATS[(h>>>7)%MH_VOID_HATS.length],
  prop:MH_PROPS[(h>>>10)%MH_PROPS.length],
  voidMark:(h>>>2)%19,
  voidEyes:['#70e8ff','#ff58c8','#ffe048','#98ff88','#c898ff','#ff8860'][(h>>>12)%6],
  voidPalette:(h>>>9)%6,
  voidMale:true,
  fallen:true
 };
}
function mhVoidPal(i,kind){
 const h=mhHashStr('vfpal'+i);
 const schemes=[
  {head:350,torso:0,legs:280,s:38},
  {head:340,torso:350,legs:300,s:42},
  {head:0,torso:320,legs:290,s:45},
  {head:280,torso:10,legs:270,s:40},
  {head:300,torso:340,legs:310,s:44},
  {head:15,torso:280,legs:300,s:36}
 ];
 const ki=(((kind==null?i:kind)%schemes.length)+schemes.length)%schemes.length;
 const s=schemes[ki];
 const b=12+(i%28);
 return{
  head:`hsl(${s.head+(h%12)},${s.s}%,${Math.max(8,b+8)}%)`,
  torso:`hsl(${s.torso+(h%16)},${Math.min(72,s.s+8)}%,${Math.max(12,b)}%)`,
  legs:`hsl(${s.legs+(h%10)},${Math.max(22,s.s-8)}%,${Math.max(6,b-6)}%)`,
  arms:`hsl(${s.head+(h%8)},${s.s}%,${Math.max(8,b+4)}%)`,
  voidAccent:`hsl(${s.torso+20},78%,${52+(h%16)}%)`
 };
}
const MH_VOID_NAMES=mhUniqueNames(MH_VOID_FALLEN_COUNT,mhVoidName);
function mhSpotPos(idx,total){
 const cols=11;
 const row=Math.floor(idx/cols);
 const col=idx%cols;
 return{
  x:6+col*(88/(cols-1)),
  y:22+row*(58/Math.max(1,Math.ceil(total/cols)-1))
 };
}
function mhHashStr(s){
 let h=2166136261;
 for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
 return h>>>0;
}

function mhBuildMorphs(){
 const list=[];
 const perWorld=Math.ceil(MH_NORMAL_COUNT/MH_NORMAL_WORLDS);
 for(let i=0;i<MH_NORMAL_COUNT;i++){
  let wi=Math.min(MH_NORMAL_WORLDS-1,Math.floor(i/perWorld));
  const idx=i-wi*perWorld;
  const pos=mhSpotPos(idx,perWorld);
  const pal=i<MH_ROBLOX_PALS.length
   ?{head:MH_ROBLOX_PALS[i].head,torso:MH_ROBLOX_PALS[i].torso,legs:MH_ROBLOX_PALS[i].legs,arms:MH_ROBLOX_PALS[i].arms}
   :mhPal(i+17);
  const name=i<MH_ROBLOX_PALS.length?MH_ROBLOX_PALS[i].label:MH_NORMAL_NAMES[i];
  let rarity=MH_RARITY_N[i%MH_RARITY_N.length];
  if(rarity==='legendary'&&(i%11===0||i%7===0||i%13===0)) rarity='exotic';
  if(i%17===0) rarity='exotic';
  if(rarity==='exotic') wi=MH_EXOTIC_WORLD;
  const tr=mhMorphTraits(i);
  list.push({
   id:'n-'+i,
   name,
   exclusive:false,
   world:wi,
   x:pos.x,y:pos.y,
   scale:0.92+(i%7)*0.03,
   ...pal,
   rarity,
   ...tr
  });
 }
 for(let i=0;i<MH_EXCLUSIVE_COUNT;i++){
  const pal=mhPal(i+1000);
  const tr=mhMorphTraits(i+5000);
  list.push({
   id:'ex-'+i,
   name:MH_EXCLUSIVE_NAMES[i],
   exclusive:true,
   world:MH_EXOTIC_WORLD,
   x:50,y:40,
   scale:1.05+(i%5)*0.02,
   head:pal.head||pal.torso,torso:pal.torso,legs:pal.legs,arms:pal.arms||pal.head,
   rarity:i<12?'secret':i<40?'legendary':'exclusive',
   ...tr,
   hat:tr.hat|| (i%7===0?'gem':i%5===0?'party':null),
   vaultOnly:i>=12&&i%9!==0
  });
  const ex=list[list.length-1];
  if(i%9===0||i<6) ex.rarity='exotic';
  if(ex.rarity==='exotic') ex.vaultOnly=false;
 }
 const welcome=list.find(m=>m.id==='ex-0');
 if(welcome){ welcome.id='ex-welcome'; welcome.name='Welcome Noobie'; welcome.hat='wave'; }
 const party=list.find(m=>m.id==='ex-1');
 if(party){ party.id='ex-party'; party.name='Party Noobie'; party.hat='party'; }
 const gem=list.find(m=>m.id==='ex-2');
 if(gem){ gem.id='ex-gemcrown'; gem.name='Gem Crown Noobie'; gem.hat='gem'; }
 for(let i=0;i<MH_VOID_FALLEN_COUNT;i++){
  const tr=mhVoidTraits(i);
  const pal=mhVoidPal(i,tr.voidPalette);
  list.push({
   id:'vf-'+i,
   name:MH_VOID_NAMES[i],
   exclusive:false,
   voidFallen:true,
   voidMale:true,
   world:MH_VOID_WORLD,
   x:50,y:40,
   scale:0.96+(i%9)*0.045,
   ...pal,
   ...tr,
   rarity:'voidfallen'
  });
 }
 list.push({
  id:'vf-king',
  name:'Void Fallen King',
  exclusive:false,
  voidFallen:true,
  voidMale:true,
  voidKing:true,
  voidDepth:MH_VOID_KING_DEPTH,
  void5D:false,
  world:MH_VOID_WORLD,
  x:50,y:40,
  scale:1.32,
  head:'#0a0a0a',
  torso:'#580808',
  legs:'#141414',
  arms:'#1a1a1a',
  body:'tall',
  anim:'pulse',
  face:'flat',
  stripe:false,
  glasses:false,
  hat:null,
  prop:null,
  voidMark:0,
  voidEyes:'#ff2020',
  voidAccent:'#cc0000',
  fallen:true,
  rarity:'voidfallen'
 });
 list.push({
  id:'code-glitch', name:'Glitch Noobie', exclusive:true, codeOnly:true, world:0,
  head:'#39ff14', torso:'#283040', legs:'#1a2030', arms:'#39ff14', body:'robot',
  anim:'glitch', face:'w', rarity:'secret', hat:null, prop:'sparkler'
 });
 list.push({
  id:'code-myth', name:'Myth Noobie', exclusive:true, codeOnly:true, world:7,
  head:'#ffd060', torso:'#506898', legs:'#384868', arms:'#ffd060', body:'tall',
  anim:'float', face:'grin', rarity:'legendary', hat:'crown', prop:'trophy'
 });
 list.push({
  id:'code-minigame', name:'Minigame Noobie', exclusive:true, codeOnly:true, world:1,
  head:'#ff48e8', torso:'#0085DB', legs:'#A4BD47', arms:'#ff48e8', body:'classic',
  anim:'bounce', face:'grin', rarity:'epic', hat:'party', prop:'gemstick'
 });
 list.push({
  id:'ex-mayor', name:'Mayor Noobie', exclusive:true, mayorOnly:true, world:0,
  head:'#ffe8a0', torso:'#2040a0', legs:'#303850', arms:'#ffe8a0', body:'tall',
  anim:'sway', face:'grin', rarity:'legendary', hat:'crown', prop:'trophy',
  stripe:true, glasses:true, accent:'#ffd060'
 });
 list.push({
  id:'ex-plague-doctor', name:'Plague Doctor Noobie', exclusive:true, plagueOnly:true, world:0,
  head:'#2a3038', torso:'#1a2830', legs:'#141820', arms:'#2a3038', body:'tall',
  anim:'sway', face:'flat', rarity:'exclusive', hat:'plague', prop:'book',
  stripe:false, glasses:false, accent:'#80ffb0', plagueDoctor:true,
  voidAttack:{id:'foul_cure',name:'Foul Cure',color:'#80ffb0',kind:'orbs',speed:5,range:70},
  voidPower:{id:'death_sigil',name:'Death Sigil',color:'#303038',kind:'nova',speed:4,range:95},
  plagueLines:['I am the cure.','Oh my, the sickness…','Then I can fix you.']
 });
 return list;
}
const MH_MORPHS=mhBuildMorphs();
MH_MORPHS.forEach(mhAssignVoidCombat);
const MH_NORMALS=MH_MORPHS.filter(m=>!m.exclusive&&!m.voidFallen);
const MH_EXCLUSIVES=MH_MORPHS.filter(m=>m.exclusive);
const MH_EXOTICS=MH_MORPHS.filter(m=>m.rarity==='exotic');
const MH_EXOTIC_COUNT=MH_EXOTICS.length;
const MH_VOID_FALLEN=MH_MORPHS.filter(m=>m.rarity==='voidfallen');
const MH_VOID_COUNT=MH_VOID_FALLEN.length;

function mhHuntWorld(m){
 if(!m||m.codeOnly||m.mayorOnly||m.plagueOnly) return -1;
 if(m.voidKing||m.voidFallen||m.rarity==='voidfallen') return MH_VOID_WORLD;
 if(MH_HIGH_RARITY.has(m.rarity)) return MH_EXOTIC_WORLD;
 const w=typeof m.world==='number'?m.world:0;
 return w>=MH_EXOTIC_WORLD?0:w;
}
function mhWorldRarityHint(wi){
 if(wi===MH_VOID_WORLD) return 'Void Fallen only';
 if(wi===MH_EXOTIC_WORLD) return 'Epic · Legendary · Secret · Exotic · Exclusive';
 return 'Common · Uncommon · Rare (hidden groves)';
}
function mhWorldTeleportUnlocked(save,wi){
 if(wi===MH_EXOTIC_WORLD||wi===MH_VOID_WORLD) return true;
 return wi<save.worldsUnlocked;
}
function mhGroveCount(wi){
 if(wi===MH_VOID_WORLD) return MH_GROVES_VOID;
 if(wi===MH_EXOTIC_WORLD) return MH_GROVES_EPIC;
 return MH_GROVES_PER_NORMAL;
}

function mhTileWalkable(map,tx,ty){
 if(tx<1||ty<1||tx>=map.w-1||ty>=map.h-1) return false;
 return map.tiles[ty*map.w+tx]!==1;
}
function mhGenWorldMap(wi){
 const w=MH_MAP_W,h=MH_MAP_H;
 const tiles=new Uint8Array(w*h);
 const cx=Math.floor(w/2), cy=Math.floor(h/2);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(x<1||y<1||x>=w-1||y>=h-1) tiles[y*w+x]=1;
  else tiles[y*w+x]=0;
 }
 if(wi===MH_VOID_WORLD){
  for(let x=2;x<w-2;x++)for(let y=2;y<h-2;y++){
   const hv=mhHashStr('abyss'+x+y);
   if(Math.abs(x-cx)<=2&&Math.abs(y-cy)<=2) tiles[y*w+x]=12;
   else if(hv%17===0) tiles[y*w+x]=10;
   else if(hv%13===0) tiles[y*w+x]=11;
   else tiles[y*w+x]=9;
  }
  return {w,h,tiles,spawnTx:cx,spawnTy:cy+3,wi,throneTx:cx,throneTy:cy,abyssStamp:'v48'};
 }
 if(wi===MH_EXOTIC_WORLD){
  for(let x=2;x<w-2;x++)for(let y=2;y<h-2;y++){
   if(mhHashStr('exf'+x+y)%11===0) tiles[y*w+x]=6;
  }
  return {w,h,tiles,spawnTx:cx,spawnTy:cy,wi};
 }
 if(wi===2){
  for(let x=1;x<w-1;x++)for(let y=h-7;y<h-1;y++) tiles[y*w+x]=3;
 }
 if(wi===4){
  for(let x=2;x<w-2;x++)for(let y=2;y<h-2;y++){
   if(((x+y+wi)%4)===0) tiles[y*w+x]=4;
  }
 }
 if(wi===3){
  for(let i=0;i<28;i++){
   const tx=2+mhHashStr('cavx'+wi+i)%(w-4), ty=2+mhHashStr('cavy'+wi+i)%(h-4);
   if(tiles[ty*w+tx]===0) tiles[ty*w+tx]=5;
  }
 }
 if(wi===5){
  for(let i=0;i<18;i++){
   const tx=2+mhHashStr('clx'+i)%(w-4), ty=2+mhHashStr('cly'+i)%(h-4);
   if(tiles[ty*w+tx]===0) tiles[ty*w+tx]=7;
  }
 }
 if(wi===6){
  for(let x=2;x<w-2;x++)for(let y=2;y<h-2;y++){
   if(mhHashStr('lav'+x+y)%9===0) tiles[y*w+x]=8;
  }
 }
 const spx=3+mhHashStr('spx'+wi)%6, spy=3+mhHashStr('spy'+wi)%6;
 return {w,h,tiles,spawnTx:spx,spawnTy:spy,wi};
}
function mhPaintWorldGroundTile(ctx,x,y,v,world,wi){
 if(v===1){
  ctx.fillStyle=world.wall||'#4a5058';
  ctx.fillRect(x,y,MH_TILE,MH_TILE);
  return;
 }
 if(v===3&&wi===2){
  ctx.fillStyle='#4090c8'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
  ctx.fillStyle='rgba(255,255,255,.15)'; ctx.fillRect(x,y+MH_TILE-6,MH_TILE,6);
  return;
 }
 if(v===4&&wi===4){
  ctx.fillStyle=((x/MH_TILE+y/MH_TILE)&1)?'#d8d4b0':'#c8c4a0';
  ctx.fillRect(x,y,MH_TILE,MH_TILE);
  ctx.fillStyle='#ffffa0'; ctx.fillRect(x+4,y+4,MH_TILE-8,3);
  return;
 }
 if(v===5&&wi===3){
  ctx.fillStyle='#585088'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
  ctx.fillStyle='#9080c0'; ctx.beginPath(); ctx.moveTo(x+MH_TILE/2,y+4); ctx.lineTo(x+MH_TILE-4,y+MH_TILE-4); ctx.lineTo(x+4,y+MH_TILE-4); ctx.fill();
  return;
 }
 if(v===6&&wi===MH_EXOTIC_WORLD){
  ctx.fillStyle='#381848'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
  ctx.fillStyle='#ff48e8'; ctx.fillRect(x+6,y+MH_TILE/2, MH_TILE-12,3);
  return;
 }
 if(v===7&&wi===5){
  ctx.fillStyle='#a8d8ff'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
  ctx.fillStyle='rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(x+MH_TILE/2,y+MH_TILE/2,10,0,Math.PI*2); ctx.fill();
  return;
 }
 if(v===8&&wi===6){
  ctx.fillStyle='#602818'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
  ctx.fillStyle='#ff6040'; ctx.fillRect(x+8,y+10,6,4);
  return;
 }
 if(wi===MH_VOID_WORLD){
  if(v===12){
   ctx.fillStyle='#280808'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
   ctx.fillStyle='#ff3030'; ctx.fillRect(x+4,y+4,MH_TILE-8,MH_TILE-8);
   ctx.fillStyle='#0a0a0a'; ctx.fillRect(x+10,y+10,MH_TILE-20,MH_TILE-20);
   return;
  }
  if(v===10){
   ctx.fillStyle='#180610'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
   ctx.fillStyle='#ff2040'; ctx.fillRect(x+6,y+MH_TILE/2-1,MH_TILE-12,3);
   ctx.fillStyle='rgba(255,40,80,.25)'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
   return;
  }
  if(v===11){
   ctx.fillStyle='#0c0818'; ctx.fillRect(x,y,MH_TILE,MH_TILE);
   ctx.fillStyle='#9040ff'; ctx.fillRect(x+8,y+12,4,4); ctx.fillRect(x+20,y+22,3,3);
   return;
  }
  if(v===9||v===0){
   const dark=((x/MH_TILE+y/MH_TILE)&1)?'#06040c':'#0e0a14';
   ctx.fillStyle=dark; ctx.fillRect(x,y,MH_TILE,MH_TILE);
   ctx.fillStyle='rgba(80,0,40,.12)'; ctx.fillRect(x,y+MH_TILE-4,MH_TILE,4);
   return;
  }
 }
 const pair=mhFlatGroundPair(world.ground);
 ctx.fillStyle=((x/MH_TILE+y/MH_TILE)&1)?mhShade(world.ground,18):world.ground;
 ctx.fillRect(x,y,MH_TILE,MH_TILE);
}
const MH_WORLD_MAPS=MH_WORLDS.map((_,i)=>mhGenWorldMap(i));
function mhEnterableKinds(wi){
 return MH_WORLD_MEGA_BUILDINGS[wi]||MH_WORLD_MEGA_BUILDINGS[0];
}
function mhPickDecorKind(themes,wi,i){
 for(let t=0;t<10;t++){
  const kind=themes[mhHashStr('deck'+wi+i+t)%themes.length];
  if(MH_MEGA_BUILDING_KINDS.has(kind)) continue;
  if(kind==='noobie_statue'||kind==='park'||kind==='playground') continue;
  return kind;
 }
 return themes.find(k=>!MH_MEGA_BUILDING_KINDS.has(k))||'fountain';
}
function mhGenVoidAbyssLandmarks(map){
 map.playerSpawnTx=map.spawnTx;
 map.playerSpawnTy=map.spawnTy;
 const kinds=['void_fallen_building','void_cathedral','ruined_house','void_fallen_building'];
 const slots=[
  {tx:3,ty:3},{tx:map.w-MH_MEGA_W-3,ty:3},
  {tx:3,ty:map.h-MH_MEGA_H-3},{tx:map.w-MH_MEGA_W-3,ty:map.h-MH_MEGA_H-3}
 ];
 return slots.map((s,i)=>({
  tx:s.tx, ty:s.ty, kind:kinds[i], mega:true, footW:MH_MEGA_W, footH:MH_MEGA_H, id:'void-abyss-'+i
 })).filter(p=>mhMegaFits(map,p.tx,p.ty,p.footW,p.footH));
}
function mhGenLandmarks(wi,map){
 if(wi===MH_VOID_WORLD) return mhGenVoidAbyssLandmarks(map);
 const enter=mhEnterableKinds(wi);
 const sp=mhMapSpawnPos(map);
 const sx=Math.floor(sp.px/MH_TILE), sy=Math.floor(sp.py/MH_TILE);
 map.playerSpawnTx=sx; map.playerSpawnTy=sy;
 const ring=[
  {dx:4,dy:0,i:0},{dx:-4,dy:0,i:1},{dx:0,dy:4,i:2},{dx:0,dy:-4,i:3},
  {dx:3,dy:3,i:4},{dx:-3,dy:3,i:5},{dx:3,dy:-3,i:6},{dx:-3,dy:-3,i:7}
 ];
 const spots=ring.map(r=>({
  tx:sx+r.dx, ty:sy+r.dy,
  kind:enter[(r.i+(wi*2))%enter.length],
  mega:true, footW:MH_MEGA_W, footH:MH_MEGA_H,
  id:'bld-'+wi+'-'+sx+'-'+sy+'-'+r.i
 }));
 for(let i=0;i<4;i++){
  const tx=sx+((i%3)-1)*9, ty=sy+Math.floor(i/2)*8-4;
  if(tx>2&&ty>2&&tx<map.w-MH_MEGA_W-1&&ty<map.h-MH_MEGA_H-1){
   spots.push({tx,ty,kind:enter[i%enter.length],mega:true,footW:MH_MEGA_W,footH:MH_MEGA_H,id:'bld-'+wi+'-extra-'+i});
  }
 }
 if(wi===MH_VOID_WORLD&&map.throneTx!=null){
  spots.push({tx:map.throneTx-5,ty:map.throneTy-3,kind:'void_fallen_building',mega:true,footW:8,footH:6,id:'bld-void-tower'});
  spots.push({tx:map.throneTx+4,ty:map.throneTy-1,kind:'void_cathedral',mega:true,footW:MH_MEGA_W,footH:MH_MEGA_H,id:'bld-void-cath'});
 }
 if(spots.filter(p=>mhMegaFits(map,p.tx,p.ty,p.footW,p.footH)).length<4){
  for(let r=5;r<16;r++){
   for(let a=0;a<12;a++){
    const dx=Math.round(Math.cos(a*Math.PI/6)*r);
    const dy=Math.round(Math.sin(a*Math.PI/6)*r);
    spots.push({
     tx:sx+dx, ty:sy+dy,
     kind:enter[(spots.length+wi)%enter.length],
     mega:true, footW:MH_MEGA_W, footH:MH_MEGA_H,
     id:'bld-'+wi+'-scan-'+dx+'-'+dy
    });
   }
  }
 }
 const seen=new Set();
 return spots.filter(p=>{
  const fw=p.footW||MH_MEGA_W, fh=p.footH||MH_MEGA_H;
  if(!mhMegaFits(map,p.tx,p.ty,fw,fh)) return false;
  const key=p.tx+','+p.ty;
  if(seen.has(key)) return false;
  seen.add(key);
  return true;
 }).slice(0,12);
}
function mhGenWorldFeature(wi,map){
 if(wi!==4||map.playerSpawnTx==null) return null;
 const sx=map.playerSpawnTx, sy=map.playerSpawnTy;
 return {type:'backrooms_atrium',tx:sx-6,ty:sy-4,w:12,h:7,label:'LIMINAL ATRIUM · BACKROOMS'};
}
function mhGenCourt(map,wi){
 const sx=map.playerSpawnTx, sy=map.playerSpawnTy;
 if(sx==null||wi!==0) return null;
 const w=12,h=8;
 const tx=Math.max(2,sx-Math.floor(w/2)), ty=Math.max(2,sy-Math.floor(h/2));
 if(tx+w>=map.w-2||ty+h>=map.h-2) return null;
 return {tx,ty,w,h,id:'court-'+wi};
}
function mhTileInCourt(map,tx,ty){
 const c=map.court;
 if(!c) return false;
 return tx>=c.tx&&tx<c.tx+c.w&&ty>=c.ty&&ty<c.ty+c.h;
}
function mhGenMayorShrine(map){
 if(!map.court) return null;
 const c=map.court;
 const sx=c.tx+Math.floor(c.w/2), sy=c.ty+2;
 const reflectors=[
  {tx:c.tx+1,ty:c.ty+1,label:'Mirror A'},
  {tx:c.tx+c.w-2,ty:c.ty+1,label:'Mirror B'},
  {tx:c.tx+1,ty:c.ty+c.h-2,label:'Mirror C'},
  {tx:c.tx+c.w-2,ty:c.ty+c.h-2,label:'Mirror D'}
 ].map((r,i)=>({
  ...r, px:r.tx*MH_TILE+MH_TILE/2, py:r.ty*MH_TILE+MH_TILE/2, lit:false, i
 }));
 return {
  tx:sx, ty:sy,
  px:sx*MH_TILE+MH_TILE/2, py:sy*MH_TILE+MH_TILE/2,
  crankAngle:0, reflectors, solved:false
 };
}
function mhParkFits(map,p){
 if(p.tx<2||p.ty<2||p.tx+p.w>=map.w-2||p.ty+p.h>=map.h-2) return false;
 for(let dy=0;dy<p.h;dy++)for(let dx=0;dx<p.w;dx++){
  if(!mhTileWalkable(map,p.tx+dx,p.ty+dy)) return false;
 }
 return true;
}
function mhGenParks(wi,map){
 if(wi===MH_VOID_WORLD) return [];
 const sx=map.playerSpawnTx||10, sy=map.playerSpawnTy||10;
 const names=MH_WORLD_PARK_NAMES[wi]||MH_WORLD_PARK_NAMES[0];
 const w=10,h=5;
 const slots=[
  {dx:-15,dy:4,suffix:'North Green'},{dx:15,dy:4,suffix:'East Green'},
  {dx:0,dy:13,suffix:'South Park'},{dx:0,dy:-11,suffix:'West Garden'}
 ];
 const out=[];
 slots.forEach((s,i)=>{
  const p={tx:sx+ s.dx-Math.floor(w/2), ty:sy+s.dy, w,h, name:names[i]||('Park '+(i+1)), parkIndex:i};
  if(mhParkFits(map,p)&&!mhTileInCourt(map,p.tx,p.ty)) out.push(p);
 });
 for(let r=8;r<20&&out.length<4;r++){
  for(let a=0;a<12&&out.length<4;a++){
   const tx=Math.round(sx+Math.cos(a*Math.PI/6)*r)-Math.floor(w/2);
   const ty=Math.round(sy+Math.sin(a*Math.PI/6)*r);
   const p={tx,ty,w,h,name:names[out.length]||('Park '+(out.length+1)),parkIndex:out.length};
   if(mhParkFits(map,p)&&!out.some(q=>q.tx===tx&&q.ty===ty)) out.push(p);
  }
 }
 return out.slice(0,4);
}
function mhGenParkStatues(map,wi){
 const out=[];
 const morphs=mhWorldMorphs(wi).filter(m=>!m.voidKing).slice(0,16);
 (map.parks||[]).forEach((park,pi)=>{
  const chunk=morphs.slice(pi*3,pi*3+3);
  chunk.forEach((m,i)=>{
   out.push({
    tx:park.tx+1+i*2, ty:park.ty+Math.floor(park.h/2),
    kind:'noobie_statue', morphId:m.id, morph:m,
    statue:true, scale:5.8
   });
  });
 });
 if(map.mayorShrine){
  const mayor=mhMorph('ex-mayor');
  out.push({
   tx:map.mayorShrine.tx, ty:map.mayorShrine.ty-1,
   kind:'mayor_statue', morphId:'ex-mayor', morph:mayor,
   statue:true, scale:7.5, mayor:true
  });
 }
 return out;
}
function mhTileInPark(map,tx,ty){
 for(const p of map.parks||[]){
  if(tx>=p.tx&&tx<p.tx+p.w&&ty>=p.ty&&ty<p.ty+p.h) return true;
 }
 return false;
}
function mhShouldDrawMapMorph(m,save,dist,nearId){
 if(m.voidKing) return dist<320;
 if(nearId&&m.id===nearId) return true;
 if(mhHasMorph(save,m.id)) return dist<220;
 return dist<MH_HIDDEN_REVEAL_R;
}
function mhGroveCenterFree(map,tx,ty,used,minDist){
 if(tx<3||ty<3||tx>=map.w-6||ty>=map.h-6) return false;
 for(let dy=0;dy<4;dy++)for(let dx=0;dx<5;dx++){
  if(!mhTileWalkable(map,tx+dx,ty+dy)) return false;
 }
 if(mhTileInPark(map,tx,ty)||mhTileInCourt(map,tx,ty)) return false;
 for(const u of used){
  if(Math.hypot(tx-u.tx,ty-u.ty)<minDist) return false;
 }
 return true;
}
function mhPickGroveCenters(map,wi,count){
 const used=[];
 const centers=[];
 for(let g=0;g<count;g++){
  let found=null;
  for(let t=0;t<300;t++){
   const tx=3+mhHashStr('gvx'+wi+g+t)%(map.w-10);
   const ty=3+mhHashStr('gvy'+wi+g+t)%(map.h-10);
   if(mhGroveCenterFree(map,tx,ty,used,6)){
    found={tx,ty,w:5,h:4,g};
    used.push(found);
    break;
   }
  }
  if(found) centers.push(found);
 }
 return centers;
}
function mhPlaceMorphInGrove(map,set,m,grove,slot){
 for(let a=0;a<24;a++){
  const tx=grove.tx+(slot%3)*2-1+(a%2);
  const ty=grove.ty+Math.floor(slot/3)*2+Math.floor(a/6);
  const k=tx+','+ty;
  if(tx<2||ty<2||tx>=map.w-2||ty>=map.h-2) continue;
  if(!mhTileWalkable(map,tx,ty)||set.has(k)||mhTileInPark(map,tx,ty)||mhTileInCourt(map,tx,ty)) continue;
  set.add(k);
  m.tileX=tx; m.tileY=ty; m.hideGrove=grove.g;
  return true;
 }
 return false;
}
function mhScatterHiddenHideouts(){
 MH_WORLDS.forEach((_,wi)=>{
  const map=MH_WORLD_MAPS[wi];
  const morphs=MH_MORPHS.filter(m=>mhHuntWorld(m)===wi&&!m.codeOnly);
  const centers=mhPickGroveCenters(map,wi,mhGroveCount(wi));
  map.hideouts=centers.map(c=>({
   ...c,
   label:wi===MH_VOID_WORLD?('🕳 Abyss grove '+(c.g+1)):('🕵 Hidden grove '+(c.g+1))
  }));
  const set=new Set();
  if(wi===MH_VOID_WORLD&&map.throneTx!=null){
   const king=morphs.find(m=>m.voidKing);
   if(king){
    king.tileX=map.throneTx; king.tileY=map.throneTy;
    set.add(map.throneTx+','+map.throneTy);
   }
  }
  morphs.forEach((m,i)=>{
   if(m.voidKing) return;
   const grove=centers[i%centers.length];
   if(!grove) return;
   const slot=Math.floor(i/centers.length);
   mhPlaceMorphInGrove(map,set,m,grove,slot);
  });
 });
}
function mhMegaFits(map,tx,ty,fw,fh){
 if(tx<1||ty<1||tx+fw>=map.w-1||ty+fh>=map.h-1) return false;
 for(let dy=0;dy<fh;dy++)for(let dx=0;dx<fw;dx++){
  if(!mhTileWalkable(map,tx+dx,ty+dy)) return false;
 }
 return true;
}
function mhSpawnCivilians(map,wi){
 const list=[];
 (map.landmarks||[]).forEach(l=>{
  if(!l.mega) return;
  const x=l.tx*MH_TILE,y=l.ty*MH_TILE,w=(l.footW||3)*MH_TILE,h=(l.footH||2)*MH_TILE;
  list.push({
   id:'civ-'+l.tx+'-'+l.ty,
   px:x+w/2, py:y+h+12,
   variant:(mhHashStr('cv'+l.tx+l.ty+wi)>>>0)%14,
   phase:0, wander:false, homePx:x+w/2, homePy:y+h+18
  });
 });
 (map.parks||[]).forEach((p,pi)=>{
  list.push({
   id:'parkc-'+pi,
   px:p.tx*MH_TILE+p.w*MH_TILE/2,
   py:p.ty*MH_TILE+p.h*MH_TILE-10,
   variant:(mhHashStr('pk'+pi+wi)>>>0)%14,
   phase:0, wander:false,
   homePx:p.tx*MH_TILE+p.w*MH_TILE/2, homePy:p.ty*MH_TILE+p.h*MH_TILE
  });
 });
 map.civilians=list;
}
(function mhScatterWorldDecor(){
 MH_WORLDS.forEach((_,wi)=>{
  const map=MH_WORLD_MAPS[wi];
  const themes=MH_WORLD_DECORS[wi]||MH_WORLD_DECORS[0];
  map.landmarks=mhGenLandmarks(wi,map);
  map.court=mhGenCourt(map,wi);
  map.worldFeature=mhGenWorldFeature(wi,map);
  map.mayorShrine=wi===0?mhGenMayorShrine(map):null;
  map.parks=mhGenParks(wi,map);
  map.plagueBugs=mhGenPlagueBugs(wi,map);
  map.statues=mhGenParkStatues(map,wi);
  if(wi===MH_VOID_WORLD){
   map.plagueBugs=[];
   map.parks=[];
   map.statues=[];
   map.court=null;
   map.worldFeature=null;
   map.mayorShrine=null;
  }
  const decors=[];
  const used=new Set();
  const decorCount=wi===MH_VOID_WORLD?8:(14+wi);
  if(map.court){
   for(let dy=0;dy<map.court.h;dy++)for(let dx=0;dx<map.court.w;dx++) used.add((map.court.tx+dx)+','+(map.court.ty+dy));
  }
  map.landmarks.forEach(l=>{ for(let dy=0;dy<(l.footH||1);dy++)for(let dx=0;dx<(l.footW||1);dx++) used.add((l.tx+dx)+','+(l.ty+dy)); });
  (map.parks||[]).forEach(p=>{ for(let dy=0;dy<p.h;dy++)for(let dx=0;dx<p.w;dx++) used.add((p.tx+dx)+','+(p.ty+dy)); });
  for(let i=0;i<decorCount;i++){
   const tx=2+mhHashStr('decx'+wi+i)%(map.w-4);
   const ty=2+mhHashStr('decy'+wi+i)%(map.h-4);
   const k=tx+','+ty;
   if(!mhTileWalkable(map,tx,ty)||map.tiles[ty*map.w+tx]!==0||used.has(k)) continue;
   if(map.throneTx!=null&&Math.abs(tx-map.throneTx)<=3&&Math.abs(ty-map.throneTy)<=3) continue;
   used.add(k);
   decors.push({tx,ty,kind:mhPickDecorKind(themes,wi,i),scale:2.1+((mhHashStr('ds'+i)%4)*0.2)});
  }
  map.decors=decors;
  if(wi===0){
   const lab=mhPlagueLabLandmark(map,wi);
   if(lab){ map.plagueLab=lab; map.landmarks.push(lab); }
  }
  mhSpawnCivilians(map,wi);
 });
})();
mhScatterHiddenHideouts();

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

function mhDefaultPlagueQuest(){
 return{bugs:[],labStep:0,badge:false};
}
function mhNormalizePlagueQuest(raw){
 const q=raw&&typeof raw==='object'?raw:{};
 return{
  bugs:Array.isArray(q.bugs)?q.bugs.filter(id=>typeof id==='string'):[],
  labStep:Math.max(0,Math.min(5,+(q.labStep||0))),
  badge:!!q.badge
 };
}
function mhDefaultSave(){
 return{collected:['ex-welcome'],worldsUnlocked:1,coins:100,wearing:'ex-welcome',title:'',codesUsed:[],minigameWon:[],chatPlayerId:'',chatDisplayName:'',chatFriends:[],plagueQuest:mhDefaultPlagueQuest()};
}
function mhStarterMorph(){
 return mhMorph('ex-welcome')||{head:'#F5CD30',torso:'#0085DB',legs:'#A4BD47',body:'classic',name:'Your Noobie',id:'you'};
}
function mhMapSpawnPos(map){
 const cx=Math.floor(map.w/2), cy=Math.floor(map.h/2);
 for(let r=0;r<Math.max(map.w,map.h);r++){
  for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
   const tx=cx+dx, ty=cy+dy;
   if(tx<2||ty<2||tx>=map.w-2||ty>=map.h-2) continue;
   if(!mhTileWalkable(map,tx,ty)) continue;
   const px=tx*MH_TILE+MH_TILE/2, py=ty*MH_TILE+MH_TILE/2;
   if(!mhWalkCollide(map,px,py,10)) return {px,py};
  }
 }
 return {px:map.spawnTx*MH_TILE+MH_TILE/2, py:map.spawnTy*MH_TILE+MH_TILE/2};
}
function mhClampWalkPos(map,pos){
 const pad=MH_TILE*1.5;
 const maxX=map.w*MH_TILE-pad, maxY=map.h*MH_TILE-pad;
 if(!Number.isFinite(pos.px)||!Number.isFinite(pos.py)||pos.px<pad||pos.py<pad||pos.px>maxX||pos.py>maxY){
  const sp=mhMapSpawnPos(map);
  pos.px=sp.px; pos.py=sp.py;
 }
}
function mhMapFlat2D(wi){
 return !!MH_2D;
}
function mhFlatGroundPair(ground){
 return {a:ground,b:mhShade(ground,-14)};
}
function mhDrawDecorKind(ctx,x,y,kind,wi){
 const T=MH_TILE;
 ctx.save();
 ctx.translate(x,y);
 const wood='#6a5040', roof='#8a4030', stone='#5a5a62', dark='#2a2830';
 switch(kind){
  case 'house':
   ctx.fillStyle=wood; ctx.fillRect(4,12,T-8,T-16);
   ctx.fillStyle=roof; ctx.beginPath(); ctx.moveTo(2,12); ctx.lineTo(T/2,0); ctx.lineTo(T-2,12); ctx.fill();
   ctx.fillStyle='#3a2818'; ctx.fillRect(T/2-5,20,10,14);
   break;
  case 'shop':
   ctx.fillStyle='#5080a0'; ctx.fillRect(6,14,T-12,T-18);
   ctx.fillStyle='#ffe060'; ctx.fillRect(8,18,T-16,8);
   ctx.fillStyle='#303840'; ctx.fillRect(T/2-4,22,8,12);
   break;
  case 'tree':
   ctx.fillStyle='#4a3018'; ctx.fillRect(T/2-3,22,6,12);
   ctx.fillStyle='#3a8838'; ctx.beginPath(); ctx.arc(T/2,16,12,0,Math.PI*2); ctx.fill();
   break;
  case 'fountain':
   ctx.fillStyle=stone; ctx.fillRect(10,24,T-20,8);
   ctx.fillStyle='#60a8e0'; ctx.beginPath(); ctx.arc(T/2,22,8,0,Math.PI*2); ctx.fill();
   break;
  case 'park':
   ctx.fillStyle='#5a9a48'; ctx.fillRect(2,20,T-4,T-22);
   ctx.fillStyle='#3a7838'; ctx.beginPath(); ctx.arc(T/2,14,11,0,Math.PI*2); ctx.fill();
   ctx.fillStyle='#6a5040'; ctx.fillRect(T/2-8,24,16,4);
   break;
  case 'playground':
   ctx.strokeStyle='#8090a0'; ctx.lineWidth=2;
   ctx.beginPath(); ctx.moveTo(8,28); ctx.lineTo(8,10); ctx.lineTo(T-8,10); ctx.lineTo(T-8,28); ctx.stroke();
   ctx.fillStyle='#ff6080'; ctx.fillRect(T/2-12,14,24,4);
   break;
  case 'noobie_statue':
   ctx.fillStyle='#9098a8'; ctx.fillRect(T/2-6,T-6,12,T-4);
   mhPaintHuman(ctx,T/2,T-8,variant%14,0,0.95);
   break;
  case 'bench':
   ctx.fillStyle=wood; ctx.fillRect(8,26,T-16,4); ctx.fillRect(10,22,4,8); ctx.fillRect(T-14,22,4,8);
   break;
  case 'plaza_ruins':
   ctx.fillStyle=stone; ctx.fillRect(6,20,8,14); ctx.fillRect(T-14,18,6,16); ctx.fillStyle='rgba(0,0,0,.2)'; ctx.fillRect(8,28,T-16,4);
   break;
  case 'ferris':
   ctx.strokeStyle='#8090a0'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(T/2,14,14,0,Math.PI*2); ctx.stroke();
   ctx.fillStyle='#ff6080'; ctx.fillRect(T/2-2,0,4,28);
   break;
  case 'tent':
   ctx.fillStyle='#e04080'; ctx.beginPath(); ctx.moveTo(T/2,6); ctx.lineTo(T-4,T-2); ctx.lineTo(4,T-2); ctx.fill();
   ctx.fillStyle='#c03070'; ctx.fillRect(T/2-1,6,2,24);
   break;
  case 'booth':
   ctx.fillStyle='#ffd060'; ctx.fillRect(8,16,T-16,16); ctx.fillStyle='#fff'; ctx.fillRect(10,18,T-20,6);
   break;
  case 'banner':
   ctx.fillStyle='#c04090'; ctx.fillRect(T/2-1,4,2,26); ctx.fillStyle='#ff80c0'; ctx.fillRect(T/2,8,14,10);
   break;
  case 'stall':
   ctx.fillStyle='#8040c0'; ctx.fillRect(6,18,T-12,14); ctx.fillStyle='#ffe080'; ctx.fillRect(8,20,T-16,4);
   break;
  case 'broken_ride':
   ctx.fillStyle='#505860'; ctx.fillRect(8,22,T-16,6); ctx.fillStyle='#303840'; ctx.fillRect(12,14,6,10);
   ctx.strokeStyle='#ff4040'; ctx.beginPath(); ctx.moveTo(6,18); ctx.lineTo(T-6,26); ctx.stroke();
   break;
  case 'beach_hut':
   ctx.fillStyle='#e8c878'; ctx.fillRect(8,18,T-16,14); ctx.fillStyle='#40a0c0'; ctx.fillRect(6,12,T-12,8);
   break;
  case 'pier':
   ctx.fillStyle=wood; ctx.fillRect(0,T-8,T,6); ctx.fillStyle='#5080a0'; ctx.fillRect(0,T-4,T,4);
   break;
  case 'palm':
   ctx.fillStyle='#8a6030'; ctx.fillRect(T/2-2,18,4,14);
   ctx.fillStyle='#2a8848'; ctx.beginPath(); ctx.ellipse(T/2,12,14,6,0,0,Math.PI*2); ctx.fill();
   break;
  case 'surf':
   ctx.fillStyle='#ff8040'; ctx.fillRect(T/2-2,16,4,18); ctx.fillStyle='#fff'; ctx.fillRect(T/2-8,20,16,4);
   break;
  case 'lifeguard':
   ctx.fillStyle='#e04040'; ctx.fillRect(T/2-6,14,12,18); ctx.fillStyle='#fff'; ctx.fillRect(T/2-4,16,8,6);
   break;
  case 'wrecked_boat':
   ctx.fillStyle=wood; ctx.fillRect(6,24,T-12,6); ctx.fillStyle='#303840'; ctx.fillRect(10,20,8,6);
   ctx.strokeStyle='#000'; ctx.beginPath(); ctx.moveTo(8,22); ctx.lineTo(T-8,28); ctx.stroke();
   break;
  case 'crystal':
   ctx.fillStyle='#80e0ff'; ctx.beginPath(); ctx.moveTo(T/2,4); ctx.lineTo(T-6,28); ctx.lineTo(6,28); ctx.fill();
   ctx.strokeStyle='#fff'; ctx.stroke();
   break;
  case 'expedition_tent':
   ctx.fillStyle='#c8a860'; ctx.beginPath(); ctx.moveTo(T/2,8); ctx.lineTo(T-4,26); ctx.lineTo(4,26); ctx.fill();
   ctx.fillStyle='#403820'; ctx.fillRect(T/2-1,8,2,18);
   break;
  case 'mine_cart':
   ctx.fillStyle='#505860'; ctx.fillRect(8,22,T-16,8); ctx.fillStyle='#303840'; ctx.beginPath(); ctx.arc(12,T-2,3,0,Math.PI*2); ctx.arc(T-12,T-2,3,0,Math.PI*2); ctx.fill();
   break;
  case 'stalagmite':
   ctx.fillStyle='#685898'; ctx.beginPath(); ctx.moveTo(T/2,6); ctx.lineTo(T-8,28); ctx.lineTo(T-8,28); ctx.lineTo(8,28); ctx.fill();
   break;
  case 'drill':
   ctx.fillStyle='#404850'; ctx.fillRect(T/2-3,10,6,20); ctx.fillStyle='#808890'; ctx.fillRect(T/2-6,6,12,6);
   break;
  case 'crate':
   ctx.fillStyle='#6a5038'; ctx.fillRect(10,18,T-20,T-22); ctx.strokeStyle='#3a2818'; ctx.strokeRect(10.5,18.5,T-21,T-23);
   break;
  case 'fluoro_hall':
   ctx.fillStyle='#d8d4b0'; ctx.fillRect(4,4,T-8,T-8);
   ctx.fillStyle='#ffffa0'; ctx.fillRect(6,6,T-12,4);
   break;
  case 'office_desk':
   ctx.fillStyle='#909088'; ctx.fillRect(8,22,T-16,8); ctx.fillStyle='#707068'; ctx.fillRect(12,16,12,8);
   break;
  case 'carpet':
   ctx.fillStyle='#806040'; ctx.fillRect(6,24,T-12,6); ctx.fillStyle='#604830'; ctx.fillRect(8,25,T-16,4);
   break;
  case 'broken_tile':
   ctx.fillStyle='#a8a890'; ctx.fillRect(6,20,10,12); ctx.fillStyle='#888878'; ctx.fillRect(T-16,22,10,10);
   ctx.strokeStyle='#606058'; ctx.beginPath(); ctx.moveTo(10,20); ctx.lineTo(18,32); ctx.stroke();
   break;
  case 'chair':
   ctx.fillStyle='#707068'; ctx.fillRect(12,22,10,10); ctx.fillRect(14,14,6,10);
   break;
  case 'liminal_door':
   ctx.fillStyle='#909088'; ctx.fillRect(T/2-8,8,16,26); ctx.fillStyle='#101018'; ctx.fillRect(T/2-5,12,10,20);
   break;
  case 'cloud_house':
   ctx.fillStyle='#e8f4ff'; ctx.fillRect(10,18,T-20,12); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(12,26,8,0,Math.PI*2); ctx.arc(T-12,26,8,0,Math.PI*2); ctx.fill();
   break;
  case 'sky_bridge':
   ctx.fillStyle='#88b8e0'; ctx.fillRect(0,T/2,T,4); ctx.fillStyle=stone; ctx.fillRect(4,T/2-2,6,8); ctx.fillRect(T-10,T/2-2,6,8);
   break;
  case 'balloon':
   ctx.fillStyle='#ff6080'; ctx.beginPath(); ctx.arc(T/2,12,10,0,Math.PI*2); ctx.fill();
   ctx.strokeStyle='#333'; ctx.beginPath(); ctx.moveTo(T/2,22); ctx.lineTo(T/2,30); ctx.stroke();
   break;
  case 'nest':
   ctx.fillStyle='#8a7040'; ctx.beginPath(); ctx.ellipse(T/2,26,14,6,0,0,Math.PI*2); ctx.fill();
   break;
  case 'wreckage':
   ctx.fillStyle='#606878'; ctx.fillRect(8,20,12,10); ctx.fillRect(T-18,24,10,8);
   ctx.strokeStyle='#404850'; ctx.beginPath(); ctx.moveTo(6,22); ctx.lineTo(T-6,30); ctx.stroke();
   break;
  case 'expedition_flag':
   ctx.fillStyle='#403820'; ctx.fillRect(T/2-1,8,2,22);
   ctx.fillStyle='#e04040'; ctx.fillRect(T/2,10,12,8);
   break;
  case 'burned_house':
   ctx.fillStyle='#2a1810'; ctx.fillRect(8,16,T-16,T-18);
   ctx.fillStyle='#1a1008'; ctx.beginPath(); ctx.moveTo(6,16); ctx.lineTo(T/2,6); ctx.lineTo(T-6,16); ctx.fill();
   ctx.fillStyle='#ff6020'; ctx.fillRect(14,20,4,4); ctx.fillRect(T-18,22,3,3);
   break;
  case 'lava_rock':
   ctx.fillStyle='#3a1810'; ctx.beginPath(); ctx.moveTo(T/2,8); ctx.lineTo(T-6,28); ctx.lineTo(6,28); ctx.fill();
   ctx.fillStyle='#ff6020'; ctx.fillRect(T/2-2,20,4,4);
   break;
  case 'expedition_camp':
   ctx.fillStyle='#c8a860'; ctx.fillRect(6,20,14,10); ctx.fillStyle='#403820'; ctx.fillRect(T-16,22,10,8);
   ctx.fillStyle='#e04040'; ctx.fillRect(T/2,12,2,10);
   break;
  case 'obsidian':
   ctx.fillStyle='#101018'; ctx.beginPath(); ctx.moveTo(T/2,6); ctx.lineTo(T-4,28); ctx.lineTo(4,28); ctx.fill();
   ctx.strokeStyle='#8040ff'; ctx.stroke();
   break;
  case 'broken_statue':
   ctx.fillStyle=stone; ctx.fillRect(T/2-6,14,12,16); ctx.fillStyle='#707078'; ctx.fillRect(T/2-4,6,8,10);
   ctx.fillRect(T-10,24,6,6);
   break;
  case 'ash_pile':
   ctx.fillStyle='#3a3028'; ctx.beginPath(); ctx.ellipse(T/2,28,16,6,0,0,Math.PI*2); ctx.fill();
   break;
  case 'nexus_ruins':
   ctx.fillStyle='#384868'; ctx.fillRect(6,18,10,14); ctx.fillRect(T-16,20,10,12);
   ctx.fillStyle='#ffd060'; ctx.fillRect(T/2-2,10,4,12);
   break;
  case 'portal':
   ctx.strokeStyle='#80e0ff'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(T/2,18,12,0,Math.PI*2); ctx.stroke();
   ctx.fillStyle='rgba(80,224,255,.25)'; ctx.fill();
   break;
  case 'statue':
   ctx.fillStyle='#9098a8'; ctx.fillRect(T/2-5,12,10,18); ctx.fillRect(T/2-8,8,16,6);
   break;
  case 'camp':
   ctx.fillStyle='#806040'; ctx.fillRect(8,22,T-16,8); ctx.fillStyle='#ff8040'; ctx.beginPath(); ctx.arc(T/2,24,4,0,Math.PI*2); ctx.fill();
   break;
  case 'crystal_shrine':
   ctx.fillStyle=stone; ctx.fillRect(8,20,T-16,10);
   ctx.fillStyle='#80e0ff'; ctx.beginPath(); ctx.moveTo(T/2,6); ctx.lineTo(T-6,22); ctx.lineTo(6,22); ctx.fill();
   break;
  case 'vault':
   ctx.fillStyle='#281838'; ctx.fillRect(8,14,T-16,T-16); ctx.fillStyle='#ff48e8'; ctx.fillRect(12,18,T-24,6);
   break;
  case 'neon_sign':
   ctx.fillStyle='#101018'; ctx.fillRect(T/2-1,10,2,18);
   ctx.fillStyle='#ff48e8'; ctx.shadowColor='#ff48e8'; ctx.shadowBlur=8;
   ctx.fillRect(T/2,12,14,8); ctx.shadowBlur=0;
   break;
  case 'exotic_wreck':
   ctx.fillStyle='#502868'; ctx.fillRect(6,22,T-12,6); ctx.strokeStyle='#ff48e8'; ctx.strokeRect(6.5,22.5,T-13,5);
   break;
  case 'pillar':
   ctx.fillStyle='#685888'; ctx.fillRect(T/2-5,8,10,T-10);
   ctx.fillStyle='#9080c0'; ctx.fillRect(T/2-6,6,12,4);
   break;
  case 'gate':
   ctx.fillStyle='#381838'; ctx.fillRect(6,10,6,T-12); ctx.fillRect(T-12,10,6,T-12);
   ctx.fillStyle='#ff48e8'; ctx.fillRect(6,10,T-12,4);
   break;
  case 'void_pillar':
   ctx.fillStyle='#180818'; ctx.fillRect(T/2-6,6,12,T-8);
   ctx.strokeStyle='#a01010'; ctx.strokeRect(T/2-6.5,5.5,13,T-7);
   break;
  case 'red_altar':
   ctx.fillStyle='#280808'; ctx.fillRect(8,20,T-16,10);
   ctx.fillStyle='#ff2020'; ctx.fillRect(T/2-4,14,8,8);
   break;
  case 'broken_armor':
   ctx.fillStyle='#141414'; ctx.fillRect(10,18,8,12); ctx.fillRect(T-18,22,8,10);
   ctx.fillStyle='#801010'; ctx.fillRect(12,20,4,4);
   break;
  case 'expedition_bones':
   ctx.fillStyle='#c8c0b0'; ctx.fillRect(10,24,12,3); ctx.fillRect(T-16,26,10,2);
   ctx.fillStyle='#908880'; ctx.beginPath(); ctx.arc(T/2,22,5,0,Math.PI*2); ctx.fill();
   break;
  case 'ruined_house':
   ctx.fillStyle='#1a1018'; ctx.fillRect(8,16,T-16,T-18);
   ctx.fillStyle='#401010'; ctx.beginPath(); ctx.moveTo(6,16); ctx.lineTo(T/2,8); ctx.lineTo(T-8,18); ctx.fill();
   break;
  case 'forbidden_stone':
   ctx.fillStyle='#080808'; ctx.fillRect(T/2-8,14,16,16);
   ctx.strokeStyle='#ff2020'; ctx.strokeRect(T/2-8.5,13.5,17,17);
   mhDrawForbiddenSymbol(ctx,T/2,22,5,mhHashStr(String(kind)+wi)%4);
   break;
  case 'void_fallen_building':
   ctx.fillStyle='#0a0a0a'; ctx.fillRect(T/2-14,0,28,T-2);
   ctx.fillStyle='#280808'; ctx.fillRect(T/2-12,4,24,T-8);
   ctx.strokeStyle='#ff3030'; ctx.lineWidth=2; ctx.strokeRect(T/2-14.5,-0.5,29,T-1);
   ctx.fillStyle='#ff2020'; ctx.fillRect(T/2-6,10,12,4);
   for(let r=0;r<3;r++){ ctx.fillStyle='#180818'; ctx.fillRect(T/2-10+r*8,18,5,8); }
   ctx.fillStyle='#401010'; ctx.fillRect(T/2-16,T-6,32,6);
   break;
  case 'void_cathedral':
   ctx.fillStyle='#101018'; ctx.fillRect(T/2-16,6,32,T-8);
   ctx.fillStyle='#1a0818'; ctx.beginPath(); ctx.moveTo(T/2,0); ctx.lineTo(T/2+18,22); ctx.lineTo(T/2-18,22); ctx.fill();
   ctx.strokeStyle='#a01010'; ctx.lineWidth=2; ctx.stroke();
   ctx.fillStyle='#ff3030'; ctx.fillRect(T/2-4,14,8,12);
   mhDrawForbiddenSymbol(ctx,T/2-10,24,4,1);
   mhDrawForbiddenSymbol(ctx,T/2+10,24,4,2);
   break;
  default:
   ctx.fillStyle=stone; ctx.fillRect(10,20,T-20,T-24);
 }
 ctx.restore();
}
function mhPaintHuman(ctx,x,y,variant,phase,sc){
 sc=sc||0.72;
 const pal=[
  ['#F5CD30','#0085DB','#A4BD47'],['#FF98DC','#C4281C','#0085DB'],
  ['#E0AC00','#008000','#6B8E23'],['#BFA029','#004080','#A4BD47'],
  ['#D9BC00','#800080','#A3A2A5'],['#F5CD30','#800080','#A4BD47']
 ][variant%6];
 const h=pal[0],t=pal[1],l=pal[2];
 const bob=Math.sin(phase||0)*3;
 ctx.save();
 ctx.translate(x,y+bob);
 ctx.scale(sc,sc);
 ctx.fillStyle='rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0,22,12,3,0,0,Math.PI*2); ctx.fill();
 mhGradRect(ctx,-7,8,6,16,l,mhShade(l,-25));
 mhGradRect(ctx,1,8,6,16,l,mhShade(l,-25));
 mhGradRect(ctx,-9,-2,18,12,t,mhShade(t,-30));
 ctx.fillStyle=h; ctx.fillRect(-8,-18,16,16);
 ctx.fillStyle='#1a1a20'; ctx.fillRect(-5,-12,4,4); ctx.fillRect(1,-12,4,4);
 ctx.fillStyle='rgba(255,255,255,.6)'; ctx.fillRect(-4,-11,2,2); ctx.fillRect(2,-11,2,2);
 ctx.restore();
}
function mhDrawInteriorProps(ctx,ix,iy,w,h,seed){
 ctx.fillStyle='#ffe890'; ctx.fillRect(ix,iy,w,h);
 ctx.fillStyle='#604028'; ctx.fillRect(ix+3,iy+h-8,w-6,5);
 ctx.fillStyle='#5080c0'; ctx.fillRect(ix+4,iy+4,10,6);
 ctx.fillStyle='#804030'; ctx.fillRect(ix+w-14,iy+5,8,10);
 if(seed%2===0){ ctx.fillStyle='#806040'; ctx.fillRect(ix+w/2-4,iy+8,8,6); }
 if(seed%3===0){ ctx.fillStyle='#ffd060'; ctx.beginPath(); ctx.arc(ix+w-6,iy+6,3,0,Math.PI*2); ctx.fill(); }
 mhPaintHuman(ctx,ix+w*0.55,iy+h-2,(seed+3)%14,seed*0.4,0.45);
}
function mhDrawMegaBuilding(ctx,d,wi,t){
 const T=MH_TILE, x=d.tx*T, y=d.ty*T;
 const fw=d.footW||MH_MEGA_W, fh=d.footH||MH_MEGA_H;
 const W=fw*T, H=fh*T;
 const roofLift=Math.min(18,fw*2);
 const kind=d.kind;
 ctx.fillStyle='rgba(0,0,0,.25)'; ctx.fillRect(x+4,y+H+2,W-8,10);
 if(kind==='void_fallen_building'||kind==='void_cathedral'||kind==='ruined_house'){
  ctx.fillStyle='#0a0a0a'; ctx.fillRect(x,y+8,W,H-8);
  ctx.fillStyle='#280808'; ctx.fillRect(x+6,y+14,W-12,H-18);
  ctx.strokeStyle='#ff3030'; ctx.lineWidth=2; ctx.strokeRect(x+4,y+10,W-8,H-14);
  for(let wx=0;wx<2;wx++){
   const ix=x+14+wx*(W/2-10);
   mhDrawInteriorProps(ctx,ix,y+22,26,22,(d.tx+d.ty+wx+wi)%7);
   ctx.fillStyle='#401010'; ctx.fillRect(ix+4,y+24,18,16);
  }
  ctx.fillStyle='#ff2020'; ctx.fillRect(x+W/2-14,y+H-22,28,18);
  mhPaintHuman(ctx,x+W*0.2,y+H+8,8,t,0.75);
  mhPaintHuman(ctx,x+W*0.55,y+H+10,11,t*1.1,0.78);
  mhPaintHuman(ctx,x+W*0.82,y+H+6,9,t*0.9,0.7);
  return;
 }
 if(kind==='plague_lab'){
  ctx.fillStyle='#1a2820'; ctx.fillRect(x,y+8,W,H-8);
  ctx.fillStyle='#304838'; ctx.fillRect(x+6,y+14,W-12,H-18);
  ctx.strokeStyle='#80ffb0'; ctx.lineWidth=2; ctx.strokeRect(x+4,y+10,W-8,H-14);
  ctx.fillStyle='rgba(120,255,160,.35)'; ctx.fillRect(x+W/2-20,y+H-28,40,16);
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 11px system-ui'; ctx.textAlign='center';
  ctx.fillText('☣ LAB',x+W/2,y+H-16);
  ctx.fillStyle='#80ffb0'; ctx.font='bold 9px system-ui';
  ctx.fillText('F enter · E steps',x+W/2,y+22);
  return;
 }
 if(kind==='fluoro_hall'||kind==='liminal_door'){
  ctx.fillStyle='#d8d4b0'; ctx.fillRect(x+2,y+10,W-4,H-12);
  ctx.fillStyle='#ffffa0'; ctx.fillRect(x+6,y+14,W-12,6);
  ctx.fillStyle='#909088'; ctx.fillRect(x+W/2-14,y+H*0.35,28,H*0.55);
  ctx.fillStyle='#101018'; ctx.fillRect(x+W/2-10,y+H*0.42,20,H*0.4);
  ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(x+W/2-42,y+H*0.28,84,22);
  ctx.fillStyle='#303028'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · BACKROOMS',x+W/2,y+H*0.42);
  mhPaintHuman(ctx,x+W*0.3,y+H+8,3,t,0.85);
  return;
 }
 if(kind==='beach_hut'||kind==='lifeguard'){
  ctx.fillStyle='#e8d878'; ctx.fillRect(x+4,y+H*0.32,W-8,H*0.68);
  ctx.fillStyle='#40a0c0'; ctx.fillRect(x+6,y+8,W-12,H*0.22);
  ctx.fillStyle='#604818'; ctx.fillRect(x+W/2-28,y+H*0.48,56,H*0.45);
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · BEACH',x+W/2,y+H*0.52);
  return;
 }
 if(kind==='cloud_house'||kind==='sky_bridge'){
  ctx.fillStyle='#e8f4ff'; ctx.fillRect(x+4,y+H*0.3,W-8,H*0.7);
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+W*0.3,y+16,16,0,Math.PI*2); ctx.arc(x+W*0.7,y+18,14,0,Math.PI*2); ctx.fill();
  if(kind==='sky_bridge'){
   ctx.fillStyle='#c8e8ff'; ctx.fillRect(x+2,y+H*0.55,W-4,10);
   ctx.strokeStyle='#8098b0'; ctx.strokeRect(x+2,y+H*0.55,W-4,10);
  }
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · SKY',x+W/2,y+H*0.5);
  return;
 }
 if(kind==='expedition_tent'||kind==='crystal'){
  ctx.fillStyle=kind==='crystal'?'#685898':'#c8a860';
  ctx.fillRect(x+4,y+H*0.25,W-8,H*0.75);
  ctx.beginPath(); ctx.moveTo(x,y+H*0.25); ctx.lineTo(x+W/2,y+6); ctx.lineTo(x+W,y+H*0.25); ctx.fill();
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · CAVE',x+W/2,y+H*0.5);
  return;
 }
 if(kind==='tent'){
  ctx.fillStyle='#ff6080'; ctx.fillRect(x+8,y+H*0.3,W-16,H*0.65);
  ctx.beginPath(); ctx.moveTo(x+4,y+H*0.3); ctx.lineTo(x+W/2,y+8); ctx.lineTo(x+W-4,y+H*0.3); ctx.fill();
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · FAIR',x+W/2,y+H*0.5);
  return;
 }
 if(kind==='burned_house'||kind==='expedition_camp'){
  ctx.fillStyle='#4a3028'; ctx.fillRect(x+4,y+H*0.28,W-8,H*0.72);
  ctx.fillStyle='#ff6040'; ctx.fillRect(x+10,y+12,12,8);
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · LAVA',x+W/2,y+H*0.5);
  return;
 }
 if(kind==='vault'||kind==='neon_sign'||kind==='nexus_ruins'){
  ctx.fillStyle=wi===MH_EXOTIC_WORLD?'#281838':'#384868';
  ctx.fillRect(x+4,y+12,W-8,H-14);
  ctx.fillStyle=wi===MH_EXOTIC_WORLD?'#ff48e8':'#ffd060';
  ctx.fillRect(x+8,y+20,W-16,8);
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
  ctx.fillText('F ENTER · '+MH_WORLDS[wi].name.split(' ')[0].toUpperCase(),x+W/2,y+H*0.5);
  return;
 }
 if(kind==='shop'||kind==='stall'||kind==='booth'){
  ctx.fillStyle='#5080a0'; ctx.fillRect(x+4,y+H*0.35,W-8,H*0.65);
  ctx.fillStyle='#ffd060'; ctx.fillRect(x+6,y+H*0.42,W-12,H*0.12);
  ctx.fillStyle='#303840'; ctx.fillRect(x+W/2-16,y+H*0.58,32,H*0.42);
  mhDrawInteriorProps(ctx,x+10,y+H*0.4,28,24,(d.tx+wi)%9);
  mhDrawInteriorProps(ctx,x+W-38,y+H*0.4,28,24,(d.tx+1)%9);
  ctx.fillStyle='#e04080'; ctx.fillRect(x+4,y+6,W-8,14);
  mhPaintHuman(ctx,x+W*0.25,y+H+6,2,t,0.8);
  mhPaintHuman(ctx,x+W*0.7,y+H+8,5,t,0.82);
  return;
 }
 ctx.fillStyle='#8a6048'; ctx.fillRect(x+4,y+H*0.28,W-8,H*0.72);
 ctx.fillStyle='#6a3028'; ctx.beginPath(); ctx.moveTo(x-8,y+H*0.28); ctx.lineTo(x+W/2,y-roofLift); ctx.lineTo(x+W+8,y+H*0.28); ctx.fill();
 ctx.fillStyle='#505860'; ctx.fillRect(x+W-26,y+4,14,24);
 mhDrawInteriorProps(ctx,x+12,y+H*0.34,34,28,(d.tx+wi)%11);
 mhDrawInteriorProps(ctx,x+W-46,y+H*0.34,34,28,(d.ty+wi)%11);
 ctx.fillStyle='#402818'; ctx.fillRect(x+W/2-32,y+H*0.48,64,H*0.52);
 ctx.fillStyle='#ffe060'; ctx.fillRect(x+W/2-20,y+H*0.58,14,12);
 ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(x+W/2-38,y+H*0.34,76,24);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 13px system-ui'; ctx.textAlign='center';
 ctx.fillText('F ENTER',x+W/2,y+H*0.5);
 mhPaintHuman(ctx,x+W*0.18,y+H+6,(d.tx+wi)%14,t,1.15);
 mhPaintHuman(ctx,x+W*0.5,y+H+10,(d.ty+1)%14,t*1.05,1.0);
 mhPaintHuman(ctx,x+W*0.78,y+H+6,(d.tx+d.ty)%14,t*0.95,0.92);
}
function mhDrawSceneryPiece(ctx,d,wi,t){
 if(d.mega){ mhDrawMegaBuilding(ctx,d,wi,t||0); return; }
 const T=MH_TILE;
 const x=d.tx*MH_TILE,y=d.ty*MH_TILE;
 const sc=d.scale||2.8;
 ctx.save();
 ctx.translate(x+MH_TILE/2,y+MH_TILE*0.92);
 ctx.scale(sc,sc);
 ctx.translate(-MH_TILE/2,-MH_TILE/2);
 ctx.fillStyle='rgba(0,0,0,.35)';
 ctx.beginPath(); ctx.ellipse(T/2,T-2,14,4,0,0,Math.PI*2); ctx.fill();
 mhDrawDecorKind(ctx,0,0,d.kind,wi);
 ctx.restore();
}
function mhDrawThemedPropTile(ctx,x,y,wi,tx,ty,t){
 const themes=MH_WORLD_DECORS[wi]||MH_WORLD_DECORS[0];
 const kind=themes[mhHashStr('pt'+tx+ty+wi)%themes.length];
 mhDrawSceneryPiece(ctx,{tx,ty,kind,mega:true,footW:4,footH:3,id:'prop-'+tx+'-'+ty},wi,t);
}
function mhBuildingDoor(d){
 const T=MH_TILE,fw=d.footW||MH_MEGA_W,fh=d.footH||MH_MEGA_H;
 return {px:d.tx*T+fw*T/2, py:d.ty*T+fh*T-6};
}
function mhBuildingSecret(d,wi){
 const slot=mhHashStr((d.id||d.tx)+'|'+d.ty+'|'+wi)%3;
 if(slot===0) return {redeem:'glitchhouse', morph:'code-glitch', label:'GLITCH', color:'#39ff14'};
 if(slot===1) return {redeem:'mythinside', morph:'code-myth', label:'MYTH', color:'#ffd060'};
 return {redeem:'minigamevault', morph:'code-minigame', label:'MINIGAME', color:'#ff48e8'};
}
function mhWalkNearBuilding(pos,map){
 let best=null,bd=120;
 (map.landmarks||[]).forEach(d=>{
  if(!d.mega) return;
  const door=mhBuildingDoor(d);
  const dist=Math.hypot(door.px-pos.px,door.py-pos.py);
  if(dist<bd){ bd=dist; best=d; }
 });
 return best;
}
function mhEnterBuilding(d,wi){
 if(!mhState) return;
 if(d.kind==='plague_lab'){
  mhState.insideBuilding={...d,wi,kind:'plague_lab'};
  mhToast('☣ Plague Lab — press E for each step · F to leave');
  return;
 }
 mhState.insideBuilding={...d,wi,secret:mhBuildingSecret(d,wi)};
 mhToast('🏠 Inside! Read the big wall sign · Press F to leave');
}
function mhExitBuilding(){
 if(mhState) mhState.insideBuilding=null;
}
function mhDrawInteriorProp(ctx,x,y,type,sc){
 ctx.save(); ctx.translate(x,y); ctx.scale(sc,sc);
 if(type==='bed'){
  ctx.fillStyle='#5080c0'; ctx.fillRect(-40,0,80,28); ctx.fillStyle='#fff'; ctx.fillRect(-36,4,72,16);
 }else if(type==='table'){
  ctx.fillStyle='#604028'; ctx.fillRect(-35,-8,70,12); ctx.fillRect(-30,4,8,22); ctx.fillRect(22,4,8,22);
  ctx.fillStyle='#ffd060'; ctx.fillRect(-8,-4,16,8);
 }else if(type==='tv'){
  ctx.fillStyle='#303840'; ctx.fillRect(-30,-20,60,40); ctx.fillStyle='#80e0ff'; ctx.fillRect(-24,-14,48,28);
 }else if(type==='crate'){
  ctx.fillStyle='#6a5038'; ctx.fillRect(-22,-18,44,36); ctx.strokeStyle='#3a2818'; ctx.strokeRect(-22.5,-18.5,45,37);
 }else if(type==='glitch'){
  ctx.fillStyle='#101818'; ctx.fillRect(-28,-22,56,44); ctx.fillStyle='#39ff14'; ctx.font='bold 10px monospace';
  ctx.fillText('GLITCH',-20,-4); ctx.fillText('////',-16,10);
 }else if(type==='trophy'){
  ctx.fillStyle='#ffd060'; ctx.fillRect(-12,-24,24,20); ctx.fillRect(-18,-28,36,8);
 }
 ctx.restore();
}
function mhDrawInteriorScreen(ctx,W,H,st,t){
 const ib=st.insideBuilding;
 if(!ib) return;
 if(ib.kind==='plague_lab'){
  mhDrawPlagueLabInterior(ctx,W,H,st,st.save,t);
  return;
 }
 const sec=ib.secret||mhBuildingSecret(ib,ib.wi||0);
 const g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,'#2a2420'); g.addColorStop(0.45,'#4a4038'); g.addColorStop(1,'#3a3028');
 ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#5a5048'; ctx.fillRect(0,H*0.72,W,H*0.28);
 ctx.fillStyle='#6a6058'; ctx.fillRect(0,40,W,H*0.32);
 ctx.fillStyle='#ffe890'; ctx.fillRect(40,70,120,90); ctx.fillRect(W-160,70,120,90);
 ctx.fillStyle='#604028'; ctx.fillRect(W/2-50,H*0.72-8,100,14);
 mhDrawInteriorProp(ctx,W*0.2,H*0.62,'bed',2.2);
 mhDrawInteriorProp(ctx,W*0.5,H*0.58,'table',2.4);
 mhDrawInteriorProp(ctx,W*0.78,H*0.6,'tv',2);
 mhDrawInteriorProp(ctx,W*0.35,H*0.65,'crate',1.8);
 mhDrawInteriorProp(ctx,W*0.62,H*0.64,'trophy',1.9);
 mhDrawInteriorProp(ctx,W*0.12,H*0.55,'glitch',2);
 mhPaintHuman(ctx,W*0.28,H*0.68,2,t,1.35);
 mhPaintHuman(ctx,W*0.55,H*0.7,5,t*1.1,1.4);
 mhPaintHuman(ctx,W*0.72,H*0.69,8,t*0.9,1.3);
 ctx.fillStyle='rgba(0,0,0,.75)'; ctx.fillRect(W/2-220,100,440,130);
 ctx.strokeStyle=sec.color; ctx.lineWidth=4; ctx.strokeRect(W/2-220,100,440,130);
 ctx.fillStyle=sec.color; ctx.font='bold 28px system-ui,sans-serif'; ctx.textAlign='center';
 ctx.fillText(sec.label+' SECRET',W/2,140);
 ctx.fillStyle='#fff'; ctx.font='bold 22px monospace'; ctx.fillText('CODE: '+sec.redeem.toUpperCase(),W/2,178);
 ctx.font='14px system-ui'; ctx.fillStyle='#c0d0e0';
 ctx.fillText('Gacha tab → Redeem code → unlock '+sec.label+' Noobie',W/2,208);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 16px system-ui'; ctx.fillText('Press F to leave the house',W/2,H-28);
 ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(8,8,300,36);
 ctx.fillStyle='#80ff90'; ctx.font='bold 13px system-ui'; ctx.textAlign='left';
 ctx.fillText(MH_BUILD+' · '+MH_SCENERY_STAMP+' · INDOOR',16,30);
}
function mhDrawWorldFeature(ctx,map,wi){
 const f=map.worldFeature;
 if(!f||f.type!=='backrooms_atrium') return;
 const x=f.tx*MH_TILE,y=f.ty*MH_TILE,w=f.w*MH_TILE,h=f.h*MH_TILE;
 ctx.fillStyle='#d8d4b0'; ctx.fillRect(x,y,w,h);
 ctx.strokeStyle='#909080'; ctx.lineWidth=3; ctx.strokeRect(x+2,y+2,w-4,h-4);
 for(let px=x+10;px<x+w-10;px+=28){
  ctx.fillStyle='#ffffa0'; ctx.fillRect(px,y+8,MH_TILE-4,4);
  ctx.fillStyle='#ffffa0'; ctx.fillRect(px,y+h-12,MH_TILE-4,4);
 }
 ctx.fillStyle='#303028'; ctx.font='bold 13px system-ui'; ctx.textAlign='center';
 ctx.fillText('🚪 '+f.label,x+w/2,y+22);
}
function mhDrawCourtZone(ctx,map,wi){
 const c=map.court;
 if(!c) return;
 const x=c.tx*MH_TILE,y=c.ty*MH_TILE,w=c.w*MH_TILE,h=c.h*MH_TILE;
 ctx.fillStyle=wi===MH_VOID_WORLD?'#281830':'#c89860';
 ctx.fillRect(x,y,w,h);
 ctx.strokeStyle='#804020'; ctx.lineWidth=3; ctx.strokeRect(x+2,y+2,w-4,h-4);
 ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=2;
 ctx.beginPath(); ctx.moveTo(x+w/2,y+6); ctx.lineTo(x+w/2,y+h-6); ctx.stroke();
 ctx.beginPath(); ctx.arc(x+w/2,y+h/2,Math.min(w,h)*0.22,0,Math.PI*2); ctx.stroke();
 ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(x+w/2-70,y+8,140,18);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
 ctx.fillText('🏀 COURT PLAZA',x+w/2,y+22);
}
function mhDrawMayorShrine(ctx,map,t,st){
 const sh=map.mayorShrine;
 if(!sh||!map.court) return;
 sh.reflectors.forEach(ref=>{
  const rx=ref.tx*MH_TILE, ry=ref.ty*MH_TILE;
  ctx.fillStyle=ref.lit?'#ffe060':'#a0b0c0';
  ctx.fillRect(rx+6,ry+8,MH_TILE-12,MH_TILE-14);
  ctx.strokeStyle=ref.lit?'#fff':'#607080'; ctx.lineWidth=2; ctx.strokeRect(rx+6.5,ry+8.5,MH_TILE-13,MH_TILE-15);
  ctx.fillStyle='#203040'; ctx.font='bold 8px system-ui'; ctx.textAlign='center';
  ctx.fillText(ref.lit?'✓':'↺',rx+MH_TILE/2,ry+MH_TILE/2+3);
 });
 const sx=sh.px, sy=sh.py;
 const mayor=mhMorph('ex-mayor');
 if(mayor) mhPaintNoobWorld(ctx,mayor,sx,sy-MH_TILE*0.5,1.1,1,false,t,0,false,false);
 ctx.fillStyle='#505860'; ctx.fillRect(sx-34,sy+8,68,28);
 ctx.fillStyle='#303840'; ctx.fillRect(sx-28,sy+14,56,16);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
 ctx.fillText('HAND CRANK',sx,sy+24);
 const ang=(sh.crankAngle||0)*Math.PI/180;
 ctx.save(); ctx.translate(sx,sy+18); ctx.rotate(ang);
 ctx.fillStyle='#8090a0'; ctx.fillRect(-4,-14,8,28);
 ctx.fillStyle='#606870'; ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.fill();
 ctx.restore();
 if(st.mayorBeamT&&performance.now()-st.mayorBeamT<800){
  ctx.strokeStyle='rgba(255,240,120,.85)'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(sx,sy);
  sh.reflectors.forEach(ref=>{
   ctx.lineTo(ref.px,ref.py);
  });
  ctx.stroke();
 }
 ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(sx-90,sy+36,180,28);
 ctx.fillStyle='#80ffb0'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
 ctx.fillText('J/L crank · R flash light → all mirrors',sx,sy+54);
}
function mhNearMayorShrine(pos,map){
 const sh=map.mayorShrine;
 if(!sh) return false;
 return Math.hypot(sh.px-pos.px,sh.py-pos.py)<110;
}
function mhMayorCrank(delta){
 if(!mhState||mhState.world!==0) return;
 const sh=MH_WORLD_MAPS[0].mayorShrine;
 if(!sh||sh.solved) return;
 sh.crankAngle=((sh.crankAngle||0)+delta+360)%360;
}
function mhMayorFlashBeam(){
 if(!mhState?.save||mhState.world!==0) return;
 const save=mhState.save;
 if(mhHasMorph(save,'ex-mayor')) return;
 const sh=MH_WORLD_MAPS[0].mayorShrine;
 if(!sh||sh.solved) return;
 const rad=(sh.crankAngle||0)*Math.PI/180;
 const sx=sh.px, sy=sh.py;
 sh.reflectors.forEach(ref=>{
  const target=Math.atan2(ref.py-sy,ref.px-sx);
  let diff=Math.atan2(Math.sin(rad-target),Math.cos(rad-target));
  if(Math.abs(diff)<0.35) ref.lit=true;
 });
 mhState.mayorBeamT=performance.now();
 if(sh.reflectors.every(r=>r.lit)){
  sh.solved=true;
  const mayor=mhMorph('ex-mayor');
  if(mayor&&!mhHasMorph(save,'ex-mayor')){
   mhFinishCollect(mayor);
   mhToast('👑 MAYOR NOOBIE unlocked — light puzzle complete!');
  }
 }else mhToast('Light hit '+sh.reflectors.filter(r=>r.lit).length+'/'+sh.reflectors.length+' mirrors');
}
const MH_PLAGUE_LAB_STEPS=[
 {key:'toxic',label:'Mix bugs into toxic chemicals',hint:'Drop every park bug into the cauldron.'},
 {key:'airlock',label:'Seal the airlock',hint:'Lock the fumes inside the chamber.'},
 {key:'jar',label:'Decant into a jar',hint:'The brew glows sickly green…'},
 {key:'syringe',label:'Load the syringe',hint:'Draw the unstable serum.'},
 {key:'inject',label:'Inject yourself',hint:'Unlock the Plague Badge — become the doctor.'}
];
function mhPlagueQuest(save){
 if(!save.plagueQuest) save.plagueQuest=mhDefaultPlagueQuest();
 return save.plagueQuest;
}
function mhPlagueBugTotal(){
 let n=0;
 for(let wi=0;wi<MH_WORLDS.length;wi++){
  if(wi===MH_VOID_WORLD) continue;
  n+=(MH_WORLD_MAPS[wi].plagueBugs||[]).length;
 }
 return n;
}
function mhPlagueBugsCollected(save){
 return mhPlagueQuest(save).bugs.length;
}
function mhPlagueBugsComplete(save){
 return mhPlagueBugsCollected(save)>=mhPlagueBugTotal();
}
function mhGenPlagueBugs(wi,map){
 const bugs=[];
 (map.parks||[]).forEach((p,pi)=>{
  const type=(mhHashStr('pbug'+wi+'-'+pi)%2)===0?'yellowBlack':'redBlack';
  bugs.push({
   id:'pbug-'+wi+'-'+pi,
   wi,pi,type,
   px:p.tx*MH_TILE+p.w*MH_TILE/2+((mhHashStr('px'+wi+pi)%16)-8),
   py:p.ty*MH_TILE+p.h*MH_TILE/2+((mhHashStr('py'+wi+pi)%10)-5)
  });
 });
 return bugs;
}
function mhPlagueLabLandmark(map,wi){
 if(wi!==0||!map.court) return null;
 const tx=Math.min(map.w-10, map.court.tx+map.court.w+2);
 const ty=map.court.ty;
 return{
  tx,ty,w:6,h:5,kind:'plague_lab',mega:true,footW:6,footH:5,id:'plague-lab-w0',
  label:'☣ PLAGUE LAB'
 };
}
function mhDrawPlagueBug(ctx,bug,t,save){
 if(!bug||mhPlagueQuest(save).bugs.includes(bug.id)) return;
 const pulse=0.85+Math.sin(t*4+bug.px*0.01)*0.15;
 ctx.save();
 ctx.translate(bug.px,bug.py-4+Math.sin(t*3)*2);
 ctx.scale(pulse,pulse);
 if(bug.type==='yellowBlack'){
  for(let i=0;i<6;i++){ ctx.fillStyle=i%2?'#f8d030':'#101010'; ctx.fillRect(-10+i*3.2,-6,3.2,12); }
 }else{
  for(let i=0;i<6;i++){ ctx.fillStyle=i%2?'#e03030':'#101010'; ctx.fillRect(-10+i*3.2,-6,3.2,12); }
 }
 ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.strokeRect(-10,-6,19,12);
 ctx.fillStyle='#fff'; ctx.font='bold 8px system-ui'; ctx.textAlign='center';
 ctx.fillText('🐛',0,3);
 ctx.restore();
}
function mhDrawPlagueBugs(ctx,map,wi,t,save){
 (map.plagueBugs||[]).forEach(b=>mhDrawPlagueBug(ctx,b,t,save));
}
function mhNearPlagueBug(pos,map,save){
 let best=null,bd=48;
 (map.plagueBugs||[]).forEach(b=>{
  if(mhPlagueQuest(save).bugs.includes(b.id)) return;
  const d=Math.hypot(b.px-pos.px,b.py-pos.py);
  if(d<bd){ bd=d; best=b; }
 });
 return best;
}
function mhTryCollectPlagueBug(save,wi,map,pos){
 if(mhHasMorph(save,'ex-plague-doctor')) return false;
 const bug=mhNearPlagueBug(pos,map,save);
 if(!bug) return false;
 const q=mhPlagueQuest(save);
 if(q.bugs.includes(bug.id)) return false;
 q.bugs.push(bug.id);
 mhSaveSave(save);
 const left=mhPlagueBugTotal()-q.bugs.length;
 mhToast('🐛 Park bug caught ('+(bug.type==='yellowBlack'?'yellow-black':'red-black')+')! '+left+' left · then ☣ Plague Lab on Buddy Plaza');
 if(mhPlagueBugsComplete(save)) mhToast('☣ All park bugs collected! Buddy Plaza → ☣ PLAGUE LAB · press F to enter · E for each step');
 return true;
}
function mhPlagueDoctorSay(save,which){
 const m=mhMorph('ex-plague-doctor');
 const lines=m?.plagueLines||['I am the cure.','Oh my, the sickness…','Then I can fix you.'];
 const line=lines[which!=null?which%lines.length:Math.floor(Math.random()*lines.length)];
 mhToast('🩺 Plague Doctor: “'+line+'”');
 if(mhState?.save&&mhHasMorph(save,'ex-plague-doctor')){
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhChatSpawnBubble(mhState,pos.px,pos.py-20,'🩺 '+line,'Plague Doctor',5200);
 }
}
function mhPlagueLabAdvance(save){
 const q=mhPlagueQuest(save);
 if(mhHasMorph(save,'ex-plague-doctor')){ mhToast('You already are the Plague Doctor Noobie!'); return; }
 if(!mhPlagueBugsComplete(save)){
  mhToast('Collect striped bugs at every park first (yellow/black or red/black) · press E near 🐛');
  return;
 }
 const step=q.labStep||0;
 if(step>=MH_PLAGUE_LAB_STEPS.length){
  mhToast('Lab sequence complete — morph unlocked!');
  return;
 }
 const s=MH_PLAGUE_LAB_STEPS[step];
 q.labStep=step+1;
 mhSaveSave(save);
 mhToast('☣ Step '+(step+1)+'/5: '+s.label+' — '+s.hint);
 if(step+1>=MH_PLAGUE_LAB_STEPS.length){
  q.badge=true;
  mhSaveSave(save);
  const doc=mhMorph('ex-plague-doctor');
  if(doc){
   mhFinishCollect(doc);
   mhWear(doc.id,true);
   mhPlagueDoctorSay(save,0);
   setTimeout(()=>mhPlagueDoctorSay(save,1),2200);
   setTimeout(()=>mhPlagueDoctorSay(save,2),4400);
  }
  if(mhState) mhState.insideBuilding=null;
 }
}
function mhDrawPlagueLabInterior(ctx,W,H,st,save,t){
 const q=mhPlagueQuest(save);
 const g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,'#0a1810'); g.addColorStop(1,'#1a2820');
 ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#203828'; ctx.fillRect(W*0.15,H*0.35,W*0.7,H*0.45);
 ctx.strokeStyle='#80ffb0'; ctx.lineWidth=3; ctx.strokeRect(W*0.15,H*0.35,W*0.7,H*0.45);
 ctx.fillStyle='rgba(120,255,160,.25)'; ctx.fillRect(W*0.2,H*0.42,W*0.6,H*0.28);
 for(let i=0;i<5;i++){
  const bx=W*0.22+i*W*0.12, by=H*0.48+Math.sin(t*2+i)*4;
  ctx.fillStyle=i%2?'#f8d030':'#101010'; ctx.fillRect(bx,by,14,8);
 }
 ctx.fillStyle='#404850'; ctx.fillRect(W*0.72,H*0.28,40,90);
 ctx.strokeStyle='#a0b0c0'; ctx.strokeRect(W*0.72,H*0.28,40,90);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 22px system-ui'; ctx.textAlign='center';
 ctx.fillText('☣ PLAGUE LAB',W/2,56);
 ctx.font='14px system-ui'; ctx.fillStyle='#c0d8c8';
 ctx.fillText('Bugs: '+mhPlagueBugsCollected(save)+' / '+mhPlagueBugTotal(),W/2,82);
 const step=Math.min(q.labStep||0,MH_PLAGUE_LAB_STEPS.length);
 ctx.fillStyle='#80ffb0'; ctx.font='bold 16px system-ui';
 if(step<MH_PLAGUE_LAB_STEPS.length){
  ctx.fillText('Step '+(step+1)+': '+MH_PLAGUE_LAB_STEPS[step].label,W/2,H*0.32);
  ctx.fillStyle='#a0b8a8'; ctx.font='13px system-ui';
  ctx.fillText(MH_PLAGUE_LAB_STEPS[step].hint,W/2,H*0.32+22);
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 15px system-ui';
  ctx.fillText('Press E — next lab step',W/2,H-48);
 }else{
  ctx.fillText('Serum complete — Plague Doctor unlocked!',W/2,H*0.32);
 }
 ctx.fillStyle='#a0a8b8'; ctx.font='12px system-ui';
 ctx.fillText('F — leave lab',W/2,H-24);
 mhDrawPlagueDoctorAura(ctx,W/2,H*0.62,t,0.9);
}
function mhDrawPlagueDoctorAura(ctx,cx,cy,t,alpha){
 const a=alpha==null?1:alpha;
 ctx.save(); ctx.globalAlpha=a;
 const orbit=['💊','🧪','☠','💀','✚','⚰'];
 for(let i=0;i<orbit.length;i++){
  const ang=t*0.9+i*Math.PI*2/orbit.length;
  const r=38+Math.sin(t*2+i)*6;
  const sx=cx+Math.cos(ang)*r, sy=cy+Math.sin(ang)*r*0.55;
  ctx.font=(i%2?'16px':'14px')+' system-ui';
  ctx.textAlign='center'; ctx.fillText(orbit[i],sx,sy);
  if(i%3===0){
   ctx.fillStyle='rgba(128,255,176,.35)'; ctx.beginPath(); ctx.arc(sx,sy,10,0,Math.PI*2); ctx.fill();
  }
 }
 ctx.restore();
}
function mhParkColors(wi){
 if(wi===4) return {fill:'#c8c4a0',edge:'#808070',tree:'#909080',label:'#303028'};
 if(wi===2) return {fill:'#e8d878',edge:'#c0a858',tree:'#40a0c0',label:'#604818'};
 if(wi===3) return {fill:'#685898',edge:'#483868',tree:'#9080c0',label:'#e8e0ff'};
 if(wi===6) return {fill:'#5a3028',edge:'#401818',tree:'#ff6040',label:'#ffd0c0'};
 if(wi===MH_VOID_WORLD) return {fill:'#241028',edge:'#8040a0',tree:'#502868',label:'#e8d0ff'};
 if(wi===MH_EXOTIC_WORLD) return {fill:'#381848',edge:'#ff48e8',tree:'#684888',label:'#ffe8ff'};
 return {fill:'#62b852',edge:'#2a6830',tree:'#4a9848',label:'#ffe8a0'};
}
function mhDrawParkZones(ctx,map,wi){
 const pal=mhParkColors(wi);
 (map.parks||[]).forEach(p=>{
  const x=p.tx*MH_TILE,y=p.ty*MH_TILE,w=p.w*MH_TILE,h=p.h*MH_TILE;
  ctx.fillStyle=pal.fill;
  ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=pal.edge;
  ctx.lineWidth=4; ctx.strokeRect(x+2,y+2,w-4,h-4);
  ctx.fillStyle=pal.tree;
  for(let px=x+12;px<x+w-12;px+=28){
   if(wi===4){ ctx.fillStyle='#ffffa0'; ctx.fillRect(px,y+10, MH_TILE-8,4); ctx.fillRect(px,y+h-16,MH_TILE-8,4); }
   else if(wi===2){ ctx.fillStyle='#40a0c0'; ctx.fillRect(px,y+h-14,8,10); }
   else{ ctx.beginPath(); ctx.arc(px,y+14,10,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(px,y+h-12,10,0,Math.PI*2); ctx.fill(); }
  }
  ctx.fillStyle='rgba(255,255,255,.92)'; ctx.font='bold 16px system-ui'; ctx.textAlign='center';
  ctx.fillText((wi===4?'🚪':'🌳')+' '+p.name,x+w/2,y+22);
  ctx.font='bold 11px system-ui'; ctx.fillStyle=pal.label;
  ctx.fillText(wi===4?'Backrooms picnic zone · statues':'Noobie statues · collect in groves with E',x+w/2,y+38);
 });
}
function mhDrawNoobieStatue(ctx,d,t){
 const T=MH_TILE,x=d.tx*T,y=d.ty*T;
 const m=d.morph||mhMorph(d.morphId);
 const pw=T*1.35, ph=T*0.55;
 ctx.fillStyle='rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x+T/2,y+T*1.95,22,5,0,0,Math.PI*2); ctx.fill();
 ctx.fillStyle='#a8b0c0'; ctx.fillRect(x+T/2-pw/2,y+T*0.75,pw,ph);
 ctx.fillStyle='#788090'; ctx.fillRect(x+T/2-pw/2+6,y+T*0.75,pw-12,8);
 ctx.fillStyle='#c0c8d8'; ctx.fillRect(x+T/2-4,y+T*0.62,8,ph+6);
 const sc=(d.scale||6)*0.32;
 if(m) mhPaintNoobWorld(ctx,m,x+T/2,y+T*0.58,sc,1,false,t,0,false,false);
 else mhPaintHuman(ctx,x+T/2,y+T*0.58,0,t,1.45);
 ctx.fillStyle='rgba(0,0,0,.72)'; ctx.fillRect(x+T/2-52,y+T*1.72,104,16);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
 ctx.fillText(m?(m.name.slice(0,14).toUpperCase()):('NOOBIE'),x+T/2,y+T*1.84);
}
function mhDrawMapDecors(ctx,map,wi,t,save){
 mhDrawCourtZone(ctx,map,wi);
 mhDrawWorldFeature(ctx,map,wi);
 mhDrawParkZones(ctx,map,wi);
 if(save) mhDrawPlagueBugs(ctx,map,wi,t,save);
 (map.landmarks||[]).forEach(d=>mhDrawSceneryPiece(ctx,d,wi,t));
 (map.decors||[]).forEach(d=>mhDrawSceneryPiece(ctx,d,wi,t));
}
function mhDrawMapStatues(ctx,map,t,st){
 (map.statues||[]).forEach(d=>{ if(!d.mayor) mhDrawNoobieStatue(ctx,d,t); });
 mhDrawMayorShrine(ctx,map,t,st||{});
}
function mhParkCenter(map){
 const p=map.parks&&map.parks[0];
 if(!p) return null;
 return {px:(p.tx+p.w/2)*MH_TILE, py:(p.ty+p.h/2)*MH_TILE};
}
function mhCivState(st,wi,c){
 if(!st.civ) st.civ={};
 if(!st.civ[wi]) st.civ[wi]={};
 if(!st.civ[wi][c.id]) st.civ[wi][c.id]={px:c.px,py:c.py,phase:c.phase||0,dir:Math.random()*6.28,wait:0};
 return st.civ[wi][c.id];
}
function mhUpdateCivilians(st,map,wi,dt){
 if(!map.civilians) return;
 map.civilians.forEach(c=>{
  const s=mhCivState(st,wi,c);
  s.phase+=dt*3;
  if(!c.wander) return;
  s.wait-=dt;
  if(s.wait<=0){
   s.dir+=(Math.random()-0.5)*1.2;
   s.wait=0.6+Math.random()*2;
  }
  const spd=0.55;
  const npx=s.px+Math.cos(s.dir)*spd, npy=s.py+Math.sin(s.dir)*spd;
  if(!mhWalkCollide(map,npx,s.py,6)&&!mhWalkCollide(map,s.px,npy,6)){
   s.px=npx; s.py=npy;
  }else s.dir+=Math.PI*0.6;
  const hx=c.homePx||s.px, hy=c.homePy||s.py;
  if(Math.hypot(s.px-hx,s.py-hy)>90) s.dir=Math.atan2(hy-s.py,hx-s.px);
 });
}
function mhDrawCivilians(ctx,st,wi,map){
 if(!map.civilians) return;
 const list=map.civilians.map(c=>{ const s=mhCivState(st,wi,c); return {s,c}; });
 list.sort((a,b)=>a.s.py-b.s.py);
 list.forEach(({s,c})=>mhPaintHuman(ctx,s.px,s.py,c.variant,s.phase,0.78));
}
function mhDrawFlatMapTiles(ctx,map,world,wi,t){
 const voidRealm=wi===MH_VOID_WORLD;
 const pair=mhFlatGroundPair(world.ground);
 const wall=world.wall||(voidRealm?'#282038':'#4a5058');
 const prop=world.prop||(voidRealm?'#402060':'#6a5848');
 for(let ty=0;ty<map.h;ty++)for(let tx=0;tx<map.w;tx++){
  const v=map.tiles[ty*map.w+tx];
  const x=tx*MH_TILE,y=ty*MH_TILE;
  mhPaintWorldGroundTile(ctx,x,y,v,world,wi);
  ctx.strokeStyle=voidRealm?'#301848':'rgba(0,0,0,.12)';
  ctx.strokeRect(x+.5,y+.5,MH_TILE-1,MH_TILE-1);
 }
}
function mhPaperFlatOverlay(ctx,W,H){
 ctx.fillStyle='rgba(255,252,240,.06)';
 for(let y=0;y<H;y+=5) ctx.fillRect(0,y,W,1);
 ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=2;
 ctx.strokeRect(1,1,W-2,H-2);
 ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=1;
 ctx.strokeRect(3,3,W-6,H-6);
}
function mhDrawYouInWorld(ctx,wear,pos,map,t,walkPhase,wi,running){
 const m=wear||mhStarterMorph();
 const flat=mhMapFlat2D(wi);
 let sc=flat?0.82:1.08;
 if(!flat&&MH_1000D) sc*=0.92+(pos.py/(map.h*MH_TILE))*0.18;
 ctx.save();
 if(flat){
  ctx.strokeStyle='rgba(255,232,120,.95)'; ctx.lineWidth=2;
  ctx.strokeRect(pos.px-22,pos.py+18,44,4);
 }else{
  ctx.strokeStyle='rgba(255,232,120,.95)'; ctx.lineWidth=3;
  ctx.setLineDash([6,4]);
  ctx.beginPath(); ctx.ellipse(pos.px,pos.py+26,34,11,0,0,Math.PI*2); ctx.stroke();
  ctx.setLineDash([]);
 }
 if(m.plagueDoctor) mhDrawPlagueDoctorAura(ctx,pos.px,pos.py-18,t,0.85);
 mhPaintNoobWorld(ctx,m,pos.px,pos.py,sc,1,false,t,walkPhase||0,flat,!!running);
 if(m.plagueDoctor){
  const atk=m.voidAttack?.name||'Foul Cure';
  const pow=m.voidPower?.name||'Death Sigil';
  ctx.fillStyle='rgba(10,20,14,.92)'; ctx.fillRect(pos.px-78,pos.py+66,156,22);
  ctx.strokeStyle='#80ffb0'; ctx.lineWidth=1.5; ctx.strokeRect(pos.px-78,pos.py+66,156,22);
  ctx.fillStyle='#c8ffd8'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
  ctx.fillText('⚔ '+atk+' · ✦ '+pow+' · cures & ☠ orbit',pos.px,pos.py+80);
 }
 ctx.fillStyle='rgba(0,0,0,.82)';
 ctx.fillRect(pos.px-28,pos.py+50,56,16);
 ctx.fillStyle='#ffe8a0';
 ctx.font='bold 12px system-ui,sans-serif';
 ctx.textAlign='center';
 ctx.fillText('YOU',pos.px,pos.py+62);
 if(m&&(m.rarity==='voidfallen'||m.voidFallen)){
  const atk=m.voidAttack?.name||'Attack';
  const pow=m.voidPower?.name||'Power';
  ctx.fillStyle='rgba(20,0,40,.9)'; ctx.fillRect(pos.px-72,pos.py+66,144,22);
  ctx.strokeStyle=m.voidKing?'#ff4040':(m.voidAccent||'#9040ff'); ctx.lineWidth=1.5;
  ctx.strokeRect(pos.px-72,pos.py+66,144,22);
  ctx.fillStyle='#e8d0ff'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
  ctx.fillText('⚔ '+atk+' · ✦ '+pow,pos.px,pos.py+80);
  ctx.fillStyle='#ff8080'; ctx.font='bold 8px system-ui';
  ctx.fillText('🛡 '+MH_ANCIENT_GLYPHS.join(' ')+' · always on · '+MH_BUILD,pos.px,pos.py+92);
 }
 ctx.restore();
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
   codesUsed:[],
   minigameWon:[],
   chatPlayerId:'owner',
   chatDisplayName:'Owner',
   chatFriends:[]
  };
 }
 try{
  const raw=JSON.parse(localStorage.getItem(MH_STORE_KEY)||'null');
  if(!raw||!Array.isArray(raw.collected))return {...mhDefaultSave(),wearing:wear||'ex-welcome'};
  let collected=raw.collected.filter(id=>MH_MORPHS.some(m=>m.id===id));
  if(!collected.length) collected=['ex-welcome'];
  return{
   collected,
   worldsUnlocked:Math.max(1,Math.min(MH_WORLDS.length,+(raw.worldsUnlocked||1))),
   coins:Math.max(0,+(raw.coins||100)),
   wearing:(raw.wearing&&MH_MORPHS.some(m=>m.id===raw.wearing))?raw.wearing:(wear||collected[0]||'ex-welcome'),
   title:typeof raw.title==='string'?raw.title:'',
   codesUsed:Array.isArray(raw.codesUsed)?raw.codesUsed:[],
   minigameWon:Array.isArray(raw.minigameWon)?raw.minigameWon:[],
   chatPlayerId:typeof raw.chatPlayerId==='string'?raw.chatPlayerId:'',
   chatDisplayName:typeof raw.chatDisplayName==='string'?raw.chatDisplayName:'',
   chatFriends:Array.isArray(raw.chatFriends)?raw.chatFriends.filter(x=>typeof x==='string'):[],
   plagueQuest:mhNormalizePlagueQuest(raw.plagueQuest)
  };
 }catch(_){return {...mhDefaultSave(),wearing:wear};}
}
function mhRarityInfo(m){
 if(!m) return MH_RARITY.common;
 return MH_RARITY[m.rarity]||MH_RARITY.common;
}
function mhNeedsMinigame(m,save){
 if(!m||!save) return false;
 if(mhHasMorph(save,m.id)) return false;
 return true;
}
function mhDeckUnlock(m,save){
 if(!m||!save) return;
 if(mhHasMorph(save,m.id)){
  if(mhIsOwner()){ mhOpenMinigame(m); return; }
  mhWear(m.id);
  return;
 }
 mhOpenMinigame(m);
}
function mhMinigameCleared(save,id){
 return (save.minigameWon||[]).includes(id);
}
function mhModalHost(){
 return document.getElementById('morphhunt')||document.body;
}
function mhEnsureOverlayModals(){
 const host=mhModalHost();
 let mg=document.getElementById('mh-minigame-modal');
 if(!mg){
  mg=document.createElement('div');
  mg.id='mh-minigame-modal';
  mg.className='mh-found-modal mh-minigame-modal';
  mg.hidden=true;
  host.appendChild(mg);
 }else if(mg.parentElement!==host) host.appendChild(mg);
 let fd=document.getElementById('mh-found-modal');
 if(!fd){
  fd=document.createElement('div');
  fd.id='mh-found-modal';
  fd.className='mh-found-modal';
  fd.hidden=true;
  host.appendChild(fd);
 }else if(fd.parentElement!==host) host.appendChild(fd);
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
function mhWorldMorphs(wi){
 return MH_MORPHS.filter(m=>mhHuntWorld(m)===wi&&!m.codeOnly);
}
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
 if(m.voidKing){
  return `<ellipse cx="50" cy="124" rx="22" ry="4" fill="#000" opacity=".25"/>
   <rect x="32" y="66" width="14" height="36" fill="#141414" stroke="#801010" stroke-width="1"/>
   <rect x="54" y="66" width="14" height="36" fill="#141414" stroke="#801010" stroke-width="1"/>
   <rect x="28" y="38" width="44" height="28" fill="#580808" stroke="#a01010" stroke-width="1.5"/>
   <rect x="14" y="42" width="12" height="24" fill="#161616"/>
   <rect x="74" y="42" width="12" height="24" fill="#161616"/>
   <rect x="8" y="36" width="16" height="32" fill="#480808" stroke="#cc1010" stroke-width="1.5"/>
   <path d="M78 38 L88 28 L88 52 L78 48 Z" fill="#1a1a1a" stroke="#b01010"/>
   <rect x="76" y="20" width="6" height="28" fill="#2a1810"/>
   <rect x="72" y="8" width="14" height="14" fill="#0a0a0a" stroke="#ff2020"/>
   <rect x="33" y="6" width="34" height="34" fill="#161616" stroke="#801010" stroke-width="1.5"/>
   <rect x="36" y="10" width="28" height="26" fill="#0a0a0a"/>
   <rect x="40" y="22" width="20" height="4" fill="#ff2020" opacity=".9"/>`;
 }
 if(m.rarity==='voidfallen'||m.voidFallen){
  const gid='vf'+((mhHashStr(m.id||'vf')>>>0)%99999);
  const ve=m.voidEyes||'#ff5050';
  const acc=m.voidAccent||'#ff3030';
  const body=mhBodyShape(m);
  const sym=MH_ANCIENT_GLYPHS[(mhHashStr(m.id||'vf')%5)];
  return `<defs><radialGradient id="${gid}"><stop offset="0%" stop-color="#ff4040" stop-opacity=".5"/><stop offset="40%" stop-color="#280808" stop-opacity=".65"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
   <ellipse cx="50" cy="72" rx="42" ry="56" fill="url(#${gid})"/>
   <ellipse cx="50" cy="72" rx="36" ry="48" fill="none" stroke="#0a0a0a" stroke-width="4" opacity=".85"/>
   <ellipse cx="50" cy="72" rx="36" ry="48" fill="none" stroke="${acc}" stroke-width="2" opacity=".75"/>
   ${body}
   <rect x="26" y="46" width="48" height="10" fill="#0a0a0a" opacity=".85"/>
   <rect x="28" y="48" width="44" height="4" fill="${acc}" opacity=".95"/>
   <text x="50" y="54" text-anchor="middle" font-size="10" fill="#ffe0e0" font-family="serif">${sym}</text>
   <rect x="36" y="16" width="10" height="10" fill="${ve}"/><rect x="54" y="16" width="10" height="10" fill="${ve}"/>
   <rect x="38" y="18" width="5" height="5" fill="#fff" opacity=".5"/><rect x="56" y="18" width="5" height="5" fill="#fff" opacity=".5"/>
   <rect x="32" y="58" width="36" height="5" fill="rgba(255,40,40,.55)"/>
   <path d="M50 62 L46 72 L54 72 Z" fill="#0a0a0a" stroke="${acc}" stroke-width="1"/>`;
 }
 let hat='';
 if(m.hat==='crown') hat='<polygon points="50,2 58,14 42,14" fill="#ffd700"/><rect x="42" y="12" width="16" height="5" fill="#e8b020"/>';
 if(m.hat==='star') hat='<polygon points="50,0 52,10 62,10 54,16 57,26 50,20 43,26 46,16 38,10 48,10" fill="#ffe060"/>';
 if(m.hat==='wave') hat='<text x="68" y="18" font-size="12">👋</text>';
 if(m.hat==='party') hat='<circle cx="40" cy="8" r="4" fill="#ff4080"/><circle cx="60" cy="10" r="3" fill="#40c0ff"/>';
 if(m.hat==='gem') hat='<polygon points="50,0 58,14 50,20 42,14" fill="#80e0ff" stroke="#fff" stroke-width="1"/>';
 if(m.hat==='headphones') hat='<path d="M32 24 Q32 8 50 8 Q68 8 68 24" fill="none" stroke="#303840" stroke-width="4"/><rect x="28" y="22" width="8" height="14" rx="2" fill="#404850"/><rect x="64" y="22" width="8" height="14" rx="2" fill="#404850"/>';
 if(m.hat==='bow') hat='<polygon points="50,10 58,4 58,16" fill="#ff5090"/><polygon points="50,10 42,4 42,16" fill="#ff5090"/><circle cx="50" cy="10" r="3" fill="#ffc0d8"/>';
 if(m.hat==='voidhorn') hat='<polygon points="50,2 56,16 44,16" fill="#402060" stroke="#c080ff" stroke-width="1"/>';
 if(m.hat==='voidhalo') hat='<path d="M36 12 A14 14 0 0 1 64 12" fill="none" stroke="#c898ff" stroke-width="3"/><path d="M40 10 A10 10 0 0 1 60 10" fill="none" stroke="#fff" stroke-width="1" opacity=".4"/>';
 if(m.hat==='riftshard') hat='<polygon points="62,6 70,18 62,24 54,18" fill="#80e0ff" stroke="#fff" stroke-width="1"/>';
 if(m.hat==='plague') hat=`<ellipse cx="50" cy="12" rx="24" ry="11" fill="#1a2830" stroke="#506060" stroke-width="1.5"/>
  <ellipse cx="50" cy="14" rx="20" ry="8" fill="#2a3840"/>
  <path d="M50 14 L62 28 L58 32 L50 26 L42 32 L38 28 Z" fill="#303840" stroke="#809090" stroke-width="1"/>
  <circle cx="44" cy="10" r="3" fill="#101820"/><circle cx="56" cy="10" r="3" fill="#101820"/>`;
 if(m.plagueDoctor){
  hat+=`<text x="18" y="24" font-size="11">☠</text><text x="72" y="26" font-size="10">💊</text><text x="14" y="48" font-size="9">💀</text><text x="78" y="44" font-size="10">🧪</text>`;
 }
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

function mhMorphHuntIsOpen(){
 return !!(mhState&&document.getElementById('morphhunt'));
}
function mhMorphHuntTypingTarget(el){
 if(!el) return false;
 if(el.id==='mh-chat-input'||el.id==='mh-chat-friend-code') return true;
 return !!(el.closest&&el.closest('input,textarea,select,[contenteditable="true"]'));
}
function mhMorphHuntActivationKey(e){
 if(!e) return false;
 if(isSpaceKey(e)) return true;
 if(e.key==='Enter'||e.code==='Enter'||e.code==='NumpadEnter') return true;
 return false;
}
function mhMorphHuntObbySpaceOk(e){
 if(!mhState?.minigameMorph||mhState.minigameKind!=='obbyrun') return false;
 if(!isSpaceKey(e)) return false;
 const t=e.target;
 return !!(t&&(t.classList?.contains('mh-mini-canvas')||t.closest?.('.mh-mini-stage')));
}
function mhMorphHuntKeyGuard(e){
 if(!document.getElementById('morphhunt')) return;
 const t=e.target;
 if(mhMorphHuntTypingTarget(t)) return;
 if(mhMorphHuntObbySpaceOk(e)) return;
 if(mhMorphHuntActivationKey(e)){
  e.preventDefault();
  e.stopImmediatePropagation();
  return;
 }
}
function mhMorphHuntHideSiteChrome(){
 ['lithos-games-hub','lithos-adventure-preview','lithos-device-picker','stage-quiz','gift-notif'].forEach(id=>{
  const el=document.getElementById(id);
  if(!el) return;
  el.hidden=true;
  el.setAttribute('hidden','');
 });
 try{ document.querySelector('.overlay')?.classList.remove('open'); }catch(_){}
 try{ if(typeof closeDrawer==='function') closeDrawer(); }catch(_){}
 try{ if(typeof closeStageQuiz==='function') closeStageQuiz(); }catch(_){}
 try{ if(typeof closeGamesHub==='function') closeGamesHub({skipHash:true}); }catch(_){}
 try{ if(typeof closeAdventurePreview==='function') closeAdventurePreview(); }catch(_){}
}
function mhMorphHuntShieldSiteInput(){
 if(mhState?.siteShieldBound) return;
 mhState.siteShieldBound=true;
 const block=e=>{
  if(!document.getElementById('morphhunt')) return;
  const t=e.target;
  if(t&&t.closest&&t.closest('#morphhunt')) return;
  if(mhMorphHuntTypingTarget(t)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
 };
 document.addEventListener('click',block,true);
 document.addEventListener('pointerdown',block,true);
 mhState.siteShieldHandlers=block;
}
function mhMorphHuntUnshieldSiteInput(){
 if(!mhState?.siteShieldBound||!mhState.siteShieldHandlers) return;
 const block=mhState.siteShieldHandlers;
 document.removeEventListener('click',block,true);
 document.removeEventListener('pointerdown',block,true);
 mhState.siteShieldBound=false;
 mhState.siteShieldHandlers=null;
}
function mhMorphHuntBlurPageFocus(){
 try{
  const ae=document.activeElement;
  if(ae&&ae!==document.body&&typeof ae.blur==='function') ae.blur();
 }catch(_){}
}
function mhLikelyIdePreview(){
 try{
  if(window.self!==window.top) return true;
  const ua=(navigator.userAgent||'').toLowerCase();
  if(ua.includes('electron')) return true;
  if(location.protocol==='vscode-webview:'||location.protocol==='cursor-webview:') return true;
 }catch(_){}
 return false;
}
function mhIdeHintDismissed(){
 try{ return localStorage.getItem('lithos_mh_hide_ide_hint')==='1'; }catch(_){ return false; }
}
function mhIdePreviewHintHtml(){
 if(mhIdeHintDismissed()) return '';
 const url=location.href.split('#')[0]+'#morphhunt';
 const safe=url.replace(/"/g,'&quot;');
 const inIde=mhLikelyIdePreview();
 return `<aside class="mh-ide-preview-hint" role="note">
  <button type="button" class="mh-ide-hint-x" id="mh-ide-hint-dismiss" title="Hide this tip">×</button>
  <b>Blue ring outside the game?</b> Lithos cannot fix that — it is the <em>Cursor preview window</em> or Mac <em>Full Keyboard Access</em>.${inIde?' <em>(Detected embedded preview.)</em>':''}
  <span class="mh-ide-preview-actions">
   <a class="mh-ide-open-ext" href="${safe}" target="_blank" rel="noopener noreferrer">Open in Safari/Chrome ↗</a>
   <span class="mh-ide-preview-mac">Best on Mac: double-click <b>Play-Morph-Hunt-in-Safari.command</b> in your Lithos folder (opens real Safari). Or Terminal: <code>open -a Safari "${safe.replace(/&quot;/g,'"')}"</code></span>
   <span class="mh-ide-preview-mac">Mac settings: Accessibility → Keyboard → <b>Full Keyboard Access</b> OFF · Cursor: ⌘⇧P → <b>Developer: Reload Window</b></span>
  </span>
 </aside>`;
}
function mhBindIdeHint(root){
 root?.querySelector('#mh-ide-hint-dismiss')?.addEventListener('click',()=>{
  try{ localStorage.setItem('lithos_mh_hide_ide_hint','1'); }catch(_){}
  root.querySelector('.mh-ide-preview-hint')?.remove();
 });
 root?.querySelector('#mh-ide-hint-restore')?.addEventListener('click',()=>{
  try{ localStorage.removeItem('lithos_mh_hide_ide_hint'); }catch(_){}
  mhRender();
 });
}
function mhIdeHintRestoreLink(){
 if(!mhIdeHintDismissed()) return '';
 return `<p class="mh-ide-restore-row"><button type="button" class="mh-btn ghost mh-btn-sm" id="mh-ide-hint-restore">Show Safari / blue-ring help again</button></p>`;
}
function mhMorphHuntInertBackground(on){
 if(!mhState) return;
 if(on){
  mhState.inertEls=[];
  for(const el of document.body.children){
   if(el.id==='morphhunt') continue;
   mhState.inertEls.push(el);
   try{ el.inert=true; }catch(_){}
   try{ el.setAttribute('aria-hidden','true'); }catch(_){}
  }
 }else{
  (mhState.inertEls||[]).forEach(el=>{
   try{ el.inert=false; }catch(_){}
   try{ el.removeAttribute('aria-hidden'); }catch(_){}
  });
  mhState.inertEls=[];
 }
}
function mhMorphHuntFocusGame(){
 mhMorphHuntBlurPageFocus();
}
function mhMorphHuntBodyLock(on){
 try{
  if(on) document.body.classList.add('mh-hunt-open');
  else document.body.classList.remove('mh-hunt-open');
 }catch(_){}
}
function mhMorphHuntFocusOut(e){
 if(!document.getElementById('morphhunt')) return;
 const t=e.target;
 if(!t||t===document.body) return;
 if(t.closest&&t.closest('#morphhunt')) return;
 if(mhMorphHuntTypingTarget(t)) return;
 try{ t.blur(); }catch(_){}
}
function mhMorphHuntPatchSiteNav(){
 window.lithosMorphHuntActive=function(){ return !!document.getElementById('morphhunt'); };
 if(window.__mhEnterStratumPatched) return;
 window.__mhEnterStratumPatched=true;
 const orig=window.enterStratum;
 if(typeof orig!=='function') return;
 window.enterStratum=function(){
  if(document.getElementById('morphhunt')) return;
  return orig.apply(this,arguments);
 };
}
function mhMorphHuntBindModal(){
 mhMorphHuntPatchSiteNav();
 document.addEventListener('keydown',mhMorphHuntKeyGuard,true);
 document.addEventListener('keyup',mhMorphHuntKeyGuard,true);
 document.addEventListener('focusin',mhMorphHuntFocusOut,true);
}
function mhMorphHuntUnbindModal(){
 document.removeEventListener('keydown',mhMorphHuntKeyGuard,true);
 document.removeEventListener('keyup',mhMorphHuntKeyGuard,true);
 document.removeEventListener('focusin',mhMorphHuntFocusOut,true);
}
function mhClose(){
 mhWalkStop();
 mhPreviewStop();
 mhMorphHuntUnshieldSiteInput();
 mhMorphHuntInertBackground(false);
 mhMorphHuntUnbindModal();
 mhMorphHuntBodyLock(false);
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
let mhChatBroadcast=null;
function mhChatConfig(){
 return (typeof window!=='undefined'&&window.LITHOS_CHAT_CONFIG)||null;
}
function mhChatRelayOn(){
 const c=mhChatConfig();
 return !!(c&&c.relay);
}
function mhEnsureChatProfile(save){
 if(!save) return {id:'guest',name:'Noobie'};
 if(!save.chatPlayerId){
  save.chatPlayerId='noob-'+Math.random().toString(36).slice(2,11);
  mhSaveSave(save);
 }
 const morph=mhMorph(save.wearing);
 const name=(save.chatDisplayName||'').trim()||(morph?.name)||('Noobie '+save.chatPlayerId.slice(-4));
 return {id:save.chatPlayerId,name:name.slice(0,24),morphId:save.wearing||''};
}
function mhChatLoadStore(){
 try{
  const raw=JSON.parse(localStorage.getItem(MH_CHAT_LOG_KEY)||'[]');
  return Array.isArray(raw)?raw:[];
 }catch(_){ return []; }
}
function mhChatSaveStore(list){
 try{ localStorage.setItem(MH_CHAT_LOG_KEY,JSON.stringify(list.slice(-400))); }catch(_){}
}
function mhChatLocalQuery(channel,since,world,peerId){
 const sinceT=+(since||0);
 return mhChatLoadStore().filter(m=>{
  if(!m||m.t<=sinceT) return false;
  if(m.channel!==channel) return false;
  if(channel==='server'&&world!=null&&m.world!==world) return false;
  if(channel==='friend'&&peerId){
   const me=mhState?.save?mhEnsureChatProfile(mhState.save).id:'';
   return (m.fromId===me&&m.toId===peerId)||(m.fromId===peerId&&m.toId===me);
  }
  return true;
 });
}
async function mhChatFetchRemote(channel,since,world,peerId){
 const cfg=mhChatConfig();
 if(!cfg?.relay) return null;
 try{
  const base=String(cfg.relay).replace(/\/$/,'');
  const path=base.includes('/messages')?base:(base+'/messages');
  const q=new URLSearchParams();
  q.set('channel',channel);
  q.set('since',String(since||0));
  if(channel==='server'&&world!=null) q.set('world',String(world));
  if(channel==='friend'&&peerId) q.set('peer',peerId);
  const r=await fetch(path+'?'+q.toString(),{headers:cfg.headers||{},cache:'no-store'});
  if(!r.ok) return null;
  const data=await r.json();
  return Array.isArray(data)?data:(data.messages||[]);
 }catch(_){ return null; }
}
async function mhChatPostRemote(msg){
 const cfg=mhChatConfig();
 if(!cfg?.relay) return false;
 try{
  const base=String(cfg.relay).replace(/\/$/,'');
  const url=base.includes('/messages')?base:base+'/messages';
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(cfg.headers||{})},body:JSON.stringify(msg)});
  return r.ok;
 }catch(_){ return false; }
}
function mhChatMergeMessages(incoming){
 if(!incoming?.length) return;
 const store=mhChatLoadStore();
 const ids=new Set(store.map(m=>m.id));
 let added=0;
 incoming.forEach(m=>{
  if(!m?.id||ids.has(m.id)) return;
  store.push(m); ids.add(m.id); added++;
 });
 if(added) mhChatSaveStore(store);
 return added;
}
function mhChatBroadcastInit(){
 if(mhChatBroadcast||typeof BroadcastChannel==='undefined') return;
 mhChatBroadcast=new BroadcastChannel(MH_CHAT_BROADCAST);
 mhChatBroadcast.onmessage=(e)=>{ if(e?.data?.id) mhChatIngest(e.data,true); };
}
function mhChatSpawnBubble(st,wx,wy,text,who,ms){
 if(!st) return;
 if(!st.chatBubbles) st.chatBubbles=[];
 st.chatBubbles.push({x:wx,y:wy,text:String(text).slice(0,72),who:who||'',until:performance.now()+(ms||5000)});
}
function mhChatIngest(msg,silent){
 if(!msg?.id||!mhState) return;
 const added=mhChatMergeMessages([msg]);
 if(!added) return;
 const me=mhEnsureChatProfile(mhState.save).id;
 if(msg.fromId===me) return;
 const wi=mhState.world;
 const pos=mhWalkEnsurePos(mhState,wi);
 if(msg.channel==='server'&&msg.world===wi){
  const nx=pos.px+((mhHashStr(msg.fromId)%160)-80);
  const ny=pos.py-30-((mhHashStr(msg.fromId+'y')%50));
  mhChatSpawnBubble(mhState,nx,ny,(msg.fromName||'Noobie')+': '+msg.text,'remote');
  if(!mhState.chatNpcLine) mhState.chatNpcLine={};
  mhState.chatNpcLine['_remote_'+msg.fromId]={text:msg.text.slice(0,48),until:performance.now()+5000};
 }
 if(!silent) mhChatRefreshLog();
}
function mhChatSend(st,save,text){
 const raw=String(text||'').trim();
 if(!raw||!st||!save) return;
 const prof=mhEnsureChatProfile(save);
 const channel=st.chatChannel||'global';
 const wi=st.world;
 let toId='';
 if(channel==='friend'){
  toId=(st.chatFriendPeer||'').trim();
  if(!toId){ mhToast('Pick a friend code first!'); return; }
  if(!save.chatFriends?.includes(toId)){ mhToast('Add them as a friend first (Friends tab).'); return; }
 }
 const msg={
  id:'m'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
  channel,
  world:channel==='server'?wi:undefined,
  fromId:prof.id,
  fromName:prof.name,
  morphId:prof.morphId,
  toId:toId||undefined,
  text:raw.slice(0,160),
  t:Date.now()
 };
 mhChatMergeMessages([msg]);
 mhChatPostRemote(msg);
 try{ mhChatBroadcast?.postMessage(msg); }catch(_){}
 const pos=mhWalkEnsurePos(st,wi);
 mhChatSpawnBubble(st,pos.px,pos.py-28,raw,'you',5500);
 if(channel==='server'){
  const near=mhWalkNearMorph(save,wi,pos,st);
  if(near){
   const replies=['Hey!','Want a duel?','Cool noobie!','I was gonna say that!','See you in the grove!'];
   if(!st.chatNpcLine) st.chatNpcLine={};
   st.chatNpcLine[near.id]={text:replies[mhHashStr(raw+near.id)%replies.length],until:performance.now()+5200};
  }
 }
 mhChatRefreshLog();
 const inp=document.getElementById('mh-chat-input');
 if(inp) inp.value='';
 if(!mhChatRelayOn()&&channel!=='friend') mhToast(channel==='global'?'💬 Global (device + tabs). Set LITHOS_CHAT_CONFIG.relay for real server!':'💬 Server chat on this map (device + tabs).');
}
function mhChatRefreshLog(){
 const log=document.getElementById('mh-chat-log');
 if(!log||!mhState) return;
 const channel=mhState.chatChannel||'global';
 const wi=mhState.world;
 const peer=mhState.chatFriendPeer||'';
 const me=mhEnsureChatProfile(mhState.save).id;
 const rows=mhChatLoadStore()
  .filter(m=>{
   if(m.channel!==channel) return false;
   if(channel==='server'&&m.world!==wi) return false;
   if(channel==='friend'){
    return (m.fromId===me&&m.toId===peer)||(m.fromId===peer&&m.toId===me);
   }
   return true;
  })
  .sort((a,b)=>a.t-b.t)
  .slice(-40);
 log.innerHTML=rows.length?rows.map(m=>{
  const mine=m.fromId===me;
  const tag=channel==='server'?(' · map '+m.world):'';
  return `<div class="mh-chat-line${mine?' mine':''}"><b>${mine?'You':(m.fromName||'Noobie')}</b>${tag}: ${m.text.replace(/</g,'&lt;')}</div>`;
 }).join(''):'<div class="mh-chat-line dim">Say hi! Press <b>T</b> to talk. Your noobie shows speech bubbles on the map.</div>';
 log.scrollTop=log.scrollHeight;
}
async function mhChatPoll(st){
 if(!st||st.tab!=='hunt') return;
 const channel=st.chatChannel||'global';
 if(!st.chatSince) st.chatSince={global:0,server:0,friend:0};
 const since=st.chatSince[channel]||0;
 const wi=st.world;
 const peer=st.chatFriendPeer||'';
 const remote=await mhChatFetchRemote(channel,since,wi,peer);
 const local=mhChatLocalQuery(channel,since,channel==='server'?wi:null,channel==='friend'?peer:null);
 const batch=[...(remote||[]),...local].sort((a,b)=>a.t-b.t);
 let maxT=since;
 batch.forEach(m=>{
  if(m.t<=since) return;
  mhChatIngest(m,true);
  if(m.t>maxT) maxT=m.t;
 });
 st.chatSince[channel]=maxT;
 mhChatRefreshLog();
}
function mhChatStartPoll(st){
 mhChatBroadcastInit();
 mhChatStopPoll(st);
 st.chatPollIv=setInterval(()=>{ mhChatPoll(st); },MH_CHAT_POLL_MS);
 mhChatPoll(st);
}
function mhChatStopPoll(st){
 if(st?.chatPollIv){ clearInterval(st.chatPollIv); st.chatPollIv=0; }
}
function mhDrawChatBubble(ctx,sx,sy,text,mine){
 const t=String(text||'');
 if(!t) return;
 ctx.save();
 ctx.font='bold 11px system-ui,sans-serif';
 const maxW=140;
 const words=t.split(' ');
 let line='', lines=[];
 words.forEach(w=>{
  const tryLine=line?(line+' '+w):w;
  if(ctx.measureText(tryLine).width>maxW){ if(line) lines.push(line); line=w; }
  else line=tryLine;
 });
 if(line) lines.push(line);
 const h=lines.length*14+10;
 const w=Math.min(maxW,Math.max(...lines.map(l=>ctx.measureText(l).width),40))+16;
 const x=sx-w/2, y=sy-h-8;
 ctx.fillStyle=mine?'rgba(255,232,120,.95)':'rgba(240,248,255,.92)';
 ctx.strokeStyle=mine?'rgba(255,180,60,.8)':'rgba(120,160,255,.55)';
 ctx.lineWidth=2;
 ctx.beginPath();
 if(typeof ctx.roundRect==='function') ctx.roundRect(x,y,w,h,8);
 else ctx.rect(x,y,w,h);
 ctx.fill(); ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(sx,y+h);
 ctx.lineTo(sx-6,y+h+8);
 ctx.lineTo(sx+6,y+h+8);
 ctx.closePath();
 ctx.fill(); ctx.stroke();
 ctx.fillStyle='#1a1a20';
 ctx.textAlign='center';
 lines.forEach((ln,i)=>ctx.fillText(ln,sx,y+18+i*14));
 ctx.restore();
}
function mhDrawChatBubbles(ctx,st,camX,camY){
 if(!st?.chatBubbles?.length) return;
 const now=performance.now();
 st.chatBubbles=st.chatBubbles.filter(b=>b.until>now);
 st.chatBubbles.forEach(b=>{
  mhDrawChatBubble(ctx,b.x-camX,b.y-camY,b.text,b.who==='you');
 });
}
function mhDrawNpcChatLines(ctx,st,wi,morphs,camX,camY){
 if(!st?.chatNpcLine) return;
 const now=performance.now();
 Object.keys(st.chatNpcLine).forEach(k=>{
  const line=st.chatNpcLine[k];
  if(!line||line.until<now){ delete st.chatNpcLine[k]; return; }
  let mx,my;
  if(k.startsWith('_remote_')){
   const pos=mhWalkEnsurePos(st,wi);
   mx=pos.px+((mhHashStr(k)%120)-60);
   my=pos.py-40;
  }else{
   const morph=morphs.find(x=>x.id===k);
   if(!morph?.tileX) return;
   const p=mhGetNpcPos(st,wi,morph);
   mx=p.px; my=p.py;
  }
  mhDrawChatBubble(ctx,mx-camX,my-camY-56,line.text,false);
 });
}
function mhRenderChatPanel(save){
 const prof=mhEnsureChatProfile(save);
 const ch=mhState?.chatChannel||'global';
 const friends=Array.isArray(save.chatFriends)?save.chatFriends:[];
 const relay=mhChatRelayOn();
 return `<aside class="mh-chat-panel" aria-label="Character chat">
  <div class="mh-chat-head"><span>💬 Talk</span><small>${relay?'🌐 Server live':'📱 Device + tabs'} · <code>${prof.id}</code></small></div>
  <div class="mh-chat-tabs">
   <button type="button" class="mh-chat-tab${ch==='global'?' on':''}" data-mh-chat-ch="global">Global</button>
   <button type="button" class="mh-chat-tab${ch==='server'?' on':''}" data-mh-chat-ch="server">Server</button>
   <button type="button" class="mh-chat-tab${ch==='friend'?' on':''}" data-mh-chat-ch="friends">Friends</button>
  </div>
  <div id="mh-chat-log" class="mh-chat-log"></div>
  <div class="mh-chat-friends${ch==='friend'?'':' hidden'}" id="mh-chat-friends-ui">
   <div class="mh-chat-friend-add"><input type="text" id="mh-chat-friend-code" placeholder="Friend code…" autocomplete="off"/><button type="button" class="mh-btn mh-btn-sm" id="mh-chat-friend-add">Add</button></div>
   <select id="mh-chat-friend-pick" class="mh-chat-friend-pick"><option value="">— message friend —</option>${friends.map(f=>`<option value="${f.replace(/"/g,'&quot;')}"${mhState?.chatFriendPeer===f?' selected':''}>${f}</option>`).join('')}</select>
  </div>
  <div class="mh-chat-chips">
   <button type="button" class="mh-chat-chip" data-mh-chat-quick="Hello!">Hello!</button>
   <button type="button" class="mh-chat-chip" data-mh-chat-quick="Want to fight?">Want to fight?</button>
   <button type="button" class="mh-chat-chip" data-mh-chat-quick="Follow me!">Follow me!</button>
  </div>
  <div class="mh-chat-row">
   <input id="mh-chat-input" type="text" maxlength="160" placeholder="Type & Enter · T to focus" autocomplete="off"/>
   <button type="button" class="mh-btn primary mh-btn-sm" id="mh-chat-send">Send</button>
  </div>
  <p class="mh-chat-hint">Your morphed noobie speaks in bubbles. <b>Server</b> = this map zone. Optional: <code>LITHOS_CHAT_CONFIG.relay</code> in the page for real online chat.</p>
 </aside>`;
}
function mhBindChat(root){
 if(!root||!mhState) return;
 root.querySelectorAll('[data-mh-chat-ch]').forEach(btn=>{
  btn.onclick=()=>{
   const v=btn.dataset.mhChatCh;
   mhState.chatChannel=v==='friends'?'friend':v;
   root.querySelectorAll('.mh-chat-tab').forEach(t=>t.classList.toggle('on',t.dataset.mhChatCh===v));
   root.querySelector('#mh-chat-friends-ui')?.classList.toggle('hidden',v!=='friends');
   mhChatRefreshLog();
  };
 });
 const send=()=>{
  const inp=root.querySelector('#mh-chat-input');
  if(inp?.value) mhChatSend(mhState,mhState.save,inp.value);
 };
 root.querySelector('#mh-chat-send')?.addEventListener('click',send);
 const inp=root.querySelector('#mh-chat-input');
 if(inp){
  inp.onkeydown=(e)=>{
   if(e.key==='Enter'){ e.preventDefault(); send(); }
   e.stopPropagation();
  };
 }
 root.querySelectorAll('[data-mh-chat-quick]').forEach(btn=>{
  btn.onclick=()=>mhChatSend(mhState,mhState.save,btn.dataset.mhChatQuick);
 });
 const friendAdd=root.querySelector('#mh-chat-friend-add');
 if(friendAdd) friendAdd.onclick=()=>{
  const code=(root.querySelector('#mh-chat-friend-code')?.value||'').trim();
  if(!code||code===mhEnsureChatProfile(mhState.save).id){ mhToast('Need a different friend code.'); return; }
  if(!mhState.save.chatFriends) mhState.save.chatFriends=[];
  if(!mhState.save.chatFriends.includes(code)) mhState.save.chatFriends.push(code);
  mhSaveSave(mhState.save);
  mhToast('Friend added: '+code);
  mhRender();
 };
 const pick=root.querySelector('#mh-chat-friend-pick');
 if(pick) pick.onchange=()=>{ mhState.chatFriendPeer=pick.value; mhChatRefreshLog(); };
 mhChatRefreshLog();
}

function mhShowFound(m){
 mhEnsureOverlayModals();
 const modal=document.getElementById('mh-found-modal');
 if(!modal)return;
 const r=mhRarityInfo(m);
 modal.innerHTML=`<div class="mh-found-card" style="--mh-rarity:${r.color}">
  <div class="mh-found-badge">${mhRarityLabel(m)} Noobie!</div>
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
 if(!silent){
  mhToast('You morphed into '+mhMorph(id).name+'!');
  if(mhMorph(id)?.plagueDoctor) mhPlagueDoctorSay(mhState?.save,0);
 }
 mhRender();
}

function mhFinishCollect(m){
 if(!m||!mhState) return;
 const save=mhState.save;
 if(mhHasMorph(save,m.id)) return;
 save.collected.push(m.id);
 save.coins+=MH_COINS_PER_FIND;
 mhSaveSave(save);
 const wi=m.world;
 if(mhWorldComplete(save,wi)&&save.worldsUnlocked<=wi+1&&wi+1<MH_WORLDS.length){
  save.worldsUnlocked=Math.max(save.worldsUnlocked,wi+2);
  mhSaveSave(save);
  mhToast('Zone cleared! Unlocked: '+MH_WORLDS[wi+1].emoji+' '+MH_WORLDS[wi+1].name);
  try{if(typeof SFX!=='undefined'&&SFX.win)SFX.win();}catch(_){}
 }else try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
 mhRender();
 mhShowFound(m);
}
function mhCollect(id){
 const m=mhMorph(id);
 if(!m||!mhState)return;
 const save=mhState.save;
 if(mhHasMorph(save,id)){
  mhWear(id);
  return;
 }
 if(m.exclusive&&!mhIsOwner()&&m.vaultOnly&&mhState.world!==MH_EXOTIC_WORLD){
  mhToast('Find this one in 💎 Exotic Realm or Exclusive Gacha!'); return;
 }
 mhDeckUnlock(m,save);
}
const MH_MINI_KINDS=['noobduel','obbyrun','jumpfight'];
const MH_MINI_DESC={
 noobduel:'⚔ Duel — fight this noobie! Punch · Block · Win the brawl!',
 obbyrun:'🏃 Obby — auto-run & jump (Space) over pits & spikes to the flag!',
 jumpfight:'👊 Jump-in fight — counter when they leap at you (5 times)!'
};
function mhMinigameKind(m){
 return MH_MINI_KINDS[(mhHashStr(m.id+'mg')>>>0)%MH_MINI_KINDS.length];
}
function mhMinigameEnemyHp(m){
 const t={common:55,uncommon:72,rare:92,epic:118,legendary:145,secret:165,exotic:185,voidfallen:220,exclusive:100};
 return t[m.rarity]||65;
}
function mhMinigameCleanup(){
 if(!mhState) return;
 if(mhState.minigameRaf){ cancelAnimationFrame(mhState.minigameRaf); mhState.minigameRaf=0; }
 if(mhState.minigameIv){ clearInterval(mhState.minigameIv); mhState.minigameIv=0; }
 if(mhState.minigameKeys){
  document.removeEventListener('keydown',mhState.minigameKeys,true);
  mhState.minigameKeys=null;
 }
}
function mhOpenMinigame(m){
 if(!mhState) return;
 mhEnsureOverlayModals();
 mhMinigameCleanup();
 mhState.minigameMorph=m;
 const kind=mhMinigameKind(m);
 mhState.minigameKind=kind;
 const modal=document.getElementById('mh-minigame-modal');
 if(!modal) return;
 const r=mhRarityInfo(m);
 modal.hidden=false;
 modal.style.zIndex='100020';
 modal.innerHTML=`<div class="mh-minigame-card mh-minigame-card-action" style="--mh-rarity:${r.color}">
  <div class="mh-found-badge">Unlock ${mhRarityLabel(m)} · ${m.name}</div>
  <p class="mh-mini-desc">${MH_MINI_DESC[kind]||'Win the action challenge!'}</p>
  <div id="mh-mini-stage" class="mh-mini-stage mh-mini-stage-action"></div>
  <button type="button" class="mh-btn ghost" id="mh-mini-cancel">Back to hunt</button>
 </div>`;
 modal.querySelector('#mh-mini-cancel').onclick=()=>{ mhMinigameCleanup(); modal.hidden=true; mhState.minigameMorph=null; };
 mhRunMinigame(kind,m);
}
function mhWinMinigame(m){
 if(!mhState||!m) return;
 mhMinigameCleanup();
 const save=mhState.save;
 if(!save.minigameWon) save.minigameWon=[];
 if(!save.minigameWon.includes(m.id)) save.minigameWon.push(m.id);
 mhSaveSave(save);
 const modal=document.getElementById('mh-minigame-modal');
 if(modal) modal.hidden=true;
 mhState.minigameMorph=null;
 mhToast('You won the fight — noobie unlocked!');
 mhFinishCollect(m);
}
function mhMiniFail(m,msg,kind){
 mhToast(msg||'Try again!');
 mhMinigameCleanup();
 mhRunMinigame(kind,m);
}
function mhRunMinigame(kind,m){
 const stage=document.getElementById('mh-mini-stage');
 if(!stage) return;
 mhMinigameCleanup();
 stage.innerHTML='';
 const head=m.head||'#F5CD30', torso=m.torso||'#0085DB', legs=m.legs||'#A4BD47';
 if(kind==='noobduel'){
  let playerHp=100, enemyHp=mhMinigameEnemyHp(m), blocking=false, enemyWind=0, flash=0;
  const status=document.createElement('p'); status.className='mh-mini-status'; status.textContent='⚔ Fight '+m.name+'!';
  stage.appendChild(status);
  const canvas=document.createElement('canvas'); canvas.className='mh-mini-canvas'; canvas.width=340; canvas.height=168;
  stage.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const btns=document.createElement('div'); btns.className='mh-mini-fightbtns';
  btns.innerHTML='<button type="button" class="mh-btn primary mh-btn-sm" data-a="punch">👊 Punch</button><button type="button" class="mh-btn mh-btn-sm" data-a="block">🛡 Block</button>';
  stage.appendChild(btns);
  const draw=()=>{
   ctx.fillStyle='#0a1018'; ctx.fillRect(0,0,340,168);
   ctx.fillStyle='#1a2838'; ctx.fillRect(0,130,340,38);
   ctx.fillStyle='#ffe8a0'; ctx.font='bold 11px system-ui'; ctx.textAlign='left';
   ctx.fillText('YOU '+Math.max(0,Math.ceil(playerHp)),12,18);
   ctx.textAlign='right'; ctx.fillText(m.name.slice(0,16)+' '+Math.max(0,Math.ceil(enemyHp)),328,18);
   ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(12,22,100,6); ctx.fillRect(228,22,100,6);
   ctx.fillStyle='#80ffb0'; ctx.fillRect(12,22,100*Math.max(0,playerHp/100),6);
   ctx.fillStyle='#ff7070'; ctx.fillRect(228,22,100*Math.max(0,enemyHp/mhMinigameEnemyHp(m)),6);
   ctx.fillStyle=head; ctx.fillRect(52,72,22,22);
   ctx.fillStyle=torso; ctx.fillRect(48,94,30,28);
   ctx.fillStyle=legs; ctx.fillRect(50,122,12,18); ctx.fillRect(64,122,12,18);
   if(blocking){ ctx.strokeStyle='#80c8ff'; ctx.lineWidth=3; ctx.strokeRect(38,68,50,78); }
   ctx.fillStyle=head; ctx.fillRect(252,68,24,24);
   ctx.fillStyle=torso; ctx.fillRect(246,92,36,30);
   ctx.fillStyle=legs; ctx.fillRect(250,122,14,18); ctx.fillRect(268,122,14,18);
   if(enemyWind>0){ ctx.fillStyle='rgba(255,80,80,.7)'; ctx.font='bold 14px system-ui'; ctx.textAlign='center'; ctx.fillText('!',286,58); }
   if(flash>0){ ctx.fillStyle='rgba(255,255,255,'+(flash*0.35)+')'; ctx.fillRect(0,0,340,168); flash-=0.08; }
  };
  const loop=()=>{ draw(); mhState.minigameRaf=requestAnimationFrame(loop); };
  loop();
  const enemyAtk=()=>{
   if(enemyHp<=0||playerHp<=0) return;
   enemyWind=1;
   setTimeout(()=>{
    enemyWind=0;
    if(enemyHp<=0||playerHp<=0) return;
    const dmg=blocking?4:14+(mhHashStr(m.id+'atk')%8);
    playerHp-=dmg; flash=1;
    status.textContent=blocking?'Blocked!':'Ouch — they hit you!';
    if(playerHp<=0){ clearInterval(mhState.minigameIv); mhMiniFail(m,'Knocked out — rematch!','noobduel'); }
   },520);
  };
  mhState.minigameIv=setInterval(enemyAtk,1900);
  btns.querySelector('[data-a="punch"]').onclick=()=>{
   if(enemyHp<=0||playerHp<=0) return;
   const dmg=10+(mhHashStr(String(Date.now()))%9);
   enemyHp-=dmg; flash=0.6;
   status.textContent='Punch! -'+dmg+' HP';
   try{if(typeof SFX!=='undefined'&&SFX.hit)SFX.hit();}catch(_){}
   if(enemyHp<=0){ clearInterval(mhState.minigameIv); mhWinMinigame(m); }
  };
  btns.querySelector('[data-a="block"]').onclick=()=>{
   blocking=true; status.textContent='Blocking…';
   setTimeout(()=>{ blocking=false; },650);
  };
  return;
 }
 if(kind==='obbyrun'){
  let px=24, py=96, vy=0, onGround=true, scroll=0, dead=false, won=false;
  const len=920;
  const status=document.createElement('p'); status.className='mh-mini-status'; status.textContent='🏃 Space / Tap = jump · reach the flag!';
  stage.appendChild(status);
  const canvas=document.createElement('canvas'); canvas.className='mh-mini-canvas'; canvas.width=340; canvas.height=168;
  stage.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const jump=()=>{ if(onGround&&!dead&&!won){ vy=-11.5; onGround=false; } };
  canvas.onclick=jump;
  const onKey=(e)=>{
   if(e.code==='Space'||e.code==='ArrowUp'){ e.preventDefault(); jump(); }
  };
  document.addEventListener('keydown',onKey,true);
  mhState.minigameKeys=onKey;
  const pits=[]; for(let i=0;i<14;i++){
   pits.push({x:120+i*58, w:28+(i%3)*8, spike:i%2===0});
  }
  const tick=()=>{
   if(dead||won) return;
   scroll+=2.4;
   px+=2.4;
   vy+=0.55; py+=vy;
   if(py>=96){ py=96; vy=0; onGround=true; }
   const wx=px;
   let overPit=false;
   pits.forEach(p=>{
    if(wx>p.x&&wx<p.x+p.w) overPit=true;
   });
   if(overPit&&py>=94){ dead=true; mhMiniFail(m,'Fell in the pit — run it back!','obbyrun'); return; }
   pits.forEach(p=>{
    if(p.spike&&Math.abs(wx-(p.x+p.w*0.5))<14&&py>78){ dead=true; mhMiniFail(m,'Spikes got you!','obbyrun'); }
   });
   if(px>=len){ won=true; mhWinMinigame(m); return; }
   ctx.fillStyle='#101820'; ctx.fillRect(0,0,340,168);
   ctx.fillStyle='#283848'; ctx.fillRect(0,108,340,60);
   ctx.save(); ctx.translate(-scroll*0.85+40,0);
   pits.forEach(p=>{
    ctx.fillStyle='#0a0e14'; ctx.fillRect(p.x,108,p.w,60);
    if(p.spike){
     ctx.fillStyle='#ff4040';
     for(let s=0;s<p.w;s+=10) ctx.fillRect(p.x+s,100,8,12);
    }
   });
   ctx.fillStyle='#80ffb0'; ctx.fillRect(len,88,16,20); ctx.fillStyle='#ffe060'; ctx.font='20px system-ui'; ctx.fillText('🏁',len-4,82);
   ctx.fillStyle=head; ctx.fillRect(px-10,py-28,20,20);
   ctx.fillStyle=torso; ctx.fillRect(px-12,py-8,24,22);
   ctx.fillStyle=legs; ctx.fillRect(px-10,py+14,8,14); ctx.fillRect(px+2,py+14,8,14);
   ctx.restore();
   status.textContent='🏃 Distance '+Math.floor(px)+' / '+len;
   mhState.minigameRaf=requestAnimationFrame(tick);
  };
  mhState.minigameRaf=requestAnimationFrame(tick);
  return;
 }
 if(kind==='jumpfight'){
  let score=0, misses=0, phase='idle', t=0, lx=170;
  const need=5, maxMiss=3;
  const status=document.createElement('p'); status.className='mh-mini-status'; status.textContent='Wait… then FIGHT when '+m.name+' jumps in!';
  stage.appendChild(status);
  const canvas=document.createElement('canvas'); canvas.className='mh-mini-canvas'; canvas.width=340; canvas.height=168;
  stage.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const btn=document.createElement('button'); btn.type='button'; btn.className='mh-btn primary mh-btn-sm mh-mini-counter';
  btn.textContent='👊 FIGHT!'; stage.appendChild(btn);
  const draw=()=>{
   ctx.fillStyle='#120818'; ctx.fillRect(0,0,340,168);
   ctx.fillStyle='#ffe8a0'; ctx.font='bold 11px system-ui'; ctx.textAlign='center';
   ctx.fillText('Counters '+score+'/'+need+' · Misses '+misses+'/'+maxMiss,170,20);
   ctx.fillStyle=head; ctx.fillRect(lx-14,phase==='lunge'?72:48,28,28);
   ctx.fillStyle=torso; ctx.fillRect(lx-18,phase==='lunge'?96:76,36,32);
   if(phase==='lunge'){
    ctx.strokeStyle='#ff8080'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(lx,100); ctx.lineTo(80,110); ctx.stroke();
   }
   ctx.fillStyle='#6080ff'; ctx.fillRect(40,90,24,24); ctx.fillRect(36,114,12,20); ctx.fillRect(52,114,12,20);
  };
  const loop=()=>{ t++; draw(); mhState.minigameRaf=requestAnimationFrame(loop); };
  loop();
  const schedule=()=>{
   phase='idle'; lx=80+mhHashStr(String(Date.now())+'j')%180;
   const wait=900+mhHashStr(String(Date.now())+'w')%900;
   setTimeout(()=>{
    if(score>=need) return;
    phase='lunge'; status.textContent='NOW — FIGHT!';
    setTimeout(()=>{
     if(phase==='lunge'){
      phase='idle'; misses++; status.textContent='Too slow! '+misses+'/'+maxMiss+' misses';
      if(misses>=maxMiss) mhMiniFail(m,m.name+' overwhelmed you!','jumpfight');
      else schedule();
     }
    },550);
   },wait);
  };
  schedule();
  btn.onclick=()=>{
   if(phase==='lunge'){
    phase='idle'; score++; status.textContent='Counter! '+score+'/'+need;
    try{if(typeof SFX!=='undefined'&&SFX.hit)SFX.hit();}catch(_){}
    if(score>=need) mhWinMinigame(m);
    else schedule();
   }else{ misses++; status.textContent='Not yet! '+misses+'/'+maxMiss; if(misses>=maxMiss) mhMiniFail(m,'Wrong timing!','jumpfight'); }
  };
  return;
 }
}

function mhRedeemCode(raw){
 const key=String(raw||'').trim().toLowerCase().replace(/\s+/g,'');
 if(!key||!mhState)return false;
 const pack=MH_CODES[key];
 if(!pack){ mhToast('Invalid code — try GLITCHHOUSE or WELCOMEBUDDY'); return false; }
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
 const weights={common:40,uncommon:28,rare:18,epic:10,legendary:4,exclusive:8,secret:3,exotic:2,voidfallen:1};
 let bag=[];
 pool.forEach(m=>{ const w=weights[m.rarity]||5; for(let i=0;i<w;i++) bag.push(m); });
 const pick=bag[Math.floor(Math.random()*bag.length)];
 mhSaveSave(save);
 mhRender();
 mhOpenMinigame(pick);
}

function mhSetWorld(wi){
 if(!mhState)return;
 if(!mhWorldTeleportUnlocked(mhState.save,wi)) return;
 mhState.world=wi;
 if(mhState.walkPos) delete mhState.walkPos[wi];
 mhRender();
 mhToast('🗺 '+MH_WORLDS[wi].emoji+' '+MH_WORLDS[wi].name+' — '+mhWorldRarityHint(wi));
}

function mhSetTab(tab){
 if(!mhState)return;
 mhState.tab=tab;
 mhState.page=0;
 mhRender();
 mhMorphHuntBlurPageFocus();
}
function mhTabNoFocusRing(btn,onPick){
 btn.addEventListener('mousedown',e=>{ e.preventDefault(); });
 btn.addEventListener('click',()=>{
  onPick();
  try{ btn.blur(); }catch(_){}
  mhMorphHuntBlurPageFocus();
 });
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
function mhRarityLabel(m){
 if(!m) return 'Common';
 if(m.voidKing) return 'Void Fallen King · '+MH_VOID_KING_DEPTH+' Depth · 5D';
 if(m.rarity==='voidfallen') return m.voidMale?'Male Void Fallen':'Void Fallen';
 if(m.exclusive&&m.rarity!=='exotic') return 'Exclusive';
 return (MH_RARITY[m.rarity]||MH_RARITY.common).label;
}
function mhWalkLegAnim(walkPhase,running){
 const p=walkPhase||0;
 if(Math.abs(p)<0.02) return {bob:0,ly:0,ry:0,lx:0,rx:0,ax:0};
 const mul=running?1.45:1;
 const s=Math.sin(p*mul);
 const c=Math.cos(p*mul);
 return {
  bob:Math.abs(s)*4.5*mul,
  ly:-Math.max(0,s)*11,
  ry:-Math.max(0,-s)*11,
  lx:c*3.5,
  rx:-c*3.5,
  ax:s*6
 };
}
function mhAnimOffset(m,t,walkPhase,running){
 const a=m?.anim||'bounce';
 const seed=(mhHashStr(m?.id||'x')%100)/17;
 const p=t*4+seed;
 let dx=0,dy=0,rot=0,sc=1;
 if(a==='bounce') dy=Math.sin(p)*5;
 else if(a==='sway'){ dx=Math.sin(p)*4; rot=Math.sin(p)*0.08; }
 else if(a==='hop') dy=Math.abs(Math.sin(p*1.2))*7;
 else if(a==='pulse') sc=1+Math.sin(p*2)*0.06;
 else if(a==='float') dy=Math.sin(p*0.8)*6;
 else if(a==='wiggle') rot=Math.sin(p*2)*0.12;
 else if(a==='spin') rot=(t*2+seed)*0.5;
 else if(a==='glitch'){ dx=(Math.random()<0.04)?(Math.random()*6-3):0; dy=Math.sin(p)*3; }
 if(walkPhase!=null){
  const wa=mhWalkLegAnim(walkPhase,running);
  dy-=wa.bob;
  if(a==='bounce'||a==='hop') dy+=Math.sin(walkPhase*(running?0.9:0.55))*2;
 }
 return {dx,dy,rot,sc};
}
function mhDrawForbiddenSymbol(ctx,cx,cy,s,kind){
 ctx.save();
 ctx.translate(cx,cy);
 ctx.strokeStyle='#ff2828';
 ctx.lineWidth=1.6;
 ctx.lineCap='round';
 if(kind===0){
  ctx.beginPath(); ctx.arc(0,0,s,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-s*.65,-s*.65); ctx.lineTo(s*.65,s*.65); ctx.moveTo(s*.65,-s*.65); ctx.lineTo(-s*.65,s*.65); ctx.stroke();
 }else if(kind===1){
  ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(s*.85,s*.7); ctx.lineTo(-s*.85,s*.7); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-s*.35); ctx.lineTo(0,s*.45); ctx.stroke();
 }else if(kind===2){
  ctx.strokeRect(-s*.7,-s*.7,s*1.4,s*1.4);
  ctx.beginPath(); ctx.moveTo(-s*.45,0); ctx.lineTo(s*.45,0); ctx.moveTo(0,-s*.45); ctx.lineTo(0,s*.45); ctx.stroke();
 }else{
  ctx.beginPath(); ctx.arc(0,0,s*.75,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-s*.5,0); ctx.quadraticCurveTo(0,-s*.9,s*.5,0); ctx.quadraticCurveTo(0,s*.9,-s*.5,0); ctx.stroke();
 }
 ctx.restore();
}
function mhPaintForbiddenStone(ctx,sx,sy,t,i,alpha){
 ctx.save();
 ctx.globalAlpha=alpha==null?1:alpha;
 ctx.fillStyle='#080808';
 ctx.fillRect(sx-8,sy-10,16,20);
 ctx.strokeStyle='#a01010';
 ctx.lineWidth=1.5;
 ctx.strokeRect(sx-8.5,sy-10.5,17,21);
 ctx.shadowColor='#ff0000';
 ctx.shadowBlur=5+Math.sin(t*4+i)*4;
 mhDrawForbiddenSymbol(ctx,sx,sy-1,5,i%4);
 ctx.shadowBlur=0;
 ctx.restore();
}
function mhPaintKingRedBlackStormAura(ctx,x,y,t,alpha,silhouette){
 const pulse=1+Math.sin(t*3.2)*0.18;
 const rad=46*pulse;
 const a=silhouette?0.28:(alpha==null?1:alpha);
 const cy=y-18;
 ctx.save();
 ctx.globalAlpha=a;
 const g=ctx.createRadialGradient(x,cy,4,x,cy,rad+36);
 g.addColorStop(0,'rgba(255,40,40,.55)');
 g.addColorStop(0.35,'rgba(120,0,0,.35)');
 g.addColorStop(0.65,'rgba(20,0,0,.55)');
 g.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=g;
 ctx.beginPath(); ctx.arc(x,cy,rad+36,0,Math.PI*2); ctx.fill();
 for(let ring=0;ring<3;ring++){
  const rr=rad*(0.55+ring*0.22);
  ctx.strokeStyle=ring===0?'rgba(255,30,30,.45)':ring===1?'rgba(0,0,0,.65)':'rgba(180,0,0,.3)';
  ctx.lineWidth=ring===1?4:2;
  ctx.setLineDash(ring===2?[5,7]:[]);
  ctx.beginPath(); ctx.arc(x,cy,rr+Math.sin(t*4+ring)*3,0,Math.PI*2); ctx.stroke();
 }
 ctx.setLineDash([]);
 for(let i=0;i<10;i++){
  const ang=t*1.8+i*Math.PI*2/10;
  const dist=rad*(0.35+0.55*((i%3)/2));
  const sx=x+Math.cos(ang)*dist, sy=cy+Math.sin(ang)*dist*0.55;
  ctx.strokeStyle=i%2?'rgba(255,50,50,.75)':'rgba(0,0,0,.85)';
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(sx,sy-10); ctx.lineTo(sx+(Math.sin(t*6+i)*8),sy+8); ctx.stroke();
 }
 for(let i=0;i<6;i++){
  const ang=t*0.65+i*Math.PI*2/6;
  const sx=x+Math.cos(ang)*rad*0.92, sy=cy+Math.sin(ang)*rad*0.38;
  if(i%2===0) mhPaintForbiddenStone(ctx,sx,sy,t,i,a);
  else{
   ctx.fillStyle='rgba(0,0,0,.75)';
   ctx.beginPath(); ctx.arc(sx,sy,5+Math.sin(t*5+i),0,Math.PI*2); ctx.fill();
   ctx.strokeStyle='rgba(255,40,40,.6)'; ctx.stroke();
  }
 }
 ctx.restore();
}
const mhPaintKingStoneAura=mhPaintKingRedBlackStormAura;
function mhPaintVoidFallenStormAura(ctx,x,y,t,alpha,silhouette,m){
 if(!m||m.voidKing) return;
 const a=silhouette?0.28:(alpha==null?1:alpha);
 const cy=y-18;
 const pulse=1+Math.sin(t*3.2+(mhHashStr(m.id)%5))*0.18;
 const rad=(52+(m.voidMale?10:0))*pulse;
 const accent=m.voidAccent||'#ff3030';
 ctx.save();
 ctx.globalAlpha=a;
 const g=ctx.createRadialGradient(x,cy,4,x,cy,rad+42);
 g.addColorStop(0,'rgba(255,40,40,.45)');
 g.addColorStop(0.35,'rgba(80,0,0,.4)');
 g.addColorStop(0.62,'rgba(0,0,0,.55)');
 g.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=g;
 ctx.beginPath(); ctx.arc(x,cy,rad+42,0,Math.PI*2); ctx.fill();
 ctx.strokeStyle='rgba(255,60,60,.75)'; ctx.lineWidth=3;
 ctx.beginPath(); ctx.arc(x,cy,rad,0,Math.PI*2); ctx.stroke();
 ctx.strokeStyle='rgba(0,0,0,.92)'; ctx.lineWidth=5;
 ctx.beginPath(); ctx.arc(x,cy,rad*0.58,0,Math.PI*2); ctx.stroke();
 for(let i=0;i<8;i++){
  const ang=t*1.8+i*Math.PI*2/8;
  ctx.strokeStyle=i%2?'rgba(255,50,50,.8)':'rgba(0,0,0,.85)';
  ctx.lineWidth=i%2?3:4;
  ctx.beginPath();
  ctx.moveTo(x+Math.cos(ang)*rad*0.15,cy+Math.sin(ang)*rad*0.12);
  ctx.lineTo(x+Math.cos(ang)*rad*1.05,cy+Math.sin(ang)*rad*0.45);
  ctx.stroke();
 }
 ctx.fillStyle=mhHex(accent,0.35);
 ctx.font='bold 11px serif';
 ctx.textAlign='center';
 ctx.fillText(MH_ANCIENT_GLYPHS[(mhHashStr(m.id)%5)]||'⌬',x,cy-rad*0.55);
 ctx.restore();
}
function mhEnsureVoidCombat(m){
 if(!m) return null;
 if(!m.voidAttack||!m.voidPower) mhAssignVoidCombat(m);
 return m;
}
function mhEnsurePlagueCombat(m){
 if(!m||!m.plagueDoctor) return null;
 if(!m.voidAttack) m.voidAttack={id:'foul_cure',name:'Foul Cure',color:'#80ffb0',kind:'orbs',speed:5,range:70};
 if(!m.voidPower) m.voidPower={id:'death_sigil',name:'Death Sigil',color:'#303038',kind:'nova',speed:4,range:95};
 return m;
}
function mhVoidCombatMorph(save){
 const wear=mhMorph(save?.wearing);
 if(wear?.plagueDoctor) return mhEnsurePlagueCombat(wear);
 if(wear&&(wear.rarity==='voidfallen'||wear.voidFallen)) return mhEnsureVoidCombat(wear);
 return null;
}
function mhRefreshVoidCombatHud(save){
 const vm=mhVoidCombatMorph(save);
 const atkN=vm?.voidAttack?.name||'—';
 const powN=vm?.voidPower?.name||'—';
 const bar=document.getElementById('mh-void-combat-readout');
 if(bar){
  bar.innerHTML=vm
   ?`<b>⚔ 1</b> ${atkN} · <b>✦ 2</b> ${powN} · <b>🌌 3</b> ${MH_VOID_STORM_NAME}${vm.voidKing?' · <b>🎬 4</b> '+MH_KING_CUTSCENE_TITLE:''} — <span style="color:#ff9090">FIGHT</span> · <span style="color:#80ffb0">instant</span>${vm.voidKing?' · 👑 boss dmg':''}`
   :'⚔ <b>1</b> punch · <b>2</b> blast · <b>3</b> slam — fight map noobies! (Void morph = stronger)';
 }
 const btnA=document.getElementById('mh-void-atk');
 const btnP=document.getElementById('mh-void-pow');
 if(btnA){
  btnA.textContent=vm?('⚔ 1 '+atkN):'⚔ 1 Attack';
  btnA.disabled=false;
  btnA.style.opacity='1';
 }
 if(btnP){
  btnP.textContent=vm?('✦ 2 '+powN):'✦ 2 Power';
  btnP.disabled=false;
  btnP.style.opacity='1';
 }
 const btn4=document.getElementById('mh-void-cutscene');
 if(btn4){
  if(vm?.voidKing){
   btn4.hidden=false;
   btn4.textContent='🎬 4 Cutscene';
   btn4.disabled=false;
   btn4.style.opacity='1';
  }else{
   btn4.hidden=true;
  }
 }
}
function mhDrawVoidAbyssMist(ctx,map,t){
 for(let i=0;i<10;i++){
  const tx=2+mhHashStr('vfm'+i)%(map.w-4);
  const ty=2+mhHashStr('vfmy'+i)%(map.h-4);
  const x=tx*MH_TILE+MH_TILE/2, y=ty*MH_TILE+MH_TILE/2;
  const r=24+Math.sin(t*0.8+i)*6;
  ctx.fillStyle='rgba(120,20,80,.07)';
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.06)';
  ctx.beginPath(); ctx.arc(x,y,r*0.55,0,Math.PI*2); ctx.fill();
 }
}
function mhVoidShake(st,ms,mag){
 st.voidShakeUntil=performance.now()+(ms||90);
 st.voidShakeMag=mag||5;
}
function mhSpawnVoidFx(st,fx){
 if(!st.voidFx) st.voidFx=[];
 st.voidFx.push({...fx,life:fx.life||0.55,born:performance.now(),age:0});
}
function mhSpawnAttackVfx(st,m,atk,dir,pos,rage){
 const col=atk.color||'#9040ff';
 const ang=Math.atan2(dir.dy,dir.dx);
 const range=(atk.range||90)*(rage?1.25:1);
 const px=pos.px, py=pos.py-12;
 const kind=atk.kind||'arc';
 if(kind==='beam'){
  mhSpawnVoidFx(st,{kind:'beam',x:px,y:py,vx:dir.dx*16,vy:dir.dy*16,color:col,life:0.5,len:range});
  mhSpawnVoidFx(st,{kind:'beam_core',x:px,y:py,vx:dir.dx*20,vy:dir.dy*20,color:'#e8d0ff',life:0.38,len:range});
  for(let i=1;i<=6;i++){
   const d=i*(range/7);
   mhSpawnVoidFx(st,{kind:'spark',x:px+dir.dx*d,y:py+dir.dy*d,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,color:col,life:0.35});
  }
  mhSpawnVoidFx(st,{kind:'shock',x:px+dir.dx*range*0.85,y:py+dir.dy*range*0.85,vx:0,vy:0,color:col,r:8,dr:140,life:0.45});
  mhVoidShake(st,100,6);
  return;
 }
 if(kind==='orbs'){
  for(let i=-3;i<=3;i++){
   const ca=ang+i*0.28;
   mhSpawnVoidFx(st,{kind:'orb',x:px,y:py,vx:Math.cos(ca)*10,vy:Math.sin(ca)*10,color:col,life:0.6});
  }
  mhSpawnVoidFx(st,{kind:'ring',x:px,y:py,vx:0,vy:0,color:col,r:12,dr:100,life:0.4});
  mhVoidShake(st,70,4);
  return;
 }
 if(kind==='nova'){
  mhSpawnVoidFx(st,{kind:'nova',x:px+dir.dx*40,y:py+dir.dy*40,vx:0,vy:0,color:col,r:14,dr:range,life:0.55});
  mhSpawnVoidFx(st,{kind:'shock',x:px+dir.dx*40,y:py+dir.dy*40,vx:0,vy:0,color:'#fff',r:6,dr:110,life:0.35});
  mhVoidShake(st,110,7);
  return;
 }
 mhSpawnVoidFx(st,{kind:'arc',x:px,y:py,vx:dir.dx*8,vy:dir.dy*8,color:col,a0:ang-1.1,a1:ang+1.1,r:range*0.55,dr:80,life:0.5});
 mhSpawnVoidFx(st,{kind:'arc',x:px,y:py,vx:0,vy:0,color:'#fff',a0:ang-0.65,a1:ang+0.65,r:range*0.35,dr:60,life:0.35});
 for(let i=0;i<5;i++){
  const ca=ang+(i-2)*0.22;
  mhSpawnVoidFx(st,{kind:'spark',x:px,y:py,vx:Math.cos(ca)*12,vy:Math.sin(ca)*12,color:col,life:0.45});
 }
 mhSpawnVoidFx(st,{kind:'ring',x:px,y:py,vx:0,vy:0,color:col,r:10,dr:90,life:0.38});
 mhVoidShake(st,85,5);
 if(m.voidKing){
  mhSpawnVoidFx(st,{kind:'storm',x:px,y:py-8,vx:0,vy:0,color:'#ff3030',r:22,dr:110,life:0.5,spin:0});
  mhSpawnVoidFx(st,{kind:'storm',x:px,y:py-8,vx:0,vy:0,color:'#0a0a0a',r:14,dr:95,life:0.55,spin:0.5});
  mhVoidShake(st,130,8);
 }
}
function mhSpawnPowerVfx(st,m,pow,dir,pos,map){
 const col=pow.color||m.voidAccent||'#9040ff';
 const px=pos.px, py=pos.py-10;
 if(pow.kind==='dash'){
  mhSpawnVoidFx(st,{kind:'trail',x:px-dir.dx*50,y:py-dir.dy*50,vx:0,vy:0,color:col,life:0.45});
  mhSpawnVoidFx(st,{kind:'nova',x:px,y:py,vx:0,vy:0,color:col,r:16,dr:70,life:0.45});
  mhSpawnVoidFx(st,{kind:'spark',x:px,y:py,vx:dir.dx*6,vy:dir.dy*6,color:'#fff',life:0.35});
  mhVoidShake(st,60,3);
  return;
 }
 if(pow.kind==='shield'){
  mhSpawnVoidFx(st,{kind:'hex',x:px,y:py,vx:0,vy:0,color:col,r:38,life:0.7});
  for(let i=0;i<8;i++) mhSpawnVoidFx(st,{kind:'spark',x:px,y:py,vx:Math.cos(i)*5,vy:Math.sin(i)*5,color:'#a0c8ff',life:0.5});
  return;
 }
 if(pow.kind==='buff'){
  mhSpawnVoidFx(st,{kind:'nova',x:px,y:py,vx:0,vy:0,color:'#ff6080',r:10,dr:85,life:0.55});
  mhSpawnVoidFx(st,{kind:'ring',x:px,y:py,vx:0,vy:0,color:'#ff2040',r:18,dr:120,life:0.5});
  mhVoidShake(st,90,5);
  return;
 }
 if(pow.kind==='echo'){
  for(let i=0;i<(pow.count||3);i++){
   mhSpawnVoidFx(st,{kind:'orb',x:px+(i-1)*20,y:py-16-i*6,vx:dir.dx*6,vy:dir.dy*6-2,color:col,life:0.65});
   mhSpawnVoidFx(st,{kind:'spark',x:px+(i-1)*20,y:py-16-i*6,vx:-dir.dy*4,vy:dir.dx*4,color:'#fff',life:0.35});
  }
  return;
 }
 if(pow.kind==='pull'||pow.id==='gravity_well'){
  mhSpawnVoidFx(st,{kind:'storm',x:px,y:py,vx:0,vy:0,color:col,r:20,dr:(pow.range||120),life:0.75,spin:0});
  mhSpawnVoidFx(st,{kind:'ring',x:px,y:py,vx:0,vy:0,color:'#000',r:8,dr:-90,life:0.65,drNeg:true});
  mhVoidShake(st,120,6);
  return;
 }
 if(pow.kind==='heal'){
  mhSpawnVoidFx(st,{kind:'nova',x:px,y:py,vx:0,vy:0,color:'#80ffb0',r:12,dr:65,life:0.55});
  for(let i=0;i<6;i++) mhSpawnVoidFx(st,{kind:'spark',x:px,y:py-20,vx:(Math.random()-0.5)*4,vy:-2-Math.random()*4,color:'#80ffb0',life:0.6});
  return;
 }
 if(pow.kind==='storm'||pow.id==='forbidden_storm'){
  mhSpawnVoidUniverseStorm(st,m,dir,pos,pow.range||160);
  return;
 }
 const kind='nova';
 mhSpawnVoidFx(st,{kind,x:px,y:py,vx:0,vy:0,color:col,r:18,dr:pow.range||110,life:0.75});
 mhSpawnVoidFx(st,{kind:'shock',x:px,y:py,vx:0,vy:0,color:'#fff',r:10,dr:130,life:0.45});
 mhSpawnVoidFx(st,{kind:'ring',x:px,y:py,vx:0,vy:0,color:col,r:14,dr:140,life:0.55});
 mhVoidShake(st,100,6);
}
const MH_FORBIDDEN_SPELLS=['Null Sigil','Abyss Hex','Rift Curse','Shadow Bind','Depth Wail','King\'s Edict','Stone Eclipse','Void Lament'];
function mhGibberLinkCtx(){
 try{
  if(!window.__mhGibberCtx) window.__mhGibberCtx=new (window.AudioContext||window.webkitAudioContext)();
  const c=window.__mhGibberCtx;
  if(c.state==='suspended') c.resume();
  return c;
 }catch(_){ return null; }
}
function mhGibberLinkBurst(st,payload){
 const msg=String(payload||'GIBBERLINK').slice(0,32);
 st.voidGibberUntil=performance.now()+2200;
 st.voidGibberText=msg;
 const C=mhGibberLinkCtx();
 if(!C) return;
 let t=C.currentTime+0.01;
 for(let i=0;i<msg.length;i++){
  const c=msg.charCodeAt(i);
  const freq=520+(c%48)*22;
  const o=C.createOscillator();
  const g=C.createGain();
  o.type=i%3?'square':'sawtooth';
  o.frequency.setValueAtTime(freq,t);
  o.frequency.exponentialRampToValueAtTime(freq*1.08,t+0.04);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(0.07,t+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001,t+0.05);
  o.connect(g); g.connect(C.destination);
  o.start(t); o.stop(t+0.055);
  t+=0.058;
 }
}
function mhPaintOneAncientShield(ctx,x,y,glyph,king,wobbleT){
 const w=26,h=34;
 ctx.save();
 ctx.translate(x,y);
 ctx.rotate(Math.sin((wobbleT||0)*3)*0.12);
 ctx.fillStyle='rgba(0,0,0,.9)';
 ctx.strokeStyle=king?'#ff5050':'#c898ff';
 ctx.lineWidth=2.5;
 ctx.beginPath();
 ctx.moveTo(0,-h*0.52);
 ctx.quadraticCurveTo(w*0.58,-h*0.3,w*0.52,h*0.32);
 ctx.quadraticCurveTo(0,h*0.52,-w*0.52,h*0.32);
 ctx.quadraticCurveTo(-w*0.58,-h*0.3,0,-h*0.52);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle=king?'#0a0a0a':'#401860';
 ctx.lineWidth=3;
 ctx.stroke();
 ctx.strokeStyle=king?'#ff8080':'#e8d0ff';
 ctx.lineWidth=1.5;
 ctx.stroke();
 ctx.fillStyle=king?'#ffe0e0':'#ffe8a0';
 ctx.font='bold 20px serif';
 ctx.textAlign='center'; ctx.textBaseline='middle';
 ctx.shadowColor=king?'#ff2020':'#9040ff';
 ctx.shadowBlur=8;
 ctx.fillText(glyph||'⌬',0,1);
 ctx.shadowBlur=0;
 ctx.strokeStyle='rgba(255,60,60,.55)'; ctx.lineWidth=1;
 ctx.beginPath(); ctx.moveTo(-w*0.35,-h*0.15); ctx.lineTo(w*0.35,-h*0.15); ctx.stroke();
 ctx.beginPath(); ctx.moveTo(0,-h*0.15); ctx.lineTo(0,h*0.28); ctx.stroke();
 ctx.restore();
}
function mhDrawPassiveAncientShieldsOnCharacter(ctx,cx,cy,t,m,alpha){
 if(!m||!(m.rarity==='voidfallen'||m.voidFallen)) return;
 const king=!!m.voidKing;
 const a=(alpha==null?1:alpha)*0.92;
 const orbitRad=king?52:44;
 const oy=cy-(king?18:14);
 ctx.save();
 ctx.globalAlpha=a*0.38;
 ctx.strokeStyle='rgba(255,80,80,.45)'; ctx.lineWidth=2;
 ctx.setLineDash([6,8]);
 ctx.beginPath(); ctx.ellipse(cx,oy,orbitRad,orbitRad*0.62,0,0,Math.PI*2); ctx.stroke();
 ctx.setLineDash([]);
 ctx.globalAlpha=a;
 for(let i=0;i<5;i++){
  const ang=t*0.85+i*Math.PI*2/5;
  const sx=cx+Math.cos(ang)*orbitRad;
  const sy=oy+Math.sin(ang)*orbitRad*0.62;
  mhPaintOneAncientShield(ctx,sx,sy,MH_ANCIENT_GLYPHS[i],king,t+i);
 }
 ctx.restore();
}
function mhWrapPlayerRedBlackStorm(st,m,pos,duration){
 const dur=duration||(m?.voidKing?7:5.8);
 st.playerStormUntil=performance.now()+dur*1000;
 st.playerStormKing=!!m?.voidKing;
 const px=pos.px, py=pos.py-10;
 const holeR=m?.voidKing?78:62;
 const tag={followPlayer:true,foy:-10};
 mhSpawnVoidFx(st,{kind:'blackhole',x:px,y:py,vx:0,vy:0,color:'#ff2020',r:holeR,life:dur,spin:0,dr:0,...tag});
 mhSpawnVoidFx(st,{kind:'blackhole_core',x:px,y:py,vx:0,vy:0,color:'#050505',r:holeR*0.45,life:dur,spin:0.7,...tag});
 mhSpawnVoidFx(st,{kind:'storm',x:px,y:py,vx:0,vy:0,color:'#ff2020',r:26,dr:holeR+36,life:dur*0.95,spin:0,...tag});
 mhSpawnVoidFx(st,{kind:'storm',x:px,y:py,vx:0,vy:0,color:'#0a0a0a',r:16,dr:holeR+24,life:dur,spin:0.4,...tag});
 for(let i=0;i<22;i++){
  const ang=i*Math.PI*2/22;
  const rad=42+(i%4)*14;
  mhSpawnVoidFx(st,{kind:'storm_orbit',x:px,y:py,orbitAng:ang,orbitRad:rad,orbitSpeed:1.1+(i%6)*0.12,color:i%2?'#ff3030':'#0c0c0c',life:dur,...tag});
 }
 for(let i=0;i<14;i++){
  mhSpawnVoidFx(st,{kind:'spark',x:px,y:py,vx:Math.cos(i)*8,vy:Math.sin(i)*6,color:i%2?'#ff5050':'#1a1a1a',life:0.55+Math.random()*0.35,...tag,ox:Math.cos(i*0.9)*30,oy:Math.sin(i*0.9)*22});
 }
}
function mhDrawRedBlackPlayerStorm(ctx,st,pos,t){
 if(!st.playerStormUntil||performance.now()>st.playerStormUntil) return;
 const king=!!st.playerStormKing;
 const cx=pos.px, cy=pos.py-(king?14:10);
 const pulse=0.85+Math.sin(t*5.2)*0.15;
 const R=(king?92:76)*pulse;
 const a=Math.min(1,(st.playerStormUntil-performance.now())/900);
 ctx.save();
 ctx.globalAlpha=0.55*a;
 const fog=ctx.createRadialGradient(cx,cy,R*0.1,cx,cy,R*1.15);
 fog.addColorStop(0,'rgba(0,0,0,.55)');
 fog.addColorStop(0.45,'rgba(120,10,10,.35)');
 fog.addColorStop(0.72,'rgba(255,40,40,.18)');
 fog.addColorStop(1,'rgba(255,80,80,0)');
 ctx.fillStyle=fog;
 ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fill();
 ctx.globalAlpha=0.9*a;
 for(let i=0;i<10;i++){
  const ang=t*2.4+i*Math.PI*2/10;
  const r0=R*0.35,r1=R*(0.82+Math.sin(t*7+i)*0.08);
  ctx.strokeStyle=i%2?'rgba(255,50,50,.75)':'rgba(0,0,0,.85)';
  ctx.lineWidth=i%2?4:6;
  ctx.beginPath();
  ctx.moveTo(cx+Math.cos(ang)*r0,cy+Math.sin(ang)*r0*0.7);
  ctx.lineTo(cx+Math.cos(ang+0.35)*r1,cy+Math.sin(ang+0.35)*r1*0.65);
  ctx.stroke();
 }
 ctx.strokeStyle='rgba(255,80,80,.65)'; ctx.lineWidth=3;
 for(let i=0;i<6;i++){
  const ang=t*3.1+i*Math.PI/3;
  ctx.beginPath();
  ctx.ellipse(cx,cy,R*0.88,R*0.38,ang,0,Math.PI*2);
  ctx.stroke();
 }
 ctx.strokeStyle='rgba(0,0,0,.92)'; ctx.lineWidth=5;
 ctx.beginPath(); ctx.arc(cx,cy,R*0.2,0,Math.PI*2); ctx.stroke();
 ctx.restore();
}
function mhSpawnVoidUniverseStorm(st,m,dir,pos,range){
 const stormLife=m.voidKing?6.5:5.5;
 const cx=pos.px, cy=pos.py-10;
 mhWrapPlayerRedBlackStorm(st,m,pos,stormLife);
 mhSpawnVoidFx(st,{kind:'universe_rift',x:cx,y:cy-200,vx:0,vy:0,color:'#ff3030',r:48,life:stormLife,spin:0,tx:cx,ty:cy,followPlayer:true,foy:-10});
 for(let i=0;i<24;i++){
  const spell=MH_FORBIDDEN_SPELLS[i%MH_FORBIDDEN_SPELLS.length];
  const delay=i*0.06;
  const sx=cx+(Math.random()-0.5)*40, sy=cy-220-Math.random()*45;
  mhSpawnVoidFx(st,{kind:'forbidden_spell',x:sx,y:sy,vx:0,vy:0,color:i%2?'#ff4040':'#1a1a1a',life:stormLife-0.1-delay,spell,tx:cx,ty:cy,delay,phase:i*0.7,followPlayer:true,foy:-10,spellOx:sx-cx,spellOy:sy-cy});
 }
 mhGibberLinkBurst(st,m.voidKing?'GIBBERLINK:KING:RIFT':'GIBBERLINK:VOID:STORM');
 for(let i=0;i<8;i++){
  mhSpawnVoidFx(st,{kind:'gibberlink',x:cx+(i-4)*14,y:cy-210,vx:0,vy:0,color:'#ff6060',life:stormLife*0.7,chip:i%5,followPlayer:true,foy:-10,gox:(i-4)*14,goy:-200});
 }
 st.voidGibberUntil=performance.now()+stormLife*1000;
 mhVoidShake(st,m.voidKing?220:180,m.voidKing?12:9);
}
function mhUpdateVoidFx(st,dt){
 if(!st.voidFx) return;
 const p=st.walkPos?.[st.world];
 st.voidFx=st.voidFx.filter(f=>{
  f.life-=dt;
  f.age=(f.age||0)+dt;
  if(f.followPlayer&&p){
   const foy=f.foy==null?-10:f.foy;
   if(f.kind==='storm_orbit'||f.kind==='ancient_shield'){
    f.orbitAng=(f.orbitAng||0)+dt*(f.orbitSpeed||1.2);
    f.x=p.px+Math.cos(f.orbitAng)*(f.orbitRad||48);
    f.y=p.py+foy+Math.sin(f.orbitAng)*(f.orbitRad||48)*0.62;
   }else if(f.kind==='forbidden_spell'&&f.spellOx!=null){
    f.x=p.px+f.spellOx;
    f.y=p.py+foy+f.spellOy;
    f.tx=p.px; f.ty=p.py+foy;
   }else if(f.gox!=null){
    f.x=p.px+f.gox; f.y=p.py+foy+f.goy;
   }else{
    f.x=p.px+(f.ox||0);
    f.y=p.py+foy+(f.oy||0);
   }
  }
  f.x+=(f.vx||0)*dt*60; f.y+=(f.vy||0)*dt*60;
  if(f.kind==='forbidden_spell'){
   f.delay=(f.delay||0)-dt;
   if(f.delay<=0){
    const dx=(f.tx||f.x)-(f.x), dy=(f.ty||f.y)-(f.y);
    const dist=Math.hypot(dx,dy)||1;
    const pull=8+Math.sin((f.phase||0)+f.age*9)*2;
    f.vx=(dx/dist)*pull; f.vy=(dy/dist)*pull;
    if(dist<24){
     if(Math.random()<0.35){
      mhSpawnVoidFx(st,{kind:'spark',x:f.x,y:f.y,vx:(Math.random()-0.5)*8,vy:(Math.random()-0.5)*8,color:'#ff8080',life:0.35});
     }
     if(Math.random()<0.12) mhGibberLinkBurst(st,f.spell||'SPELL');
    }
   }
  }
  if(f.kind==='blackhole'||f.kind==='blackhole_core'||f.kind==='universe_rift'){
   f.spin=(f.spin||0)+dt*(f.kind==='blackhole_core'?2.4:1.1);
  }
  if(f.kind==='nova'||f.kind==='storm'||f.kind==='shock'||f.kind==='ring'){
   const dr=f.drNeg?-(f.dr||80): (f.dr||80);
   f.r=(f.r||20)+dr*dt;
  }
  if(f.kind==='orb') f.vy=(f.vy||0)+dt*12;
  return f.life>0;
 });
 if(st.voidShieldUntil&&performance.now()>st.voidShieldUntil) st.voidShieldUntil=0;
 if(st.voidRageUntil&&performance.now()>st.voidRageUntil) st.voidRageUntil=0;
}
function mhDrawVoidFx(ctx,st){
 (st.voidFx||[]).forEach(f=>{
  const a=Math.max(0,Math.min(1,f.life*2));
  ctx.save(); ctx.globalAlpha=a;
  const col=f.color||'#9040ff';
  if(f.kind==='beam'||f.kind==='beam_core'){
   const len=f.len||100;
   const ex=f.x+(f.vx||0)*(len/16), ey=f.y+(f.vy||0)*(len/16);
   ctx.strokeStyle=col; ctx.lineWidth=f.kind==='beam_core'?3:9;
   ctx.shadowColor=col; ctx.shadowBlur=f.kind==='beam_core'?18:8;
   ctx.lineCap='round';
   ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.lineTo(ex,ey); ctx.stroke();
   ctx.shadowBlur=0;
  }else if(f.kind==='arc'){
   ctx.strokeStyle=col; ctx.lineWidth=7; ctx.shadowColor=col; ctx.shadowBlur=10;
   ctx.beginPath(); ctx.arc(f.x,f.y,f.r||40,f.a0||0,f.a1||Math.PI); ctx.stroke();
   ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=2; ctx.shadowBlur=0;
   ctx.beginPath(); ctx.arc(f.x,f.y,(f.r||40)*0.82,f.a0||0,f.a1||Math.PI); ctx.stroke();
  }else if(f.kind==='orb'){
   ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=14;
   ctx.beginPath(); ctx.arc(f.x,f.y,7,0,Math.PI*2); ctx.fill();
   ctx.fillStyle='#fff'; ctx.shadowBlur=0;
   ctx.beginPath(); ctx.arc(f.x-2,f.y-2,2.5,0,Math.PI*2); ctx.fill();
  }else if(f.kind==='spark'){
   ctx.strokeStyle=col; ctx.lineWidth=3; ctx.shadowColor=col; ctx.shadowBlur=8;
   ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.lineTo(f.x-(f.vx||0)*3,f.y-(f.vy||0)*3); ctx.stroke();
  }else if(f.kind==='trail'){
   const g=ctx.createRadialGradient(f.x,f.y,4,f.x,f.y,55);
   g.addColorStop(0,mhHex(col,0.55)); g.addColorStop(1,mhHex(col,0));
   ctx.fillStyle=g; ctx.beginPath(); ctx.arc(f.x,f.y,55,0,Math.PI*2); ctx.fill();
  }else if(f.kind==='hex'){
   const r=f.r||36;
   ctx.strokeStyle=col; ctx.lineWidth=3;
   ctx.beginPath();
   for(let i=0;i<=6;i++){
    const ang=i*Math.PI/3;
    const hx=f.x+Math.cos(ang)*r, hy=f.y+Math.sin(ang)*r*0.85;
    if(i===0) ctx.moveTo(hx,hy); else ctx.lineTo(hx,hy);
   }
   ctx.closePath(); ctx.stroke();
   ctx.fillStyle=mhHex(col,0.12); ctx.fill();
  }else if(f.kind==='ring'){
   ctx.strokeStyle=col; ctx.lineWidth=4;
   ctx.beginPath(); ctx.arc(f.x,f.y,Math.max(4,f.r||20),0,Math.PI*2); ctx.stroke();
  }else if(f.kind==='shock'){
   const r=Math.max(8,f.r||20);
   ctx.strokeStyle=col; ctx.lineWidth=5; ctx.globalAlpha=a*0.85;
   ctx.beginPath(); ctx.arc(f.x,f.y,r,0,Math.PI*2); ctx.stroke();
   ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=2;
   ctx.beginPath(); ctx.arc(f.x,f.y,r*0.7,0,Math.PI*2); ctx.stroke();
  }else if(f.kind==='blackhole'){
   const r=f.r||50;
   const spin=f.spin||0;
   const g=ctx.createRadialGradient(f.x,f.y,r*0.15,f.x,f.y,r*1.05);
   g.addColorStop(0,'rgba(0,0,0,.95)');
   g.addColorStop(0.35,'rgba(20,0,0,.85)');
   g.addColorStop(0.62,'rgba(180,20,20,.55)');
   g.addColorStop(0.88,'rgba(255,40,40,.22)');
   g.addColorStop(1,'rgba(255,80,80,0)');
   ctx.fillStyle=g;
   ctx.beginPath(); ctx.arc(f.x,f.y,r,0,Math.PI*2); ctx.fill();
   ctx.strokeStyle='rgba(255,60,60,.75)'; ctx.lineWidth=5;
   for(let i=0;i<6;i++){
    const ang=spin+i*Math.PI/3;
    ctx.beginPath();
    ctx.ellipse(f.x,f.y,r*0.92,r*0.38,ang,0,Math.PI*2);
    ctx.stroke();
   }
   ctx.strokeStyle='rgba(0,0,0,.9)'; ctx.lineWidth=3;
   ctx.beginPath(); ctx.arc(f.x,f.y,r*0.22,0,Math.PI*2); ctx.stroke();
  }else if(f.kind==='blackhole_core'){
   const r=f.r||24;
   ctx.fillStyle='#000';
   ctx.shadowColor='#ff2020'; ctx.shadowBlur=22;
   ctx.beginPath(); ctx.arc(f.x,f.y,r,0,Math.PI*2); ctx.fill();
   ctx.shadowBlur=0;
   ctx.strokeStyle='rgba(255,40,40,.65)'; ctx.lineWidth=2;
   ctx.beginPath(); ctx.arc(f.x,f.y,r*1.15,0,Math.PI*2); ctx.stroke();
  }else if(f.kind==='universe_rift'){
   const r=f.r||40;
   const wobble=Math.sin((f.age||0)*7)*6;
   ctx.save();
   ctx.translate(f.x+wobble,f.y);
   const g=ctx.createLinearGradient(0,-r*2.2,0,r*0.4);
   g.addColorStop(0,'rgba(255,60,60,0)');
   g.addColorStop(0.35,'rgba(255,30,30,.35)');
   g.addColorStop(0.5,'rgba(0,0,0,.92)');
   g.addColorStop(0.65,'rgba(255,30,30,.35)');
   g.addColorStop(1,'rgba(255,60,60,0)');
   ctx.fillStyle=g;
   ctx.beginPath();
   ctx.moveTo(-r*0.35,-r*2);
   ctx.bezierCurveTo(-r*1.1,-r*0.6,-r*0.9,r*0.5,-r*0.25,r*0.35);
   ctx.lineTo(r*0.25,r*0.35);
   ctx.bezierCurveTo(r*0.9,r*0.5,r*1.1,-r*0.6,r*0.35,-r*2);
   ctx.closePath();
   ctx.fill();
   ctx.strokeStyle='rgba(255,120,120,.85)'; ctx.lineWidth=2;
   ctx.stroke();
   ctx.strokeStyle='rgba(0,0,0,.95)'; ctx.lineWidth=4;
   ctx.beginPath(); ctx.moveTo(0,-r*1.7); ctx.lineTo(0,r*0.2); ctx.stroke();
   ctx.fillStyle='rgba(255,200,200,.9)'; ctx.font='bold 10px system-ui,sans-serif';
   ctx.textAlign='center';
   ctx.fillText('GIBBERLINK',0,-r*1.52);
   ctx.font='8px system-ui,sans-serif';
   ctx.fillStyle='rgba(255,160,160,.85)';
   ctx.fillText('universe rift',0,-r*1.32);
   ctx.restore();
  }else if(f.kind==='gibberlink'){
   const w=10+(f.chip||0)*3;
   ctx.fillStyle='rgba(255,80,80,.9)';
   for(let b=0;b<5;b++){
    const h=6+Math.sin((f.age||0)*24+b*1.7)*w*0.35;
    ctx.fillRect(f.x-18+b*8,f.y-h/2,5,h);
   }
   ctx.fillStyle='#0a0a0a';
   ctx.fillRect(f.x-20,f.y+8,40,3);
  }else if(f.kind==='forbidden_spell'){
   if((f.delay||0)>0){ ctx.restore(); return; }
   const tailX=f.x-(f.vx||0)*4, tailY=f.y-(f.vy||0)*4;
   ctx.strokeStyle=col==='#1a1a1a'?'#ff5050':col;
   ctx.lineWidth=4; ctx.shadowColor='#ff3030'; ctx.shadowBlur=12;
   ctx.beginPath(); ctx.moveTo(tailX,tailY); ctx.lineTo(f.x,f.y); ctx.stroke();
   ctx.shadowBlur=0;
   ctx.fillStyle='rgba(0,0,0,.88)'; ctx.strokeStyle='#ff4040'; ctx.lineWidth=2;
   ctx.beginPath();
   for(let i=0;i<5;i++){
    const ang=(f.phase||0)+i*Math.PI*2/5;
    const rr=9+(i%2)*2;
    const sx=f.x+Math.cos(ang)*rr, sy=f.y+Math.sin(ang)*rr;
    if(i===0) ctx.moveTo(sx,sy); else ctx.lineTo(sx,sy);
   }
   ctx.closePath(); ctx.fill(); ctx.stroke();
   ctx.fillStyle='#ffe0e0'; ctx.font='9px system-ui,sans-serif'; ctx.textAlign='center';
   const sn=(f.spell||'Spell').split(' ')[0];
   ctx.fillText(sn,f.x,f.y+3);
  }else if(f.kind==='storm_orbit'){
   const rr=10+Math.sin((f.age||0)*11)*4;
   ctx.fillStyle=col==='#0c0c0c'?'rgba(0,0,0,.85)':'rgba(255,40,40,.75)';
   ctx.beginPath(); ctx.arc(f.x,f.y,rr,0,Math.PI*2); ctx.fill();
   ctx.strokeStyle='rgba(255,100,100,.8)'; ctx.lineWidth=2;
   ctx.beginPath(); ctx.moveTo(f.x-rr*1.4,f.y); ctx.lineTo(f.x+rr*1.4,f.y); ctx.stroke();
  }else if(f.kind==='ancient_shield'){
   const glyph=f.glyph||MH_ANCIENT_GLYPHS[(f.shieldIndex||0)%5];
   const king=col==='#ff3030';
   mhPaintOneAncientShield(ctx,f.x,f.y,glyph,king,f.age);
  }else if(f.kind==='storm'){
   const r=f.r||30;
   ctx.strokeStyle=col; ctx.lineWidth=4;
   ctx.beginPath(); ctx.arc(f.x,f.y,r,0,Math.PI*2); ctx.stroke();
   ctx.strokeStyle=col==='#0a0a0a'?'rgba(0,0,0,.85)':'rgba(255,255,255,.25)'; ctx.lineWidth=col==='#0a0a0a'?7:2;
   ctx.beginPath(); ctx.arc(f.x,f.y,r*0.72,0,Math.PI*2); ctx.stroke();
   ctx.strokeStyle='rgba(255,60,60,.55)'; ctx.lineWidth=2;
   for(let i=0;i<8;i++){
    const ang=(f.spin||0)+i*Math.PI/4;
    ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.lineTo(f.x+Math.cos(ang)*r,f.y+Math.sin(ang)*r*0.65); ctx.stroke();
   }
   if(f.spin!=null) f.spin+=0.12;
  }else if(f.kind==='nova'){
   const r=f.r||30;
   const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,r);
   g.addColorStop(0,mhHex(col,0.65)); g.addColorStop(0.45,mhHex(col,0.25)); g.addColorStop(1,mhHex(col,0));
   ctx.fillStyle=g; ctx.beginPath(); ctx.arc(f.x,f.y,r,0,Math.PI*2); ctx.fill();
   ctx.strokeStyle=col; ctx.lineWidth=3; ctx.stroke();
  }else{
   ctx.strokeStyle=col; ctx.lineWidth=3;
   ctx.beginPath(); ctx.arc(f.x,f.y,f.r||30,0,Math.PI*2); ctx.stroke();
  }
  ctx.restore();
 });
 if(st.voidShieldUntil&&performance.now()<st.voidShieldUntil){
  const p=st.walkPos?.[st.world];
  if(p){
   ctx.strokeStyle='rgba(120,160,255,.75)'; ctx.lineWidth=3;
   ctx.beginPath(); ctx.arc(p.px,p.py,42+Math.sin(performance.now()/200)*4,0,Math.PI*2); ctx.stroke();
  }
 }
}
function mhFacingDir(st){
 const k=st.walkKeys||{};
 let dx=0,dy=0;
 if(k.left) dx-=1; if(k.right) dx+=1; if(k.up) dy-=1; if(k.down) dy+=1;
 if(!dx&&!dy) return {dx:0,dy:1};
 const l=Math.hypot(dx,dy)||1;
 return {dx:dx/l,dy:dy/l};
}
function mhEnsureFight(st,save){
 if(!st) return;
 const wear=mhMorph(save?.wearing);
 const max=wear?.voidKing?220:(wear&&(wear.rarity==='voidfallen'||wear.voidFallen)?140:100);
 if(st.fightMaxHp==null||st.fightMaxHp!==max){ st.fightMaxHp=max; st.fightHp=max; }
 if(st.fightHp==null) st.fightHp=max;
 if(!st.enemyHp) st.enemyHp={};
 if(!st.enemyAggro) st.enemyAggro={};
 if(!st.enemyRespawnAt) st.enemyRespawnAt={};
 if(!st.enemyLastHit) st.enemyLastHit={};
 if(!st.enemyHitFlash) st.enemyHitFlash={};
}
function mhEnemyFightKey(wi,m){ return wi+'|'+m.id; }
function mhEnemyMaxHp(m){
 if(m.voidKing) return 520;
 if(m.rarity==='voidfallen') return 130;
 if(m.rarity==='exotic') return 90;
 if(m.exclusive) return 75;
 return 55;
}
function mhEnemyAlive(st,wi,m){
 const k=mhEnemyFightKey(wi,m);
 if(st.enemyRespawnAt[k]&&performance.now()<st.enemyRespawnAt[k]) return false;
 return mhGetEnemyHp(st,wi,m)>0;
}
function mhGetEnemyHp(st,wi,m){
 const k=mhEnemyFightKey(wi,m);
 if(st.enemyHp[k]==null) st.enemyHp[k]=mhEnemyMaxHp(m);
 return st.enemyHp[k];
}
function mhDamageEnemy(st,wi,m,dmg,save){
 const k=mhEnemyFightKey(wi,m);
 let hp=mhGetEnemyHp(st,wi,m)-Math.max(1,dmg);
 if(hp<=0){
  st.enemyHp[k]=0;
  st.enemyRespawnAt[k]=performance.now()+9000;
  const coins=m.voidKing?50:(m.rarity==='voidfallen'?15:8);
  save.coins+=coins;
  mhSaveSave(save);
  mhToast('💥 '+m.name+' defeated! +'+coins+' coins');
  mhSpawnVoidFx(st,{kind:'nova',x:0,y:0,vx:0,vy:0,color:'#ffe060',r:8,dr:70,life:0.45});
 }else{
  st.enemyHp[k]=hp;
  mhToast('💢 '+m.name+' -'+Math.round(dmg)+' HP');
 }
 st.enemyHitFlash[k]=performance.now()+220;
 st.enemyAggro[k]=performance.now()+6000;
}
function mhFightHitscan(st,save,wi,pos,dir,dmg,range,minDot){
 const morphs=mhWorldMorphs(wi);
 let hits=0;
 const dotMin=minDot==null?0.3:minDot;
 morphs.forEach(m=>{
  if(!mhEnemyAlive(st,wi,m)) return;
  const np=mhGetNpcPos(st,wi,m);
  const dx=np.px-pos.px, dy=np.py-pos.py;
  const dist=Math.hypot(dx,dy);
  if(dist>range||dist<8) return;
  const dot=(dx/dist)*dir.dx+(dy/dist)*dir.dy;
  if(dot<dotMin) return;
  mhDamageEnemy(st,wi,m,dmg,save);
  const np2=mhGetNpcPos(st,wi,m);
  mhSpawnVoidFx(st,{kind:'spark',x:np2.px,y:np2.py-20,vx:(Math.random()-0.5)*6,vy:-4-Math.random()*4,color:'#ff8080',life:0.4});
  hits++;
 });
 return hits;
}
function mhFightAoe(st,save,wi,cx,cy,radius,dmg){
 const morphs=mhWorldMorphs(wi);
 let hits=0;
 morphs.forEach(m=>{
  if(!mhEnemyAlive(st,wi,m)) return;
  const np=mhGetNpcPos(st,wi,m);
  if(Math.hypot(np.px-cx,np.py-cy)>radius) return;
  mhDamageEnemy(st,wi,m,dmg,save);
  hits++;
 });
 return hits;
}
function mhPlayerDamage(st,dmg,from){
 if(st.voidShieldUntil&&performance.now()<st.voidShieldUntil) return;
 mhEnsureFight(st,st.save);
 st.fightHp=Math.max(0,(st.fightHp||100)-Math.max(1,dmg));
 st.fightHitFlash=performance.now()+280;
 mhVoidShake(st,80,5);
 mhToast('🩸 '+(from||'Enemy')+' hits you! -'+Math.round(dmg));
 if(st.fightHp<=0){
  st.fightHp=st.fightMaxHp||100;
  mhToast('😵 Knocked out — HP restored! Keep fighting!');
 }
}
function mhUpdateFight(st,save,wi,pos){
 mhEnsureFight(st,save);
 const morphs=mhWorldMorphs(wi);
 const now=performance.now();
 morphs.forEach(m=>{
  const k=mhEnemyFightKey(wi,m);
  if(!st.enemyAggro[k]||st.enemyAggro[k]<now) return;
  if(!mhEnemyAlive(st,wi,m)) return;
  const np=mhGetNpcPos(st,wi,m);
  const d=Math.hypot(np.px-pos.px,np.py-pos.py);
  if(d<36||d>120) return;
  if(now-(st.enemyLastHit[k]||0)<850) return;
  st.enemyLastHit[k]=now;
  let dmg=6;
  if(m.voidKing) dmg=22;
  else if(m.rarity==='voidfallen') dmg=10;
  else if(m.rarity==='exotic') dmg=8;
  mhPlayerDamage(st,dmg,m.name);
 });
 Object.keys(st.enemyRespawnAt).forEach(k=>{
  if(st.enemyRespawnAt[k]&&now>=st.enemyRespawnAt[k]&&st.enemyHp[k]<=0){
   st.enemyHp[k]=null;
   delete st.enemyRespawnAt[k];
  }
 });
}
function mhDrawFightHpBar(ctx,x,y,w,hp,maxHp,color){
 const pct=Math.max(0,Math.min(1,hp/maxHp));
 ctx.fillStyle='rgba(0,0,0,.75)'; ctx.fillRect(x-w/2,y,w,7);
 ctx.fillStyle=color||'#ff5050'; ctx.fillRect(x-w/2,y,w*pct,7);
 ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1; ctx.strokeRect(x-w/2+0.5,y+0.5,w-1,6);
}
function mhBuildKingCutsceneCrowd(n){
 const slash=Math.round(n*0.54);
 const jump=Math.round(n*0.16);
 const stone=Math.round(n*0.06);
 const voidAlly=Math.round(n*0.30);
 const crowd=[];
 for(let i=0;i<n;i++){
  let role='survivor';
  if(i<slash) role='slash';
  else if(i<slash+jump) role='jump';
  else if(i<slash+jump+stone) role='stone';
  else if(i<slash+jump+stone+voidAlly) role='voidally';
  const ang=Math.PI*0.12+(i/(n-1||1))*Math.PI*0.76;
  const dist=120+(i%6)*22;
  crowd.push({
   role,
   bx:Math.cos(ang)*dist,
   by:-70-Math.sin(ang)*dist*0.45-(i%5)*10,
   slashT:0,
   jumpT:0,
   stoneT:0,
   cursed:false,
   voided:false,
   gone:false
  });
 }
 return crowd;
}
function mhStartKingAction4Cutscene(st,save,wi,pos){
 if(st.kingCutscene) return;
 const m=mhVoidCombatMorph(save);
 if(!m?.voidKing){
  mhToast('👑 Action 4 is a cutscene — morph into Void Fallen King first!');
  return;
 }
 st.kingCutscene={
  start:performance.now(),
  wi:wi??st.world,
  pos:{px:pos.px,py:pos.py},
  swordBlend:0,
  slashWave:0,
  crowd:mhBuildKingCutsceneCrowd(50),
  starT:0,
  holeR:0
 };
 mhToast('🎬 Action 4 · '+MH_KING_CUTSCENE_TITLE);
 try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
}
function mhFinishKingAction4Cutscene(st,save){
 if(!st.kingCutscene) return;
 const wi=st.kingCutscene.wi;
 const pos=mhWalkEnsurePos(st,wi);
 st.kingCutscene=null;
 mhFightAoe(st,save,wi,pos.px,pos.py-18,220,72);
 mhWrapPlayerRedBlackStorm(st,mhVoidCombatMorph(save),pos,4);
 mhVoidShake(st,280,11);
 mhGibberLinkBurst(st,'GIBBERLINK:KING:CUTSCENE:END');
 mhToast('☉ Star black hole fades — cursed noobies vanish into the void!');
}
function mhUpdateKingCutscene(st,dt){
 const cs=st.kingCutscene;
 if(!cs) return;
 const elapsed=(performance.now()-cs.start)/1000;
 cs.swordBlend=Math.min(1,elapsed/1.7);
 if(elapsed>=1.5) cs.slashWave=Math.min(1,(elapsed-1.5)/2.2);
 if(elapsed>=5) cs.jumpPhase=(elapsed-5)/3.2;
 if(elapsed>=8.2) cs.stonePhase=(elapsed-8.2)/2.8;
 if(elapsed>=11) cs.starT=Math.min(1,(elapsed-11)/4.2);
 if(elapsed>=11) cs.holeR=Math.min(220,(elapsed-11)*95);
 cs.crowd.forEach(e=>{
  if(e.role==='slash'&&cs.slashWave>0) e.slashT=Math.min(1,cs.slashWave*1.15);
  if(e.role==='jump'&&cs.jumpPhase>0){
   e.jumpT=Math.min(1,cs.jumpPhase*1.1);
   if(e.jumpT>0.72&&!e.cursed) e.cursed=true;
  }
  if(e.role==='stone'&&cs.stonePhase>0) e.stoneT=Math.min(1,cs.stonePhase*1.2);
  if(cs.starT>0.35) e.gone=cs.starT>0.55&&e.role!=='voidally';
  if(cs.starT>0.75) e.gone=true;
 });
 if(elapsed>=16.2) mhFinishKingAction4Cutscene(st,st.save);
}
function mhDrawCutsceneMiniNoob(ctx,x,y,voidAlly,split,diag){
 if(split>0&&split<1){
  const d=diag?0.65:-0.65;
  const off=split*14;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(d);
  ctx.fillStyle=voidAlly?'#502878':'#ffe060';
  ctx.fillRect(-7,-16+off,14,14);
  ctx.fillStyle=voidAlly?'#301848':'#6080ff';
  ctx.fillRect(-9,-2+off,18,18);
  ctx.fillStyle='#111';
  ctx.fillRect(-5,-12+off,10,10);
  ctx.restore();
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(d);
  ctx.fillStyle=voidAlly?'#502878':'#ffe060';
  ctx.fillRect(-7,2-off,14,14);
  ctx.fillStyle=voidAlly?'#301848':'#6080ff';
  ctx.fillRect(-9,14-off,18,18);
  ctx.strokeStyle='rgba(255,40,40,.9)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-12,-4); ctx.lineTo(12,8); ctx.stroke();
  ctx.restore();
  return;
 }
 if(split>=1){
  ctx.save(); ctx.globalAlpha=0.15; ctx.fillStyle='#000';
  ctx.beginPath(); ctx.ellipse(x,y+20,12,4,0,0,Math.PI*2); ctx.fill(); ctx.restore();
  return;
 }
 ctx.fillStyle=voidAlly?'#502878':'#ffe060';
 ctx.fillRect(x-7,y-16,14,14);
 ctx.fillStyle=voidAlly?'#301848':'#6080ff';
 ctx.fillRect(x-9,y-2,18,18);
 ctx.fillStyle='#111';
 ctx.fillRect(x-5,y-12,10,10);
}
function mhDrawKingAction4Cutscene(ctx,W,H,st,t){
 const cs=st.kingCutscene;
 if(!cs) return;
 const elapsed=(performance.now()-cs.start)/1000;
 const cx=W/2, cy=H*0.72;
 const bg=ctx.createRadialGradient(cx,cy,40,cx,cy,Math.max(W,H)*0.75);
 bg.addColorStop(0,'#1a0818');
 bg.addColorStop(0.5,'#080408');
 bg.addColorStop(1,'#000');
 ctx.fillStyle=bg;
 ctx.fillRect(0,0,W,H);
 ctx.fillStyle='rgba(255,40,40,.08)';
 for(let i=0;i<8;i++){
  const ang=t*0.4+i*0.9;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.cos(ang)*W,cy+Math.sin(ang)*H*0.35);
  ctx.strokeStyle='rgba(255,30,30,.06)'; ctx.lineWidth=40; ctx.stroke();
 }
 let phase='Greataxe awakens…';
 if(elapsed>=1.5) phase='54% slashed — cut diagonal, not down the middle!';
 if(elapsed>=5) phase='16% leap — shields curse them unto the void!';
 if(elapsed>=8.2) phase='Void Fallen (30%) hurl stones — 6% crushed!';
 if(elapsed>=11) phase='Double star spell → BLACK HOLE!';
 ctx.fillStyle='rgba(0,0,0,.82)'; ctx.fillRect(0,0,W,52);
 ctx.fillStyle='#ff9090'; ctx.font='bold 14px system-ui'; ctx.textAlign='center';
 ctx.fillText('🎬 Action 4 · '+MH_KING_CUTSCENE_TITLE,W/2,22);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 11px system-ui';
 ctx.fillText(phase,W/2,42);
 ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(0,H-28,W,28);
 ctx.fillStyle='#a0a8b8'; ctx.font='10px system-ui';
 ctx.fillText('Esc to skip · Build '+MH_BUILD,W/2,H-10);
 cs.crowd.forEach(e=>{
  if(e.gone) return;
  let ex=cx+e.bx, ey=cy+e.by;
  if(e.role==='jump'&&cs.jumpPhase>0){
   const j=Math.min(1,e.jumpT||0);
   ex=cx+e.bx*(1-j*0.92);
   ey=cy+e.by*(1-j*0.92)-Math.sin(j*Math.PI)*36;
  }
  if(e.voided) return;
  if(e.cursed){
   ctx.strokeStyle='rgba(180,60,255,.85)'; ctx.lineWidth=2;
   for(let s=0;s<5;s++){
    const a=t*2.2+s*Math.PI*2/5;
    const sx=cx+Math.cos(a)*58, sy=cy-22+Math.sin(a)*36;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey-8); ctx.stroke();
   }
   ctx.fillStyle='rgba(120,0,180,.55)'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
   ctx.fillText('VOID CURSE',ex,ey-28);
   e.voided=e.jumpT>0.88;
   if(e.voided) return;
  }
  let split=0;
  if(e.role==='slash') split=e.slashT||0;
  if(e.role==='stone'&&(e.stoneT||0)>0.65) split=1;
  mhDrawCutsceneMiniNoob(ctx,ex,ey,e.role==='voidally',split,e.role==='slash');
  if(e.role==='voidally'&&cs.stonePhase>0){
   const p=Math.min(1,cs.stonePhase);
   cs.crowd.filter(x=>x.role==='stone').forEach((tgt,ti)=>{
    const tx=cx+tgt.bx, ty=cy+tgt.by;
    const fromX=ex, fromY=ey-20;
    const u=Math.min(1,p*1.3-ti*0.08);
    if(u<=0) return;
    const sx=fromX+(tx-fromX)*u, sy=fromY+(ty-fromY)*u+Math.sin(u*Math.PI)*-20;
    ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(sx,sy,7,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#888'; ctx.stroke();
   });
  }
  if(e.role==='stone'&&e.stoneT>0&&e.stoneT<0.65){
   const fall=e.stoneT;
   ctx.fillStyle='#555';
   ctx.beginPath(); ctx.arc(ex,ey-40-fall*50,9,0,Math.PI*2); ctx.fill();
  }
 });
 if(cs.slashWave>0.05&&cs.slashWave<0.95){
  ctx.save();
  ctx.strokeStyle='rgba(255,60,60,.95)'; ctx.lineWidth=5;
  ctx.shadowColor='#ff2020'; ctx.shadowBlur=18;
  const sw=cs.slashWave;
  ctx.beginPath();
  ctx.moveTo(cx-220+sw*40,cy-120);
  ctx.lineTo(cx+220,cy+20);
  ctx.stroke();
  ctx.restore();
 }
 const blend=cs.swordBlend||0;
 ctx.save();
 ctx.translate(cx,cy-8);
 ctx.fillStyle='#1a1a1a'; ctx.fillRect(-14,8,28,36);
 ctx.fillStyle='#ff3030'; ctx.fillRect(-16,-28,32,32);
 if(blend<1){
  ctx.save(); ctx.globalAlpha=1-blend;
  ctx.strokeStyle='#888'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(28,-10); ctx.lineTo(52,-38); ctx.lineTo(48,-42); ctx.lineTo(24,-14); ctx.closePath();
  ctx.fillStyle='#666'; ctx.fill(); ctx.stroke();
  ctx.fillStyle='#444'; ctx.fillRect(20,-18,14,8);
  ctx.restore();
 }
 if(blend>0){
  ctx.save(); ctx.globalAlpha=blend;
  ctx.fillStyle='#ccc'; ctx.fillRect(22,-42,6,52);
  ctx.fillStyle='#ff5050'; ctx.fillRect(18,-46,14,8);
  ctx.shadowColor='#ff8080'; ctx.shadowBlur=12;
  ctx.strokeStyle='#fff'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(25,-38); ctx.lineTo(25,-90); ctx.stroke();
  ctx.restore();
 }
 for(let i=0;i<5;i++){
  const a=t*0.85+i*Math.PI*2/5;
  const sx=Math.cos(a)*62, sy=-18+Math.sin(a)*38;
  mhPaintOneAncientShield(ctx,sx,sy,MH_ANCIENT_GLYPHS[i],true,t+i);
 }
 ctx.restore();
 if(cs.starT>0){
  const stT=cs.starT;
  const hole=cs.holeR||0;
  ctx.save();
  ctx.translate(cx,cy-120);
  ctx.globalAlpha=0.25+stT*0.75;
  const drawStar=(r,rot,stroke)=>{
   ctx.save(); ctx.rotate(rot);
   ctx.strokeStyle=stroke; ctx.lineWidth=3;
   ctx.beginPath();
   for(let i=0;i<10;i++){
    const a=i*Math.PI/5-Math.PI/2;
    const rad=i%2?r*0.42:r;
    const px=Math.cos(a)*rad, py=Math.sin(a)*rad;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
   }
   ctx.closePath(); ctx.stroke();
   ctx.restore();
  };
  drawStar(38+stT*22,t*1.8,'rgba(255,80,80,.95)');
  drawStar(18+stT*12,-t*2.4,'rgba(255,240,200,.9)');
  if(hole>8){
   const g=ctx.createRadialGradient(0,0,0,0,0,hole);
   g.addColorStop(0,'#000'); g.addColorStop(0.35,'#200008');
   g.addColorStop(0.7,'rgba(255,40,40,.35)'); g.addColorStop(1,'rgba(255,80,80,0)');
   ctx.fillStyle=g;
   ctx.beginPath(); ctx.arc(0,0,hole,0,Math.PI*2); ctx.fill();
   ctx.strokeStyle='rgba(0,0,0,.9)'; ctx.lineWidth=hole*0.08;
   ctx.beginPath(); ctx.arc(0,0,hole*0.55,0,Math.PI*2); ctx.stroke();
  }
  ctx.restore();
  cs.crowd.forEach(e=>{
   if(e.gone||e.role==='voidally') return;
   const pull=Math.min(1,stT*1.2);
   e.bx*=1-pull*0.04;
   e.by*=1-pull*0.04;
  });
 }
}
function mhUseKingAction4Cutscene(st,save,pos,wi){
 mhEnsureFight(st,save);
 mhStartKingAction4Cutscene(st,save,wi,pos);
}
function mhUseFightAttack(st,save,pos,wi){
 mhEnsureFight(st,save);
 const vm=mhVoidCombatMorph(save);
 if(vm) return mhUseVoidAttack(st,save,pos,wi);
 const dir=mhFacingDir(st);
 const hits=mhFightHitscan(st,save,wi,pos,dir,16,78);
 mhSpawnVoidFx(st,{kind:'arc',x:pos.px,y:pos.py-12,vx:dir.dx*6,vy:dir.dy*6,color:'#ffe060',a0:Math.atan2(dir.dy,dir.dx)-0.8,a1:Math.atan2(dir.dy,dir.dx)+0.8,r:42,dr:60,life:0.35});
 mhToast(hits?'👊 Noobie punch!':'👊 Swing!');
 try{if(typeof SFX!=='undefined'&&SFX.hit)SFX.hit();}catch(_){}
}
function mhUseFightPower(st,save,pos,map,wi){
 mhEnsureFight(st,save);
 const vm=mhVoidCombatMorph(save);
 if(vm) return mhUseVoidPower(st,save,pos,map,wi);
 const dir=mhFacingDir(st);
 const hits=mhFightHitscan(st,save,wi,pos,dir,28,110,0.15);
 mhSpawnVoidFx(st,{kind:'shock',x:pos.px+dir.dx*50,y:pos.py+dir.dy*50,vx:0,vy:0,color:'#80c8ff',r:12,dr:90,life:0.45});
 mhToast(hits?'💥 Power blast!':'💥 Blast!');
 try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
}
function mhUseFightStorm(st,save,pos,wi){
 mhEnsureFight(st,save);
 const vm=mhVoidCombatMorph(save);
 if(vm) return mhUseVoidStorm(st,save,pos,wi);
 mhWrapPlayerRedBlackStorm(st,null,pos,4.5);
 const hits=mhFightAoe(st,save,wi,pos.px,pos.py-10,88,22);
 mhVoidShake(st,120,7);
 mhToast(hits?'🌪 Red-black storm around you!':'🌪 Storm around you!');
}
function mhUseVoidAttack(st,save,pos,wi){
 const m=mhVoidCombatMorph(save);
 if(!m){ mhToast('Morph into a Void Fallen noobie first (Morph tab)!'); return; }
 if(m.plagueDoctor) mhPlagueDoctorSay(save,0);
 const atk=m.voidAttack||MH_VOID_ATTACKS[0];
 const dir=mhFacingDir(st);
 const rage=st.voidRageUntil&&performance.now()<st.voidRageUntil;
 mhSpawnAttackVfx(st,m,atk,dir,pos,rage);
 const range=(atk.range||95)*(rage?1.25:1);
 let dmg=22;
 if(atk.kind==='beam') dmg=26;
 if(atk.kind==='nova') dmg=32;
 if(m.voidKing) dmg+=12;
 if(wi!=null) mhFightHitscan(st,save,wi,pos,dir,dmg,range);
 mhToast(m.plagueDoctor?'⚔ '+atk.name+'… (it barely works!)':'⚔ '+atk.name+'!');
 try{if(typeof SFX!=='undefined'&&SFX.hit)SFX.hit();}catch(_){}
}
function mhUseVoidStorm(st,save,pos,wi){
 const m=mhVoidCombatMorph(save);
 if(!m){ mhToast('Morph into a Void Fallen noobie first (Morph tab)!'); return; }
 const dir=mhFacingDir(st);
 const range=m.voidKing?210:175;
 mhSpawnVoidUniverseStorm(st,m,dir,pos,range);
 if(wi!=null){
  const cx=pos.px, cy=pos.py-10;
  mhFightAoe(st,save,wi,cx,cy,m.voidKing?115:95,m.voidKing?55:38);
 }
 mhToast('🌌 '+MH_VOID_STORM_NAME+'! GIBBERLINK rift · red-black hole · forbidden spells!');
 try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
}
function mhUseVoidPower(st,save,pos,map,wi){
 const m=mhVoidCombatMorph(save);
 if(!m){ mhToast('Morph into a Void Fallen noobie first!'); return; }
 if(m.plagueDoctor) mhPlagueDoctorSay(save,1);
 const pow=m.voidPower||MH_VOID_POWERS[0];
 const dir=mhFacingDir(st);
 if(pow.kind==='dash'){
  pos.px+=dir.dx*(pow.dist||80); pos.py+=dir.dy*(pow.dist||80);
  mhClampWalkPos(map,pos);
 }
 if(pow.kind==='shield'){
  const sec=pow.time||2.8;
  st.voidShieldUntil=performance.now()+sec*1000;
 }
 else if(pow.kind==='heal'){ save.coins+=pow.coins||8; mhSaveSave(save); st.fightHp=Math.min(st.fightMaxHp||140,(st.fightHp||100)+25); }
 else if(pow.kind==='buff') st.voidRageUntil=performance.now()+(pow.time||4)*1000;
 if(pow.kind==='storm'||pow.id==='forbidden_storm'){
  mhSpawnVoidUniverseStorm(st,m,dir,pos,pow.range||160);
  if(wi!=null){
   mhFightAoe(st,save,wi,pos.px,pos.py-10,m.voidKing?115:95,m.voidKing?48:34);
  }
 }else{
  mhSpawnPowerVfx(st,m,pow,dir,pos,map);
  if(wi!=null&&pow.kind==='pull') mhFightAoe(st,save,wi,pos.px,pos.py,pow.range||120,30);
  else if(wi!=null&&pow.kind!=='dash'&&pow.kind!=='shield'&&pow.kind!=='heal'&&pow.kind!=='buff'&&pow.kind!=='echo'){
   mhFightHitscan(st,save,wi,pos,dir,30,pow.range||100,0.1);
  }
 }
 mhToast('✦ '+pow.name+'!');
 try{if(typeof SFX!=='undefined'&&SFX.ui)SFX.ui();}catch(_){}
}
function mhPaintVoidKing(ctx,x,y,sc,alpha,silhouette,walkPhase,running,t,flat){
 ctx.save();
 ctx.translate(x,y);
 ctx.scale(sc,sc);
 ctx.globalAlpha=alpha==null?1:alpha;
 const wa=mhWalkLegAnim(walkPhase,running);
 ctx.translate(0,-wa.bob);
 const black='#0a0a0a', armor='#161616', darkRed='#480808', red='#b01010', glow='#ff2020';
 const swing=Math.sin(t*2.6)*0.72-0.15;
 ctx.fillStyle='rgba(0,0,0,.45)';
 ctx.beginPath(); ctx.ellipse(0,58,22,5,0,0,Math.PI*2); ctx.fill();
 mhGradRect(ctx,-11+wa.lx,20+wa.ly,10,36,black,darkRed);
 mhGradRect(ctx,1+wa.rx,20+wa.ry,10,36,black,darkRed);
 ctx.fillStyle=red; ctx.fillRect(-11+wa.lx,28+wa.ly,10,2); ctx.fillRect(1+wa.rx,28+wa.ry,10,2);
 mhGradRect(ctx,-20,-4,40,28,darkRed,armor);
 ctx.fillStyle=armor; ctx.fillRect(-20,-4,40,6); ctx.fillRect(-20,10,40,4);
 ctx.fillStyle=red; ctx.fillRect(-20,2,40,3);
 ctx.fillStyle=black; ctx.fillRect(-22,8,6,14); ctx.fillRect(16,8,6,14);
 ctx.save();
 ctx.translate(-24,6+wa.ax);
 ctx.fillStyle=armor; ctx.fillRect(-8,-12,10,24);
 ctx.fillStyle=darkRed; ctx.fillRect(-26,-18,18,36);
 ctx.strokeStyle=red; ctx.lineWidth=2; ctx.strokeRect(-26.5,-18.5,19,37);
 ctx.fillStyle=black; ctx.fillRect(-24,-14,15,8);
 mhDrawForbiddenSymbol(ctx,-17,-2,4,2);
 ctx.restore();
 ctx.save();
 ctx.translate(22,4-wa.ax);
 ctx.rotate(swing);
 ctx.fillStyle=armor; ctx.fillRect(-4,-10,10,22);
 ctx.fillStyle='#2a1810'; ctx.fillRect(2,0,5,34);
 ctx.fillStyle=black; ctx.fillRect(-2,-32,18,16);
 ctx.fillStyle=darkRed; ctx.fillRect(0,-30,14,4);
 ctx.fillStyle=red; ctx.fillRect(1,-28,12,2);
 ctx.fillRect(4,2,3,28);
 ctx.restore();
 ctx.fillStyle=armor; ctx.fillRect(-16,-54,32,34);
 ctx.fillStyle=black; ctx.fillRect(-14,-52,28,30);
 ctx.fillStyle=red; ctx.shadowColor=glow; ctx.shadowBlur=silhouette?0:10;
 ctx.fillRect(-10,-44,20,3);
 ctx.shadowBlur=0;
 if(!silhouette&&!flat){
  ctx.fillStyle='rgba(80,0,0,.5)'; ctx.fillRect(-16,-8,10,16); ctx.fillRect(6,-8,10,16);
 }
 ctx.restore();
}
function mhPaintAura(ctx,m,x,y,t){
 if(!m||m.voidKing) return;
 const r=MH_RARITY[m.rarity]||MH_RARITY.common;
 const tier={common:0,uncommon:1,rare:2,epic:3,legendary:4,secret:4,exclusive:4,exotic:5,voidfallen:6}[m.rarity]||0;
 const pulse=1+Math.sin(t*3+(mhHashStr(m.id)%7))*0.15;
 const rad=(16+tier*9)*pulse;
 const alphaMul=[0.35,0.5,0.65,0.82,0.92,1,1.05,1.1][tier]||0.4;
 const g=ctx.createRadialGradient(x,y-20,4,x,y-20,rad);
 g.addColorStop(0,mhHex(r.color,0.45*alphaMul));
 g.addColorStop(0.5,mhHex(r.color,0.12*alphaMul));
 g.addColorStop(1,mhHex(r.color,0));
 ctx.fillStyle=g;
 ctx.beginPath(); ctx.arc(x,y-20,rad,0,Math.PI*2); ctx.fill();
 if(tier>=3){
  ctx.strokeStyle=mhHex(r.color,0.35+Math.sin(t*5)*0.15);
  ctx.lineWidth=m.rarity==='exotic'?3:2;
  ctx.beginPath(); ctx.arc(x,y-20,rad*0.72,0,Math.PI*2); ctx.stroke();
 }
 if(m.rarity==='exotic'){
  for(let i=0;i<3;i++){
   const a=t*2+i*2.1;
   ctx.fillStyle=mhHex(r.color,0.5);
   ctx.beginPath(); ctx.arc(x+Math.cos(a)*rad*0.8,y-20+Math.sin(a)*rad*0.35,3,0,Math.PI*2); ctx.fill();
  }
 }
 if(m.rarity==='voidfallen'){
  ctx.strokeStyle=mhHex(r.color,0.25+Math.sin(t*4)*0.12);
  ctx.lineWidth=2;
  for(let i=0;i<4;i++){
   const a=t*1.2+i*Math.PI/2;
   ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*rad*0.9,y-20+Math.sin(a)*rad*0.35,rad*0.35,rad*0.12,a); ctx.stroke();
  }
 }
}
function mhPaintNoob5D(ctx,m,x,y,sc,alpha,silhouette,walkPhase,running){
 const layers=[
  {dx:-10,dy:6,rot:-0.12,hue:300,a:0.14},
  {dx:10,dy:4,rot:0.1,hue:240,a:0.12},
  {dx:-6,dy:-8,rot:0.08,hue:330,a:0.11},
  {dx:8,dy:-6,rot:-0.06,hue:270,a:0.1}
 ];
 layers.forEach(L=>{
  ctx.save();
  ctx.translate(L.dx,L.dy);
  ctx.rotate(L.rot);
  ctx.globalAlpha=L.a*(alpha==null?1:alpha);
  mhPaintNoob3D(ctx,m,x,y,sc*0.97,alpha,true,walkPhase,running);
  ctx.restore();
 });
 mhPaintNoob3D(ctx,m,x,y,sc,alpha,silhouette,walkPhase,running);
 ctx.save();
 ctx.translate(x,y-18);
 ctx.scale(sc,sc);
 ctx.strokeStyle=mhHex(m.voidAccent||'#c080ff',0.55);
 ctx.lineWidth=1.4;
 for(let i=0;i<5;i++){
  const a=(walkPhase||0)*0.4+i*Math.PI*2/5;
  const r=26+Math.sin((walkPhase||0)+i)*4;
  ctx.beginPath();
  ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
  ctx.lineTo(Math.cos(a+0.5)*r*0.55,Math.sin(a+0.5)*r*0.55);
  ctx.stroke();
 }
 ctx.fillStyle=mhHex(m.voidEyes||'#ffe860',0.35);
 ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
 ctx.restore();
}
function mhPaintNoob3D(ctx,m,x,y,sc,alpha,silhouette,walkPhase,running){
 if(!m) return;
 ctx.save();
 ctx.translate(x,y);
 ctx.scale(sc,sc);
 ctx.globalAlpha=alpha==null?1:alpha;
 if(silhouette){
  m={...m,head:'#3a4050',torso:'#283040',legs:'#1e2430',arms:'#3a4050'};
  ctx.globalAlpha=(alpha==null?0.72:alpha);
 }
 const h=m.head||'#F5CD30', t=m.torso||'#0085DB', l=m.legs||'#A4BD47', a=m.arms||h;
 ctx.fillStyle='rgba(0,0,0,.35)';
 ctx.beginPath(); ctx.ellipse(0,58,20,5,0,0,Math.PI*2); ctx.fill();
 if(m.body==='ghost'){
  mhGradRect(ctx,-16,-8,32,52,t,mhShade(t,-40));
  const hg=ctx.createRadialGradient(-6,-36,2,0,-28,24);
  hg.addColorStop(0,mhShade(h,35)); hg.addColorStop(1,mhShade(h,-25));
  ctx.fillStyle=hg; ctx.fillRect(-16,-48,32,32);
 }else if(m.body==='chibi'){
  mhGradRect(ctx,-8,18,7,24,l,mhShade(l,-30)); mhGradRect(ctx,1,18,7,24,l,mhShade(l,-30));
  mhGradRect(ctx,-14,0,28,18,t,mhShade(t,-35));
  mhGradRect(ctx,-18,2,8,16,a,mhShade(a,-25)); mhGradRect(ctx,10,2,8,16,a,mhShade(a,-25));
  mhGradRect(ctx,-18,-44,36,38,h,mhShade(h,-20));
 }else if(m.body==='tall'){
  const wa=mhWalkLegAnim(walkPhase,running);
  ctx.translate(0,-wa.bob);
  mhGradRect(ctx,-9+wa.lx,16+wa.ly,8,38,l,mhShade(l,-30)); mhGradRect(ctx,1+wa.rx,16+wa.ry,8,38,l,mhShade(l,-30));
  mhGradRect(ctx,-15,-2,30,22,t,mhShade(t,-35));
  mhGradRect(ctx,-20,0+wa.ax,9,24,a,mhShade(a,-25)); mhGradRect(ctx,11,0-wa.ax,9,24,a,mhShade(a,-25));
  mhGradRect(ctx,-12,-50,24,26,h,mhShade(h,-25));
 }else if(m.body==='wide'){
  mhGradRect(ctx,-12,20,11,32,l,mhShade(l,-30)); mhGradRect(ctx,1,20,11,32,l,mhShade(l,-30));
  mhGradRect(ctx,-20,0,40,26,t,mhShade(t,-35));
  mhGradRect(ctx,-26,2,12,24,a,mhShade(a,-25)); mhGradRect(ctx,14,2,12,24,a,mhShade(a,-25));
  mhGradRect(ctx,-14,-48,28,32,h,mhShade(h,-25));
 }else if(m.body==='builder'){
  mhGradRect(ctx,-10,22,9,32,l,mhShade(l,-30)); mhGradRect(ctx,1,22,9,32,l,mhShade(l,-30));
  mhGradRect(ctx,-16,0,32,24,t,mhShade(t,-35));
  mhGradRect(ctx,-22,2,10,22,a,mhShade(a,-25)); mhGradRect(ctx,12,2,10,22,a,mhShade(a,-25));
  mhGradRect(ctx,-14,-48,28,28,h,mhShade(h,-25));
  ctx.fillStyle='#f4c430'; ctx.beginPath(); ctx.moveTo(0,-58); ctx.lineTo(10,-48); ctx.lineTo(-10,-48); ctx.fill();
 }else if(m.body==='robot'){
  mhGradRect(ctx,-12,18,10,34,l,mhShade(l,-35)); mhGradRect(ctx,2,18,10,34,l,mhShade(l,-35));
  mhGradRect(ctx,-18,0,36,22,t,mhShade(t,-30));
  mhGradRect(ctx,-20,-2,12,20,a,mhShade(a,-20)); mhGradRect(ctx,8,-2,12,20,a,mhShade(a,-20));
  ctx.fillStyle='#505860'; ctx.fillRect(-14,-46,28,28);
  ctx.fillStyle='#00eaff'; ctx.fillRect(-10,-36,8,8); ctx.fillRect(2,-36,8,8);
 }else{
  const wa=mhWalkLegAnim(walkPhase,running);
  ctx.translate(0,-wa.bob);
  mhGradRect(ctx,-10+wa.lx,22+wa.ly,9,32,l,mhShade(l,-30)); mhGradRect(ctx,1+wa.rx,22+wa.ry,9,32,l,mhShade(l,-30));
  mhGradRect(ctx,-16,0,32,24,t,mhShade(t,-35));
  if(m.stripe){ ctx.fillStyle='rgba(255,255,255,.25)'; ctx.fillRect(-16,8,32,6); }
  if(m.sleeves&&m.accent){ ctx.fillStyle=m.accent; ctx.fillRect(-16,4,6,14); ctx.fillRect(10,4,6,14); }
  if(m.shoe){ ctx.fillStyle=m.shoe; ctx.fillRect(-10+wa.lx,48+wa.ly,9,6); ctx.fillRect(1+wa.rx,48+wa.ry,9,6); }
  mhGradRect(ctx,-22,2+wa.ax,10,22,a,mhShade(a,-25)); mhGradRect(ctx,12,2-wa.ax,10,22,a,mhShade(a,-25));
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
 if(m.hat==='headphones'){ ctx.strokeStyle='#404850'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,-32,18,Math.PI,0); ctx.stroke(); }
 if(m.hat==='bow'){ ctx.fillStyle='#ff5090'; ctx.fillRect(-10,-52,8,8); ctx.fillRect(2,-52,8,8); }
 if(m.hat==='party'){ ctx.fillStyle='#ff4080'; ctx.beginPath(); ctx.arc(-8,-50,4,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#40c0ff'; ctx.beginPath(); ctx.arc(8,-48,3,0,Math.PI*2); ctx.fill(); }
 if(m.hat==='voidhorn'&&!silhouette){
  ctx.fillStyle=mhShade(m.torso||'#502080',-20);
  ctx.beginPath(); ctx.moveTo(0,-56); ctx.lineTo(6,-44); ctx.lineTo(-6,-44); ctx.fill();
 }
 if(m.hat==='voidhalo'&&!silhouette){
  ctx.strokeStyle=m.voidAccent||'#c080ff'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(0,-52,14,Math.PI,0); ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(0,-52,10,Math.PI,0); ctx.stroke();
 }
 if(m.hat==='plague'&&!silhouette){
  ctx.fillStyle='#1a2830'; ctx.beginPath(); ctx.ellipse(0,-48,20,9,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#303840'; ctx.beginPath(); ctx.moveTo(0,-44); ctx.lineTo(12,-28); ctx.lineTo(-12,-28); ctx.fill();
 }
 if(m.hat==='riftshard'&&!silhouette){
  const ac=m.voidAccent||'#80e0ff';
  ctx.fillStyle=ac; ctx.beginPath(); ctx.moveTo(10,-54); ctx.lineTo(18,-42); ctx.lineTo(10,-36); ctx.lineTo(2,-42); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=1; ctx.stroke();
 }
 if(m.rarity==='voidfallen'&&!silhouette){
  if(m.voidMale){
   ctx.fillStyle=mhHex(m.torso||'#402060',0.35);
   ctx.fillRect(-18,2,36,8);
  }
  const ve=m.voidEyes||'#70e8ff';
  ctx.fillStyle='#101018'; ctx.fillRect(-9,-37,6,6); ctx.fillRect(3,-37,6,6);
  ctx.fillStyle=ve; ctx.shadowColor=ve; ctx.shadowBlur=6;
  ctx.fillRect(-8,-36,4,4); ctx.fillRect(4,-36,4,4);
  ctx.shadowBlur=0;
  const mk=m.voidMark|0;
  ctx.strokeStyle=mhHex(ve,0.45);
  ctx.lineWidth=1;
  for(let k=0;k<3;k++){
   const y=2+k*9+(mk%5);
   ctx.beginPath(); ctx.moveTo(-14+((mk+k*3)%6),y); ctx.lineTo(14-((mk+k*5)%6),y+2); ctx.stroke();
  }
  if(m.voidAccent){
   ctx.fillStyle=mhHex(m.voidAccent,0.35);
   ctx.fillRect(-16,4+(mk%4),32,3);
  }
 }
 if((m.fallen||m.rarity==='voidfallen')&&!silhouette){
  ctx.fillStyle='rgba(80,20,120,.55)';
  ctx.beginPath(); ctx.moveTo(-14,-8); ctx.lineTo(-22,18); ctx.lineTo(-6,12); ctx.fill();
  ctx.beginPath(); ctx.moveTo(14,-8); ctx.lineTo(22,18); ctx.lineTo(6,12); ctx.fill();
  ctx.strokeStyle='rgba(180,100,255,.6)'; ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(-18,6); ctx.quadraticCurveTo(-28,20,-12,28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18,6); ctx.quadraticCurveTo(28,20,12,28); ctx.stroke();
 }
 if(m.prop&&!silhouette){
  const pc=mhHsl(mhHashStr(m.id+'p'),2,80,55);
  if(m.prop==='balloon'){ ctx.fillStyle=pc; ctx.beginPath(); ctx.arc(18,-48,8,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#333'; ctx.beginPath(); ctx.moveTo(18,-40); ctx.lineTo(10,-20); ctx.stroke(); }
  if(m.prop==='gemstick'){ ctx.fillStyle='#80e0ff'; ctx.beginPath(); ctx.moveTo(20,-50); ctx.lineTo(26,-38); ctx.lineTo(20,-32); ctx.lineTo(14,-38); ctx.fill(); }
  if(m.prop==='sword'){ ctx.fillStyle='#c0c8d0'; ctx.fillRect(22,-42,3,22); ctx.fillStyle='#ffd060'; ctx.fillRect(20,-44,7,4); }
  if(m.prop==='pet'){ ctx.fillStyle=pc; ctx.fillRect(16,-24,10,10); ctx.fillRect(18,-34,6,6); }
  if(m.prop==='skate'){ ctx.fillStyle='#303840'; ctx.fillRect(-20,58,40,4); ctx.fillRect(-12,54,8,4); ctx.fillRect(8,54,8,4); }
  if(m.prop==='umbrella'){ ctx.fillStyle=pc; ctx.beginPath(); ctx.arc(18,-52,12,Math.PI,0); ctx.fill(); ctx.fillRect(18,-52,2,18); }
  if(m.prop==='sparkler'){ ctx.strokeStyle='#ffe060'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(20,-30); ctx.lineTo(28,-50); ctx.stroke(); }
  if(m.prop==='book'){ ctx.fillStyle='#8040c0'; ctx.fillRect(16,-28,10,12); ctx.fillStyle='#fff'; ctx.fillRect(18,-26,6,2); }
  if(m.prop==='trophy'){ ctx.fillStyle='#ffd060'; ctx.fillRect(18,-36,8,10); ctx.fillRect(16,-38,12,4); }
  if(m.prop==='rocket'){ ctx.fillStyle='#e04040'; ctx.fillRect(18,-48,6,14); ctx.fillStyle='#ffa060'; ctx.beginPath(); ctx.moveTo(18,-34); ctx.lineTo(21,-28); ctx.lineTo(24,-34); ctx.fill(); }
 }
 ctx.restore();
}
function mhPaintNoobFlat(ctx,m,x,y,sc,alpha,silhouette,walkPhase,running,animT){
 if(!m) return;
 ctx.save();
 ctx.translate(x,y);
 ctx.scale(sc,sc);
 ctx.globalAlpha=alpha==null?1:alpha;
 let h=m.head||'#F5CD30', tor=m.torso||'#0085DB', l=m.legs||'#A4BD47', a=m.arms||h;
 if(silhouette){ h='#3a4050'; tor='#283040'; l='#1e2430'; a='#3a4050'; ctx.globalAlpha=(alpha==null?0.75:alpha); }
 const wa=mhWalkLegAnim(walkPhase,running);
 ctx.translate(0,-wa.bob);
 const isVoid=m.rarity==='voidfallen'||m.voidFallen;
 if(isVoid&&!silhouette){ h='#141014'; tor=m.torso||'#580808'; l=m.legs||'#0a0a0a'; a=m.arms||'#1a1018'; }
 ctx.fillStyle=l; ctx.fillRect(-10+wa.lx,22+wa.ly,9,32); ctx.fillRect(1+wa.rx,22+wa.ry,9,32);
 ctx.fillStyle=tor; ctx.fillRect(-16,0,32,24);
 ctx.fillStyle=a; ctx.fillRect(-22,2+wa.ax,10,22); ctx.fillRect(12,2-wa.ax,10,22);
 ctx.fillStyle=h; ctx.fillRect(-14,-48,28,28);
 if(!isVoid){ ctx.fillStyle='#101018'; ctx.fillRect(-8,-36,5,5); ctx.fillRect(3,-36,5,5); }
 if(isVoid){
  ctx.strokeStyle=m.voidAccent||'#ff4040'; ctx.lineWidth=3;
  ctx.strokeRect(-18,-50,36,82);
  ctx.strokeStyle='#0a0a0a'; ctx.lineWidth=2;
  ctx.strokeRect(-16,-48,32,78);
  if(m.voidMale){ ctx.fillStyle='rgba(0,0,0,.75)'; ctx.fillRect(-18,4,36,10); ctx.fillStyle=m.voidAccent||'#ff3030'; ctx.fillRect(-16,6,32,4); }
  const ve=m.voidEyes||'#ff5050';
  ctx.fillStyle=ve; ctx.shadowColor=ve; ctx.shadowBlur=12;
  ctx.fillRect(-10,-37,7,7); ctx.fillRect(2,-37,7,7);
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(0,0,0,.85)'; ctx.fillRect(-15,-8,10,16); ctx.fillRect(5,-8,10,16);
  ctx.fillStyle='rgba(255,40,40,.5)'; ctx.fillRect(-13,10,26,5);
  ctx.fillStyle='#ffe8e0'; ctx.font='bold 11px serif'; ctx.textAlign='center';
  ctx.fillText(MH_ANCIENT_GLYPHS[(mhHashStr(m.id||'x')%5)]||'⌬',0,18);
  if(!silhouette){
   const ft=performance.now()/1000;
   for(let i=0;i<4;i++){
    const ang=ft*2.2+i*Math.PI/2;
    ctx.strokeStyle=i%2?'rgba(255,60,60,.65)':'rgba(0,0,0,.8)';
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(Math.cos(ang)*12,Math.sin(ang)*8); ctx.lineTo(Math.cos(ang)*28,Math.sin(ang)*20); ctx.stroke();
   }
  }
 }
 ctx.restore();
}
function mhVoidFlatScreenOverlay(ctx,W,H){
 const b=16;
 ctx.fillStyle='rgba(0,0,0,.82)';
 ctx.fillRect(0,0,W,b); ctx.fillRect(0,H-b,W,b);
 ctx.fillRect(0,0,b,H); ctx.fillRect(W-b,0,b,H);
 ctx.strokeStyle='#b070ff'; ctx.lineWidth=3;
 ctx.strokeRect(b*.5,b*.5,W-b,H-b);
 ctx.strokeStyle='rgba(200,160,255,.3)'; ctx.lineWidth=1;
 ctx.strokeRect(b*.5+2,b*.5+2,W-b-4,H-b-4);
 ctx.fillStyle='rgba(0,0,0,.08)';
 for(let y=0;y<H;y+=4) ctx.fillRect(0,y,W,1);
 ctx.fillStyle='#d0a8ff'; ctx.font='bold 11px monospace,sans-serif'; ctx.textAlign='center';
 ctx.fillText(MH_VOID_ABYSS_LABEL+' · '+MH_VOID_DIM_LABEL, W/2, b-4);
}
function mhPaintNoobWorld(ctx,m,x,y,sc,alpha,silhouette,t,walkPhase,flat,running){
 const off=flat
  ?{dx:Math.sin(walkPhase||0)*3,dy:0,rot:0,sc:1}
  :mhAnimOffset(m,t,walkPhase,running);
 ctx.save();
 ctx.translate(x+off.dx,y+off.dy);
 if(m.voidKing){
  mhDrawPassiveAncientShieldsOnCharacter(ctx,0,-8,t,m,alpha);
  mhPaintKingStoneAura(ctx,0,-8,t,alpha,silhouette);
  mhPaintVoidKing(ctx,0,-8,sc*off.sc,alpha,silhouette,walkPhase,running,t,flat);
  ctx.restore();
  return;
 }
 if(m.rarity==='voidfallen'||m.voidFallen){
  mhDrawPassiveAncientShieldsOnCharacter(ctx,0,-8,t,m,alpha);
  mhPaintVoidFallenStormAura(ctx,0,-8,t,alpha,silhouette,m);
 }
 if(!flat) ctx.rotate(off.rot);
 if(!flat) mhPaintAura(ctx,m,0,-8,t);
 if(m.void5D) mhPaintNoob5D(ctx,m,0,-8,sc*off.sc,alpha,silhouette,walkPhase,running);
 else if(flat) mhPaintNoobFlat(ctx,m,0,-8,sc*off.sc,alpha,silhouette,walkPhase,running,t);
 else mhPaintNoob3D(ctx,m,0,-8,sc*off.sc,alpha,silhouette,walkPhase,running);
 ctx.restore();
}

function mhWalkTileBlocked(map,tx,ty){
 if(tx<1||ty<1||tx>=map.w-1||ty>=map.h-1) return true;
 return false;
}
function mhDrawVoidThrone(ctx,map){
 if(map.throneTx==null) return;
 const x=map.throneTx*MH_TILE,y=map.throneTy*MH_TILE;
 ctx.fillStyle='rgba(40,0,0,.35)'; ctx.fillRect(x-MH_TILE,y-MH_TILE,MH_TILE*3,MH_TILE*3);
 ctx.fillStyle='#280808'; ctx.fillRect(x-4,y+8,MH_TILE+8,12);
 ctx.fillStyle='#a01010'; ctx.fillRect(x+6,y-6,MH_TILE-12,10);
 ctx.strokeStyle='#ff3030'; ctx.lineWidth=2; ctx.strokeRect(x+.5,y+.5,MH_TILE-1,MH_TILE-1);
 ctx.fillStyle='#ff8080'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
 ctx.fillText('FORBIDDEN THRONE · '+MH_VOID_KING_DEPTH+' DEPTH · 5D',x+MH_TILE/2,y-10);
}
function mhCanvasToWorld(canvas,camX,camY,clientX,clientY){
 const rect=canvas.getBoundingClientRect();
 const sx=canvas.width/rect.width, sy=canvas.height/rect.height;
 return {wx:(clientX-rect.left)*sx+camX, wy:(clientY-rect.top)*sy+camY};
}
function mhWalkCanvasClick(ev){
 if(!mhState||mhState.tab!=='hunt') return;
 const canvas=ev.currentTarget;
 const wi=mhState.world, save=mhState.save;
 const pos=mhWalkEnsurePos(mhState,wi);
 const W=canvas.width,H=canvas.height;
 const camX=pos.px-W/2,camY=pos.py-H/2;
 const {wx,wy}=mhCanvasToWorld(canvas,camX,camY,ev.clientX,ev.clientY);
 let best=null,bd=48;
 mhWorldMorphs(wi).forEach(m=>{
  if(m.tileX==null) return;
  const p=mhGetNpcPos(mhState,wi,m);
  const d=Math.hypot(p.px-wx,p.py-wy);
  if(d<bd){ bd=d; best=m; }
 });
 if(best) mhDeckUnlock(best,save);
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
 if(!st.walkPos[wi]) st.walkPos[wi]=mhMapSpawnPos(map);
 const p=st.walkPos[wi];
 mhClampWalkPos(map,p);
 return p;
}
function mhNpcState(st,wi,m){
 if(!st.npc) st.npc={};
 if(!st.npc[wi]) st.npc[wi]={};
 if(!st.npc[wi][m.id]){
  st.npc[wi][m.id]={
   px:m.tileX*MH_TILE+MH_TILE/2,
   py:m.tileY*MH_TILE+MH_TILE/2,
   dir:(mhHashStr(m.id)%628)/100,
   wait:0,
   phase:mhHashStr(m.id+'p')%100/10
  };
 }
 return st.npc[wi][m.id];
}
function mhGetNpcPos(st,wi,m){
 const n=mhNpcState(st,wi,m);
 return {px:n.px,py:n.py,phase:n.phase};
}
function mhNpcWander(st,map,m,npc,dt,save){
 if(m.tileX==null) return;
 npc.px=m.tileX*MH_TILE+MH_TILE/2;
 npc.py=m.tileY*MH_TILE+MH_TILE/2;
 npc.walking=false;
 npc.phase+=dt*(mhHasMorph(save,m.id)?2:1.3);
}
function mhDrawHideoutGroves(ctx,map,pos,wi){
 const abyss=wi===MH_VOID_WORLD||map.abyssStamp;
 (map.hideouts||[]).forEach(g=>{
  const x=g.tx*MH_TILE,y=g.ty*MH_TILE,w=g.w*MH_TILE,h=g.h*MH_TILE;
  const cx=x+w/2,cy=y+h/2;
  const dist=Math.hypot(cx-pos.px,cy-pos.py);
  if(dist>520) return;
  ctx.save();
  ctx.strokeStyle=abyss
   ?(dist<MH_HIDDEN_REVEAL_R+40?'rgba(255,80,120,.95)':'rgba(120,40,160,.45)')
   :(dist<MH_HIDDEN_REVEAL_R+40?'rgba(255,232,160,.9)':'rgba(200,220,255,.35)');
  ctx.lineWidth=dist<180?3:2;
  ctx.setLineDash([8,6]);
  ctx.strokeRect(x+2,y+2,w-4,h-4);
  ctx.setLineDash([]);
  if(dist<280){
   ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(cx-72,y-18,144,16);
   ctx.fillStyle=abyss?'#ffb0d0':'#ffe8a0'; ctx.font='bold 11px system-ui'; ctx.textAlign='center';
   ctx.fillText(g.label||(abyss?'Abyss grove':'Hidden grove'),cx,y-6);
  }
  ctx.restore();
 });
}
function mhGroveAt(map,px,py){
 const tx=Math.floor(px/MH_TILE), ty=Math.floor(py/MH_TILE);
 for(const g of map.hideouts||[]){
  if(tx>=g.tx&&tx<g.tx+g.w&&ty>=g.ty&&ty<g.ty+g.h) return g;
 }
 return null;
}
function mhMorphsInGrove(save,wi,grove){
 return mhWorldMorphs(wi).filter(m=>{
  if(m.tileX==null||m.voidKing||mhHasMorph(save,m.id)) return false;
  return m.tileX>=grove.tx&&m.tileX<grove.tx+grove.w&&m.tileY>=grove.ty&&m.tileY<grove.ty+grove.h;
 });
}
function mhTryStartMinigame(){
 if(!mhState?.save) return;
 const wi=mhState.world, save=mhState.save, map=MH_WORLD_MAPS[wi];
 const pos=mhWalkEnsurePos(mhState,wi);
 if(mhState.insideBuilding?.kind==='plague_lab'){ mhPlagueLabAdvance(save); return; }
 if(mhTryCollectPlagueBug(save,wi,map,pos)) return;
 if(mhState.walkNearId){
  mhDeckUnlock(mhMorph(mhState.walkNearId),save);
  return;
 }
 const grove=mhGroveAt(map,pos.px,pos.py);
 if(grove){
  const pool=mhMorphsInGrove(save,wi,grove);
  if(pool.length){
   pool.sort((a,b)=>{
    const da=Math.hypot(mhGetNpcPos(mhState,wi,a).px-pos.px,mhGetNpcPos(mhState,wi,a).py-pos.py);
    const db=Math.hypot(mhGetNpcPos(mhState,wi,b).px-pos.px,mhGetNpcPos(mhState,wi,b).py-pos.py);
    return da-db;
   });
   mhOpenMinigame(pool[0]);
   mhToast('⚔ Fight or obby — unlock a noobie in this grove!');
   return;
  }
 }
 let best=null,bd=380;
 mhWorldMorphs(wi).forEach(m=>{
  if(m.tileX==null||m.voidKing||mhHasMorph(save,m.id)) return;
  const p=mhGetNpcPos(mhState,wi,m);
  const d=Math.hypot(p.px-pos.px,p.py-pos.py);
  if(d<bd){ bd=d; best=m; }
 });
 if(best){ mhOpenMinigame(best); mhToast('⚔ Duel / obby started!'); return; }
 const next=mhWorldMorphs(wi).find(m=>!mhHasMorph(save,m.id)&&!m.voidKing);
 if(next){ mhOpenMinigame(next); mhToast('⚔ Fight challenge — deck noobie!'); return; }
 mhToast('All noobies on this map collected! Try 💎 Epic+ or 🕳 Void teleport.');
}
function mhWalkNearMorph(save,wi,pos,st){
 const map=MH_WORLD_MAPS[wi];
 const grove=mhGroveAt(map,pos.px,pos.py);
 const morphs=mhWorldMorphs(wi);
 let best=null,bd=1e9;
 const tryMorph=(m,maxD)=>{
  if(m.tileX==null||mhHasMorph(save,m.id)) return;
  const p=mhGetNpcPos(st,wi,m);
  const d=Math.hypot(p.px-pos.px,p.py-pos.py);
  if(d<maxD&&d<bd){ bd=d; best={m,d}; }
 };
 if(grove){
  mhMorphsInGrove(save,wi,grove).forEach(m=>tryMorph(m,130));
  if(best) return best.m;
 }
 morphs.forEach(m=>tryMorph(m,MH_INTERACT_R));
 if(!best||best.d>MH_INTERACT_R) return null;
 return best.m;
}
function mhWalkActive(){
 return !!(mhState&&mhState.tab==='hunt'&&document.getElementById('morphhunt')&&!mhState.minigameMorph&&!mhState.kingCutscene);
}
function mhWalkApplyKey(e,down){
 if(!mhMorphHuntIsOpen()) return false;
 if(mhState.minigameMorph||mhState.kingCutscene){
  if(down&&isSpaceKey(e)&&!mhMorphHuntTypingTarget(e.target)){
   e.preventDefault();
   e.stopPropagation();
   return true;
  }
  return false;
 }
 if(!mhWalkActive()) return false;
 const ae=document.activeElement;
 const typing=mhMorphHuntTypingTarget(ae);
 if(typing&&e.code!=='Enter'&&e.code!=='Escape') return false;
 if(!mhState.walkKeys) mhState.walkKeys={};
 const c=e.code,k=e.key;
 let hit=false;
 const touch=(name,on)=>{
  if(on) mhState.walkKeys[name]=true;
  else delete mhState.walkKeys[name];
  hit=true;
 };
 if(c==='KeyA'||c==='ArrowLeft'||k==='a'||k==='A') touch('left',down);
 if(c==='KeyD'||c==='ArrowRight'||k==='d'||k==='D') touch('right',down);
 if(c==='KeyW'||c==='ArrowUp'||k==='w'||k==='W') touch('up',down);
 if(c==='KeyS'||c==='ArrowDown'||k==='s'||k==='S') touch('down',down);
 if(c==='ShiftLeft'||c==='ShiftRight'||k==='Shift') touch('run',down);
 if(down&&(c==='KeyE'||k==='e'||k==='E')){
  mhTryStartMinigame();
  hit=true;
 }
 if(down&&isSpaceKey(e)){
  hit=true;
 }
 if(down&&(c==='KeyF'||k==='f'||k==='F')){
  if(mhState.insideBuilding){ mhExitBuilding(); hit=true; }
  else if(mhState.walkNearBuilding){ mhEnterBuilding(mhState.walkNearBuilding,mhState.world); hit=true; }
 }
 if(down&&(c==='KeyJ'||k==='j'||k==='J')){ mhMayorCrank(-14); hit=true; }
 if(down&&(c==='KeyL'||k==='k'||k==='K')){ mhMayorCrank(14); hit=true; }
 if(down&&(c==='KeyR'||k==='r'||k==='R')&&!mhState.walkKeys?.run){
  const map=MH_WORLD_MAPS[mhState.world];
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  if(mhNearMayorShrine(pos,map)){ mhMayorFlashBeam(); hit=true; }
 }
 if(down&&(c==='Digit1'||c==='Numpad1'||k==='1')){
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseFightAttack(mhState,mhState.save,pos,mhState.world); hit=true;
 }
 if(down&&(c==='Digit2'||c==='Numpad2'||k==='2')){
  const map=MH_WORLD_MAPS[mhState.world];
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseFightPower(mhState,mhState.save,pos,map,mhState.world); hit=true;
 }
 if(down&&(c==='Digit3'||c==='Numpad3'||k==='3')){
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseFightStorm(mhState,mhState.save,pos,mhState.world); hit=true;
 }
 if(down&&(c==='Digit4'||c==='Numpad4'||k==='4')){
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseKingAction4Cutscene(mhState,mhState.save,pos,mhState.world); hit=true;
 }
 if(down&&(c==='KeyT'||k==='t'||k==='T')){
  const ae=document.activeElement;
  if(ae?.id!=='mh-chat-input'&&ae?.id!=='mh-chat-friend-code'){
   document.getElementById('mh-chat-input')?.focus();
   hit=true;
  }
 }
 if(mhState.kingCutscene&&down&&(c==='Escape'||k==='Escape')){
  mhFinishKingAction4Cutscene(mhState,mhState.save); hit=true;
 }
 if(mhState.kingCutscene&&down) hit=true;
 if(hit){
  e.preventDefault();
  e.stopPropagation();
 }
 return hit;
}
function isSpaceKey(e){ return e&&(e.code==='Space'||e.key===' '||e.key==='Spacebar'); }
function mhWalkStop(){
 if(mhState) mhChatStopPoll(mhState);
 if(mhState&&mhState.walkRaf) cancelAnimationFrame(mhState.walkRaf);
 if(mhState) mhState.walkRaf=0;
 document.removeEventListener('keydown',mhWalkKeysDown,true);
 document.removeEventListener('keyup',mhWalkKeysUp,true);
}
function mhWalkKeysDown(e){ mhWalkApplyKey(e,true); }
function mhWalkKeysUp(e){ mhWalkApplyKey(e,false); }
function mhWalkDrawFrame(){
 const st=mhState;
 if(!st||st.tab!=='hunt') return;
 if(st.minigameMorph){ st.walkRaf=requestAnimationFrame(mhWalkDrawFrame); return; }
 const canvas=document.getElementById('mh-walk-canvas');
 if(!canvas){ st.walkRaf=requestAnimationFrame(mhWalkDrawFrame); return; }
 let ctx;
 try{
  ctx=canvas.getContext('2d');
  if(!ctx) throw new Error('no ctx');
 const W=canvas.width,H=canvas.height;
 const nowMs=performance.now();
 const tCut=nowMs/1000;
 const dtCut=Math.min(0.05,(nowMs-(st.lastWalkMs||nowMs))/1000||0.016);
 st.lastWalkMs=nowMs;
 if(st.kingCutscene){
  mhUpdateKingCutscene(st,dtCut);
  mhDrawKingAction4Cutscene(ctx,W,H,st,tCut);
  st.walkRaf=requestAnimationFrame(mhWalkDrawFrame);
  return;
 }
 if(st.insideBuilding){
  const t=performance.now()/1000;
  mhDrawInteriorScreen(ctx,W,H,st,t);
  st.walkRaf=requestAnimationFrame(mhWalkDrawFrame);
  return;
 }
 const wi=st.world;
 const save=st.save;
 const map=MH_WORLD_MAPS[wi];
 const world=MH_WORLDS[wi];
 const pos=mhWalkEnsurePos(st,wi);
 const keys=st.walkKeys||{};
 const t=tCut;
 const dt=dtCut;
 let vx=0,vy=0;
 if(keys.left) vx-=1;
 if(keys.right) vx+=1;
 if(keys.up) vy-=1;
 if(keys.down) vy+=1;
 const running=!!keys.run;
 const moving=!!(vx||vy);
 if(moving){
  const spd=running?MH_RUN_SPEED:MH_WALK_SPEED;
  const len=Math.hypot(vx,vy)||1;
  vx=vx/len*spd; vy=vy/len*spd;
  const npx=pos.px+vx,npy=pos.py+vy;
  if(!mhWalkCollide(map,npx,pos.py,10)) pos.px=npx;
  if(!mhWalkCollide(map,pos.px,npy,10)) pos.py=npy;
  st.walkPhase=(st.walkPhase||0)+(running?0.42:0.26);
  st.playerRunning=running;
 }else{ st.walkPhase=(st.walkPhase||0)*0.9; st.playerRunning=false; }
 const morphs=mhWorldMorphs(wi);
 const near=mhWalkNearMorph(save,wi,pos,st);
 const nearId=near?near.id:null;
 morphs.forEach(m=>{
  if(m.tileX==null) return;
  const np=mhGetNpcPos(st,wi,m);
  if(!mhShouldDrawMapMorph(m,save,Math.hypot(np.px-pos.px,np.py-pos.py),nearId)) return;
  mhNpcWander(st,map,m,mhNpcState(st,wi,m),dt,save);
 });
 mhUpdateCivilians(st,map,wi,dt);
 mhUpdateVoidFx(st,dt);
 mhUpdateFight(st,save,wi,pos);
 st.walkNearId=near?near.id:null;
 st.walkNearBuilding=mhWalkNearBuilding(pos,map);
 if(wi===MH_VOID_WORLD){
  let bv=null,bd=220;
  morphs.forEach(m=>{
   if(m.voidKing||m.rarity!=='voidfallen') return;
   const p=mhGetNpcPos(st,wi,m);
   const d=Math.hypot(p.px-pos.px,p.py-pos.py);
   if(d<bd){ bd=d; bv=m; }
  });
  st.walkNearVoidId=bv?bv.id:null;
 }else st.walkNearVoidId=null;
 const camX=pos.px-W/2,camY=pos.py-H/2;
 const flatMap=mhMapFlat2D(wi);
 ctx.fillStyle=world.bg;
 ctx.fillRect(0,0,W,H);
 let shakeX=0,shakeY=0;
 if(st.voidShakeUntil&&performance.now()<st.voidShakeUntil){
  const mag=st.voidShakeMag||4;
  shakeX=(Math.random()-0.5)*mag*2;
  shakeY=(Math.random()-0.5)*mag*2;
 }
 ctx.save();
 ctx.translate(-camX+shakeX,-camY+shakeY);
 if(flatMap) mhDrawFlatMapTiles(ctx,map,world,wi,t);
 else for(let ty=0;ty<map.h;ty++)for(let tx=0;tx<map.w;tx++){
  const v=map.tiles[ty*map.w+tx];
  const x=tx*MH_TILE,y=ty*MH_TILE;
  mhPaintWorldGroundTile(ctx,x,y,v,world,wi);
  ctx.strokeStyle='rgba(0,0,0,.06)'; ctx.strokeRect(x+.5,y+.5,MH_TILE-1,MH_TILE-1);
 }
 mhDrawMapDecors(ctx,map,wi,t,st.save);
 if(wi===MH_VOID_WORLD) mhDrawVoidAbyssMist(ctx,map,t);
 mhDrawHideoutGroves(ctx,map,pos,wi);
 if(wi===MH_VOID_WORLD) mhDrawVoidThrone(ctx,map);
 mhDrawCivilians(ctx,st,wi,map);
 morphs.sort((a,b)=>mhGetNpcPos(st,wi,a).py-mhGetNpcPos(st,wi,b).py);
 morphs.forEach(m=>{
  if(m.tileX==null) return;
  const npc=mhNpcState(st,wi,m);
  const mx=npc.px, my=npc.py;
  const got=mhHasMorph(save,m.id);
  const dist=Math.hypot(mx-pos.px,my-pos.py);
  if(!mhShouldDrawMapMorph(m,save,dist,nearId)) return;
  if(!mhEnemyAlive(st,wi,m)) return;
  let sc=(m.scale||1)*(flatMap?0.78:0.72);
  if(m.voidKing) sc*=1.35;
  if(MH_1000D&&!flatMap){
   const depth=0.82+(my/(map.h*MH_TILE))*0.32;
   sc*=depth;
  }
  const sil=!got&&dist>MH_INTERACT_R&&m.rarity!=='voidfallen';
  mhPaintNoobWorld(ctx,m,mx,my,sc,got?0.55:1,sil,t,npc.phase,flatMap,!!npc.walking);
  const ehp=mhGetEnemyHp(st,wi,m), emax=mhEnemyMaxHp(m);
  if(ehp<emax||st.enemyAggro[mhEnemyFightKey(wi,m)]>performance.now()){
   mhDrawFightHpBar(ctx,mx,my-92,Math.min(90,14+m.name.length*3),ehp,emax,m.voidKing?'#ff4040':'#c898ff');
  }
  if(st.enemyHitFlash[mhEnemyFightKey(wi,m)]>performance.now()){
   ctx.fillStyle='rgba(255,80,80,.35)'; ctx.beginPath(); ctx.arc(mx,my-24,28,0,Math.PI*2); ctx.fill();
  }
  if(m.voidKing&&dist<240){
   ctx.fillStyle='rgba(0,0,0,.88)'; ctx.fillRect(mx-78,my-98,156,22);
   ctx.fillStyle='#ff4040'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
   ctx.fillText('👑 '+MH_VOID_ABYSS_LABEL+' · KING',mx,my-84);
   ctx.fillStyle='#ffe8a0'; ctx.font='bold 8px system-ui';
   ctx.fillText('⚔ '+(m.voidAttack?.name||'Cleave')+' · ✦ '+(m.voidPower?.name||'Storm'),mx,my-74);
  }
  if(m.rarity==='exotic'){
   ctx.fillStyle='rgba(255,40,200,.85)'; ctx.fillRect(mx-54,my-98,108,14);
   ctx.fillStyle='#fff'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
   ctx.fillText('✦ EXOTIC',mx,my-88);
  }
  if(m.rarity==='voidfallen'&&!m.voidKing&&dist<100){
   ctx.fillStyle='rgba(20,0,40,.85)'; ctx.fillRect(mx-58,my-92,116,16);
   ctx.fillStyle='#c898ff'; ctx.font='bold 8px system-ui'; ctx.textAlign='center';
   ctx.fillText(m.name.slice(0,14),mx,my-82);
  }
  if(dist<MH_INTERACT_R&&!got){
   if(!got){
    ctx.fillStyle='rgba(120,60,200,.85)'; ctx.fillRect(mx-52,my-92,104,12);
    ctx.fillStyle='#e8d0ff'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
    ctx.fillText('⚔ FIGHT',mx,my-84);
   }
   ctx.fillStyle='rgba(0,0,0,.65)'; ctx.fillRect(mx-42,my-78,84,14);
   ctx.fillStyle='#ffe8a0'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
   ctx.fillText('?',mx,my-68);
  }else if(got||dist<MH_INTERACT_R){
   ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(mx-48,my-78,96,14);
   ctx.fillStyle='#fff'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
   ctx.fillText(got?m.name.slice(0,14):'???',mx,my-68);
  }
 });
 mhDrawMapStatues(ctx,map,t,st);
 const wear=mhMorph(save.wearing);
 mhDrawRedBlackPlayerStorm(ctx,st,pos,t);
 mhDrawYouInWorld(ctx,wear,pos,map,t,st.walkPhase||0,wi,st.playerRunning);
 mhDrawChatBubbles(ctx,st,camX,camY);
 mhDrawNpcChatLines(ctx,st,wi,morphs,camX,camY);
 mhDrawVoidFx(ctx,st);
 ctx.restore();
 ctx.fillStyle='rgba(0,0,0,.78)'; ctx.fillRect(8,8,420,78);
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='left';
 ctx.fillText('This map: '+mhWorldRarityHint(wi),16,24);
 ctx.fillStyle='#80ffb0'; ctx.font='bold 11px system-ui,sans-serif';
 ctx.fillText('Search dashed groves · noobies appear when you walk in · E unlock',16,42);
 ctx.fillStyle='#a0c8ff'; ctx.font='bold 11px system-ui,sans-serif';
 ctx.fillText('Epic+ → teleport 💎 · Void → teleport 🕳 (tabs above)',16,56);
 mhEnsureFight(st,save);
 const php=st.fightHp||100, pmax=st.fightMaxHp||100;
 mhDrawFightHpBar(ctx,W-90,18,120,php,pmax,st.fightHitFlash>performance.now()?'#ff8080':'#80ffb0');
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 10px system-ui'; ctx.textAlign='center';
 ctx.fillText('❤ HP '+Math.ceil(php)+'/'+pmax,W-90,32);
 ctx.textAlign='left';
 ctx.fillStyle='#ffb0b0'; ctx.font='bold 10px system-ui';
 const vk=mhVoidCombatMorph(save);
 ctx.fillText(vk?.voidKing?'⚔ 1–3 fight · 🎬 4 king cutscene (axe→sword · void judgment)':'⚔ FIGHT: 1 attack · 2 power · 3 storm — face foes & press keys',16,72);
 if(mhVoidCombatMorph(save)){
  ctx.fillStyle='rgba(20,0,40,.88)'; ctx.fillRect(W/2-190,H-52,380,36);
  ctx.fillStyle='#ffe8a0'; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='center';
  ctx.fillText('🛡 Ancient shields on you · '+MH_ANCIENT_GLYPHS.join(' '),W/2,H-36);
  ctx.font='bold 10px system-ui'; ctx.fillStyle='#c898ff';
  ctx.fillText(MH_ANCIENT_NAMES.join(' · '),W/2,H-22);
 }
 if(st.voidGibberUntil&&performance.now()<st.voidGibberUntil){
  ctx.fillStyle='rgba(40,0,0,.88)'; ctx.fillRect(W/2-150,H-36,300,28);
  ctx.fillStyle='#ff6060'; ctx.font='bold 12px system-ui,sans-serif'; ctx.textAlign='center';
  ctx.fillText('📡 GIBBERLINK · '+String(st.voidGibberText||'rift').slice(0,28),W/2,H-18);
 }
 const pc=mhParkCenter(map);
 if(pc){
  const pd=Math.hypot(pc.px-pos.px,pc.py-pos.py);
  if(pd>120){
   const ang=Math.atan2(pc.py-pos.py,pc.px-pos.px);
   const ax=W/2+Math.cos(ang)*200, ay=H/2+Math.sin(ang)*120;
   ctx.save(); ctx.translate(ax,ay); ctx.rotate(ang);
   ctx.fillStyle='#62b852'; ctx.beginPath(); ctx.moveTo(16,0); ctx.lineTo(-8,-10); ctx.lineTo(-8,10); ctx.closePath(); ctx.fill();
   ctx.fillStyle='#fff'; ctx.font='bold 11px system-ui'; ctx.textAlign='center';
   ctx.fillText('PARK',0,-14);
   ctx.restore();
  }
 }
 if(flatMap&&wi!==MH_VOID_WORLD) mhPaperFlatOverlay(ctx,W,H);
 mhRefreshVoidCombatHud(save);
 if(wi===MH_VOID_WORLD){
  mhVoidFlatScreenOverlay(ctx,W,H);
  ctx.fillStyle='rgba(0,0,0,.78)'; ctx.fillRect(W/2-185,22,370,24);
  ctx.fillStyle='#ff6060'; ctx.font='bold 13px system-ui,sans-serif'; ctx.textAlign='center';
  ctx.fillText('🕳 '+MH_VOID_ABYSS_LABEL+' · '+MH_BUILD+' · rifts · 👑 King',W/2,40);
  if(map.throneTx!=null){
   const tx=map.throneTx*MH_TILE+MH_TILE/2, ty=map.throneTy*MH_TILE+MH_TILE/2;
   const ang=Math.atan2(ty-pos.py,tx-pos.px);
   const ax=W/2+Math.cos(ang)*118, ay=H/2+Math.sin(ang)*72;
   ctx.save(); ctx.translate(ax,ay); ctx.rotate(ang);
   ctx.fillStyle='#ff3030'; ctx.beginPath(); ctx.moveTo(14,0); ctx.lineTo(-6,-8); ctx.lineTo(-6,8); ctx.closePath(); ctx.fill();
   ctx.fillStyle='#ffe8a0'; ctx.font='bold 9px system-ui'; ctx.textAlign='center';
   ctx.fillText('KING',0,-12);
   ctx.restore();
  }
 }
 const hud=document.getElementById('mh-walk-hud');
 if(hud){
  const found=morphs.filter(m=>mhHasMorph(save,m.id)).length;
  hud.querySelector('.mh-walk-zone').textContent=world.emoji+' '+world.name+' · '+found+'/'+morphs.length;
  const prompt=hud.querySelector('.mh-walk-prompt');
  if(st.walkNearBuilding){
   prompt.textContent='Step 2: Press F to enter house (secret code inside)';
   prompt.hidden=false;
  }else if(near){
   const got=mhHasMorph(save,near.id);
   prompt.textContent=got?'E — morph into '+near.name:'Press E — fight or obby to unlock this noobie!';
   prompt.hidden=false;
  }else{
   prompt.textContent='Find a dashed 🕵 Hidden grove — walk inside to reveal noobies';
   prompt.hidden=false;
  }
 }
 }catch(err){
  console.error('[Morph Hunt walk]',err);
 }
 st.walkRaf=requestAnimationFrame(mhWalkDrawFrame);
}
function mhDemoMorph(anim,extra){
 return Object.assign({
  id:'demo-'+anim,
  name:anim,
  head:'#F5CD30',
  torso:'#0085DB',
  legs:'#A4BD47',
  arms:'#F5CD30',
  body:'classic',
  anim,
  face:'smile',
  rarity:'rare',
  scale:1
 },extra||{});
}
function mhRenderPreview(){
 const run=!!mhState.previewRun;
 const flat=!!mhState.previewFlat;
 return `<div class="mh-preview-tab">
  <h3>🎬 Animation preview — everything live</h3>
  <p class="mh-scene-hint">All <b>${MH_ANIMS.length}</b> idle styles · <b>walk</b> vs <b>run</b> leg cycles · 👑 <b>Void Fallen King 5D</b> · flat 2D vs depth</p>
  <div class="mh-preview-tools">
   <button type="button" class="mh-btn${run?'':' primary'}" data-mh-prev-mode="walk">🚶 Walk cycle</button>
   <button type="button" class="mh-btn${run?' primary':''}" data-mh-prev-mode="run">🏃 Run cycle</button>
   <button type="button" class="mh-btn${flat?' primary':''}" data-mh-prev-flat="1">📄 Flat 2D</button>
   <button type="button" class="mh-btn${!flat?' primary':''}" data-mh-prev-flat="0">🧊 Depth / 3D</button>
   <button type="button" class="mh-btn" data-mh-prev-minigame="noobduel">Preview fight / obby</button>
  </div>
  <canvas id="mh-preview-canvas" class="mh-preview-canvas" width="960" height="560" aria-label="Animation preview"></canvas>
  <p class="mh-preview-legend">${MH_ANIMS.map(a=>'<span>'+a+'</span>').join('')} · NPC wander · Hunt unlock = <b>duel</b>, <b>obby</b>, or <b>jump fight</b> (not puzzles)</p>
 </div>`;
}
function mhPreviewStop(){
 if(mhState&&mhState.previewRaf) cancelAnimationFrame(mhState.previewRaf);
 if(mhState) mhState.previewRaf=0;
}
function mhPreviewDrawFrame(){
 const st=mhState;
 if(!st||st.tab!=='preview') return;
 const canvas=document.getElementById('mh-preview-canvas');
 if(!canvas){ st.previewRaf=requestAnimationFrame(mhPreviewDrawFrame); return; }
 const ctx=canvas.getContext('2d');
 if(!ctx){ st.previewRaf=requestAnimationFrame(mhPreviewDrawFrame); return; }
 const W=canvas.width,H=canvas.height;
 const t=performance.now()/1000;
 const run=!!st.previewRun;
 const flat=!!st.previewFlat;
 st.previewPhase=(st.previewPhase||0)+(run?0.042:0.026);
 const phase=st.previewPhase;
 ctx.fillStyle='#0a1018';
 ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
 for(let x=0;x<W;x+=80){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
 for(let y=0;y<H;y+=80){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
 ctx.fillStyle='#ffe8a0'; ctx.font='bold 13px system-ui,sans-serif'; ctx.textAlign='left';
 ctx.fillText('Idle animation styles (each noobie uses one in the wild)',16,24);
 MH_ANIMS.forEach((anim,i)=>{
  const col=i%4,row=Math.floor(i/4);
  const cx=110+col*230,cy=88+row*168;
  ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(cx-52,cy-72,104,150);
  ctx.strokeStyle='rgba(120,180,255,.35)'; ctx.strokeRect(cx-52.5,cy-72.5,104,150);
  const m=mhDemoMorph(anim);
  mhPaintNoobWorld(ctx,m,cx,cy+36,0.82,1,false,t,phase,flat,false);
  ctx.fillStyle='#a8c0e0'; ctx.font='bold 11px system-ui'; ctx.textAlign='center';
  ctx.fillText(anim.toUpperCase(),cx,cy+92);
 });
 ctx.fillStyle='#80e8ff'; ctx.font='bold 14px system-ui'; ctx.textAlign='left';
 ctx.fillText('Movement (same noobie · legs + arms)',16,H-168);
 const move=mhDemoMorph('bounce',{id:'demo-move',name:'Walker'});
 const king=mhMorph('vf-king')||mhDemoMorph('pulse',{voidKing:true,body:'tall',rarity:'voidfallen'});
 ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(40,H-150,200,130); ctx.fillRect(280,H-150,200,130);
 ctx.fillStyle='rgba(40,0,80,.55)'; ctx.fillRect(520,H-150,240,130);
 ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(780,H-150,160,130);
 mhPaintNoobWorld(ctx,move,140,H-78,0.95,1,false,t,phase,flat,false);
 ctx.fillStyle='#b8e8ff'; ctx.font='bold 11px system-ui'; ctx.textAlign='center';
 ctx.fillText('WALK',140,H-28);
 mhPaintNoobWorld(ctx,move,380,H-78,0.95,1,false,t,phase,flat,true);
 ctx.fillStyle='#ffe060'; ctx.fillText('RUN',380,H-28);
 mhPaintNoobWorld(ctx,king,640,H-82,1.05,1,false,t,phase,true,false);
 ctx.fillStyle='#e8d0ff'; ctx.font='bold 10px system-ui';
 ctx.fillText('KING · RED/BLACK ARMOR',640,H-28);
 ctx.fillText('AXE + SHIELD · '+MH_VOID_KING_DEPTH+' DEPTH',640,H-14);
 const flatDemo=mhDemoMorph('sway',{torso:'#0085DB'});
 mhPaintNoobWorld(ctx,flatDemo,860,H-78,0.88,1,false,t,phase,flat,false);
 ctx.fillStyle='#c0d0e0'; ctx.fillText(flat?'FLAT 2D':'3D',860,H-28);
 ctx.fillStyle='rgba(255,232,120,.85)'; ctx.font='bold 12px system-ui'; ctx.textAlign='center';
 ctx.fillText('Build '+MH_BUILD+' · tab updates live',W/2,14);
 st.previewRaf=requestAnimationFrame(mhPreviewDrawFrame);
}
function mhPreviewStart(){
 mhPreviewStop();
 if(!mhState) return;
 mhState.previewPhase=0;
 mhPreviewDrawFrame();
}
function mhWalkStart(){
 mhWalkStop();
 if(!mhState) return;
 if(!mhState.chatChannel) mhState.chatChannel='global';
 if(!mhState.chatSince) mhState.chatSince={global:0,server:0,friend:0};
 mhState.walkKeys={};
 document.addEventListener('keydown',mhWalkKeysDown,true);
 document.addEventListener('keyup',mhWalkKeysUp,true);
 mhChatStartPoll(mhState);
 mhWalkDrawFrame();
 const root=document.getElementById('morphhunt');
 root?.querySelectorAll('[data-mh-dpad]').forEach(btn=>{
  const dir=btn.dataset.mhDpad;
  const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
  const name=map[dir]||dir;
  const down=()=>{ if(!mhState.walkKeys) mhState.walkKeys={}; mhState.walkKeys[name]=true; };
  const up=()=>{ if(mhState?.walkKeys) delete mhState.walkKeys[name]; };
  btn.addEventListener('pointerdown',e=>{ e.preventDefault(); down(); });
  btn.addEventListener('pointerup',up);
  btn.addEventListener('pointerleave',up);
 });
 root?.querySelector('#mh-walk-interact')?.addEventListener('click',()=> mhTryStartMinigame());
 root?.querySelector('#mh-walk-enter')?.addEventListener('click',()=>{
  if(mhState?.insideBuilding) mhExitBuilding();
  else if(mhState?.walkNearBuilding) mhEnterBuilding(mhState.walkNearBuilding,mhState.world);
 });
 root?.querySelector('#mh-walk-run')?.addEventListener('pointerdown',()=>{
  if(!mhState.walkKeys) mhState.walkKeys={};
  mhState.walkKeys.run=true;
 });
 root?.querySelector('#mh-walk-run')?.addEventListener('pointerup',()=>{
  if(mhState?.walkKeys) delete mhState.walkKeys.run;
 });
 const voidAtk=root?.querySelector('#mh-void-atk');
 const voidPow=root?.querySelector('#mh-void-pow');
 if(voidAtk) voidAtk.onclick=()=>{
  if(!mhState?.save) return;
  mhMorphHuntFocusGame();
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseFightAttack(mhState,mhState.save,pos,mhState.world);
 };
 if(voidPow) voidPow.onclick=()=>{
  if(!mhState?.save) return;
  mhMorphHuntFocusGame();
  const map=MH_WORLD_MAPS[mhState.world];
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseFightPower(mhState,mhState.save,pos,map,mhState.world);
 };
 const voidStorm=root?.querySelector('#mh-void-storm');
 const voidCut=root?.querySelector('#mh-void-cutscene');
 if(voidCut) voidCut.onclick=()=>{
  if(!mhState?.save) return;
  mhMorphHuntFocusGame();
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseKingAction4Cutscene(mhState,mhState.save,pos,mhState.world);
 };
 if(voidStorm) voidStorm.onclick=()=>{
  if(!mhState?.save) return;
  mhMorphHuntFocusGame();
  const pos=mhWalkEnsurePos(mhState,mhState.world);
  mhUseFightStorm(mhState,mhState.save,pos,mhState.world);
 };
 const canvas=root?.querySelector('#mh-walk-canvas');
 if(canvas){
  canvas.onclick=mhWalkCanvasClick;
  canvas.addEventListener('pointerdown',()=>{ canvas.blur(); mhMorphHuntBlurPageFocus(); });
 }
}

function mhRenderHuntDeck(save,wi,morphs){
 const pg=mhPaginate(morphs,mhState.huntPage||0,16);
 const cards=pg.slice.map(m=>{
  const got=mhHasMorph(save,m.id);
  const r=mhRarityInfo(m);
  const btn=got?(mhIsOwner()?'🎮 Practice fight':'✓ Owned'):'⚔ Fight / obby';
  return `<button type="button" class="mh-hunt-card${got?' got':''}" data-mh-challenge="${m.id}" style="--mh-rarity:${r.color}">
   <span class="mh-hunt-card-art">${got?`<svg viewBox="0 0 100 130">${mhClassicNoobSvg(m)}</svg>`:'?'}</span>
   <span class="mh-hunt-card-name">${got?m.name:'???'}</span>
   <span class="mh-hunt-card-r">${mhRarityLabel(m)}</span>
   <em class="mh-hunt-card-btn">${btn}</em>
  </button>`;
 }).join('');
 return `<details class="mh-hunt-deck-fold">
  <summary>⚔ Unlock deck — duel / obby / jump-fight (tap a card)</summary>
  <div class="mh-hunt-cards">${cards}</div>
  <div class="mh-pager">${pg.page>0?'<button type="button" class="mh-btn" data-mh-hunt-page="'+(pg.page-1)+'">← Prev</button>':''}<span>Page ${pg.page+1} / ${pg.pages}</span>${pg.page+1<pg.pages?'<button type="button" class="mh-btn" data-mh-hunt-page="'+(pg.page+1)+'">Next →</button>':''}</div>
 </details>`;
}
function mhRenderHunt(save, wi){
 const world=MH_WORLDS[wi];
 const voidCombat=mhVoidCombatMorph(save);
 const morphs=mhWorldMorphs(wi);
 const found=morphs.filter(m=>mhHasMorph(save,m.id)).length;
 const worldTabs=MH_WORLDS.map((w,i)=>{
  const locked=!mhWorldTeleportUnlocked(save,i);
  const done=mhWorldComplete(save,i);
  const tag=i===MH_EXOTIC_WORLD?' Epic+':i===MH_VOID_WORLD?' Void':'';
  return `<button type="button" class="mh-world-tab${i===wi?' on':''}${locked?' locked':''}" data-mh-world="${i}" ${locked?'disabled':''} title="${w.tagline}">${w.emoji} ${w.name}${tag}${done?' ✓':''}</button>`;
 }).join('');
 const tpEpic=wi!==MH_EXOTIC_WORLD?`<button type="button" class="mh-btn primary mh-btn-sm" data-mh-world="${MH_EXOTIC_WORLD}">💎 Teleport Epic+ Map</button>`:'';
 const tpVoid=wi!==MH_VOID_WORLD?`<button type="button" class="mh-btn mh-btn-sm" data-mh-world="${MH_VOID_WORLD}">🕳 Teleport Void Map</button>`:'';
 return `<div class="mh-teleport-bar">
  <span><b>${world.emoji} ${world.name}</b> — ${mhWorldRarityHint(wi)} · ${found}/${morphs.length} here</span>
  <span class="mh-teleport-btns">${tpEpic}${tpVoid}</span>
 </div>
 <div class="mh-world-tabs mh-world-tabs-compact">${worldTabs}</div>
 <div class="mh-hunt-guide">
  <b>Rarity rules</b>
  <ol>
   <li><b>Maps 0–7</b> (Buddy, Fair, Beach…): only <b>Common · Uncommon · Rare</b>. They stay inside <b>🕵 hidden groves</b> (dashed boxes) — not scattered on the whole map.</li>
   <li><b>💎 Epic+ Realm</b> (teleport tab or button): <b>Epic · Legendary · Secret · Exotic · Exclusive</b> — also in groves on that map.</li>
   <li><b>Void Fallen morph</b>: 🎭 Morph tab → <b>1</b> attack · <b>2</b> power on <b>every map</b> (King = red-black storm!). 🕳 Abyss = King + groves.</li>
   <li>Walk into a dashed grove → press <b>E</b> — <b>duel</b> the noobie, run an <b>obby</b>, or <b>counter-fight</b> to unlock. <b>F</b> = big homes.</li>
   <li><b>💬 Chat</b> panel on Hunt: <b>Global</b> · <b>Server</b> (this map) · <b>Friends</b> (share your code). Press <b>T</b> — your noobie talks in speech bubbles!</li>
   <li><b>🏀 Court plaza</b> stays at spawn · <b>4 parks</b> around the map · <b>Mayor statue</b> on court: <b>J/L</b> crank, <b>R</b> flash light at all 4 mirrors → <b>Mayor Noobie</b>!</li>
   <li><b>☣ Plague Doctor</b> — catch striped <b>🐛 bugs</b> (yellow/black or red/black) at <b>every park on every map</b> · <b>E</b> near bug · then <b>Buddy Plaza ☣ PLAGUE LAB</b> (by court): <b>F</b> enter · <b>E</b> ×5 (toxic → airlock → jar → syringe → inject) → <b>Plague Badge</b> + doctor morph with floating cures &amp; ☠!</li>
  </ol>
 </div>
 <div class="mh-walk-wrap mh-walk-with-chat">
  <div class="mh-walk-game">
  <div id="mh-void-combat-readout" class="mh-void-combat-readout">${voidCombat?('⚔ FIGHT · '+voidCombat.voidAttack?.name+' · ✦ '+voidCombat.voidPower?.name+' · 🌌 '+MH_VOID_STORM_NAME):'⚔ FIGHT · <b>1</b> punch · <b>2</b> blast · <b>3</b> slam (Void morph = stronger)'}${wi===MH_VOID_WORLD?' · <b>'+MH_VOID_ABYSS_LABEL+'</b>':''}</div>
  <canvas id="mh-walk-canvas" class="mh-walk-canvas" width="960" height="520" tabindex="-1"></canvas>
  <div id="mh-walk-hud" class="mh-walk-hud mh-walk-hud-clean">
   <span class="mh-walk-zone">${world.emoji} ${world.name} · ${found}/${morphs.length}</span>
   <span class="mh-walk-prompt" hidden>Walk closer</span>
   <button type="button" class="mh-btn primary mh-btn-sm" id="mh-walk-interact">⚔ Fight (E)</button>
   <button type="button" class="mh-btn mh-btn-sm" id="mh-walk-enter">F House</button>
   <button type="button" class="mh-btn mh-btn-sm" id="mh-walk-run">Run</button>
   <button type="button" class="mh-btn mh-btn-sm" id="mh-void-atk">⚔ 1 Attack</button><button type="button" class="mh-btn mh-btn-sm" id="mh-void-pow">✦ 2 Power</button><button type="button" class="mh-btn mh-btn-sm" id="mh-void-storm">🌌 3 Storm</button>   <button type="button" class="mh-btn mh-btn-sm" id="mh-void-cutscene" hidden>🎬 4 Cutscene</button>
  </div>
  </div>
  ${mhRenderChatPanel(save)}
 </div>
 ${mhRenderHuntDeck(save,wi,morphs)}
 <p class="mh-progress">Zone: <b>${found}/${morphs.length}</b> &nbsp;•&nbsp; Total: <b>${save.collected.length}/${MH_TOTAL_COUNT}</b> &nbsp;•&nbsp; 🕳 Void: <b>${save.collected.filter(id=>mhMorph(id)?.rarity==='voidfallen').length}/${MH_VOID_COUNT}</b></p>`;
}

function mhRenderIndex(save){
 const q=mhState.filter||'';
 const kind=mhState.indexKind||'all';
 let list=MH_MORPHS.slice();
 if(kind==='normal') list=MH_NORMALS;
 if(kind==='exclusive') list=MH_EXCLUSIVES;
 if(kind==='exotic') list=MH_EXOTICS;
 if(kind==='void') list=MH_VOID_FALLEN;
 list=mhFilterList(list,q);
 list.sort((a,b)=>a.exclusive!==b.exclusive? (a.exclusive?1:-1) : a.name.localeCompare(b.name));
 const pg=mhPaginate(list,mhState.page||0,48);
 const cards=pg.slice.map(m=>{
  const got=mhHasMorph(save,m.id);
  const r=mhRarityInfo(m);
  return `<div class="mh-codex-card${got?' got':''}" style="--mh-rarity:${r.color}">
   <div class="mh-codex-art">${got?`<svg viewBox="0 0 100 130">${mhClassicNoobSvg(m)}</svg>`:'<div class="mh-silhouette">?</div>'}</div>
   <div class="mh-codex-meta"><b class="mh-noob-name">${got?m.name:'???'}</b><span class="mh-codex-rarity">${mhRarityLabel(m)}${got?'':' · ⚔ fight/obby unlock'}</span></div>
  </div>`;
 }).join('');
 return `<div class="mh-index">
  <h3>📖 Noobie Index</h3>
  <div class="mh-index-tools">
   <button type="button" class="mh-filter${kind==='all'?' on':''}" data-mh-kind="all">All ${MH_TOTAL_COUNT}</button>
   <button type="button" class="mh-filter${kind==='normal'?' on':''}" data-mh-kind="normal">Normal ${MH_NORMAL_COUNT}</button>
   <button type="button" class="mh-filter${kind==='exclusive'?' on':''}" data-mh-kind="exclusive">Exclusive ${MH_EXCLUSIVE_COUNT}</button>
   <button type="button" class="mh-filter${kind==='exotic'?' on':''}" data-mh-kind="exotic">💎 Exotic ${MH_EXOTIC_COUNT}</button>
   <button type="button" class="mh-filter${kind==='void'?' on':''}" data-mh-kind="void">🕳 Male Void ${MH_VOID_COUNT}</button>
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
   <svg viewBox="0 0 100 130">${mhClassicNoobSvg(m)}</svg><span>${m.name}</span>${(m.rarity==='voidfallen'||m.voidFallen)?`<small class="mh-morph-void-moves">⚔ ${m.voidAttack?.name||'?'} · ✦ ${m.voidPower?.name||'?'}</small>`:''}${on?'<em>Morphed</em>':'<em>Tap to morph</em>'}
  </button>`;
 }).join('');
 const wear=mhMorph(save.wearing);
 return `<div class="mh-morph-tab">
  <h3>🎭 Morph &amp; Roleplay</h3>
  <p class="mh-scene-hint">Turn into any noobie you own — your morph also shows on the Rock Teacher!</p>
  <div class="mh-morph-preview large">${wear?`<svg viewBox="0 0 100 130">${mhClassicNoobSvg(wear)}</svg><b>${wear.name}</b>${(wear.rarity==='voidfallen'||wear.voidFallen)?`<p class="mh-scene-hint" style="color:${wear.voidKing?'#ff6060':'#c898ff'}">Any map · <b>1</b> ⚔ ${wear.voidAttack?.name||'Attack'} · <b>2</b> ✦ ${wear.voidPower?.name||'Power'} · <b>3</b> 🌌 ${MH_VOID_STORM_NAME}${wear.voidKing?' · 👑 universe rift king · <b>4</b> 🎬 cutscene':' · 🕳 void storm aura'}</p>`:''}<button type="button" class="mh-btn primary" data-mh-wear="${wear.id}">Stay morphed</button>`:'<span>Pick a noobie below</span>'}</div>
  <input type="search" id="mh-search" placeholder="Search your morphs…" value="${q.replace(/"/g,'&quot;')}"/>
  <div class="mh-morph-grid">${cards}</div>
  <div class="mh-pager">${pg.page>0?'<button type="button" class="mh-btn" data-mh-page="'+(pg.page-1)+'">←</button>':''}<span>${pg.page+1}/${pg.pages}</span>${pg.page+1<pg.pages?'<button type="button" class="mh-btn" data-mh-page="'+(pg.page+1)+'">→</button>':''}</div>
 </div>`;
}

function mhRenderGacha(save){
 return `<div class="mh-gacha-tab">
  <h3>🎲 Noobie Gacha</h3>
  <p class="mh-scene-hint">Normal pool: ${MH_NORMAL_COUNT} · Exclusive pool: ${MH_EXCLUSIVE_COUNT}</p>
  <p class="mh-scene-hint" style="color:#80ffb0">🏠 House codes (press F inside buildings): <b>GLITCHHOUSE</b> · <b>MYTHINSIDE</b> · <b>MINIGAMEVAULT</b> · <b>ENTERHOUSE</b> (coins)</p>
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
 mhBindIdeHint(root);
 root.querySelector('#mh-leave')?.addEventListener('click',mhClose);
 root.querySelectorAll('[data-mh-id]').forEach(btn=>btn.addEventListener('click',()=>mhCollect(btn.dataset.mhId)));
 root.querySelectorAll('[data-mh-world]').forEach(btn=>btn.addEventListener('click',()=>{ mhState.huntPage=0; mhSetWorld(+btn.dataset.mhWorld); }));
 root.querySelectorAll('[data-mh-challenge]').forEach(btn=>btn.addEventListener('click',()=>mhDeckUnlock(mhMorph(btn.dataset.mhChallenge),mhState.save)));
 root.querySelectorAll('[data-mh-hunt-page]').forEach(btn=>btn.addEventListener('click',()=>{ mhState.huntPage=+btn.dataset.mhHuntPage; mhRender(); }));
 root.querySelectorAll('[data-mh-tab]').forEach(btn=>mhTabNoFocusRing(btn,()=>mhSetTab(btn.dataset.mhTab)));
 root.querySelectorAll('[data-mh-prev-mode]').forEach(btn=>btn.addEventListener('click',()=>{
  mhState.previewRun=btn.dataset.mhPrevMode==='run';
  mhRender();
 }));
 root.querySelectorAll('[data-mh-prev-flat]').forEach(btn=>btn.addEventListener('click',()=>{
  mhState.previewFlat=btn.dataset.mhPrevFlat==='1';
  mhRender();
 }));
 root.querySelector('[data-mh-prev-minigame]')?.addEventListener('click',()=>{
  const demo=mhMorph('vf-king')||mhDemoMorph('pulse');
  mhOpenMinigame(demo);
 });
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
 mhBindChat(root);
 root.querySelectorAll('button').forEach(btn=>{
  if(btn.id==='mh-chat-input') return;
  btn.addEventListener('mousedown',e=>{ if(e.button===0) e.preventDefault(); });
 });
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
 else if(tab==='preview') body=mhRenderPreview();

 root.innerHTML=`<div class="mh-panel mh-ftn">
  ${mhIdePreviewHintHtml()}
  <header class="mh-ftn-banner">
   <div class="mh-ftn-banner-text">
    <h2 class="mh-title">Find The Noobies Morphs</h2>
    <p class="mh-ftn-tag"><b>${MH_TOTAL_COUNT}</b> noobies · ${MH_SCENERY_STAMP} · parks + statues · <b>F</b> houses · Build <b>${MH_BUILD}</b>${owner?' · Owner unlocked':''}</p>
   </div>
  </header>
  <div class="mh-head">
   <div class="mh-tabs">
    <button type="button" class="mh-tab${tab==='hunt'?' on':''}" data-mh-tab="hunt">🗺️ Hunt</button>
    <button type="button" class="mh-tab${tab==='index'?' on':''}" data-mh-tab="index">📖 Index</button>
    <button type="button" class="mh-tab${tab==='morph'?' on':''}" data-mh-tab="morph">🎭 Morph</button>
    <button type="button" class="mh-tab${tab==='gacha'?' on':''}" data-mh-tab="gacha">🎲 Gacha</button>
    <button type="button" class="mh-tab${tab==='preview'?' on':''}" data-mh-tab="preview">🎬 Animations</button>
   </div>
   <div class="mh-head-stats">
    <span class="mh-coins">💰 <b>${save.coins}</b></span>
    <span>${MH_TOTAL_COUNT} · 🕳 <b>${save.collected.filter(id=>mhMorph(id)?.rarity==='voidfallen').length}</b>/${MH_VOID_COUNT} Void Fallen</span>
    ${owner?'<span class="mh-owner-tag">Owner — all '+MH_MORPHS.length+' unlocked</span>':''}
    <button type="button" class="mh-btn ghost" id="mh-leave">Leave</button>
   </div>
  </div>
  <div class="mh-main ftn">${body}</div>
  ${mhIdeHintRestoreLink()}
  <div id="mh-toast" class="mh-toast"></div>
 </div>`;
 mhBind(root);
 mhMorphHuntBlurPageFocus();
 if(save.wearing) mhSaveWearId(save.wearing);
 mhWalkStop();
 mhPreviewStop();
 if(tab==='hunt'){
  mhWalkStart();
  mhMorphHuntFocusGame();
 }else if(tab==='preview'){
  mhPreviewStart();
 }
}

function mhSyncMorphHuntUrl(){
 try{
  const u=new URL(location.href);
  u.searchParams.set('mh',MH_BUILD);
  u.searchParams.set('t',String(Date.now()));
  if(!u.hash) u.hash='morphhunt';
  history.replaceState(null,'',u.toString());
 }catch(_){}
}
function playMorphHunt(){
 mhSyncMorphHuntUrl();
 mhClose();
 mhMorphHuntBindModal();
 mhEnsureOverlayModals();
 if(typeof lithosCloseGameOverlays==='function'){ try{lithosCloseGameOverlays({keepMorphHunt:true});}catch(_){} }
 if(typeof closeGamesHub==='function'){ try{ closeGamesHub({skipHash:true}); }catch(_){} }
 mhMorphHuntHideSiteChrome();
 mhState={save:mhLoadSave(),world:0,tab:'hunt',page:0,huntPage:0,filter:'',indexKind:'all',walkPos:{},enemyHp:{},enemyAggro:{},enemyRespawnAt:{},enemyLastHit:{},enemyHitFlash:{},chatChannel:'global',chatSince:{global:0,server:0,friend:0},chatBubbles:[],chatNpcLine:{}};
 const wrap=document.createElement('div');
 wrap.id='morphhunt';
 wrap.setAttribute('role','application');
 wrap.setAttribute('aria-label','Find The Noobies Morph Hunt');
 document.body.appendChild(wrap);
 mhMorphHuntInertBackground(true);
 mhMorphHuntBodyLock(true);
 mhMorphHuntShieldSiteInput();
 try{ mhRender(); }
 catch(err){
  console.error('[Morph Hunt render]',err);
  wrap.innerHTML=`<div class="mh-panel mh-ftn" style="padding:24px;text-align:center;max-width:440px;margin:auto">
   <h2 style="color:#ff8080">Morph Hunt could not start</h2>
   <p style="color:#e0e8f0;line-height:1.5">Try a hard refresh. Build <b>${MH_BUILD}</b></p>
   <button type="button" class="mh-btn primary" onclick="location.href=location.pathname+'?mh=${MH_BUILD}&t='+Date.now()+'#morphhunt'">Reload</button>
   <button type="button" class="mh-btn ghost" id="mh-leave">Leave</button>
  </div>`;
  wrap.querySelector('#mh-leave')?.addEventListener('click',mhClose);
  if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
  return;
 }
 if(!document.getElementById('mh-walk-canvas')){
  wrap.innerHTML=`<div class="mh-panel mh-ftn" style="padding:24px;text-align:center;max-width:420px;margin:auto">
   <h2 style="color:#ff8080">Old Lithos saved in your browser</h2>
   <p style="color:#e0e8f0;line-height:1.5">The new <b>walk-around</b> Morph Hunt did not load. Hard refresh:</p>
   <p style="color:#ffe8a0;font-weight:900">Mac: Cmd+Shift+R · Windows: Ctrl+Shift+R</p>
   <p style="color:#a0a8b8;font-size:13px">Need build <b>${MH_BUILD}</b> and stamp <b>${MH_KING_STAMP}</b></p>
   <button type="button" class="mh-btn primary" onclick="location.href=location.pathname+'?morph=${MH_BUILD}&t='+Date.now()+'#morphhunt'">Reload fresh copy</button>
  </div>`;
  if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
  return;
 }
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
 mhMorphHuntBlurPageFocus();
 if(mhLikelyIdePreview()){
  mhToast('💡 Big blue ring outside the game? Open “Safari/Chrome ↗” in the yellow box — Cursor preview focus, not Lithos · '+MH_BUILD);
 }else{
  mhToast('⚔ WASD move · E fight · Build '+MH_BUILD);
 }
}

function mhGetWearingMorph(){ return mhMorph(mhLoadWearId()||window.LITHOS_NOOBIE_WEAR); }

window.playMorphHunt=playMorphHunt;
window.LITHOS_MH_BUILD=MH_BUILD;
window.LITHOS_MH_KING_STAMP=MH_KING_STAMP;
window.mhClose=mhClose;
window.mhRedeemMorphCode=mhRedeemCode;
window.mhGetWearingMorph=mhGetWearingMorph;
window.mhClassicNoobSvg=mhClassicNoobSvg;
window.mhRefreshTeacherNoob=mhRefreshTeacherNoob;

document.addEventListener('DOMContentLoaded',()=>{ mhRefreshTeacherNoob(); });
if(document.readyState!=='loading') mhRefreshTeacherNoob();
})();
