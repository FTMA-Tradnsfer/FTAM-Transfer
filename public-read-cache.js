/* FTMA public-read cache bridge. Only rewrites GET/HEAD public list reads; writes/auth stay on Supabase. */
(function(){
'use strict';
if(window.__ftmaPublicReadCacheInstalled)return;
window.__ftmaPublicReadCacheInstalled=true;
const nativeFetch=window.fetch.bind(window);
function resourceFor(url){
  try{
    const u=new URL(url,location.href);
    if(u.origin!=='https://iloanplyuatfcwzovbpb.supabase.co')return null;
    if(!/^\/rest\/v1\/(players|clubs|news|transfers)$/.test(u.pathname))return null;
    if(u.pathname.endsWith('/players')){
      if(u.searchParams.get('squad_type')==='eq.u20')return 'u20';
      if(u.searchParams.get('is_loan')==='eq.false'&&u.searchParams.get('is_nfs')==='eq.false')return 'market';
      return 'players';
    }
    if(u.pathname.endsWith('/clubs'))return 'clubs';
    if(u.pathname.endsWith('/transfers'))return 'transfers';
    if(u.pathname.endsWith('/news'))return u.searchParams.get('id')?.startsWith('eq.')?'news&id='+encodeURIComponent(u.searchParams.get('id').slice(3)):'news';
    return null;
  }catch(_){return null}
}
window.fetch=async function(input,init){
  const method=(init?.method||((input&&input.method)||'GET')).toUpperCase();
  if(method!=='GET')return nativeFetch(input,init);
  const url=typeof input==='string'?input:(input?.url||'');
  const resource=resourceFor(url);
  if(!resource)return nativeFetch(input,init);
  const target=`/api/public-data?resource=${resource}`;
  try{
    const r=await nativeFetch(target,{cache:'default'});
    if(r.ok)return r;
  }catch(_){ }
  return nativeFetch(input,init);
};
})();
