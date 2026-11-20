/**
 * Offer dialogs — the prototype's dialog.offer-dialog set (source .modal.updated-modal
 * offer-detail modals). One row per dialog: cell 1 the dialog id that "#<id>" links on the
 * page open, cell 2 the dialog content (icon image, heading, paragraphs / list, and a CTA
 * paragraph that becomes the footer CTA). Nodes are MOVED (EW1–EW10); styling is the
 * foundation's .offer-dialog set (styles/styles.css).
 *
 * @ew-exempt <div> dialog id (cell 1) — text-as-metadata, the anchor target "#<id>" links use
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

/** vector art: drop the rasterised webp renditions the pipeline adds to an SVG picture */
function preferSvg(root) {
  root.querySelectorAll('picture').forEach((pic) => {
    const img = pic.querySelector('img');
    if (!img || !/\.svg(\?|$)/.test(img.getAttribute('src') || '')) return;
    pic.querySelectorAll('source:not([type="image/svg+xml"])').forEach((s) => s.remove());
  });
}

function openFromLink(e) {
  const a = e.target.closest('a[href*="#"]');
  if (!a) return;
  const id = decodeURIComponent(a.hash.slice(1));
  if (!id) return;
  const dialog = document.getElementById(id);
  if (!dialog || dialog.tagName !== 'DIALOG' || !dialog.classList.contains('offer-dialog')) return;
  e.preventDefault();
  if (!dialog.open) dialog.showModal();
}

export default function decorate(block) {
  if (block.querySelector(':scope > dialog')) return; // EW9
  const dialogs = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const [keyCell, bodyCell] = cells;
    const id = keyCell.textContent.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const dialog = el('dialog', 'offer-dialog', { id });
    const closeRow = el('form', 'offer-dialog-close-row', { method: 'dialog' });
    closeRow.append(el('button', 'offer-dialog-close', { 'aria-label': 'close' }));
    const key = el('div', 'offer-dialog-key');
    key.append(...keyCell.childNodes);
    const body = el('section', 'offer-dialog-body');
    const cta = el('div', 'offer-dialog-cta');
    [...bodyCell.children].forEach((node) => {
      if (isCta(node) && node.querySelector('a.button')) {
        node.querySelector('a').classList.add('btn-primary');
        cta.append(node);
      } else if (node.querySelector('picture, img')) {
        const icon = el('div', 'offer-dialog-icon');
        icon.append(node);
        body.append(icon);
      } else if (/^H[1-6]$/.test(node.tagName)) {
        node.id = node.id || `${id}-title`;
        dialog.setAttribute('aria-labelledby', node.id);
        const title = el('div', 'offer-dialog-title');
        title.append(node);
        body.append(title);
      } else body.append(node);
    });
    dialog.append(key, closeRow, body);
    if (cta.children.length) dialog.append(cta);
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
    preferSvg(dialog);
    dialogs.push(dialog);
  });
  block.replaceChildren(...dialogs);
  if (!document.body.dataset.offerDialogs) {
    document.body.dataset.offerDialogs = 'bound';
    document.addEventListener('click', openFromLink);
  }
}
