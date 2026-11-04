// ===========================
// JedaLog - Backend Chat AI (tanpa dependensi, Node 18+)
// Menjalankan: situs statis (folder induk) + endpoint POST /api/chat
// ===========================
const http = require('http');
const fs = require('fs');
const path = require('path');

// Muat .env sederhana
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (e) { /* .env opsional */ }

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';   // kosong = hanya same-origin
const ROOT = path.join(__dirname, '..');

const SYSTEM_PROMPT = [
  'Kamu adalah Teman Jeda, teman curhat yang hangat dan tenang untuk mahasiswa di platform JedaLog.',
  'Balas dalam bahasa Indonesia yang santai namun sopan.',
  'Dengarkan dulu: akui perasaan pengguna dengan tulus, jangan menggurui, jangan langsung memberi daftar saran, jangan mendiagnosis.',
  'Jawab singkat (2-5 kalimat) dan ajukan paling banyak satu pertanyaan lembut.',
  'Kamu bukan pengganti psikolog; bila relevan, sarankan bicara dengan orang terpercaya atau layanan konseling kampus.',
  'Jika pengguna menyiratkan keinginan menyakiti diri atau mengakhiri hidup, tanggapi dengan peduli, dorong ia menghubungi orang terpercaya atau layanan 119 ext. 8 / 112, dan tetap temani.'
].join(' ');

// Pembatas laju sederhana (per IP)
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 60000, max = 20;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > max;
}

function send(res, code, body, headers = {}) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function cors(req, res) {
  if (ALLOWED_ORIGIN && req.headers.origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
}

async function handleChat(req, res) {
  if (!API_KEY) return send(res, 500, { error: 'ANTHROPIC_API_KEY belum diatur di server/.env' });
  if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'Terlalu banyak permintaan. Coba lagi sebentar.' });

  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 50000) return send(res, 413, { error: 'Permintaan terlalu besar' }); }

  let data;
  try { data = JSON.parse(raw); } catch (e) { return send(res, 400, { error: 'JSON tidak valid' }); }

  let messages = (Array.isArray(data.messages) ? data.messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-20)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') return send(res, 400, { error: 'Pesan tidak valid' });

  const context = [];
  if (typeof data.mood === 'string' && data.mood) context.push('Perasaan yang dipilih pengguna: ' + data.mood.slice(0, 40));
  if (Array.isArray(data.topics) && data.topics.length) context.push('Topik terdeteksi: ' + data.topics.slice(0, 7).join(', ').slice(0, 120));
  const system = SYSTEM_PROMPT + (context.length ? '\n\nKonteks: ' + context.join('. ') + '.' : '');

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system, messages })
    });
    if (!r.ok) {
      console.error('Anthropic API error', r.status, await r.text());
      return send(res, 502, { error: 'Layanan AI sedang bermasalah' });
    }
    const j = await r.json();
    const reply = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    return send(res, 200, { reply: reply || 'Aku di sini mendengarkan. Boleh ceritakan lagi?' });
  } catch (e) {
    console.error(e);
    return send(res, 502, { error: 'Tidak dapat menghubungi layanan AI' });
  }
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json' };

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(ROOT, rel));
  // cegah akses di luar folder proyek & folder server
  if (!file.startsWith(ROOT) || file.startsWith(__dirname)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}

http.createServer((req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.url.startsWith('/api/chat') && req.method === 'POST') return handleChat(req, res);
  if (req.method === 'GET') return serveStatic(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => {
  console.log(`JedaLog berjalan di http://localhost:${PORT}`);
  if (!API_KEY) console.warn('PERINGATAN: ANTHROPIC_API_KEY belum diatur. Salin .env.example menjadi .env.');
});
