/* Owner anomaly trap removed — safe stub for cached old index.html (v75+) */
(function(){
'use strict';
const BUILD=75;
window.__LITHOS_TRAP_JS_BUILD=BUILD;
window.LITHOS_OWNER_TRAP_BUILD=BUILD;

function lithosTrapPurgeDom(){
 ['lithos-trap-inline-boot','lithos-owner-trap','lithos-owner-bait','lithos-trap-tapgate',
  'lithos-trap-finale-root','lithos-trap-screen-breach','lithos-trap-hit-layer'].forEach(function(id){
  var el=document.getElementById(id);
  if(el) el.remove();
 });
 document.documentElement.classList.remove(
  'lithos-trap-screen-host','lithos-trap-screen-native','lithos-trap-screen-flash'
 );
 window.lithosOwnerTrapActive=false;
}

function lithosTrapStripTestUrl(){
 try{
  var u=new URL(location.href);
  var dirty=false;
  ['trap','scare','ownerbait','_trap'].forEach(function(k){
   if(u.searchParams.has(k)){ u.searchParams.delete(k); dirty=true; }
  });
  var h=(u.hash||'').toLowerCase();
  if(/ownerbait|scare|previewownertrap/.test(h)){
   u.hash='';
   dirty=true;
  }
  if(!dirty) return;
  u.searchParams.set('_',String(Date.now()));
  location.replace(u.pathname+u.search+(u.hash||''));
 }catch(_){}
}

function noop(){}
window.lithosStartOwnerTrap=noop;
window.lithosPreviewOwnerTrap=noop;
window.lithosShowOwnerBaitModal=noop;
window.maybeShowOwnerBait=noop;
window.lithosOwnerTrapDressCard=function(card){ return card; };

lithosTrapStripTestUrl();
lithosTrapPurgeDom();
if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',lithosTrapPurgeDom,{once:true});
}else{
 lithosTrapPurgeDom();
}
setTimeout(lithosTrapPurgeDom,0);
setTimeout(lithosTrapPurgeDom,500);
})();
