// Kindora — vanilla JS interactions
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Loader
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader')?.classList.add('hidden'), 400);
  });

  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('kindora-theme');
  if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }
  $('#themeToggle')?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('kindora-theme', root.classList.contains('dark') ? 'dark' : 'light');
  });

  // Navbar scroll
  const navbar = $('#navbar');
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 20);
    toTop?.classList.toggle('visible', y > 400);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = ((y / h) * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  $('#menuBtn')?.addEventListener('click', () => $('#navLinks')?.classList.toggle('open'));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => $('#navLinks')?.classList.remove('open')));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Counters
  const cIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600, start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.floor(target * eased);
        el.textContent = v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'K' : v;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target >= 1000 ? (target / 1000).toFixed(target >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K' : target;
      };
      requestAnimationFrame(tick);
      cIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.stat-num').forEach(el => cIo.observe(el));

  // Typing effect
  const typing = $('#typingText');
  if (typing) {
    const words = ['1,240 volunteers', '86 new organizations', '12 universities'];
    let wi = 0, ci = 0, deleting = false;
    const loop = () => {
      const w = words[wi];
      typing.textContent = w.slice(0, ci);
      if (!deleting && ci < w.length) { ci++; setTimeout(loop, 70); }
      else if (deleting && ci > 0) { ci--; setTimeout(loop, 30); }
      else {
        deleting = !deleting;
        if (!deleting) wi = (wi + 1) % words.length;
        setTimeout(loop, deleting ? 1400 : 300);
      }
    };
    loop();
  }

  // Accordion
  $$('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 20 + 'px' : '0';
    });
  });

  // Ripple
  $$('.ripple').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const w = document.createElement('span');
      w.className = 'ripple-wave';
      const size = Math.max(r.width, r.height);
      w.style.width = w.style.height = size + 'px';
      w.style.left = (e.clientX - r.left - size / 2) + 'px';
      w.style.top = (e.clientY - r.top - size / 2) + 'px';
      btn.appendChild(w);
      setTimeout(() => w.remove(), 700);
    });
  });

  // Mouse glow + custom cursor
  const glow = $('#mouseGlow');
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  let rx = 0, ry = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
    if (dot) { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; }
    rx = e.clientX; ry = e.clientY;
  });
  const animRing = () => {
    cx += (rx - cx) * 0.18; cy += (ry - cy) * 0.18;
    if (ring) { ring.style.left = cx + 'px'; ring.style.top = cy + 'px'; }
    requestAnimationFrame(animRing);
  };
  animRing();
  $$('a,button,.feature-card,.price-card,.story-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring?.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring?.classList.remove('hover'));
  });

  // Parallax hero blobs
  const blobs = $$('.blob');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    blobs.forEach((b, i) => {
      b.style.transform = `translateY(${y * (0.05 + i * 0.03)}px)`;
    });
  }, { passive: true });

  // Smooth anchor nav (native smooth-behavior handles it, but offset for navbar)
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Contact form validation
  const form = $('#contactForm');
  const status = $('#formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const data = new FormData(form);
    $$('.field', form).forEach(f => f.classList.remove('error'));
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const msg = data.get('message')?.toString().trim();
    if (!name) { form.querySelector('[name=name]').closest('.field').classList.add('error'); ok = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.querySelector('[name=email]').closest('.field').classList.add('error'); ok = false; }
    if (!msg || msg.length < 10) { form.querySelector('[name=message]').closest('.field').classList.add('error'); ok = false; }
    if (!ok) {
      status.textContent = 'Please fix the highlighted fields.';
      status.className = 'form-status err';
      return;
    }
    status.textContent = 'Thanks! We\'ll be in touch within 24 hours.';
    status.className = 'form-status ok';
    form.reset();
  });
})();