/* FTMA fast transfer-market loader: query only eligible market players and render once. */
(function(){
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  let db,loaded=false;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const money=v=>`€${Number(v||0).toFixed(1)}M`;
  const age=p=>p.age??'—';
  const loggedIn=()=>Boolean(sessionStorage.getItem('ftma_club_id')&&sessionStorage.getItem('ftma_club_session_token'));
  const timeout=p=>Promise.race([p,new Promise(r=>setTimeout(()=>r(null),5000))]);

  async function load(){
    const box=document.getElementById('marketList'),count=document.getElementById('marketCount');
    if(!box||loaded)return;
    db=window.supabase.createClient(URL,KEY);
    box.innerHTML='<div class="loading">이적시장 데이터를 불러오는 중입니다...</div>';
    try{
      /* Important: never download the entire players table and filter in JS. */
      const r=await timeout(
        db.from('players')
          .select('id,name,photo_url,nationality,position,market_value,age,birth_date,shirt_number,is_loan,is_nfs,clubs(name)')
          .eq('is_loan',false)
          .eq('is_nfs',false)
          .order('market_value',{ascending:false})
          .limit(1000)
      );
      if(!r||r.error)throw(r?.error||new Error('players timeout'));
      const market=r.data||[];
      if(count)count.textContent=`${market.length}명`;
      const canOffer=loggedIn();
      box.innerHTML=market.length?market.map((p,i)=>{
        const club=Array.isArray(p.clubs)?p.clubs[0]:p.clubs;
        const action=canOffer
          ?`<button type="button" class="market-offer-btn" data-player-id="${esc(p.id)}">이적 제안</button>`
          :'<em class="status open">시장 등록</em>';
        return `<div class="market-directory-row"><a class="market-player-cell" href="player.html?id=${encodeURIComponent(p.id)}">${p.photo_url?`<img class="market-player-photo" src="${esc(p.photo_url)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:''}<span class="player-rank">${String(i+1).padStart(2,'0')}</span><div class="market-player-main"><div class="market-player-name-line"><b>${esc(p.name)}</b></div><small>${esc(p.position||'미정')} · ${esc(p.nationality||'국적 미상')} · ${esc(club?.name||'미소속')} · ${esc(age(p))}세 · ${p.shirt_number!=null?`#${p.shirt_number}`:'번호 미등록'}</small></div></a><strong>${money(p.market_value)}</strong>${action}</div>`;
      }).join(''):'<div class="loading">현재 이적 가능한 선수가 없습니다.</div>';
      loaded=true;

      /* Market-window state is deliberately checked after rendering. */
      if(canOffer){
        timeout(db.rpc('get_transfer_market_state')).then(s=>{
          if(!s)return;
          const open=!s.error&&Boolean(s.data?.open);
          if(!open)document.querySelectorAll('.market-offer-btn').forEach(b=>{b.disabled=true;b.classList.add('closed');b.textContent='시장 닫힘'});
        });
      }
    }catch(e){
      console.error('[FTMA] fast market loader failed',e);
      if(count)count.textContent='0명';
      box.innerHTML='<div class="loading">이적시장 데이터를 불러오지 못했습니다. 잠시 후 새로고침해주세요.</div>';
    }
  }

  function boot(){if(document.getElementById('marketList'))load()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
