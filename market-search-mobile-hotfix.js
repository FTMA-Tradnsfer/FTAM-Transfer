/* FTMA mobile market search hardening. No DB calls; filters rendered rows only. */
(function(){
'use strict';
const normalize=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').toLocaleLowerCase('ko-KR');
function input(){return document.getElementById('ftmaMarketUnifiedInput')}
function rows(){return Array.from(document.querySelectorAll('#marketList .market-directory-row'))}
function apply(){const el=input();if(!el)return;const q=normalize(el.value);let visible=0;rows().forEach(r=>{const name=r.querySelector('.market-player-name-line b,.market-player-main b')?.textContent||'';const ok=!q||normalize(name).includes(q);r.style.setProperty('display',ok?'':'none','important');if(ok)visible++});let empty=document.getElementById('ftmaMobileSearchEmpty');if(q&&!visible&&rows().length){if(!empty){empty=document.createElement('div');empty.id='ftmaMobileSearchEmpty';empty.textContent='검색 결과가 없습니다.';empty.style.cssText='padding:18px;text-align:center;color:#77736b;font-size:10px';document.getElementById('marketList')?.appendChild(empty)}}else empty?.remove()}
function bind(){const el=input();if(!el||el.dataset.ftmaMobileHotfix==='1')return;el.dataset.ftmaMobileHotfix='1';el.addEventListener('input',apply,{passive:true});el.addEventListener('change',apply,{passive:true});el.addEventListener('search',apply,{passive:true});el.addEventListener('compositionend',apply,{passive:true});el.addEventListener('keyup',apply,{passive:true});const b=document.getElementById('ftmaMarketSearchButton');if(b)b.addEventListener('touchend',e=>{e.preventDefault();apply()},{passive:false});apply()}
function boot(){bind();let last='',timer=setInterval(()=>{const el=input();if(!el){return}const sig=el.value+'|'+rows().length;if(sig!==last){last=sig;apply()}bind();if(!document.body.contains(el))clearInterval(timer)},150);setTimeout(()=>clearInterval(timer),120000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();