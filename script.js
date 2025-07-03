(() => {
  const maxShakes = 50, threshold = 12;
  let shakeCount = 0, lastShakeTime = 0;
  const arcs = [], arcLengths = [];

  function initArcs() {
    document.querySelectorAll('.arc').forEach(arc => {
      const length = arc.getTotalLength();
      arcLengths.push(length); arcs.push(arc);
      arc.style.strokeDasharray = length; arc.style.strokeDashoffset = length;
    });
  }

  function devicemotionListener(e) {
    const acc = e.acceleration || e.accelerationIncludingGravity;
    if (!acc) return;
    const a = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    const now = Date.now();
    if (a > threshold && now - lastShakeTime > 500) {
      lastShakeTime = now; handleShake();
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }

  function handleShake() {
    if (shakeCount < maxShakes) { shakeCount++; updateRainbow(); }
  }

  function updateRainbow() {
    document.getElementById('counter').textContent = `${shakeCount}/${maxShakes}`;
    const fill = shakeCount / maxShakes;
    arcs.forEach((arc,i) => {
      const len = arcLengths[i];
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue(`--arc-color-${arcs.length - i}`).trim();
      arc.style.stroke = color; arc.style.strokeDashoffset = len * (1 - fill);
    });
    if (shakeCount >= maxShakes) {
      window.removeEventListener('devicemotion', devicemotionListener);
      completeAnimation();
    }
  }

  function completeAnimation() {
    document.getElementById('rainbow').style.opacity = '0';
    document.getElementById('counter').style.opacity = '0';
    setTimeout(showMessage, 500);
  }

  function showMessage() {
    const petalColors = ['#EC6FBB','#E383FB'];
    confetti({ particleCount: 120, spread: 160, origin: { y: 0.4 }, colors: petalColors });
    // second burst for rose petals
    confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 }, colors: petalColors });
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type='sine'; o.frequency.setValueAtTime(440,ctx.currentTime);
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.00001,ctx.currentTime+1);
    } catch(e){console.warn(e);}
    const phrases = ["¡Eres increíble!","¡Sigue brillando!","¡El mundo es tuyo!","¡Hoy es un gran día!","¡Nunca te rindas!","¡Cree en ti!"];
    const phrase = phrases[Math.floor(Math.random()*phrases.length)];
    const msg = document.getElementById('message');
    msg.textContent = phrase; msg.classList.add('neon'); msg.style.opacity='1';
    const retry = document.getElementById('retry');
    retry.style.opacity='1'; retry.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initArcs();
    window.addEventListener('devicemotion', devicemotionListener);
    document.getElementById('retry').addEventListener('click',()=>location.reload());
  });
})();
