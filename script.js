const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const message = document.getElementById('message');
let width, height;
let movementCount = 0;
const maxMovement = 150;
let movementCooldown = false;
let started = false;
const colors = ['red','orange','yellow','green','blue','indigo','violet'];

// Resize canvas
function resize() {
  width = canvas.width = canvas.clientWidth;
  height = canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// Draw rainbow arcs
function draw() {
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height * 0.8;
  const thickness = 20;
  const gap = 5;
  let progressNorm = Math.min(movementCount / maxMovement, 1);

  // Draw background arcs
  for (let i = 0; i < colors.length; i++) {
    const r = (colors.length - i) * (thickness + gap);
    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = thickness;
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.stroke();
  }
  // Draw filled arcs
  for (let i = 0; i < colors.length; i++) {
    const r = (colors.length - i) * (thickness + gap);
    const endAngle = Math.PI + progressNorm * Math.PI;
    ctx.beginPath();
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = thickness;
    ctx.arc(cx, cy, r, Math.PI, endAngle);
    ctx.stroke();
  }
  requestAnimationFrame(draw);
}

// Handle device motion
function handleMotion(e) {
  const a = e.accelerationIncludingGravity;
  if (!a) return;
  const mag = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
  if (mag > 1.5 && !movementCooldown && movementCount < maxMovement) {
    movementCount++;
    movementCooldown = true;
    setTimeout(() => movementCooldown = false, 300);
    message.innerText = `Movimientos: ${movementCount}/${maxMovement}`;
    if (movementCount >= maxMovement) showCompletion();
  }
}

// Show completion phrase
function showCompletion() {
  const phrases = [
    '¡Excelente trabajo!',
    'Tu energía ilumina el camino.',
    'El sol brilla gracias a ti.',
    'Cada paso cuenta, sigue así.',
    'Tu esfuerzo trae esperanza.'
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  message.innerText = phrase;
}

// Start interaction
async function startApp() {
  // Request permission on iOS
  if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
    try {
      const resp = await DeviceMotionEvent.requestPermission();
      if (resp !== 'granted') {
        message.innerText = 'Permiso de movimiento denegado';
        return;
      }
    } catch (err) {
      message.innerText = 'Error al solicitar permiso';
      return;
    }
  }
  window.addEventListener('devicemotion', handleMotion);
  started = true;
  startButton.style.display = 'none';
  message.innerText = `Movimientos: 0/${maxMovement}`;
  draw();
}

startButton.addEventListener('click', startApp);
