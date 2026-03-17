/* ════════════════════════════════════════
   BEYOND SUMMIT — Shared JS
   Include on EVERY page after components load.
   File: /js/main.js
════════════════════════════════════════ */

/* ── Component Loader ──
   Call: BSE.load('#slot-id', '/components/footer.html')
   Then: BSE.init() to wire up all behaviour
──────────────────────── */
window.BSE = {
  /**
   * Load an HTML component into a placeholder element.
   * @param {string} selector  - CSS selector of the placeholder
   * @param {string} url       - path to the component HTML file
   * @returns {Promise}
   */
  load(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then(r => r.text())
      .then(html => {
        el.outerHTML = html; // replace placeholder entirely
      })
      .catch(() => console.warn(`BSE: could not load ${url}`));
  },

  /**
   * Load multiple components in parallel, then call init().
   * @param {Array<{selector, url}>} components
   */
  loadAll(components) {
    return Promise.all(components.map(c => this.load(c.selector, c.url)))
      .then(() => this.init());
  },

  /** Wire up all interactive behaviour. Safe to call multiple times. */
  init() {
    this._initNav();
    this._initReveal();
    this._initScrollRails();
    this._initCounters();
    this._initSmoothAnchors();
    this._initActiveNavLink();
  },

  /* ── Navigation ── */
  _initNav() {
    const nav    = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('mobileNav');
    if (!nav) return;

    // Scroll solidify
    const solidify = () => nav.classList.toggle('solid', window.scrollY > 40);
    window.addEventListener('scroll', solidify, { passive: true });
    solidify(); // run immediately in case page is already scrolled

    // Mobile toggle
    let open = false;
    const openDrawer  = () => { open = true;  toggle?.classList.add('open');    toggle?.setAttribute('aria-expanded','true');  drawer?.classList.add('open');  document.body.style.overflow = 'hidden'; };
    const closeDrawer = () => { open = false; toggle?.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); drawer?.classList.remove('open'); document.body.style.overflow = ''; };

    toggle?.addEventListener('click', () => open ? closeDrawer() : openDrawer());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

    // Expose close globally (used by mobile-nav links: onclick="closeMobileNav()")
    window.closeMobileNav = closeDrawer;
  },

  /* ── Active nav link ── */
  _initActiveNavLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  },

  /* ── Reveal on scroll ── */
  _initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  },

  /* ── Counter animation ── */
  _initCounters() {
    const animate = el => {
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(ease(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      })(performance.now());
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.querySelectorAll('[data-count]').forEach(animate);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stats-band').forEach(el => obs.observe(el));
    // Also observe individual stat cells if stats-band isn't present
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
  },

  /* ── Scroll rails (click buttons + drag + touch) ── */
  _initScrollRails() {
    // Expose scrollRail globally (used in onclick attributes)
    window.scrollRail = (id, dir) => {
      const rail = document.getElementById(id);
      if (!rail) return;
      const card = rail.querySelector('[class*="card"]');
      const gap  = parseInt(getComputedStyle(rail).gap) || 20;
      const w    = card ? card.offsetWidth + gap : 300;
      rail.scrollBy({ left: dir * w, behavior: 'smooth' });
    };

    // Drag-to-scroll
    document.querySelectorAll('.scroll-rail').forEach(rail => {
      let isDown = false, startX = 0, scrollL = 0, dragged = false;

      rail.addEventListener('mousedown', e => {
        isDown = true; dragged = false; startX = e.pageX; scrollL = rail.scrollLeft;
      });
      document.addEventListener('mouseup', () => { isDown = false; });
      document.addEventListener('mousemove', e => {
        if (!isDown) return;
        if (Math.abs(e.pageX - startX) > 5) dragged = true;
        rail.scrollLeft = scrollL - (e.pageX - startX);
      });
      rail.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', e => { if (dragged) e.preventDefault(); });
      });

      // Touch
      let tX = 0, tL = 0;
      rail.addEventListener('touchstart', e => { tX = e.touches[0].pageX; tL = rail.scrollLeft; }, { passive: true });
      rail.addEventListener('touchmove',  e => { rail.scrollLeft = tL - (e.touches[0].pageX - tX); }, { passive: true });
    });
  },

  /* ── Smooth anchor scroll ── */
  _initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
      });
    });
  }
};

/* ── Auto-init if components aren't being lazy-loaded ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BSE.init());
} else {
  BSE.init();
}