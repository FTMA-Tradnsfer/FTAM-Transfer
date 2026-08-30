/* FTMA: refresh complete player loan data before opening the admin editor. */
(()=>{
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  let tries=0;
  const install=()=>{
    if(typeof window.openPlayerEditor!=='function'){
      if(++tries<100)setTimeout(install,50);
      return;
    }
    if(window.__ftmaLoanEditorRefresh)return;
    window.__ftmaLoanEditorRefresh=true;
    const base=window.openPlayerEditor;
    window.openPlayerEditor=async function(player){
      try{
        const r=await fetch(`${URL}/rest/v1/players?select=id,name,photo_url,nationality,position,birth_date,age,ability,potential,market_value,current_club_id,shirt_number,squad_type,status,is_loan,loan_type,loan_end_date,loan_parent_club_id,loan_buy_option_fee,loan_mandatory_fee&id=eq.${encodeURIComponent(player.id)}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
        if(r.ok){const rows=await r.json();if(rows[0])player={...player,...rows[0]};}
      }catch(e){console.warn('[FTMA loan editor]',e)}
      return base(player);
    };
  };
  install();
})();
