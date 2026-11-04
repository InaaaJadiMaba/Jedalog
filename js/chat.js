// ===========================
// JedaLog - Chat AI (Teman Jeda)
// ===========================
// Data disimpan di localStorage:
//   jedalog-chat-sessions -> seluruh percakapan (dibaca halaman Admin "Chat AI")
//   jedalog-curhat-logs   -> ringkasan tiap sesi, supaya statistik Dashboard
//                            dan tabel Data Log Curhat ikut terisi
// ===========================

const CHAT_SESSIONS_KEY = 'jedalog-chat-sessions';
const CHAT_CURRENT_KEY = 'jedalog-chat-current';
const CHAT_LOGS_KEY = 'jedalog-curhat-logs';

const CHAT_MOODS = [
  { id: 'sangat-sedih', emoji: '😭', label: 'Sangat Sedih' },
  { id: 'cemas', emoji: '😰', label: 'Cemas' },
  { id: 'lelah', emoji: '😔', label: 'Lelah' },
  { id: 'marah', emoji: '😤', label: 'Marah' },
  { id: 'bingung', emoji: '😕', label: 'Bingung' }
];

// Deteksi topik otomatis dari isi cerita (label sama dengan form curhat)
const CHAT_TOPICS = {
  '📚 Akademik': /kuliah|skripsi|tugas|dosen|ujian|nilai|ipk|deadline|semester|kelas|revisi/i,
  '💔 Hubungan': /pacar|mantan|putus|gebetan|sahabat|pertemanan|hubungan|ditinggal|sendirian|teman/i,
  '🏠 Keluarga': /orang tua|ortu|ayah|ibu|bapak|mama|papa|keluarga|kakak|adik|rumah/i,
  '💰 Keuangan': /uang|biaya|ukt|keuangan|utang|hutang|gaji|dompet|uang kos/i,
  '🎯 Organisasi': /organisasi|himpunan|bem|panitia|ukm|kepengurusan|rapat/i,
  '🏥 Kesehatan': /sakit|tidur|insomnia|kesehatan|pusing|obat|dokter|nafsu makan/i,
  '💼 Karir': /karir|magang|pekerjaan|lamaran|interview|masa depan|lulus/i
};

// Kata kunci yang menandai percakapan perlu perhatian
const CHAT_CRISIS = /bunuh diri|mengakhiri hidup|akhiri hidup|ingin mati|pengen mati|mau mati|lebih baik mati|menyakiti diri|melukai diri|self[- ]?harm|gantung diri|tidak ingin hidup|nggak mau hidup|ga mau hidup|overdosis|overdose/i;

let chatSession = null;
let chatBusy = false;
let chatBound = false;
let chatFallbackCount = 0;
let chatErrorShown = false;

const $chat = id => document.getElementById(id);
const chatCfg = () => window.JEDALOG_CONFIG || {};

// ---------- STORAGE ----------
function chatLoadSessions() {
  try { return JSON.parse(localStorage.getItem(CHAT_SESSIONS_KEY) || '[]'); }
  catch (e) { return []; }
}

function chatSaveSessions(list) {
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(list));
}

function chatNewId() {
  return 'CHAT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function chatEnsureSession() {
  if (chatSession) return chatSession;
  const now = new Date().toISOString();
  chatSession = {
    id: chatNewId(),
    startedAt: now,
    updatedAt: now,
    mood: '',
    topics: [],
    flagged: false,
    reviewed: false,
    messages: []
  };
  sessionStorage.setItem(CHAT_CURRENT_KEY, chatSession.id);
  return chatSession;
}

function chatPersist() {
  if (!chatSession || chatSession.messages.length === 0) return;
  chatSession.updatedAt = new Date().toISOString();
  if (chatSession.messages.length > 300) chatSession.messages = chatSession.messages.slice(-300);

  const list = chatLoadSessions();
  const idx = list.findIndex(s => s.id === chatSession.id);
  if (idx >= 0) list[idx] = chatSession; else list.unshift(chatSession);
  chatSaveSessions(list.slice(0, 500));
  chatSyncCurhatLog(chatSession);
}

