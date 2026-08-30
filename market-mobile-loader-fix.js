/* FTMA mobile market loader fallback: avoids relationship-query failures on phones. */
(function(){
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  let db=null,done=false;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const money=v=>`€${Number(v||0).toFixed(1)}M`;
  const age=p=>typeof window.ftmaAgeOr==='function'?window.ftmaAgeOr(p.birth_date,p.age??'—'):(p.age??'—');
  const session=()=>Boolean(sessionStorage.getItem('ftma_club_id')&&sessionStorage.getItem('ftma_club_session_token'));
  function marketOpen(){return db.rpc('get_transfer_market_state').then(r=>Boolean(r.data?.open)).catch(()=>false)}
  async function load(){
    const box=document.getElementById('marketList'),count=document.getElementById('marketCount');
    if(!box||done)return;
    db=window.supabase.createClient(URL,KEY);
    try{
      const [{data:players,error:pe},{data:clubs,error:ce},open]=await Promise.all([
        db.from('players').select('id,name,photo_url,nationality,position,market_value,current_club_id,age,birth_date,shirt_number,is_loan,is_nfs').order('market_value',{ascending:false}),
        db.from('clubs').select('id,name,logo_url'),
        marketOpen()
      ]);
      if(pe)throw pe;if(ce)throw ce;
      const cmap=new Map((clubs||[]).map(c=>[c.id,c]));
      const market=(players||[]).filter(p=>!p.is_loan&&!p.is_nfs).map(p=>({...p,clubs:cmap.get(p.current_club_id)||null}));
      if(count)count.textContent=`${market.length}명`;
      box.innerHTML=market.length?market.map((p,i)=>{
        const club=p.clubs?.name||'미소속';
        const action=session()?(open?'<button type="button" class="market-offer-btn" data-player-id="'+esc(p.id)+'">이적 제안</button>':'<button type="button" class="market-offer-btn closed" disabled>시장 닫힘</button>'):'<em class="status open">시장 등록</em>';
        return '<div class="market-directory-row"><a class="market-player-cell" href="player.html?id='+encodeURIComponent(p.id)+'">'+(p.photo_url?'<img class="market-player-photo" src="'+esc(p.photo_url)+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async">':'')+'<span class="player-rank">'+String(i+1).padStart(2,'0')+'</span><div class="market-player-main"><div class="market-player-name-line"><b>'+esc(p.name)+'</b></div><small>'+esc(p.position||'미정')+' · '+esc(p.nationality||'국적 미상')+' · '+esc(club)+' · '+age(p)+'세 · '+(p.shirt_number!=null?'#'+p.shirt_number:'번호 미등록')+'</small></div></a><strong>'+money(p.market_value)+'</strong>'+action+'</div>';
      }).join(''):'<div class="loading">현재 이적 가능한 선수가 없습니다.</div>';
      done=true;
      box.querySelectorAll('.market-offer-btn:not(.closed)').forEach(btn=>{
        const p=market.find(x=>String(x.id)===btn.dataset.playerId);
        if(p&&typeof window.openOfferModal==='function')btn.addEventListener('click',()=>window.openOfferModal(p,btn));
      });
    }catch(e){
      console.error('[FTMA] mobile market fallback failed',e);
      box.innerHTML='<div class="loading">데이터를 불러오지 못했습니다. 잠시 후 새로고침해주세요.</div>';
    }
  }
  function boot(){
    const box=document.getElementById('marketList');
    if(!box)return;
    if(window.innerWidth<=700 && box.querySelector('.loading'))setTimeout(load,900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
