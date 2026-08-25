(function(){
  'use strict';
  const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const allowed=new Set(['default','summer','winter']);
  const labels={default:'FTMA DEFAULT',summer:'☀️ SUMMER TRANSFER WINDOW',winter:'❄️ WINTER TRANSFER WINDOW'};
  function ensureEffects(){
    if(!document.getElementById('ftma-season-effects-css')){const link=document.createElement('link');link.id='ftma-season-effects-css';link.rel='stylesheet';link.href='season-effects.css?v=20260826effects1';document.head.appendChild(link)}
    let fx=document.getElementById('ftmaSeasonFx');
    if(!fx){fx=document.createElement('div');fx.id='ftmaSeasonFx';fx.className='ftma-season-fx';document.body.appendChild(fx)}
    return fx;
  }
  function buildEffects(theme){
    const fx=ensureEffects();fx.innerHTML='';
    if(theme==='summer'){
      const sun=document.createElement('span');sun.className='fx-item sun-glow';fx.appendChild(sun);
      for(let i=0;i<14;i++){const b=document.createElement('span');b.className='fx-item bubble';const s=5+Math.random()*18;b.style.width=s+'px';b.style.height=s+'px';b.style.left=Math.random()*100+'%';b.style.bottom=(-10-Math.random()*35)+'vh';b.style.animationDuration=(7+Math.random()*9)+'s';b.style.animationDelay=(-Math.random()*12)+'s';fx.appendChild(b)}
      const wave=document.createElement('span');wave.className='fx-item wave';fx.appendChild(wave);const wave2=document.createElement('span');wave2.className='fx-item wave wave2';fx.appendChild(wave2);
      for(let i=0;i<10;i++){const s=document.createElement('span');s.className='fx-item spark';s.style.left=(8+Math.random()*84)+'%';s.style.top=(18+Math.random()*62)+'%';s.style.animationDelay=(-Math.random()*4)+'s';fx.appendChild(s)}
    }else if(theme==='winter'){
      const haze=document.createElement('span');haze.className='fx-item ice-haze';fx.appendChild(haze);const lights=document.createElement('span');lights.className='fx-item christmas-lights';fx.appendChild(lights);
      ['red','blue','gold'].forEach((c,j)=>{for(let i=0;i<8;i++){const bulb=document.createElement('span');bulb.className='fx-item bulb '+c;bulb.style.left=(5+i*13+j*2)+'%';bulb.style.animationDelay=(-Math.random()*1.8)+'s';fx.appendChild(bulb)}});
      const flakes=['❄','❅','❆','•'];
      for(let i=0;i<34;i++){const f=document.createElement('span');f.className='fx-item snowflake';f.textContent=flakes[i%flakes.length];f.style.left=Math.random()*100+'%';f.style.top=(-10-Math.random()*20)+'vh';f.style.setProperty('--size',(7+Math.random()*14)+'px');f.style.setProperty('--duration',(7+Math.random()*10)+'s');f.style.setProperty('--opacity',(0.35+Math.random()*0.6).toFixed(2));f.style.animationDelay=(-Math.random()*14)+'s';fx.appendChild(f)}
    }
  }
  function apply(theme){
    theme=allowed.has(theme)?theme:'default';document.body.dataset.ftmaTheme=theme;document.documentElement.dataset.ftmaTheme=theme;
    document.querySelectorAll('.ftma-season-banner').forEach(el=>{el.textContent=labels[theme]||labels.default});
    document.querySelectorAll('[data-theme-button]').forEach(b=>b.classList.toggle('active',b.dataset.themeButton===theme));
    buildEffects(theme);window.dispatchEvent(new CustomEvent('ftma-theme-change',{detail:{theme}}));
  }
  async function load(){try{const r=await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=value&key=eq.active_theme&limit=1`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});if(!r.ok)throw new Error('theme load failed');const d=await r.json();apply(d?.[0]?.value||'default')}catch(_){apply('default')}}
  window.FTMATheme={apply,load,labels};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
