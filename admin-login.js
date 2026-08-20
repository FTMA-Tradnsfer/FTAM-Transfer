(function(){
  'use strict';
  if(window.__FTMA_ADMIN_LOGIN_BOUND__) return;
  window.__FTMA_ADMIN_LOGIN_BOUND__=true;

  const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const form=document.getElementById('adminLoginForm');
  const lock=document.getElementById('adminLock');
  const app=document.getElementById('adminApp');
  const input=document.getElementById('adminPassword');
  const button=document.getElementById('adminLoginButton');
  const error=document.getElementById('adminLoginError');
  if(!form||!lock||!app||!input||!button||!error)return;

  // Admin authentication is intentionally session-scoped.
  // Never persist the privileged token in localStorage: a shared/public browser
  // profile must not inherit an administrator session across tabs or visits.
  const getToken=()=>sessionStorage.getItem('ftma_admin_token')||'';
  const getExpires=()=>sessionStorage.getItem('ftma_admin_expires')||'';
  const clearSession=()=>{sessionStorage.removeItem('ftma_admin_token');sessionStorage.removeItem('ftma_admin_expires');localStorage.removeItem('ftma_admin_token');localStorage.removeItem('ftma_admin_expires');};
  const busy=v=>{button.disabled=v;button.textContent=v?'로그인 확인 중...':'관리자 페이지 입장'};

  function showApp(){
    document.body.classList.remove('admin-locked');
    document.body.dataset.adminAuthenticated='true';
    app.hidden=false;
    app.style.display='block';
    if(lock&&lock.parentNode)lock.remove();
  }

  function restoreSession(){
    const token=getToken();
    const expires=getExpires();
    if(!token)return false;
    if(expires){
      const time=Date.parse(expires);
      if(Number.isFinite(time)&&time<=Date.now()){clearSession();return false;}
    }
    showApp();
    return true;
  }

  function saveSession(data){
    if(!data||data.ok!==true||typeof data.token!=='string'||!data.token)throw new Error(data?.message||'관리자 세션을 받지 못했습니다.');
    const expires=data.expires_at||'';
    sessionStorage.setItem('ftma_admin_token',data.token);
    sessionStorage.setItem('ftma_admin_expires',expires);
    // Do not write the privileged token to localStorage.
    localStorage.removeItem('ftma_admin_token');
    localStorage.removeItem('ftma_admin_expires');
  }

  async function requestJson(url,options,timeoutMs){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{
      const response=await fetch(url,{...options,cache:'no-store',signal:controller.signal});
      const text=await response.text();
      let data=null;
      try{data=text?JSON.parse(text):null}catch(_){throw new Error('서버 응답이 올바른 JSON이 아닙니다.');}
      if(!response.ok)throw new Error(data?.message||data?.error||text||('HTTP '+response.status));
      return data;
    }catch(e){
      if(e?.name==='AbortError')throw new Error('TIMEOUT');
      throw e;
    }finally{clearTimeout(timer)}
  }

  async function callProxy(password){
    return requestJson('/api/admin-login',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({password})},8000);
  }

  async function callDirectRpc(password){
    return requestJson(`${SUPABASE_URL}/rest/v1/rpc/ftma_admin_login`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({p_password:password})},8000);
  }

  async function login(){
    if(button.disabled)return;
    const password=input.value;
    if(!password){error.textContent='관리자 비밀번호를 입력해주세요.';input.focus();return;}
    busy(true);error.textContent='';
    try{
      let data;
      try{data=await callProxy(password)}catch(proxyError){data=await callDirectRpc(password)}
      saveSession(data);
      input.value='';
      showApp();
      busy(false);
      if(typeof window.refreshAdminData==='function')Promise.resolve(window.refreshAdminData()).catch(()=>{});
    }catch(err){
      error.textContent='로그인 실패: '+(err?.message==='TIMEOUT'?'로그인 서버 응답 시간이 초과되었습니다. 다시 시도해주세요.':(err?.message||'알 수 없는 오류'));
      busy(false);input.focus();
    }
  }

  document.addEventListener('submit',e=>e.preventDefault(),true);
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key==='NumpadEnter')&&document.activeElement===input){
      e.preventDefault();
      e.stopImmediatePropagation();
      login();
    }
  },true);
  button.type='button';
  button.addEventListener('click',login);

  // Remove any legacy persistent admin token immediately.
  localStorage.removeItem('ftma_admin_token');
  localStorage.removeItem('ftma_admin_expires');

  if(!restoreSession()){
    clearSession();
    button.disabled=false;
    button.textContent='관리자 페이지 입장';
  }
  window.addEventListener('pageshow',restoreSession);
})();
