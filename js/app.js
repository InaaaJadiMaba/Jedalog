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
    // Link lama #curhat sekarang langsung ke Chat AI
    if (page === 'curhat') page = 'chat';
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
function initAuth() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Masuk...';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Masuk →';
        showToast('Login berhasil! Selamat datang di JedaLog.', 'success');
        Router.navigate('chat');
      }, 1200);
    });
  }

  // Register form
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passInput = regForm.querySelector('#regPass');
      const confirmInput = regForm.querySelector('#regConfirm');
      if (passInput.value !== confirmInput.value) {
        showToast('Password tidak cocok. Periksa kembali.', 'error');
        return;
      }
      const btn = regForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Mendaftar...';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Daftar Sekarang →';
        showToast('Akun berhasil dibuat! Kamu bisa mulai curhat sekarang.', 'success');
        Router.navigate('chat');
      }, 1500);
    });
  }
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
