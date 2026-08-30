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
  function openStratumGames(){
   if(typeof buildArchaeologyHub==='function')buildArchaeologyHub();
   if(typeof switchView==='function')switchView('archaeology');
  }
  const gamesBtn=document.getElementById('games-nav-btn');
  if(gamesBtn){
   gamesBtn.textContent='Dig Games';
   gamesBtn.onclick=function(e){e.preventDefault();openStratumGames();};
  }
  const heroGames=document.getElementById('hero-play-games');
  if(heroGames){
   heroGames.textContent='Play dig games';
   heroGames.onclick=function(e){e.preventDefault();openStratumGames();};
  }
  document.querySelectorAll('.mobile-bar button[data-mnav="games"]').forEach(btn=>{
   btn.textContent='Dig Games';
   btn.onclick=function(e){e.preventDefault();openStratumGames();};
  });
  window.openStratumGames=openStratumGames;
  document.querySelectorAll('#lithos-stratum-link,#hero-stratum-link').forEach(el=>{el.hidden=true;});
 }

 function applyBrand(){
  document.title='Stratum — Bones, Fossils & Ancient Things';
  const mark=document.querySelector('.brand .mark');
  if(mark)mark.innerHTML='Strat<em>um</em>';
  const tag=document.querySelector('.brand .tag');
  if(tag)tag.textContent='Bones · Fossils · Antiquity';
  const logo=document.getElementById('site-logo');
  if(logo){
   logo.src='images/brand/stratum-mark.png';
   logo.alt='Stratum logo';
  }
  const fav=document.getElementById('site-favicon');
  if(fav)fav.href='images/brand/stratum-favicon.png';
  const apple=document.getElementById('site-apple-icon');
  if(apple)apple.href='images/brand/stratum-mark.png';
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
  a.href='index.html?v=50';
  a.textContent='← Lithos 💎';
  a.onclick=function(e){
   e.preventDefault();
   if(typeof leaveStratum==='function')leaveStratum();
   else location.href='index.html?v=50';
  };
  nav.insertBefore(a,nav.firstChild);
 }

 function applyStratumBranding(){
  applyBrand();
  applyNav();
  applyHero();
  applyFilters();
  addSiteSwitch();
  if(typeof applyCraftsHero==='function')applyCraftsHero();
  const gw=document.querySelector('.gem-week-badge');
  if(gw)gw.textContent=gw.textContent.replace(/Gem of the Week/i,'Find of the Week');
  const archHead=document.querySelector('#view-archaeology .arch-hero h1');
  if(archHead)archHead.innerHTML='Stratum <em>Dig Games</em>';
  const archLede=document.querySelector('#view-archaeology .arch-hero .lede');
  if(archLede)archLede.textContent='Brush gently, dig smart, and remember — deeper layers hold older treasures. Start with The Dig!';
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
