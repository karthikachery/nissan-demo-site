import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — the prototype's chrome (stardust/prototypes/parts-service-proposed.html,
 * .site-header + .sidenav + #search-container), template-slotted: the authored /nav
 * nodes are MOVED into empty slot containers by role, never rebuilt (EW1–EW10).
 *
 * /nav sections, in order: 1 brand (logo link with mobile + desktop logo images),
 * 2 nav list (an item without a link opens the mega-menu panel whose h2 names it),
 * 3 tools (Dealer Locator CTA), then the mega-menu panels (h2 title, h3 groups of
 * images + h4/p/ul), the mobile dealer-search panel (location icon, h3, text,
 * search link, current-location link, "Filters Applied", h4 + list filter groups,
 * a "*…" disclaimer paragraph, "Clear Filters") and the sticky dealer-search bar
 * (label paragraph + search link). Panels are classified by content, not position.
 *
 * @ew-exempt search inputs take their placeholder from the authored search link text, and
 * the radius <select> its options from the authored list; the authored nodes stay in the DOM
 * (visually hidden) and remain the editable source.
 */

const desktop = window.matchMedia('(width >= 768px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function contentOf(section) {
  return section.querySelector('.default-content-wrapper') || section;
}

/** wrap an authored node in a slot container that carries the layout class (EW2) */
function slot(node, className, attrs) {
  const wrap = el('div', className, attrs);
  if (node) {
    node.before(wrap);
    wrap.append(node);
  }
  return wrap;
}

/** vector art: drop the rasterised webp renditions the pipeline adds to an SVG picture */
function preferSvg(root) {
  root.querySelectorAll('picture').forEach((pic) => {
    const img = pic.querySelector('img');
    if (!img || !/\.svg(\?|$)/.test(img.getAttribute('src') || '')) return;
    pic.querySelectorAll('source:not([type="image/svg+xml"])').forEach((s) => s.remove());
  });
}

function classify(sections) {
  const roles = { panels: [], extra: [] };
  sections.forEach((section) => {
    const c = contentOf(section);
    if (!c.firstElementChild) return;
    if (c.querySelector(':scope > h2')) roles.panels.push(section);
    else if (c.querySelector('h4') && c.querySelector('ul')) roles.mobileSearch = section;
    else if (c.querySelector('a') && !c.querySelector('h1, h2, h3, ul, picture')) {
      roles.searchBar = section;
    } else roles.extra.push(section);
  });
  return roles;
}

function buildLogo(brandSection) {
  const p = brandSection ? contentOf(brandSection).querySelector('p') : null;
  const logo = slot(p, 'navbar-logo');
  const a = logo.querySelector('a');
  if (a) {
    a.id = 'nissan_logo_header';
    const pictures = [...a.querySelectorAll('picture')];
    pictures.forEach((pic, i) => {
      const img = pic.querySelector('img');
      if (img) img.loading = 'eager';
      const kind = i === 0 ? 'navbar-logo-mobile' : 'navbar-logo-desktop';
      const span = el('span', kind);
      pic.before(span);
      span.append(pic);
    });
    const white = el('img', 'navbar-logo-white', {
      src: '/icons/nissan-logo-white.svg', alt: '', 'aria-hidden': 'true', width: '116', height: '97',
    });
    a.append(white);
  }
  return logo;
}

function buildPanel(section, idx) {
  const c = contentOf(section);
  const h2 = c.querySelector(':scope > h2');
  const id = `${slug(h2 ? h2.textContent : `menu-${idx}`)}-menu`;
  const menu = el('div', 'mega-menu', { id });
  menu.hidden = true;
  const bar = el('div', 'mega-menu-bar');
  const back = el('button', 'mega-menu-back', { type: 'button', 'aria-label': 'Back' });
  const close = el('button', 'mega-menu-close', { type: 'button', 'aria-label': 'Close' });
  bar.append(back, slot(h2, 'mega-menu-title'), close);
  menu.append(bar);

  let group = null;
  let media = null;
  let links = null;
  [...c.children].forEach((node) => {
    if (node.tagName === 'H3') {
      menu.append(slot(node, 'mega-menu-heading'));
      group = el('div', 'mega-menu-group');
      media = el('div', 'mega-menu-media');
      links = el('div', 'mega-menu-links');
      group.append(media, links);
      menu.append(group);
    } else if (group && node.querySelector('picture') && !node.textContent.trim()) {
      const kind = media.children.length === 0 ? 'mega-menu-img-mobile' : 'mega-menu-img-desktop';
      media.append(slot(node, kind));
    } else if (group) {
      links.append(node);
    }
  });
  return { menu, title: h2 ? h2.textContent.trim().toLowerCase() : '' };
}

