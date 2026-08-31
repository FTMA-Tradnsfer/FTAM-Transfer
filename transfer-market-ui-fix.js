/* FTMA transfer-market UI polish. Keeps existing offer logic intact. */
(()=>{
'use strict';
const css=`
/* Offer modal: compact site-style layout */
.ftma-offer-modal{padding:12px!important;background:rgba(0,0,0,.78)!important}
.ftma-offer-card{width:min(720px,calc(100vw - 24px))!important;max-height:min(88vh,760px)!important;overflow:auto!important;background:#111315!important;border:1px solid #51462f!important;box-shadow:0 24px 80px rgba(0,0,0,.65)!important;padding:0!important}
.ftma-offer-card>*{box-sizing:border-box}
.ftma-offer-kicker{display:block;padding:18px 22px 0;font-size:9px!important;letter-spacing:.2em}
.ftma-offer-card h2{padding:0 22px;margin:5px 0 2px!important;font-size:25px!important}
.ftma-offer-player{padding:0 22px;margin:0!important;padding-bottom:15px;border-bottom:1px solid #292c30}
.ftma-offer-market{margin:0!important;border:0!important;border-bottom:1px solid #292c30!important;border-radius:0!important;padding:13px 22px!important;background:#151719!important}
.ftma-offer-grid{gap:12px!important}
.ftma-offer-card>.ftma-offer-grid{padding:0 22px}
.ftma-offer-field{margin-top:12px!important}
.ftma-offer-field input,.ftma-offer-field select,.ftma-offer-field textarea{min-height:42px!important;border-radius:0!important}
.ftma-offer-section{margin:17px 22px 0!important;padding-top:14px!important}
.ftma-offer-help{margin:14px 22px 0!important;padding:10px 0;border-top:1px solid #292c30}
.ftma-offer-error{margin:0 22px!important}
.ftma-offer-actions{position:sticky;bottom:0;z-index:2;margin:15px 0 0!important;padding:12px 22px 16px;background:linear-gradient(180deg,rgba(17,19,21,.9),#111315 35%)!important;border-top:1px solid #292c30}
.ftma-offer-actions button{min-height:42px!important;border-radius:0!important;padding:10px 18px!important}
.ftma-offer-actions .primary{min-width:150px}
.ftma-clause{grid-template-columns:minmax(0,1fr) 90px 54px!important}
@media(max-width:700px){
 .ftma-offer-card{width:calc(100vw - 16px)!important;max-height:91vh!important}
 .ftma-offer-kicker{padding:15px 16px 0}
 .ftma-offer-card h2,.ftma-offer-player{padding-left:16px;padding-right:16px}
 .ftma-offer-market{padding-left:16px!important;padding-right:16px!important}
 .ftma-offer-card>.ftma-offer-grid{padding:0 16px}
 .ftma-offer-section{margin-left:16px!important;margin-right:16px!important}
 .ftma-offer-help,.ftma-offer-error{margin-left:16px!important;margin-right:16px!important}
 .ftma-offer-actions{padding-left:16px;padding-right:16px}
 .ftma-offer-actions button{flex:1}
}
`;
function boot(){if(document.getElementById('ftmaOfferUiFix'))return;const s=document.createElement('style');s.id='ftmaOfferUiFix';s.textContent=css;document.head.appendChild(s)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
