(function(){
  const grid=document.getElementById('clubList');
  if(!grid) return;

  function apply(){
    const cards=Array.from(grid.children).filter(el=>el.classList.contains('directory-club'));
    const mobile=window.matchMedia('(max-width: 900px)').matches;

    grid.style.setProperty('display','grid','important');
    grid.style.setProperty('grid-template-columns',mobile?'minmax(0,1fr)':'repeat(2,minmax(0,1fr))','important');
    grid.style.setProperty('grid-auto-rows','104px','important');
    grid.style.setProperty('grid-auto-flow','row','important');
    grid.style.setProperty('align-items','stretch','important');
    grid.style.setProperty('align-content','start','important');
    grid.style.setProperty('gap','14px','important');
    grid.style.setProperty('width','100%','important');
    grid.style.setProperty('height','auto','important');
    grid.style.setProperty('min-width','0','important');
    grid.style.setProperty('box-sizing','border-box','important');

    cards.forEach((card,index)=>{
      const row=mobile?index+1:Math.floor(index/2)+1;
      const col=mobile?1:(index%2)+1;
      card.style.setProperty('display','flex','important');
      card.style.setProperty('width','100%','important');
      card.style.setProperty('min-width','0','important');
      card.style.setProperty('max-width','none','important');
      card.style.setProperty('height','104px','important');
      card.style.setProperty('min-height','104px','important');
      card.style.setProperty('max-height','104px','important');
      card.style.setProperty('grid-column',String(col),'important');
      card.style.setProperty('grid-row',String(row),'important');
      card.style.setProperty('grid-area','auto / auto / auto / auto','important');
      card.style.setProperty('margin','0','important');
      card.style.setProperty('position','static','important');
      card.style.setProperty('float','none','important');
      card.style.setProperty('clear','none','important');
      card.style.setProperty('box-sizing','border-box','important');
    });
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(apply));
  observer.observe(grid,{childList:true});
  apply();
  window.addEventListener('resize',apply,{passive:true});
})();
