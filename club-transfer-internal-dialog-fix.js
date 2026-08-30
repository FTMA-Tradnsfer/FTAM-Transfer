(function(){
  const esc2=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const money2=v=>`€${Number(v||0).toFixed(Number(v)%1?'1':'0')}M`;
  const activeStatuses=new Set(['pending','countered']);
  const financeFor=(clubId,excludeId=null)=>{
    const total=Number(realClub?.transfer_budget||0);
    const reserved=(realOffers||[]).filter(o=>o.buying_club_id===clubId&&o.id!==excludeId&&activeStatuses.has(o.status)).reduce((sum,o)=>sum+Number(o.effective_fee??o.counter_fee??o.fee??0),0);
    return {total,reserved,available:total-reserved};
  };
  const dialog=(message,{title='FTMA',input=null,textarea=null,ok='확인',cancel=null,onOk=null}={})=>{
    document.getElementById('ftmaInternalDialog')?.remove();
    const ov=document.createElement('div');ov.id='ftmaInternalDialog';ov.className='ftma-id-overlay';
    ov.innerHTML=`<div class="ftma-id-modal" role="dialog" aria-modal="true"><div class="ftma-id-kicker">FTMA TRANSFER</div><h3>${esc2(title)}</h3><div class="ftma-id-message">${esc2(message).replace(/\n/g,'<br>')}</div>${input?`<label class="ftma-id-label">${esc2(input.label)}<input id="ftmaIdInput" type="number" min="0.1" step="0.1" value="${esc2(input.value??'')}"></label>`:''}${textarea?`<label class="ftma-id-label">${esc2(textarea.label)}<textarea id="ftmaIdTextarea">${esc2(textarea.value??'')}</textarea></label>`:''}<div class="ftma-id-actions">${cancel?`<button class="ftma-id-btn" id="ftmaIdCancel">${esc2(cancel)}</button>`:''}<button class="ftma-id-btn primary" id="ftmaIdOk">${esc2(ok)}</button></div></div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.querySelector('#ftmaIdCancel')?.addEventListener('click',close);
    ov.addEventListener('click',e=>{if(e.target===ov)close()});
    ov.querySelector('#ftmaIdOk').addEventListener('click',()=>{const result={value:ov.querySelector('#ftmaIdInput')?.value??null,text:ov.querySelector('#ftmaIdTextarea')?.value??null};close();onOk?.(result)});
    setTimeout(()=>ov.querySelector('#ftmaIdInput')?.focus(),0);
    return close;
  };
  const style=document.createElement('style');style.id='ftmaInternalDialogStyle';style.textContent=`
  .ftma-id-overlay{position:fixed;inset:0;z-index:10080;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.78);backdrop-filter:blur(7px)}
  .ftma-id-modal{width:min(500px,100%);box-sizing:border-box;background:#141619;border:1px solid #4b4537;box-shadow:0 24px 90px rgba(0,0,0,.7);padding:26px;color:#eee}
  .ftma-id-kicker{color:#caa968;font-size:9px;letter-spacing:.18em;font-weight:900}.ftma-id-modal h3{margin:8px 0 10px;font-size:23px}.ftma-id-message{color:#aaa69e;font-size:11px;line-height:1.75;padding:12px 0}.ftma-id-label{display:block;color:#aaa69e;font-size:10px;margin-top:12px}.ftma-id-label input,.ftma-id-label textarea{display:block;width:100%;box-sizing:border-box;margin-top:6px;background:#0a0c0e;border:1px solid #3a3d42;color:#eee;padding:11px;outline:0}.ftma-id-label textarea{min-height:90px;resize:vertical}.ftma-id-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.ftma-id-btn{border:1px solid #45484d;background:#181a1d;color:#ddd;padding:11px 17px;font-size:10px;font-weight:800;cursor:pointer}.ftma-id-btn.primary{background:#caa968;border-color:#caa968;color:#111}
  `;document.head.appendChild(style);

  window.alert=message=>{let text=String(message);const selected=(realOffers||[]).find(o=>o.id===realSelected);if(selected&&selected.selling_club_id===realClubId&&text.includes('진행 중 협상으로 예약된 자금이 있어 이적 자금이 부족합니다.'))text=text.replace('진행 중 협상으로 예약된 자금이 있어 이적 자금이 부족합니다.','상대 구단의 가용 이적자금이 부족합니다.');dialog(text,{title:'이적 자금 부족'});};

  window.realCounter=async id=>{
    const o=(realOffers||[]).find(x=>x.id===id);if(!o)return;
    const current=o.effective_fee??o.fee;
    dialog('',{title:'역제안 보내기',input:{label:'역제안 금액 (€M)',value:current},textarea:{label:'역제안 기타 조건',value:(o.counter_terms||o.terms||{}).other_terms||''},cancel:'취소',ok:'역제안 보내기',onOk:async ({value,text})=>{
      const n=Number(value);if(!Number.isFinite(n)||n<=0)return dialog('0보다 큰 금액을 입력해주세요.',{title:'입력 오류'});
      const base=o.status==='countered'&&o.counter_terms?o.counter_terms:o.terms||{};await rAct(id,'counter',n,{...base,other_terms:String(text??'').trim()});
    }});
  };

  const patchFinance=()=>{
    const selected=(realOffers||[]).find(o=>o.id===realSelected)||null;
    const f=financeFor(realClubId,selected?.id||null);
    document.querySelectorAll('.money-box strong').forEach(el=>{el.textContent=money2(f.available)});
    const status=document.querySelector('#rightContent .status');
    if(status&&selected){
      const incoming=selected.selling_club_id===realClubId;
      if(incoming){
        const bf=financeFor(selected.buying_club_id,selected.id);
        status.innerHTML=`현재 상태: <b>${rStatus(selected.status)}</b><br>상대 구단 총 이적자금: <b>${money2(bf.total)}</b><br>상대 구단 예약 자금: <b>${money2(bf.reserved)}</b><br>상대 구단 가용 이적자금: <b>${money2(bf.available)}</b>`;
      }else{
        status.innerHTML=`현재 상태: <b>${rStatus(selected.status)}</b><br>가용 이적자금: <b>${money2(f.available)}</b>${f.reserved>0?`<br>예약 자금: <b>${money2(f.reserved)}</b>`:''}`;
      }
    }
  };
  const originalRender=window.rRender;
  window.rRender=function(){originalRender();patchFinance();};
  setTimeout(patchFinance,0);
})();
