/* FTMA: single-pass loan decoration for player detail. Does not rerender the page. */
(()=>{
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const id=new URLSearchParams(location.search).get('id');
  if(!id)return;
  const getLoan=async()=>{
    const r=await fetch(`${URL}/rest/v1/players?select=is_loan&id=eq.${encodeURIComponent(id)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
    if(!r.ok)return false;
    const rows=await r.json();
    return !!rows[0]?.is_loan;
  };
  const apply=isLoan=>{
    const title=document.querySelector('.player-summary-top h2');
    if(title){
      title.querySelector('.player-detail-loan-badge')?.remove();
      if(isLoan){const b=document.createElement('span');b.className='player-loan-badge player-detail-loan-badge';b.textContent='임대';b.title='현재 임대 중';title.appendChild(b)}
    }
    const basic=[...document.querySelectorAll('.detail-list')].find(x=>[...x.querySelectorAll('span')].some(s=>s.textContent.trim()==='상태'));
    if(basic){
      basic.querySelector('.player-loan-detail-row')?.remove();
      const row=document.createElement('div');row.className='player-loan-detail-row';row.innerHTML=`<span>임대 상태</span><b>${isLoan?'<span class="player-loan-badge player-detail-loan-badge">임대 중</span>':'아니오'}</b>`;basic.appendChild(row);
    }
  };
  const observer=new MutationObserver(()=>{
    if(document.querySelector('.player-summary-top h2')){observer.disconnect();getLoan().then(apply).catch(()=>apply(false))}
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.querySelector('.player-summary-top h2')){observer.disconnect();getLoan().then(apply).catch(()=>apply(false))}
})();
