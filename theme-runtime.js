(function(){
  'use strict';
  const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const allowed=new Set(['default','summer','winter']);
  const labels={default:'FTMA DEFAULT',summer:'☀️ SUMMER TRANSFER WINDOW',winter:'❄️ WINTER TRANSFER WINDOW'};
  function apply(theme){
    theme=allowed.has(theme)?theme:'default';
    document.body.dataset.ftmaTheme=theme;
    document.documentElement.dataset.ftmaTheme=theme;
    document.querySelectorAll('.ftma-season-banner').forEach(el=>{el.textContent=labels[theme]||labels.default});
    document.querySelectorAll('[data-theme-button]').forEach(b=>b.classList.toggle('active',b.dataset.themeButton===theme));
    window.dispatchEvent(new CustomEvent('ftma-theme-change',{detail:{theme}}));
  }
  async function load(){
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=value&key=eq.active_theme&limit=1`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
      if(!r.ok)throw new Error('theme load failed');
      const d=await r.json();apply(d?.[0]?.value||'default');
    }catch(_){apply('default')}
  }
  window.FTMATheme={apply,load,labels};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
