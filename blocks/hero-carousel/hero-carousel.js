/**
 * Hero carousel — the prototype's section.hero-carousel (source .home-carousel Splide).
 * Reconstructive over the repeat group (one row = one slide); each slide is template-slotted:
 * authored nodes are MOVED into empty slot containers by role (EW1–EW10), never rebuilt.
 *
 * Row cells: 1 media — a desktop image then a mobile image, or a paragraph linking an mp4;
 * 2 caption, classified by content: CTA paragraphs (a lone link), disclaimer bodies (a
 * paragraph starting with "*" that answers a "[*]" marker), the title (the heading, else the
 * paragraph before the text), an eyebrow (paragraph before the title), the validity line
 * ("Offer valid …") and the text.
 *
 * Behaviour lifted from the source (splide-carousel.js): loop autoplay from slide 1, 10 s
 * interval, 2 s slide speed, no pause on hover, reduced motion pauses; the video plays muted
 * in a loop while its slide is active.
 *
 * @ew-exempt <a> video source link (media cell) — the mp4 path becomes the <video> source;
 * the authored paragraph stays in the DOM, visually hidden
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

/** canon variant classes on the authored CTA anchor (foundation contract #25) */
function styleCta(a) {
  if (a.classList.contains('button')) {
    const primary = a.classList.contains('primary') || a.classList.contains('accent');
    a.classList.add(primary ? 'btn-primary' : 'btn-secondary');
    if (a.classList.contains('accent')) a.classList.add('btn-ext-up');
    else if (isExternal(a)) a.classList.add('btn-ext');
  } else {
    a.classList.add('btn', 'btn-ghost-white');
  }
}

/**
 * Split every "[*]" marker of the hosts into an invoker and pair it, in order, with the
 * disclaimer paragraphs (moved into a native popover kept in `store`).
 */
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
        const id = `hero-disclaimer-${disclaimerSeq}`;
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

function buildMedia(cell, slide) {
  const media = el('div', 'hero-slide-media');
  const videoLink = [...cell.querySelectorAll('a')].find((a) => /\.mp4(\?|$)/i.test(a.href));
  if (videoLink) {
    const video = el('video', 'hero-slide-video', {
      title: 'Home banner', preload: 'metadata', playsinline: '',
    });
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    const source = el('source', '', { src: videoLink.getAttribute('href'), type: 'video/mp4' });
    video.append(source);
    const hidden = el('div', 'hero-slide-source');
    hidden.append(videoLink.closest('p') || videoLink);
    media.append(video, hidden);
    slide.classList.add('has-video');
    return media;
  }
  const pictures = [...cell.querySelectorAll('img')].map((i) => i.closest('picture') || i);
  pictures.forEach((pic, i) => {
    const holder = el('div', i === 0 && pictures.length > 1 ? 'media-desktop' : 'media-mobile');
    if (pictures.length === 1) holder.className = 'media-all';
    const imgs = pic.tagName === 'IMG' ? [pic] : [...pic.querySelectorAll('img')];
    imgs.forEach((img) => { img.loading = 'eager'; });
    holder.append(pic.closest('p') || pic);
    media.append(holder);
  });
  return media;
}

function buildCaption(cell, slide) {
  const nodes = [...cell.children];
  const ctas = [];
  const disclaimers = [];
  const content = [];
  let markers = 0;
  nodes.forEach((node) => {
    const text = node.textContent;
    if (isCta(node)) ctas.push(node);
    else if (node.tagName === 'P' && /^\s*\*/.test(text) && markers > disclaimers.length) {
      disclaimers.push(node);
    } else {
      markers += (text.match(/\[\*\]/g) || []).length;
      content.push(node);
    }
  });

  const heading = content.find((n) => /^H[1-6]$/.test(n.tagName));
  const validity = content.find((n) => n !== heading && /^\s*Offer valid/i.test(n.textContent));
  const plain = content.filter((n) => n !== heading && n !== validity);
  let eyebrow = null;
  let title = heading;
  let text = null;
  if (heading) {
    eyebrow = plain.find((n) => nodes.indexOf(n) < nodes.indexOf(heading)) || null;
    text = plain.find((n) => n !== eyebrow) || null;
  } else if (plain.length >= 3) {
    [eyebrow, title, text] = plain;
  } else {
    [title, text] = plain;
  }
  const extra = plain.filter((n) => ![eyebrow, title, text].includes(n));

  const caption = el('div', 'hero-caption');
  const compact = Boolean(validity);
  if (compact) caption.classList.add('compact');
  if (eyebrow) {
    caption.classList.add('lead');
    const slot = el('div', 'hero-caption-eyebrow');
    slot.append(eyebrow);
    caption.append(slot);
  } else if (compact) {
    caption.append(el('div', 'hero-caption-eyebrow is-empty'));
  }
  if (title) {
    const slot = el('div', 'hero-caption-title');
    slot.append(title);
    caption.append(slot);
  }
  if (text) {
    const slot = el('div', 'hero-caption-text');
    slot.append(text, ...extra);
    caption.append(slot);
  }
  if (validity) {
    const slot = el('div', 'hero-caption-validity');
    slot.append(validity);
    caption.append(slot);
  }
  if (ctas.length) {
    const slot = el('div', 'hero-caption-ctas');
    ctas.forEach((p) => {
      const a = p.querySelector('a');
      styleCta(a);
      const holder = el('div', 'cta');
      holder.append(p);
      slot.append(holder);
    });
    caption.append(slot);
  }
  if (disclaimers.length) {
    const store = el('div', 'disclaimer-store');
    caption.append(store);
    linkDisclaimers([text, eyebrow].filter(Boolean), disclaimers, store);
    slide.classList.add('nudge');
    caption.classList.add(heading ? 'text-regular' : 'text-wide');
  } else if (compact) {
    caption.classList.add('text-tight');
  }
  return caption;
}

