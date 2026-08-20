(function(){
  'use strict';
  if(window.__FTMA_ADMIN_LOGIN_BOUND__) return;
  window.__FTMA_ADMIN_LOGIN_BOUND__=true;

  const form=document.getElementById('adminLoginForm');
  const lock=document.getElementById('adminLock');
  const app=document.getElementById('adminApp');
  const input=document.getElementById('adminPassword');
  const button=document.getElementById('adminLoginButton');
  const error=document.getElementById('adminLoginError');
  if(!form||!lock||!app||!input||!button||!error)return;

  const LOGIN_FUNCTION='https://iloanplyuatfcwzovbpb.supabase.co/functions/v1/ftma-admin-login';
  const clearSession=()=>['ftma_admin_token','ftma_admin_expires'].forEach(k=>{sessionStorage.removeItem(k);localStorage.removeItem(k)});
  const busy=v=>{button.disabled=v;button.textContent=v?'로그인 확인 중...':'관리자 페이지 입장'};
  const openAdmin=data=>{
    if(!data||data.ok!==true||!data.token)throw new Error(data?.message||'관리자 세션을 받지 못했습니다.');
    sessionStorage.setItem('ftma_admin_token',data.token);
    sessionStorage.setItem('ftma_admin_expires',data.expires_at||'');
    localStorage.setItem('ftma_admin_token',data.token);
    localStorage.setItem('ftma_admin_expires',data.expires_at||'');
    lock.hidden=true;app.hidden=false;document.body.classList.remove('admin-locked');
    if(typeof window.refreshAdminData==='function')window.refreshAdminData();
  };
  async function login(e){
    e.preventDefault();
    if(button.disabled)return;
    const password=input.value;
    if(!password){error.textContent='관리자 비밀번호를 입력해주세요.';return;}
    busy(true);error.textContent='';
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch(LOGIN_FUNCTION,{method:'POST',mode:'cors',credentials:'omit',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({password}),cache:'no-store',signal:controller.signal});
      const text=await response.text();
      let data=null;try{data=text?JSON.parse(text):null}catch(_){data=null;}
      if(!response.ok)throw new Error(data?.message||text||('로그인 서버 오류 ('+response.status+')'));
      openAdmin(data);
    }catch(err){
      error.textContent=err?.name==='AbortError'?'로그인 서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.':'로그인 실패: '+(err?.message||'알 수 없는 오류');
      busy(false);input.focus();
    }finally{clearTimeout(timer)}
  }

  clearSession();
  button.disabled=false;
  button.textContent='관리자 페이지 입장';
  form.addEventListener('submit',login);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();form.requestSubmit()}});
})();
