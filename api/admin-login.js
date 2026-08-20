export default async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({ok:false,message:'Method Not Allowed'});
  }
  try{
    const password=typeof req.body==='string'?JSON.parse(req.body||'{}').password:req.body?.password;
    if(!password) return res.status(400).json({ok:false,message:'관리자 비밀번호를 입력해주세요.'});

    const url='https://iloanplyuatfcwzovbpb.supabase.co/rest/v1/rpc/ftma_admin_login';
    const key='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),7000);
    try{
      const r=await fetch(url,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({p_password:password}),signal:controller.signal,cache:'no-store'});
      const text=await r.text();
      let data=null;try{data=text?JSON.parse(text):null}catch{}
      if(!r.ok)return res.status(502).json({ok:false,message:data?.message||text||`Supabase 인증 오류 (${r.status})`});
      if(!data?.ok||!data?.token)return res.status(401).json({ok:false,message:data?.message||'관리자 인증에 실패했습니다.'});
      res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
      return res.status(200).json(data);
    }finally{clearTimeout(timer)}
  }catch(e){
    return res.status(e?.name==='AbortError'?504:500).json({ok:false,message:e?.name==='AbortError'?'인증 서버 응답 시간이 초과되었습니다.':'관리자 인증 서버 오류'});
  }
}
