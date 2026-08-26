/* FTMA: season end + 2-day loan processing controls */
(function(){
  const URL='https://iloanplyuatfcwzovbpb.supabase.co',KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjK';
  function boot(){
    if(!window.supabase||!document.querySelector('.admin-grid'))return false;
    if(document.getElementById('ftmaSeasonTools'))return true;
    const db=window.supabase.createClient(URL,KEY),token=()=>sessionStorage.getItem('ftma_admin_token')||'';
    const sec=document.createElement('section');sec.id='ftmaSeasonTools';sec.className='admin-card admin-wide';
    sec.innerHTML='<h2>시즌 운영</h2><div style="border:1px solid #514731;background:#0c0e10;padding:18px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><div><div id="ftmaSeasonState" style="font-size:18px;font-weight:800">시즌 상태 확인 중...</div><div id="ftmaLoanDeadline" style="color:#999;font-size:10px;margin-top:7px"></div></div><button id="ftmaSeasonEndBtn" class="primary-btn" type="button">시즌 종료</button></div><p style="color:#85817a;font-size:10px;line-height:1.7;margin-top:14px">시즌 종료를 실행하면 이적시장이 닫히고, 종료 시점부터 2일 동안 임대 선수 처리를 진행합니다. 일반 임대 / 완전이적 옵션 임대 / 필수 이적 임대를 구분합니다.</p><div id="ftmaLoanList" style="margin-top:18px"></div>';
    document.querySelector('.admin-grid').appendChild(sec);
    async function load(){
      const {data}=await db.from('site_settings').select('key,value').in('key',['current_season','season_status','loan_processing_deadline']);
      const m=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));
      const ended=m.season_status==='ended';
      document.getElementById('ftmaSeasonState').textContent=`${m.current_season||'현재'} 시즌 · ${ended?'종료':'진행 중'}`;
      document.getElementById('ftmaLoanDeadline').textContent=m.loan_processing_deadline?`임대 처리 마감: ${new Date(m.loan_processing_deadline).toLocaleString('ko-KR')}`:'시즌 종료 전';
      const btn=document.getElementById('ftmaSeasonEndBtn');btn.disabled=ended;
      const {data:ps}=await db.from('players').select('id,name,current_club_name,is_loan,loan_type,loan_buy_option_fee,loan_mandatory_fee').eq('is_loan',true).order('name');
      const box=document.getElementById('ftmaLoanList');
      if(!ps?.length){box.innerHTML='<div style="color:#777;font-size:10px">현재 임대 중인 선수가 없습니다.</div>';return}
      box.innerHTML='<div style="font-size:14px;font-weight:800;margin-bottom:10px">임대 선수 처리</div>'+ps.map(p=>{const typ=p.loan_type==='mandatory'?'필수 이적 임대':p.loan_type==='option'?'완전이적 옵션 임대':'일반 임대';const fee=p.loan_type==='mandatory'?p.loan_mandatory_fee:p.loan_type==='option'?p.loan_buy_option_fee:null;return `<div style="border-top:1px solid #2b2e32;padding:12px 0;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><b>${String(p.name||'').replace(/[&<>]/g,'')}</b><span style="color:#888;font-size:10px"> · ${typ} · ${p.current_club_name||'미상'}${fee!=null?' · €'+Number(fee).toFixed(1)+'M':''}</span></div></div>`}).join('');
    }
    document.getElementById('ftmaSeasonEndBtn').onclick=async()=>{const ok=confirm('시즌을 종료할까요? 시즌 종료 즉시 이적시장이 닫히고 임대 처리 기간 2일이 시작됩니다.');if(!ok)return;const b=document.getElementById('ftmaSeasonEndBtn');b.disabled=true;try{const {data,error}=await db.rpc('ftma_admin_season_end',{p_token:token()});if(error)throw error;if(!data?.success)throw new Error(data?.code||'시즌 종료 실패');await load();alert('시즌이 종료되었습니다. 임대 처리는 2일 이내 가능합니다.')}catch(e){b.disabled=false;alert(e.message||'시즌 종료 처리에 실패했습니다.')}};
    load();return true;
  }
  if(!boot()){let n=0;const t=setInterval(()=>{if(boot()||++n>100)clearInterval(t)},100)}
})();