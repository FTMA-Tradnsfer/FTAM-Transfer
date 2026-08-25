(function(){
  'use strict';
  const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const allowed=new Set(['default','summer','winter']);
  const labels={default:'FTMA DEFAULT',summer:'☀️ SUMMER TRANSFER WINDOW',winter:'❄️ WINTER TRANSFER WINDOW'};
  function ensureEffects(){
    if(!document.getElementById('ftma-season-effects-css')){const link=document.createElement('link');link.id='ftma-season-effects-css';link.rel='stylesheet';link.href='season-effects.css?v=20260826scene5';document.head.appendChild(link)}
    let fx=document.getElementById('ftmaSeasonFx');
    if(!fx){fx=document.createElement('div');fx.id='ftmaSeasonFx';fx.className='ftma-season-fx';document.body.appendChild(fx)}
    return fx;
  }
  function buildEffects(theme){
    const fx=ensureEffects();fx.innerHTML='';
    if(theme==='summer'){
      const sun=document.createElement('span');sun.className='fx-item sun-glow';fx.appendChild(sun);
      ['🌴','🌴'].forEach((t,i)=>{const p=document.createElement('span');p.className='fx-item palm';p.textContent=t;p.style.left=i?'91%':'1%';p.style.bottom='2vh';p.style.animationDelay=(-i*1.2)+'s';fx.appendChild(p)});
      const umbrella=document.createElement('span');umbrella.className='fx-item beach-umbrella';umbrella.textContent='🏖️';fx.appendChild(umbrella);
      for(let i=0;i<14;i++){const b=document.createElement('span');b.className='fx-item bubble';const s=6+Math.random()*22;b.style.width=s+'px';b.style.height=s+'px';b.style.left=Math.random()*100+'%';b.style.bottom=(-10-Math.random()*45)+'vh';b.style.animationDuration=(9+Math.random()*12)+'s';b.style.animationDelay=(-Math.random()*14)+'s';fx.appendChild(b)}
      for(let i=0;i<20;i++){const s=document.createElement('span');s.className='fx-item sun-spark';s.style.left=(3+Math.random()*94)+'%';s.style.top=(5+Math.random()*75)+'%';s.style.animationDelay=(-Math.random()*5)+'s';fx.appendChild(s)}
    }else if(theme==='winter'){
      const haze=document.createElement('span');haze.className='fx-item snow-haze';fx.appendChild(haze);
      for(let i=0;i<70;i++){const f=document.createElement('span');f.className='fx-item snowflake';f.textContent=['❄','❅','❆','•'][i%4];f.style.left=Math.random()*100+'%';f.style.top=(-12-Math.random()*35)+'vh';f.style.setProperty('--size',(7+Math.random()*20)+'px');f.style.setProperty('--duration',(7+Math.random()*12)+'s');f.style.setProperty('--opacity',(0.45+Math.random()*0.55).toFixed(2));f.style.animationDelay=(-Math.random()*18)+'s';fx.appendChild(f)}
      ['⛄','🎄','🍬'].forEach((t,i)=>{const d=document.createElement('span');d.className='fx-item winter-decor decor-'+i;d.textContent=t;d.style.left=(i*8+3)+'%';d.style.bottom='3vh';fx.appendChild(d)});
    }
  }
  function apply(theme){theme=allowed.has(theme)?theme:'default';document.body.dataset.ftmaTheme=theme;document.documentElement.dataset.ftmaTheme=theme;document.querySelectorAll('.ftma-season-banner').forEach(el=>{el.textContent=labels[theme]||labels.default});document.querySelectorAll('[data-theme-button]').forEach(b=>b.classList.toggle('active',b.dataset.themeButton===theme));buildEffects(theme);window.dispatchEvent(new CustomEvent('ftma-theme-change',{detail:{theme}}));}
  async function load(){try{const r=await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=value&key=eq.active_theme&limit=1`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});if(!r.ok)throw new Error('theme load failed');const d=await r.json();apply(d?.[0]?.value||'default')}catch(_){apply('default')}}
  window.FTMATheme={apply,load,labels};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
