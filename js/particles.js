/**
 * PARTICLES & AMBIENT CANVAS BACKGROUND
 * Ringan, hemat daya, 60 FPS, bebas crash, mendukung resize dan mouse interaction
 */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  let width = 0;
  let height = 0;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    // Batasi jumlah partikel agar performa tetap 60 FPS di semua perangkat
    const count = Math.min(Math.floor((width * height) / 18000), 65);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const dark = isDarkMode();
    const particleColor = dark ? '99, 102, 241' : '79, 70, 229'; // Indigo tint
    const lineColor = dark ? '56, 189, 248' : '99, 102, 241';     // Cyan/Indigo tint

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce at boundary
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Subtle mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }
      }

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * (dark ? 0.15 : 0.08);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  // Event Listeners dengan throttle/debounce
  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Pause animation when tab is not active to save battery/resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = requestAnimationFrame(draw);
    }
  });

  // Start
  resize();
  draw();
})();
