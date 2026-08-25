const FTMA_WINDOW_KEY='ftma_transfer_window_state_v1';
const FTMA_WINDOW_URL='https://iloanplyuatfcwzovbpb.supabase.co';
const FTMA_WINDOW_KEY_PUBLIC='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
async function getTransferWindowState(){
  try{
    const r=await fetch(`${FTMA_WINDOW_URL}/rest/v1/rpc/get_transfer_market_state`,{method:'POST',headers:{apikey:FTMA_WINDOW_KEY_PUBLIC,Authorization:`Bearer ${FTMA_WINDOW_KEY_PUBLIC}`,'Content-Type':'application/json'},body:'{}',cache:'no-store'});
    const data=await r.json();
    const state={open:Boolean(data?.open),updatedAt:data?.updated_at||null};
    localStorage.setItem(FTMA_WINDOW_KEY,JSON.stringify(state));
    return state;
  }catch{
    try{return JSON.parse(localStorage.getItem(FTMA_WINDOW_KEY)||'{"open":false,"updatedAt":null}')}catch{return{open:false,updatedAt:null}}
  }
}
async function saveTransferWindowState(open){
  const token=sessionStorage.getItem('ftma_admin_token')||'';
  if(!token)throw new Error('관리자 세션이 만료되었습니다.');
  if(typeof mutate!=='function')throw new Error('관리자 데이터 연결이 준비되지 않았습니다.');
  await mutate('site_settings','upsert',null,{key:'transfer_market_open',value:String(Boolean(open))});
  const state={open:Boolean(open),updatedAt:new Date().toISOString()};
  localStorage.setItem(FTMA_WINDOW_KEY,JSON.stringify(state));
  return state;
}
async function renderTransferWindow(){
  const s=await getTransferWindowState(),dot=document.getElementById('windowDot'),label=document.getElementById('windowLabel'),updated=document.getElementById('windowUpdated');
  if(!dot||!label)return;
  dot.className='window-dot '+(s.open?'open':'closed');
  label.textContent='이적시장 '+(s.open?'OPEN':'CLOSED');
  updated.textContent=s.updatedAt?'마지막 변경: '+new Date(s.updatedAt).toLocaleString('ko-KR'):'아직 변경 기록 없음';
  const openBtn=document.getElementById('windowOpenBtn'),closeBtn=document.getElementById('windowCloseBtn');
  if(openBtn)openBtn.disabled=s.open;if(closeBtn)closeBtn.disabled=!s.open;
}
async function changeTransferWindow(open){
  const openBtn=document.getElementById('windowOpenBtn'),closeBtn=document.getElementById('windowCloseBtn');
  if(openBtn)openBtn.disabled=true;if(closeBtn)closeBtn.disabled=true;
  try{await saveTransferWindowState(open);await renderTransferWindow();}
  catch(e){alert(e.message||'이적시장 상태 변경에 실패했습니다.');await renderTransferWindow();}
}
document.getElementById('windowOpenBtn')?.addEventListener('click',()=>changeTransferWindow(true));
document.getElementById('windowCloseBtn')?.addEventListener('click',()=>changeTransferWindow(false));
renderTransferWindow();