/* FTMA: transfer-market-only player search. Keeps the public player database search separate. */
(function(){
  function styles(){
    if(document.getElementById('ftmaMarketSearchStyles')) return;
    const s=document.createElement('style');
    s.id='ftmaMarketSearchStyles';
    s.textContent=`
      .market-search-panel{display:flex;align-items:center;gap:14px;margin-top:24px;padding:14px 16px;border:1px solid #303338;background:#111315}
      .market-search-panel input{flex:1;min-width:0;background:#090b0d;border:1px solid #3a3d42;color:#eee;padding:13px 14px;outline:0;font-size:12px}
      .market-search-panel input:focus{border-color:#9b7c3e;box-shadow:0 0 0 2px rgba(202,169,104,.08)}
      .market-search-panel .market-search-label{color:#caa968;font-size:9px;font-weight:900;letter-spacing:.16em;white-space:nowrap}
      .market-search-panel .market-search-count{color:#8b877f;font-size:9px;white-space:nowrap}
      @media(max-width:700px){.market-search-panel{display:grid;grid-template-columns:1fr;gap:8px}.market-search-panel input{width:100%;box-sizing:border-box}.market-search-panel .market-search-count{display:none}}
    `;
    document.head.appendChild(s);
  }
  function install(){
    const list=document.getElementById('marketList');
    const heading=list?.closest('.directory-section')?.querySelector('.directory-heading');
    if(!list||!heading) return false;
    styles();
    if(document.getElementById('marketSearchPanel')) return true;
    const panel=document.createElement('div');
    panel.id='marketSearchPanel';
    panel.className='market-search-panel';
    panel.innerHTML=`<span class="market-search-label">MARKET SEARCH</span><input id="marketPlayerSearch" type="search" autocomplete="off" placeholder="이적시장 등록 선수 이름, 포지션, 국적 또는 구단 검색"><span id="marketSearchCount" class="market-search-count"></span>`;
    heading.insertAdjacentElement('afterend',panel);
    const input=panel.querySelector('#marketPlayerSearch');
    const apply=()=>{
      const q=(input.value||'').trim().toLowerCase();
      const rows=[...list.querySelectorAll('.market-directory-row')];
      let visible=0;
      rows.forEach(row=>{
        const match=!q||row.textContent.toLowerCase().includes(q);
        row.hidden=!match;
        if(match)visible++;
      });
      const total=rows.length;
      const count=document.getElementById('marketSearchCount');
      if(count) count.textContent=q?`${visible}명 검색됨 / ${total}명`:`${total}명 등록`;
      const marketCount=document.getElementById('marketCount');
      if(marketCount) marketCount.textContent=`${q?visible:total}명`;
      let empty=list.querySelector('.market-search-empty');
      if(!visible&&total){
        if(!empty){empty=document.createElement('div');empty.className='loading market-search-empty';list.appendChild(empty)}
        empty.textContent='검색 결과가 없습니다.';
        empty.hidden=false;
      }else if(empty) empty.hidden=true;
    };
    input.addEventListener('input',apply);
    new MutationObserver(()=>apply()).observe(list,{childList:true,subtree:true});
    setTimeout(apply,300);
    return true;
  }
  if(!install()){
    let n=0;const t=setInterval(()=>{if(install()||++n>100)clearInterval(t)},100);
  }
})();
