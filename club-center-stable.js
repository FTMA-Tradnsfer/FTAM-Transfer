(()=>{
const U='https://iloanplyuatfcwzovbpb.supabase.co',K='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
const cid=()=>sessionStorage.getItem('ftma_club_id')||localStorage.getItem('ftma_club_id')||'';
const tok=()=>sessionStorage.getItem('ftma_club_session_token')||localStorage.getItem('ftma_club_session_token')||'';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
const money=v=>`€${Number(v||0).toFixed(Number(v)%1?'1':'0')}M`;
const status=s=>({pending:'협상 중',countered:'역제안 도착',accepted:'합의 완료',rejected:'거절됨',withdrawn:'철회됨'}[s]||'종료');
const ago=d=>{const m=Math.max(0,Math.floor((Date.now()-new Date(d))/60000));return m<1?'방금 전':m<60?m+'분 전':m<1440?Math.floor(m/60)+'시간 전':Math.floor(m/1440)+'일 전'};
const left=d=>{const m=Math.max(0,Math.floor((new Date(d)-Date.now())/60000));return m<1?'곧 만료':m<1440?Math.floor(m/60)+'시간 '+m%60+'분 남음':Math.floor(m/1440)+'일 '+Math.floor(m%1440/60)+'시간 남음'};
let offers=[],events=[],favs=[],clubs=[],filter='all';
function timeout(ms){return new Promise((_,rej)=>setTimeout(()=>rej(new Error('DB 응답 시간 초과')),ms))}
async function request(path,opt={},ms=6500){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(U+path,{...opt,signal:c.signal,headers:{apikey:K,Authorization:`Bearer ${K}`,'Content-Type':'application/json',...(opt.headers||{})},cache:'no-store'});const text=await r.text();let d=null;try{d=text?JSON.parse(text):null}catch{}if(!r.ok)throw new Error(d?.message||text||`HTTP ${r.status}`);return d}finally{clearTimeout(t)}}
async function rpc(name,body){return request('/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(body||{})})}
function failBox(id,msg){const e=$(id);if(e)e.innerHTML=`<div class="center-empty">${esc(msg)}</div>`}
async function load(){
 if(!cid()||!tok()){location.replace('club-login.html');return}
 // Do not gate the entire page on one slow RPC. Each panel has its own timeout/fallback.
 const results=await Promise.allSettled([
  rpc('get_club_transfer_offers',{p_session_token:tok()}),
  request('/rest/v1/clubs?select=id,name,logo_url,transfer_budget&order=name'),
  rpc('get_club_favorites',{p_session_token:tok()}),
  rpc('get_club_transfer_activity',{p_session_token:tok()})
 ]);
 const [o,c,f,a]=results;
 if(o.status==='fulfilled'&&o.value?.success)offers=o.value.offers||[];else if(o.status==='fulfilled'&&o.value?.code==='invalid_session'){location.replace('club-login.html');return}
 if(c.status==='fulfilled')clubs=Array.isArray(c.value)?c.value:[];
 if(f.status==='fulfilled'&&f.value?.success)favs=f.value.favorites||[];
 if(a.status==='fulfilled'&&a.value?.success)events=a.value.events||[];
 render();
 if(o.status==='rejected'||!o.value?.success)failBox('offers','협상 데이터를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.');
 if(c.status==='rejected')console.warn('[FTMA club center] clubs:',c.reason);
 if(f.status==='rejected'||!f.value?.success)failBox('favorites','관심 선수 데이터를 불러오지 못했습니다.');
 if(a.status==='rejected'||!a.value?.success)failBox('activity','협상 활동 데이터를 불러오지 못했습니다.');
}
function logo(id){return clubs.find(c=>c.id===id)?.logo_url||''}
function chip(id,n){return `<span class="club-chip">${logo(id)?`<img src="${esc(logo(id))}" alt="">`:'<span style="width:20px;height:20px;display:grid;place-items:center;border:1px solid #303338">FT</span>'}<span>${esc(n||'구단')}</span></span>`}
function summary(){const c=clubs.find(x=>x.id===cid()),active=offers.filter(o=>['pending','countered'].includes(o.status)),out=active.filter(o=>o.buying_club_id===cid());const reserved=out.reduce((s,o)=>s+Number(o.reservation_amount??o.effective_fee??o.fee??0),0);const unread=offers.filter(o=>['pending','countered'].includes(o.status)&&o.last_action_by&&o.last_action_by!==cid()&&localStorage.getItem('ftma_notice_'+o.id)!=='1').length;$('summary').innerHTML=`<div class="center-stat"><span>가용 이적자금</span><strong>${money(Math.max(0,Number(c?.transfer_budget||0)-reserved))}</strong><small>보유 ${money(c?.transfer_budget)} · 예약 ${money(reserved)}</small></div><div class="center-stat"><span>진행 중 협상</span><strong>${active.length}</strong><small>받은 ${active.filter(o=>o.selling_club_id===cid()).length} · 보낸 ${out.length}</small></div><div class="center-stat"><span>읽지 않은 알림</span><strong>${unread}</strong><small>새 제안 · 역제안</small></div><div class="center-stat"><span>관심 선수</span><strong>${favs.length}</strong><small>구단별 저장 목록</small></div>`}
function tabs(){const n={all:offers.length,active:offers.filter(o=>['pending','countered'].includes(o.status)).length,in:offers.filter(o=>o.selling_club_id===cid()).length,out:offers.filter(o=>o.buying_club_id===cid()).length};$('filters').innerHTML=[['all','전체'],['active','진행 중'],['in','받은 제안'],['out','보낸 제안']].map(x=>`<button class="center-tab ${filter===x[0]?'active':''}" data-f="${x[0]}">${x[1]} ${n[x[0]]||0}</button>`).join('');$('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.f;offersView()})}
function offersView(){let l=offers.slice();if(filter==='active')l=l.filter(o=>['pending','countered'].includes(o.status));if(filter==='in')l=l.filter(o=>o.selling_club_id===cid());if(filter==='out')l=l.filter(o=>o.buying_club_id===cid());$('offers').innerHTML=l.length?l.map(o=>{const incoming=o.selling_club_id===cid(),unread=o.last_action_by&&o.last_action_by!==cid()&&localStorage.getItem('ftma_notice_'+o.id)!=='1';return `<article class="center-offer ${unread?'unread':''}" data-id="${esc(o.id)}"><div class="center-offer-top"><div class="center-player-photo ${o.player_photo_url?'':'empty'}">${o.player_photo_url?`<img src="${esc(o.player_photo_url)}" alt="">`:'FTMA'}</div><div class="center-offer-title"><b>${esc(o.player_name)}</b><small>${incoming?'받은 제안':'내가 보낸 제안'} · 라운드 ${o.round||1}</small><div class="club-pair">${chip(o.selling_club_id,o.selling_club_name)}<span class="pair-arrow">→</span>${chip(o.buying_club_id,o.buying_club_name)}</div></div><strong class="center-fee">${money(o.effective_fee??o.fee)}</strong></div><div class="offer-meta"><span><span class="status-pill ${esc(o.status)}">${status(o.status)}</span> · ${ago(o.created_at)}</span><span class="countdown">${o.expires_at?left(o.expires_at):''}</span></div></article>`}).join(''):'<div class="center-empty">표시할 협상이 없습니다.</div>';$('offers').querySelectorAll('.center-offer').forEach(e=>e.onclick=()=>{localStorage.setItem('ftma_notice_'+e.dataset.id,'1');location.href='club-transfer.html?offer='+encodeURIComponent(e.dataset.id)})}
function notifications(){const l=offers.filter(o=>['pending','countered'].includes(o.status)&&o.last_action_by!==cid()).slice(0,8);$('notifications').innerHTML=l.length?l.map(o=>`<div class="notice-item ${localStorage.getItem('ftma_notice_'+o.id)!=='1'?'unread':''}" data-id="${esc(o.id)}"><b>${esc(o.player_name)}</b> · ${esc(o.buying_club_name)}<small>${money(o.effective_fee??o.fee)} · ${status(o.status)} · ${ago(o.created_at)}</small></div>`).join(''):'<div class="center-empty">새로운 알림이 없습니다.</div>';$('notifications').querySelectorAll('.notice-item').forEach(e=>e.onclick=()=>{localStorage.setItem('ftma_notice_'+e.dataset.id,'1');location.href='club-transfer.html?offer='+encodeURIComponent(e.dataset.id)})}
function favorites(){if(!favs.length){$('favorites').innerHTML='<div class="center-empty">관심 선수가 없습니다.<br>이적시장 선수 카드의 ☆ 관심 등록 버튼으로 저장할 수 있습니다.</div>';return}$('favorites').innerHTML=favs.slice(0,8).map(p=>{const club=clubs.find(c=>c.id===(p.current_club_id||p.club_id))||clubs.find(c=>c.name===p.club_name),cl=club?.logo_url||p.club_logo_url||'';return `<a class="fav-item" href="player.html?id=${encodeURIComponent(p.player_id)}"><img src="${p.photo_url?esc(p.photo_url):''}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.position||'포지션 미정')} · ${money(p.market_value)}</small><small class="fav-club">${cl?`<img src="${esc(cl)}" alt="">`:''}<span>${esc(p.club_name||'미소속')}</span></small></div></a>`}).join('')}
function activity(){$('activity').innerHTML=events.slice(0,20).map(e=>`<div class="activity-item"><span class="activity-time">${ago(e.created_at)}</span><span class="activity-main"><b>${esc(e.player_name||'선수')}</b> · ${esc(e.actor_club_name||'구단')} · ${esc(e.action||'협상')}</span><span class="activity-fee">${e.fee!=null?money(e.fee):''}</span></div>`).join('')||'<div class="center-empty">협상 활동 기록이 없습니다.</div>'}
function render(){summary();tabs();offersView();notifications();favorites();activity()}
$('markRead')?.addEventListener('click',()=>{offers.filter(o=>['pending','countered'].includes(o.status)).forEach(o=>localStorage.setItem('ftma_notice_'+o.id,'1'));render()});
$('logoutBtn')?.addEventListener('click',async()=>{try{await rpc('logout_club_session',{p_session_token:tok()})}catch{}sessionStorage.clear();localStorage.removeItem('ftma_club_id');localStorage.removeItem('ftma_club_session_token');localStorage.removeItem('ftma_club_login_at');location.replace('club-login.html')});
load().catch(e=>{console.error('[FTMA club center stable]',e);failBox('offers','협상 데이터를 불러오지 못했습니다.');failBox('favorites','관심 선수 데이터를 불러오지 못했습니다.');failBox('activity','협상 활동 데이터를 불러오지 못했습니다.')});
})();
