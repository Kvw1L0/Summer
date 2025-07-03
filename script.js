const bands = Array.from(document.querySelectorAll('#rainbow .band'));
const goal = 100, threshold = 15;
let shakes = 0;
const messageDiv = document.getElementById('message');

window.addEventListener('devicemotion', (e) => {
  const {x, y, z} = e.accelerationIncludingGravity;
  const intensity = Math.sqrt(x*x + y*y + z*z);
  if (intensity > threshold) {
    shakes++;
    updateFill();
  }
});

function updateFill() {
  const percent = Math.min(shakes / goal, 1);
  const filledCount = Math.floor(percent * bands.length);
  bands.forEach((band, idx) => {
    band.setAttribute('fill', idx < filledCount ? band.dataset.color : '#333');
  });
  if (percent >= 1) finish();
}

function finish() {
  window.removeEventListener('devicemotion', () => {});
  confetti({ spread: 70, particleCount: 200, colors: ['#ff0','#0ff','#f0f'] });
  const phrases = [
    '¡Inyectaste pura energía positiva!',
    '¡El mundo necesita tu color!',
    '¡Eres el arcoíris después de la tormenta!'
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  messageDiv.textContent = phrase;
  messageDiv.classList.add('show');
}
