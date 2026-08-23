(function(){
  const STYLE_ID='ftma-club-layout-fix';
  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #clubList.club-directory-grid{display:block!important;width:100%!important;height:auto!important;min-width:0!important;max-width:none!important;}
      #clubList.club-directory-grid .club-directory-row{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:14px!important;width:100%!important;height:104px!important;margin:0 0 14px!important;padding:0!important;box-sizing:border-box!important;}
      #clubList.club-directory-grid .club-directory-row:last-child{margin-bottom:0!important;}
      #clubList.club-directory-grid .club-directory-row>.directory-club{display:flex!important;width:100%!important;min-width:0!important;max-width:none!important;height:104px!important;min-height:104px!important;max-height:104px!important;box-sizing:border-box!important;position:static!important;float:none!important;clear:none!important;margin:0!important;grid-column:auto!important;grid-row:auto!important;grid-area:auto!important;align-self:stretch!important;justify-self:stretch!important;overflow:hidden!important;}
      #clubList.club-directory-grid .club-directory-row>.directory-club .club-info{min-width:0!important;overflow:hidden!important;}
      #clubList.club-directory-grid .club-directory-row>.directory-club h3,#clubList.club-directory-grid .club-directory-row>.directory-club p,#clubList.club-directory-grid .club-directory-row>.directory-club small{min-width:0!important;overflow-wrap:anywhere!important;word-break:break-word!important;}
      @media(max-width:900px){
        #clubList.club-directory-grid .club-directory-row{grid-template-columns:minmax(0,1fr)!important;height:auto!important;gap:14px!important;}
        #clubList.club-directory-grid .club-directory-row>.directory-club{height:104px!important;min-height:104px!important;max-height:104px!important;}
      }
    `;
    document.head.appendChild(style);
  }

  function arrange(){
    const box=document.getElementById('clubList');
    if(!box) return;
    const cards=Array.from(box.children).filter(el=>el.classList.contains('directory-club'));
    if(!cards.length) return;
    if(cards.some(el=>el.parentElement.classList.contains('club-directory-row'))) return;

    const fragment=document.createDocumentFragment();
    for(let i=0;i<cards.length;i+=2){
      const row=document.createElement('div');
      row.className='club-directory-row';
      row.appendChild(cards[i]);
      if(cards[i+1]) row.appendChild(cards[i+1]);
      fragment.appendChild(row);
    }
    box.replaceChildren(fragment);
  }

  const start=()=>{
    arrange();
    const box=document.getElementById('clubList');
    if(!box) return;
    const observer=new MutationObserver(()=>arrange());
    observer.observe(box,{childList:true});
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