// Ringkasan sesi -> tabel "Data Log Curhat" & statistik Dashboard
function chatSyncCurhatLog(s) {
  const userTexts = s.messages
    .filter(m => m.role === 'user' && !/^Perasaanku sekarang:/.test(m.text))
    .map(m => m.text);
  if (s.messages.filter(m => m.role === 'user').length === 0) return;

  let logs = [];
  try { logs = JSON.parse(localStorage.getItem(CHAT_LOGS_KEY) || '[]'); } catch (e) { logs = []; }

  const idx = logs.findIndex(l => l.sessionId === s.id);
  const entry = {
    id: idx >= 0 ? logs[idx].id : 'LOG-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    timestamp: s.startedAt,
    mood: s.mood || 'Tidak Dipilih',
    topics: s.topics.slice(),
    text: userTexts.join('\n\n'),
    source: 'chat',
    sessionId: s.id,
    flagged: !!s.flagged
  };
  if (idx >= 0) logs[idx] = entry; else logs.unshift(entry);
  localStorage.setItem(CHAT_LOGS_KEY, JSON.stringify(logs));
}

// ---------- UI ----------
function chatTime(iso) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function chatScroll() {
  const log = $chat('chatLog');
  if (log) log.scrollTop = log.scrollHeight;
}

function chatClearWelcome() {
  const w = document.querySelector('#chatLog .chat-welcome');
  if (w) w.remove();
}

function chatRenderBubble(role, text, iso) {
  chatClearWelcome();
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg ' + (role === 'user' ? 'me' : 'ai');
  const b = document.createElement('div');
  b.className = 'chat-bubble';
  b.textContent = text;
  const t = document.createElement('div');
  t.className = 'chat-time';
  t.textContent = chatTime(iso || new Date().toISOString());
  wrap.append(b, t);
  $chat('chatLog').appendChild(wrap);
  chatScroll();
}

function chatRenderCrisis() {
  const c = document.createElement('div');
  c.className = 'chat-crisis';
  c.setAttribute('role', 'note');
  c.innerHTML =
    '💙 <strong>Kamu tidak sendirian.</strong> Kalau kamu merasa tidak aman atau ingin menyakiti diri sendiri, ' +
    'segera hubungi <strong>119 ext. 8</strong> (layanan kesehatan jiwa Kemenkes) atau <strong>112</strong> (darurat), ' +
    'dan beri tahu orang yang kamu percaya sekarang. Aku tetap di sini menemanimu.';
  $chat('chatLog').appendChild(c);
  chatScroll();
}

function chatShowTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg ai';
  wrap.id = 'chatTyping';
  wrap.innerHTML = '<div class="chat-bubble chat-typing"><i></i><i></i><i></i></div>';
  $chat('chatLog').appendChild(wrap);
  chatScroll();
}

function chatHideTyping() {
  const t = $chat('chatTyping');
  if (t) t.remove();
}

function chatRenderWelcome() {
  const log = $chat('chatLog');
  log.innerHTML = '';
  const w = document.createElement('div');
  w.className = 'chat-welcome';
  w.innerHTML =
    '<h2>Halo, aku Teman Jeda 👋</h2>' +
    '<p>Ruang ini aman dan anonim. Pilih perasaanmu sekarang, atau langsung tulis ceritamu di bawah.</p>';
  const grid = document.createElement('div');
  grid.className = 'chat-mood-grid';
  CHAT_MOODS.forEach(m => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-mood';
    btn.setAttribute('aria-label', m.label);
    btn.innerHTML = '<span>' + m.emoji + '</span><span>' + m.label + '</span>';
    btn.addEventListener('click', () => chatPickMood(m));
    grid.appendChild(btn);
  });
  w.appendChild(grid);
  log.appendChild(w);
}

function chatRenderAll() {
  const log = $chat('chatLog');
  if (!chatSession || chatSession.messages.length === 0) {
    chatRenderWelcome();
    return;
  }
  log.innerHTML = '';
  chatSession.messages.forEach(m => {
    if (m.kind === 'crisis') chatRenderCrisis();
    else chatRenderBubble(m.role, m.text, m.ts);
  });
}

