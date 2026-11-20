/**
 * Offers — the prototype's section.offers "Current Offers" rail (source .home-offers
 * .vertical-slider). Reconstructive: a row without an image is the rail head (its heading),
 * every row with an image is one offer card. Authored nodes are MOVED into slots (EW1–EW10).
 *
 * Card cells: 1 images — a desktop image (>= 1024) then a mobile one, or a single image;
 * 2 the card heading, CTA paragraphs (a lone link: "*Offer Details" or a button) and an
 * optional validity paragraph — authored before the CTAs it sits under the heading, authored
 * after them it sits in the card foot beside the CTAs.
 *
 * Rail behaviour lifted from vertical-slider.js: pages = ceil(content / viewport), one click
 * = one indicator page; track + indicator translate with a 1 s transition.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function isCta(node) {
  if (node.tagName !== 'P') return false;
  const links = node.querySelectorAll('a');
  return links.length === 1 && node.textContent.trim() === links[0].textContent.trim();
}

function isExternal(a) {
  try {
    const { hostname } = new URL(a.href, window.location.href);
    return hostname !== window.location.hostname && !/epsilonrms\.com$/.test(hostname);
  } catch (e) {
    return false;
  }
}

function styleCta(a) {
  if (a.classList.contains('button')) {
    const primary = a.classList.contains('primary') || a.classList.contains('accent');
    a.classList.add(primary ? 'btn-primary' : 'btn-secondary');
    if (isExternal(a)) a.classList.add('btn-ext');
  } else {
    a.classList.add('link-btn');
  }
}

function buildCard(mediaCell, bodyCell) {
  const card = el('li', 'offer-card');
  const tile = el('div', 'offer-card-tile');
  const media = el('div', 'offer-card-media');
  const pictures = [...mediaCell.querySelectorAll('img')].map((i) => i.closest('picture') || i);
  pictures.forEach((pic, i) => {
    let cls = 'media-all';
    if (pictures.length > 1) cls = i === 0 ? 'media-desktop' : 'media-mobile';
    const holder = el('div', cls);
    holder.append(pic.closest('p') || pic);
    media.append(holder);
  });
  tile.append(media);

  const body = el('div', 'offer-card-body');
  const foot = el('div', 'offer-card-foot');
  const ctas = el('div', 'offer-card-ctas');
  let seenCta = false;
  let footValidity = null;
  const nodes = [...bodyCell.children];
  nodes.forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) {
      const slot = el('div', 'offer-card-title');
      slot.append(node);
      body.append(slot);
    } else if (isCta(node)) {
      seenCta = true;
      styleCta(node.querySelector('a'));
      const holder = el('div', 'cta');
      holder.append(node);
      ctas.append(holder);
    } else {
      const slot = el('div', 'offer-card-validity');
      slot.append(node);
      if (seenCta) footValidity = slot;
      else body.append(slot);
    }
  });
  if (body.querySelector('.offer-card-validity') || footValidity) card.classList.add('has-validity');
  if (footValidity) foot.append(footValidity);
  foot.append(ctas);
  body.append(foot);
  tile.append(body);
  card.append(tile);
  return card;
}

function startRail(rail, viewport, prev, next, bar) {
  let x = 0;
  let barX = 0;
  const scrollable = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
  const pages = () => Math.max(1, Math.ceil(rail.scrollWidth / Math.max(viewport.clientWidth, 1)));
  const layout = () => {
    bar.style.width = `${bar.parentElement.clientWidth / pages()}px`;
  };
  const sync = () => {
    prev.disabled = x <= 2;
    next.disabled = scrollable() <= 2 || x >= scrollable() - 2;
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
  window.addEventListener('resize', () => {
    x = 0;
    barX = 0;
    layout();
    sync();
  });
  layout();
  sync();
  // images finish loading after decoration: re-measure once they have
  rail.querySelectorAll('img').forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', () => {
        layout();
        sync();
      }, { once: true });
    }
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .offers-rail')) return; // EW9
  const rows = [...block.children];
  const head = el('div', 'offers-head container');
  const railWrap = el('div', 'offers-rail');
  const track = el('ul', 'offers-track', { id: 'offers-track' });
  rows.forEach((row) => {
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture, img'));
    if (!mediaCell) {
      cells.forEach((c) => {
        const title = el('div', 'offers-title');
        title.append(...c.children);
        if (title.children.length) head.append(title);
      });
      return;
    }
    const bodyCell = cells.find((c) => c !== mediaCell) || el('div');
    track.append(buildCard(mediaCell, bodyCell));
  });
  // source quirk kept for fidelity: the rail's trailing card sits 4 px lower (>= 768)
  const cards = track.querySelectorAll('.offer-card');
  if (cards.length > 4) cards[cards.length - 1].classList.add('offset');
  const progress = el('div', 'offers-progress');
  const bar = el('span', 'offers-progress-bar');
  progress.append(bar);
  const nav = el('div', 'offers-nav');
  const prev = el('button', 'offers-btn offers-btn-prev', {
    type: 'button', 'aria-label': 'Previous offers', 'aria-controls': 'offers-track',
  });
  const next = el('button', 'offers-btn offers-btn-next', {
    type: 'button', 'aria-label': 'Next offers', 'aria-controls': 'offers-track',
  });
  nav.append(prev, next);
  railWrap.append(track, progress, nav);
  block.replaceChildren(head, railWrap);
  startRail(track, railWrap, prev, next, bar);
}
