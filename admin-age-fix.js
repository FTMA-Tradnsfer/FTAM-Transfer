// Keep admin player edits age-safe: birth date is the source of truth.
(function(){
  'use strict';
  function hideAgeField(root){
    const input=root?.querySelector('input[name="age"]');
    if(input){
      const label=input.closest('label');
      if(label)label.style.display='none';
    }
  }
  const observer=new MutationObserver(mutations=>mutations.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.edit-modal-fix,.edit-modal'))hideAgeField(n);n.querySelectorAll?.('.edit-modal-fix,.edit-modal').forEach(hideAgeField)}})));
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    const button=e.target.closest?.('[data-save]');
    if(!button)return;
    const root=button.closest('.edit-modal-fix,.edit-modal');
    const birth=root?.querySelector('input[name="birth_date"]');
    const age=root?.querySelector('input[name="age"]');
    if(birth&&age&&typeof window.ftmaCalculateAge==='function')age.value=window.ftmaCalculateAge(birth.value)??'';
  },true);
})();