function startCarousel(block, track, slides, dots) {
  let active = 0;
  const render = (i) => {
    const n = slides.length;
    dots.forEach((d, j) => {
      d.setAttribute('aria-selected', String(i === j));
      d.classList.toggle('is-active', i === j);
    });
    slides.forEach((s, j) => {
      s.classList.toggle('is-active', j === i);
      s.classList.toggle('is-visible', j === i);
      s.classList.toggle('is-prev', j === (i + n - 1) % n);
      s.classList.toggle('is-next', j === (i + 1) % n);
      const v = s.querySelector('video');
      if (v) {
        if (i === j) v.play().catch(() => {});
        else v.pause();
      }
    });
  };
  const go = (i) => {
    const n = slides.length;
    if (i === 0 && active === n - 1 && n > 1) {
      // loop wrap: slide 1 steps in from the right like Splide's clone, then snaps home
      slides[0].style.order = '1';
      track.classList.add('is-jumping');
      track.style.setProperty('--active', n - 2);
      track.getBoundingClientRect();
      track.classList.remove('is-jumping');
      track.style.setProperty('--active', n - 1);
      const reset = (e) => {
        if (e.target !== track) return;
        track.removeEventListener('transitionend', reset);
        track.classList.add('is-jumping');
        slides[0].style.order = '';
        track.style.setProperty('--active', 0);
        track.getBoundingClientRect();
        track.classList.remove('is-jumping');
      };
      track.addEventListener('transitionend', reset);
    } else {
      track.style.setProperty('--active', i);
    }
    active = i;
    render(i);
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const restart = () => {
    clearTimeout(timer);
    if (reduce.matches || slides.length < 2) return;
    timer = setTimeout(() => {
      if (!block.isConnected) return;
      go((active + 1) % slides.length);
      restart();
    }, 10000);
  };
  dots.forEach((d, i) => d.addEventListener('click', () => {
    go(i);
    restart();
  }));
  render(active);
  restart();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-carousel-viewport')) return; // EW9
  const rows = [...block.children];
  const viewport = el('div', 'hero-carousel-viewport');
  const track = el('ul', 'hero-carousel-track');
  track.style.setProperty('--active', 0);
  const slides = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const slide = el('li', 'hero-slide', { 'aria-roledescription': 'slide' });
    const inner = el('div', 'hero-slide-inner');
    const mediaCell = cells.find((c) => c.querySelector('picture, img, a[href*=".mp4"]')) || null;
    const captionCell = cells.find((c) => c !== mediaCell) || null;
    if (mediaCell) inner.append(buildMedia(mediaCell, slide));
    if (captionCell) inner.append(buildCaption(captionCell, slide));
    slide.append(inner);
    track.append(slide);
    slides.push(slide);
  });
  slides.forEach((s, i) => {
    s.id = `hero-carousel-slide${String(i + 1).padStart(2, '0')}`;
    s.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
  });
  viewport.append(track);
  const dotsBar = el('div', 'hero-carousel-dots', {
    role: 'tablist', 'aria-label': 'Select a slide to show',
  });
  const dots = slides.map((s, i) => {
    const dot = el('button', 'hero-carousel-dot', {
      type: 'button',
      role: 'tab',
      'aria-selected': String(i === 0),
      'aria-controls': s.id,
      'aria-label': `Go to slide ${i + 1}`,
    });
    dotsBar.append(dot);
    return dot;
  });
  block.replaceChildren(viewport, dotsBar);
  startCarousel(block, track, slides, dots);
}
