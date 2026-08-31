/* FTMA player-name search fix — market + negotiation, PC/mobile safe. */
(function(){
  'use strict';

  const norm = value => String(value ?? '')
    .normalize('NFKC')
    .replace(/\s+/g,'')
    .toLocaleLowerCase('ko-KR');

  function styles(){
    if(document.getElementById('ftmaUnifiedSearchStyles')) return;
    const s=document.createElement('style');
    s.id='ftmaUnifiedSearchStyles';
    s.textContent=`
      .ftma-unified-search{display:flex;align-items:center;gap:10px;margin:10px 0 12px;padding:10px;border:1px solid #303338;background:#111315}
      .ftma-unified-search label{color:#caa968;font-size:9px;font-weight:900;letter-spacing:.12em;white-space:nowrap}
      .ftma-unified-search input{flex:1;min-width:0;width:100%;box-sizing:border-box;background:#090b0d;border:1px solid #3a3d42;color:#eee;padding:11px 12px;outline:0;font-size:12px}
      .ftma-unified-search input:focus{border-color:#9b7c3e}
      .ftma-unified-search small{color:#77736b;font-size:9px;white-space:nowrap}
      .ftma-search-hidden{display:none!important}
      .ftma-search-empty{padding:14px;text-align:center;color:#77736b;font-size:10px;border:1px dashed #34373c}
      @media(max-width:700px){.ftma-unified-search{display:grid;grid-template-columns:1fr;gap:7px;margin-top:8px}.ftma-unified-search label{display:none}.ftma-unified-search input{min-height:42px;font-size:14px}.ftma-unified-search small{display:none}}
    `;
    document.head.appendChild(s);
  }

  /* ---------------- MARKET ---------------- */
  function getMarketRows(){
    const list=document.getElementById('marketList');
    if(!list) return [];
    return [...list.querySelectorAll('.market-directory-row')];
  }

  function filterMarket(){
    const input=document.getElementById('ftmaMarketUnifiedInput');
    const list=document.getElementById('marketList');
    if(!input||!list) return;
    const q=norm(input.value);
    const rows=getMarketRows();
    let visible=0;

    rows.forEach(row=>{
      const name=row.querySelector('.market-player-name-line b')?.textContent || row.textContent;
      const ok=!q || norm(name).includes(q);
      row.classList.toggle('ftma-search-hidden',!ok);
      if(ok) visible++;
    });

    const count=document.getElementById('ftmaMarketUnifiedCount');
    if(count) count.textContent=q?`${visible}명 검색됨 / ${rows.length}명`:`${rows.length}명 등록`;

    let empty=list.querySelector('.ftma-search-empty');
    if(q && rows.length && visible===0){
      if(!empty){
        empty=document.createElement('div');
        empty.className='ftma-search-empty';
        empty.textContent='검색 결과가 없습니다.';
        list.appendChild(empty);
      }
      empty.style.display='block';
    }else if(empty){
      empty.style.display='none';
    }
  }

  function installMarket(){
    const list=document.getElementById('marketList');
    if(!list) return false;
    styles();
    let panel=document.getElementById('ftmaMarketUnifiedSearch');
    if(!panel){
      panel=document.createElement('div');
      panel.id='ftmaMarketUnifiedSearch';
      panel.className='ftma-unified-search';
      panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaMarketUnifiedInput" type="search" inputmode="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="선수 이름으로 검색"><small id="ftmaMarketUnifiedCount"></small>';
      const heading=list.closest('.directory-section')?.querySelector('.directory-heading');
      if(heading) heading.insertAdjacentElement('afterend',panel);
      else list.parentElement?.insertBefore(panel,list);
    }
    const input=document.getElementById('ftmaMarketUnifiedInput');
    if(input && !input.dataset.ftmaBound){
      input.dataset.ftmaBound='1';
      ['input','search','keyup','change'].forEach(type=>input.addEventListener(type,filterMarket,{passive:true}));
      input.addEventListener('compositionend',filterMarket,{passive:true});
    }
    filterMarket();
    return true;
  }

  function observeMarket(){
    const list=document.getElementById('marketList');
    if(!list || list.dataset.ftmaSearchObserved) return;
    list.dataset.ftmaSearchObserved='1';
    new MutationObserver(()=>filterMarket()).observe(list,{childList:true,subtree:true});
  }

  /* ---------------- NEGOTIATION ---------------- */
  let negotiationSource=[];

  function captureNegotiationOptions(select){
    if(!select) return;
    if(!negotiationSource.length || select.dataset.ftmaOptionSignature!==String(select.options.length)+':'+[...select.options].map(o=>o.value).join('|')){
      negotiationSource=[...select.options].map(o=>({value:o.value,text:o.textContent,disabled:o.disabled,selected:o.selected}));
      select.dataset.ftmaOptionSignature=String(select.options.length)+':'+[...select.options].map(o=>o.value).join('|');
    }
  }

  function filterNegotiation(){
    const select=document.getElementById('realPlayerPick');
    const input=document.getElementById('ftmaNegotiationPlayerInput');
    if(!select||!input) return;
    captureNegotiationOptions(select);
    const q=norm(input.value);
    const current=select.value;
    const source=negotiationSource;

    const filtered=source.filter((o,i)=>i===0 || !q || norm(o.text).includes(q));
    select.innerHTML='';
    filtered.forEach(o=>{
      const option=document.createElement('option');
      option.value=o.value;
      option.textContent=o.text;
      option.disabled=Boolean(o.disabled);
      select.appendChild(option);
    });

    if([...select.options].some(o=>o.value===current)) select.value=current;
    else if(select.options.length) select.selectedIndex=0;

    const count=document.getElementById('ftmaNegotiationPlayerCount');
    if(count) count.textContent=q?`${Math.max(0,filtered.length-(source.length?1:0))}명 검색됨`:`${Math.max(0,source.length-1)}명`;
  }

  function installNegotiation(){
    const select=document.getElementById('realPlayerPick');
    const left=document.getElementById('leftContent');
    if(!select||!left) return false;
    styles();
    captureNegotiationOptions(select);

    let panel=document.getElementById('ftmaNegotiationPlayerSearch');
    if(!panel){
      panel=document.createElement('div');
      panel.id='ftmaNegotiationPlayerSearch';
      panel.className='ftma-unified-search';
      panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaNegotiationPlayerInput" type="search" inputmode="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="선수 이름으로 검색"><small id="ftmaNegotiationPlayerCount"></small>';
      select.parentElement?.insertAdjacentElement('beforebegin',panel);
    }
    const input=document.getElementById('ftmaNegotiationPlayerInput');
    if(input && !input.dataset.ftmaBound){
      input.dataset.ftmaBound='1';
      ['input','search','keyup','change'].forEach(type=>input.addEventListener(type,filterNegotiation,{passive:true}));
      input.addEventListener('compositionend',filterNegotiation,{passive:true});
    }
    filterNegotiation();
    return true;
  }

  function boot(){
    installMarket();
    observeMarket();
    installNegotiation();
  }

  /* Both pages create their player lists asynchronously, so retry briefly and
     also watch the page for the select/list being replaced. */
  function start(){
    boot();
    const pageObserver=new MutationObserver(()=>{
      installMarket();
      observeMarket();
      installNegotiation();
    });
    pageObserver.observe(document.body,{childList:true,subtree:true});
    setTimeout(boot,100);
    setTimeout(boot,300);
    setTimeout(boot,700);
    setTimeout(boot,1500);
    setTimeout(boot,3000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
