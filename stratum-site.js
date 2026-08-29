// ===== STRATUM branding (loads after switchView exists) =====
(function(){
 if(!window.LITHOS_STRATUM)return;

 const NAV={
  catalog:'Artifact Catalog',
  learn:'Field School',
  hunt:'Site Hunt',
  company:'Expedition Co.',
  classes:'Dig Classes',
  teacher:'Ask the Archaeologist',
  identify:'Identify a Find',
  feedback:'Field Notes',
  crafts:'Lab Crafts',
  memberships:'Expedition Pass',
  arcade:'🪏 Dig Arcade',
  donate:'Support Stratum',
  moneygoal:'Funding Goal',
  video:'Director TV'
 };

 const FILTER={
  'Field catalog':'Excavation catalog',
  'Gemstones':'Treasures',
  'All minerals':'All artifacts',
  'Mineral class':'Material class',
  'Browse':'Browse sites',
  'Silicates':'Ceramics & stone',
  'Oxides':'Metalwork',
  'Special':'Special'
 };

 function applyHero(){
  const eyebrow=document.querySelector('#view-catalog .hero .eyebrow');
  if(eyebrow)eyebrow.textContent='Archaeology · Artifacts · Excavation Records · Field Photos';
  const h1=document.querySelector('#view-catalog .hero h1');
  if(h1)h1.innerHTML='A field catalog<br>of <em>human</em> history';
  const lede=document.querySelector('#view-catalog .hero .lede');
  if(lede)lede.innerHTML='Stratum is Lithos\'s archaeology companion — same catalog power, desert-dig theme. Browse the curated <b>Excavation catalog</b> (<span id="hero-field-count-inline">1,200</span> artifacts and specimens). Filter to <b>Treasures</b> for <span id="hero-gem-count-inline">199</span> jewelry-grade finds, or <b>All artifacts</b> for the full <span id="hero-lede-count">six thousand</span>-entry reference — each lists chemistry, hardness, crystal system, and provenance.';
  const stats=document.querySelectorAll('#view-catalog .hero .stat .l');
  const statLabels=['Excavation catalog','Treasures','Total artifacts','Hardness range','Source regions','Material types'];
  stats.forEach((el,i)=>{if(statLabels[i])el.textContent=statLabels[i];});
 }

 function applyNav(){
  Object.entries(NAV).forEach(([view,label])=>{
   const btn=document.querySelector(`nav.top button[data-view="${view}"]`);
   if(btn)btn.textContent=label;
  });
  const archBtn=document.querySelector('nav.top button[data-view="archaeology"]');
  if(archBtn)archBtn.hidden=true;
  const gamesBtn=document.getElementById('games-nav-btn');
  if(gamesBtn)gamesBtn.textContent='Dig Games';
  document.querySelectorAll('#lithos-stratum-link,#hero-stratum-link').forEach(el=>{el.hidden=true;});
 }

 function applyBrand(){
  document.title='Stratum — Archaeology Field Catalog';
  const mark=document.querySelector('.brand .mark');
  if(mark)mark.innerHTML='Strat<em>um</em>';
  const tag=document.querySelector('.brand .tag');
  if(tag)tag.textContent='Archaeology Field Site № 03';
 }

 function applyFilters(){
  document.querySelectorAll('.filter-label').forEach(el=>{
   const t=FILTER[el.textContent.trim()];
   if(t)el.textContent=t;
  });
  document.querySelectorAll('.filter-pills button').forEach(btn=>{
   const raw=btn.textContent.trim();
   const t=FILTER[raw];
   if(t)btn.textContent=t;
  });
 }

 function addSiteSwitch(){
  const nav=document.querySelector('nav.top');
  if(!nav||nav.querySelector('.site-switch-link.lithos-link'))return;
  const lithosLink=document.getElementById('lithos-stratum-link');
  if(lithosLink)lithosLink.remove();
  const a=document.createElement('a');
  a.className='site-switch-link lithos-link';
  a.href='index.html';
  a.textContent='← Lithos 💎';
  a.onclick=function(e){
   e.preventDefault();
   try{sessionStorage.removeItem('lithos_site');}catch(_){}
   const u=new URL('index.html',location.href);
   u.search='';
   location.href=u.href;
  };
  nav.insertBefore(a,nav.firstChild);
 }

 function applyStratumBranding(){
  applyBrand();
  applyNav();
  applyHero();
  applyFilters();
  addSiteSwitch();
  const gw=document.querySelector('.gem-week-badge');
  if(gw&&/gem/i.test(gw.textContent))gw.textContent='Artifact of the Week';
 }

 window.stratumApplyBranding=applyStratumBranding;
 applyStratumBranding();

 if(typeof switchView==='function'){
  const orig=switchView;
  window.switchView=function(name){
   orig.apply(this,arguments);
   setTimeout(applyStratumBranding,0);
  };
 }
})();
