let shakes = 0;
const goal = 100;
const threshold = 15;
const messageDiv = document.getElementById('message');
const fillPath = document.getElementById('fill');

window.addEventListener('devicemotion', (e) => {
  const acc = e.accelerationIncludingGravity;
  const intensity = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
  if (intensity > threshold) {
    shakes++;
    updateFill();
  }
});

function updateFill() {
  const percent = Math.min(shakes / goal, 1);
  const filledAngle = percent * Math.PI;
  const x = 100 + 100 * Math.cos(Math.PI - filledAngle);
  const y = 100 - 100 * Math.sin(Math.PI - filledAngle);
  const d = `M${100 + 100*Math.cos(Math.PI)},100 A100,100 0 ${(percent>0.5?1:0)},1 ${x},${y} L100,100 Z`;
  fillPath.setAttribute('d', d);
  if (percent >= 1) finish();
}

function finish() {
  window.removeEventListener('devicemotion', ()=>{});
  confetti({ spread: 70, particleCount: 200, colors:['#ff0','#0ff','#f0f'] });
  messageDiv.textContent = '¡Has llenado el arcoíris!';
  messageDiv.classList.add('show');
}
