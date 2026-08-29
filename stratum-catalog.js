// ===== STRATUM catalog — swap gems for bones & ancient artifacts =====
(function(){
 if(!window.LITHOS_STRATUM||typeof ARTIFACTS==='undefined')return;

 GEMS=ARTIFACTS;

 window.STRATUM_FILTER_GROUPS=[
  {label:"Browse",items:[
   {label:"Field catalog",test:g=>['bone','fossil','pottery','tool','art','monument','burial'].includes(g.kind)},
   {label:"Bones & fossils",test:g=>g.kind==='bone'||g.kind==='fossil'},
   {label:"All artifacts",test:()=>true},
   {label:"Pottery",test:g=>g.kind==='pottery'},
   {label:"Tools & weapons",test:g=>g.kind==='tool'},
   {label:"Burial goods",test:g=>g.kind==='burial'}
  ]},
  {label:"Period",items:[
   {label:"Paleolithic",test:g=>/Paleolithic|Paleolithic|Ice Age|\d+\s*ka|Ma ·/i.test(g.system+' '+g.desc)&&!/BCE|CE/i.test(g.system)},
   {label:"Bronze & Iron Age",test:g=>/Bronze|Iron Age|BCE/i.test(g.system+' '+g.class)},
   {label:"Classical empires",test:g=>/Roman|Greek|Egypt|Mesopotam|Persia|Byzantine/i.test(g.system+' '+g.class+' '+g.origins.join(' '))},
   {label:"Medieval & later",test:g=>/Medieval|medieval|\d+th c\.|CE|Inca|Aztec|Mayan|Angkor|Viking/i.test(g.system+' '+g.class+' '+g.desc)}
  ]},
  {label:"Special",items:[
   {label:"Monuments",test:g=>g.kind==='monument'},
   {label:"Rock & cave art",test:g=>/Rock art|Cave|Paleolithic art|Petroglyph/i.test(g.class+' '+g.name)},
   {label:"Mummies",test:g=>/Mummy|mummy|Bog Body|Iceman|burial/i.test(g.name+' '+g.class+' '+g.desc)}
  ]}
 ];

 window.STRATUM_SCAVENGER=[
  {id:1,clue:'The king of dinosaurs — a thigh bone from Montana.',artifact:'Tyrannosaurus Femur',hint:'Theropod · Cretaceous'},
  {id:2,clue:'Ice Age ivory curved like a scimitar — found in Siberian permafrost.',artifact:'Mammoth Tusk',hint:'Proboscidean · Pleistocene'},
  {id:3,clue:'Our extinct cousins — thick-browed skull from European caves.',artifact:'Neanderthal Skull Cap',hint:'Paleoanthropology'},
  {id:4,clue:'Segmented sea creatures that ruled for 270 million years.',artifact:'Trilobite',hint:'Paleozoic marine'},
  {id:5,clue:'Coiled shells of extinct squid — "snake stones" in medieval England.',artifact:'Ammonite',hint:'Cephalopod fossil'},
  {id:6,clue:'First Americans\' fluted projectile — fluted base for hafting.',artifact:'Atlatl Spear Point',hint:'Clovis · Paleoindian'},
  {id:7,clue:'Jars holding embalmed organs — four sons of Horus on the lids.',artifact:'Egyptian Canopic Jar',hint:'New Kingdom Egypt'},
  {id:8,clue:'Red figures on black gloss — Classical Athens masters.',artifact:'Greek Red-Figure Vase',hint:'Attic pottery'},
  {id:9,clue:'3.6-metre Aztec calendar of the sun god Tonatiuh.',artifact:'Aztec Sun Stone',hint:'Postclassic Mexica'},
  {id:10,clue:'Copper Age hunter frozen 5,300 years in alpine ice.',artifact:'Ötzi the Iceman (replica kit)',hint:'Glacial preservation'},
  {id:11,clue:'Bronze gears from a shipwreck — ancient Greek computer.',artifact:'Antikythera Mechanism Gear',hint:'Hellenistic · wreck'},
  {id:12,clue:'Life-size soldiers guarding China\'s first emperor.',artifact:'Terracotta Warrior',hint:'Qin dynasty · Xi\'an'}
 ];

 function stratumPhotoHTML(g){
  if(g.emoji){
   const c2=g.colorHex&&g.colorHex[1]?g.colorHex[1]:g.stone;
   return `<div class="photo stratum-emoji-photo" style="background:linear-gradient(145deg,${g.stone},${c2});display:flex;align-items:center;justify-content:center;font-size:clamp(48px,12vw,72px);line-height:1" aria-hidden="true">${g.emoji}</div>`;
  }
  return `<div class="photo"><img alt="${g.name}" loading="lazy"
 onload="this.classList.add('loaded')"
 onerror="if(!this.dataset.fb){this.dataset.fb=1;this.parentNode.innerHTML='<div class=\\'stratum-emoji-photo\\' style=\\'display:flex;align-items:center;justify-content:center;font-size:64px;height:100%;background:${g.stone}\\'>${g.emoji||'🏺'}</div>'}"
 src="${g.img}"></div>`;
 }

 window.stratumInitCatalog=function(){
  if(!window.LITHOS_STRATUM)return;

  if(typeof renderCard==='function'){
   window._lithosRenderCard=renderCard;
   window.renderCard=function(g,i,realIdx){
    const el=document.createElement('button');
    el.className='card';
    el.style.setProperty('--stone',g.stone);
    el.style.setProperty('--glow',g.glow);
    el.style.animationDelay=(Math.min(i,40)*25)+'ms';
    el.onclick=()=>openDrawer(realIdx);
    el.innerHTML=`
 <span class="idx">${String(realIdx+1).padStart(2,'0')}</span>
 ${stratumPhotoHTML(g)}
 <div class="body">
 <div class="name">${g.name}</div>
 <div class="tags"><span class="klass">${g.class}</span></div>
 <div class="formula">${g.formula}</div>
 <div class="price">${g.price}</div>
 <div class="quick">
 <div><div class="k">Period</div><div class="v">${(g.system||'').split('·')[0].trim()}</div></div>
 <div><div class="k">Preservation</div><div class="v">${g.mohs}/10</div></div>
 <div><div class="k">Site</div><div class="v">${g.origins[0]||'—'}</div></div>
 </div>
 </div>`;
    return el;
   };
  }

  if(typeof openDrawer==='function'){
   window._lithosOpenDrawer=openDrawer;
   window.openDrawer=function(i){
    const g=GEMS[i];
    if(typeof lithosScavengerMarkFound==='function'){
     const item=(window.STRATUM_SCAVENGER||[]).find(s=>s.artifact===g.name);
     if(item){
      const key='lithos_scavenger_v1';
      try{
       const found=JSON.parse(localStorage.getItem(key)||'[]');
       if(!found.includes(item.id)){found.push(item.id);localStorage.setItem(key,JSON.stringify(found));if(activeView==='hunt'&&typeof buildScavengerHunt==='function')buildScavengerHunt();}
      }catch(_){}
     }
    }
    drawer.style.setProperty('--stone',g.stone);
    const photoBlock=g.emoji
     ?`<div class="d-photo stratum-emoji-photo" style="background:linear-gradient(145deg,${g.stone},${g.colorHex&&g.colorHex[1]||g.stone});display:flex;align-items:center;justify-content:center;font-size:120px">${g.emoji}</div>`
     :`<div class="d-photo"><img alt="${g.name}" onload="this.classList.add('loaded')" onerror="this.parentNode.innerHTML='<div style=\\'font-size:100px;text-align:center;padding:40px\\'>${g.emoji||'🏺'}</div>'" src="${g.img}"></div>`;
    drawer.innerHTML=`
 <button type="button" class="close" onclick="closeDrawer()" aria-label="Close"></button>
 ${photoBlock}
 <div class="hero-band">
  <div class="d-eyebrow">Find № ${String(i+1).padStart(2,'0')} · ${g.class}</div>
  <div class="d-name">${g.name}</div>
  <div class="d-formula">${g.formula}</div>
  <div class="d-badges"><span class="badge">${g.kind}</span><span class="badge">${g.system.split('·')[0].trim()}</span></div>
  <div class="d-price">${g.price}</div>
 </div>
 <div class="content">
  <p class="desc">${g.desc}</p>
  <div class="section-label">Field Record</div>
  <div class="props">
   <div class="prop"><div class="k">Catalog Status</div><div class="v">${g.price}</div></div>
   <div class="prop"><div class="k">Preservation Index</div><div class="v">${g.mohs} / 10</div>
   <div class="mohs-track"><span style="width:${g.mohs*10}%"></span></div></div>
   <div class="prop"><div class="k">Period / Age</div><div class="v">${g.system}</div></div>
   <div class="prop"><div class="k">Material</div><div class="v">${g.formula}</div></div>
   <div class="prop"><div class="k">Category</div><div class="v">${g.class}</div></div>
  </div>
  <p class="price-note">Stratum catalog entries document bones, fossils, pottery, tools, and monuments — not gemstones. Visit Lithos for the mineral collection.</p>
  <div class="section-label">Material &amp; Color</div>
  <div class="colorways">${g.colorHex.map((h,n)=>`<div class="cw"><i style="background:${h}"></i>${g.colors[n]||g.colors[0]}</div>`).join('')}</div>
  <div class="section-label">Excavation Sites</div>
  <div class="origins">${g.origins.map(o=>`<span class="o">${o}</span>`).join('')}</div>
 </div>`;
    overlay.classList.add('open');
    if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
   };
  }

  if(typeof syncCatalogCount==='function'){
   window._lithosSyncCatalogCount=syncCatalogCount;
   window.syncCatalogCount=function(shown,total){
    const filter=filterDefs[activeFilter];
    const lab=filter.label;
    if(lab==='Field catalog'&&!query){countEl.textContent=`${shown.toLocaleString('en-US')} artifacts shown · curated excavation catalog`;return;}
    if(lab==='All artifacts'&&!query){countEl.textContent=`${total.toLocaleString('en-US')} artifacts in collection`;return;}
    if(lab==='Bones & fossils'&&!query){countEl.textContent=`${shown.toLocaleString('en-US')} bones & fossils shown`;return;}
    countEl.textContent=`${shown.toLocaleString('en-US')} of ${total.toLocaleString('en-US')} shown · ${typeof catalogFilterLabel==='function'?catalogFilterLabel(lab):lab}${query?' · search: "'+query+'"':''}`;
   };
  }

  if(typeof getGemOfWeek==='function'){
   window.getGemOfWeek=function(){
    const pool=GEMS.filter(g=>g.emoji);
    if(!pool.length)return null;
    const now=new Date();
    const seed=now.getFullYear()*100+(typeof lithosISOWeek==='function'?lithosISOWeek(now):1);
    const featured=pool[seed%pool.length];
    return{gem:featured,idx:GEMS.indexOf(featured),week:typeof lithosISOWeek==='function'?lithosISOWeek(now):1,year:now.getFullYear()};
   };
  }

  if(typeof renderGemOfWeek==='function'){
   window._lithosRenderGemOfWeek=renderGemOfWeek;
   window.renderGemOfWeek=function(){
    const el=document.getElementById('gem-week-wrap');
    if(!el)return;
    const w=getGemOfWeek();
    if(!w){el.innerHTML='';return;}
    const g=w.gem;
    const weekLabel=`Week ${w.week}, ${w.year}`;
    el.innerHTML=`
 <article class="gem-week-card" style="--week-glow:${g.glow||'rgba(196,165,116,.12)'}">
  <div>
   <div class="gem-week-badge">🦴 Find of the Week · ${weekLabel}</div>
   <h2><em>${g.name}</em></h2>
   <p class="gem-week-blurb">${g.desc.slice(0,160)}…</p>
   <p class="gem-week-meta">${g.system} · ${g.origins[0]||'Earth'}</p>
   <button type="button" class="btn" id="gem-week-open">Open find →</button>
  </div>
  <div class="gem-week-visual">
   <div class="gem-week-photo stratum-emoji-photo" style="background:linear-gradient(145deg,${g.stone},${g.colorHex&&g.colorHex[1]||g.stone});display:flex;align-items:center;justify-content:center;font-size:80px">${g.emoji||'🏺'}</div>
  </div>
 </article>`;
    document.getElementById('gem-week-open').onclick=()=>{switchView('catalog');openDrawer(w.idx);};
   };
  }

  if(typeof syncHeroCounts==='function'){
   window.syncHeroCounts=function(){
    const n=GEMS.length;
    const boneCount=GEMS.filter(g=>g.kind==='bone'||g.kind==='fossil').length;
    const fieldCount=GEMS.filter(isFieldCatalog).length;
    const words=typeof catalogNumberWords==='function'?catalogNumberWords(n):String(n);
    const fInline=document.getElementById('hero-field-count-inline');
    const gInline=document.getElementById('hero-gem-count-inline');
    const fStat=document.getElementById('stat-field-count');
    const gStat=document.getElementById('stat-gem-count');
    const tStat=document.getElementById('stat-total-count');
    const lEl=document.getElementById('hero-lede-count');
    if(lEl)lEl.textContent=words.charAt(0)+words.slice(1).toLowerCase();
    if(fInline)fInline.textContent=fieldCount.toLocaleString('en-US');
    if(gInline)gInline.textContent=String(boneCount);
    if(fStat)fStat.textContent=fieldCount.toLocaleString('en-US');
    if(gStat)gStat.textContent=String(boneCount);
    if(tStat)tStat.textContent=n.toLocaleString('en-US');
   };
  }

  if(typeof buildScavengerHunt==='function'){
   window._lithosBuildScavengerHunt=buildScavengerHunt;
   window.buildScavengerHunt=function(){
    const wrap=document.getElementById('hunt-wrap');
    if(!wrap)return;
    const items=window.STRATUM_SCAVENGER||[];
    const key='lithos_scavenger_v1';
    let found=[];
    try{found=JSON.parse(localStorage.getItem(key)||'[]');}catch(_){}
    const total=items.length,done=found.length,pct=Math.round(done/total*100);
    wrap.innerHTML=`
 <div class="eyebrow" style="font-family:var(--mono);font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);margin-bottom:26px">🦴 Site Hunt</div>
 <h1 style="font-family:var(--serif);font-weight:300;font-size:clamp(40px,6vw,76px);line-height:.98">Artifact <em style="font-style:italic;color:var(--gold)">Scavenger Hunt</em></h1>
 <p class="lede" style="margin:18px 0 28px">Follow clues to find bones, fossils, and ancient objects in the Stratum catalog. Open each find to log it in your field journal.</p>
 <div class="hunt-progress"><div class="hunt-bar"><i style="width:${pct}%"></i></div><span>${done} / ${total} logged · ${pct}%</span></div>
 <div class="hunt-clues">${items.map(it=>{
  const ok=found.includes(it.id);
  return `<article class="hunt-clue${ok?' done':''}"><span class="hunt-num">${String(it.id).padStart(2,'0')}</span><div><p class="hunt-text">${it.clue}</p><p class="hunt-hint">${ok?'✓ '+it.artifact:it.hint}</p></div></article>`;
 }).join('')}</div>
 ${done>=total?'<p class="hunt-cert">🏛️ Field archaeologist certificate earned — all artifacts logged!</p>':''}`;
   };
  }

  const slide=document.getElementById('gem-slideshow');
  if(slide)slide.hidden=true;

  if(typeof renderGrid==='function')renderGrid();
  if(typeof syncHeroCounts==='function')syncHeroCounts();
  if(typeof renderGemOfWeek==='function')renderGemOfWeek();
 };
})();