function chatSetBusy(b) {
  chatBusy = b;
  const send = $chat('chatSend');
  const input = $chat('chatInput');
  send.disabled = b || !input.value.trim();
}

function chatGrow() {
  const input = $chat('chatInput');
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 140) + 'px';
}

// ---------- ACTIONS ----------
function chatPickMood(m) {
  const s = chatEnsureSession();
  s.mood = m.emoji + ' ' + m.label;
  s.moodId = m.id;
  chatSend('Perasaanku sekarang: ' + m.label.toLowerCase() + '.');
}

function chatDetectTopics(text, s) {
  Object.keys(CHAT_TOPICS).forEach(label => {
    if (CHAT_TOPICS[label].test(text) && !s.topics.includes(label)) s.topics.push(label);
  });
}

async function chatSend(raw) {
  const max = chatCfg().MAX_MESSAGE_LENGTH || 1000;
  const text = (raw || '').trim().slice(0, max);
  if (!text || chatBusy) return;

  const s = chatEnsureSession();
  const input = $chat('chatInput');
  input.value = '';
  chatGrow();
  chatSetBusy(true);

  const userMsg = { role: 'user', text, ts: new Date().toISOString() };
  s.messages.push(userMsg);
  chatRenderBubble('user', text, userMsg.ts);
  chatDetectTopics(text, s);

  const crisis = CHAT_CRISIS.test(text);
  if (crisis) {
    s.flagged = true;
    s.reviewed = false;
    s.messages.push({ role: 'system', kind: 'crisis', ts: new Date().toISOString() });
    chatRenderCrisis();
  }
  chatPersist();

  chatShowTyping();
  const reply = await chatGetReply(s, text, crisis);
  chatHideTyping();

  const aiMsg = { role: 'ai', text: reply, ts: new Date().toISOString() };
  s.messages.push(aiMsg);
  chatRenderBubble('ai', reply, aiMsg.ts);
  chatPersist();

  chatSetBusy(false);
  input.focus();
}

function chatNewSession(showMsg) {
  chatSession = null;
  sessionStorage.removeItem(CHAT_CURRENT_KEY);
  chatFallbackCount = 0;
  chatRenderWelcome();
  if (showMsg && typeof showToast === 'function') showToast('Percakapan baru dimulai. Percakapan sebelumnya tersimpan.', 'info');
}

// ---------- AI REPLY ----------
async function chatGetReply(s, text, crisis) {
  const endpoint = chatCfg().CHAT_ENDPOINT;
  if (endpoint) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), chatCfg().CHAT_TIMEOUT_MS || 25000);
    try {
      let msgs = s.messages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .slice(-20)
        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
      while (msgs.length && msgs[0].role !== 'user') msgs.shift();

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: s.id, mood: s.mood, topics: s.topics, messages: msgs }),
        signal: ctrl.signal
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data && data.reply) return String(data.reply);
      throw new Error('Respons kosong');
    } catch (err) {
      console.warn('[Chat AI] Beralih ke mode lokal:', err);
      if (!chatErrorShown && typeof showToast === 'function') {
        chatErrorShown = true;
        showToast('Koneksi ke AI sedang bermasalah. Memakai mode sederhana.', 'info');
      }
    } finally {
      clearTimeout(timer);
    }
  }
  await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
  return chatLocalReply(s, text, crisis);
}

