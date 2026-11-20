/**
 * Tire price match band — the prototype's section.tire-price (source .tire-price-container).
 * Template-slotted: an image cell and a content cell (heading, text, CTA paragraphs — a lone
 * link each: the button and the "*Offer Details" link). Nodes are MOVED (EW1–EW10).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isCta(node) {
  if (node.tagName !== 'P') return false;
  const links = node.querySelectorAll('a');
  return links.length === 1 && node.textContent.trim() === links[0].textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container > .tire-price-inner')) return; // EW9
  const inner = el('div', 'tire-price-inner');
  const media = el('div', 'tire-price-media');
  const content = el('div', 'tire-price-content');
  const title = el('div', 'tire-price-title');
  const text = el('div', 'tire-price-text');
  const ctas = el('div', 'tire-price-ctas');
  [...block.querySelectorAll(':scope > div > div > *')].forEach((node) => {
    if (node.querySelector('picture, img') || ['PICTURE', 'IMG'].includes(node.tagName)) media.append(node);
    else if (/^H[1-6]$/.test(node.tagName)) title.append(node);
    else if (isCta(node)) {
      const a = node.querySelector('a');
      if (a.classList.contains('button')) {
        const primary = a.classList.contains('primary') || a.classList.contains('accent');
        a.classList.add(primary ? 'btn-primary' : 'btn-secondary');
      } else a.classList.add('link-btn');
      const holder = el('div', 'cta');
      holder.append(node);
      ctas.append(holder);
    } else text.append(node);
  });
  [title, text, ctas].forEach((slot) => {
    if (slot.children.length) content.append(slot);
  });
  inner.append(media, content);
  const container = el('div', 'container');
  container.append(inner);
  block.replaceChildren(container);
}
