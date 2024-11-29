const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 5;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.distance = 0.02;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }
  
  update() {
    const dx = Math.cos(this.angle) * this.speed;
    const dy = Math.sin(this.angle) * this.speed;
    this.x += dx;
    this.y += dy;

    if (Math.abs(this.targetX - this.x) < this.speed && Math.abs(this.targetY - this.y) < this.speed) {
      this.explode();
      return true; // Firework reached the target
    }
    return false;
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 3 + 1;
    this.life = 100;
    this.decay = 0.99;
  }

  update() {
    this.speed *= this.decay;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--;
    return this.life > 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.05) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height / 2;
    fireworks.push(new Firework(x, y, targetX, targetY));
  }

  fireworks.forEach((firework, index) => {
    firework.draw();
    if (firework.update()) fireworks.splice(index, 1);
  });

  particles.forEach((particle, index) => {
    particle.draw();
    if (!particle.update()) particles.splice(index, 1);
  });

  requestAnimationFrame(animate);
}

animate();
