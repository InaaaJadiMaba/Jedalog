// ===========================
// JedaLog - Admin: Chat AI
// Membaca data dari js/chat.js (localStorage: jedalog-chat-sessions)
// Dipanggil oleh admin.js: initChatAdmin(), renderChatsView(), renderChatDashboard()
// ===========================

const CHAT_SESS_KEY = 'jedalog-chat-sessions';
const CHAT_ROWS_PER_PAGE = 10;

let allChats = [];
let filteredChats = [];
let chatCurrentPage = 1;

function loadChats() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_SESS_KEY) || '[]')
      .sort((a, b) => new Date(b.updatedAt || b.startedAt) - new Date(a.updatedAt || a.startedAt));
  } catch (e) { return []; }
}

function saveChats(list) {
  localStorage.setItem(CHAT_SESS_KEY, JSON.stringify(list));
}

function chatNeedsAttention(s) {
  return !!s.flagged && !s.reviewed;
}

function updateChatBadge() {
  const badge = document.getElementById('chatFlagBadge');
  if (!badge) return;
  const n = loadChats().filter(chatNeedsAttention).length;
  badge.textContent = n;
  badge.style.display = n > 0 ? 'inline-flex' : 'none';
}

// ---- INIT ----
function initChatAdmin() {
  const sidebarChats = document.getElementById('sidebarChats');
  if (sidebarChats) {
    sidebarChats.addEventListener('click', e => {
      e.preventDefault();
      navigateTo('chats');
    });
  }

  const viewAll = document.getElementById('viewAllChatsBtn');
  if (viewAll) viewAll.addEventListener('click', () => navigateTo('chats'));

  const search = document.getElementById('chatSearchInput');
  if (search) search.addEventListener('input', debounce(applyChatFilters, 250));
  ['chatStatusFilter', 'chatDateFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyChatFilters);
  });

  const exp = document.getElementById('exportChatCSVBtn');
  if (exp) exp.addEventListener('click', exportChatCSV);

  const delAll = document.getElementById('deleteAllChatsBtn');
  if (delAll) delAll.addEventListener('click', confirmDeleteAllChats);

  const modal = document.getElementById('chatModal');
  const closeBtn = document.getElementById('chatModalCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeChatModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeChatModal(); });

  updateChatBadge();
}

// ---- DASHBOARD ----
function renderChatDashboard() {
  const chats = loadChats();
  animateNumber('statChatSessions', chats.length);
  animateNumber('statChatFlagged', chats.filter(chatNeedsAttention).length);
  updateChatBadge();

  const box = document.getElementById('recentChatsList');
  if (!box) return;
  const recent = chats.slice(0, 5);
  if (recent.length === 0) {
    box.innerHTML = `
      <div class="admin-empty-state">
        <div class="admin-empty-icon">💬</div>
        <div class="admin-empty-title">Belum ada percakapan</div>
        <div class="admin-empty-desc">Percakapan dari halaman Chat AI akan muncul di sini.</div>
      </div>`;
    return;
  }
  box.innerHTML = recent.map(s => {
    const preview = chatLastUserText(s) || '(Belum ada pesan)';
    const flag = chatNeedsAttention(s) ? ' <span class="chat-flag-badge">Perlu Perhatian</span>' : '';
    return `
      <div class="recent-log-item" onclick="openChatDetail('${s.id}')">
        <span class="mood-badge ${getMoodClass(s.mood)} recent-log-mood-badge">${escapeHtml(s.mood || '💬 Chat')}</span>
        <div class="recent-log-content">
          <div class="recent-log-text">${escapeHtml(preview)}${flag}</div>
          <div class="recent-log-meta">${formatDateFull(s.updatedAt || s.startedAt)} · ${chatMsgCount(s)} pesan · Topik: ${escapeHtml((s.topics || []).join(', ') || 'Tidak ada')}</div>
        </div>
      </div>`;
  }).join('');
}

// ---- HELPERS ----
function chatMsgCount(s) {
  return (s.messages || []).filter(m => m.role === 'user' || m.role === 'ai').length;
}
function chatLastUserText(s) {
  const users = (s.messages || []).filter(m => m.role === 'user');
  return users.length ? users[users.length - 1].text : '';
}
function chatFirstUserText(s) {
  const u = (s.messages || []).find(m => m.role === 'user' && !/^Perasaanku sekarang:/.test(m.text));
  return u ? u.text : chatLastUserText(s);
}

// ---- LIST VIEW ----
function renderChatsView() {
  allChats = loadChats();
  applyChatFilters();
}

