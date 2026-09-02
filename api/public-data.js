const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';

const cacheHeaders={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'public, s-maxage=120, stale-while-revalidate=600',
  'CDN-Cache-Control':'public, s-maxage=120, stale-while-revalidate=600'
};

async function supabase(path){
  const r=await fetch(SUPABASE_URL+path,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
  if(!r.ok) throw new Error(`Supabase HTTP ${r.status}`);
  return r.json();
}

const playerFields='id,name,photo_url,nationality,position,ability,potential,market_value,status,current_club_id,age,birth_date,shirt_number,squad_type,is_nfs,is_loan,is_fa,clubs(id,name)';
const clubFields='id,name,country,league,description,logo_url';
const transferFields='id,player_id,from_club_id,to_club_id,from_club_name,to_club_name,from_club_image_url,to_club_image_url,transfer_fee,fee_currency,transfer_date,transfer_type,status,announcement_image_url,notes,created_at,players(name,photo_url,position),from_club:clubs!transfers_from_club_id_fkey(name,logo_url),to_club:clubs!transfers_to_club_id_fkey(name,logo_url)';

export default async function handler(req,res){
  try{
    const u=new URL(req.url,`https://${req.headers.host||'ftam-transfer.vercel.app'}`);
    const resource=u.searchParams.get('resource')||'home';
    const id=u.searchParams.get('id');
    let data;

    if(resource==='home'){
      const [players,clubs,news,transfers]=await Promise.all([
        supabase(`/rest/v1/players?select=${encodeURIComponent(playerFields)}&order=market_value.desc&limit=12`),
        supabase(`/rest/v1/clubs?select=${encodeURIComponent(clubFields)}&order=name.asc`),
        supabase(`/rest/v1/news?select=id,title,summary,cover_image_url,category,published,published_at&published=eq.true&order=published_at.desc&limit=6`),
        supabase(`/rest/v1/transfers?select=${encodeURIComponent(transferFields)}&order=transfer_date.desc&limit=8`)
      ]);
      const [counts]=await Promise.all([
        supabase('/rest/v1/players?select=id&limit=1&prefer=count=exact')
      ]);
      data={players,clubs,news,transfers,counts:{players:null}};
      // Counts are intentionally calculated from compact public datasets when exact count headers are unavailable.
      data.counts={players:players.length,clubs:clubs.length,u20:players.filter(p=>p.squad_type==='u20').length};
    }else if(resource==='market'){
      data=await supabase(`/rest/v1/players?select=${encodeURIComponent('id,name,photo_url,nationality,position,market_value,age,shirt_number,current_club_id,is_loan,is_nfs,is_fa,clubs(id,name)')}&is_loan=eq.false&is_nfs=eq.false&order=market_value.desc`);
    }else if(resource==='players'){
      data=await supabase(`/rest/v1/players?select=${encodeURIComponent(playerFields)}&order=market_value.desc`);
    }else if(resource==='u20'){
      data=await supabase(`/rest/v1/players?select=${encodeURIComponent('id,name,photo_url,nationality,position,ability,potential,market_value,status,current_club_id,age,birth_date,shirt_number,squad_type,clubs(name)')}&squad_type=eq.u20&order=market_value.desc&order=name.asc`);
    }else if(resource==='clubs'){
      data=await supabase(`/rest/v1/clubs?select=${encodeURIComponent(clubFields)}&order=name.asc`);
    }else if(resource==='transfers'){
      data=await supabase(`/rest/v1/transfers?select=${encodeURIComponent(transferFields)}&order=transfer_date.desc&order=created_at.desc`);
    }else if(resource==='news'){
      if(id){
        const rows=await supabase(`/rest/v1/news?select=id,title,summary,body,cover_image_url,category,published,published_at&id=eq.${encodeURIComponent(id)}&published=eq.true&limit=1`);
        data=rows[0]||null;
      }else{
        data=await supabase('/rest/v1/news?select=id,title,summary,cover_image_url,category,published,published_at&published=eq.true&order=published_at.desc');
      }
    }else{
      return res.status(400).setHeader('Content-Type','application/json').json({error:'invalid_resource'});
    }
    return res.status(200).set(cacheHeaders).json(data);
  }catch(e){
    return res.status(502).set(cacheHeaders).json({error:e?.message||'public_data_unavailable'});
  }
}
