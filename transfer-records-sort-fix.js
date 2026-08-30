(()=>{
const box=()=>document.getElementById('transferList');
const feeOf=row=>{
  const text=row?.textContent||'';
  const nums=[...text.matchAll(/(?:€|£|\$)\s*([\d,.]+)M/gi)].map(m=>Number(m[1].replace(/,/g,''))).filter(Number.isFinite);
  return nums.length?Math.max(...nums):-1;
};
const dateOf=row=>{
  const y=Number(row?.querySelector('.transfer-date small')?.textContent||0);
  const dt=String(row?.querySelector('.transfer-date strong')?.textContent||'').match(/(\d{2})\.(\d{2})/);
  return y*10000+(dt?Number(dt[1])*100+Number(dt[2]):0);
};
function apply(){
  const root=box();
  if(!root)return;
  const rows=[...root.querySelectorAll('.transfer-record-row')];
  if(!rows.length)return;
  rows.forEach(row=>{
    const center=row.querySelector('.transfer-center');
    const isLoanReturn=/임대\s*복귀/.test(center?.textContent||'')||/임대\s*복귀/.test(row.textContent||'');
    if(isLoanReturn)row.remove();
  });
  const remaining=[...root.querySelectorAll('.transfer-record-row')];
  remaining.sort((a,b)=>{
    const feeDiff=feeOf(b)-feeOf(a);
    return feeDiff!==0?feeDiff:dateOf(b)-dateOf(a);
  });
  remaining.forEach(row=>root.appendChild(row));
  const count=document.getElementById('transferCount');
  if(count)count.textContent=`${remaining.length}건`;
}
let timer=0;
const schedule=()=>{clearTimeout(timer);timer=setTimeout(apply,30)};
const observer=new MutationObserver(schedule);
function boot(){const root=box();if(!root)return setTimeout(boot,100);observer.observe(root,{childList:true,subtree:true});apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
