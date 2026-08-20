(function(){
  const form=document.getElementById('adminLoginForm');
  if(!form)return;
  const fresh=form.cloneNode(true);form.replaceWith(fresh);
  const input=fresh.querySelector('#adminPassword'),button=fresh.querySelector('#adminLoginButton'),error=fresh.querySelector('#adminLoginError');
  const lock=document.getElementById('adminLock'),app=document.getElementById('adminApp');
  const API='https://iloanplyuatfcwzovbpb.supabase.co';
  const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  function openAdmin(data){
    if(!data?.token)throw new Error(data?.message||'관리자 세션을 받지 못했습니다.');
    sessionStorage.setItem('ftma_admin_token',data.token);
    sessionStorage.setItem('ftma_admin_expires',data.expires_at||'');
    lock.hidden=true;app.hidden=false;document.body.classList.remove('admin-locked');
    if(typeof window.refreshAdminData==='function')window.refreshAdminData();
  }
  fresh.addEventListener('submit',async e=>{
    e.preventDefault();
    const password=input.value;
    if(!password)return;
    button.disabled=true;button.textContent='로그인 확인 중...';error.textContent='';
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
    try{
      const r=await fetch(API+'/rest/v1/rpc/ftma_admin_login',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({p_password:password}),cache:'no-store',signal:controller.signal});
      const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{}
      if(!r.ok)throw new Error(data?.message||text||`인증 서버 오류 (${r.status})`);
      if(data?.ok!==true)throw new Error(data?.message||'비밀번호가 올바르지 않습니다.');
      openAdmin(data);
    }catch(err){
      error.textContent=err.name==='AbortError'?'인증 요청 시간이 초과되었습니다.':'로그인 실패: '+(err.message||'알 수 없는 오류');
      button.disabled=false;button.textContent='관리자 페이지 입장';input.focus();
    }finally{clearTimeout(timer)}
  });
})();
