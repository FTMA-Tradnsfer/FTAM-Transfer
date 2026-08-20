(function(){
  const form=document.getElementById('adminLoginForm');
  if(!form) return;
  const old=form;
  const fresh=old.cloneNode(true);
  old.replaceWith(fresh);
  const input=fresh.querySelector('#adminPassword');
  const button=fresh.querySelector('#adminLoginButton');
  const error=fresh.querySelector('#adminLoginError');
  const lock=document.getElementById('adminLock');
  const app=document.getElementById('adminApp');
  const openAdmin=(data)=>{
    if(!data?.token) throw new Error(data?.message||'관리자 세션을 받지 못했습니다.');
    sessionStorage.setItem('ftma_admin_token',data.token);
    sessionStorage.setItem('ftma_admin_expires',data.expires_at||'');
    lock.hidden=true; app.hidden=false; document.body.classList.remove('admin-locked');
    if(typeof window.refreshAdminData==='function') window.refreshAdminData();
  };
  fresh.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(!input.value) return;
    button.disabled=true; button.textContent='로그인 확인 중...'; error.textContent='';
    try{
      if(!window.supabase?.createClient) throw new Error('인증 모듈을 불러오지 못했습니다.');
      const client=window.supabase.createClient('https://iloanplyuatfcwzovbpb.supabase.co','sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM');
      const {data,error:invokeError}=await client.functions.invoke('ftma-admin-login',{body:{password:input.value}});
      if(invokeError) throw new Error(invokeError.message||'관리자 인증 서버에 연결하지 못했습니다.');
      openAdmin(data);
    }catch(err){
      error.textContent='로그인 실패: '+(err?.message||'알 수 없는 오류');
      button.disabled=false; button.textContent='관리자 페이지 입장'; input.focus();
    }
  });
})();
