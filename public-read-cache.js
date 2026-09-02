/* FTMA public-read cache bridge. Only rewrites GET public list reads; writes/auth stay on Supabase. */
(function(){
'use strict';
if(window.__ftmaPublicReadCacheInstalled)return;
window.__ftmaPublicReadCacheInstalled=true;
const nativeFetch=window.fetch.bind(window);
function resourceFor(url){
 try{
  const u=new URL(url,location.href);
  if(u.origin!=='https://iloanplyuatfcwzovbpb.supabase.co'||!/^\/rest\/v1\/(players|clubs|news|transfers)$/.test(u.pathname))return null;
  if(u.pathname.endsWith('/players')){
   const select=u.searchParams.get('select')||'';
   if(select==='current_club_id')return null;
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
 const url=typeof input==='string'?input:(input?.url||''),resource=resourceFor(url);
 if(!resource)return nativeFetch(input,init);
 try{const r=await nativeFetch(`/api/public-data?resource=${resource}`,{cache:'default'});if(r.ok)return r}catch(_){}
 return nativeFetch(input,init);
};
})();
