const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const message = document.getElementById('message');
let width, height;
let progress = 0;
const maxProgress = 200;
let started = false;

// Canvas rounding helper
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (typeof r === 'number') {
    r = [r, r, r, r];
  }
  this.beginPath();
  this.moveTo(x + r[0], y);
  this.lineTo(x + w - r[1], y);
  this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
  this.lineTo(x + w, y + h - r[2]);
  this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
  this.lineTo(x + r[3], y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
  this.lineTo(x, y + r[0]);
  this.quadraticCurveTo(x, y, x + r[0], y);
  return this;
};

// Resize canvas
function resize() {
  width = canvas.width = container.clientWidth;
  height = canvas.height = container.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// Draw loop
function draw() {
  ctx.clearRect(0, 0, width, height);

  // Power bank body
  ctx.fillStyle = '#222';
  ctx.roundRect(10, 10, width - 20, height - 20, 20).fill();

  // Screen area
  const sx = 30, sy = 50, sw = width - 60, sh = height - 100;
  ctx.fillStyle = '#000';
  ctx.fillRect(sx, sy, sw, sh);

  // Rainbow fill
  const fillH = (progress / maxProgress) * sh;
  const grad = ctx.createLinearGradient(0, sy + sh, 0, sy);
  grad.addColorStop(0, 'red');
  grad.addColorStop(0.17, 'orange');
  grad.addColorStop(0.34, 'yellow');
  grad.addColorStop(0.51, 'green');
  grad.addColorStop(0.68, 'blue');
  grad.addColorStop(0.85, 'indigo');
  grad.addColorStop(1, 'violet');
  ctx.fillStyle = grad;
  ctx.fillRect(sx, sy + sh - fillH, sw, fillH);

  requestAnimationFrame(draw);
}

// Motion and pointer handlers
function updateProgress() {
  if (progress < maxProgress) progress++;
}

async function startInteraction() {
  // Request motion permission if needed
  if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
    const response = await DeviceMotionEvent.requestPermission();
    if (response === 'granted') {
      window.addEventListener('devicemotion', (e) => {
        const a = e.accelerationIncludingGravity;
        const magnitude = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
        if (magnitude > 1.5) updateProgress();
      });
    }
  } else {
    // Fallback to pointermove
    canvas.addEventListener('pointermove', updateProgress);
  }
  started = true;
  startButton.style.display = 'none';
  message.innerText = 'Moviendo para cargar';
}

startButton.addEventListener('click', startInteraction);
draw();
