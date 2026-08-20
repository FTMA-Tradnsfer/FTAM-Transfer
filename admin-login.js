(function(){
  'use strict';
  if(window.__FTMA_ADMIN_LOGIN_BOUND__) return;
  window.__FTMA_ADMIN_LOGIN_BOUND__=true;

  const form=document.getElementById('adminLoginForm');
  if(!form) return;
  const lock=document.getElementById('adminLock');
  const app=document.getElementById('adminApp');
  const input=document.getElementById('adminPassword');
  const button=document.getElementById('adminLoginButton');
  const error=document.getElementById('adminLoginError');
  const URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';

  const clearSession=()=>{
    sessionStorage.removeItem('ftma_admin_token');
    sessionStorage.removeItem('ftma_admin_expires');
    localStorage.removeItem('ftma_admin_token');
    localStorage.removeItem('ftma_admin_expires');
  };

  const setBusy=(busy)=>{
    button.disabled=busy;
    button.textContent=busy?'로그인 확인 중...':'관리자 페이지 입장';
  };

  const openAdmin=(data)=>{
    if(!data||data.ok!==true||!data.token) throw new Error(data?.message||'관리자 세션을 받지 못했습니다.');
    sessionStorage.setItem('ftma_admin_token',data.token);
    sessionStorage.setItem('ftma_admin_expires',data.expires_at||'');
    localStorage.setItem('ftma_admin_token',data.token);
    localStorage.setItem('ftma_admin_expires',data.expires_at||'');
    lock.hidden=true;
    app.hidden=false;
    document.body.classList.remove('admin-locked');
    if(typeof window.refreshAdminData==='function') window.refreshAdminData();
  };

  async function waitForSupabase(){
    const started=Date.now();
    while(!window.supabase){
      if(Date.now()-started>5000) throw new Error('Supabase 인증 모듈을 불러오지 못했습니다. 페이지를 새로고침해주세요.');
      await new Promise(r=>setTimeout(r,50));
    }
    return window.supabase.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  }

  async function login(e){
    e?.preventDefault();
    if(button.disabled) return;
    const password=input.value;
    if(!password){error.textContent='관리자 비밀번호를 입력해주세요.';return;}
    setBusy(true);
    error.textContent='';
    try{
      const client=await waitForSupabase();
      const result=await Promise.race([
        client.rpc('ftma_admin_login',{p_password:password}),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('인증 서버 응답 시간이 초과되었습니다.')),8000))
      ]);
      if(result.error) throw new Error(result.error.message||'인증 서버 오류');
      openAdmin(result.data);
    }catch(err){
      error.textContent='로그인 실패: '+(err?.message||'알 수 없는 오류');
      setBusy(false);
      input.focus();
    }
  }

  clearSession();
  form.addEventListener('submit',login);
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
      e.preventDefault();
      form.requestSubmit();
    }
  });
})();
