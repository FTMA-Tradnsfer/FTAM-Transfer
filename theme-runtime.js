(function(){
  'use strict';
  const SUPABASE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
  const SUPABASE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
  const allowed=new Set(['default','summer','winter']);
  const labels={default:'FTMA DEFAULT',summer:'☀️ SUMMER TRANSFER WINDOW',winter:'🎄 CHRISTMAS TRANSFER WINDOW'};
  function ensureEffects(){
    if(!document.getElementById('ftma-season-effects-css')){const link=document.createElement('link');link.id='ftma-season-effects-css';link.rel='stylesheet';link.href='season-effects.css?v=20260826effects2';document.head.appendChild(link)}
    let fx=document.getElementById('ftmaSeasonFx');
    if(!fx){fx=document.createElement('div');fx.id='ftmaSeasonFx';className='ftma-season-fx';document.body.appendChild(fx)}
    return fx;
  }
  function buildEffects(theme){
    const fx=ensureEffects();fx.innerHTML='';
    if(theme==='summer'){
      const sun=document.createElement('span');sun.className='fx-item sun-glow';fx.appendChild(sun);
      for(let i=0;i<10;i++){const b=document.createElement('span');b.className='fx-item bubble';const s=5+Math.random()*16;b.style.width=s+'px';b.style.height=s+'px';b.style.left=Math.random()*100+'%';b.style.bottom=(-10-Math.random()*35)+'vh';b.style.animationDuration=(8+Math.random()*10)+'s';b.style.animationDelay=(-Math.random()*12)+'s';fx.appendChild(b)}
      for(let i=0;i<16;i++){const s=document.createElement('span');s.className='fx-item spark';s.style.left=(5+Math.random()*90)+'%';s.style.top=(8+Math.random()*72)+'%';s.style.animationDelay=(-Math.random()*5)+'s';fx.appendChild(s)}
    }else if(theme==='winter'){
      const haze=document.createElement('span');haze.className='fx-item ice-haze';fx.appendChild(haze);const lights=document.createElement('span');lights.className='fx-item christmas-lights';fx.appendChild(lights);
      ['red','green','gold'].forEach((c,j)=>{for(let i=0;i<8;i++){const bulb=document.createElement('span');bulb.className='fx-item bulb '+c;bulb.style.left=(5+i*13+j*2)+'%';bulb.style.animationDelay=(-Math.random()*1.8)+'s';fx.appendChild(bulb)}});
      const flakes=['❄','❅','❆','•'];
      for(let i=0;i<42;i++){const f=document.createElement('span');f.className='fx-item snowflake';f.textContent=flakes[i%flakes.length];f.style.left=Math.random()*100+'%';f.style.top=(-10-Math.random()*25)+'vh';f.style.setProperty('--size',(7+Math.random()*16)+'px');f.style.setProperty('--duration',(7+Math.random()*10)+'s');f.style.setProperty('--opacity',(0.45+Math.random()*0.55).toFixed(2));f.style.animationDelay=(-Math.random()*14)+'s';fx.appendChild(f)}
      const snowman=document.createElement('span');snowman.className='fx-item winter-snowman';snowman.textContent='☃';snowman.style.right='18px';snowman.style.bottom='18px';fx.appendChild(snowman);
      const candy=document.createElement('span');candy.className='fx-item winter-candy';candy.textContent='🍬';candy.style.left='18px';candy.style.bottom='18px';fx.appendChild(candy);
      const gift=document.createElement('span');gift.className='fx-item winter-gift';gift.textContent='🎁';gift.style.right='62px';gift.style.bottom='20px';fx.appendChild(gift);
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