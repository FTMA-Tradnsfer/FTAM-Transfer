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

  // 관리자 로그인은 브라우저의 Supabase JS SDK에 의존하지 않고
  // REST RPC 한 경로만 사용한다. 따라서 CDN 로딩 여부와 관계없이 로그인 가능하다.
  const RPC='https://iloanplyuatfcwzovbpb.supabase.co/rest/v1/rpc/ftma_admin_login';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';

  const clearSession=()=>{
    ['ftma_admin_token','ftma_admin_expires'].forEach(k=>{
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    });
  };

  const busy=(yes)=>{
    button.disabled=yes;
    button.textContent=yes?'로그인 확인 중...':'관리자 페이지 입장';
  };

  const openAdmin=(data)=>{
    if(!data||data.ok!==true||!data.token){
      throw new Error(data?.message||'관리자 세션을 받지 못했습니다.');
    }
    sessionStorage.setItem('ftma_admin_token',data.token);
    sessionStorage.setItem('ftma_admin_expires',data.expires_at||'');
    localStorage.setItem('ftma_admin_token',data.token);
    localStorage.setItem('ftma_admin_expires',data.expires_at||'');
    lock.hidden=true;
    app.hidden=false;
    document.body.classList.remove('admin-locked');
    if(typeof window.refreshAdminData==='function')window.refreshAdminData();
  };

  async function login(e){
    e.preventDefault();
    if(button.disabled)return;
    const password=input.value;
    if(!password){error.textContent='관리자 비밀번호를 입력해주세요.';return;}

    busy(true);
    error.textContent='';

    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),7000);
    try{
      const response=await fetch(RPC,{
        method:'POST',
        mode:'cors',
        cache:'no-store',
        signal:controller.signal,
        headers:{
          'apikey':KEY,
          'Authorization':'Bearer '+KEY,
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        body:JSON.stringify({p_password:password})
      });

      const text=await response.text();
      let data=null;
      try{data=text?JSON.parse(text):null}catch(_){data=null;}

      if(!response.ok){
        throw new Error(data?.message||text||('인증 서버 오류 ('+response.status+')'));
      }
      openAdmin(data);
    }catch(err){
      error.textContent=err?.name==='AbortError'
        ?'인증 서버 응답 시간이 초과되었습니다. 다시 시도해주세요.'
        :'로그인 실패: '+(err?.message||'알 수 없는 오류');
      busy(false);
      input.focus();
    }finally{
      clearTimeout(timer);
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
