// ===========================
// JedaLog - Main Application
// ===========================

// ---- STORAGE ----
const CURHAT_STORAGE_KEY = 'jedalog-curhat-logs';

function saveCurhatLog(data) {
  const logs = JSON.parse(localStorage.getItem(CURHAT_STORAGE_KEY) || '[]');
  logs.unshift(data); // newest first
  localStorage.setItem(CURHAT_STORAGE_KEY, JSON.stringify(logs));
}

function generateLogId() {
  return 'LOG-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

// ---- ROUTER ----
const Router = {
  currentPage: 'beranda',

  init() {
    // Handle nav links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        Router.navigate(page);
      }
    });

    // Handle hash on load
    const hash = window.location.hash.replace('#', '') || 'beranda';
    Router.navigate(hash, false);

    window.addEventListener('hashchange', () => {
      const page = window.location.hash.replace('#', '') || 'beranda';
      Router.navigate(page, false);
    });
  },

  navigate(page, updateHash = true) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
      this.currentPage = page;
    } else {
      document.getElementById('page-beranda').classList.add('active');
      this.currentPage = 'beranda';
    }

    // Update nav active states
    document.querySelectorAll('[data-page]').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === this.currentPage) {
        link.classList.add('active');
      }
    });

    // Update hash
    if (updateHash) {
      window.location.hash = this.currentPage;
    }

    // Close mobile nav
    closeMobileNav();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize page-specific features
    setTimeout(() => Router.initPage(this.currentPage), 100);
  },

  initPage(page) {
    if (page === 'bantuan') initFAQ();
    if (page === 'kontak') initContactForm();
    if (page === 'curhat') initCurhat();
    if (page === 'refleksi') initRefleksi();
    if (page === 'chat' && typeof initChat === 'function') initChat();
  }
};

// ---- THEME ----
const Theme = {
  current: localStorage.getItem('jedalog-theme') || 'light',

  init() {
    document.documentElement.setAttribute('data-theme', this.current);
    this.updateIcon();
  },

  toggle() {
    this.current = this.current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.current);
    localStorage.setItem('jedalog-theme', this.current);
    this.updateIcon();
  },

  updateIcon() {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = this.current === 'dark' ? '☀️' : '🌙';
  }
};

// ---- MOBILE NAV ----
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  nav.classList.remove('open');
  hamburger.classList.remove('active');
}

// ---- TOAST ----
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add CSS for toast out animation
const toastOutStyle = document.createElement('style');
toastOutStyle.textContent = `@keyframes slideOutRight { to { transform: translateX(110%); opacity: 0; } }`;
document.head.appendChild(toastOutStyle);

// ---- FAQ ACCORDION ----
function initFAQ() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  // Validate email
  const emailInput = form.querySelector('#contactEmail');
  const emailError = form.querySelector('#contactEmailError');
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailVal || !emailRegex.test(emailVal)) {
    emailInput.classList.add('error');
    emailError.classList.add('show');
    valid = false;
  } else {
    emailInput.classList.remove('error');
    emailError.classList.remove('show');
  }

  // Validate message
  const msgInput = form.querySelector('#contactMessage');
  const msgError = form.querySelector('#contactMessageError');
  if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
    msgInput.classList.add('error');
    msgError.classList.add('show');
    valid = false;
  } else {
    msgInput.classList.remove('error');
    msgError.classList.remove('show');
  }

  if (!valid) {
    showToast('Mohon perbaiki field yang belum terisi.', 'error');
    return;
  }

  // Collect form data & save to localStorage
  const nameVal = (form.querySelector('#contactName')?.value || '').trim();
  const messageData = {
    id: 'MSG-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase(),
    timestamp: new Date().toISOString(),
    name: nameVal || 'Anonim',
    email: emailVal,
    message: msgInput.value.trim(),
    status: 'unread',
  };
  const existingMsgs = JSON.parse(localStorage.getItem('jedalog-contact-messages') || '[]');
  existingMsgs.unshift(messageData);
  localStorage.setItem('jedalog-contact-messages', JSON.stringify(existingMsgs));

  // Simulate submission
  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Mengirim...';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Kirim Pesan →';
    showToast('Pesan berhasil dikirim! Kami akan membalas dalam 1×24 jam.', 'success');
  }, 1500);
}

