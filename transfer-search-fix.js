/* FTMA player search — robust live filtering for market + negotiation. */
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
.ftma-unified-search input:focus{border-color:#9b7c3e}
.ftma-unified-search small{color:#77736b;font-size:9px;white-space:nowrap}
.ftma-search-hidden{display:none!important}
.ftma-search-empty{padding:14px;text-align:center;color:#77736b;font-size:10px;border:1px dashed #34373c}
.ftma-neg-results{display:grid;gap:5px;max-height:280px;overflow:auto;margin:0 0 10px}
.ftma-neg-results button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;background:#15171a;border:1px solid #2b2e33;color:#eee;padding:11px;cursor:pointer}
.ftma-neg-results button:hover{border-color:#caa968}
.ftma-neg-results b{font-size:12px}.ftma-neg-results small{color:#8f8b84;font-size:9px}.ftma-neg-results .empty{padding:11px;text-align:center;color:#77736b;border:1px dashed #2b2e33}
@media(max-width:700px){.ftma-unified-search{display:grid;grid-template-columns:1fr;gap:7px;margin-top:8px}.ftma-unified-search label,.ftma-unified-search small{display:none}.ftma-unified-search input{min-height:42px;font-size:14px}}
`;document.head.appendChild(s)}
function marketRows(){const list=document.getElementById('marketList');if(!list)return[];return [...list.querySelectorAll('.market-directory-row')];}
function filterMarket(){
 const list=document.getElementById('marketList'),input=document.getElementById('ftmaMarketUnifiedInput');if(!list||!input)return;
 const q=norm(input.value);const rows=marketRows();let visible=0;
 rows.forEach(row=>{const name=row.querySelector('.market-player-name-line b,.market-player-main b')?.textContent||'';const ok=!q||norm(name).includes(q);row.classList.toggle('ftma-search-hidden',!ok);if(ok)visible++});
 let empty=list.querySelector('.ftma-search-empty');
 if(q&&rows.length===0){if(empty)empty.style.display='none'}
 else if(q&&rows.length&&!visible){if(!empty){empty=document.createElement('div');empty.className='ftma-search-empty';list.appendChild(empty)}empty.textContent='검색 결과가 없습니다.';empty.style.display='block'}
 else if(empty)empty.style.display='none';
 const c=document.getElementById('ftmaMarketUnifiedCount');if(c)c.textContent=q?`${visible}명 검색됨 / ${rows.length}명`:`${rows.length}명 등록`;
}
function installMarket(){
 const list=document.getElementById('marketList');if(!list)return;styles();
 let panel=document.getElementById('ftmaMarketUnifiedSearch');
 if(!panel){panel=document.createElement('div');panel.id='ftmaMarketUnifiedSearch';panel.className='ftma-unified-search';panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaMarketUnifiedInput" type="search" inputmode="search" autocomplete="off" placeholder="선수 이름으로 검색"><small id="ftmaMarketUnifiedCount"></small>';const h=list.closest('.directory-section')?.querySelector('.directory-heading');if(h)h.insertAdjacentElement('afterend',panel);else list.parentElement?.insertBefore(panel,list)}
 const input=document.getElementById('ftmaMarketUnifiedInput');
 if(input&&!input.dataset.ftmaBound){input.dataset.ftmaBound='1';input.addEventListener('input',()=>requestAnimationFrame(filterMarket));input.addEventListener('search',filterMarket);input.addEventListener('change',filterMarket);input.addEventListener('compositionend',filterMarket)}
 filterMarket();
}
function renderNegotiationResults(){
 const select=document.getElementById('realPlayerPick'),input=document.getElementById('ftmaNegotiationPlayerInput');if(!select||!input)return;
 const q=norm(input.value),options=[...select.options].filter(o=>o.value),matches=options.filter(o=>!q||norm(o.textContent).includes(q)).slice(0,50);
 let results=document.getElementById('ftmaNegotiationPlayerResults');
 if(!results){results=document.createElement('div');results.id='ftmaNegotiationPlayerResults';results.className='ftma-neg-results';input.parentElement?.insertAdjacentElement('afterend',results)}
 results.innerHTML=matches.length?matches.map(o=>{const parts=o.textContent.split(' · ');return `<button type="button" data-player-value="${esc(o.value)}" data-player-name="${esc(parts[0]||'')}"><b>${esc(parts[0]||'')}</b><small>${esc(parts.slice(1).join(' · '))}</small></button>`}).join(''):'<div class="empty">검색 결과가 없습니다.</div>';
 results.onclick=e=>{const btn=e.target.closest('button[data-player-value]');if(!btn)return;select.value=btn.dataset.playerValue||'';input.value=btn.dataset.playerName||'';select.dispatchEvent(new Event('change',{bubbles:true}));results.innerHTML='';const c=document.getElementById('ftmaNegotiationPlayerCount');if(c)c.textContent='선택 완료'};
 const c=document.getElementById('ftmaNegotiationPlayerCount');if(c)c.textContent=q?`${matches.length}명 검색됨`:`${options.length}명`;
}
function installNegotiation(){
 const select=document.getElementById('realPlayerPick'),left=document.getElementById('leftContent');if(!select||!left)return;styles();
 let panel=document.getElementById('ftmaNegotiationPlayerSearch');
 if(!panel){panel=document.createElement('div');panel.id='ftmaNegotiationPlayerSearch';panel.className='ftma-unified-search';panel.innerHTML='<label>PLAYER SEARCH</label><input id="ftmaNegotiationPlayerInput" type="search" inputmode="search" autocomplete="off" placeholder="선수 이름으로 검색"><small id="ftmaNegotiationPlayerCount"></small>';select.parentElement?.insertAdjacentElement('beforebegin',panel)}
 const input=document.getElementById('ftmaNegotiationPlayerInput');if(!input||input.dataset.ftmaBound)return;input.dataset.ftmaBound='1';input.addEventListener('input',()=>requestAnimationFrame(renderNegotiationResults));input.addEventListener('search',renderNegotiationResults);input.addEventListener('change',renderNegotiationResults);input.addEventListener('compositionend',renderNegotiationResults);renderNegotiationResults();
}
function boot(){installMarket();installNegotiation()}
function start(){boot();const list=document.getElementById('marketList');if(list){new MutationObserver(()=>requestAnimationFrame(installMarket)).observe(list,{childList:true})}const left=document.getElementById('leftContent');if(left){new MutationObserver(()=>requestAnimationFrame(installNegotiation)).observe(left,{childList:true,subtree:true})}[100,300,700,1500,3000].forEach(ms=>setTimeout(boot,ms))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
