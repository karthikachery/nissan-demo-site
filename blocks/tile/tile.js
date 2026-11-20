/**
 * Tile — the prototype's section.tile two-column tile (source section.two-column-tile).
 * Template-slotted: one row, an image cell (desktop image >= 768, then a mobile image) and a
 * content cell; the image cell authored first puts the media on the left, authored last on
 * the right. Content, classified by content: eyebrow (paragraph before the heading), heading,
 * text, CTA paragraphs (a lone link) and disclaimer bodies (a paragraph starting with "*"
 * that answers a "[*]" marker, moved into a native popover). Nodes are MOVED (EW1–EW10).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

let disclaimerSeq = 0;

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
    a.classList.add('btn', 'btn-tertiary');
  }
}

function linkDisclaimers(hosts, bodies, store) {
  const queue = [...bodies];
  hosts.forEach((host) => {
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach((start) => {
      let node = start;
      let at = node.data.indexOf('[*]');
      while (at >= 0 && queue.length) {
        const marker = node.splitText(at);
        const rest = marker.splitText(3);
        disclaimerSeq += 1;
        const id = `tile-disclaimer-${disclaimerSeq}`;
        const wrap = el('span', 'disclaimer');
        const invoker = el('span', 'disclaimer-invoker', {
          role: 'button', tabindex: '0', 'aria-controls': id,
        });
        marker.replaceWith(wrap);
        invoker.append(marker);
        wrap.append(invoker);
        const body = el('div', 'disclaimer-body', { popover: '', id });
        const close = el('button', 'disclaimer-close', {
          type: 'button', popovertarget: id, popovertargetaction: 'hide', 'aria-label': 'close',
        });
        body.append(close, queue.shift());
        store.append(body);
        const toggle = (e) => {
          if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          if (body.togglePopover) body.togglePopover();
        };
        invoker.addEventListener('click', toggle);
        invoker.addEventListener('keydown', toggle);
        node = rest;
        at = node.data.indexOf('[*]');
      }
    });
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container > .tile-inner')) return; // EW9
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const contentCell = cells.find((c) => c !== mediaCell);
  const mediaLeft = Boolean(mediaCell && contentCell && cells.indexOf(mediaCell) === 0);
  block.classList.add(mediaLeft ? 'media-left' : 'media-right');

  const inner = el('div', 'tile-inner');
  const media = el('div', 'tile-media');
  if (mediaCell) {
    const pictures = [...mediaCell.querySelectorAll('img')].map((i) => i.closest('picture') || i);
    pictures.forEach((pic, i) => {
      let cls = 'media-all';
      if (pictures.length > 1) cls = i === 0 ? 'media-desktop' : 'media-mobile';
      const holder = el('div', cls);
      holder.append(pic.closest('p') || pic);
      media.append(holder);
    });
  }

  const content = el('div', 'tile-content');
  const column = el('div', 'tile-column');
  const eyebrow = el('div', 'tile-eyebrow');
  const title = el('div', 'tile-title');
  const text = el('div', 'tile-text');
  const ctas = el('div', 'tile-ctas');
  const store = el('div', 'disclaimer-store');
  const disclaimers = [];
  let markers = 0;
  let textMarkers = 0;
  const nodes = contentCell ? [...contentCell.children] : [];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  nodes.forEach((node) => {
    const raw = node.textContent;
    if (isCta(node)) {
      styleCta(node.querySelector('a'));
      const holder = el('div', 'cta');
      holder.append(node);
      ctas.append(holder);
    } else if (node.tagName === 'P' && /^\s*\*/.test(raw) && markers > disclaimers.length) {
      disclaimers.push(node);
    } else {
      const count = (raw.match(/\[\*\]/g) || []).length;
      markers += count;
      if (node === heading) title.append(node);
      else if (heading && nodes.indexOf(node) < nodes.indexOf(heading)) eyebrow.append(node);
      else {
        textMarkers += count;
        text.append(node);
      }
    }
  });
  // a disclaimer marker in the body text: the source's tighter parts tile
  if (textMarkers) block.classList.add('tight');
  linkDisclaimers([eyebrow, text], disclaimers, store);
  [eyebrow, title, text, ctas].forEach((slot) => {
    if (slot.children.length) column.append(slot);
  });
  if (store.children.length) column.append(store);
  content.append(column);
  if (mediaLeft) inner.append(media, content);
  else inner.append(content, media);
  const container = el('div', 'container');
  container.append(inner);
  block.replaceChildren(container);
}
