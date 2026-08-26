/* FTMA: season-end dry-run test mode. NEVER mutates season data. */
(function(){
  const URL='https://iloanplyuatfcwzovbpb.supabase.co',KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjK';
  function boot(){
    if(!window.supabase||!document.querySelector('.admin-grid'))return false;
    if(document.getElementById('ftmaSeasonTest'))return true;
    const db=window.supabase.createClient(URL,KEY);
    const card=document.createElement('section');
    card.id='ftmaSeasonTest'; card.className='admin-card admin-wide';
    card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><div><p class="eyebrow">SAFE TEST MODE</p><h2>시즌 종료 테스트</h2><p style="color:#85817a;font-size:10px;line-height:1.7;margin:8px 0 0">실제 시즌을 종료하지 않고 종료 버튼의 동작에 필요한 상태·임대 데이터·이적시장 상태를 점검합니다. 테스트에서는 DB를 변경하지 않습니다.</p></div><button id="ftmaSeasonDryRun" type="button" class="primary-btn" style="width:auto;min-width:170px">시즌 종료 테스트 실행</button></div><div id="ftmaSeasonTestResult" style="margin-top:16px"></div>';
    const grid=document.querySelector('.admin-grid'); grid.appendChild(card);
    const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    document.getElementById('ftmaSeasonDryRun').onclick=async()=>{
      const btn=document.getElementById('ftmaSeasonDryRun'),box=document.getElementById('ftmaSeasonTestResult');
      btn.disabled=true; box.innerHTML='<div style="border:1px solid #303338;background:#0b0d0f;padding:16px;color:#aaa">테스트 중...</div>';
      const checks=[];
      try{
        const {data:settings,error:sErr}=await db.from('site_settings').select('key,value').in('key',['current_season','season_status','transfer_window_status','loan_processing_deadline']);
        if(sErr) throw sErr;
        const m=Object.fromEntries((settings||[]).map(x=>[x.key,x.value]));
        checks.push(['관리자 세션','확인',!!(sessionStorage.getItem('ftma_admin_token'))]);
        checks.push(['현재 시즌',m.current_season||'미설정',!!m.current_season]);
        checks.push(['시즌 상태',m.season_status||'미설정',m.season_status!=='ended']);
        checks.push(['이적시장 상태',m.transfer_window_status||'미설정',m.transfer_window_status==='OPEN'||m.transfer_window_status==='CLOSED']);
        const {data:players,error:pErr}=await db.from('players').select('id,name,is_loan,loan_type,loan_parent_club_id,loan_end_date,loan_buy_option_fee,loan_mandatory_fee').eq('is_loan',true).order('name');
        if(pErr) throw pErr;
        const unknown=(players||[]).filter(p=>!['standard','option','mandatory',null].includes(p.loan_type));
        checks.push(['임대 선수 조회',`${(players||[]).length}명`,!unknown.length]);
        const missingParent=(players||[]).filter(p=>!p.loan_parent_club_id);
        checks.push(['임대 원소속 정보',missingParent.length?`${missingParent.length}명 미설정`:'모두 설정',missingParent.length===0]);
        const missingType=(players||[]).filter(p=>!p.loan_type);
        checks.push(['임대 유형',missingType.length?`${missingType.length}명 미설정`:'모두 설정',missingType.length===0]);
        const rows=checks.map(c=>`<div style="display:flex;justify-content:space-between;gap:12px;border-top:1px solid #292c30;padding:11px 0;font-size:11px"><span>${esc(c[0])}</span><span style="color:${c[2]?'#9be0b1':'#f1aaa4'}">${esc(c[1])} · ${c[2]?'정상':'확인 필요'}</span></div>`).join('');
        const ok=checks.every(c=>c[2]);
        box.innerHTML=`<div style="border:1px solid ${ok?'#385844':'#69403d'};background:#0b0d0f;padding:16px"><div style="font-size:15px;font-weight:800;color:${ok?'#9be0b1':'#f1aaa4'}">${ok?'시즌 종료 실행 조건 점검 완료':'시즌 종료 전 확인이 필요한 항목이 있습니다.'}</div><div style="margin-top:10px">${rows}</div><div style="margin-top:12px;color:#77736b;font-size:9px">※ 이 테스트는 site_settings, players 어느 곳에도 값을 저장하거나 변경하지 않았습니다.</div></div>`;
      }catch(e){ box.innerHTML=`<div style="border:1px solid #69403d;background:#0b0d0f;color:#f1aaa4;padding:16px">테스트 실패: ${esc(e.message||e)}</div>`; }
      finally{btn.disabled=false;}
    };
    return true;
  }
  if(!boot()){let n=0;const t=setInterval(()=>{if(boot()||++n>100)clearInterval(t)},100)}
})();
