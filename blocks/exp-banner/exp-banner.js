/**
 * Experience banner — the prototype's section.exp-banner (source section.exp-banner).
 * Template-slotted: a desktop image then a mobile image, and a caption of heading, text and a
 * CTA paragraph; authored nodes are MOVED into the slots by role (EW1–EW10).
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
  if (block.querySelector(':scope > .exp-banner-frame')) return; // EW9
  const frame = el('div', 'exp-banner-frame');
  const media = el('div', 'exp-banner-media');
  const caption = el('div', 'hero-caption');
  const title = el('div', 'hero-caption-title');
  const text = el('div', 'hero-caption-text');
  const ctas = el('div', 'hero-caption-ctas');
  const pictures = [...block.querySelectorAll('img')].map((i) => i.closest('picture') || i);
  pictures.forEach((pic, i) => {
    let cls = 'media-all';
    if (pictures.length > 1) cls = i === 0 ? 'media-desktop' : 'media-mobile';
    const holder = el('div', cls);
    holder.append(pic.closest('p') || pic);
    media.append(holder);
  });
  [...block.querySelectorAll(':scope > div > div > *')].forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) title.append(node);
    else if (isCta(node)) {
      const a = node.querySelector('a');
      if (a.classList.contains('button')) a.classList.add('btn-primary');
      ctas.append(node);
    } else if (!node.querySelector('picture, img')) text.append(node);
  });
  [title, text, ctas].forEach((slot) => {
    if (slot.children.length) caption.append(slot);
  });
  frame.append(media, caption);
  block.replaceChildren(frame);
}