// ---- AUTH ----
// Catatan: akun & sesi disimpan di localStorage browser (sama seperti data
// curhat dan pesan kontak). Ini cocok untuk prototipe; untuk produksi,
// ganti fungsi authRegister/authLogin dengan panggilan ke backend.
const AUTH_USERS_KEY = 'jedalog-users';
const AUTH_SESSION_KEY = 'jedalog-session';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authRead(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
}

function getSession() {
  return authRead(AUTH_SESSION_KEY, null);
}

async function authHash(text) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(unescape(encodeURIComponent(text))); // fallback (konteks non-HTTPS)
}

function setFieldError(input, errorEl, show) {
  if (input) input.classList.toggle('error', show);
  if (errorEl) errorEl.classList.toggle('show', show);
}

// Tombol "Masuk" di navbar berubah menjadi "Keluar" setelah login
function updateAuthUI() {
  const session = getSession();
  document.querySelectorAll('[data-auth-btn]').forEach(btn => {
    btn.textContent = session ? 'Keluar' : 'Masuk';
    btn.classList.toggle('is-logged-in', !!session);
    btn.setAttribute('href', session ? '#beranda' : '#login');
    if (session) btn.title = 'Masuk sebagai ' + session.email;
    else btn.removeAttribute('title');
  });
}

function logout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  updateAuthUI();
  showToast('Kamu sudah keluar. Sampai jumpa lagi!', 'info');
  Router.navigate('beranda');
}

function initAuth() {
  // Tombol Masuk/Keluar di navbar (desktop & mobile)
  document.querySelectorAll('[data-auth-btn]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (getSession()) logout();
      else Router.navigate('login');
    });
  });

  // Lihat / sembunyikan password
  const toggle = document.getElementById('loginPassToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const input = document.getElementById('loginPass');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.textContent = show ? '🙈' : '👁';
      toggle.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
    });
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = loginForm.querySelector('#loginEmail');
    const passInput = loginForm.querySelector('#loginPass');
    const emailError = loginForm.querySelector('#loginEmailError');
    const passError = loginForm.querySelector('#loginPassError');

    [emailInput, passInput].forEach(inp => inp.addEventListener('input', () => {
      setFieldError(emailInput, emailError, false);
      setFieldError(passInput, passError, false);
    }));

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();

      const emailOk = EMAIL_REGEX.test(email);
      const passOk = passInput.value.length > 0;
      setFieldError(emailInput, emailError, !emailOk);
      setFieldError(passInput, passError, !passOk);
      if (!emailOk || !passOk) {
        showToast('Mohon periksa email dan password kamu.', 'error');
        return;
      }

      const btn = loginForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Masuk...';

      const hash = await authHash(passInput.value);
      const user = authRead(AUTH_USERS_KEY, []).find(u => u.email === email);

      btn.disabled = false;
      btn.textContent = 'Masuk →';

      if (!user || user.hash !== hash) {
        passError.textContent = 'Email atau password salah.';
        setFieldError(passInput, passError, true);
        showToast('Email atau password salah.', 'error');
        return;
      }

      passError.textContent = 'Password tidak boleh kosong.';
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ email: user.email, at: Date.now() }));
      loginForm.reset();
      updateAuthUI();
      showToast('Login berhasil! Selamat datang di JedaLog.', 'success');
      Router.navigate('curhat');
    });
  }

  // Register form
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    const rEmail = regForm.querySelector('#regEmail');
    const rPass = regForm.querySelector('#regPass');
    const rConfirm = regForm.querySelector('#regConfirm');
    const eEmail = regForm.querySelector('#regEmailError');
    const ePass = regForm.querySelector('#regPassError');
    const eConfirm = regForm.querySelector('#regConfirmError');

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = rEmail.value.trim().toLowerCase();
      const users = authRead(AUTH_USERS_KEY, []);

      const emailOk = EMAIL_REGEX.test(email);
      const passOk = rPass.value.length >= 8;
      const confirmOk = rPass.value === rConfirm.value;
      const taken = emailOk && users.some(u => u.email === email);

      eEmail.textContent = taken ? 'Email ini sudah terdaftar. Silakan masuk.' : 'Masukkan alamat email yang valid.';
      setFieldError(rEmail, eEmail, !emailOk || taken);
      setFieldError(rPass, ePass, !passOk);
      setFieldError(rConfirm, eConfirm, !confirmOk);

      if (!emailOk || taken || !passOk || !confirmOk) {
        showToast(!confirmOk && passOk ? 'Password tidak cocok. Periksa kembali.' : 'Mohon perbaiki field yang ditandai.', 'error');
        return;
      }

      const btn = regForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Mendaftar...';

      users.push({ email, hash: await authHash(rPass.value), createdAt: new Date().toISOString() });
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ email, at: Date.now() }));

      btn.disabled = false;
      btn.textContent = 'Daftar Sekarang →';
      regForm.reset();
      updateAuthUI();
      showToast('Akun berhasil dibuat! Kamu bisa mulai curhat sekarang.', 'success');
      Router.navigate('curhat');
    });
  }

  updateAuthUI();
}

