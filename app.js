const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
let players=[],clubs=[];
const money=v=>`€${Number(v||0).toFixed(1)}M`;
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
async function loadData(){
  const [{data:p,error:pe},{data:c,error:ce},{data:o,error:oe}]=await Promise.all([
    db.from('players').select('id,name,nationality,position,ability,potential,market_value,status,current_club_id,clubs(name)').order('market_value',{ascending:false}),
    db.from('clubs').select('id,name,country,league').order('name'),
    db.from('transfer_offers').select('id,status,fee')
  ]);
  if(pe||ce||oe){console.error(pe||ce||oe);return showError('FTMA 데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');}
  players=p||[];clubs=c||[];const offers=o||[];render(players,clubs,offers);
}
function render(ps,cs,offers){
  document.getElementById('playerCount').textContent=ps.length;document.getElementById('clubCount').textContent=cs.length;
  const pending=offers.filter(x=>x.status==='pending');document.getElementById('pendingCount').textContent=pending.length;document.getElementById('offerCount').textContent=`진행 중인 제안 ${pending.length}건`;
  const total=ps.reduce((a,p)=>a+Number(p.market_value||0),0);document.getElementById('marketValue').textContent=money(total);document.getElementById('totalValue').textContent=money(total);
  document.getElementById('marketRows').innerHTML=ps.length?ps.map((p,i)=>`<article class="player-row"><div class="player"><span class="avatar">${String(i+1).padStart(2,'0')}</span><span><b>${esc(p.name)}</b><small>${esc(p.nationality||'미상')} • ${p.age||'유망주'}</small></span></div><span>${esc(p.position||'미정')}</span><span>${esc(p.clubs?.name||'자유계약')}</span><strong>${money(p.market_value)}</strong><em class="status ${p.status==='available'?'open':'hot'}">${p.status==='available'?'영입 가능':'영입 경쟁'}</em></article>`).join(''):'<div class="loading">등록된 선수가 없습니다.</div>';
  document.getElementById('playerGrid').innerHTML=ps.map(p=>`<article class="profile-card"><div class="rating">${p.ability??'—'}</div><span class="position">${esc(p.position||'미정')}</span><h3>${esc(p.name)}</h3><p>${esc(p.nationality||'미상')} • ${esc(p.clubs?.name||'자유계약')}</p><div class="profile-meta"><span>어빌 <b>${p.ability??'—'}</b></span><span>포텐 <b>${p.potential??'—'}</b></span><span>시장가치 <b>${money(p.market_value)}</b></span></div></article>`).join('');
  document.getElementById('clubGrid').innerHTML=cs.map(c=>`<div class="club-card"><span>${esc((c.name||'FT').slice(0,2).toUpperCase())}</span><b>${esc(c.name)}</b><small>${esc(c.league||'판타지 리그')}</small></div>`).join('');
  document.getElementById('offerPlayer').innerHTML=ps.map(p=>`<option value="${p.id}">${esc(p.name)} — ${money(p.market_value)}</option>`).join('');document.getElementById('offerClub').innerHTML=cs.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
}
function showError(msg){document.getElementById('marketRows').innerHTML=`<div class="loading">${esc(msg)}</div>`}
const dialog=document.getElementById('offerDialog');
document.getElementById('offerBtn').addEventListener('click',()=>dialog.showModal());document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
document.getElementById('offerForm').addEventListener('submit',async e=>{e.preventDefault();const playerId=document.getElementById('offerPlayer').value,clubId=document.getElementById('offerClub').value,fee=Number(document.getElementById('offerFee').value);const player=players.find(p=>p.id===playerId);const msg=document.getElementById('offerMessage');if(!player||fee<0){msg.textContent='입력한 내용을 확인해주세요.';return}const {error}=await db.from('transfer_offers').insert({player_id:playerId,buying_club_id:clubId,selling_club_id:player.current_club_id,fee,status:'pending'});if(error){console.error(error);msg.textContent='영입 제안을 등록하지 못했습니다.';return}msg.textContent='영입 제안이 이적시장에 등록되었습니다.';document.getElementById('offerForm').reset();await loadData();setTimeout(()=>dialog.close(),700)});
document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>document.querySelectorAll('.nav a').forEach(x=>x.classList.remove('active'))));
document.getElementById('loginBtn').addEventListener('click',()=>alert('구단 로그인 기능은 다음 단계에서 연결할 수 있습니다.'));
loadData();
