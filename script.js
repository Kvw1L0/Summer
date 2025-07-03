(() => {
  const maxShakes = 50;
  let shakeCount = 0;

  // Fallback for non-supporting devices
  function handleShake() {
    if (shakeCount < maxShakes) {
      shakeCount++;
      updateRainbow();
    }
  }

  // Device motion listener
  function devicemotionListener(e) {
    const acc = e.accelerationIncludingGravity;
    const a = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    if (a > 1.5) {
      handleShake();
    }
  }

  window.addEventListener('devicemotion', devicemotionListener);

  function updateRainbow() {
    const fillCount = Math.floor(shakeCount / (maxShakes / 7));
    document.getElementById('counter').textContent = `${shakeCount}/${maxShakes}`;
    for (let i = 1; i <= 7; i++) {
      const arc = document.querySelector(`.arc[data-index=\"${i}\"]`);
      if (i <= fillCount) {
        arc.classList.add('filled');
        arc.style.stroke = getComputedStyle(document.documentElement)
          .getPropertyValue(`--arc-color-${i}`).trim();
      } else {
        arc.classList.remove('filled');
        arc.style.stroke = 'lightgray';
      }
    }
    if (shakeCount >= maxShakes) {
      window.removeEventListener('devicemotion', devicemotionListener);
      showCompletion();
    }
  }

  function showCompletion() {
    // Explosión de confetti de flores
    const colors = [];
    for (let i = 1; i <= 7; i++) {
      colors.push(getComputedStyle(document.documentElement)
        .getPropertyValue(`--arc-color-${i}`).trim());
    }
    confetti({
      particleCount: 120,
      spread: 160,
      origin: { y: 0.4 },
      colors
    });

    // Mostrar frase motivacional
    const phrases = [
      "¡Eres increíble!",
      "¡Sigue brillando!",
      "¡El mundo es tuyo!",
      "¡Hoy es un gran día!",
      "¡Nunca te rindas!",
      "¡Cree en ti!"
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const msg = document.getElementById('message');
    msg.textContent = phrase;
    msg.classList.remove('hidden');
    document.getElementById('retry').classList.remove('hidden');
  }

  document.getElementById('retry').addEventListener('click', () => {
    location.reload();
  });
})();
