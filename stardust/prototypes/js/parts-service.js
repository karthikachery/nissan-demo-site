/*
 * parts-service.js — minimal behaviour for the /parts-service replica.
 * - sticky dealer search bar: the source's site.min.js myFunction() — `.sticky` when
 *   pageYOffset > the bar's offsetTop (lifted threshold), position: fixed (nissan.css .sticky)
 * - menus, footer accordion, language dropdown, offer dialogs, hero dots, offers rail arrows
 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* sticky dealer search bar */
  const searchBar = $('#search-container');
  if (searchBar) {
    let origin;
    const onScroll = () => {
      if (origin === undefined) origin = searchBar.offsetTop;
      if (window.pageYOffset > origin) searchBar.classList.add('sticky');
      else { searchBar.classList.remove('sticky'); origin = searchBar.offsetTop; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile menu */
  const nav = $('#site-nav');
  const burger = $('#navbar-Burger');
  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger?.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));

  /* mega menus (live: .sidenav gets .side-nav, overlay .overlay-active, body .side-menu-active,
     trigger .highlightNav, white logo, close button visible — motion-observe classMutations) */
  const sidenav = $('#mySidenav');
  const overlay = $('#overlay');
  const triggers = $$('.site-nav__link[aria-controls]');
  const whiteLogo = $('.navbar__logo-white');
  const blackLogo = $('.navbar__logo picture');
  const closeItem = $('#menu-close-btn-container');
  const closeMenus = () => {
    sidenav.classList.remove('side-nav');
    overlay.classList.remove('overlay-active');
    document.body.classList.remove('side-menu-active');
    nav.classList.remove('main-navigation');
    whiteLogo?.classList.remove('is-active');
    blackLogo?.classList.remove('inactive');
    closeItem?.classList.remove('menu-close-btn-container');
    triggers.forEach((t) => { t.setAttribute('aria-expanded', 'false'); t.classList.remove('highlightNav'); });
  };
  triggers.forEach((t) => t.addEventListener('click', () => {
    const menu = document.getElementById(t.getAttribute('aria-controls'));
    const wasOpen = t.getAttribute('aria-expanded') === 'true';
    closeMenus();
    if (wasOpen) return;
    $$('.mega-menu', sidenav).forEach((m) => { m.hidden = m !== menu; });
    sidenav.classList.add('side-nav');
    overlay.classList.add('overlay-active');
    document.body.classList.add('side-menu-active');
    nav.classList.add('main-navigation');
    whiteLogo?.classList.add('is-active');
    blackLogo?.classList.add('inactive');
    closeItem?.classList.add('menu-close-btn-container');
    t.setAttribute('aria-expanded', 'true');
    t.classList.add('highlightNav');
  }));
  overlay?.addEventListener('click', closeMenus);
  $('#main_menu_close')?.addEventListener('click', closeMenus);
  $$('.mega-menu__close', sidenav).forEach((b) => b.addEventListener('click', () => { closeMenus(); setNav(false); }));
  $$('.mega-menu__back', sidenav).forEach((b) => b.addEventListener('click', closeMenus));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sidenav.classList.contains('side-nav')) closeMenus(); });

  /* footer accordion (mobile) */
  const activate = (el, fn) => {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
  };
  $$('.footer-links__title').forEach((btn) => activate(btn, () => {
    if (window.matchMedia('(min-width: 768px)').matches) return;
    const body = document.getElementById(btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-open', open);
  }));

  /* "[*]" disclaimer popovers */
  $$('.disclaimer__invoker').forEach((inv) => activate(inv, () => {
    const pop = document.getElementById(inv.getAttribute('aria-controls'));
    if (pop && pop.togglePopover) pop.togglePopover();
  }));

  /* mobile dealer-search filters */
  const filterBtn = $('#filter-btn');
  filterBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const body = $('#dropdown-menu');
    const open = !body.classList.contains('is-open');
    body.classList.toggle('is-open', open);
    filterBtn.setAttribute('aria-expanded', String(open));
  });
  $('#clear-filters')?.addEventListener('click', (e) => {
    e.preventDefault();
    $$('#dropdown-menu input[type=checkbox]').forEach((c) => { c.checked = false; });
    $('#no-of-filters').textContent = '0';
  });
  $$('#dropdown-menu input[type=checkbox]').forEach((c) => c.addEventListener('change', () => {
    $('#no-of-filters').textContent = String($$('#dropdown-menu input[type=checkbox]:checked').length);
  }));

  /* language dropdown */
  const lang = $('.lang-select__trigger');
  lang?.addEventListener('click', (e) => {
    e.preventDefault();
    const menu = document.getElementById(lang.getAttribute('aria-controls'));
    const open = lang.getAttribute('aria-expanded') !== 'true';
    lang.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  });

  /* offer dialogs */
  $$('[data-dialog]').forEach((t) => t.addEventListener('click', (e) => {
    e.preventDefault();
    const d = document.getElementById(t.dataset.dialog);
    if (d && !d.open) d.showModal();
  }));
  $$('dialog.offer-dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  /* hero carousel — Splide options lifted from splide-carousel.js + the element's attributes:
     type loop, autoplay, interval 10000 ms, speed 2000 ms, no pause on hover/focus;
     Splide's default reducedMotion pauses autoplay. Forward wrap 4 -> 1 like the loop track. */
  const track = $('.hero-carousel__track');
  const dots = $$('.hero-carousel__dot');
  const slides = $$('.hero-slide');
  let active = 0;
  const render = (i) => {
    const n = slides.length;
    dots.forEach((d, j) => { d.setAttribute('aria-selected', String(i === j)); d.classList.toggle('is-active', i === j); });
    slides.forEach((s, j) => {
      s.classList.toggle('is-active', j === i);
      s.classList.toggle('is-visible', j === i);
      s.classList.toggle('is-prev', j === (i + n - 1) % n);
      s.classList.toggle('is-next', j === (i + 1) % n);
    });
    slides.forEach((s, j) => { const v = $('video', s); if (v) { if (i === j) v.play().catch(() => {}); else v.pause(); } });
  };
  const go = (i) => {
    const n = slides.length;
    if (i === 0 && active === n - 1) {
      slides[0].style.order = '1';
      track.style.setProperty('--active', n - 1);
      track.classList.add('is-jumping');
      track.style.setProperty('--active', n - 2);
      void track.offsetWidth;
      track.classList.remove('is-jumping');
      track.style.setProperty('--active', n - 1);
      track.addEventListener('transitionend', function reset(e) {
        if (e.target !== track) return;
        track.removeEventListener('transitionend', reset);
        track.classList.add('is-jumping');
        slides[0].style.order = '';
        track.style.setProperty('--active', 0);
        void track.offsetWidth;
        track.classList.remove('is-jumping');
      });
    } else {
      track.style.setProperty('--active', i);
    }
    active = i;
    render(i);
  };
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const restart = () => {
    clearTimeout(timer);
    if (reduce.matches) return;
    timer = setTimeout(() => { go((active + 1) % slides.length); restart(); }, 10000);
  };
  render(active);
  restart();

  /* offers rail — vertical-slider.js model: pages = ceil(content / viewport), one click = one
     indicator page; container + indicator translate with a 1 s transition */
  const rail = $('#offers-track');
  const viewport = rail?.parentElement;
  const prev = $('#previous');
  const next = $('#next');
  const bar = $('#offers-progress');
  if (rail) {
    let x = 0;
    let barX = 0;
    const scrollable = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    const pages = () => Math.max(1, Math.ceil(rail.scrollWidth / Math.max(viewport.clientWidth, 1)));
    const layout = () => { bar.style.width = `${bar.parentElement.clientWidth / pages()}px`; };
    const sync = () => {
      prev.disabled = x <= 2;
      next.disabled = scrollable() <= 2 || x >= scrollable() - 2;
      prev.classList.toggle('disable-carousel-btn', prev.disabled);
      next.classList.toggle('disable-carousel-btn', next.disabled);
      rail.style.transform = `translate(${-x}px)`;
      bar.style.transform = `translate(${barX}px)`;
    };
    const step = () => (pages() <= 1 ? 0 : scrollable() / (pages() - 1));
    next.addEventListener('click', () => {
      if (x >= scrollable()) return;
      x = Math.min(x + step(), scrollable());
      barX = Math.min(barX + bar.offsetWidth, bar.parentElement.clientWidth - bar.offsetWidth);
      sync();
    });
    prev.addEventListener('click', () => {
      if (x === 0) return;
      x = Math.max(0, x - step());
      barX = Math.max(0, barX - bar.offsetWidth);
      sync();
    });
    window.addEventListener('resize', () => { x = 0; barX = 0; layout(); sync(); });
    layout();
    sync();
  }
})();
