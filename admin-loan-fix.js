/* FTMA: structured loan controls - fixed global bindings */
(function(){
  function install(){
    if(typeof editPlayerF!=='function'||typeof modalF!=='function'||typeof selectF!=='function'||typeof fieldF!=='function')return false;
    if(window.__ftmaLoanEditorInstalled)return true;
    window.__ftmaLoanEditorInstalled=true;
    const base=editPlayerF;
    editPlayerF=async function(id){
      const p=dataF.players.find(x=>x.id===id);if(!p)return base(id);
      let fresh=p;
      try{const rows=await getF(`${AMF_URL}/rest/v1/players?select=id,name,photo_url,nationality,position,birth_date,age,ability,potential,market_value,current_club_id,shirt_number,squad_type,is_loan,status,loan_type,loan_end_date,loan_parent_club_id,loan_buy_option_fee,loan_mandatory_fee&id=eq.${encodeURIComponent(id)}`);if(rows[0])fresh=rows[0]}catch(e){console.warn('[FTMA loan]',e)}
      const clubs=dataF.clubs||[];
      const clubOptions=[{v:'',t:'원소속 구단 미지정'},...clubs.map(c=>({v:c.id,t:c.name}))];
      const m=modalF('선수 정보 수정',fieldF('name','선수명',fresh.name)+fieldF('nationality','국적',fresh.nationality||'')+fieldF('position','포지션',fresh.position||'')+fieldF('birth_date','생년월일',fresh.birth_date||'','date')+fieldF('age','나이',fresh.age??'','number')+fieldF('ability','어빌',fresh.ability??'','number')+fieldF('potential','포텐',fresh.potential??'','number')+fieldF('market_value','시장가치',fresh.market_value??'','number')+selectF('current_club_id','현재 소속 구단',fresh.current_club_id||'',[{v:'',t:'미소속'},...clubs.map(c=>({v:c.id,t:c.name}))])+selectF('squad_type','선수단 유형',fresh.squad_type||'first_team',[{v:'first_team',t:'1군'},{v:'u20',t:'U20'}])+fieldF('shirt_number','등번호',fresh.shirt_number??'','number')+selectF('is_loan','현재 임대 상태',String(!!fresh.is_loan),[{v:'false',t:'아니오 — 임대 아님'},{v:'true',t:'예 — 현재 임대 중'}])+selectF('loan_type','임대 유형',fresh.loan_type||'general',[{v:'general',t:'일반 임대'},{v:'option',t:'완전이적 옵션 임대'},{v:'mandatory',t:'필수 이적 임대'}])+selectF('loan_parent_club_id','임대 원소속 구단',fresh.loan_parent_club_id||'',clubOptions)+fieldF('loan_end_date','임대 종료일',fresh.loan_end_date||'','date')+fieldF('loan_buy_option_fee','완전이적 옵션 금액 (€M)',fresh.loan_buy_option_fee??'','number')+fieldF('loan_mandatory_fee','필수 이적 금액 (€M)',fresh.loan_mandatory_fee??'','number')+fileF('photo_file','선수 이미지 교체',fresh.photo_url)+`<div style="grid-column:1/-1;border:1px solid #514731;background:#151719;padding:12px;color:#9d9587;font-size:9px;line-height:1.6">임대 선수라면 <b style="color:#e2c985">임대 원소속 구단</b>을 지정하세요. 일반 임대는 복귀, 옵션 임대는 완전이적 또는 복귀, 필수 이적 임대는 완전이적으로 처리됩니다.</div>`);
      m.querySelector('[data-save]').onclick=async()=>{const b=m.querySelector('[data-save]'),e=m.querySelector('.fix-error');b.disabled=true;b.textContent='저장 중...';try{const f=new FormData(m.querySelector('form')),loan=String(f.get('is_loan'))==='true',num=n=>{const v=f.get(n);return v===''||v==null?null:Number(v)};const pyl={name:String(f.get('name')||''),nationality:String(f.get('nationality')||''),position:String(f.get('position')||''),birth_date:String(f.get('birth_date')||''),age:num('age'),ability:num('ability'),potential:num('potential'),market_value:num('market_value'),current_club_id:String(f.get('current_club_id')||''),squad_type:String(f.get('squad_type')||'first_team'),shirt_number:num('shirt_number'),is_loan:loan,loan_type:loan?String(f.get('loan_type')||'general'):null,loan_parent_club_id:loan?(String(f.get('loan_parent_club_id')||'')||null):null,loan_end_date:loan?(String(f.get('loan_end_date')||'')||null):null,loan_buy_option_fee:loan?num('loan_buy_option_fee'):null,loan_mandatory_fee:loan?num('loan_mandatory_fee'):null};const file=f.get('photo_file');if(file instanceof File&&file.size)pyl.photo_url=await uploadF(file,'players');await mutateF('players','update',id,pyl);m.remove();messageF('선수 정보와 임대 조건이 저장되었습니다.');await loadManagerF()}catch(x){e.textContent=x.message;b.disabled=false;b.textContent='저장'}};
    };return true;
  }
  if(!install()){let n=0;const t=setInterval(()=>{if(install()||++n>100)clearInterval(t)},100)}
})();

/* FTMA: the admin page already loads this loan-fix file, so use it as the stable entry point for the finance approval UI. */
(function(){
  function loadFinanceScript(){
    if(window.__ftmaFinanceScriptLoaded||document.querySelector('script[data-ftma-finance]'))return;
    window.__ftmaFinanceScriptLoaded=true;
    const s=document.createElement('script');
    s.src='finance-admin-section.js?v=20260829finance1';
    s.dataset.ftmaFinance='1';
    s.async=false;
    s.onload=()=>window.refreshFinanceApprovals?.();
    s.onerror=()=>console.error('[FTMA finance] finance-admin-section.js failed to load');
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFinanceScript,{once:true});
  else loadFinanceScript();
})();

/* FTMA: load half-season return controls. */
(function(){
  function loadHalfSeasonControls(){
    if(window.__ftmaHalfSeasonControlsLoaded||document.querySelector('script[data-ftma-half-season]'))return;
    window.__ftmaHalfSeasonControlsLoaded=true;
    const s=document.createElement('script');
    s.src='admin-half-season-loan.js?v=20260831half1';
    s.dataset.ftmaHalfSeason='1';
    s.async=false;
    s.onload=()=>window.ftmaRenderHalfSeasonLoans?.();
    s.onerror=()=>console.error('[FTMA loan] half-season controls failed to load');
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadHalfSeasonControls,{once:true});
  else loadHalfSeasonControls();
})();