// ---- CURHAT FORM ----
let curhatStep = 1;
const totalCurhatSteps = 3;

function initCurhat() {
  curhatStep = 1;
  updateCurhatStep();

  // Mood buttons
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Topic chips
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // Char counter
  const textarea = document.getElementById('curhatText');
  const counter = document.getElementById('charCounter');
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      counter.textContent = `${textarea.value.length}/500`;
    });
  }
}

function updateCurhatStep() {
  // Update dots
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i < curhatStep);
  });

  // Update progress
  const fill = document.getElementById('curhatProgress');
  if (fill) fill.style.width = `${(curhatStep / totalCurhatSteps) * 100}%`;

  // Show/hide steps
  document.querySelectorAll('.curhat-step').forEach((step, i) => {
    step.style.display = i + 1 === curhatStep ? 'block' : 'none';
  });

  // Update step number text
  const stepText = document.getElementById('curhatStepText');
  if (stepText) stepText.textContent = `Langkah ${curhatStep} dari ${totalCurhatSteps}`;
}

function nextCurhatStep() {
  if (curhatStep === 1) {
    const mood = document.querySelector('.mood-btn.selected');
    if (!mood) {
      showToast('Pilih satu perasaan terlebih dahulu.', 'error');
      return;
    }
  }
  if (curhatStep === 2) {
    const text = document.getElementById('curhatText').value.trim();
    if (text.length < 20) {
      showToast('Ceritakan minimal 20 karakter ya.', 'error');
      return;
    }
  }
  if (curhatStep < totalCurhatSteps) {
    curhatStep++;
    updateCurhatStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevCurhatStep() {
  if (curhatStep > 1) {
    curhatStep--;
    updateCurhatStep();
  }
}

function submitCurhat() {
  const btn = document.getElementById('submitCurhat');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Mengirim...';
  }

  // Collect data from form
  const selectedMood = document.querySelector('.mood-btn.selected');
  const moodText = selectedMood
    ? selectedMood.querySelector('.mood-emoji')?.textContent + ' ' + (selectedMood.querySelector('span:last-child')?.textContent || '')
    : 'Tidak Dipilih';

  const selectedTopics = Array.from(document.querySelectorAll('.topic-chip.selected'))
    .map(chip => chip.textContent.trim());

  const curhatText = (document.getElementById('curhatText')?.value || '').trim();

  // Save to localStorage
  saveCurhatLog({
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    mood: moodText.trim(),
    topics: selectedTopics,
    text: curhatText,
  });

  setTimeout(() => {
    showToast('Curhatanmu berhasil terkirim! 💙 Kamu sudah berani berbagi.', 'success');
    Router.navigate('refleksi');
  }, 1500);
}

// ---- REFLEKSI ----
let refleksiStep = 0;
const refleksiSteps = [
  {
    icon: '🌬️',
    prompt: 'Latihan Napas: Tarik napas dalam...',
    hint: 'Tarik napas selama 4 hitungan, tahan 4 hitungan, hembuskan 4 hitungan. Ulangi 3 kali.',
    type: 'breathing',
    duration: 12
  },
  {
    icon: '💭',
    prompt: 'Apa yang paling membuatmu khawatir saat ini?',
    hint: 'Tuliskan dengan jujur. Tidak ada yang bisa melihat ini selain kamu.',
    type: 'text',
    placeholder: 'Tulis di sini...'
  },
  {
    icon: '🌱',
    prompt: 'Sebutkan 3 hal kecil yang kamu syukuri hari ini.',
    hint: 'Bisa hal sesederhana minum teh hangat, cuaca cerah, atau pesan dari teman.',
    type: 'text',
    placeholder: '1. \n2. \n3. '
  },
  {
    icon: '✨',
    prompt: 'Kamu sudah melakukan yang terbaik hari ini.',
    hint: 'Ingat bahwa proses itu lebih penting dari hasil. Kamu sudah berani untuk berbagi.',
    type: 'finish'
  }
];

function initRefleksi() {
  refleksiStep = 0;
  renderRefleksiStep();
}

function renderRefleksiStep() {
  const container = document.getElementById('refleksiContainer');
  if (!container) return;

  const step = refleksiSteps[refleksiStep];
  const isLast = refleksiStep === refleksiSteps.length - 1;
  const isFirst = refleksiStep === 0;

  // Progress
  const pct = ((refleksiStep + 1) / refleksiSteps.length) * 100;

  let contentHTML = '';
  if (step.type === 'breathing') {
    contentHTML = `
      <div style="text-align:center; padding: 32px 0;">
        <div id="breathCircle" style="width:120px;height:120px;border-radius:50%;background:radial-gradient(circle, #3164C8, #102C68);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;animation:breathe 4s ease-in-out infinite;">
          <span style="color:white;font-size:2rem;">${step.icon}</span>
        </div>
        <p style="font-size:1.1rem;font-weight:600;color:var(--navy);" id="breathText">Tarik napas...</p>
        <p style="font-size:0.85rem;color:var(--text-gray);margin-top:8px;">${step.hint}</p>
        <style>
          @keyframes breathe {
            0%,100%{transform:scale(1);}
            50%{transform:scale(1.25);}
          }
        </style>
      </div>
    `;
  } else if (step.type === 'text') {
    contentHTML = `
      <textarea class="form-input" rows="5" placeholder="${step.placeholder || 'Tulis di sini...'}"
        style="resize:vertical;margin-top:16px;"></textarea>
    `;
  } else if (step.type === 'finish') {
    contentHTML = `
      <div style="text-align:center;padding:32px 0;">
        <div style="font-size:3.5rem;margin-bottom:16px;">🎉</div>
        <p style="font-size:1.1rem;font-weight:600;color:var(--navy);margin-bottom:8px;">Hebat! Kamu telah menyelesaikan sesi refleksi.</p>
        <p style="font-size:0.88rem;color:var(--text-gray);max-width:360px;margin:0 auto;line-height:1.7;">${step.hint}</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="refleksi-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
        <span style="font-size:0.82rem;font-weight:600;color:var(--text-gray);">Langkah ${refleksiStep + 1} dari ${refleksiSteps.length}</span>
        <span style="font-size:0.82rem;font-weight:600;color:var(--royal);">${Math.round(pct)}%</span>
      </div>
      <div class="progress-bar" style="margin-bottom:32px;">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <div style="font-size:2rem;margin-bottom:12px;">${step.icon}</div>
      <div class="refleksi-prompt">${step.prompt}</div>
      ${step.hint && step.type !== 'breathing' && step.type !== 'finish' ? `<p class="refleksi-hint">${step.hint}</p>` : ''}
      ${contentHTML}
    </div>
    <div style="display:flex;gap:12px;justify-content:space-between;align-items:center;margin-top:16px;">
      ${!isFirst ? `<button class="btn-secondary" onclick="prevRefleksi()">← Kembali</button>` : '<div></div>'}
      ${isLast
        ? `<button class="btn-primary" onclick="Router.navigate('beranda')">Selesai & Kembali ke Beranda ✓</button>`
        : `<button class="btn-primary" onclick="nextRefleksi()">Lanjut →</button>`
      }
    </div>
  `;
}

function nextRefleksi() {
  if (refleksiStep < refleksiSteps.length - 1) {
    refleksiStep++;
    renderRefleksiStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevRefleksi() {
  if (refleksiStep > 0) {
    refleksiStep--;
    renderRefleksiStep();
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Router.init();
  initAuth();

  // Theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => Theme.toggle());
  }

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  // Smooth scroll for anchor links within page
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (!a.hasAttribute('data-page')) {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });
});
