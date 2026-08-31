/* FTMA loan duration extension: allow half-season loans. */
(function(){
'use strict';
function addHalfSeasonOption(select){
  if(!select || select.dataset.ftmaHalfSeason==='1') return;
  const options=Array.from(select.options||[]);
  if(options.some(o=>o.value==='반 시즌')){select.dataset.ftmaHalfSeason='1';return;}
  const option=document.createElement('option');
  option.value='반 시즌';
  option.textContent='반 시즌';
  select.insertBefore(option, select.firstChild);
  select.dataset.ftmaHalfSeason='1';
}
function scan(){
  document.querySelectorAll('#ftmaYears').forEach(addHalfSeasonOption);
}
function boot(){
  scan();
  const observer=new MutationObserver(scan);
  observer.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