function buildMobileSearch(section) {
  const form = el('form', 'site-nav-mobile-search', { method: 'get', role: 'search' });
  if (!section) return form;
  const c = contentOf(section);
  const nodes = [...c.children];
  const filters = el('div', 'site-nav-filters');
  const filtersBody = el('div', 'site-nav-filters-body', { id: 'dropdown-menu' });
  let group = null;
  let lastServicesList = null;
  let searchLinkSeen = false;

  nodes.forEach((node) => {
    const text = node.textContent.trim();
    const link = node.querySelector('a');
    if (node.tagName === 'P' && node.querySelector('picture') && !text) {
      form.append(slot(node, 'site-nav-search-icon'));
    } else if (/^H[1-3]$/.test(node.tagName)) {
      form.append(slot(node, 'site-nav-search-title'));
    } else if (node.tagName === 'P' && link && !searchLinkSeen) {
      searchLinkSeen = true;
      form.action = link.href;
      const row = el('div', 'site-nav-search-row');
      const input = el('input', '', {
        type: 'search', id: 'nav-mobile-search-input', name: 'SearchText',
      });
      input.placeholder = link.textContent.trim();
      input.setAttribute('aria-label', input.placeholder);
      const btn = el('button', '', {
        type: 'submit', id: 'nav-mobile-search-button', 'aria-label': 'Search',
      });
      row.append(slot(node, 'visually-hidden'), input, btn);
      form.append(row);
    } else if (node.tagName === 'P' && link) {
      form.append(slot(node, 'site-nav-current-loc'));
    } else if (node.tagName === 'H4') {
      group = el('div', 'filter-group');
      group.append(slot(node, 'filter-group-title'));
      filtersBody.append(group);
    } else if (node.tagName === 'UL' && group) {
      const items = [...node.querySelectorAll(':scope > li')];
      if (items.length && items.every((li) => /^\d+\s/.test(li.textContent.trim()))) {
        const select = el('select', '', { id: 'Distance', name: 'Distance' });
        const title = group.querySelector('.filter-group-title');
        select.setAttribute('aria-label', title ? title.textContent.trim() : 'Radius');
        items.forEach((li, i) => {
          const opt = el('option');
          opt.textContent = li.textContent.trim();
          if (i === items.length - 1) opt.selected = true;
          select.append(opt);
        });
        group.append(slot(node, 'visually-hidden'), select);
      } else {
        items.forEach((li) => {
          const label = el('label', 'filter-check');
          const box = el('input', '', { type: 'checkbox', name: 'Amenities' });
          const span = el('span');
          span.append(...li.childNodes);
          label.append(box, span);
          li.append(label);
        });
        group.append(slot(node, 'filter-list'));
        lastServicesList = node;
      }
    } else if (node.tagName === 'P' && text.startsWith('*') && lastServicesList) {
      const host = lastServicesList.querySelector('li');
      const id = 'ms-filter-disclaimer';
      const wrap = el('div', 'disclaimer');
      const invoker = el('span', 'disclaimer-invoker', {
        role: 'button', tabindex: '0', 'aria-controls': id, 'aria-label': 'Mobile Service info',
      });
      const pic = node.querySelector('picture');
      if (pic) invoker.append(pic);
      const body = el('div', 'disclaimer-body', { popover: '', id });
      const x = el('button', 'disclaimer-close', {
        type: 'button', popovertarget: id, popovertargetaction: 'hide', 'aria-label': 'close',
      });
      body.append(x, node);
      wrap.append(invoker, body);
      if (host) host.append(wrap);
    } else if (node.tagName === 'P' && !group) {
      if (!filters.firstElementChild && /filter/i.test(text)) {
        const head = slot(node, 'site-nav-filters-head', {
          id: 'filter-btn',
          role: 'button',
          tabindex: '0',
          'aria-expanded': 'false',
          'aria-controls': 'dropdown-menu',
        });
        const count = el('span', 'site-nav-filters-count', { 'aria-hidden': 'true' });
        count.innerHTML = ' (<span id="no-of-filters">0</span>)';
        head.append(count);
        filters.append(head);
      } else {
        form.append(slot(node, 'site-nav-search-text'));
      }
    } else if (node.tagName === 'P') {
      filtersBody.append(slot(node, 'filter-reset', { id: 'clear-filters', role: 'button' }));
    }
  });
  filters.append(filtersBody);
  form.append(filters);
  return form;
}

