(function(){
  'use strict';
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const ADMIN_MUTATE=URL+'/rest/v1/rpc/ftma_admin_mutate';
  const labels={default:'기본 테마',summer:'☀️ SUMMER TRANSFER WINDOW',winter:'🎄 CHRISTMAS TRANSFER WINDOW'};
  const token=()=>sessionStorage.getItem('ftma_admin_token')||'';
  const headers=()=>({apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'});
  const get=async()=>{const r=await fetch(`${URL}/rest/v1/site_settings?select=value&key=eq.active_theme&limit=1`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});if(!r.ok)throw new Error('테마 정보를 불러오지 못했습니다.');const d=await r.json();return d?.[0]?.value||'default'};
  const set=async theme=>{const t=token();if(!t)throw new Error('관리자 세션이 없습니다. 다시 로그인해주세요.');const r=await fetch(ADMIN_MUTATE,{method:'POST',headers:headers(),body:JSON.stringify({p_token:t,p_table:'site_settings',p_operation:'upsert',p_id:null,p_payload:{key:'active_theme',value:theme}}),cache:'no-store'});const text=await r.text();let d=null;try{d=text?JSON.parse(text):null}catch{}if(!r.ok)throw new Error(d?.message||text||`HTTP ${r.status}`);return d};
  function mount(){
    if(document.getElementById('ftmaThemePanel'))return;
    const grid=document.querySelector('.admin-grid');if(!grid)return;
    const s=document.createElement('section');s.id='ftmaThemePanel';s.className='admin-card admin-wide ftma-theme-panel';s.innerHTML=`<p class="eyebrow">SITE THEME CONTROL</p><h2>이적시장 테마</h2><p>관리자만 전체 사이트의 활성 테마를 변경할 수 있습니다. 기존 기본 테마는 삭제되지 않습니다.</p><div class="ftma-theme-buttons"><button type="button" data-theme-button="default">기본 테마</button><button type="button" data-theme-button="summer">☀️ 여름 이적시장</button><button type="button" data-theme-button="winter">🎄 크리스마스 이적시장</button></div><div class="ftma-theme-status" id="ftmaThemeStatus"></div>`;
    grid.appendChild(s);
    s.querySelectorAll('[data-theme-button]').forEach(b=>b.onclick=async()=>{const theme=b.dataset.themeButton;const status=document.getElementById('ftmaThemeStatus');s.querySelectorAll('button').forEach(x=>x.disabled=true);status.textContent='저장 중...';try{await set(theme);window.FTMATheme?.apply(theme);s.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.themeButton===theme));status.textContent=`현재 활성 테마: ${labels[theme]}`;}catch(e){status.textContent='저장 실패: '+e.message}finally{s.querySelectorAll('button').forEach(x=>x.disabled=false)}});
    get().then(theme=>{window.FTMATheme?.apply(theme);s.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.themeButton===theme));document.getElementById('ftmaThemeStatus').textContent=`현재 활성 테마: ${labels[theme]||labels.default}`}).catch(e=>{document.getElementById('ftmaThemeStatus').textContent=e.message});
  }
  const wait=()=>{if(document.body?.dataset.adminAuthenticated==='true')mount();else setTimeout(wait,250)};wait();
})();