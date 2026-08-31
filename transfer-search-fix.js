/* FTMA unified player search: robust on desktop/mobile and async-rendered negotiation lists. */
(function(){
  function styles(){if(document.getElementById('ftmaUnifiedSearchStyles'))return;const s=document.createElement('style');s.id='ftmaUnifiedSearchStyles';s.textContent=`.ftma-unified-search{display:flex;align-items:center;gap:10px;margin:10px 0 12px;padding:10px;border:1px solid #303338;background:#111315}.ftma-unified-search label{color:#caa968;font-size:9px;font-weight:900;letter-spacing:.12em;white-space:nowrap}.ftma-unified-search input{flex:1;min-width:0;background:#090b0d;border:1px solid #3a3d42;color:#eee;padding:11px 12px;outline:0;font-size:12px}.ftma-unified-search input:focus{border-color:#9b7c3e}.ftma-unified-search small{color:#77736b;font-size:9px;white-space:nowrap}.ftma-search-hidden{display:none!important}.ftma-search-empty{padding:14px;text-align:center;color:#77736b;font-size:10px;border:1px dashed #34373c}@media(max-width:700px){.ftma-unified-search{display:grid;grid-template-columns:1fr;gap:7px;margin-top:8px}.ftma-unified-search input{width:100%;box-sizing:border-box;min-height:42px}.ftma-unified-search small{display:none}}`;
    document.head.appendChild(s);
  }
  function filterMarket(){
    const list=document.getElementById('marketList'),input=document.getElementById('ftmaMarketUnifiedInput');if(!list||!input)return;
    const q=input.value.trim().toLocaleLowerCase('ko-KR'),rows=[...list.querySelectorAll('.market-directory-row')];let visible=0;
    rows.forEach(r=>{const ok=!q||r.textContent.toLocaleLowerCase('ko-KR').includes(q);r.classList.toggle('ftma-search-hidden',!ok);if(ok)visible++});
    const count=document.getElementById('ftmaMarketUnifiedCount');if(count)count.textContent=q?`${visible}명 검색됨 / ${rows.length}명`:`${rows.length}명 등록`;
    let e=list.querySelector('.ftma-search-empty');if(!visible&&rows.length){if(!e){e=document.createElement('div');e.className='ftma-search-empty';e.textContent='검색 결과가 없습니다.';list.appendChild(e)}e.style.display='block'}else if(e)e.style.display='none';
  }
  function installMarket(){
    const list=document.getElementById('marketList'),heading=list?.closest('.directory-section')?.querySelector('.directory-heading');if(!list||!heading)return false;styles();
    let panel=document.getElementById('ftmaMarketUnifiedSearch');if(!panel){panel=document.createElement('div');panel.id='ftmaMarketUnifiedSearch';panel.className='ftma-unified-search';panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaMarketUnifiedInput" type="search" autocomplete="off" placeholder="선수 이름, 포지션, 국적 또는 구단 검색"><small id="ftmaMarketUnifiedCount"></small>';heading.insertAdjacentElement('afterend',panel);panel.querySelector('input').addEventListener('input',filterMarket);panel.querySelector('input').addEventListener('search',filterMarket)}filterMarket();
    if(!list.dataset.ftmaSearchObserved){new MutationObserver(()=>filterMarket()).observe(list,{childList:true,subtree:true});list.dataset.ftmaSearchObserved='1'}return true;
  }
  function filterNegotiation(){
    const select=document.getElementById('realPlayerPick'),input=document.getElementById('ftmaNegotiationPlayerInput');if(!select||!input)return;
    const q=input.value.trim().toLocaleLowerCase('ko-KR');let visible=0;
    [...select.options].forEach((o,i)=>{if(i===0){o.hidden=false;return}const ok=!q||o.textContent.toLocaleLowerCase('ko-KR').includes(q);o.hidden=!ok;if(ok)visible++});
    const count=document.getElementById('ftmaNegotiationPlayerCount');if(count)count.textContent=q?`${visible}명 검색됨`:`${Math.max(0,select.options.length-1)}명`;
  }
  function installNegotiation(){
    const left=document.getElementById('leftContent'),select=document.getElementById('realPlayerPick');if(!left||!select)return false;styles();
    let panel=document.getElementById('ftmaNegotiationPlayerSearch');
    if(!panel){panel=document.createElement('div');panel.id='ftmaNegotiationPlayerSearch';panel.className='ftma-unified-search';panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaNegotiationPlayerInput" type="search" autocomplete="off" placeholder="영입할 선수 이름, 포지션 또는 구단 검색"><small id="ftmaNegotiationPlayerCount"></small>';select.parentElement.insertAdjacentElement('beforebegin',panel);panel.querySelector('input').addEventListener('input',filterNegotiation);panel.querySelector('input').addEventListener('search',filterNegotiation)}
    filterNegotiation();
    if(!select.dataset.ftmaSearchObserved){new MutationObserver(()=>filterNegotiation()).observe(select,{childList:true,subtree:true});select.dataset.ftmaSearchObserved='1'}
    return true;
  }
  function boot(){styles();installMarket();installNegotiation();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  let tries=0;const timer=setInterval(()=>{const m=installMarket(),n=installNegotiation();if((m&&n)||++tries>120)clearInterval(timer)},100);
})();
