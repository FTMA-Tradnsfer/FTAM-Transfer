/* FTMA: show manually controlled loan status inside club squad */
(()=>{
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  async function apply(){
    const id=new URLSearchParams(location.search).get('id');
    if(!id)return;
    try{
      const r=await fetch(`${URL}/rest/v1/players?select=id,is_loan&current_club_id=eq.${encodeURIComponent(id)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
      if(!r.ok)return;
      const rows=await r.json();
      const loans=new Set((rows||[]).filter(p=>p.is_loan).map(p=>String(p.id)));
      document.querySelectorAll('.squad-player').forEach(a=>{
        const pid=new URL(a.href,location.href).searchParams.get('id');
        const name=a.querySelector('b');
        if(!name)return;
        a.querySelector('.club-squad-loan-badge')?.remove();
        if(loans.has(String(pid))){
          const badge=document.createElement('span');
          badge.className='player-loan-badge club-squad-loan-badge';
          badge.textContent='임대';
          badge.title='현재 임대 중';
          name.insertAdjacentElement('afterend',badge);
        }
      });
    }catch(e){console.warn('[FTMA club loan display]',e)}
  }
  setTimeout(apply,0);
  setTimeout(apply,250);
})();
