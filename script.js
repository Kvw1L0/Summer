(() => {
  const maxShakes = 20;
  let shakeCount = 0, lastShakeTime = 0;
  const readings = [], arcs = [], arcLengths = [];
  let threshold = null;

  function init() {
    document.querySelectorAll('.arc').forEach(arc => {
      const len = arc.getTotalLength();
      arcLengths.push(len); arcs.push(arc);
      arc.style.strokeDasharray = len; arc.style.strokeDashoffset = len;
    });

    // Collect baseline readings for calibration
    window.addEventListener('devicemotion', baselineListener);
    setTimeout(endCalibration, 1500);

    // Fallback shake button
    const shakeBtn = document.getElementById('shakeBtn');
    shakeBtn.addEventListener('click', handleShake);
    
    // Share & retry
    document.getElementById('retry').addEventListener('click', () => location.reload());
    document.getElementById('shareBtn').addEventListener('click', sharePhrase);

    // Logo fade-in bounce
    const logo = document.getElementById('logo');
    setTimeout(() => {
      logo.style.transition = 'transform 0.6s, opacity 0.6s';
      logo.style.transform = 'translateX(-50%) scale(1)';
      logo.style.opacity = '0.8';
    }, 1000);

    // Splash screen timeout
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
    }, 3000);
  }

  function baselineListener(e) {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const mag = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    readings.push(mag);
  }

  function endCalibration() {
    window.removeEventListener('devicemotion', baselineListener);
    const mean = readings.reduce((a,b) => a+b)/readings.length;
    const variance = readings.reduce((a,b) => a + Math.pow(b-mean,2), 0)/readings.length;
    const std = Math.sqrt(variance);
    threshold = mean + std*3;
    window.addEventListener('devicemotion', motionListener);
  }

  function motionListener(e) {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const a = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    const now = Date.now();
    if (a > threshold && now - lastShakeTime > 500) {
      lastShakeTime = now;
      handleShake();
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }

  function handleShake() {
    if (shakeCount < maxShakes) {
      shakeCount++; updateRainbow();
    }
  }

  function updateRainbow() {
    document.getElementById('counter').textContent = `${shakeCount}/${maxShakes}`;
    const fill = shakeCount / maxShakes;
    arcs.forEach((arc,i)=>{
      const len = arcLengths[i];
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue(`--arc-color-${arcs.length - i}`).trim();
      arc.style.stroke = color; arc.style.strokeDashoffset = len*(1-fill);
    });
    if (shakeCount >= maxShakes) complete();
  }

  function complete() {
    ['rainbow','counter','title','subtitle','shakeBtn'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.style.opacity='0';
    });
    setTimeout(showMessage, 500);
  }

  function showMessage() {
    const petals = ['#EC6FBB','#E383FB'];
    confetti({ particleCount:120,spread:160,origin:{y:0.4},colors:petals });
    confetti({ particleCount:80,spread:120,origin:{y:0.6},colors:petals });
    try { const ctx=new (window.AudioContext||window.webkitAudioContext)(), o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine'; o.frequency.setValueAtTime(440,ctx.currentTime); o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.00001,ctx.currentTime+1);}catch(e){}
    const phrases=["¡Eres increíble!","¡Sigue brillando!","¡El mundo es tuyo!","¡Hoy es un gran día!","¡Nunca te rindas!","¡Cree en ti!"];
    const phrase=phrases[Math.floor(Math.random()*phrases.length)];
    const msg=document.getElementById('message');
    msg.textContent=phrase; msg.classList.add('neon'); msg.style.opacity='1';
    document.getElementById('retry').style.opacity='1';
    document.getElementById('shareBtn').style.opacity='1';
  }

  function sharePhrase() {
    const phrase = document.getElementById('message').textContent;
    if (navigator.share) navigator.share({ text: phrase }).catch(console.error);
    else alert('Tu frase: ' + phrase);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
