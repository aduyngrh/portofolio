/**
 * PARTICLES & AMBIENT CANVAS BACKGROUND
 * Ultra-light mobile build: animation fully pauses during scroll
 * Desktop: 60 FPS with mouse interaction
 */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let animationFrameId = null;
  let particles = [];
  let width = 0;
  let height = 0;
  let isMobile = false;
  let isScrolling = false;
  let scrollTimeout = null;
  let isAnimating = false;

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
    isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
    initParticles();
  }

  function initParticles() {
    particles = [];
    // Mobile: minimal particles. Desktop: normal density
    const count = isMobile ? 10 : Math.min(Math.floor((width * height) / 18000), 55);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.6),
        vy: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.6),
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    animationFrameId = requestAnimationFrame(draw);
  }

  function stopAnimation() {
    if (!isAnimating) return;
    isAnimating = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function draw() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, width, height);

    const dark = isDarkMode();
    const particleColor = dark ? '99, 102, 241' : '79, 70, 229';
    const lineColor = dark ? '56, 189, 248' : '99, 102, 241';

    // On mobile, skip connection lines entirely — they're the heaviest part
    const drawLines = !isMobile;
    const maxDist = 110;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce at boundary
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse interaction (desktop only)
      if (!isMobile && mouse.x !== null && mouse.y !== null) {
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

      // Connect near particles (desktop only)
      if (drawLines) {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (dark ? 0.15 : 0.08);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  // === Scroll: COMPLETELY pause animation on mobile during scroll ===
  window.addEventListener('scroll', () => {
    if (isMobile) {
      if (!isScrolling) {
        isScrolling = true;
        stopAnimation(); // Full stop — zero GPU usage during scroll
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        startAnimation(); // Resume when scroll stops
      }, 150); // Wait 150ms of inactivity before resuming
    }
  }, { passive: true });

  // Debounced resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Pause animation when tab is not active to save battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else if (!isScrolling) {
      startAnimation();
    }
  });

  // Start
  resize();
  startAnimation();
})();
