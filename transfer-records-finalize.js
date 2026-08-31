/* Run the official-record renderer after the legacy renderer settles. */
(()=>{if(!/transfer-records\.html/.test(location.pathname))return;setTimeout(()=>{const s=document.createElement('script');s.src='transfer-records-official-fix.js?v=20260831official2';document.body.appendChild(s)},900)})();
