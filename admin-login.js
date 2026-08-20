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

  const getToken=()=>sessionStorage.getItem('ftma_admin_token')||localStorage.getItem('ftma_admin_token')||'';
  const getExpires=()=>sessionStorage.getItem('ftma_admin_expires')||localStorage.getItem('ftma_admin_expires')||'';
  const clearSession=()=>['ftma_admin_token','ftma_admin_expires'].forEach(k=>{sessionStorage.removeItem(k);localStorage.removeItem(k)});
  const busy=v=>{button.disabled=v;button.textContent=v?'로그인 확인 중...':'관리자 페이지 입장'};
  const showApp=()=>{lock.hidden=true;app.hidden=false;document.body.classList.remove('admin-locked');};

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
    try{
      sessionStorage.setItem('ftma_admin_token',data.token);
      sessionStorage.setItem('ftma_admin_expires',expires);
      localStorage.setItem('ftma_admin_token',data.token);
      localStorage.setItem('ftma_admin_expires',expires);
    }catch(_){
      throw new Error('브라우저 저장소에 관리자 세션을 저장할 수 없습니다. 브라우저의 사이트 데이터 차단을 해제해주세요.');
    }
  }

  async function requestJson(url,options,timeoutMs){
    const controller=new AbortController();
    const request=(async()=>{
      const response=await fetch(url,{...options,cache:'no-store',signal:controller.signal});
      const text=await response.text();
      let data=null;
      try{data=text?JSON.parse(text):null}catch(_){throw new Error('서버 응답이 올바른 JSON이 아닙니다.');}
      if(!response.ok)throw new Error(data?.message||data?.error||text||('HTTP '+response.status));
      return data;
    })();
    const timeout=new Promise((_,reject)=>setTimeout(()=>{controller.abort();reject(new Error('TIMEOUT'))},timeoutMs));
    return Promise.race([request,timeout]);
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
      showApp();
      busy(false);
      input.value='';
      // Do not navigate or submit the form. Keep the authenticated admin UI on this page.
      if(typeof window.refreshAdminData==='function')window.refreshAdminData();
    }catch(err){
      const message=err?.message==='TIMEOUT'?'로그인 서버 응답 시간이 초과되었습니다. 다시 시도해주세요.':(err?.message||'알 수 없는 오류');
      error.textContent='로그인 실패: '+message;
      busy(false);input.focus();
    }
  }

  // Hard-block native form navigation at the document capture phase.
  document.addEventListener('submit',e=>e.preventDefault(),true);
  form.addEventListener('submit',e=>e.preventDefault());
  form.noValidate=true;
  button.type='button';
  button.addEventListener('click',login);
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
      e.preventDefault();
      e.stopPropagation();
      login();
    }
  });

  if(!restoreSession()){
    clearSession();
    button.disabled=false;
    button.textContent='관리자 페이지 입장';
  }
})();
