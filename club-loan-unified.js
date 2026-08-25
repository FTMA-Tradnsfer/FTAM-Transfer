/* FTMA: show loan state inside the club squad reliably after squad render. */
(()=>{
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const clubId=new URLSearchParams(location.search).get('id');
  if(!clubId)return;
  const load=async()=>{
    try{
      const r=await fetch(`${URL}/rest/v1/players?select=id,is_loan&current_club_id=eq.${encodeURIComponent(clubId)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
      if(!r.ok)throw new Error(`loan query ${r.status}`);
      const rows=await r.json();
      const loans=new Set(rows.filter(p=>p.is_loan===true).map(p=>String(p.id)));
      document.querySelectorAll('.squad-player').forEach(a=>{
        const id=new URL(a.href,location.href).searchParams.get('id');
        a.querySelector('.squad-loan-badge')?.remove();
        if(loans.has(String(id))){
          const b=document.createElement('span');
          b.className='player-loan-badge squad-loan-badge';
          b.textContent='임대';
          b.title='현재 임대 중';
          const name=a.querySelector('div b');
          if(name)name.appendChild(b);
        }
      });
      return true;
    }catch(e){console.warn('FTMA squad loan badge failed',e);return false}
  };
  let tries=0;
  const run=async()=>{
    if(!document.querySelector('.squad-player'))return;
    if(await load())return;
    if(++tries<8)setTimeout(run,300);
  };
  const observer=new MutationObserver(()=>run());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  run();
  setTimeout(()=>observer.disconnect(),5000);
})();