function buildSearchBar(section) {
  const form = el('form', 'dealer-search', {
    id: 'search-container', method: 'get', role: 'search',
  });
  const row = el('div', 'dealer-search-row');
  form.append(row);
  if (!section) return form;
  const c = contentOf(section);
  const link = c.querySelector('a');
  const labelP = [...c.children].find((n) => !n.querySelector('a'));
  const label = el('label', 'dealer-search-label', { for: 'SearchText' });
  if (labelP) label.append(labelP);
  const input = el('input', 'dealer-search-input', {
    type: 'search', id: 'SearchText', name: 'SearchText',
  });
  if (link) {
    form.action = link.href;
    input.placeholder = link.textContent.trim();
  }
  const btn = el('button', 'dealer-search-btn', {
    type: 'submit', id: 'dealer-search-btn', 'aria-label': 'Search',
  });
  row.append(label, input, btn, slot(link ? link.closest('p') : null, 'visually-hidden'));
  return form;
}

function wireFilters(form) {
  const head = form.querySelector('#filter-btn');
  const body = form.querySelector('#dropdown-menu');
  const boxes = () => [...form.querySelectorAll('.filter-check input')];
  const count = form.querySelector('#no-of-filters');
  const update = () => {
    if (count) count.textContent = String(boxes().filter((b) => b.checked).length);
  };
  const toggle = (e) => {
    e.preventDefault();
    const open = !body.classList.contains('is-open');
    body.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
  };
  if (head && body) {
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') toggle(e);
    });
  }
  boxes().forEach((b) => b.addEventListener('change', update));
  const reset = form.querySelector('#clear-filters');
  reset?.addEventListener('click', (e) => {
    e.preventDefault();
    boxes().forEach((b) => { b.checked = false; });
    update();
  });
  form.querySelectorAll('.disclaimer-invoker').forEach((inv) => {
    const open = (e) => {
      e.preventDefault();
      const pop = document.getElementById(inv.getAttribute('aria-controls'));
      if (pop && pop.togglePopover) pop.togglePopover();
    };
    inv.addEventListener('click', open);
    inv.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') open(e);
    });
  });
}

