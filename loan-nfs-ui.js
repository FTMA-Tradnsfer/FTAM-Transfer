/* FTMA: 임대 중 선수는 NFS UI에서 제외 */
(function(){
  const apply=()=>{
    document.querySelectorAll('#squad .squad-card').forEach(card=>{
      const manage=card.querySelector('.squad-manage');
      if(!manage)return;
      const loan=manage.querySelector('.loan-state');
      if(!loan)return;
      const nfsState=manage.querySelector('.nfs-state');
      const nfsButton=manage.querySelector('.nfs-btn');
      if(nfsState)nfsState.remove();
      if(nfsButton)nfsButton.remove();
    });
  };
  const observer=new MutationObserver(apply);
  const squad=document.getElementById('squad');
  if(squad)observer.observe(squad,{childList:true,subtree:true});
  apply();
})();
