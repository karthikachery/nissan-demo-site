/**
 * Recall strip — the prototype's section.recall-strip (source section.bg-gray-20).
 * Template-slotted: a text paragraph and a CTA paragraph, MOVED into slots (EW1–EW10).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container > .recall-strip-inner')) return; // EW9
  const inner = el('div', 'recall-strip-inner');
  const text = el('div', 'recall-strip-text');
  const cta = el('div', 'recall-strip-cta');
  [...block.querySelectorAll(':scope > div > div > *')].forEach((node) => {
    const a = node.querySelector('a');
    if (a && node.textContent.trim() === a.textContent.trim()) {
      if (a.classList.contains('button')) {
        const primary = a.classList.contains('primary') || a.classList.contains('accent');
        a.classList.add(primary ? 'btn-primary' : 'btn-secondary');
        if (!/epsilonrms\.com$/.test(new URL(a.href, window.location.href).hostname)) {
          a.classList.add('btn-ext');
        }
      }
      cta.append(node);
    } else text.append(node);
  });
  inner.append(text, cta);
  const container = el('div', 'container');
  container.append(inner);
  block.replaceChildren(container);
}
