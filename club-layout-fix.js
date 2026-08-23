(function(){
  const STYLE_ID='ftma-club-layout-fix-v2';
  const old=document.getElementById('ftma-club-layout-fix');
  if(old) old.remove();
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    #clubList.club-directory-grid{display:block!important;width:100%!important;height:auto!important;min-width:0!important;max-width:none!important;box-sizing:border-box!important;margin:0!important;padding:0!important;}
    #clubList.club-directory-grid>.club-directory-row{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;grid-template-rows:104px!important;gap:14px!important;width:100%!important;height:104px!important;min-height:104px!important;margin:0 0 14px!important;padding:0!important;box-sizing:border-box!important;position:static!important;overflow:visible!important;}
    #clubList.club-directory-grid>.club-directory-row:last-child{margin-bottom:0!important;}
    #clubList.club-directory-grid>.club-directory-row>.directory-club{display:flex!important;grid-column:auto!important;grid-row:1!important;width:100%!important;height:104px!important;min-width:0!important;min-height:104px!important;max-width:none!important;max-height:104px!important;margin:0!important;padding:20px!important;box-sizing:border-box!important;position:static!important;float:none!important;clear:none!important;align-self:stretch!important;justify-self:stretch!important;overflow:hidden!important;border:1px solid #2b2d31!important;background:#121416!important;align-items:center!important;gap:16px!important;}
    #clubList.club-directory-grid>.club-directory-row>.directory-club .club-mark{flex:0 0 52px!important;width:52px!important;height:52px!important;}
    #clubList.club-directory-grid>.club-directory-row>.directory-club .club-info{flex:1 1 auto!important;min-width:0!important;overflow:hidden!important;}
    #clubList.club-directory-grid>.club-directory-row>.directory-club h3,#clubList.club-directory-grid>.club-directory-row>.directory-club p,#clubList.club-directory-grid>.club-directory-row>.directory-club small{min-width:0!important;overflow-wrap:anywhere!important;word-break:break-word!important;}
    #clubList.club-directory-grid>.club-directory-row>.directory-club>strong{flex:0 0 auto!important;min-width:34px!important;margin-left:auto!important;text-align:center!important;}
    @media(max-width:900px){#clubList.club-directory-grid>.club-directory-row{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:104px!important;height:auto!important;min-height:0!important;}#clubList.club-directory-grid>.club-directory-row>.directory-club{grid-column:1!important;grid-row:auto!important;}}
  `;
  document.head.appendChild(style);
})();