function applyChatFilters() {
  const search = (document.getElementById('chatSearchInput').value || '').toLowerCase().trim();
  const status = document.getElementById('chatStatusFilter').value;
  const dateFilter = document.getElementById('chatDateFilter').value;
  const now = new Date();

  filteredChats = allChats.filter(s => {
    if (search) {
      const hay = [s.id, s.mood, ...(s.topics || []), ...(s.messages || []).map(m => m.text || '')].join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (status === 'flagged' && !s.flagged) return false;
    if (status === 'normal' && s.flagged) return false;
    if (dateFilter) {
      const d = new Date(s.startedAt);
      if (dateFilter === 'today' && d.toDateString() !== now.toDateString()) return false;
      if (dateFilter === 'week' && d < new Date(now - 7 * 86400000)) return false;
      if (dateFilter === 'month' && d < new Date(now - 30 * 86400000)) return false;
    }
    return true;
  });

  chatCurrentPage = 1;
  document.getElementById('chatResultCount').textContent = filteredChats.length;
  document.getElementById('chatFlagInfo').textContent = `${filteredChats.filter(chatNeedsAttention).length} perlu perhatian`;
  renderChatPage();
  renderChatPagination();
}

function renderChatPage() {
  const body = document.getElementById('chatListBody');
  const empty = document.getElementById('chatListEmpty');
  const start = (chatCurrentPage - 1) * CHAT_ROWS_PER_PAGE;
  const rows = filteredChats.slice(start, start + CHAT_ROWS_PER_PAGE);

  if (rows.length === 0) {
    body.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  body.innerHTML = rows.map(s => {
    const attention = chatNeedsAttention(s);
    const emoji = (s.mood || '💬').split(' ')[0];
    const preview = escapeHtml(chatFirstUserText(s).substring(0, 120));
    const badge = s.flagged
      ? `<span class="chat-flag-badge">${attention ? 'Perlu Perhatian' : 'Sudah Ditinjau'}</span>`
      : `<span class="msg-status-badge msg-status-read">${chatMsgCount(s)} pesan</span>`;
    return `
      <div class="msg-item ${attention ? 'chat-flagged' : ''}" data-id="${s.id}">
        <div class="msg-unread-dot"></div>
        <div class="msg-avatar">${escapeHtml(emoji)}</div>
        <div class="msg-content" onclick="openChatDetail('${s.id}')">
          <div class="msg-top-row">
            <span class="msg-sender">Sesi ${escapeHtml(s.id)}</span>
            <span class="msg-time">${formatDateFull(s.updatedAt || s.startedAt)}</span>
          </div>
          <div class="msg-email">${escapeHtml(s.mood || 'Perasaan tidak dipilih')} · ${escapeHtml((s.topics || []).join(', ') || 'Tanpa topik')} · ${chatMsgCount(s)} pesan</div>
          <div class="msg-preview">${preview}${chatFirstUserText(s).length > 120 ? '...' : ''}</div>
        </div>
        <div class="msg-actions">
          ${badge}
          <button class="table-btn-delete" onclick="deleteChatItem('${s.id}')" title="Hapus percakapan">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>`;
  }).join('');
}

function renderChatPagination() {
  const c = document.getElementById('chatPagination');
  const total = Math.ceil(filteredChats.length / CHAT_ROWS_PER_PAGE);
  if (total <= 1) { c.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="goToChatPage(${chatCurrentPage - 1})" ${chatCurrentPage === 1 ? 'disabled' : ''}>&#8592;</button>`;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= chatCurrentPage - 1 && i <= chatCurrentPage + 1)) {
      html += `<button class="page-btn ${i === chatCurrentPage ? 'active' : ''}" onclick="goToChatPage(${i})">${i}</button>`;
    } else if (i === chatCurrentPage - 2 || i === chatCurrentPage + 2) {
      html += '<span style="padding:0 4px;color:var(--text-light);">...</span>';
    }
  }
  html += `<button class="page-btn" onclick="goToChatPage(${chatCurrentPage + 1})" ${chatCurrentPage === total ? 'disabled' : ''}>&#8594;</button>`;
  c.innerHTML = html;
}

function goToChatPage(p) {
  const total = Math.ceil(filteredChats.length / CHAT_ROWS_PER_PAGE);
  if (p < 1 || p > total) return;
  chatCurrentPage = p;
  renderChatPage();
  renderChatPagination();
}

// ---- DETAIL ----
function openChatDetail(id) {
  const list = loadChats();
  const s = list.find(x => x.id === id);
  if (!s) return;

  // Tandai sudah ditinjau
  if (s.flagged && !s.reviewed) {
    s.reviewed = true;
    saveChats(list.map(x => x.id === id ? s : x));
    allChats = loadChats();
    updateChatBadge();
    if (document.getElementById('viewChats').classList.contains('active')) applyChatFilters();
    if (document.getElementById('viewDashboard').classList.contains('active')) renderChatDashboard();
  }

  const transcript = (s.messages || []).map(m => {
    if (m.kind === 'crisis') {
      return '<div class="admin-chat-note">⚠️ Kartu bantuan darurat (119 ext. 8 / 112) ditampilkan kepada pengguna.</div>';
    }
    const who = m.role === 'user' ? 'me' : 'ai';
    const label = m.role === 'user' ? 'Pengguna' : 'Teman Jeda';
    return `
      <div class="admin-chat-msg ${who}">
        <div class="admin-chat-bubble">${escapeHtml(m.text || '')}</div>
        <div class="admin-chat-meta">${label} · ${formatTime(m.ts)}</div>
      </div>`;
  }).join('');

  document.getElementById('chatModalBody').innerHTML = `
    <div class="admin-detail-row">
      <div class="admin-detail-label">ID Sesi</div>
      <div class="admin-detail-value"><span class="log-id-cell">${escapeHtml(s.id)}</span></div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Mulai</div>
      <div class="admin-detail-value">${formatDateFull(s.startedAt)}</div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Perasaan</div>
      <div class="admin-detail-value"><span class="mood-badge ${getMoodClass(s.mood)}">${escapeHtml(s.mood || '—')}</span></div>
    </div>
    <div class="admin-detail-row">
      <div class="admin-detail-label">Topik</div>
      <div class="admin-detail-value">
        ${(s.topics || []).length
          ? s.topics.map(t => `<span class="topic-chip-sm">${escapeHtml(t)}</span>`).join('')
          : '<span style="color:var(--text-light)">Tidak terdeteksi</span>'}
      </div>
    </div>
    ${s.flagged ? '<div class="admin-chat-alert">⚠️ Percakapan ini memuat kata kunci yang menandakan pengguna mungkin membutuhkan bantuan segera. Tinjau dengan hati-hati dan ikuti prosedur penanganan kampus.</div>' : ''}
    <div class="admin-detail-row">
      <div class="admin-detail-label">Percakapan (${chatMsgCount(s)} pesan)</div>
      <div class="admin-chat-transcript">${transcript || '<span style="color:var(--text-light)">Belum ada pesan.</span>'}</div>
    </div>`;

  document.getElementById('chatModal').style.display = 'flex';
}

function closeChatModal() {
  document.getElementById('chatModal').style.display = 'none';
}

// ---- DELETE ----
function removeChatSessions(ids) {
  const idSet = new Set(ids);
  saveChats(loadChats().filter(s => !idSet.has(s.id)));
  // Hapus juga ringkasannya di Data Log Curhat
  saveLogs(loadLogs().filter(l => !(l.sessionId && idSet.has(l.sessionId))));
}

function deleteChatItem(id) {
  openConfirm({
    icon: '🗑️',
    title: 'Hapus Percakapan Ini?',
    msg: 'Percakapan dan ringkasannya di Data Log Curhat akan dihapus permanen.',
    onOk: () => {
      removeChatSessions([id]);
      renderChatsView();
      updateChatBadge();
      adminToast('Percakapan berhasil dihapus.', 'success');
    }
  });
}

function confirmDeleteAllChats() {
  const all = loadChats();
  if (all.length === 0) { adminToast('Tidak ada percakapan untuk dihapus.', 'info'); return; }
  openConfirm({
    icon: '⚠️',
    title: 'Hapus Semua Percakapan?',
    msg: `${all.length} percakapan Chat AI beserta ringkasannya di Data Log Curhat akan dihapus permanen.`,
    onOk: () => {
      removeChatSessions(all.map(s => s.id));
      renderChatsView();
      updateChatBadge();
      adminToast('Semua percakapan berhasil dihapus.', 'success');
    }
  });
}

// ---- EXPORT ----
function exportChatCSV() {
  const data = filteredChats.length ? filteredChats : allChats;
  if (data.length === 0) { adminToast('Tidak ada data untuk diekspor.', 'error'); return; }

  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const header = ['ID Sesi', 'Mulai', 'Perasaan', 'Topik', 'Ditandai', 'Waktu Pesan', 'Pengirim', 'Pesan'];
  const lines = [header.map(q).join(',')];
  data.forEach(s => {
    (s.messages || []).filter(m => m.role === 'user' || m.role === 'ai').forEach(m => {
      lines.push([
        s.id, formatDateFull(s.startedAt), s.mood || '', (s.topics || []).join(' | '),
        s.flagged ? 'Ya' : 'Tidak', formatDateFull(m.ts), m.role === 'user' ? 'Pengguna' : 'Teman Jeda', m.text
      ].map(q).join(','));
    });
  });

  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jedalog-chat-ai-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  adminToast(`Berhasil mengekspor ${data.length} percakapan ke CSV.`, 'success');
}