function wireStickySearch(bar) {
  let origin;
  const onScroll = () => {
    if (origin === undefined) origin = bar.offsetTop;
    if (window.pageYOffset > origin) bar.classList.add('sticky');
    else {
      bar.classList.remove('sticky');
      origin = bar.offsetTop;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  if (block.querySelector(':scope > .site-header')) return; // EW9: already decorated
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  preferSvg(fragment);
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSection, listSection, toolsSection, ...rest] = sections;
  const roles = classify(rest);

  // --- navbar
  const siteHeader = el('div', 'site-header');
  const navbar = el('div', 'navbar', { id: 'navbar' });
  siteHeader.append(navbar);
  const logo = buildLogo(brandSection);

  const nav = el('nav', 'site-nav', { id: 'site-nav', 'aria-label': 'Main' });
  const list = el('div', 'site-nav-list');
  const ul = listSection ? contentOf(listSection).querySelector('ul') : null;
  if (ul) list.append(slot(ul, 'site-nav-items'));
  const ctaP = toolsSection ? contentOf(toolsSection).querySelector('p') : null;
  if (ctaP) {
    const a = ctaP.querySelector('a');
    if (a) a.id = 'menu-dealer-locator-btn';
    list.append(slot(ctaP, 'site-nav-cta'));
  }
  const closeItem = el('div', 'site-nav-close-item', { id: 'menu-close-btn-container' });
  const mainClose = el('button', 'site-nav-close', {
    type: 'button', id: 'main_menu_close', 'aria-label': 'Close',
  });
  closeItem.append(mainClose);
  list.append(closeItem);
  nav.append(list);

  const mobileSearch = buildMobileSearch(roles.mobileSearch);
  nav.append(mobileSearch);

  const burger = el('button', 'menu-toggle', {
    type: 'button',
    id: 'navbar-Burger',
    'aria-label': 'Menu',
    'aria-controls': 'site-nav',
    'aria-expanded': 'false',
  });
  navbar.append(logo, nav, burger);

  // --- mega menus
  const overlay = el('div', 'sidenav-overlay', { id: 'overlay' });
  const sidenav = el('div', 'sidenav', { id: 'mySidenav' });
  const panels = roles.panels.map((s, i) => buildPanel(s, i));
  panels.forEach(({ menu }) => sidenav.append(menu));

  // --- sticky dealer search bar (phone)
  const searchBar = buildSearchBar(roles.searchBar);

  block.replaceChildren(siteHeader, overlay, sidenav, searchBar);

  // --- behaviour (prototype js/parts-service.js; source motion-observe classes)
  const triggers = [];
  if (ul) {
    [...ul.querySelectorAll(':scope > li')].forEach((li) => {
      if (li.querySelector('a')) return;
      const title = li.textContent.trim().toLowerCase();
      const panel = panels.find((p) => p.title === title);
      if (!panel) return;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-controls', panel.menu.id);
      li.setAttribute('aria-expanded', 'false');
      li.id = `header_${slug(title).split('-')[0]}_menu`;
      triggers.push(li);
    });
  }
  const whiteLogo = logo.querySelector('.navbar-logo-white');

  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  const closeMenus = () => {
    sidenav.classList.remove('side-nav');
    overlay.classList.remove('overlay-active');
    document.body.classList.remove('side-menu-active');
    whiteLogo?.classList.remove('is-active');
    logo.classList.remove('logo-inverse');
    closeItem.classList.remove('is-visible');
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
  };
  const openMenu = (t) => {
    const wasOpen = t.getAttribute('aria-expanded') === 'true';
    closeMenus();
    if (wasOpen) return;
    const menu = document.getElementById(t.getAttribute('aria-controls'));
    sidenav.querySelectorAll('.mega-menu').forEach((m) => { m.hidden = m !== menu; });
    sidenav.classList.add('side-nav');
    overlay.classList.add('overlay-active');
    document.body.classList.add('side-menu-active');
    whiteLogo?.classList.add('is-active');
    logo.classList.add('logo-inverse');
    closeItem.classList.add('is-visible');
    t.setAttribute('aria-expanded', 'true');
  };
  triggers.forEach((t) => {
    t.addEventListener('click', () => openMenu(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu(t);
      }
    });
  });
  burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  overlay.addEventListener('click', closeMenus);
  mainClose.addEventListener('click', closeMenus);
  sidenav.querySelectorAll('.mega-menu-close').forEach((b) => b.addEventListener('click', () => {
    closeMenus();
    setNav(false);
  }));
  sidenav.querySelectorAll('.mega-menu-back').forEach((b) => b.addEventListener('click', closeMenus));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
    if (open) {
      closeMenus();
      open.focus();
    } else if (nav.classList.contains('is-open')) {
      setNav(false);
      burger.focus();
    }
  });
  desktop.addEventListener('change', () => setNav(false));

  wireFilters(mobileSearch);
  wireStickySearch(searchBar);
}
