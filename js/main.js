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
  // 3. NAVBAR SCROLL & SCROLL PROGRESS
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar glass blur
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

    // Scroll spy for active navbar link
    updateActiveNav();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Active section spy
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
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
      const email = data.profile ? data.profile.email : 'yudha.dev@example.com';
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
});
