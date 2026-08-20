const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
let players=[],clubs=[];
const money=v=>`€${Number(v||0).toFixed(1)}M`;
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
async function loadData(){
  const [{data:p,error:pe},{data:c,error:ce}]=await Promise.all([
    db.from('players').select('id,name,nationality,position,ability,potential,market_value,status,current_club_id,age,clubs(name)').order('market_value',{ascending:false}),
    db.from('clubs').select('id,name,country,league').order('name')
  ]);
  if(pe||ce){console.error(pe||ce);return showError('FTMA 데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');}
  players=p||[];clubs=c||[];render(players,clubs);
}
function render(ps,cs){
  document.getElementById('playerCount').textContent=ps.length;
  document.getElementById('clubCount').textContent=cs.length;
  const u20=ps.filter(p=>Number(p.age||99)<20).length;
  document.getElementById('u20Count').textContent=u20;
  document.getElementById('dashPlayers').textContent=ps.length;
  document.getElementById('dashClubs').textContent=cs.length;
  document.getElementById('dashU20').textContent=u20;
  const total=ps.reduce((a,p)=>a+Number(p.market_value||0),0);
  document.getElementById('marketValue').textContent=money(total);
  document.getElementById('totalValue').textContent=money(total);
  document.getElementById('marketRows').innerHTML=ps.length?ps.map((p,i)=>`<article class="player-row"><div class="player"><span class="avatar">${String(i+1).padStart(2,'0')}</span><span><b>${esc(p.name)}</b><small>${esc(p.nationality||'미상')} • ${esc(p.age??'유망주')}</small></span></div><span>${esc(p.position||'미정')}</span><span>${esc(p.clubs?.name||'자유계약')}</span><strong>${money(p.market_value)}</strong><em class="status ${p.status==='available'?'open':'hot'}">${p.status==='available'?'시장 등록':'기록 관리'}</em></article>`).join(''):'<div class="loading">등록된 선수가 없습니다.</div>';
  document.getElementById('playerGrid').innerHTML=ps.map(p=>`<article class="profile-card"><div class="rating">${p.ability??'—'}</div><span class="position">${esc(p.position||'미정')}</span><h3>${esc(p.name)}</h3><p>${esc(p.nationality||'미상')} • ${esc(p.clubs?.name||'자유계약')}</p><div class="profile-meta"><span>어빌 <b>${p.ability??'—'}</b></span><span>포텐 <b>${p.potential??'—'}</b></span><span>시장가치 <b>${money(p.market_value)}</b></span></div></article>`).join('');
  document.getElementById('clubGrid').innerHTML=cs.map(c=>`<div class="club-card"><span>${esc((c.name||'FT').slice(0,2).toUpperCase())}</span><b>${esc(c.name)}</b><small>${esc(c.league||'판타지 리그')}</small></div>`).join('');
}
function showError(msg){document.getElementById('marketRows').innerHTML=`<div class="loading">${esc(msg)}</div>`}
document.getElementById('loginBtn').addEventListener('click',()=>alert('구단 로그인 기능은 현재 제공하지 않습니다. FTMA는 이적시장 기록 및 선수·구단 데이터 관리용으로 운영됩니다.'));
loadData();
