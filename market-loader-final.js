/* FTMA final transfer-market loader: independent of directory.js relation queries. */
(function(){
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  let db,loaded=false;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const money=v=>`€${Number(v||0).toFixed(1)}M`;
  const age=p=>typeof window.ftmaAgeOr==='function'?window.ftmaAgeOr(p.birth_date,p.age??'—'):(p.age??'—');
  const loggedIn=()=>Boolean(sessionStorage.getItem('ftma_club_id')&&sessionStorage.getItem('ftma_club_session_token'));
  async function load(){
    const box=document.getElementById('marketList'),count=document.getElementById('marketCount');
    if(!box||loaded)return;
    db=window.supabase.createClient(URL,KEY);
    box.innerHTML='<div class="loading">이적시장 데이터를 불러오는 중입니다...</div>';
    try{
      const {data:players,error:pe}=await db.from('players').select('id,name,photo_url,nationality,position,market_value,current_club_id,age,birth_date,shirt_number,is_loan,is_nfs').order('market_value',{ascending:false});
      if(pe)throw pe;
      let clubs=[];
      try{const r=await db.from('clubs').select('id,name,logo_url');if(!r.error)clubs=r.data||[]}catch(_){clubs=[]}
      const cmap=new Map(clubs.map(c=>[String(c.id),c]));
      const market=(players||[]).filter(p=>!p.is_loan&&!p.is_nfs).map(p=>({...p,club:cmap.get(String(p.current_club_id))||null}));
      if(count)count.textContent=`${market.length}명`;
      const open=await db.rpc('get_transfer_market_state').then(r=>!r.error&&Boolean(r.data?.open)).catch(()=>false);
      const canOffer=loggedIn()&&open;
      box.innerHTML=market.length?market.map((p,i)=>{
        const action=loggedIn()?(canOffer?`<button type="button" class="market-offer-btn" data-player-id="${esc(p.id)}">이적 제안</button>`:`<button type="button" class="market-offer-btn closed" disabled>시장 닫힘</button>`):'<em class="status open">시장 등록</em>';
        return `<div class="market-directory-row"><a class="market-player-cell" href="player.html?id=${encodeURIComponent(p.id)}">${p.photo_url?`<img class="market-player-photo" src="${esc(p.photo_url)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:''}<span class="player-rank">${String(i+1).padStart(2,'0')}</span><div class="market-player-main"><div class="market-player-name-line"><b>${esc(p.name)}</b></div><small>${esc(p.position||'미정')} · ${esc(p.nationality||'국적 미상')} · ${esc(p.club?.name||'미소속')} · ${age(p)}세 · ${p.shirt_number!=null?`#${p.shirt_number}`:'번호 미등록'}</small></div></a><strong>${money(p.market_value)}</strong>${action}</div>`;
      }).join(''):'<div class="loading">현재 이적 가능한 선수가 없습니다.</div>';
      loaded=true;
    }catch(e){
      console.error('[FTMA] final market loader failed',e);
      if(count)count.textContent='0명';
      box.innerHTML='<div class="loading">이적시장 데이터를 불러오지 못했습니다. 잠시 후 새로고침해주세요.</div>';
    }
  }
  function boot(){if(document.getElementById('marketList'))load()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
