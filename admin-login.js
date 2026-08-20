(function(){
  'use strict';
  const form=document.getElementById('adminLoginForm');
  if(!form)return;
  const lock=document.getElementById('adminLock'),app=document.getElementById('adminApp'),input=document.getElementById('adminPassword'),button=document.getElementById('adminLoginButton'),error=document.getElementById('adminLoginError');
  const API='https://iloanplyuatfcwzovbpb.supabase.co/rest/v1/rpc/ftma_admin_login';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const clearSession=()=>{sessionStorage.removeItem('ftma_admin_token');sessionStorage.removeItem('ftma_admin_expires');localStorage.removeItem('ftma_admin_token');localStorage.removeItem('ftma_admin_expires')};
  const open=(d)=>{if(!d||d.ok!==true||!d.token)throw new Error(d?.message||'관리자 세션을 받지 못했습니다.');sessionStorage.setItem('ftma_admin_token',d.token);sessionStorage.setItem('ftma_admin_expires',d.expires_at||'');localStorage.setItem('ftma_admin_token',d.token);localStorage.setItem('ftma_admin_expires',d.expires_at||'');lock.hidden=true;app.hidden=false;document.body.classList.remove('admin-locked');if(typeof window.refreshAdminData==='function')window.refreshAdminData()};
  async function login(e){e?.preventDefault();const password=input.value;if(!password)return;button.disabled=true;button.textContent='로그인 확인 중...';error.textContent='';const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{const r=await fetch(API,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({p_password:password}),cache:'no-store',signal:controller.signal});const text=await r.text();let d=null;try{d=text?JSON.parse(text):null}catch{}if(!r.ok)throw new Error(d?.message||text||`인증 서버 오류 (${r.status})`);open(d)}catch(err){error.textContent=err.name==='AbortError'?'인증 서버 응답 시간이 초과되었습니다.':'로그인 실패: '+(err.message||'알 수 없는 오류');button.disabled=false;button.textContent='관리자 페이지 입장';input.focus()}finally{clearTimeout(timer)}}
  clearSession();
  form.addEventListener('submit',login);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();login(e)}});
})();
