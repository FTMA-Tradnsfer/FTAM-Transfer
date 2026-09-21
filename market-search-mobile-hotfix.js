/* FTMA mobile market search hardening. No DB calls; event + DOM observer only. */
(function(){
'use strict';
const normalize=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').toLocaleLowerCase('ko-KR');
function input(){return document.getElementById('ftmaMarketUnifiedInput')}
function rows(){return Array.from(document.querySelectorAll('#marketList .market-directory-row'))}
function apply(){
  const el=input(); if(!el)return;
  const q=normalize(el.value); let visible=0; const list=document.getElementById('marketList');
  rows().forEach(r=>{
    const name=r.querySelector('.market-player-name-line b,.market-player-main b')?.textContent||'';
    const ok=!q||normalize(name).includes(q);
    r.style.setProperty('display',ok?'':'none','important');
    if(ok)visible++;
  });
  let empty=document.getElementById('ftmaMobileSearchEmpty');
  if(q&&!visible&&rows().length){
    if(!empty){
      empty=document.createElement('div');
      empty.id='ftmaMobileSearchEmpty';
      empty.textContent='검색 결과가 없습니다.';
      empty.style.cssText='padding:18px;text-align:center;color:#77736b;font-size:10px';
      list?.appendChild(empty);
    }
  }else empty?.remove();
}
function bind(){
  if(document.documentElement.dataset.ftmaMobileSearchDelegated==='1')return;
  document.documentElement.dataset.ftmaMobileSearchDelegated='1';
  document.addEventListener('input',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')apply()},true);
  document.addEventListener('change',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')apply()},true);
  document.addEventListener('search',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')apply()},true);
  document.addEventListener('compositionend',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')apply()},true);
  document.addEventListener('keyup',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')apply()},true);
  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#ftmaMarketSearchButton')){e.preventDefault();e.stopPropagation();apply();}
  },true);
}
function observe(){
  const list=document.getElementById('marketList'); if(!list||list.dataset.ftmaMobileSearchObserver==='1')return;
  list.dataset.ftmaMobileSearchObserver='1';
  let queued=false;
  const observer=new MutationObserver(records=>{
    const changed=records.some(r=>r.addedNodes.length||r.removedNodes.length);
    if(!changed||queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  });
  observer.observe(list,{childList:true,subtree:true});
}
function boot(){bind();observe();apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();