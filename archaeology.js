// ===== STRATUM — Lithos Archaeology Hub & Games =====
let archBuilt=false;

const ARCH_SITES=[
 {id:'valley',name:'Sunrise Valley',era:'Bronze Age',region:'Anatolia',emoji:'🏺',desc:'Terracotta storage jars and a collapsed kiln — trade routes crossed here 3,000 years ago.'},
 {id:'temple',name:'Temple of Obsidian',era:'Classical',region:'Mesoamerica',emoji:'🗿',desc:'Obsidian blades, jade beads, and a buried stairway to a ritual platform.'},
 {id:'cave',name:'Painted Cave',era:'Upper Paleolithic',region:'Europe',emoji:'🦴',desc:'Charcoal bison, hand stencils, and bone tools frozen in limestone.'},
 {id:'ship',name:'Harbor Wreck',era:'Iron Age',region:'Mediterranean',emoji:'⚓',desc:'Amphorae, anchors, and copper ingots — a merchant ship lost in a storm.'},
 {id:'tomb',name:'Sand Tomb',era:'New Kingdom',region:'North Africa',emoji:'👑',desc:'Gold leaf, lapis inlay, and linen-wrapped figures in a sealed chamber.'},
 {id:'fort',name:'Hill Fort',era:'Medieval',region:'British Isles',emoji:'🏰',desc:'Ring ditch, iron nails, and pottery sherds from a hilltop settlement.'}
];

const ARCH_GAMES=[
 {id:'dig',emoji:'🪏',name:'Trowel Dig',desc:'Grid dig — find every artifact before your energy runs out.',action:'dig'},
 {id:'memory',emoji:'🧩',name:'Artifact Memory',desc:'Flip cards and match pottery, tools, and bones.',action:'memory'},
 {id:'strat',emoji:'📚',name:'Layer Stack',desc:'Put geological layers in order — oldest at the bottom.',action:'strat'},
 {id:'hunt',emoji:'🗺️',name:'Field Scavenger Hunt',desc:'Lithos scavenger hunt — real specimens hidden across the catalog.',action:'hunt',external:true},
 {id:'identify',emoji:'🔍',name:'Identify a Find',desc:'Upload or describe a rock — get a field ID from the catalog teacher.',action:'identify',external:true}
];

function closeArchGame(){
 const w=document.getElementById('arch-game');
 if(w)w.remove();
 document.body.classList.remove('arch-playing');
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
 if(typeof lithos8bitSync==='function')lithos8bitSync();
}

function archEsc(e){
 if(e.key==='Escape')closeArchGame();
}

function archShell(title,inner){
 return `<div class="arch-game-panel">
  <div class="arch-game-top"><span>${title}</span><button type="button" class="arch-game-close" onclick="closeArchGame()">✕</button></div>
  <div class="arch-game-body">${inner}</div>
 </div>`;
}

function launchArchGame(action){
 if(action==='hunt'){closeArchGame();if(typeof switchView==='function')switchView('hunt');return;}
 if(action==='identify'){closeArchGame();if(typeof switchView==='function')switchView('identify');return;}
 if(action==='dig')playArchDig();
 else if(action==='memory')playArchMemory();
 else if(action==='strat')playArchStrat();
}

/* ---- Trowel Dig ---- */
function playArchDig(){
 const size=6,artifacts=6,energy=14;
 const cells=Array(size*size).fill(null).map((_,i)=>({i,dug:false,art:false}));
 const spots=new Set();
 while(spots.size<artifacts){
  spots.add(Math.floor(Math.random()*cells.length));
 }
 spots.forEach(i=>{cells[i].art=true;});
 let left=energy,found=0,msg='Tap squares to dig. Find all '+artifacts+' artifacts!';
 function render(){
  const grid=cells.map(c=>{
   let cls='arch-dig-cell';
   if(c.dug)cls+=c.art?' found':' empty';
   return `<button type="button" class="${cls}" data-i="${c.i}" ${c.dug?'disabled':''}>${c.dug?(c.art?'🏺':'·'):'🟫'}</button>`;
  }).join('');
  const win=found>=artifacts;
  const lose=left<=0&&found<artifacts;
  document.getElementById('arch-game-inner').innerHTML=`
   <p class="arch-game-msg">${win?'All artifacts cataloged!':lose?'Site collapsed — try again.':msg}</p>
   <div class="arch-dig-stats"><span>🔋 ${left} digs</span><span>🏺 ${found}/${artifacts}</span></div>
   <div class="arch-dig-grid" style="--cols:${size}">${grid}</div>
   ${win||lose?`<button type="button" class="arch-btn wide" onclick="playArchDig()">${win?'Dig Again':'Retry'}</button>`:''}`;
  document.querySelectorAll('.arch-dig-cell:not([disabled])').forEach(btn=>{
   btn.onclick=()=>{
    const i=+btn.dataset.i;
    if(cells[i].dug||left<=0)return;
    cells[i].dug=true;left--;
    if(cells[i].art){found++;msg='Artifact! Keep digging…';try{if(typeof SFX!=='undefined'&&SFX.code)SFX.code();}catch(_){}}
    else msg='Empty layer…';
    render();
   };
  });
 }
 closeArchGame();
 const wrap=document.createElement('div');
 wrap.id='arch-game';
 wrap.innerHTML=archShell('🪏 Trowel Dig','<div id="arch-game-inner"></div>');
 document.body.appendChild(wrap);
 document.body.classList.add('arch-playing');
 document.addEventListener('keydown',archEsc);
 render();
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
}

