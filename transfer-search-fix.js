/* FTMA market/player search — delegated events + async render safe, mobile/PC safe. */
(function(){
'use strict';
const norm=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').toLocaleLowerCase('ko-KR');
function marketRows(){return Array.from(document.querySelectorAll('#marketList .market-directory-row'));}
function filterMarket(){
  const input=document.getElementById('ftmaMarketUnifiedInput');
  if(!input)return;
  const rows=marketRows(),q=norm(input.value);let visible=0;
  rows.forEach(row=>{
    const name=row.querySelector('.market-player-name-line b,.market-player-main b')?.textContent||'';
    const ok=!q||norm(name).includes(q);
    row.classList.toggle('ftma-search-hidden',!ok);
    if(ok)visible++;
  });
  document.getElementById('ftmaMarketSearchEmpty')?.remove();
  if(q&&rows.length&&!visible){
    const e=document.createElement('div');e.id='ftmaMarketSearchEmpty';e.className='ftma-search-empty';e.textContent='검색 결과가 없습니다.';
    document.getElementById('marketList')?.appendChild(e);
  }
  const count=document.getElementById('ftmaMarketUnifiedCount');
  if(count)count.textContent=q?`${visible}명 검색됨 / ${rows.length}명`:`${rows.length}명 등록`;
}
function renderNegotiationResults(){
  const select=document.getElementById('realPlayerPick'),input=document.getElementById('ftmaNegotiationPlayerInput');
  if(!select||!input)return;
  const q=norm(input.value),options=Array.from(select.options).filter(o=>o.value),matches=options.filter(o=>!q||norm(o.textContent).includes(q)).slice(0,50);
  let results=document.getElementById('ftmaNegotiationPlayerResults');
  if(!results){results=document.createElement('div');results.id='ftmaNegotiationPlayerResults';results.className='ftma-neg-results';input.parentElement?.insertAdjacentElement('afterend',results)}
  results.textContent='';matches.forEach(o=>{const b=document.createElement('button');b.type='button';b.dataset.playerValue=o.value;b.textContent=o.textContent;results.appendChild(b)});
  const c=document.getElementById('ftmaNegotiationPlayerCount');if(c)c.textContent=q?`${matches.length}명 검색됨`:`${options.length}명`;
}
function install(){
  if(!document.getElementById('ftmaUnifiedSearchStyles')){
    const style=document.createElement('style');style.id='ftmaUnifiedSearchStyles';style.textContent=`
.ftma-unified-search{display:flex;align-items:center;gap:10px;margin:10px 0 12px;padding:10px;border:1px solid #303338;background:#111315;box-sizing:border-box;width:100%;max-width:100%;overflow:hidden}
.ftma-unified-search input{flex:1 1 auto;min-width:0;width:100%;box-sizing:border-box;background:#090b0d;border:1px solid #3a3d42;color:#eee;padding:11px 12px;outline:0;font-size:12px}
.ftma-unified-search button{flex:0 0 auto;appearance:none;border:1px solid #665535;background:transparent;color:#e8d3a0;padding:10px 16px;cursor:pointer;font-weight:800;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.ftma-search-hidden{display:none!important}.ftma-search-empty{padding:16px;text-align:center;color:#77736b;font-size:10px}
@media(max-width:700px){.ftma-unified-search{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;padding:10px;width:100%;max-width:100%}.ftma-unified-search input,.ftma-unified-search button{min-height:42px}.ftma-unified-search input{font-size:16px}.ftma-unified-search button{padding:8px 14px;touch-action:manipulation}}
`;
    document.head.appendChild(style);
  }
  const list=document.getElementById('marketList');
  if(list&&!document.getElementById('ftmaMarketUnifiedSearch')){
    const panel=document.createElement('div');panel.id='ftmaMarketUnifiedSearch';panel.className='ftma-unified-search';
    panel.innerHTML='<input id="ftmaMarketUnifiedInput" type="search" inputmode="search" autocomplete="off" placeholder="선수 이름으로 검색"><button id="ftmaMarketSearchButton" type="button">검색</button>';
    list.parentElement?.insertBefore(panel,list);
  }
  filterMarket();renderNegotiationResults();
}
function bindDelegatedEvents(){
  if(document.documentElement.dataset.ftmaSearchDelegated==='1')return;
  document.documentElement.dataset.ftmaSearchDelegated='1';
  document.addEventListener('input',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')filterMarket();},true);
  document.addEventListener('compositionend',e=>{if(e.target?.id==='ftmaMarketUnifiedInput')filterMarket();},true);
  document.addEventListener('keydown',e=>{if(e.target?.id==='ftmaMarketUnifiedInput'&&e.key==='Enter'){e.preventDefault();e.stopPropagation();filterMarket();}},true);
  document.addEventListener('click',e=>{if(e.target?.closest?.('#ftmaMarketSearchButton')){e.preventDefault();e.stopPropagation();filterMarket();}},true);
}
function bindMarketRenderWatcher(){
  if(document.documentElement.dataset.ftmaMarketRenderWatcher==='1')return;
  const list=document.getElementById('marketList');
  if(!list)return;
  document.documentElement.dataset.ftmaMarketRenderWatcher='1';
  let queued=false;
  const observer=new MutationObserver(records=>{
    const changed=records.some(r=>Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some(n=>n.nodeType===1&&(n.classList?.contains('market-directory-row')||n.querySelector?.('.market-directory-row'))));
    if(!changed||queued)return;
    queued=true;requestAnimationFrame(()=>{queued=false;filterMarket();});
  });
  observer.observe(list,{childList:true,subtree:true});
}
function start(){bindDelegatedEvents();install();bindMarketRenderWatcher();[100,300,700,1500,3000].forEach(ms=>setTimeout(install,ms));}
window.ftmaApplyMarketSearch=filterMarket;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();