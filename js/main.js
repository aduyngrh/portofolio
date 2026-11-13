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
      "Full-Stack Web Developer",
      "UI/UX Designer",
      "Problem Solver & Engineer",
      "Clean Code Enthusiast"
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
  // 7. RENDER SKILLS & PROGRESS BARS
  // ==========================================
  const frontendSkillsContainer = document.getElementById('frontend-skills-list');
  const backendSkillsContainer = document.getElementById('backend-skills-list');
  const toolsSkillsContainer = document.getElementById('tools-skills-list');

  function renderSkillCategory(container, skillsList) {
    if (!container || !Array.isArray(skillsList)) return;
    container.innerHTML = skillsList.map(skill => `
      <div class="skill-item">
        <div class="skill-info">
          <span>${skill.name}</span>
          <span class="skill-pct">${skill.level}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-level="${skill.level}"></div>
        </div>
      </div>
    `).join('');
  }

  if (data.skills) {
    renderSkillCategory(frontendSkillsContainer, data.skills.frontend);
    renderSkillCategory(backendSkillsContainer, data.skills.backend);
    renderSkillCategory(toolsSkillsContainer, data.skills.tools);
  }

  function triggerSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      if (level) {
        bar.style.width = level + '%';
      }
    });
  }

  // ==========================================
  // 8. RENDER & FILTER PROJECTS
  // ==========================================
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsGrid || !data.projects) return;

    const filtered = filter === 'all' 
      ? data.projects 
      : data.projects.filter(p => p.category === filter);

    projectsGrid.innerHTML = filtered.map(proj => `
      <div class="project-card reveal-on-scroll tilt-card" data-id="${proj.id}">
        <div class="project-thumbnail" onclick="openProjectModal('${proj.id}')">
          <span class="project-category-badge">${proj.categoryLabel}</span>
          <img src="${proj.image}" alt="${proj.title}" loading="lazy" />
          <div class="project-overlay">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openProjectModal('${proj.id}')">
              Lihat Detail 🔍
            </button>
          </div>
        </div>
        <div class="project-content">
          <h4 class="project-title">${proj.title}</h4>
          <p class="project-desc">${proj.description}</p>
          <div class="project-tags">
            ${proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div class="project-actions">
            <button class="btn btn-secondary btn-sm" onclick="openProjectModal('${proj.id}')">
              Detail Lengkap
            </button>
            <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              Live Demo ↗
            </a>
          </div>
        </div>
      </div>
    `).join('');

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

  // Render initial projects
  renderProjects('all');

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

    modalProjectDetails.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="section-tag" style="margin-bottom: 0.5rem;">${project.categoryLabel}</span>
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">${project.title}</h2>
        <div style="font-size: 0.85rem; color: var(--accent-secondary); font-family: var(--font-mono); font-weight: 600;">
          ✨ ${project.highlights || 'High-Performance Architecture'}
        </div>
      </div>

      <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--border-color); background: var(--bg-primary);">
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: auto; display: block;" />
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Tentang Proyek</h4>
        <p style="color: var(--text-secondary); line-height: 1.7;">${project.fullDescription || project.description}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.8rem;">Fitur Utama & Keunggulan</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
          ${(project.features || []).map(f => `
            <li style="display: flex; align-items: flex-start; gap: 0.6rem; color: var(--text-secondary);">
              <span style="color: var(--success); font-weight: bold;">✓</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.6rem;">Teknologi yang Digunakan</h4>
        <div class="project-tags">
          ${project.techStack.map(t => `<span class="tech-tag" style="font-size: 0.85rem; padding: 0.35rem 0.8rem;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Buka Live Demo ↗
        </a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          Lihat Source Code di GitHub 💻
        </a>
      </div>
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
  // 12. TESTIMONIALS RENDERING
  // ==========================================
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid && data.testimonials) {
    testimonialsGrid.innerHTML = data.testimonials.map(item => `
      <div class="testimonial-card reveal-on-scroll">
        <p class="testimonial-quote">${item.text}</p>
        <div class="testimonial-author">
          <img src="${item.avatar}" alt="${item.name}" class="author-avatar" />
          <div>
            <div class="author-name">${item.name}</div>
            <div class="author-role">${item.role}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 13. INTERACTIVE PLAYGROUND (CARD STYLER)
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
    demoCard.style.boxShadow = `0 10px 30px rgba(0,0,0,0.3), 0 0 ${g}px rgba(99, 102, 241, 0.5)`;

    if (playgroundCode) {
      playgroundCode.textContent = `.card {
  border-radius: ${r}px;
  backdrop-filter: blur(${b}px);
  box-shadow: 0 0 ${g}px rgba(99, 102, 241, 0.5);
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
      { id: 'theme', group: 'Aksi Cepat', title: 'Ganti Tema (Gelap / Terang)', desc: 'Alihkan mode tampilan layar', icon: '🌓', badge: 'Aksi', action: () => { if (themeToggleBtn) themeToggleBtn.click(); } },
      { id: 'sound', group: 'Aksi Cepat', title: 'Toggle Efek Suara', desc: 'Aktifkan atau senyapkan efek audio synthesizer', icon: '🔊', badge: 'Aksi', action: () => { if (soundToggleBtn) soundToggleBtn.click(); } },
      { id: 'copy-email', group: 'Aksi Cepat', title: 'Salin Alamat Email', desc: data.profile ? data.profile.email : 'yudhanugraha081@gmail.com', icon: '📋', badge: 'Aksi', action: () => { if (copyEmailBtn) copyEmailBtn.click(); } },
      { id: 'whatsapp', group: 'Aksi Cepat', title: 'Chat Cepat via WhatsApp', desc: 'Kirim pesan langsung ke WhatsApp Yudha', icon: '💬', badge: 'Tautan', action: () => { const num = data.profile && data.profile.whatsapp ? data.profile.whatsapp.replace(/[^0-9]/g, '') : '6281234567890'; window.open(`https://wa.me/${num}?text=Halo%20Yudha,%20saya%20tertarik%20bekerja%20sama%20dengan%20Anda.`, '_blank'); } },
      { id: 'github', group: 'Aksi Cepat', title: 'Buka Profil GitHub', desc: data.profile && data.profile.github ? data.profile.github : 'https://github.com/aduyngrh', icon: '🐙', badge: 'Tautan', action: () => { window.open(data.profile && data.profile.github ? data.profile.github : 'https://github.com/aduyngrh', '_blank'); } },
      { id: 'linkedin', group: 'Aksi Cepat', title: 'Buka Profil LinkedIn', desc: data.profile && data.profile.linkedin ? data.profile.linkedin : 'https://linkedin.com/in/yudhanugraha', icon: '💼', badge: 'Tautan', action: () => { window.open(data.profile && data.profile.linkedin ? data.profile.linkedin : 'https://linkedin.com/in/yudhanugraha', '_blank'); } },

      // Navigation
      { id: 'nav-beranda', group: 'Navigasi Cepat', title: 'Beranda', desc: 'Kembali ke bagian teratas', icon: '🏠', badge: 'Navigasi', action: () => scrollToSection('beranda') },
      { id: 'nav-tentang', group: 'Navigasi Cepat', title: 'Tentang Saya', desc: 'Perjalanan, filosofi kerja & riwayat karier', icon: '👤', badge: 'Navigasi', action: () => scrollToSection('tentang') },
      { id: 'nav-keahlian', group: 'Navigasi Cepat', title: 'Keahlian Teknis', desc: 'Tech stack frontend, backend & tools', icon: '🛠️', badge: 'Navigasi', action: () => scrollToSection('keahlian') },
      { id: 'nav-proyek', group: 'Navigasi Cepat', title: 'Portofolio Karya', desc: 'Daftar aplikasi & proyek unggulan', icon: '📂', badge: 'Navigasi', action: () => scrollToSection('proyek') },
      { id: 'nav-playground', group: 'Navigasi Cepat', title: 'Interactive Playground', desc: 'Live Glassmorphism Card Styler demo', icon: '💎', badge: 'Demo', action: () => scrollToSection('playground') },
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
