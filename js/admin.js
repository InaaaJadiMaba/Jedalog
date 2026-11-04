// ===========================
// JedaLog - Admin Panel JS
// ===========================

// ---- CONSTANTS ----
const ADMIN_PIN = '1234'; // Change this to your preferred PIN
const STORAGE_KEY = 'jedalog-curhat-logs';
const SESSION_KEY = 'jedalog-admin-session';
const ROWS_PER_PAGE = 10;

// ---- STATE ----
let allLogs = [];
let filteredLogs = [];
let currentPage = 1;
let sortCol = 'timestamp';
let sortDir = 'desc';
let pinValue = '';
let confirmCallback = null;

// ---- SEED DEMO DATA (so the panel isn't empty on first visit) ----
function seedDemoData() {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (existing.length > 0) return;

  const moods = [
    { label: 'Exhausted', emoji: '😩' },
    { label: 'Sedih', emoji: '😔' },
    { label: 'Kesal', emoji: '😤' },
    { label: 'Cemas', emoji: '😰' },
    { label: 'Biasa', emoji: '😐' },
    { label: 'Baik', emoji: '🙂' },
    { label: 'Bahagia', emoji: '😊' },
  ];
  const topics = ['Akademik', 'Keluarga', 'Percintaan', 'Pekerjaan', 'Pertemanan', 'Kesehatan', 'Keuangan'];
  const texts = [
    'Akhir-akhir ini aku merasa sangat lelah dengan semua tugas kuliah yang menumpuk. Rasanya tidak ada waktu untuk istirahat.',
    'Hubunganku dengan orang tua sedang tidak baik. Mereka tidak mengerti impianku.',
    'Teman-temanku sepertinya tidak peduli lagi. Aku sering merasa sendirian di tengah keramaian.',
    'Deadline besok tapi aku belum bisa fokus sama sekali. Kepala selalu penuh dengan pikiran lain.',
    'Aku bersyukur banget hari ini. Akhirnya ujian selesai dan hasilnya memuaskan!',
    'Rasanya semua yang aku lakukan tidak pernah cukup. Selalu ada ekspektasi yang lebih tinggi.',
    'Keuanganku sedang sangat ketat. Tidak tahu harus cerita ke siapa.',
  ];

  const demo = texts.map((text, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i * 2);
    const mood = moods[i % moods.length];
    const selectedTopics = [topics[i % topics.length], topics[(i + 2) % topics.length]];
    return {
      id: `LOG-${Date.now() - i * 100000}`,
      timestamp: d.toISOString(),
      mood: `${mood.emoji} ${mood.label}`,
      topics: selectedTopics,
      text: text,
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
}

// ---- DATA HELPERS ----
function loadLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function deleteLog(id) {
  const logs = loadLogs().filter(l => l.id !== id);
  saveLogs(logs);
}

function deleteAllLogs() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---- TOAST ----
function adminToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('adminToastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
  `;
  container.appendChild(toast);

  // Add out animation style once
  if (!document.getElementById('toastOutStyle')) {
    const s = document.createElement('style');
    s.id = 'toastOutStyle';
    s.textContent = `@keyframes slideOutRight { to { transform: translateX(110%); opacity: 0; } }`;
    document.head.appendChild(s);
  }

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- CLOCK ----
function startClock() {
  function update() {
    const el = document.getElementById('adminClock');
    if (!el) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  update();
  setInterval(update, 1000);
}

// ---- LOGIN ----
function initLogin() {
  const form = document.getElementById('adminLoginForm');
  const input = document.getElementById('adminPinInput');
  const errorEl = document.getElementById('pinError');
  const dots = [0, 1, 2, 3].map(i => document.getElementById('dot' + i));

  // Update dots when typing
  function syncDots(val) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < val.length);
    });
  }

  // Numpad buttons
  document.querySelectorAll('.pin-key').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (val === 'del') {
        pinValue = pinValue.slice(0, -1);
      } else if (val === 'clear') {
        pinValue = '';
      } else if (pinValue.length < 4) {
        pinValue += val;
      }
      input.value = pinValue;
      syncDots(pinValue);
      errorEl.classList.remove('show');
    });
  });

  // Keyboard typing also works
  input.addEventListener('input', () => {
    pinValue = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = pinValue;
    syncDots(pinValue);
    errorEl.classList.remove('show');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (pinValue === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, '1');
      showAdminPanel();
    } else {
      errorEl.classList.add('show');
      pinValue = '';
      input.value = '';
      dots.forEach(dot => {
        dot.classList.remove('filled');
        dot.classList.add('shake');
        setTimeout(() => dot.classList.remove('shake'), 500);
      });
      adminToast('PIN salah. Silakan coba lagi.', 'error');
    }
  });
}

function showAdminPanel() {
  document.getElementById('adminLoginOverlay').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';
  initAdminPanel();
}

function checkSession() {
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    showAdminPanel();
    return true;
  }
  return false;
}

// ---- SIDEBAR NAVIGATION ----
function initNavigation() {
  const sidebarDash = document.getElementById('sidebarDashboard');
  const sidebarLogs = document.getElementById('sidebarLogs');
  const sidebarMsgs = document.getElementById('sidebarMessages');
  const viewAllBtn = document.getElementById('viewAllLogsBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const panel = document.getElementById('adminPanel');
  const sidebar = document.getElementById('adminSidebar');

  sidebarDash.addEventListener('click', e => {
    e.preventDefault();
    navigateTo('dashboard');
  });

  sidebarLogs.addEventListener('click', e => {
    e.preventDefault();
    navigateTo('logs');
  });

  sidebarMsgs.addEventListener('click', e => {
    e.preventDefault();
    navigateTo('messages');
  });

  viewAllBtn.addEventListener('click', () => navigateTo('logs'));

  const viewAllMsgsBtn = document.getElementById('viewAllMsgsBtn');
  if (viewAllMsgsBtn) viewAllMsgsBtn.addEventListener('click', () => navigateTo('messages'));

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminLoginOverlay').style.display = 'flex';
    pinValue = '';
    document.getElementById('adminPinInput').value = '';
    [0, 1, 2, 3].forEach(i => document.getElementById('dot' + i).classList.remove('filled'));
  });

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
    } else {
      panel.classList.toggle('sidebar-collapsed');
    }
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', e => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

function navigateTo(view) {
  // Update nav active states
  document.getElementById('sidebarDashboard').classList.toggle('active', view === 'dashboard');
  document.getElementById('sidebarLogs').classList.toggle('active', view === 'logs');
  document.getElementById('sidebarMessages').classList.toggle('active', view === 'messages');
  const sbChats = document.getElementById('sidebarChats');
  if (sbChats) sbChats.classList.toggle('active', view === 'chats');

  // Show / hide views
  document.getElementById('viewDashboard').classList.toggle('active', view === 'dashboard');
  document.getElementById('viewLogs').classList.toggle('active', view === 'logs');
  document.getElementById('viewMessages').classList.toggle('active', view === 'messages');
  const vwChats = document.getElementById('viewChats');
  if (vwChats) vwChats.classList.toggle('active', view === 'chats');

  // Update topbar title
  const titles = { dashboard: 'Dashboard', logs: 'Data Log Curhat', messages: 'Pesan Masuk', chats: 'Chat AI' };
  document.getElementById('topbarTitle').textContent = titles[view] || 'Dashboard';

  if (view === 'logs') renderLogsTable();
  if (view === 'dashboard') renderDashboard();
  if (view === 'messages') renderMessagesView();
  if (view === 'chats' && typeof renderChatsView === 'function') renderChatsView();

  // Close mobile sidebar
  document.getElementById('adminSidebar').classList.remove('open');
}

// ---- DASHBOARD ----
function renderDashboard() {
  allLogs = loadLogs();
  const now = new Date();

  // Stats
  const todayStr = now.toDateString();
  const weekAgo = new Date(now - 7 * 86400000);

  const total = allLogs.length;
  const today = allLogs.filter(l => new Date(l.timestamp).toDateString() === todayStr).length;
  const thisWeek = allLogs.filter(l => new Date(l.timestamp) >= weekAgo).length;

  // Most common mood
  const moodCount = {};
  allLogs.forEach(l => {
    const m = l.mood || 'Tidak Diketahui';
    moodCount[m] = (moodCount[m] || 0) + 1;
  });
  const mostMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];

  // Unread messages count for stat card
  const unreadMsgCount = loadMessages().filter(m => m.status === 'unread').length;

  // Animate stat numbers
  animateNumber('statTotal', total);
  animateNumber('statToday', today);
  animateNumber('statThisWeek', thisWeek);
  document.getElementById('statMostMood').textContent = mostMood ? mostMood[0].split(' ').slice(0, 2).join(' ') : '-';

  // Update unread messages stat card if it exists
  const statMsgEl = document.getElementById('statUnreadMsg');
  if (statMsgEl) animateNumber('statUnreadMsg', unreadMsgCount);

  // Mood distribution
  renderMoodDistribution(moodCount, total);

  // Recent logs
  renderRecentLogs(allLogs.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5));

  // Recent messages on dashboard
  renderRecentMessages();

  // Chat AI stats & recent chats
  if (typeof renderChatDashboard === 'function') renderChatDashboard();
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 20) || 1;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

function renderMoodDistribution(moodCount, total) {
  const container = document.getElementById('moodDistribution');
  if (total === 0) {
    container.innerHTML = '<div class="mood-dist-empty">Belum ada data log untuk ditampilkan.</div>';
    return;
  }

  const sorted = Object.entries(moodCount).sort((a, b) => b[1] - a[1]);
  container.innerHTML = sorted.map(([mood, count]) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `
      <div class="mood-dist-row">
        <div class="mood-dist-label">${mood}</div>
        <div class="mood-dist-bar-wrap">
          <div class="mood-dist-bar-fill" style="width:0%" data-target="${pct}"></div>
        </div>
        <div class="mood-dist-count">${count}</div>
      </div>
    `;
  }).join('');

  // Animate bars
  setTimeout(() => {
    container.querySelectorAll('.mood-dist-bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-target') + '%';
    });
  }, 50);
}

function renderRecentLogs(logs) {
  const container = document.getElementById('recentLogsList');
  if (logs.length === 0) {
    container.innerHTML = `
      <div class="admin-empty-state">
        <div class="admin-empty-icon">📭</div>
        <div class="admin-empty-title">Belum ada log</div>
        <div class="admin-empty-desc">Data log curhat akan muncul di sini setelah pengguna mengirim cerita.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = logs.map(log => `
    <div class="recent-log-item" onclick="openDetailModal('${log.id}')">
      <span class="mood-badge ${getMoodClass(log.mood)} recent-log-mood-badge">${log.mood || '—'}</span>
      <div class="recent-log-content">
        <div class="recent-log-text">${escapeHtml(log.text || '(Tidak ada teks)')}</div>
        <div class="recent-log-meta">${formatDateFull(log.timestamp)} · Topik: ${(log.topics || []).join(', ') || 'Tidak ada'}</div>
      </div>
    </div>
  `).join('');
}

// ---- LOGS TABLE ----
function initLogsTableControls() {
  document.getElementById('adminSearchInput').addEventListener('input', debounce(() => {
    currentPage = 1;
    applyFilters();
  }, 300));

  document.getElementById('adminMoodFilter').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
  });

  document.getElementById('adminDateFilter').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
  });

  document.getElementById('exportCSVBtn').addEventListener('click', exportToCSV);
  document.getElementById('deleteAllBtn').addEventListener('click', confirmDeleteAll);

  // Sorting headers
  document.querySelectorAll('.admin-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      if (sortCol === col) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortCol = col;
        sortDir = 'desc';
      }
      document.querySelectorAll('.admin-table th.sortable').forEach(t => {
        t.classList.remove('sort-asc', 'sort-desc');
      });
      th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      currentPage = 1;
      applyFilters();
    });
  });
}

