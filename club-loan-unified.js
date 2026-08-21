/* FTMA: show loan state inside the club squad without rebuilding squad markup. */
(()=>{
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const clubId=new URLSearchParams(location.search).get('id');
  if(!clubId)return;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const load=async()=>{
    const r=await fetch(`${URL}/rest/v1/players?select=id,is_loan&current_club_id=eq.${encodeURIComponent(clubId)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
    if(!r.ok)return;
    const rows=await r.json();
    const loans=new Set(rows.filter(p=>p.is_loan).map(p=>String(p.id)));
    document.querySelectorAll('.squad-player').forEach(a=>{
      const id=new URL(a.href,location.href).searchParams.get('id');
      a.querySelector('.squad-loan-badge')?.remove();
      if(loans.has(String(id))){const b=document.createElement('span');b.className='player-loan-badge squad-loan-badge';b.textContent='임대';b.title='현재 임대 중';const name=a.querySelector('div b');if(name)name.appendChild(b)}
    });
  };
  const observer=new MutationObserver(()=>{if(document.querySelector('.squad-player')){load();observer.disconnect()}});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.querySelector('.squad-player')){observer.disconnect();load()}
})();
