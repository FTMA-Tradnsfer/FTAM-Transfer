/* FTMA: player detail editor loan-state bridge */
(()=>{
  const original=window.openPlayerEditor;
  if(typeof original!=='function')return;
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  window.openPlayerEditor=async player=>{
    try{
      const r=await fetch(`${URL}/rest/v1/players?select=is_loan&id=eq.${encodeURIComponent(player.id)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
      const rows=await r.json();
      if(r.ok&&rows[0])player={...player,is_loan:!!rows[0].is_loan};
    }catch(e){console.warn('[FTMA loan state]',e)}
    return original(player);
  };
})();
