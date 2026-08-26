/* FTMA transfer-market-only search: isolated, debounced, no DOM mutation loop. */
(function(){
  let observer=null;
  let applyTimer=0;
  function styles(){
    if(document.getElementById('ftmaMarketSearchStyles')) return;
    const s=document.createElement('style');
    s.id='ftmaMarketSearchStyles';
    s.textContent=`.market-search-panel{display:flex;align-items:center;gap:14px;margin-top:24px;padding:14px 16px;border:1px solid #303338;background:#111315}.market-search-panel input{flex:1;min-width:0;background:#090b0d;border:1px solid #3a3d42;color:#eee;padding:13px 14px;outline:0;font-size:12px}.market-search-panel input:focus{border-color:#9b7c3e;box-shadow:0 0 0 2px rgba(202,169,104,.08)}.market-search-panel .market-search-label{color:#caa968;font-size:9px;font-weight:900;letter-spacing:.16em;white-space:nowrap}.market-search-panel .market-search-count{color:#8b877f;font-size:9px;white-space:nowrap}.market-search-empty{grid-column:1/-1}@media(max-width:700px){.market-search-panel{display:grid;grid-template-columns:1fr;gap:8px}.market-search-panel input{width:100%;box-sizing:border-box}.market-search-panel .market-search-count{display:none}}`;
    document.head.appendChild(s);
  }
  function getRows(list){return Array.from(list.querySelectorAll('.market-directory-row'));}
  function apply(list,input){
    if(!list||!input) return;
    const q=String(input.value||'').trim().toLocaleLowerCase('ko-KR');
    const rows=getRows(list); let visible=0;
    for(const row of rows){
      const hay=String(row.textContent||'').toLocaleLowerCase('ko-KR');
      const match=!q||hay.includes(q);
      row.style.display=match?'':'none';
      if(match) visible++;
    }
    const count=document.getElementById('marketSearchCount');
    if(count) count.textContent=q?`${visible}명 검색됨 / ${rows.length}명`:`${rows.length}명 등록`;
    let empty=list.querySelector('.market-search-empty');
    if(!visible&&rows.length){
      if(!empty){empty=document.createElement('div');empty.className='loading market-search-empty';empty.textContent='검색 결과가 없습니다.';list.appendChild(empty)}
      empty.style.display='block';
    }else if(empty) empty.style.display='none';
  }
  function scheduleApply(list,input){window.clearTimeout(applyTimer);applyTimer=window.setTimeout(()=>apply(list,input),80)}
  function install(){
    const list=document.getElementById('marketList');
    const heading=list?.closest('.directory-section')?.querySelector('.directory-heading');
    if(!list||!heading) return false;
    styles();
    let panel=document.getElementById('marketSearchPanel');
    if(!panel){
      panel=document.createElement('div'); panel.id='marketSearchPanel'; panel.className='market-search-panel';
      panel.innerHTML='<span class="market-search-label">MARKET SEARCH</span><input id="marketPlayerSearch" type="search" autocomplete="off" placeholder="이적시장 등록 선수 이름, 포지션, 국적 또는 구단 검색"><span id="marketSearchCount" class="market-search-count"></span>';
      heading.insertAdjacentElement('afterend',panel);
      const input=panel.querySelector('#marketPlayerSearch');
      input.addEventListener('input',()=>scheduleApply(list,input),{passive:true});
      input.addEventListener('search',()=>scheduleApply(list,input),{passive:true});
    }
    const input=panel.querySelector('#marketPlayerSearch');
    if(observer) observer.disconnect();
    observer=new MutationObserver(()=>{if(document.activeElement!==input) scheduleApply(list,input)});
    observer.observe(list,{childList:true});
    scheduleApply(list,input); return true;
  }
  let attempts=0;
  const boot=()=>{if(install()) return;if(++attempts<80) setTimeout(boot,150)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