function renderLogsTable() {
  allLogs = loadLogs();
  applyFilters();
}

function applyFilters() {
  const search = (document.getElementById('adminSearchInput').value || '').toLowerCase().trim();
  const moodFilter = document.getElementById('adminMoodFilter').value.toLowerCase();
  const dateFilter = document.getElementById('adminDateFilter').value;
  const now = new Date();

  filteredLogs = allLogs.filter(log => {
    // Search filter
    if (search) {
      const haystack = [log.mood, log.text, ...(log.topics || []), log.id].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    // Mood filter
    if (moodFilter && !(log.mood || '').toLowerCase().includes(moodFilter)) return false;
    // Date filter
    if (dateFilter) {
      const logDate = new Date(log.timestamp);
      if (dateFilter === 'today') {
        if (logDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === 'week') {
        if (logDate < new Date(now - 7 * 86400000)) return false;
      } else if (dateFilter === 'month') {
        if (logDate < new Date(now - 30 * 86400000)) return false;
      }
    }
    return true;
  });

  // Sort
  filteredLogs.sort((a, b) => {
    let va = a[sortCol] || '';
    let vb = b[sortCol] || '';
    if (sortCol === 'timestamp') {
      va = new Date(va).getTime();
      vb = new Date(vb).getTime();
    } else {
      va = String(va).toLowerCase();
      vb = String(vb).toLowerCase();
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Result count
  document.getElementById('resultCount').textContent = filteredLogs.length;

  renderTablePage();
  renderPagination();
}

function renderTablePage() {
  const tbody = document.getElementById('adminTableBody');
  const emptyEl = document.getElementById('adminTableEmpty');
  const tableEl = document.getElementById('adminDataTable');

  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const pageRows = filteredLogs.slice(start, start + ROWS_PER_PAGE);

  if (pageRows.length === 0) {
    tableEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }

  tableEl.style.display = 'table';
  emptyEl.style.display = 'none';

  tbody.innerHTML = pageRows.map((log, idx) => {
    const rowNum = start + idx + 1;
    const dateObj = new Date(log.timestamp);
    const topics = (log.topics || []).map(t => `<span class="topic-chip-sm">${escapeHtml(t)}</span>`).join('');
    const moodClass = getMoodClass(log.mood);
    return `
      <tr data-id="${log.id}">
        <td class="col-no" style="text-align:center;color:var(--text-light);">${rowNum}</td>
        <td><span class="log-id-cell">${escapeHtml(log.id)}</span></td>
        <td>
          <div class="log-date-primary">${formatDate(dateObj)}</div>
          <div class="log-date-secondary">${formatTime(dateObj)}</div>
        </td>
        <td><span class="mood-badge ${moodClass}">${escapeHtml(log.mood || '—')}</span></td>
        <td>${topics || '<span style="color:var(--text-light);font-size:0.78rem;">Tidak ada</span>'}</td>
        <td>
          <div class="log-text-preview" onclick="openDetailModal('${log.id}')" title="Klik untuk lihat detail">
            ${escapeHtml(log.text || '(Tidak ada teks)')}
          </div>
        </td>
        <td>
          <div class="table-action-btns">
            <button class="table-btn-view" onclick="openDetailModal('${log.id}')" title="Lihat Detail" aria-label="Lihat detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="table-btn-delete" onclick="confirmDeleteOne('${log.id}')" title="Hapus Log" aria-label="Hapus log ini">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderPagination() {
  const container = document.getElementById('adminPagination');
  const totalPages = Math.ceil(filteredLogs.length / ROWS_PER_PAGE);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&#8592;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span style="padding:0 4px;color:var(--text-light);">…</span>`;
    }
  }

  html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&#8594;</button>`;
  container.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredLogs.length / ROWS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTablePage();
  renderPagination();
  document.getElementById('viewLogs').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- CONFIRM DIALOG ----
function openConfirm({ icon = '🗑️', title = 'Hapus Data', msg = 'Yakin?', onOk }) {
  document.getElementById('confirmIcon').textContent = icon;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmDialog').style.display = 'flex';
  confirmCallback = onOk;
}

function closeConfirm() {
  document.getElementById('confirmDialog').style.display = 'none';
  confirmCallback = null;
}

function initConfirmDialog() {
  document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirm);
  document.getElementById('confirmOkBtn').addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirm();
  });
  document.getElementById('confirmDialog').addEventListener('click', e => {
    if (e.target === document.getElementById('confirmDialog')) closeConfirm();
  });
}

function confirmDeleteOne(id) {
  openConfirm({
    icon: '🗑️',
    title: 'Hapus Log Ini?',
    msg: 'Data log curhat ini akan dihapus permanen dari localStorage. Tindakan ini tidak dapat dibatalkan.',
    onOk: () => {
      deleteLog(id);
      allLogs = loadLogs();
      applyFilters();
      renderDashboard();
      adminToast('Log berhasil dihapus.', 'success');
    }
  });
}

function confirmDeleteAll() {
  openConfirm({
    icon: '⚠️',
    title: 'Hapus Semua Data?',
    msg: `Kamu akan menghapus ${allLogs.length} log curhat secara permanen. Semua data akan hilang dan tidak bisa dipulihkan kembali. Lanjutkan?`,
    onOk: () => {
      deleteAllLogs();
      allLogs = [];
      filteredLogs = [];
      renderLogsTable();
      renderDashboard();
      adminToast('Semua data log telah dihapus.', 'success');
    }
  });
}

// ---- DETAIL MODAL ----
function openDetailModal(id) {
  const log = allLogs.find(l => l.id === id) || loadLogs().find(l => l.id === id);
  if (!log) return;

  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailModalBody');
  const dateObj = new Date(log.timestamp);

  body.innerHTML = `
    <div class="admin-detail-row">
      <div class="admin-detail-label">ID Log</div>
      <div class="admin-detail-value"><span class="log-id-cell">${escapeHtml(log.id)}</span></div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Tanggal &amp; Waktu</div>
      <div class="admin-detail-value">${formatDateFull(log.timestamp)}</div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Perasaan</div>
      <div class="admin-detail-value">
        <span class="mood-badge ${getMoodClass(log.mood)}">${escapeHtml(log.mood || '—')}</span>
      </div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Topik</div>
      <div class="admin-detail-value">
        ${(log.topics || []).length > 0
          ? log.topics.map(t => `<span class="topic-chip-sm">${escapeHtml(t)}</span>`).join('')
          : '<span style="color:var(--text-light)">Tidak ada topik dipilih</span>'}
      </div>
    </div>
    ${log.source === 'chat' ? `<div class="admin-detail-row">
      <div class="admin-detail-label">Sumber</div>
      <div class="admin-detail-value">💬 Chat AI${log.flagged ? ' · <span class="chat-flag-badge">Perlu Perhatian</span>' : ''} <button class="admin-btn-link" onclick="closeDetailModal();navigateTo('chats');openChatDetail('${escapeHtml(log.sessionId || '')}')">Lihat percakapan</button></div>
    </div>` : ''}
    <div class="admin-detail-row">
      <div class="admin-detail-label">Isi Curhat</div>
      <div class="admin-detail-value text-content">${escapeHtml(log.text || '(Tidak ada teks)')}</div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeDetailModal() {
  document.getElementById('detailModal').style.display = 'none';
}

function initDetailModal() {
  document.getElementById('detailCloseBtn').addEventListener('click', closeDetailModal);
  document.getElementById('detailModal').addEventListener('click', e => {
    if (e.target === document.getElementById('detailModal')) closeDetailModal();
  });
}

// ---- CSV EXPORT ----
function exportToCSV() {
  const logsToExport = filteredLogs.length > 0 ? filteredLogs : allLogs;
  if (logsToExport.length === 0) {
    adminToast('Tidak ada data untuk diekspor.', 'error');
    return;
  }

  const headers = ['No', 'ID Log', 'Tanggal', 'Waktu', 'Perasaan', 'Topik', 'Isi Curhat'];
  const rows = logsToExport.map((log, i) => {
    const d = new Date(log.timestamp);
    return [
      i + 1,
      log.id,
      formatDate(d),
      formatTime(d),
      log.mood || '',
      (log.topics || []).join(' | '),
      (log.text || '').replace(/"/g, '""')
    ].map(v => `"${v}"`);
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `jedalog-export-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  adminToast(`Berhasil mengekspor ${logsToExport.length} baris data ke CSV.`, 'success');
}

// ---- HELPER FUNCTIONS ----
function getMoodClass(mood) {
  if (!mood) return 'mood-default';
  const lower = mood.toLowerCase();
  if (lower.includes('exhausted') || lower.includes('lelah')) return 'mood-exhausted';
  if (lower.includes('sedih')) return 'mood-sedih';
  if (lower.includes('kesal') || lower.includes('marah')) return 'mood-kesal';
  if (lower.includes('cemas')) return 'mood-cemas';
  if (lower.includes('biasa') || lower.includes('bingung')) return 'mood-biasa';
  if (lower.includes('baik')) return 'mood-baik';
  if (lower.includes('bahagia')) return 'mood-bahagia';
  return 'mood-default';
}

function formatDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDateFull(isoStr) {
  const d = new Date(isoStr);
  return `${formatDate(d)}, ${formatTime(d)}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ---- MAIN INIT ----
function initAdminPanel() {
  startClock();
  initNavigation();
  initConfirmDialog();
  initDetailModal();
  initLogsTableControls();
  initMessagesControls();
  updateUnreadBadge();
  if (typeof initChatAdmin === 'function') initChatAdmin();
  renderDashboard();
}

document.addEventListener('DOMContentLoaded', () => {
  // Seed sample data for demo purposes
  seedDemoData();

  // Check existing session
  if (!checkSession()) {
    initLogin();
  }
});

// ============================================
// ---- PESAN MASUK (CONTACT MESSAGES) ----
// ============================================
const MSG_STORAGE_KEY = 'jedalog-contact-messages';
const MSG_ROWS_PER_PAGE = 10;
let allMessages = [];
let filteredMessages = [];
let msgCurrentPage = 1;

// Load / Save messages
function loadMessages() {
  return JSON.parse(localStorage.getItem(MSG_STORAGE_KEY) || '[]');
}
function saveMessages(msgs) {
  localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(msgs));
}

// Count unread
function countUnread() {
  return loadMessages().filter(m => m.status === 'unread').length;
}

// Update sidebar badge
function updateUnreadBadge() {
  const count = countUnread();
  const badge = document.getElementById('unreadBadge');
  if (!badge) return;
  if (count > 0) {
    badge.style.display = 'inline-flex';
    badge.textContent = count > 99 ? '99+' : count;
  } else {
    badge.style.display = 'none';
  }
}

// Init controls for messages view
function initMessagesControls() {
  document.getElementById('msgSearchInput').addEventListener('input', debounce(() => {
    msgCurrentPage = 1;
    applyMsgFilters();
  }, 300));

  document.getElementById('msgStatusFilter').addEventListener('change', () => {
    msgCurrentPage = 1;
    applyMsgFilters();
  });

  document.getElementById('msgDateFilter').addEventListener('change', () => {
    msgCurrentPage = 1;
    applyMsgFilters();
  });

  document.getElementById('exportMsgCSVBtn').addEventListener('click', exportMsgCSV);

  document.getElementById('markAllReadBtn').addEventListener('click', () => {
    const msgs = loadMessages().map(m => ({ ...m, status: 'read' }));
    saveMessages(msgs);
    allMessages = msgs;
    applyMsgFilters();
    updateUnreadBadge();
    adminToast('Semua pesan telah ditandai sebagai dibaca.', 'success');
  });

  document.getElementById('deleteAllMsgBtn').addEventListener('click', () => {
    openConfirm({
      icon: '⚠️',
      title: 'Hapus Semua Pesan?',
      msg: 'Semua pesan masuk akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
      onOk: () => {
        localStorage.removeItem(MSG_STORAGE_KEY);
        allMessages = [];
        filteredMessages = [];
        applyMsgFilters();
        updateUnreadBadge();
        adminToast('Semua pesan telah dihapus.', 'success');
      }
    });
  });
}

// Render messages view
function renderMessagesView() {
  allMessages = loadMessages();
  applyMsgFilters();
  updateUnreadBadge();
}

function applyMsgFilters() {
  const search = (document.getElementById('msgSearchInput').value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('msgStatusFilter').value;
  const dateFilter = document.getElementById('msgDateFilter').value;
  const now = new Date();

  filteredMessages = allMessages.filter(msg => {
    if (search) {
      const hay = [msg.name, msg.email, msg.message].join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (statusFilter && msg.status !== statusFilter) return false;
    if (dateFilter) {
      const d = new Date(msg.timestamp);
      if (dateFilter === 'today' && d.toDateString() !== now.toDateString()) return false;
      if (dateFilter === 'week' && d < new Date(now - 7 * 86400000)) return false;
      if (dateFilter === 'month' && d < new Date(now - 30 * 86400000)) return false;
    }
    return true;
  });

  // Sort newest first
  filteredMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const unreadCount = allMessages.filter(m => m.status === 'unread').length;
  document.getElementById('msgResultCount').textContent = filteredMessages.length;
  document.getElementById('msgUnreadInfo').textContent = unreadCount + ' belum dibaca';

  renderMsgPage();
  renderMsgPagination();
}

function renderMsgPage() {
  const body = document.getElementById('msgListBody');
  const emptyEl = document.getElementById('msgListEmpty');

  const start = (msgCurrentPage - 1) * MSG_ROWS_PER_PAGE;
  const pageRows = filteredMessages.slice(start, start + MSG_ROWS_PER_PAGE);

  if (pageRows.length === 0) {
    body.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  body.innerHTML = pageRows.map(msg => {
    const initial = (msg.name || 'A')[0].toUpperCase();
    const dateObj = new Date(msg.timestamp);
    const isUnread = msg.status === 'unread';
    const statusClass = isUnread ? 'msg-status-unread' : 'msg-status-read';
    const statusLabel = isUnread ? 'Belum Dibaca' : 'Dibaca';
    const previewText = escapeHtml((msg.message || '').substring(0, 120));

    return `
      <div class="msg-item ${isUnread ? 'unread' : ''}" data-id="${msg.id}">
        <div class="msg-unread-dot"></div>
        <div class="msg-avatar">${initial}</div>
        <div class="msg-content" onclick="openMsgDetail('${msg.id}')">
          <div class="msg-top-row">
            <span class="msg-sender">${escapeHtml(msg.name)}</span>
            <span class="msg-time">${formatDateFull(msg.timestamp)}</span>
          </div>
          <div class="msg-email">${escapeHtml(msg.email)}</div>
          <div class="msg-preview">${previewText}${msg.message && msg.message.length > 120 ? '...' : ''}</div>
        </div>
        <div class="msg-actions">
          <span class="msg-status-badge ${statusClass}">${statusLabel}</span>
          ${isUnread
            ? `<button class="table-btn-view" onclick="markMsgRead('${msg.id}')" title="Tandai dibaca">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
               </button>`
            : ''}
          <button class="table-btn-delete" onclick="deleteMsgItem('${msg.id}')" title="Hapus pesan">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderMsgPagination() {
  const container = document.getElementById('msgPagination');
  const totalPages = Math.ceil(filteredMessages.length / MSG_ROWS_PER_PAGE);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = `<button class="page-btn" onclick="goToMsgPage(${msgCurrentPage - 1})" ${msgCurrentPage === 1 ? 'disabled' : ''}>&#8592;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= msgCurrentPage - 1 && i <= msgCurrentPage + 1)) {
      html += `<button class="page-btn ${i === msgCurrentPage ? 'active' : ''}" onclick="goToMsgPage(${i})">${i}</button>`;
    } else if (i === msgCurrentPage - 2 || i === msgCurrentPage + 2) {
      html += `<span style="padding:0 4px;color:var(--text-light);">...</span>`;
    }
  }
  html += `<button class="page-btn" onclick="goToMsgPage(${msgCurrentPage + 1})" ${msgCurrentPage === totalPages ? 'disabled' : ''}>&#8594;</button>`;
  container.innerHTML = html;
}

function goToMsgPage(page) {
  const totalPages = Math.ceil(filteredMessages.length / MSG_ROWS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  msgCurrentPage = page;
  renderMsgPage();
  renderMsgPagination();
}

function markMsgRead(id) {
  const msgs = loadMessages().map(m => m.id === id ? { ...m, status: 'read' } : m);
  saveMessages(msgs);
  allMessages = msgs;
  applyMsgFilters();
  updateUnreadBadge();
}

function deleteMsgItem(id) {
  openConfirm({
    icon: '🗑️',
    title: 'Hapus Pesan Ini?',
    msg: 'Pesan ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
    onOk: () => {
      const msgs = loadMessages().filter(m => m.id !== id);
      saveMessages(msgs);
      allMessages = msgs;
      applyMsgFilters();
      updateUnreadBadge();
      adminToast('Pesan berhasil dihapus.', 'success');
    }
  });
}

function openMsgDetail(id) {
  // Mark as read
  markMsgRead(id);

  const msg = loadMessages().find(m => m.id === id);
  if (!msg) return;

  const modalBody = document.getElementById('detailModalBody');
  modalBody.innerHTML = `
    <div class="admin-detail-row">
      <div class="admin-detail-label">ID Pesan</div>
      <div class="admin-detail-value"><span class="log-id-cell">${escapeHtml(msg.id)}</span></div>
    </div>
    <div class="msg-detail-meta">
      <div class="admin-detail-row">
        <div class="admin-detail-label">Nama Pengirim</div>
        <div class="admin-detail-value">${escapeHtml(msg.name)}</div>
      </div>
      <div class="admin-detail-row">
        <div class="admin-detail-label">Email</div>
        <div class="admin-detail-value" style="word-break:break-all;">${escapeHtml(msg.email)}</div>
      </div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Tanggal &amp; Waktu</div>
      <div class="admin-detail-value">${formatDateFull(msg.timestamp)}</div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Status</div>
      <div class="admin-detail-value">
        <span class="msg-status-badge msg-status-read">Sudah Dibaca</span>
      </div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Isi Pesan</div>
      <div class="admin-detail-value text-content">${escapeHtml(msg.message)}</div>
    </div>
  `;

  document.getElementById('detailModalTitle').textContent = 'Detail Pesan Masuk';
  document.getElementById('detailModal').style.display = 'flex';
}

function exportMsgCSV() {
  const data = filteredMessages.length > 0 ? filteredMessages : allMessages;
  if (data.length === 0) {
    adminToast('Tidak ada pesan untuk diekspor.', 'error');
    return;
  }
  const headers = ['No', 'ID Pesan', 'Tanggal', 'Waktu', 'Nama', 'Email', 'Status', 'Isi Pesan'];
  const rows = data.map((msg, i) => {
    const d = new Date(msg.timestamp);
    return [i + 1, msg.id, formatDate(d), formatTime(d), msg.name, msg.email, msg.status, (msg.message || '').replace(/"/g, '""')]
      .map(v => '"' + v + '"');
  });
  const BOM = '\uFEFF';
  const csv = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jedalog-pesan-' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  adminToast('Berhasil mengekspor ' + data.length + ' pesan ke CSV.', 'success');
}

// Render recent messages on dashboard
function renderRecentMessages() {
  const container = document.getElementById('recentMsgsList');
  if (!container) return;

  const msgs = loadMessages().slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 4);

  if (msgs.length === 0) {
    container.innerHTML = `
      <div class="admin-empty-state">
        <div class="admin-empty-icon">&#128236;</div>
        <div class="admin-empty-title">Belum ada pesan</div>
        <div class="admin-empty-desc">Pesan dari form Kontak akan muncul di sini.</div>
      </div>`;
    return;
  }

  container.innerHTML = msgs.map(msg => {
    const isUnread = msg.status === 'unread';
    return `
      <div class="recent-log-item" onclick="navigateTo('messages')" style="${isUnread ? 'border-left:3px solid var(--royal);background:#f0f5ff;' : ''}">
        <span class="mood-badge ${isUnread ? 'mood-sedih' : 'mood-biasa'} recent-log-mood-badge">
          ${isUnread ? 'Baru' : 'Dibaca'}
        </span>
        <div class="recent-log-content">
          <div class="recent-log-text">${escapeHtml(msg.name)} &mdash; ${escapeHtml((msg.message || '').substring(0, 80))}${msg.message && msg.message.length > 80 ? '...' : ''}</div>
          <div class="recent-log-meta">${formatDateFull(msg.timestamp)} &middot; ${escapeHtml(msg.email)}</div>
        </div>
      </div>`;
  }).join('');
}