const CHAT_OPENERS = {
  'sangat-sedih': 'Aku ikut merasakan beratnya perasaanmu. Terima kasih sudah mau membukanya di sini.',
  cemas: 'Rasa cemas bisa bikin pikiran terasa penuh dan melelahkan. Kamu tidak harus menghadapinya sendirian di sini.',
  lelah: 'Kedengarannya kamu sudah menahan banyak hal. Lelah seperti itu nyata dan wajar dirasakan.',
  marah: 'Marah bisa jadi tanda ada hal penting atau tidak adil buatmu. Boleh banget kamu keluarkan di sini.',
  bingung: 'Merasa bingung itu tidak enak, apalagi saat belum tahu mulai dari mana. Kita urai pelan-pelan ya.'
};
const CHAT_ACKS = [
  'Aku mendengarkan, lanjutkan saja kalau kamu mau.',
  'Terima kasih sudah bercerita sejauh ini. Itu butuh keberanian.',
  'Itu terdengar berat, dan wajar kalau kamu merasa begitu.',
  'Pelan-pelan saja, aku di sini.'
];
const CHAT_TOPIC_Q = {
  Akademik: 'Bagian mana dari urusan kuliah ini yang paling menekanmu sekarang?',
  Hubungan: 'Apa yang paling kamu harapkan dari hubungan ini saat ini?',
  Keluarga: 'Bagaimana perasaanmu setiap kali hal ini terjadi di rumah?',
  Keuangan: 'Kalau dipikirkan satu langkah kecil dulu soal keuangan ini, kira-kira apa?',
  Organisasi: 'Apa yang paling menguras energimu di organisasi itu?',
  Kesehatan: 'Sudah berapa lama kamu merasakan ini, dan apakah kamu sempat istirahat?',
  Karir: 'Apa yang paling kamu khawatirkan tentang langkah selanjutnya?'
};
const CHAT_GENERIC_Q = [
  'Apa yang paling terasa berat buatmu saat ini?',
  'Sejak kapan perasaan ini mulai muncul?',
  'Kalau kamu bisa menyampaikan satu hal ke orang yang tepat, apa itu?',
  'Apa yang biasanya membuatmu sedikit lebih tenang?'
];

function chatLocalReply(s, text, crisis) {
  if (crisis) {
    return 'Terima kasih sudah jujur soal ini, itu tidak mudah. Keselamatanmu penting buatku. ' +
      'Tolong hubungi orang yang kamu percaya sekarang, atau layanan 119 ext. 8 / 112 kalau kamu merasa tidak aman. ' +
      'Aku tetap di sini menemanimu. Apakah ada seseorang di dekatmu saat ini?';
  }
  if (/terima kasih|makasih|thanks|thank you/i.test(text)) {
    return 'Sama-sama. Aku senang kamu mau berbagi. Kalau masih ada yang ingin kamu ceritakan, aku di sini.';
  }
  const i = chatFallbackCount++;
  const firstAi = s.messages.filter(m => m.role === 'ai').length === 0;
  const opener = firstAi && s.moodId && CHAT_OPENERS[s.moodId] ? CHAT_OPENERS[s.moodId] : CHAT_ACKS[i % CHAT_ACKS.length];

  let question = CHAT_GENERIC_Q[i % CHAT_GENERIC_Q.length];
  const lastTopic = s.topics.length ? s.topics[s.topics.length - 1].replace(/^\S+\s/, '') : '';
  if (lastTopic && CHAT_TOPIC_Q[lastTopic] && i % 2 === 0) question = CHAT_TOPIC_Q[lastTopic];

  return opener + ' ' + question;
}

// ---------- INIT (dipanggil Router saat membuka #chat) ----------
function initChat() {
  if (!chatBound) {
    const form = $chat('chatForm');
    const input = $chat('chatInput');

    form.addEventListener('submit', e => { e.preventDefault(); chatSend(input.value); });
    input.addEventListener('input', () => { chatGrow(); $chat('chatSend').disabled = chatBusy || !input.value.trim(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); chatSend(input.value); }
    });
    $chat('chatNewBtn').addEventListener('click', () => chatNewSession(true));
    chatBound = true;
  }

  // Pulihkan percakapan yang sedang berjalan di tab ini
  if (!chatSession) {
    const currentId = sessionStorage.getItem(CHAT_CURRENT_KEY);
    if (currentId) chatSession = chatLoadSessions().find(s => s.id === currentId) || null;
  }
  chatRenderAll();
  chatSetBusy(chatBusy);
  setTimeout(() => $chat('chatInput').focus(), 150);
}
