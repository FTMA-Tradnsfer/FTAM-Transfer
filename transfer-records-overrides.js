(()=>{
const css=`
/* FINAL transfer-records layout override */
.transfer-record-row.is-rumour .transfer-player> a>div,
.transfer-record-row.is-swap-rumour .swap-record-player>div{min-width:0}
.transfer-record-row.is-rumour .transfer-rumour-badge{display:block!important;width:max-content!important;margin:7px 0 0!important}
.transfer-record-row.is-swap-rumour{grid-template-columns:78px minmax(250px,1fr) 130px 190px 200px!important;gap:14px!important;overflow:hidden}
.transfer-record-row.is-swap-rumour .transfer-player,
.transfer-record-row.is-swap-rumour .swap-record-player{min-width:0;overflow:hidden}
.transfer-record-row.is-swap-rumour .swap-record-player{display:flex!important;align-items:center!important;gap:10px!important}
.transfer-record-row.is-swap-rumour .swap-record-player>div:first-child{flex:0 1 auto;min-width:0}
.transfer-record-row.is-swap-rumour .swap-record-badge{display:block!important;width:max-content!important;margin:7px 0 0!important;white-space:nowrap}
.transfer-record-row.is-swap-rumour .swap-record-target{display:none!important}
.transfer-record-row.is-swap-rumour .transfer-center{min-width:0!important;max-width:190px!important;overflow:hidden!important}
.transfer-record-row.is-swap-rumour .swap-offer{display:flex!important;width:100%!important;max-width:190px!important;min-width:0!important;align-items:center!important;justify-content:center!important;gap:8px!important;overflow:hidden!important}
.transfer-record-row.is-swap-rumour .swap-offer img{width:46px!important;height:46px!important;flex:0 0 46px!important}
.transfer-record-row.is-swap-rumour .swap-offer-text{min-width:0!important;max-width:120px!important;overflow:hidden!important}
.transfer-record-row.is-swap-rumour .swap-offer-text strong{display:block!important;max-width:120px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:10px!important}
.transfer-record-row.is-swap-rumour .swap-offer-text b{font-size:14px!important;white-space:nowrap!important}
.transfer-record-row.is-swap-rumour .swap-record-center .swap-arrow{font-size:22px!important}
.transfer-record-row.is-swap-rumour .swap-record-center em{font-size:8px!important;white-space:nowrap!important}
.transfer-record-row.is-swap-rumour .transfer-to img{width:82px!important;height:82px!important}
@media(max-width:1100px){
 .transfer-record-row.is-swap-rumour{grid-template-columns:70px minmax(220px,1fr) 115px 155px 165px!important;gap:10px!important}
 .transfer-record-row.is-swap-rumour .transfer-center{max-width:155px!important}
 .transfer-record-row.is-swap-rumour .swap-offer{max-width:155px!important}
 .transfer-record-row.is-swap-rumour .swap-offer-text{max-width:95px!important}
 .transfer-record-row.is-swap-rumour .swap-offer-text strong{max-width:95px!important}
}
@media(max-width:900px){
 .transfer-record-row.is-swap-rumour{grid-template-columns:64px minmax(170px,1fr) 100px 135px!important}
 .transfer-record-row.is-swap-rumour .transfer-center{grid-column:3/5!important;grid-row:2!important;max-width:none!important}
 .transfer-record-row.is-swap-rumour .swap-offer{max-width:220px!important;justify-content:flex-start!important}
 .transfer-record-row.is-swap-rumour .swap-offer-text{max-width:130px!important}
 .transfer-record-row.is-swap-rumour .swap-offer-text strong{max-width:130px!important}
}
@media(max-width:560px){
 .transfer-record-row.is-swap-rumour{grid-template-columns:58px minmax(0,1fr)!important;gap:0 10px!important}
 .transfer-record-row.is-swap-rumour .swap-record-player{display:block!important}
 .transfer-record-row.is-swap-rumour .swap-record-badge{margin-top:6px!important}
 .transfer-record-row.is-swap-rumour .transfer-center{grid-column:2!important;grid-row:3!important;max-width:none!important}
 .transfer-record-row.is-swap-rumour .swap-offer{max-width:none!important;justify-content:flex-start!important}
 .transfer-record-row.is-swap-rumour .swap-offer-text{max-width:150px!important}
 .transfer-record-row.is-swap-rumour .swap-offer-text strong{max-width:150px!important}
 .transfer-record-row.is-swap-rumour .transfer-to{grid-column:2!important;grid-row:4!important}
}
`;
const apply=()=>{if(document.getElementById('ftmaFinalRecordOverride'))return;const s=document.createElement('style');s.id='ftmaFinalRecordOverride';s.textContent=css;document.head.appendChild(s)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();