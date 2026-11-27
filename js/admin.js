/**
 * PROJECT CMS ADMIN SCRIPT
 * GitHub API-powered Project Manager for Static GitHub Pages Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEYS = {
    TOKEN: 'portfolio_cms_gh_token',
    REMEMBER: 'portfolio_cms_remember',
    REPO: 'portfolio_cms_repo_cfg',
    DRAFT: 'portfolio_cms_projects_draft',
    THEME: 'portfolio-theme'
  };

  const CATEGORY_LABELS = {
    web: 'Web Application',
    fullstack: 'AI & Full-Stack',
    mobile: 'Fintech & Mobile UI',
    design: 'Design System & UI/UX'
  };

  const DEFAULT_REPO = {
    owner: 'aduyngrh',
    repo: 'portofolio',
    branch: 'main'
  };

  const state = {
    token: '',
    repoCfg: loadRepoCfg(),
    user: null,
    projects: [],
    baselineProjectsJson: '[]',
    pendingImages: {}, // repoPath -> { base64, dataUrl, fileName, size }
    imagePreviewCache: {}, // repoPath -> dataUrl (survives immediately after publish)
    filter: 'all',
    search: '',
    editingIndex: -1,
    deletingIndex: -1,
    isBusy: false,
    editorFeatures: [],
    editorTechStack: [],
    editorImageMode: 'upload'
  };

  // ========================================================================
  // DOM ELEMENTS
  // ========================================================================
  const authView = document.getElementById('auth-view');
  const dashboardView = document.getElementById('dashboard-view');
  const authForm = document.getElementById('auth-form');
  const authError = document.getElementById('auth-error');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const tokenInput = document.getElementById('token-input');
  const toggleTokenVis = document.getElementById('toggle-token-vis');
  const rememberTokenCb = document.getElementById('remember-token');
  const repoOwnerInput = document.getElementById('repo-owner');
  const repoNameInput = document.getElementById('repo-name');
  const repoBranchInput = document.getElementById('repo-branch');

  const topbarRepoLabel = document.getElementById('topbar-repo-label');
  const userAvatar = document.getElementById('user-avatar');
  const userHandle = document.getElementById('user-handle');
  const syncGithubBtn = document.getElementById('sync-github-btn');
  const logoutBtn = document.getElementById('logout-btn');

  const publishBanner = document.getElementById('publish-banner');
  const publishSummaryText = document.getElementById('publish-summary-text');
  const discardDraftBtn = document.getElementById('discard-draft-btn');
  const publishAllBtn = document.getElementById('publish-all-btn');

  const projectTotalCount = document.getElementById('project-total-count');
  const searchInput = document.getElementById('cms-search-input');
  const filterTabs = document.querySelectorAll('#cms-filter-tabs .filter-btn');
  const projectsListEl = document.getElementById('admin-projects-list');
  const addProjectBtn = document.getElementById('add-project-btn');

  // Editor Modal
  const editorModal = document.getElementById('editor-modal');
  const editorModalTitle = document.getElementById('editor-modal-title');
  const editorCloseBtn = document.getElementById('editor-close-btn');
  const editorCancelBtn = document.getElementById('editor-cancel-btn');
  const editorForm = document.getElementById('project-editor-form');
  const saveDraftBtn = document.getElementById('save-draft-btn');
  const savePublishBtn = document.getElementById('save-publish-btn');

  const fieldTitle = document.getElementById('field-title');
  const fieldId = document.getElementById('field-id');
  const fieldCategory = document.getElementById('field-category');
  const fieldCategoryLabel = document.getElementById('field-category-label');
  const fieldHighlights = document.getElementById('field-highlights');
  const fieldDescription = document.getElementById('field-description');
  const fieldFullDescription = document.getElementById('field-full-description');
  const fieldDemoUrl = document.getElementById('field-demo-url');
  const fieldGithubUrl = document.getElementById('field-github-url');

  const tabUploadImg = document.getElementById('tab-upload-img');
  const tabUrlImg = document.getElementById('tab-url-img');
  const panelUploadImg = document.getElementById('panel-upload-img');
  const panelUrlImg = document.getElementById('panel-url-img');
  const thumbDropzone = document.getElementById('thumb-dropzone');
  const fieldImageFile = document.getElementById('field-image-file');
  const uploadFileMeta = document.getElementById('upload-file-meta');
  const uploadFileName = document.getElementById('upload-file-name');
  const clearUploadBtn = document.getElementById('clear-upload-btn');
  const fieldImageUrl = document.getElementById('field-image-url');

  const featuresBuilder = document.getElementById('features-builder');
  const addFeatureBtn = document.getElementById('add-feature-btn');
  const techChipsList = document.getElementById('tech-chips-list');
  const techChipInput = document.getElementById('tech-chip-input');
  const liveCardPreview = document.getElementById('live-card-preview');

  // Delete Modal
  const deleteModal = document.getElementById('delete-modal');
  const deleteCloseBtn = document.getElementById('delete-close-btn');
  const deleteCancelBtn = document.getElementById('delete-cancel-btn');
  const deleteDraftBtn = document.getElementById('delete-draft-btn');
  const deletePublishBtn = document.getElementById('delete-publish-btn');
  const deleteProjectName = document.getElementById('delete-project-name');

  const cmsToast = document.getElementById('cms-toast');
  let toastTimer = null;
  let tempUploadedImage = null; // { repoPath, base64, dataUrl, fileName, size }
  let idManuallyEdited = false;

  // ========================================================================
  // THEME INITIALIZATION
  // ========================================================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.querySelectorAll('.theme-icon-label').forEach(el => {
      el.textContent = theme === 'light' ? '🌙' : '☀️';
    });
  }

  applyTheme(localStorage.getItem(STORAGE_KEYS.THEME) || 'dark');

  ['auth-theme-toggle', 'dash-theme-toggle'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  });

  // ========================================================================
  // UTILITIES
  // ========================================================================
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugify(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'proyek-baru';
  }

  function base64ToUtf8(b64) {
    const bin = atob(String(b64).replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }

  function sanitizeImageSrc(src) {
    const path = String(src || '').trim();
    if (!path) return 'assets/images/projects/project-1.svg';
    if (state.pendingImages[path]) return state.pendingImages[path].dataUrl;
    if (state.imagePreviewCache[path]) return state.imagePreviewCache[path];
    if (/^(https?:\/\/|assets\/|\.\/assets\/|data:image\/)/i.test(path)) return path;
    return 'assets/images/projects/project-1.svg';
  }

  function showToast(msg, duration = 3400) {
    if (!cmsToast) return;
    cmsToast.textContent = msg;
    cmsToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cmsToast.classList.remove('show');
    }, duration);
  }

  function loadRepoCfg() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPO);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.owner && parsed.repo && parsed.branch) return parsed;
      }
    } catch (_) {}
    return { ...DEFAULT_REPO };
  }

  function saveRepoCfg(cfg) {
    state.repoCfg = cfg;
    localStorage.setItem(STORAGE_KEYS.REPO, JSON.stringify(cfg));
  }

  function getStoredToken() {
    return sessionStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem(STORAGE_KEYS.TOKEN) || '';
  }

  function saveToken(token, remember) {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REMEMBER, '1');
    } else {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REMEMBER, '0');
    }
  }

  function clearToken() {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  function saveDraftToLocal() {
    try {
      const payload = {
        projects: state.projects,
        pendingImages: state.pendingImages
      };
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(payload));
    } catch (_) {
      // Ignore quota errors if very large image
    }
  }

  function loadDraftFromLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function clearDraftFromLocal() {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  }

  function hasUnsavedChanges() {
    const currentJson = JSON.stringify(state.projects);
    const hasImgPending = Object.keys(state.pendingImages).length > 0;
    return currentJson !== state.baselineProjectsJson || hasImgPending;
  }

  // ========================================================================
  // GITHUB REST + GIT DATA API CLIENT
  // ========================================================================
  async function ghRequest(endpoint, options = {}) {
    const url = `https://api.github.com${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${state.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let msg = `GitHub API error (${res.status})`;
      try {
        const errData = await res.json();
        if (errData && errData.message) msg = errData.message;
      } catch (_) {}
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }

    if (res.status === 204) return null;
    return res.json();
  }

  async function verifyAuthAndRepo() {
    const { owner, repo } = state.repoCfg;
    const [user, repoInfo] = await Promise.all([
      ghRequest('/user'),
      ghRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
    ]);

    if (!repoInfo.permissions || !repoInfo.permissions.push) {
      throw new Error('Token tidak memiliki izin tulis (Contents: Read and write) ke repositori ini.');
    }

    state.user = user;
  }

  async function fetchProjectsFromGitHub() {
    const { owner, repo, branch } = state.repoCfg;
    try {
      const file = await ghRequest(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/data/projects.json?ref=${encodeURIComponent(branch)}&_=${Date.now()}`
      );
      if (file && file.content) {
        const decoded = base64ToUtf8(file.content);
        const parsed = JSON.parse(decoded);
        const list = Array.isArray(parsed) ? parsed : (parsed.projects || []);
        return list;
      }
    } catch (err) {
      if (err.status !== 404) throw err;
    }

    // Fallback to local static data if data/projects.json isn't on GitHub yet
    if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.projects)) {
      return JSON.parse(JSON.stringify(window.PORTFOLIO_DATA.projects));
    }
    return [];
  }

  async function commitToGitHub(commitMessage) {
    const { owner, repo, branch } = state.repoCfg;
    const baseEndpoint = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

    // 1. Get HEAD commit SHA and base tree SHA
    const refData = await ghRequest(`${baseEndpoint}/git/ref/heads/${encodeURIComponent(branch)}`);
    const latestCommitSha = refData.object.sha;
    const commitData = await ghRequest(`${baseEndpoint}/git/commits/${latestCommitSha}`);
    const baseTreeSha = commitData.tree.sha;

    const treeEntries = [];

    // 2. Upload only pending images actually referenced by current projects
    const referencedPaths = new Set(state.projects.map(p => p.image));
    const uploadedPaths = [];

    for (const [repoPath, imgObj] of Object.entries(state.pendingImages)) {
      if (!referencedPaths.has(repoPath)) continue;
      const blob = await ghRequest(`${baseEndpoint}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({
          content: imgObj.base64,
          encoding: 'base64'
        })
      });
      treeEntries.push({
        path: repoPath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
      uploadedPaths.push({ repoPath, dataUrl: imgObj.dataUrl });
    }

    // 3. Create blob for data/projects.json
    const jsonPayload = JSON.stringify({
      version: 1,
      updatedAt: new Date().toISOString(),
      projects: state.projects
    }, null, 2) + '\n';

    const jsonBlob = await ghRequest(`${baseEndpoint}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content: utf8ToBase64(jsonPayload),
        encoding: 'base64'
      })
    });

    treeEntries.push({
      path: 'data/projects.json',
      mode: '100644',
      type: 'blob',
      sha: jsonBlob.sha
    });

    // 4. Create tree -> commit -> update branch ref
    const newTree = await ghRequest(`${baseEndpoint}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries
      })
    });

    const newCommit = await ghRequest(`${baseEndpoint}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: commitMessage,
        tree: newTree.sha,
        parents: [latestCommitSha]
      })
    });

    await ghRequest(`${baseEndpoint}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: newCommit.sha,
        force: false
      })
    });

    // Cache uploaded previews in session so thumbnails stay visible while Pages rebuilds
    uploadedPaths.forEach(({ repoPath, dataUrl }) => {
      state.imagePreviewCache[repoPath] = dataUrl;
    });
    state.pendingImages = {};
    state.baselineProjectsJson = JSON.stringify(state.projects);
    clearDraftFromLocal();
  }

  // ========================================================================
  // AUTH FLOW
  // ========================================================================
  if (repoOwnerInput) repoOwnerInput.value = state.repoCfg.owner;
  if (repoNameInput) repoNameInput.value = state.repoCfg.repo;
  if (repoBranchInput) repoBranchInput.value = state.repoCfg.branch;

  if (toggleTokenVis && tokenInput) {
    toggleTokenVis.addEventListener('click', () => {
      const isHidden = tokenInput.type === 'password';
      tokenInput.type = isHidden ? 'text' : 'password';
      toggleTokenVis.textContent = isHidden ? 'Sembunyi' : 'Lihat';
    });
  }

  async function enterDashboard(token, remember) {
    state.token = token;
    await verifyAuthAndRepo();
    saveToken(token, remember);

    const remoteProjects = await fetchProjectsFromGitHub();
    state.baselineProjectsJson = JSON.stringify(remoteProjects);

    const draft = loadDraftFromLocal();
    if (draft && Array.isArray(draft.projects)) {
      state.projects = draft.projects;
      state.pendingImages = draft.pendingImages || {};
      showToast('Draft lokal yang belum dipublish dipulihkan.');
    } else {
      state.projects = JSON.parse(JSON.stringify(remoteProjects));
      state.pendingImages = {};
    }

    renderDashboardHeader();
    renderProjectsList();
    updatePublishBanner();

    authView.hidden = true;
    dashboardView.hidden = false;
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (state.isBusy) return;

      const token = tokenInput.value.trim();
      const owner = repoOwnerInput.value.trim();
      const repo = repoNameInput.value.trim();
      const branch = repoBranchInput.value.trim() || 'main';
      const remember = rememberTokenCb ? rememberTokenCb.checked : true;

      if (!token || !owner || !repo) return;

      authError.hidden = true;
      state.isBusy = true;
      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'Menghubungkan...';

      saveRepoCfg({ owner, repo, branch });

      try {
        await enterDashboard(token, remember);
      } catch (err) {
        clearToken();
        authError.textContent = err.message || 'Gagal terhubung ke GitHub. Periksa kembali token dan nama repositori.';
        authError.hidden = false;
      } finally {
        state.isBusy = false;
        authSubmitBtn.disabled = false;
        authSubmitBtn.innerHTML = '<span>Hubungkan &amp; Masuk</span>';
      }
    });
  }

  // Auto-login if token exists
  (async function tryAutoLogin() {
    const saved = getStoredToken();
    if (!saved) return;

    tokenInput.value = saved;
    const remember = localStorage.getItem(STORAGE_KEYS.REMEMBER) !== '0';
    if (rememberTokenCb) rememberTokenCb.checked = remember;

    try {
      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'Memeriksa sesi...';
      await enterDashboard(saved, remember);
    } catch (_) {
      clearToken();
      authSubmitBtn.disabled = false;
      authSubmitBtn.innerHTML = '<span>Hubungkan &amp; Masuk</span>';
    }
  })();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearToken();
      state.token = '';
      state.user = null;
      dashboardView.hidden = true;
      authView.hidden = false;
      tokenInput.value = '';
      showToast('Berhasil keluar dari sesi CMS.');
    });
  }

  // ========================================================================
  // DASHBOARD RENDERING & ACTIONS
  // ========================================================================
  function renderDashboardHeader() {
    const { owner, repo, branch } = state.repoCfg;
    if (topbarRepoLabel) topbarRepoLabel.textContent = `${owner}/${repo} · ${branch}`;
    if (state.user) {
      if (userHandle) userHandle.textContent = `@${state.user.login}`;
      if (userAvatar && state.user.avatar_url) {
        userAvatar.src = state.user.avatar_url;
        userAvatar.alt = state.user.login;
        userAvatar.hidden = false;
      }
    }
  }

  function updatePublishBanner() {
    const dirty = hasUnsavedChanges();
    publishBanner.hidden = !dirty;
    if (dirty) {
      const pendingImgCount = Object.keys(state.pendingImages).length;
      publishSummaryText.textContent = pendingImgCount > 0
        ? `Draft lokal tersimpan (${pendingImgCount} file gambar siap diupload ke GitHub).`
        : 'Draft lokal tersimpan. Klik Publish agar tampil di GitHub Pages.';
    }
  }

  function renderProjectsList() {
    if (projectTotalCount) projectTotalCount.textContent = state.projects.length;

    const q = state.search.trim().toLowerCase();
    const filtered = state.projects
      .map((proj, index) => ({ proj, index }))
      .filter(({ proj }) => {
        if (state.filter !== 'all' && proj.category !== state.filter) return false;
        if (!q) return true;
        const haystack = [
          proj.title,
          proj.description,
          proj.categoryLabel,
          ...(proj.techStack || [])
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      });

    if (filtered.length === 0) {
      projectsListEl.innerHTML = `
        <div class="cms-empty-state">
          <p><strong>Tidak ada proyek ditemukan.</strong></p>
          <p style="font-size: 0.85rem; margin-top: 0.35rem;">Ubah filter pencarian atau klik tombol "+ Tambah Proyek".</p>
        </div>
      `;
      return;
    }

    projectsListEl.innerHTML = filtered.map(({ proj, index }) => {
      const imgSrc = sanitizeImageSrc(proj.image);
      const stack = Array.isArray(proj.techStack) ? proj.techStack : [];
      const featuresCount = Array.isArray(proj.features) ? proj.features.length : 0;

      return `
        <article class="cms-project-row" data-index="${index}">
          <div class="cms-row-thumb">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(proj.title)}" loading="lazy">
            <span class="cms-row-order">#${index + 1}</span>
          </div>

          <div class="cms-row-body">
            <div class="cms-row-meta">
              <span class="project-category-label">${escapeHtml(proj.categoryLabel || proj.category)}</span>
              ${proj.highlights ? `<span class="project-highlight-pill">${escapeHtml(proj.highlights)}</span>` : ''}
            </div>
            <h3 class="cms-row-title">${escapeHtml(proj.title)}</h3>
            <p class="cms-row-desc">${escapeHtml(proj.description)}</p>
            <div class="cms-row-footer">
              <div class="project-tags" style="margin-bottom: 0;">
                ${stack.slice(0, 5).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
                ${stack.length > 5 ? `<span class="tech-tag">+${stack.length - 5}</span>` : ''}
              </div>
              <span class="cms-row-info-pill">${featuresCount} fitur</span>
              <span class="cms-row-links">
                ${proj.demoUrl ? `<a href="${escapeHtml(proj.demoUrl)}" target="_blank" rel="noopener noreferrer">Demo ↗</a>` : ''}
                ${proj.githubUrl ? `<a href="${escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''}
              </span>
            </div>
          </div>

          <div class="cms-row-actions">
            <div class="cms-order-btns">
              <button type="button" class="btn btn-secondary btn-sm" data-action="up" data-index="${index}" ${index === 0 ? 'disabled' : ''} title="Naikkan urutan">↑</button>
              <button type="button" class="btn btn-secondary btn-sm" data-action="down" data-index="${index}" ${index === state.projects.length - 1 ? 'disabled' : ''} title="Turunkan urutan">↓</button>
            </div>
            <div class="cms-crud-btns">
              <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-index="${index}">Edit</button>
              <button type="button" class="btn btn-secondary btn-sm cms-btn-danger-outline" data-action="delete" data-index="${index}">Hapus</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  if (projectsListEl) {
    projectsListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (Number.isNaN(idx)) return;

      if (action === 'up' && idx > 0) {
        [state.projects[idx - 1], state.projects[idx]] = [state.projects[idx], state.projects[idx - 1]];
        saveDraftToLocal();
        renderProjectsList();
        updatePublishBanner();
      } else if (action === 'down' && idx < state.projects.length - 1) {
        [state.projects[idx], state.projects[idx + 1]] = [state.projects[idx + 1], state.projects[idx]];
        saveDraftToLocal();
        renderProjectsList();
        updatePublishBanner();
      } else if (action === 'edit') {
        openEditorModal(idx);
      } else if (action === 'delete') {
        openDeleteModal(idx);
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      renderProjectsList();
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filter = tab.getAttribute('data-filter') || 'all';
      renderProjectsList();
    });
  });

  if (syncGithubBtn) {
    syncGithubBtn.addEventListener('click', async () => {
      if (state.isBusy) return;
      if (hasUnsavedChanges() && !window.confirm('Ada perubahan draft yang belum dipublish. Sinkronkan ulang dari GitHub dan buang draft lokal?')) {
        return;
      }
      try {
        syncGithubBtn.disabled = true;
        syncGithubBtn.textContent = 'Menyinkronkan...';
        const remoteProjects = await fetchProjectsFromGitHub();
        state.baselineProjectsJson = JSON.stringify(remoteProjects);
        state.projects = JSON.parse(JSON.stringify(remoteProjects));
        state.pendingImages = {};
        clearDraftFromLocal();
        renderProjectsList();
        updatePublishBanner();
        showToast('Data terbaru berhasil disinkronkan dari GitHub.');
      } catch (err) {
        showToast('Gagal sinkronisasi: ' + err.message);
      } finally {
        syncGithubBtn.disabled = false;
        syncGithubBtn.innerHTML = '<span>Sinkronkan</span>';
      }
    });
  }

  if (discardDraftBtn) {
    discardDraftBtn.addEventListener('click', () => {
      if (!window.confirm('Buang semua perubahan draft lokal dan kembalikan ke versi terakhir di GitHub?')) return;
      state.projects = JSON.parse(state.baselineProjectsJson);
      state.pendingImages = {};
      clearDraftFromLocal();
      renderProjectsList();
      updatePublishBanner();
      showToast('Draft lokal dibersihkan.');
    });
  }

  async function publishCurrentState(commitMsg) {
    if (state.isBusy) return;
    state.isBusy = true;
    publishAllBtn.disabled = true;
    publishAllBtn.textContent = 'Mempublish...';

    try {
      await commitToGitHub(commitMsg);
      updatePublishBanner();
      renderProjectsList();
      showToast('Berhasil dipublish ke GitHub! GitHub Pages akan update dalam ~30–60 detik.', 5000);
    } catch (err) {
      showToast('Gagal publish: ' + err.message, 4500);
      throw err;
    } finally {
      state.isBusy = false;
      publishAllBtn.disabled = false;
      publishAllBtn.innerHTML = '<span>Publish ke GitHub</span>';
    }
  }

  if (publishAllBtn) {
    publishAllBtn.addEventListener('click', () => {
      publishCurrentState('cms: update daftar proyek portofolio').catch(() => {});
    });
  }

  // ========================================================================
  // PROJECT EDITOR MODAL
  // ========================================================================
  function setImageMode(mode) {
    state.editorImageMode = mode;
    if (mode === 'upload') {
      tabUploadImg.classList.add('active');
      tabUrlImg.classList.remove('active');
      panelUploadImg.hidden = false;
      panelUrlImg.hidden = true;
    } else {
      tabUrlImg.classList.add('active');
      tabUploadImg.classList.remove('active');
      panelUrlImg.hidden = false;
      panelUploadImg.hidden = true;
    }
  }

  if (tabUploadImg) tabUploadImg.addEventListener('click', () => setImageMode('upload'));
  if (tabUrlImg) tabUrlImg.addEventListener('click', () => setImageMode('url'));

  function renderFeaturesBuilder() {
    featuresBuilder.innerHTML = state.editorFeatures.map((val, idx) => `
      <div class="cms-feature-row">
        <input
          type="text"
          class="form-control cms-feature-input"
          data-idx="${idx}"
          value="${escapeHtml(val)}"
          placeholder="Contoh: Integrasi Payment Gateway otomatis (QRIS, VA)"
        >
        <button type="button" class="cms-feature-remove" data-remove-feature="${idx}" aria-label="Hapus fitur">&times;</button>
      </div>
    `).join('');
  }

  featuresBuilder.addEventListener('input', (e) => {
    const input = e.target.closest('.cms-feature-input');
    if (!input) return;
    const idx = parseInt(input.getAttribute('data-idx'), 10);
    state.editorFeatures[idx] = input.value;
  });

  featuresBuilder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('cms-feature-input')) {
      e.preventDefault();
      state.editorFeatures.push('');
      renderFeaturesBuilder();
      const inputs = featuresBuilder.querySelectorAll('.cms-feature-input');
      if (inputs.length) inputs[inputs.length - 1].focus();
    }
  });

  featuresBuilder.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-feature]');
    if (!btn) return;
    const idx = parseInt(btn.getAttribute('data-remove-feature'), 10);
    state.editorFeatures.splice(idx, 1);
    if (state.editorFeatures.length === 0) state.editorFeatures.push('');
    renderFeaturesBuilder();
  });

  if (addFeatureBtn) {
    addFeatureBtn.addEventListener('click', () => {
      state.editorFeatures.push('');
      renderFeaturesBuilder();
      const inputs = featuresBuilder.querySelectorAll('.cms-feature-input');
      if (inputs.length) inputs[inputs.length - 1].focus();
    });
  }

  function renderTechChips() {
    techChipsList.innerHTML = state.editorTechStack.map((tech, idx) => `
      <span class="cms-chip">
        <span>${escapeHtml(tech)}</span>
        <button type="button" data-remove-tech="${idx}" aria-label="Hapus ${escapeHtml(tech)}">&times;</button>
      </span>
    `).join('');
    renderLivePreview();
  }

  function addTechTag(rawVal) {
    const tags = String(rawVal || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    tags.forEach(tag => {
      if (!state.editorTechStack.some(t => t.toLowerCase() === tag.toLowerCase())) {
        state.editorTechStack.push(tag);
      }
    });
    renderTechChips();
  }

  techChipInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (techChipInput.value.trim()) {
        addTechTag(techChipInput.value);
        techChipInput.value = '';
      }
    } else if (e.key === 'Backspace' && !techChipInput.value && state.editorTechStack.length > 0) {
      state.editorTechStack.pop();
      renderTechChips();
    }
  });

  techChipInput.addEventListener('blur', () => {
    if (techChipInput.value.trim()) {
      addTechTag(techChipInput.value);
      techChipInput.value = '';
    }
  });

  techChipsList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-tech]');
    if (!btn) return;
    const idx = parseInt(btn.getAttribute('data-remove-tech'), 10);
    state.editorTechStack.splice(idx, 1);
    renderTechChips();
  });

  document.querySelectorAll('#tech-suggestions [data-tech]').forEach(btn => {
    btn.addEventListener('click', () => {
      addTechTag(btn.getAttribute('data-tech'));
    });
  });

  document.querySelectorAll('#panel-url-img [data-img]').forEach(btn => {
    btn.addEventListener('click', () => {
      tempUploadedImage = null;
      uploadFileMeta.hidden = true;
      fieldImageUrl.value = btn.getAttribute('data-img');
      renderLivePreview();
    });
  });

  // Image File Handling
  function handleImageFile(file) {
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Format gambar tidak didukung. Gunakan PNG, JPG, WEBP, SVG, atau GIF.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 3 MB agar loading portofolio tetap cepat.');
      return;
    }

    const extMap = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/gif': 'gif'
    };
    const ext = extMap[file.type] || 'png';
    const slug = slugify(fieldId.value || fieldTitle.value || 'project');
    const uniqueSuffix = Date.now().toString(36).slice(-5);
    const repoPath = `assets/images/projects/${slug}-${uniqueSuffix}.${ext}`;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = String(dataUrl).split(',')[1];
      tempUploadedImage = {
        repoPath,
        base64,
        dataUrl,
        fileName: file.name,
        size: file.size
      };
      uploadFileName.textContent = `${file.name} (${Math.round(file.size / 1024)} KB) → ${repoPath}`;
      uploadFileMeta.hidden = false;
      renderLivePreview();
    };
    reader.readAsDataURL(file);
  }

  thumbDropzone.addEventListener('click', () => fieldImageFile.click());
  thumbDropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fieldImageFile.click();
    }
  });

  fieldImageFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  thumbDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    thumbDropzone.classList.add('dragover');
  });

  thumbDropzone.addEventListener('dragleave', () => {
    thumbDropzone.classList.remove('dragover');
  });

  thumbDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    thumbDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  clearUploadBtn.addEventListener('click', () => {
    tempUploadedImage = null;
    fieldImageFile.value = '';
    uploadFileMeta.hidden = true;
    renderLivePreview();
  });

  // Auto-slug & category label sync
  fieldTitle.addEventListener('input', () => {
    if (state.editingIndex === -1 && !idManuallyEdited) {
      fieldId.value = slugify(fieldTitle.value);
    }
    renderLivePreview();
  });

  fieldId.addEventListener('input', () => {
    idManuallyEdited = true;
  });

  fieldCategory.addEventListener('change', () => {
    fieldCategoryLabel.value = CATEGORY_LABELS[fieldCategory.value] || fieldCategory.value;
    renderLivePreview();
  });

  [fieldCategoryLabel, fieldHighlights, fieldDescription, fieldImageUrl, fieldDemoUrl].forEach(el => {
    if (el) el.addEventListener('input', renderLivePreview);
  });

  function getActivePreviewImgSrc() {
    if (tempUploadedImage) return tempUploadedImage.dataUrl;
    return sanitizeImageSrc(fieldImageUrl.value);
  }

  function renderLivePreview() {
    const title = fieldTitle.value.trim() || 'Judul Proyek Anda';
    const categoryLabel = fieldCategoryLabel.value.trim() || CATEGORY_LABELS[fieldCategory.value] || 'Web Application';
    const highlights = fieldHighlights.value.trim();
    const desc = fieldDescription.value.trim() || 'Deskripsi singkat mengenai solusi dan teknologi yang dibangun di proyek ini.';
    const imgSrc = getActivePreviewImgSrc();
    const demoUrl = fieldDemoUrl.value.trim();
    const stack = state.editorTechStack;

    liveCardPreview.innerHTML = `
      <article class="project-card">
        <div class="project-thumbnail">
          <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(title)}">
        </div>
        <div class="project-content">
          <div class="project-top-meta">
            <span class="project-category-label">${escapeHtml(categoryLabel)}</span>
            ${highlights ? `<span class="project-highlight-pill">${escapeHtml(highlights)}</span>` : ''}
          </div>
          <h4 class="project-title">${escapeHtml(title)}</h4>
          <p class="project-desc">${escapeHtml(desc)}</p>
          <div class="project-tags">
            ${stack.slice(0, 4).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
            ${stack.length > 4 ? `<span class="tech-tag">+${stack.length - 4}</span>` : ''}
          </div>
          <div class="project-actions">
            <button type="button" class="btn btn-secondary btn-sm"><span>Studi Kasus</span></button>
            ${demoUrl ? `<span class="btn btn-primary btn-sm"><span>Kunjungi ↗</span></span>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function openEditorModal(index = -1) {
    state.editingIndex = index;
    tempUploadedImage = null;
    fieldImageFile.value = '';
    uploadFileMeta.hidden = true;
    idManuallyEdited = index !== -1;

    if (index === -1) {
      editorModalTitle.textContent = 'Tambah Proyek Baru';
      fieldTitle.value = '';
      fieldId.value = '';
      fieldCategory.value = 'web';
      fieldCategoryLabel.value = CATEGORY_LABELS.web;
      fieldHighlights.value = '';
      fieldImageUrl.value = 'assets/images/projects/project-1.svg';
      fieldDescription.value = '';
      fieldFullDescription.value = '';
      fieldDemoUrl.value = '';
      fieldGithubUrl.value = '';
      state.editorFeatures = [''];
      state.editorTechStack = ['React', 'TypeScript'];
      setImageMode('upload');
    } else {
      const proj = state.projects[index];
      editorModalTitle.textContent = `Edit Proyek: ${proj.title}`;
      fieldTitle.value = proj.title || '';
      fieldId.value = proj.id || '';
      fieldCategory.value = proj.category || 'web';
      fieldCategoryLabel.value = proj.categoryLabel || CATEGORY_LABELS[proj.category] || '';
      fieldHighlights.value = proj.highlights || '';
      fieldImageUrl.value = proj.image || 'assets/images/projects/project-1.svg';
      fieldDescription.value = proj.description || '';
      fieldFullDescription.value = proj.fullDescription || '';
      fieldDemoUrl.value = proj.demoUrl || '';
      fieldGithubUrl.value = proj.githubUrl || '';
      state.editorFeatures = Array.isArray(proj.features) && proj.features.length ? [...proj.features] : [''];
      state.editorTechStack = Array.isArray(proj.techStack) ? [...proj.techStack] : [];

      const existingPending = state.pendingImages[proj.image];
      if (existingPending) {
        uploadFileName.textContent = `${existingPending.fileName} (menunggu publish) → ${proj.image}`;
        uploadFileMeta.hidden = false;
        setImageMode('upload');
      } else {
        setImageMode('url');
      }
    }

    renderFeaturesBuilder();
    renderTechChips();
    renderLivePreview();

    editorModal.classList.add('open');
    editorModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeEditorModal() {
    editorModal.classList.remove('open');
    editorModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (addProjectBtn) addProjectBtn.addEventListener('click', () => openEditorModal(-1));
  if (editorCloseBtn) editorCloseBtn.addEventListener('click', closeEditorModal);
  if (editorCancelBtn) editorCancelBtn.addEventListener('click', closeEditorModal);
  if (editorModal) {
    editorModal.addEventListener('click', (e) => {
      if (e.target === editorModal) closeEditorModal();
    });
  }

  function buildProjectFromForm() {
    if (techChipInput.value.trim()) {
      addTechTag(techChipInput.value);
      techChipInput.value = '';
    }

    const title = fieldTitle.value.trim();
    const id = slugify(fieldId.value.trim() || title);
    const category = fieldCategory.value;
    const categoryLabel = fieldCategoryLabel.value.trim() || CATEGORY_LABELS[category] || category;
    const description = fieldDescription.value.trim();
    const fullDescription = fieldFullDescription.value.trim() || description;
    const highlights = fieldHighlights.value.trim();
    const demoUrl = fieldDemoUrl.value.trim();
    const githubUrl = fieldGithubUrl.value.trim();
    const features = state.editorFeatures.map(f => f.trim()).filter(Boolean);
    const techStack = [...state.editorTechStack];

    if (!title || !description) {
      showToast('Judul dan deskripsi singkat wajib diisi.');
      return null;
    }

    // Check duplicate slug
    const duplicateIdx = state.projects.findIndex((p, idx) => p.id === id && idx !== state.editingIndex);
    if (duplicateIdx !== -1) {
      showToast(`ID "${id}" sudah digunakan proyek lain. Gunakan ID yang unik.`);
      return null;
    }

    let imagePath = fieldImageUrl.value.trim() || 'assets/images/projects/project-1.svg';
    if (tempUploadedImage) {
      imagePath = tempUploadedImage.repoPath;
      state.pendingImages[imagePath] = tempUploadedImage;
    }

    return {
      id,
      title,
      category,
      categoryLabel,
      description,
      fullDescription,
      features,
      techStack,
      image: imagePath,
      demoUrl,
      githubUrl,
      highlights
    };
  }

  function applyEditorToState() {
    const projectObj = buildProjectFromForm();
    if (!projectObj) return null;

    if (state.editingIndex === -1) {
      state.projects.unshift(projectObj); // Put newly added project first
    } else {
      state.projects[state.editingIndex] = projectObj;
    }

    saveDraftToLocal();
    renderProjectsList();
    updatePublishBanner();
    return projectObj;
  }

  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      if (!editorForm.reportValidity()) return;
      const saved = applyEditorToState();
      if (!saved) return;
      closeEditorModal();
      showToast('Proyek disimpan ke draft lokal.');
    });
  }

  if (editorForm) {
    editorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (state.isBusy) return;
      const isNew = state.editingIndex === -1;
      const saved = applyEditorToState();
      if (!saved) return;

      savePublishBtn.disabled = true;
      savePublishBtn.textContent = 'Menyimpan ke GitHub...';

      try {
        const actionWord = isNew ? 'add' : 'update';
        await publishCurrentState(`cms: ${actionWord} project "${saved.title}"`);
        closeEditorModal();
      } catch (_) {
        closeEditorModal();
      } finally {
        savePublishBtn.disabled = false;
        savePublishBtn.innerHTML = '<span>Simpan &amp; Publish ke GitHub</span>';
      }
    });
  }

  // ========================================================================
  // DELETE MODAL
  // ========================================================================
  function openDeleteModal(index) {
    const proj = state.projects[index];
    if (!proj) return;
    state.deletingIndex = index;
    deleteProjectName.textContent = proj.title;
    deleteModal.classList.add('open');
    deleteModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('open');
    deleteModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.deletingIndex = -1;
  }

  function performDeleteFromState() {
    if (state.deletingIndex < 0 || state.deletingIndex >= state.projects.length) return null;
    const [removed] = state.projects.splice(state.deletingIndex, 1);
    saveDraftToLocal();
    renderProjectsList();
    updatePublishBanner();
    return removed;
  }

  if (deleteCloseBtn) deleteCloseBtn.addEventListener('click', closeDeleteModal);
  if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteModal);
  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });
  }

  if (deleteDraftBtn) {
    deleteDraftBtn.addEventListener('click', () => {
      const removed = performDeleteFromState();
      closeDeleteModal();
      if (removed) showToast(`"${removed.title}" dihapus dari draft lokal.`);
    });
  }

  if (deletePublishBtn) {
    deletePublishBtn.addEventListener('click', async () => {
      if (state.isBusy) return;
      const removed = performDeleteFromState();
      if (!removed) return;
      deletePublishBtn.disabled = true;
      deletePublishBtn.textContent = 'Menghapus...';
      try {
        await publishCurrentState(`cms: delete project "${removed.title}"`);
      } catch (_) {}
      deletePublishBtn.disabled = false;
      deletePublishBtn.textContent = 'Hapus & Publish';
      closeDeleteModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (editorModal.classList.contains('open')) closeEditorModal();
      if (deleteModal.classList.contains('open')) closeDeleteModal();
    }
  });
});
