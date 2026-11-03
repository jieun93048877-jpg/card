/* ========================================================
   이지은 아티스트 웹 명함 인터랙션 스크립트 (script.js)
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('card');
  const cardContainer = document.querySelector('.card-container');
  const copyBtn = document.getElementById('copyBtn');
  const emailItem = document.getElementById('emailItem');
  const toast = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');
  const avatar = document.getElementById('avatar');
  const vcardBtn = document.getElementById('vcardBtn');
  const shareBtn = document.getElementById('shareBtn');

  const emailText = 'jieun93048877@gmail.com';

  /* ----------------------------------------------------
   * 1. 3D 마우스 틸트 인터랙션 (Vanilla 3D Card Tilt)
   * ---------------------------------------------------- */
  const handleMouseMove = (e) => {
    if (window.innerWidth <= 768) return; // 모바일에서는 과도한 틸트 생략

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // 마우스 X
    const y = e.clientY - rect.top;  // 마우스 Y

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 중심 기준 기울기 계산 (-10deg ~ 10deg)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  cardContainer.addEventListener('mousemove', handleMouseMove);
  cardContainer.addEventListener('mouseleave', handleMouseLeave);

  /* ----------------------------------------------------
   * 2. 토스트 메시지 함수
   * ---------------------------------------------------- */
  let toastTimer = null;
  const showToast = (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  };

  /* ----------------------------------------------------
   * 3. 이메일 주소 복사 기능
   * ---------------------------------------------------- */
  const copyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailText);
      } else {
        // Fallback 방식
        const textArea = document.createElement('textarea');
        textArea.value = emailText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // 복사 성공 UI 피드백
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      copyBtn.classList.add('copied');
      showToast('이메일 주소가 클립보드에 복사되었습니다! ✨');

      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      showToast('복사에 실패했습니다. jieun93048877@gmail.com');
    }
  };

  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmail();
  });

  /* ----------------------------------------------------
   * 4. 감성 테마 토글 (Default -> Sunset -> Dark 순환)
   * ---------------------------------------------------- */
  const themes = ['theme-default', 'theme-sunset', 'theme-dark'];
  let currentThemeIndex = 0;

  themeToggle.addEventListener('click', () => {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    if (themes[currentThemeIndex] !== 'theme-default') {
      document.body.classList.add(themes[currentThemeIndex]);
    }

    const themeNames = ['감성 파스텔 테마', '선셋 노을 테마', '다크 아틀리에 테마'];
    showToast(`${themeNames[currentThemeIndex]}로 변경되었어요 🎨`);
  });

  /* ----------------------------------------------------
   * 5. 캐릭터 아바타 클릭 인터랙션
   * ---------------------------------------------------- */
  avatar.addEventListener('click', () => {
    avatar.style.transform = 'scale(0.92) rotate(-8deg)';
    setTimeout(() => {
      avatar.style.transform = 'scale(1.12) rotate(6deg)';
      setTimeout(() => {
        avatar.style.transform = '';
      }, 220);
    }, 150);

    const greetings = [
      '안녕하세요! 아티스트 이지은입니다 🌸',
      '오늘도 다채롭고 빛나는 하루 보내세요! ✨',
      '제 명함에 방문해주셔서 감사해요 🎨',
      '그림 의뢰 및 협업은 메일로 연락주세요 💌'
    ];
    const randomMsg = greetings[Math.floor(Math.random() * greetings.length)];
    showToast(randomMsg);
  });

  /* ----------------------------------------------------
   * 6. 명함 공유 (Web Share API / 링크 복사)
   * ---------------------------------------------------- */
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: '이지은 | Artist Profile',
      text: '아티스트 이지은의 웹 명함입니다. (Email: jieun93048877@gmail.com)',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // 사용자가 취소했을 때는 무시
      }
    } else {
      // Share API 미지원 브라우저는 링크 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('명함 페이지 주소가 복사되었습니다! 🔗');
      } catch (e) {
        showToast('공유 기능을 지원하지 않는 환경입니다.');
      }
    }
  });

  /* ----------------------------------------------------
   * 7. vCard (.vcf) 연락처 파일 다운로드
   * ---------------------------------------------------- */
  vcardBtn.addEventListener('click', () => {
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:이지은',
      'N:이;지은;;;',
      'TITLE:Artist (일러스트레이터)',
      'EMAIL;TYPE=INTERNET,WORK:jieun93048877@gmail.com',
      'NOTE:빛과 색채로 일상의 따뜻한 온도를 담아내는 아티스트',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '이지은_Artist.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    showToast('연락처 파일(vCard)이 다운로드되었습니다! 📇');
  });
});

