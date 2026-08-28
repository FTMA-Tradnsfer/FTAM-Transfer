(function(){
  function apply(){
    const popup=document.getElementById('ftmaChampionsOverlay');
    if(!popup) return false;
    const button=popup.querySelector('.ftma-confirm');
    if(button) button.textContent='확인';
    const logos=popup.querySelectorAll('.ftma-logo');
    logos.forEach(function(img){
      img.style.width=window.innerWidth<=600?'64px':'78px';
      img.style.height=window.innerWidth<=600?'64px':'78px';
      img.style.objectFit='contain';
      img.style.imageRendering='auto';
      img.style.filter='contrast(1.12) saturate(1.08) brightness(1.04)';
      img.style.transform='translateZ(0)';
      img.style.backfaceVisibility='hidden';
    });
    return true;
  }
  if(apply()) return;
  const observer=new MutationObserver(function(){
    if(apply()) observer.disconnect();
  });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(function(){observer.disconnect();},10000);
})();
