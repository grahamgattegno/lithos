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
  'Bones & fossils':'Bones & fossils',
  'Pottery':'Pottery',
  'Tools & weapons':'Tools & weapons',
  'Burial goods':'Burial goods',
  'Period':'Period',
  'Paleolithic':'Paleolithic',
  'Bronze & Iron Age':'Bronze & Iron Age',
  'Classical empires':'Classical empires',
  'Medieval & later':'Medieval & later',
  'Monuments':'Monuments',
  'Rock & cave art':'Rock & cave art',
  'Mummies':'Mummies'
 };

 function applyHero(){
  const eyebrow=document.querySelector('#view-catalog .hero .eyebrow');
  if(eyebrow)eyebrow.textContent='Osteology · Fossils · Ancient Civilizations · Field Excavations';
  const h1=document.querySelector('#view-catalog .hero h1');
  if(h1)h1.innerHTML='A field catalog<br>of <em>bones &amp; antiquity</em>';
  const lede=document.querySelector('#view-catalog .hero .lede');
  if(lede)lede.innerHTML='Stratum is Lithos\'s archaeology site — <b>no gemstones here</b>. Browse dinosaur bones, hominin skulls, mummies, pottery, ancient tools, and lost monuments. Every entry lists period, material, preservation, and excavation site.';
  const stats=document.querySelectorAll('#view-catalog .hero .stat');
  if(stats[3])stats[3].querySelector('.n').textContent='6';
  if(stats[4])stats[4].querySelector('.n').textContent='40+';
  if(stats[5])stats[5].querySelector('.n').textContent='12';
  const statLabels=['Catalogued finds','Bones & fossils','Total artifacts','Artifact types','Source regions','Periods covered'];
  stats.forEach((el,i)=>{const l=el.querySelector('.l');if(l&&statLabels[i])l.textContent=statLabels[i];});
  const slide=document.getElementById('gem-slideshow');
  if(slide)slide.hidden=true;
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
  document.title='Stratum — Bones, Fossils & Ancient Things';
  const mark=document.querySelector('.brand .mark');
  if(mark)mark.innerHTML='Strat<em>um</em>';
  const tag=document.querySelector('.brand .tag');
  if(tag)tag.textContent='Bones · Fossils · Antiquity';
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
   if(typeof leaveStratum==='function')leaveStratum();
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
  if(gw)gw.textContent=gw.textContent.replace(/Gem of the Week/i,'Find of the Week');
  const gwo=document.getElementById('gem-week-open');
  if(gwo)gwo.textContent='Open find →';
 }

 window.stratumApplyBranding=applyStratumBranding;
 applyStratumBranding();

 if(typeof switchView==='function'){
  const orig=switchView;
  window.switchView=function(name){
   orig.apply(this,arguments);
   setTimeout(applyStratumBranding,0);
   if(name==='hunt'&&typeof buildScavengerHunt==='function')buildScavengerHunt();
  };
 }
})();