/* ---- Artifact Memory ---- */
function playArchMemory(){
 const icons=['🏺','🗿','⚱️','🦴','🪙','⚒️','📿','🏹'];
 const deck=[...icons,...icons].sort(()=>Math.random()-.5).map((icon,i)=>({id:i,icon,up:false,matched:false}));
 let picks=[],lock=false,moves=0;
 function render(){
  const done=deck.every(c=>c.matched);
  document.getElementById('arch-game-inner').innerHTML=`
   <p class="arch-game-msg">${done?'Every pair logged in the field journal!':'Match all artifact pairs.'}</p>
   <div class="arch-mem-stats">Moves: ${moves}</div>
   <div class="arch-mem-grid">${deck.map(c=>`<button type="button" class="arch-mem-card ${c.matched?'matched':''} ${c.up?'up':''}" data-id="${c.id}" ${c.matched||lock?'disabled':''}>${c.up||c.matched?c.icon:'?'}</button>`).join('')}</div>
   ${done?`<button type="button" class="arch-btn wide" onclick="playArchMemory()">Play Again</button>`:''}`;
  document.querySelectorAll('.arch-mem-card:not([disabled])').forEach(btn=>{
   btn.onclick=()=>{
    if(lock)return;
    const c=deck.find(x=>x.id===+btn.dataset.id);
    if(!c||c.up||c.matched)return;
    c.up=true;picks.push(c);
    if(picks.length===2){
     moves++;lock=true;
     const[a,b]=picks;
     if(a.icon===b.icon){a.matched=b.matched=true;picks=[];lock=false;try{if(typeof SFX!=='undefined'&&SFX.code)SFX.code();}catch(_){}}
     else setTimeout(()=>{a.up=b.up=false;picks=[];lock=false;render();},700);
    }
    render();
   };
  });
 }
 closeArchGame();
 const wrap=document.createElement('div');
 wrap.id='arch-game';
 wrap.innerHTML=archShell('🧩 Artifact Memory','<div id="arch-game-inner"></div>');
 document.body.appendChild(wrap);
 document.body.classList.add('arch-playing');
 document.addEventListener('keydown',archEsc);
 render();
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
}

/* ---- Layer Stack ---- */
function playArchStrat(){
 const correct=[
  {id:'bedrock',label:'Bedrock',emoji:'🪨',hint:'Oldest — solid stone'},
  {id:'roman',label:'Roman Floor',emoji:'🧱',hint:'2,000-year-old tiles'},
  {id:'ash',label:'Ash Layer',emoji:'🌋',hint:'Volcanic eruption debris'},
  {id:'top',label:'Modern Topsoil',emoji:'🌱',hint:'Newest — plants grow here'}
 ];
 let layers=[...correct].sort(()=>Math.random()-.5);
 function solved(){
  return layers.every((l,i)=>l.id===correct[i].id);
 }
 function render(){
  const win=solved();
  document.getElementById('arch-game-inner').innerHTML=`
   <p class="arch-game-msg">${win?'Perfect stratigraphy! Oldest at the bottom.':'Tap two layers to swap them into chronological order (oldest ↓ bottom).'}</p>
   <div class="arch-strat-stack">${layers.map((l,idx)=>`<button type="button" class="arch-strat-layer" data-i="${idx}"><span class="arch-strat-emoji">${l.emoji}</span><span class="arch-strat-label">${l.label}</span><span class="arch-strat-hint">${l.hint}</span></button>`).join('')}</div>
   ${win?`<button type="button" class="arch-btn wide" onclick="playArchStrat()">New Site</button>`:''}`;
  let sel=null;
  document.querySelectorAll('.arch-strat-layer').forEach(btn=>{
   btn.onclick=()=>{
    const i=+btn.dataset.i;
    if(sel===null){sel=i;btn.classList.add('picked');return;}
    if(sel===i){btn.classList.remove('picked');sel=null;return;}
    const tmp=layers[sel];layers[sel]=layers[i];layers[i]=tmp;
    sel=null;render();
   };
  });
 }
 closeArchGame();
 const wrap=document.createElement('div');
 wrap.id='arch-game';
 wrap.innerHTML=archShell('📚 Layer Stack','<div id="arch-game-inner"></div>');
 document.body.appendChild(wrap);
 document.body.classList.add('arch-playing');
 document.addEventListener('keydown',archEsc);
 render();
 if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
}

function buildArchaeologyHub(){
 const sitesEl=document.getElementById('arch-sites-grid');
 const gamesEl=document.getElementById('arch-games-grid');
 if(!sitesEl||!gamesEl)return;
 const esc=typeof escapeHtml==='function'?escapeHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
 sitesEl.innerHTML=ARCH_SITES.map(s=>`
  <article class="arch-site-card">
   <div class="arch-site-emoji">${s.emoji}</div>
   <div class="arch-site-era">${esc(s.era)} · ${esc(s.region)}</div>
   <h3>${esc(s.name)}</h3>
   <p>${esc(s.desc)}</p>
  </article>`).join('');
 gamesEl.innerHTML=ARCH_GAMES.map(g=>`
  <div class="arch-game-card">
   <div class="arch-game-emoji">${g.emoji}</div>
   <div class="arch-game-name">${esc(g.name)}</div>
   <p class="arch-game-desc">${esc(g.desc)}</p>
   <button type="button" class="arch-btn play" data-arch-game="${g.action}">${g.external?'Open →':'▶ Play'}</button>
  </div>`).join('');
 if(!archBuilt){
  gamesEl.addEventListener('click',e=>{
   const btn=e.target.closest('[data-arch-game]');
   if(!btn)return;
   launchArchGame(btn.dataset.archGame);
  });
  archBuilt=true;
 }
}
