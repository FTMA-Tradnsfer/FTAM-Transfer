/* FTMA market loader — low-egress cached market load. */
(function(){
'use strict';
const URL='https://iloanplyuatfcwzovbpb.supabase.co',KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
let db=null,loaded=false;
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
const money=v=>`€${Number(v||0).toFixed(1)}M`,age=p=>p.age??'—';
const loggedIn=()=>Boolean(sessionStorage.getItem('ftma_club_id')&&sessionStorage.getItem('ftma_club_session_token'));
const timeout=p=>Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error('요청 시간 초과')),8000))]);
const MARKET_CACHE_KEY='ftma_market_players_v2',MARKET_CACHE_TTL=60000;
async function loadPlayers(){
  const fields='id,name,photo_url,nationality,position,market_value,age,shirt_number,current_club_id,is_loan,is_nfs,clubs(id,name)';
  try{const cached=sessionStorage.getItem(MARKET_CACHE_KEY);if(cached){const x=JSON.parse(cached);if(Date.now()-x.at<MARKET_CACHE_TTL&&Array.isArray(x.rows))return x.rows;}}catch(_){}
  if(!window.supabase?.createClient)throw new Error('Supabase client unavailable');
  const r=await timeout(db.from('players').select(fields).order('market_value',{ascending:false}).limit(2000));
  if(r.error)throw r.error;
  const rows=r.data||[];
  try{sessionStorage.setItem(MARKET_CACHE_KEY,JSON.stringify({at:Date.now(),rows}))}catch(_){}
  return rows;
}
async function marketOpen(){
  const key='ftma_market_state_cache';
  try{const cached=sessionStorage.getItem(key);if(cached){const x=JSON.parse(cached);if(Date.now()-x.at<60000)return !!x.open}}catch(_){}
  const r=await timeout(db.rpc('get_transfer_market_state'));if(r.error)throw r.error;
  const open=!!r.data?.open;try{sessionStorage.setItem(key,JSON.stringify({open,at:Date.now()}))}catch(_){}return open;
}
async function load(){
  const box=document.getElementById('marketList'),count=document.getElementById('marketCount');if(!box||loaded)return;
  box.innerHTML='<div class="loading">이적시장 데이터를 불러오는 중입니다...</div>';
  try{
    db=window.supabase.createClient(URL,KEY);
    const players=await loadPlayers();
    const market=players.filter(p=>!p.is_loan&&!p.is_nfs).map(p=>({...p,clubs:Array.isArray(p.clubs)?p.clubs[0]||null:p.clubs||null}));
    if(count)count.textContent=`${market.length}명`;
    const canOffer=loggedIn();
    box.innerHTML=market.length?market.map((p,i)=>{
      const action=canOffer?`<button type="button" class="market-offer-btn" data-player-id="${esc(p.id)}">이적 제안</button>`:'<em class="status open">시장 등록</em>';
      return `<div class="market-directory-row"><a class="market-player-cell" href="player.html?id=${encodeURIComponent(p.id)}">${p.photo_url?`<img class="market-player-photo" src="${esc(p.photo_url)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:''}<span class="player-rank">${String(i+1).padStart(2,'0')}</span><div class="market-player-main"><div class="market-player-name-line"><b>${esc(p.name)}</b></div><small>${esc(p.position||'미정')} · ${esc(p.nationality||'국적 미상')} · ${esc(p.clubs?.name||'미소속')} · ${esc(age(p))}세 · ${p.shirt_number!=null?`#${p.shirt_number}`:'번호 미등록'}</small></div></a><strong>${money(p.market_value)}</strong>${action}</div>`
    }).join(''):'<div class="loading">현재 이적 가능한 선수가 없습니다.</div>';
    loaded=true;
    if(canOffer){try{if(!(await marketOpen()))document.querySelectorAll('.market-offer-btn').forEach(b=>{b.disabled=true;b.classList.add('closed');b.textContent='시장 닫힘'})}catch(_){}
    }
  }catch(e){console.error('[FTMA] market loader failed',e);if(count)count.textContent='—';box.innerHTML='<div class="loading">이적시장 DB 연결에 실패했습니다. 잠시 후 새로고침해주세요.</div>'}
}
function loadHotfix(){if(document.getElementById('ftmaOfferHotfixScript'))return;const s=document.createElement('script');s.id='ftmaOfferHotfixScript';s.src='transfer-market-offer-hotfix.js?v=20260902opt1';document.head.appendChild(s)}
function boot(){if(document.getElementById('marketList')){loadHotfix();load()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
