/* FTMA player search — live, delegated, async-safe, mobile-safe. */
(function(){
'use strict';
const norm=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').toLocaleLowerCase('ko-KR');
const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
function styles(){
 if(document.getElementById('ftmaUnifiedSearchStyles'))return;
 const s=document.createElement('style');s.id='ftmaUnifiedSearchStyles';s.textContent=`
.ftma-unified-search{display:flex;align-items:center;gap:10px;margin:10px 0 12px;padding:10px;border:1px solid #303338;background:#111315}
.ftma-unified-search label{color:#caa968;font-size:9px;font-weight:900;letter-spacing:.12em;white-space:nowrap}
.ftma-unified-search input{flex:1;min-width:0;width:100%;box-sizing:border-box;background:#090b0d;border:1px solid #3a3d42;color:#eee;padding:11px 12px;outline:0;font-size:12px}
.ftma-unified-search input:focus{border-color:#caa968}
.ftma-unified-search small{color:#77736b;font-size:9px;white-space:nowrap}
.ftma-search-hidden{display:none!important}
.ftma-search-empty{padding:16px;text-align:center;color:#77736b;font-size:10px;border-top:1px solid #27292d}
.market-directory-row>.market-offer-btn{appearance:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:108px!important;min-height:36px!important;box-sizing:border-box!important;border:1px solid #665535!important;border-radius:0!important;background:transparent!important;color:#e8d3a0!important;padding:9px 12px!important;font-size:10px!important;font-weight:900!important;line-height:1!important;cursor:pointer!important;transition:.18s!important}
.market-directory-row>.market-offer-btn:hover:not(:disabled){border-color:#caa968!important;background:#1d1a15!important;color:#f0dfb8!important}
.market-directory-row>.market-offer-btn:disabled{opacity:.55!important;cursor:not-allowed!important}
.market-directory-row>.market-offer-btn.sent{border-color:#4f684f!important;color:#a9c3a9!important;background:#121712!important}
@media(max-width:700px){
 .ftma-unified-search{display:grid;grid-template-columns:1fr;gap:7px;margin-top:8px}
 .ftma-unified-search label,.ftma-unified-search small{display:none}
 .ftma-unified-search input{min-height:42px;font-size:14px}
 .market-directory-row>.market-offer-btn{width:82px!important;min-height:34px!important;padding:8px 7px!important;font-size:9px!important}
}
`;
 document.head.appendChild(s);
}
function marketRows(){return [...(document.getElementById('marketList')?.querySelectorAll('.market-directory-row')||[])];}
function filterMarket(){
 const list=document.getElementById('marketList'),input=document.getElementById('ftmaMarketUnifiedInput');if(!list||!input)return;
 const q=norm(input.value);const rows=marketRows();let visible=0;
 rows.forEach(row=>{const name=row.querySelector('.market-player-name-line b,.market-player-main b')?.textContent||'';const ok=!q||norm(name).includes(q);row.classList.toggle('ftma-search-hidden',!ok);if(ok)visible++});
 let empty=list.querySelector('.ftma-search-empty');
 if(q&&rows.length&&!visible){if(!empty){empty=document.createElement('div');empty.className='ftma-search-empty';list.appendChild(empty)}empty.textContent='검색 결과가 없습니다.';empty.style.display='block'}
 else if(empty)empty.style.display='none';
 const c=document.getElementById('ftmaMarketUnifiedCount');if(c)c.textContent=q?`${visible}명 검색됨 / ${rows.length}명`:`${rows.length}명 등록`;
}
function installMarket(){
 const list=document.getElementById('marketList');if(!list)return;styles();
 let panel=document.getElementById('ftmaMarketUnifiedSearch');
 if(!panel){panel=document.createElement('div');panel.id='ftmaMarketUnifiedSearch';panel.className='ftma-unified-search';panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaMarketUnifiedInput" type="search" inputmode="search" autocomplete="off" placeholder="선수 이름으로 검색"><small id="ftmaMarketUnifiedCount"></small>';const h=list.closest('.directory-section')?.querySelector('.directory-heading');if(h)h.insertAdjacentElement('afterend',panel);else list.parentElement?.insertBefore(panel,list)}
 const input=document.getElementById('ftmaMarketUnifiedInput');
 if(input&&!input.dataset.ftmaBound){input.dataset.ftmaBound='1';['input','change','search'].forEach(type=>input.addEventListener(type,filterMarket));input.addEventListener('compositionend',filterMarket)}
 filterMarket();
}
function renderNegotiationResults(){
 const select=document.getElementById('realPlayerPick'),input=document.getElementById('ftmaNegotiationPlayerInput');if(!select||!input)return;
 const q=norm(input.value),options=[...select.options].filter(o=>o.value),matches=options.filter(o=>!q||norm(o.textContent).includes(q)).slice(0,50);
 let results=document.getElementById('ftmaNegotiationPlayerResults');
 if(!results){results=document.createElement('div');results.id='ftmaNegotiationPlayerResults';results.className='ftma-neg-results';input.parentElement?.insertAdjacentElement('afterend',results)}
 results.innerHTML=matches.length?matches.map(o=>{const parts=o.textContent.split(' · ');return `<button type="button" data-player-value="${esc(o.value)}" data-player-name="${esc(parts[0]||'')}"><b>${esc(parts[0]||'')}</b><small>${esc(parts.slice(1).join(' · '))}</small></button>`}).join(''):'<div class="empty">검색 결과가 없습니다.</div>';
 const c=document.getElementById('ftmaNegotiationPlayerCount');if(c)c.textContent=q?`${matches.length}명 검색됨`:`${options.length}명`;
}
function installNegotiation(){
 const select=document.getElementById('realPlayerPick'),left=document.getElementById('leftContent');if(!select||!left)return;styles();
 let panel=document.getElementById('ftmaNegotiationPlayerSearch');
 if(!panel){panel=document.createElement('div');panel.id='ftmaNegotiationPlayerSearch';panel.className='ftma-unified-search';panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaNegotiationPlayerInput" type="search" inputmode="search" autocomplete="off" placeholder="선수 이름으로 검색"><small id="ftmaNegotiationPlayerCount"></small>';select.parentElement?.insertAdjacentElement('beforebegin',panel)}
 const input=document.getElementById('ftmaNegotiationPlayerInput');if(input&&!input.dataset.ftmaBound){input.dataset.ftmaBound='1';['input','change','search'].forEach(type=>input.addEventListener(type,renderNegotiationResults));input.addEventListener('compositionend',renderNegotiationResults)}
 renderNegotiationResults();
}
function boot(){installMarket();installNegotiation();}
function start(){
 boot();
 const list=document.getElementById('marketList');
 if(list){new MutationObserver(()=>{installMarket();filterMarket()}).observe(list,{childList:true,subtree:true})}
 const left=document.getElementById('leftContent');
 if(left){new MutationObserver(installNegotiation).observe(left,{childList:true,subtree:true})}
 [100,300,700,1500,3000].forEach(ms=>setTimeout(boot,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
