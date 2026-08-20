document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>document.querySelectorAll('.nav a').forEach(x=>x.classList.remove('active'))));
const filterBtn=document.getElementById('filterBtn');
filterBtn?.addEventListener('click',()=>{filterBtn.textContent=filterBtn.textContent.includes('필터')?'✓ 전체 포지션':'필터 ☷'});
document.querySelector('.login-btn')?.addEventListener('click',()=>alert('구단 로그인 기능은 다음 단계에서 연결할 수 있습니다.'));
