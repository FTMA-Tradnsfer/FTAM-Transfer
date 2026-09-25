/* FTMA home UI-only fix. Home data is loaded once by app.js via cached /api/public-data. */
(function(){
'use strict';
function addFinance(){
  const nav=document.querySelector('.main-nav');
  if(nav&&!nav.querySelector('a[href="finance.html"]')){
    const a=document.createElement('a');
    a.href='finance.html'; a.textContent='금융센터'; nav.appendChild(a);
  }
  const grid=document.querySelector('.portal-grid');
  if(grid&&!grid.querySelector('.finance-portal-card')){
    const a=document.createElement('a');
    a.className='portal-card finance-portal-card';
    a.href='finance.html';
    a.innerHTML='<span class="card-no">07</span><div><small>FTMA FINANCE CENTER</small><h1>금융센터</h1><p>구단의 이적 자금 대출을 신청하고 금융 현황을 확인합니다.</p></div><strong class="arrow">→</strong>';
    grid.appendChild(a);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addFinance,{once:true});
else addFinance();
})();