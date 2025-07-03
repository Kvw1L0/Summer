(() => {
  const maxShakes = 50;
  let shakeCount = 0;
  let listening = false;
  const arcs = [];
  const arcLengths = [];

  const permissionContainer = document.getElementById('permission-container');
  const permBtn = document.getElementById('perm-btn');

  function initArcs() {
    document.querySelectorAll('.arc').forEach((arc) => {
      const length = arc.getTotalLength();
      arcLengths.push(length);
      arcs.push(arc);
      arc.style.strokeDasharray = length;
      arc.style.strokeDashoffset = length;
    });
  }

  function initMotion() {
    if (listening) return;
    listening = true;
    window.addEventListener('devicemotion', devicemotionListener);
    permissionContainer.classList.add('hidden');
  }

  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    permissionContainer.classList.remove('hidden');
    permBtn.addEventListener('click', () => {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') initMotion();
        })
        .catch(console.error);
    });
  } else {
    initMotion();
  }

  function devicemotionListener(e) {
    const acc = e.accelerationIncludingGravity;
    const a = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    if (a > 1.2) {
      handleShake();
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }

  function handleShake() {
    if (shakeCount < maxShakes) {
      shakeCount++;
      updateRainbow();
    }
  }

  function updateRainbow() {
    document.getElementById('counter').textContent = `${shakeCount}/${maxShakes}`;
    const fillPercent = shakeCount / maxShakes;
    arcs.forEach((arc, i) => {
      const length = arcLengths[i];
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue(`--arc-color-${arcs.length - i}`).trim();
      arc.style.stroke = color;
      arc.style.strokeDashoffset = length * (1 - fillPercent);
    });
    if (shakeCount >= maxShakes) {
      window.removeEventListener('devicemotion', devicemotionListener);
      showCompletion();
    }
  }

  function showCompletion() {
    const colors = arcs.map((_, i) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue(`--arc-color-${arcs.length - i}`).trim()
    );
    confetti({
      particleCount: 120,
      spread: 160,
      origin: { y: 0.4 },
      colors
    });

    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const o = context.createOscillator();
      const g = context.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(440, context.currentTime);
      o.connect(g);
      g.connect(context.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
    } catch (e) {
      console.warn('Audio context not supported', e);
    }

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

  document.addEventListener('DOMContentLoaded', () => {
    initArcs();
    document.getElementById('retry').addEventListener('click', () => {
      location.reload();
    });
  });
})();
