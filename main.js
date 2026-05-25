/* ─────────────────────────────────────────────────────────────
   Theo Ganadik – main.js
───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile sidebar ───────────────────────────────────────── */
  const hamburger      = document.getElementById('hamburger');
  const sidebar        = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose   = document.getElementById('sidebarClose');

  const openSidebar = () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  /* ── Active dot nav ───────────────────────────────────────── */
  const sections = Array.from(document.querySelectorAll('.section'));
  const dots     = Array.from(document.querySelectorAll('.dot-nav .dot'));

  const activateDot = () => {
    const mid = window.innerHeight / 2;
    let active = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= mid) active = i;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  };

  window.addEventListener('scroll', activateDot, { passive: true });
  activateDot();

  /* ── Fade-up on scroll ────────────────────────────────────── */
  // Tag elements we want to animate
  const animTargets = [
    '.hero-label', '.hero-name', '.hero-sub', '.btn-learn',
    '.section-label', '.section-title', '.about-text', '.stats-row',
    '.partners-sub', '.partner-card',
    '.races-list', '.race-item',
    '.contact-sub', '.contact-form',
  ];

  animTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('fade-up');
      if (i > 0 && i <= 5) el.classList.add(`fade-up-delay-${i}`);
    });
  });

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── Smooth scroll for all anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── About read more (mobile) ────────────────────────────── */
  const aboutCopy = document.getElementById('aboutCopy');
  const aboutReadMore = document.getElementById('aboutReadMore');

  if (aboutCopy && aboutReadMore) {
    aboutReadMore.addEventListener('click', () => {
      const isExpanded = aboutCopy.classList.toggle('is-expanded');
      aboutReadMore.textContent = isExpanded ? 'READ LESS' : 'READ MORE';
      aboutReadMore.setAttribute('aria-expanded', String(isExpanded));
    });
  }

  /* ── Contact form ─────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Basic validation
      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(inp => {
        inp.style.borderColor = '';
        if (!inp.value.trim()) {
          inp.style.borderColor = 'var(--red)';
          valid = false;
        }
      });

      // Email format check
      const emailField = form.querySelector('#email');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        emailField.style.borderColor = 'var(--red)';
        valid = false;
      }

      if (!valid) return;

      // Build mailto and open it
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const subject = form.querySelector('#subject').value.trim();
      const message = form.querySelector('#message').value.trim();
      const body    = `From: ${name} <${email}>\n\n${message}`;
      window.location.href =
        `mailto:ivan.ganadik@ganamont.sk` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      // Replace form with success message
      form.closest('.contact-inner').innerHTML = `
        <div class="form-success fade-up visible">
          <h3>MESSAGE SENT</h3>
          <p>Thanks for reaching out! Theo's team will get back to you shortly.</p>
        </div>`;
    });
  }



});
