/**
 * PORTOFOLIO MAIN SCRIPT - YUDHA
 * Zero-crash, high performance, robust event handling & interactive features.
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.PORTFOLIO_DATA || {};

  // ==========================================
  // 1. THEME TOGGLE (DARK / LIGHT)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      if (window.SoundFX) window.SoundFX.themeSwitch();
    });
  }

  // ==========================================
  // 2. AUDIO / SOUND FX TOGGLE
  // ==========================================
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  function updateSoundUI() {
    if (!soundIcon || !window.SoundFX) return;
    const enabled = window.SoundFX.isEnabled();
    soundIcon.textContent = enabled ? '🔊' : '🔇';
    soundToggleBtn.setAttribute('title', enabled ? 'Suara Aktif (Klik untuk Mute)' : 'Suara Mute (Klik untuk Mengaktifkan)');
  }

  if (soundToggleBtn && window.SoundFX) {
    updateSoundUI();
    soundToggleBtn.addEventListener('click', () => {
      window.SoundFX.toggle();
      updateSoundUI();
    });
  }

  // ==========================================
  // 3. NAVBAR SCROLL & SCROLL PROGRESS (SILKY 60FPS)
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  const trackedSections = Array.from(document.querySelectorAll('section[id]'));
  const navLinksMap = new Map();
  document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    const hash = link.getAttribute('href');
    if (hash && hash.length > 1) {
      navLinksMap.set(hash.slice(1), link);
    }
  });

  let currentActiveId = 'beranda';
  let isScrollTicking = false;

  function handleScrollFrame() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Navbar glass effect
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll progress bar
    if (scrollProgress && docHeight > 0) {
      const pct = Math.min((scrollY / docHeight) * 100, 100);
      scrollProgress.style.width = pct + '%';
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active section spy (Non-blocking cached traversal)
    const scrollPos = scrollY + 220;
    let newActiveId = currentActiveId;

    for (let i = trackedSections.length - 1; i >= 0; i--) {
      const sec = trackedSections[i];
      if (scrollPos >= sec.offsetTop) {
        newActiveId = sec.id;
        break;
      }
    }

    if (newActiveId !== currentActiveId) {
      const prevLink = navLinksMap.get(currentActiveId);
      const nextLink = navLinksMap.get(newActiveId);
      if (prevLink) prevLink.classList.remove('active');
      if (nextLink) nextLink.classList.add('active');
      currentActiveId = newActiveId;
    }

    isScrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(handleScrollFrame);
      isScrollTicking = true;
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
      window.scrollTo({ top: 0, behavior: isMobile ? 'auto' : 'smooth' });
      if (window.SoundFX) window.SoundFX.click();
    });
  }

  // ==========================================
  // 4. MOBILE NAVIGATION MENU
  // ==========================================
  const navMobileToggle = document.getElementById('nav-mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navMobileToggle && navLinks) {
    navMobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      if (window.SoundFX) window.SoundFX.pop();
    });

    // Close when clicking nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });

    // Close when clicking outside of floating pill
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#navbar') && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // ==========================================
  // 5. TYPEWRITER EFFECT IN HERO
  // ==========================================
  const typedTarget = document.getElementById('typed-text');
  if (typedTarget) {
    const roles = [
      "Pengembangan Web Full-Stack",
      "Antarmuka & Sistem Desain",
      "Arsitektur API & Basis Data",
      "Performa & Pengalaman Pengguna"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function typeLoop() {
      const currentRole = roles[roleIdx];
      
      if (isDeleting) {
        charIdx--;
        typedTarget.textContent = currentRole.substring(0, charIdx);
        typeSpeed = 40;
      } else {
        charIdx++;
        typedTarget.textContent = currentRole.substring(0, charIdx);
        typeSpeed = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typeSpeed = 1800; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 400; // Pause before next word
      }

      setTimeout(typeLoop, typeSpeed);
    }
    typeLoop();
  }

  // ==========================================
  // 6. ANIMATED COUNTERS FOR STATS
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function runStatsAnimation() {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(Math.ceil(target / 40), 1);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 35);
    });
  }

  // ==========================================
  // 7. RENDER TECH LOGO MARQUEE (SCROLLING)
  // ==========================================
  const marqueeTrack = document.getElementById('tech-marquee-track');
  if (marqueeTrack) {
    const techLogos = [
      {
        name: 'React',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></svg>`
      },
      {
        name: 'Next.js',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 7.72 16.36L9.45 7.42v9.08H8V6.5h1.68l8.85 9.43A8.5 8.5 0 1 1 12 3.5a8.49 8.49 0 0 1 6.72 3.3l1.16-.96A9.97 9.97 0 0 0 12 2zm3.25 4.5h1.5v7.1l-1.5-1.6V6.5z"/></svg>`
      },
      {
        name: 'TypeScript',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8zM10.42 12.6H12v-1.42H6.5v1.42h1.95v6.8h1.97v-6.8z"/></svg>`
      },
      {
        name: 'JavaScript',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83zm5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z"/></svg>`
      },
      {
        name: 'Tailwind CSS',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"/></svg>`
      },
      {
        name: 'Vue.js',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h4l6 10.4L18 4h4L12 21.3 2 4zm4.8 0h3.1l2.1 3.6L14.1 4h3.1L12 13 6.8 4z"/></svg>`
      },
      {
        name: 'Node.js',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3.5 6.9v9.8L12 21.6l8.5-4.9V6.9L12 2zm0 2.3l6.5 3.75v7.5L12 19.3l-6.5-3.75v-7.5L12 4.3zm-1.1 4.2v4.6c0 .8-.4 1.2-1.1 1.2-.5 0-.8-.2-1.1-.6l-1.3.8c.5.9 1.3 1.3 2.4 1.3 1.7 0 2.7-.9 2.7-2.6V8.5h-1.6zm3.8 0c-1.4 0-2.4.7-2.4 1.9 0 1.1.7 1.6 2 2l.7.2c.7.2 1 .4 1 .9s-.5.8-1.2.8c-.8 0-1.3-.3-1.6-.9l-1.3.8c.5 1 1.5 1.5 2.9 1.5 1.6 0 2.7-.8 2.7-2.1 0-1.1-.7-1.7-2.1-2.1l-.7-.2c-.6-.2-.9-.4-.9-.8 0-.4.4-.7 1-.7.6 0 1 .2 1.3.7l1.2-.8c-.5-.8-1.4-1.2-2.6-1.2z"/></svg>`
      },
      {
        name: 'PostgreSQL',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6"/><path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/></svg>`
      },
      {
        name: 'MongoDB',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.4 2.3c-.2-.2-.5-.2-.8 0C11.4 2.5 7 6.8 7 12.2c0 3.7 2.4 6.5 4.4 7.7v2.1h1.2v-2.1c2-1.2 4.4-4 4.4-7.7 0-5.4-4.4-9.7-4.6-9.9zM12 18.4c-.2-.1-.4-.3-.6-.4V8.5h1.2V18c-.2.1-.4.3-.6.4z"/></svg>`
      },
      {
        name: 'Python',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.9 2C8.6 2 8.8 3.4 8.8 3.4v1.5h3.2v.5H7.5S5.5 5.2 5.5 8.5s1.7 3.2 1.7 3.2h1v-1.6s-.1-1.7 1.7-1.7h3s1.6 0 1.6-1.6V4.1S14.8 2 11.9 2zm-1.6 1.2a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2zm1.8 18.8c3.3 0 3.1-1.4 3.1-1.4v-1.5H12v-.5h4.5s2 .2 2-3.1-1.7-3.2-1.7-3.2h-1v1.6s.1 1.7-1.7 1.7h-3s-1.6 0-1.6 1.6v2.7s-.3 2.1 2.6 2.1zm1.6-1.2a.6.6 0 1 1 0-1.2.6.6 0 0 1 0 1.2z"/></svg>`
      },
      {
        name: 'Git',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.62 11.11l-8.73-8.73a1.3 1.3 0 0 0-1.84 0L9.2 4.23l2.28 2.28a1.55 1.55 0 0 1 1.96 1.97l2.2 2.2a1.55 1.55 0 1 1-.93.88l-2.05-2.05v5.4a1.55 1.55 0 1 1-1.27-.05V9.38a1.55 1.55 0 0 1-.84-2.03L8.3 5.1 2.38 11.02a1.3 1.3 0 0 0 0 1.84l8.73 8.73a1.3 1.3 0 0 0 1.84 0l8.67-8.64a1.3 1.3 0 0 0 0-1.84z"/></svg>`
      },
      {
        name: 'Docker',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 5h2.5v2.5H13V5zm-3 0h2.5v2.5H10V5zm-3 3h2.5v2.5H7V8zm3 0h2.5v2.5H10V8zm3 0h2.5v2.5H13V8zm3 0h2.5v2.5H16V8zm-9 3h2.5v2.5H7v-2.5zm3 0h2.5v2.5H10v-2.5zm3 0h2.5v2.5H13v-2.5zm7.8 1.1c-.6-.4-1.9-.5-2.7-.3-.2-.9-.8-1.7-1.5-2.2l-.3-.2-.2.3c-.4.6-.5 1.6-.2 2.3.2.4.4.7.8 1H2.3c-.2 1.7.2 3.3 1.1 4.6 1.2 1.7 3 2.6 5.6 2.6 5.2 0 9.1-2.4 10.9-6.8.7.1 2.2 0 3-1.4l.1-.2-.2-.2-.0-.5z"/></svg>`
      },
      {
        name: 'Figma',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3h3v6H9a3 3 0 0 1 0-6z"/><path d="M12 3h3a3 3 0 0 1 0 6h-3V3z"/><path d="M9 9h3v6H9a3 3 0 0 1 0-6z"/><path d="M9 15h3v3a3 3 0 1 1-3-3z"/><circle cx="15" cy="12" r="3"/></svg>`
      },
      {
        name: 'Linux',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="7 9 11 12 7 15"/><line x1="13" y1="15" x2="17" y2="15"/></svg>`
      }
    ];

    const renderSet = (isClone) => techLogos.map(item => `
      <div class="tech-logo-item" title="${item.name}" ${isClone ? 'aria-hidden="true"' : `aria-label="${item.name}"`}>
        <span class="tech-logo-svg">${item.svg}</span>
        <span class="tech-logo-tooltip">${item.name}</span>
      </div>
    `).join('');

    // Duplicate items seamlessly for infinite continuous horizontal loop
    marqueeTrack.innerHTML = renderSet(false) + renderSet(true);
  }

  function triggerSkillBars() {
    // Handled cleanly via marquee CSS animation
  }

  // ==========================================
  // 8. RENDER & FILTER PROJECTS (WITH CMS JSON SYNC)
  // ==========================================
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let activeProjectFilter = 'all';

  function escapeProjectHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeProjectUrl(url) {
    const val = String(url || '').trim();
    if (!val || val === '#') return '';
    if (/^(https?:\/\/|assets\/|\.\/assets\/|data:image\/)/i.test(val)) {
      return val;
    }
    return '';
  }

  function renderProjects(filter = 'all') {
    activeProjectFilter = filter;
    if (!projectsGrid || !data.projects) return;

    const filtered = filter === 'all'
      ? data.projects
      : data.projects.filter(p => p.category === filter);

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; border: 1px dashed var(--border-color); border-radius: var(--radius-lg); color: var(--text-secondary);">
          Belum ada proyek pada kategori ini.
        </div>
      `;
      return;
    }

    projectsGrid.innerHTML = filtered.map(proj => {
      const safeId = escapeProjectHtml(proj.id);
      const safeTitle = escapeProjectHtml(proj.title);
      const safeCategoryLabel = escapeProjectHtml(proj.categoryLabel || proj.category);
      const safeHighlights = escapeProjectHtml(proj.highlights);
      const safeDesc = escapeProjectHtml(proj.description);
      const safeImg = escapeProjectHtml(sanitizeProjectUrl(proj.image) || 'assets/images/projects/project-1.svg');
      const safeDemoUrl = sanitizeProjectUrl(proj.demoUrl);
      const stack = Array.isArray(proj.techStack) ? proj.techStack : [];

      return `
        <article class="project-card reveal-on-scroll" data-id="${safeId}">
          <div class="project-thumbnail" onclick="openProjectModal('${safeId}')">
            <img src="${safeImg}" alt="${safeTitle}" loading="lazy" />
            <div class="project-overlay">
              <span class="project-inspect-btn">
                <span>Lihat Detail</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>

          <div class="project-content">
            <div class="project-top-meta">
              <span class="project-category-label">${safeCategoryLabel}</span>
              ${safeHighlights ? `<span class="project-highlight-pill">${safeHighlights}</span>` : ''}
            </div>
            <h4 class="project-title" onclick="openProjectModal('${safeId}')">${safeTitle}</h4>
            <p class="project-desc">${safeDesc}</p>

            <div class="project-tags">
              ${stack.slice(0, 4).map(t => `<span class="tech-tag">${escapeProjectHtml(t)}</span>`).join('')}
              ${stack.length > 4 ? `<span class="tech-tag">+${stack.length - 4}</span>` : ''}
            </div>

            <div class="project-actions">
              <button class="btn btn-secondary btn-sm" onclick="openProjectModal('${safeId}')">
                <span>Studi Kasus</span>
              </button>
              ${safeDemoUrl ? `
                <a href="${escapeProjectHtml(safeDemoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  <span>Kunjungi</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17l9.2-9.2M17 17V8H8"/></svg>
                </a>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Trigger reveal classes
    setTimeout(() => {
      projectsGrid.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
    }, 50);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
      if (window.SoundFX) window.SoundFX.pop();
    });
  });

  // Render initial fallback projects immediately, then hydrate from data/projects.json
  renderProjects('all');

  if (typeof fetch === 'function' && window.location.protocol !== 'file:') {
    fetch('data/projects.json?v=' + Date.now(), { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then(payload => {
        const loaded = Array.isArray(payload)
          ? payload
          : (payload && Array.isArray(payload.projects) ? payload.projects : null);
        if (loaded) {
          data.projects = loaded;
          renderProjects(activeProjectFilter);
        }
      })
      .catch(() => {
        // Keep PORTFOLIO_DATA fallback when offline or unavailable
      });
  }

  // ==========================================
  // 9. PROJECT DETAIL MODAL
  // ==========================================
  const projectModalBackdrop = document.getElementById('project-modal');
  const modalProjectDetails = document.getElementById('modal-project-details');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  window.openProjectModal = function(projectId) {
    if (!data.projects || !modalProjectDetails || !projectModalBackdrop) return;
    const project = data.projects.find(p => p.id === projectId);
    if (!project) return;

    const safeTitle = escapeProjectHtml(project.title);
    const safeCategoryLabel = escapeProjectHtml(project.categoryLabel || project.category);
    const safeHighlights = escapeProjectHtml(project.highlights || 'Arsitektur Siap Produksi');
    const safeImg = escapeProjectHtml(sanitizeProjectUrl(project.image) || 'assets/images/projects/project-1.svg');
    const safeFullDesc = escapeProjectHtml(project.fullDescription || project.description);
    const safeDemoUrl = sanitizeProjectUrl(project.demoUrl);
    const safeGithubUrl = sanitizeProjectUrl(project.githubUrl);
    const features = Array.isArray(project.features) ? project.features : [];
    const stack = Array.isArray(project.techStack) ? project.techStack : [];

    modalProjectDetails.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="section-eyebrow" style="margin-bottom: 0.4rem;">${safeCategoryLabel}</span>
        <h2 style="font-size: 1.65rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.4rem;">${safeTitle}</h2>
        <div style="font-size: 0.84rem; color: var(--accent-primary); font-weight: 500;">
          ${safeHighlights}
        </div>
      </div>

      <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--border-color); background: var(--bg-secondary);">
        <img src="${safeImg}" alt="${safeTitle}" style="width: 100%; height: auto; display: block;" />
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem;">Tentang Proyek</h4>
        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.94rem;">${safeFullDesc}</p>
      </div>

      ${features.length > 0 ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.05rem; margin-bottom: 0.75rem;">Fitur Utama</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.55rem;">
            ${features.map(f => `
              <li style="display: flex; align-items: flex-start; gap: 0.6rem; color: var(--text-secondary); font-size: 0.92rem;">
                <span style="color: var(--accent-primary); font-weight: 700;">—</span>
                <span>${escapeProjectHtml(f)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.6rem;">Teknologi</h4>
        <div class="project-tags">
          ${stack.map(t => `<span class="tech-tag">${escapeProjectHtml(t)}</span>`).join('')}
        </div>
      </div>

      ${(safeDemoUrl || safeGithubUrl) ? `
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          ${safeDemoUrl ? `
            <a href="${escapeProjectHtml(safeDemoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              Buka Live Demo ↗
            </a>
          ` : ''}
          ${safeGithubUrl ? `
            <a href="${escapeProjectHtml(safeGithubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              Source Code (GitHub)
            </a>
          ` : ''}
        </div>
      ` : ''}
    `;

    projectModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.SoundFX) window.SoundFX.modalOpen();
  };

  function closeProjectModal() {
    if (!projectModalBackdrop) return;
    projectModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (window.SoundFX) window.SoundFX.modalClose();
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }
  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) closeProjectModal();
    });
  }

  // ==========================================
  // 10. CV / RESUME MODAL
  // ==========================================
  const cvModalBackdrop = document.getElementById('cv-modal');
  const cvModalBtn = document.getElementById('btn-download-cv');
  const cvCloseBtn = document.getElementById('cv-close-btn');

  if (cvModalBtn && cvModalBackdrop) {
    cvModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cvModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.SoundFX) window.SoundFX.modalOpen();
    });
  }

  function closeCvModal() {
    if (!cvModalBackdrop) return;
    cvModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (window.SoundFX) window.SoundFX.modalClose();
  }

  if (cvCloseBtn) cvCloseBtn.addEventListener('click', closeCvModal);
  if (cvModalBackdrop) {
    cvModalBackdrop.addEventListener('click', (e) => {
      if (e.target === cvModalBackdrop) closeCvModal();
    });
  }

  // ESC key to close any active modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeCvModal();
      if (typeof closeCmdPalette === 'function') closeCmdPalette();
    }
  });

  // ==========================================
  // 11. EXPERIENCE & EDUCATION TABS
  // ==========================================
  const tabExpBtn = document.getElementById('tab-experience-btn');
  const tabEduBtn = document.getElementById('tab-education-btn');
  const timelineContent = document.getElementById('timeline-content');

  function renderTimeline(type) {
    if (!timelineContent) return;
    const list = type === 'experience' ? data.experience : data.education;
    if (!list) return;

    timelineContent.innerHTML = list.map(item => `
      <div class="timeline-item">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-title">${item.role || item.degree}</div>
        <div class="timeline-company">${item.company || item.institution}</div>
        <p class="timeline-desc">${item.description}</p>
      </div>
    `).join('');
  }

  if (tabExpBtn && tabEduBtn) {
    tabExpBtn.addEventListener('click', () => {
      tabExpBtn.classList.add('active');
      tabEduBtn.classList.remove('active');
      renderTimeline('experience');
      if (window.SoundFX) window.SoundFX.pop();
    });

    tabEduBtn.addEventListener('click', () => {
      tabEduBtn.classList.add('active');
      tabExpBtn.classList.remove('active');
      renderTimeline('education');
      if (window.SoundFX) window.SoundFX.pop();
    });

    // Initial render
    renderTimeline('experience');
  }

  // ==========================================
  // 12. INTERACTIVE PLAYGROUND (SURFACE STUDIO)
  // ==========================================
  const sliderRadius = document.getElementById('slider-radius');
  const sliderBlur = document.getElementById('slider-blur');
  const sliderGlow = document.getElementById('slider-glow');
  const demoCard = document.getElementById('demo-target-card');
  const playgroundCode = document.getElementById('playground-code');
  const copyCssBtn = document.getElementById('copy-css-btn');

  function updatePlaygroundCard() {
    if (!demoCard || !sliderRadius || !sliderBlur || !sliderGlow) return;
    const r = sliderRadius.value;
    const b = sliderBlur.value;
    const g = sliderGlow.value;

    const radVal = document.getElementById('val-radius');
    const blurVal = document.getElementById('val-blur');
    const glowVal = document.getElementById('val-glow');

    if (radVal) radVal.textContent = r + 'px';
    if (blurVal) blurVal.textContent = b + 'px';
    if (glowVal) glowVal.textContent = g + 'px';

    demoCard.style.borderRadius = r + 'px';
    demoCard.style.backdropFilter = `blur(${b}px)`;
    demoCard.style.webkitBackdropFilter = `blur(${b}px)`;
    demoCard.style.boxShadow = `0 ${Math.round(g * 0.45)}px ${g}px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(212, 180, 131, ${Math.min(g / 120, 0.35).toFixed(2)})`;

    if (playgroundCode) {
      playgroundCode.textContent = `.card {
  border-radius: ${r}px;
  backdrop-filter: blur(${b}px);
  box-shadow: 0 ${Math.round(g * 0.45)}px ${g}px rgba(0, 0, 0, 0.25);
}`;
    }
  }

  if (sliderRadius && sliderBlur && sliderGlow) {
    [sliderRadius, sliderBlur, sliderGlow].forEach(s => {
      s.addEventListener('input', updatePlaygroundCard);
    });
    updatePlaygroundCard();
  }

  if (copyCssBtn && playgroundCode) {
    copyCssBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(playgroundCode.textContent).then(() => {
        showToast('CSS Berhasil Disalin! 📋');
        if (window.SoundFX) window.SoundFX.success();
      });
    });
  }

  // ==========================================
  // 14. COPY EMAIL & WHATSAPP
  // ==========================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = data.profile ? data.profile.email : 'yudhanugraha081@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email ${email} berhasil disalin! 📋`);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Tersalin! ✓';
        if (window.SoundFX) window.SoundFX.success();
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
        }, 2500);
      });
    });
  }

  // ==========================================
  // 15. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showToast('Mohon lengkapi semua kolom formulir.');
        return;
      }

      // Emulate smooth submit
      const origText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim Pesan... ⏳';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
        contactForm.reset();
        showToast(`Terima kasih, ${name}! Pesan Anda telah terkirim 🎉`);
        if (window.SoundFX) window.SoundFX.success();
      }, 1000);
    });
  }

  // ==========================================
  // 16. TOAST NOTIFICATION HELPER
  // ==========================================
  let toastTimeout;
  window.showToast = function(msg) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span><span>${msg}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ==========================================
  // 17. INTERSECTION OBSERVER FOR ANIMATIONS
  // ==========================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // If it's stats section, trigger counters
        if (entry.target.id === 'stats-container' || entry.target.closest('#stats-container')) {
          runStatsAnimation();
        }

        // If it's skills section, trigger skill bars
        if (entry.target.id === 'skills' || entry.target.closest('#skills')) {
          triggerSkillBars();
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => scrollObserver.observe(el));
  const statsBox = document.getElementById('stats-container');
  if (statsBox) scrollObserver.observe(statsBox);
  const skillsSec = document.getElementById('skills');
  if (skillsSec) scrollObserver.observe(skillsSec);

  // Initial trigger for elements already in view
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  }, 100);

  // ==========================================
  // 18. COMMAND PALETTE (CTRL + K / SPOTLIGHT)
  // ==========================================
  const cmdPaletteBtn = document.getElementById('cmd-palette-btn');
  const cmdPaletteModal = document.getElementById('cmd-palette-modal');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  const cmdCloseBtn = document.getElementById('cmd-close-btn');

  let activeFilteredCommands = [];
  let selectedIndex = 0;

  function buildCommandList() {
    const list = [
      // Quick Actions
      { id: 'cv', group: 'Aksi Cepat', title: 'Lihat & Unduh Resume / CV', desc: 'Ringkasan keahlian & opsi cetak PDF', icon: '📄', badge: 'Aksi', action: () => { if (cvModalBtn) cvModalBtn.click(); } },
      { id: 'cms-admin', group: 'Aksi Cepat', title: 'Kelola Proyek (CMS Admin)', desc: 'Tambah, edit, hapus & upload thumbnail proyek', icon: '⚙️', badge: 'CMS', action: () => { window.location.href = 'admin.html'; } },
      { id: 'theme', group: 'Aksi Cepat', title: 'Ganti Tema (Gelap / Terang)', desc: 'Alihkan mode tampilan layar', icon: '🌓', badge: 'Aksi', action: () => { if (themeToggleBtn) themeToggleBtn.click(); } },
      { id: 'sound', group: 'Aksi Cepat', title: 'Toggle Efek Suara', desc: 'Aktifkan atau senyapkan efek audio synthesizer', icon: '🔊', badge: 'Aksi', action: () => { if (soundToggleBtn) soundToggleBtn.click(); } },
      { id: 'copy-email', group: 'Aksi Cepat', title: 'Salin Alamat Email', desc: data.profile ? data.profile.email : 'yudhanugraha081@gmail.com', icon: '📋', badge: 'Aksi', action: () => { if (copyEmailBtn) copyEmailBtn.click(); } },
      { id: 'whatsapp', group: 'Aksi Cepat', title: 'Chat Cepat via WhatsApp', desc: 'Kirim pesan langsung ke WhatsApp Yudha', icon: '💬', badge: 'Tautan', action: () => { const num = data.profile && data.profile.whatsapp ? data.profile.whatsapp.replace(/[^0-9]/g, '') : '6281381639571'; window.open(`https://wa.me/${num}?text=Halo%20Yudha,%20saya%20tertarik%20bekerja%20sama%20dengan%20Anda.`, '_blank'); } },
      { id: 'github', group: 'Aksi Cepat', title: 'Buka Profil GitHub', desc: data.profile && data.profile.github ? data.profile.github : 'https://github.com/aduyngrh', icon: '🐙', badge: 'Tautan', action: () => { window.open(data.profile && data.profile.github ? data.profile.github : 'https://github.com/aduyngrh', '_blank'); } },
      { id: 'linkedin', group: 'Aksi Cepat', title: 'Buka Profil LinkedIn', desc: data.profile && data.profile.linkedin ? data.profile.linkedin : 'https://linkedin.com/in/YudhaNugraha-', icon: '💼', badge: 'Tautan', action: () => { window.open(data.profile && data.profile.linkedin ? data.profile.linkedin : 'https://linkedin.com/in/YudhaNugraha-', '_blank'); } },

      // Navigation
      { id: 'nav-beranda', group: 'Navigasi Cepat', title: 'Beranda', desc: 'Kembali ke bagian teratas', icon: '🏠', badge: 'Navigasi', action: () => scrollToSection('beranda') },
      { id: 'nav-tentang', group: 'Navigasi Cepat', title: 'Tentang Saya', desc: 'Perjalanan, filosofi kerja & riwayat karier', icon: '👤', badge: 'Navigasi', action: () => scrollToSection('tentang') },
      { id: 'nav-keahlian', group: 'Navigasi Cepat', title: 'Keahlian Teknis', desc: 'Tech stack frontend, backend & tools', icon: '🛠️', badge: 'Navigasi', action: () => scrollToSection('keahlian') },
      { id: 'nav-proyek', group: 'Navigasi Cepat', title: 'Portofolio Karya', desc: 'Daftar aplikasi & proyek unggulan', icon: '📂', badge: 'Navigasi', action: () => scrollToSection('proyek') },
      { id: 'nav-playground', group: 'Navigasi Cepat', title: 'Interactive Lab', desc: 'Design tokens & surface visualizer', icon: '💎', badge: 'Demo', action: () => scrollToSection('playground') },
      { id: 'nav-kontak', group: 'Navigasi Cepat', title: 'Hubungi Saya', desc: 'Kirim formulir pesan & info kontak', icon: '✉️', badge: 'Navigasi', action: () => scrollToSection('kontak') }
    ];

    // Dynamic Projects from PORTFOLIO_DATA
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach(proj => {
        list.push({
          id: `proj-${proj.id}`,
          group: 'Proyek Unggulan',
          title: proj.title,
          desc: `${proj.categoryLabel} • ${(proj.techStack || []).slice(0, 3).join(', ')}`,
          icon: '🚀',
          badge: 'Proyek',
          keywords: (proj.techStack || []).join(' ') + ' ' + (proj.highlights || ''),
          action: () => {
            if (window.openProjectModal) window.openProjectModal(proj.id);
          }
        });
      });
    }

    return list;
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      // On mobile, use instant scroll for reliability; on desktop, smooth
      const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
      el.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
    }
  }

  function openCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.add('open');
    cmdPaletteModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (cmdInput) {
      cmdInput.value = '';
      setTimeout(() => cmdInput.focus(), 60);
    }
    renderCmdResults('');
    if (window.SoundFX) window.SoundFX.modalOpen();
  }

  window.closeCmdPalette = function() {
    if (!cmdPaletteModal || !cmdPaletteModal.classList.contains('open')) return;
    cmdPaletteModal.classList.remove('open');
    cmdPaletteModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.SoundFX) window.SoundFX.modalClose();
  };

  function renderCmdResults(query) {
    if (!cmdResults) return;
    const q = query.trim().toLowerCase();
    const all = buildCommandList();

    if (!q) {
      activeFilteredCommands = all;
    } else {
      activeFilteredCommands = all.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const descMatch = (item.desc || '').toLowerCase().includes(q);
        const kwMatch = (item.keywords || '').toLowerCase().includes(q);
        const badgeMatch = (item.badge || '').toLowerCase().includes(q);
        return titleMatch || descMatch || kwMatch || badgeMatch;
      });
    }

    selectedIndex = 0;

    if (activeFilteredCommands.length === 0) {
      cmdResults.innerHTML = `
        <div class="cmd-empty">
          <span class="cmd-empty-icon">🔍</span>
          <p>Tidak ditemukan perintah atau proyek untuk "<strong>${escapeHtml(query)}</strong>"</p>
          <p style="font-size: 0.8rem; margin-top: 0.4rem; color: var(--text-muted);">Coba cari kata kunci seperti "React", "CV", "Kontak", atau "Tema".</p>
        </div>
      `;
      return;
    }

    // Group items
    const groups = {};
    activeFilteredCommands.forEach((item, idx) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push({ item, globalIdx: idx });
    });

    let html = '';
    for (const [groupName, items] of Object.entries(groups)) {
      html += `<div class="cmd-group"><div class="cmd-group-title">${groupName}</div>`;
      items.forEach(({ item, globalIdx }) => {
        const isSelected = globalIdx === selectedIndex ? 'selected' : '';
        html += `
          <div class="cmd-item ${isSelected}" data-index="${globalIdx}">
            <div class="cmd-item-left">
              <span class="cmd-item-icon">${item.icon}</span>
              <div>
                <span class="cmd-item-title">${item.title}</span>
                <span class="cmd-item-desc">${item.desc}</span>
              </div>
            </div>
            <span class="cmd-item-badge">${item.badge}</span>
          </div>
        `;
      });
      html += `</div>`;
    }

    cmdResults.innerHTML = html;

    // Attach click events
    cmdResults.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        executeCmdIndex(idx);
      });
      el.addEventListener('mouseenter', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        updateSelectionHighlight(idx);
      });
    });
  }

  function updateSelectionHighlight(newIdx) {
    if (activeFilteredCommands.length === 0) return;
    selectedIndex = Math.max(0, Math.min(newIdx, activeFilteredCommands.length - 1));

    const items = cmdResults.querySelectorAll('.cmd-item');
    items.forEach(el => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      if (idx === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  function executeCmdIndex(idx) {
    const cmd = activeFilteredCommands[idx];
    if (cmd && typeof cmd.action === 'function') {
      window.closeCmdPalette();
      if (window.SoundFX) window.SoundFX.click();
      setTimeout(() => cmd.action(), 100);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (cmdPaletteBtn) {
    cmdPaletteBtn.addEventListener('click', openCmdPalette);
  }

  if (cmdCloseBtn) {
    cmdCloseBtn.addEventListener('click', window.closeCmdPalette);
  }

  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener('click', (e) => {
      if (e.target === cmdPaletteModal) window.closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      renderCmdResults(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (activeFilteredCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (selectedIndex + 1) % activeFilteredCommands.length;
        updateSelectionHighlight(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (selectedIndex - 1 + activeFilteredCommands.length) % activeFilteredCommands.length;
        updateSelectionHighlight(prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCmdIndex(selectedIndex);
      }
    });
  }

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, and '/')
  window.addEventListener('keydown', (e) => {
    // Check for Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteModal && cmdPaletteModal.classList.contains('open')) {
        window.closeCmdPalette();
      } else {
        openCmdPalette();
      }
      return;
    }

    // Quick trigger with '/' when not typing in an input/textarea
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (cmdPaletteModal && !cmdPaletteModal.classList.contains('open')) {
        e.preventDefault();
        openCmdPalette();
      }
    }
  });
});
