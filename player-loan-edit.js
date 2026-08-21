/* FTMA: add manual loan-status control to the player-detail editor. */
const PLE_URL='https://iloanplyuatfcwzovbpb.supabase.co';
const PLE_KEY='sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
const pleEsc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
const pleGet=async id=>{const r=await fetch(`${PLE_URL}/rest/v1/players?select=is_loan&id=eq.${encodeURIComponent(id)}`,{headers:{apikey:PLE_KEY,Authorization:`Bearer ${PLE_KEY}`},cache:'no-store'});if(!r.ok)return null;const d=await r.json();return d?.[0]?.is_loan??false};
const pleObserver=new MutationObserver(async()=>{const grid=document.querySelector('.player-edit-modal .player-edit-grid');if(!grid||grid.querySelector('[name="is_loan"]'))return;const id=new URLSearchParams(location.search).get('id');if(!id)return;const current=await pleGet(id);const label=document.createElement('label');label.innerHTML=`현재 임대 상태<select name="is_loan"><option value="false" ${current?'':'selected'}>아니오 — 임대 아님</option><option value="true" ${current?'selected':''}>예 — 현재 임대 중</option></select><small style="display:block;color:#77736c;font-size:8px;line-height:1.5;margin-top:6px">이적 기록과 별개로 직접 임대 여부를 지정합니다.</small>`;grid.appendChild(label)});
pleObserver.observe(document.body,{childList:true,subtree:true});
