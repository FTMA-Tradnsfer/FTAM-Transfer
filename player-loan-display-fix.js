/* FTMA: show manually controlled loan status on player detail */
(()=>{
  const original=window.loadPlayerDetail;
  if(typeof original!=='function')return;
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  async function getLoan(id){
    const r=await fetch(`${URL}/rest/v1/players?select=is_loan&id=eq.${encodeURIComponent(id)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
    if(!r.ok)return false;
    const rows=await r.json();
    return !!rows[0]?.is_loan;
  }
  function applyLoanBadge(isLoan){
    document.querySelectorAll('.player-detail-loan-badge').forEach(x=>x.remove());
    const title=document.querySelector('.player-summary-top h2');
    if(title&&isLoan){
      const badge=document.createElement('span');
      badge.className='player-loan-badge player-detail-loan-badge';
      badge.textContent='임대';
      badge.title='현재 임대 중';
      title.appendChild(badge);
    }
    const lists=document.querySelectorAll('.detail-list');
    const basic=[...lists].find(x=>[...x.querySelectorAll('span')].some(s=>s.textContent.trim()==='상태'));
    if(basic){
      basic.querySelector('.player-loan-detail-row')?.remove();
      const row=document.createElement('div');
      row.className='player-loan-detail-row';
      row.innerHTML=`<span>임대 상태</span><b>${isLoan?'<span class="player-loan-badge player-detail-loan-badge">임대 중</span>':'아니오'}</b>`;
      basic.appendChild(row);
    }
  }
  window.loadPlayerDetail=async function(){
    const p=await original();
    if(!p?.id)return p;
    try{applyLoanBadge(await getLoan(p.id))}catch(e){console.warn('[FTMA loan display]',e)}
    return p;
  };
  const id=new URLSearchParams(location.search).get('id');
  if(id)setTimeout(async()=>{try{applyLoanBadge(await getLoan(id))}catch(e){console.warn('[FTMA loan display initial]',e)}},0);
})();
