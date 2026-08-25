const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const sessionClub=sessionStorage.getItem('ftma_club_id');
const requestedClub=new URLSearchParams(location.search).get('id');
const id=sessionClub||requestedClub;
if(!id){location.replace('club-login.html');throw new Error('no club session');}
if(sessionClub&&requestedClub&&sessionClub!==requestedClub){location.replace(`club-dashboard.html?id=${encodeURIComponent(sessionClub)}`);throw new Error('club session mismatch');}
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
const money=v=>v==null||v===''?'€—':`€${Number(v||0).toFixed(1)}M`;
const age=p=>p.birth_date?Math.floor((Date.now()-new Date(`${p.birth_date}T00:00:00+09:00`))/31557600000):(p.age??'—');
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value??'';}
function showError(message){const box=document.getElementById('squad');if(box)box.innerHTML=`<p class="dash-error">${esc(message)}</p>`;}
async function boot(){
  try{
    const [{data:c,error:ce},{data:players,error:pe}]=await Promise.all([
      db.from('clubs').select('id,name,league').eq('id',id).single(),
      db.from('players').select('id,name,photo_url,position,market_value,shirt_number,squad_type,birth_date,age,is_loan').eq('current_club_id',id).order('squad_type').order('shirt_number',{ascending:true,nullsFirst:false}).order('name')
    ]);
    if(ce)throw new Error(`구단 정보를 불러오지 못했습니다: ${ce.message||ce.code||'조회 오류'}`);
    if(pe)throw new Error(`선수단을 불러오지 못했습니다: ${pe.message||pe.code||'조회 오류'}`);
    if(!c)throw new Error('구단 정보를 찾을 수 없습니다.');
    document.title=`FTMA | ${c.name}`;setText('clubName',c.name);setText('clubLeague',c.league||'리그 미정');
    const publicClub=document.getElementById('publicClub');if(publicClub)publicClub.href=`club.html?id=${encodeURIComponent(id)}`;
    const list=players||[];setText('playerCount',list.length);setText('firstCount',list.filter(p=>p.squad_type!=='u20').length);setText('u20Count',list.filter(p=>p.squad_type==='u20').length);
    const squad=document.getElementById('squad');
    if(squad)squad.innerHTML=list.length?list.map(p=>`<a class="squad-card" href="player.html?id=${encodeURIComponent(p.id)}">${p.photo_url?`<img src="${esc(p.photo_url)}" alt="${esc(p.name)}" loading="lazy">`:''}<div><b>${esc(p.name)}${p.is_loan?` <span class="loan-inline">· 임대</span>`:''}</b><small>${esc(p.position||'포지션 미정')} · ${age(p)}세 · ${p.shirt_number!=null?'#'+p.shirt_number:'등번호 미정'} · ${money(p.market_value)}</small></div></a>`).join(''):'<p>등록된 선수가 없습니다.</p>';
  }catch(e){console.error('FTMA club dashboard load failed',e);setText('clubName','구단 정보를 불러오지 못했습니다');setText('clubLeague','');showError(e.message||'잠시 후 새로고침해 주세요.');}
}
document.getElementById('logoutBtn')?.addEventListener('click',()=>{sessionStorage.removeItem('ftma_club_id');sessionStorage.removeItem('ftma_club_login_at');location.href='club-login.html'});
boot();