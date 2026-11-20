import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — the prototype's .site-footer, template-slotted: authored /footer nodes are MOVED
 * into slot containers by role (EW1–EW10), never rebuilt.
 *
 * /footer content, classified by content: a paragraph + list whose list holds the other
 * language (language select), a run of paragraphs where a paragraph without a link opens a
 * link column, a paragraph of image links (social), a list of links (legal) and the
 * remaining text paragraph (copyright).
 */

const desktop = window.matchMedia('(width >= 768px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function slot(node, className, attrs) {
  const wrap = el('div', className, attrs);
  if (node) wrap.append(node);
  return wrap;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** vector art: drop the rasterised webp renditions the pipeline adds to an SVG picture */
function preferSvg(root) {
  root.querySelectorAll('picture').forEach((pic) => {
    const img = pic.querySelector('img');
    if (!img || !/\.svg(\?|$)/.test(img.getAttribute('src') || '')) return;
    pic.querySelectorAll('source:not([type="image/svg+xml"])').forEach((s) => s.remove());
  });
}

function activate(node, fn) {
  node.addEventListener('click', fn);
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn(e);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  if (block.querySelector(':scope > .site-footer')) return; // EW9: already decorated
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  preferSvg(fragment);
  const nodes = [...fragment.querySelectorAll('.default-content-wrapper > *')];

  const root = el('div', 'site-footer');
  const inner = el('div', 'site-footer-inner');
  root.append(inner);

  const lang = el('div', 'footer-lang');
  const links = el('div', 'footer-links');
  const cols = el('div', 'footer-links-cols');
  links.append(cols);
  const legal = el('div', 'footer-legal');
  inner.append(lang, links, legal);

  let col = null;
  let body = null;
  let langTrigger = null;
  let langMenu = null;
  let legalSeen = false;

  nodes.forEach((node) => {
    const anchors = node.querySelectorAll('a');
    const hasImgLinks = node.querySelector('a picture, a img');
    if (node.tagName === 'UL' && !legalSeen && langTrigger && !langMenu) {
      langMenu = slot(node, 'lang-select-menu', { id: 'langDropdown' });
      langMenu.hidden = true;
    } else if (node.tagName === 'UL') {
      legalSeen = true;
      legal.append(slot(node, 'footer-legal-list', { role: 'navigation' }));
      legal.lastElementChild.setAttribute('aria-label', 'Legal and privacy links');
    } else if (node.tagName === 'P' && hasImgLinks) {
      links.append(slot(node, 'footer-social'));
    } else if (node.tagName === 'P' && !anchors.length && !langTrigger && !col) {
      langTrigger = slot(node, 'lang-select-trigger', {
        role: 'button', tabindex: '0', 'aria-expanded': 'false', 'aria-controls': 'langDropdown',
      });
    } else if (node.tagName === 'P' && !anchors.length && legalSeen) {
      legal.append(slot(node, 'footer-legal-copy'));
    } else if (node.tagName === 'P' && !anchors.length) {
      const id = `footer-${slug(node.textContent)}`;
      col = el('div', 'footer-links-col');
      const title = slot(node, 'footer-links-title', {
        role: 'button', tabindex: '0', 'aria-expanded': 'false', 'aria-controls': id,
      });
      body = el('div', 'footer-links-body', { id });
      col.append(title, body);
      cols.append(col);
    } else if (body) {
      body.append(slot(node, 'footer-links-item'));
    } else {
      inner.append(node);
    }
  });

  if (langTrigger) {
    const select = el('div', 'lang-select');
    select.append(langTrigger);
    if (langMenu) select.append(langMenu);
    lang.append(select);
    activate(langTrigger, () => {
      if (!langMenu) return;
      const open = langTrigger.getAttribute('aria-expanded') !== 'true';
      langTrigger.setAttribute('aria-expanded', String(open));
      langMenu.hidden = !open;
    });
  }

  cols.querySelectorAll('.footer-links-title').forEach((title) => activate(title, () => {
    if (desktop.matches) return;
    const target = document.getElementById(title.getAttribute('aria-controls'));
    const open = title.getAttribute('aria-expanded') !== 'true';
    title.setAttribute('aria-expanded', String(open));
    target?.classList.toggle('is-open', open);
  }));

  block.replaceChildren(root);
}
