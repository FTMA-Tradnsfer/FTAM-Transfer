(function(){
const URL='https://iloanplyuatfcwzovbpb.supabase.co';
const KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function getRumours(){
  const r=await fetch(`${URL}/rest/v1/transfers?select=id,status&order=transfer_date.desc&order=created_at.desc`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`},cache:'no-store'});
  if(!r.ok)throw new Error('이적 상태를 불러오지 못했습니다.');
  return await r.json();
}
async function apply(){
  const list=document.getElementById('transferList');
  if(!list)return;
  let rows=list.querySelectorAll('.transfer-record-row');
  for(let i=0;i<12&&rows.length===0;i++){await wait(250);rows=list.querySelectorAll('.transfer-record-row')}
  if(!rows.length)return;
  const transfers=await getRumours();
  rows.forEach((row,i)=>{
    const t=transfers[i];
    if(!t)return;
    const center=row.querySelector('.transfer-center');
    const player=row.querySelector('.transfer-player');
    if(t.status==='rumour'){
      row.classList.add('is-rumour');
      if(player&&!player.querySelector('.transfer-rumour-badge')){
        const badge=document.createElement('span');
        badge.className='transfer-rumour-badge';
        badge.textContent='이적설';
        badge.setAttribute('aria-label','루머 이적');
        player.querySelector('div')?.appendChild(badge);
      }
      if(center){
        const em=center.querySelector('em');
        if(em)em.textContent='루머 · '+(t.status==='rumour'?'이적설':'');
      }
    }
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
