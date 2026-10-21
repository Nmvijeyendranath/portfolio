import { initialize3DScenes } from './scenes.js';
import { initDemos } from './demos.js';

const reducedMotion = false;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;
const enhancedMotion = Boolean(gsap && ScrollTrigger && Lenis);

/* ── build interactive project worlds first (DOM must exist) ── */
initDemos();

/* ══════════ BOOT SEQUENCE ══════════ */
const boot = document.getElementById('boot');
const bootFill = document.getElementById('boot-fill');
const bootCount = document.getElementById('boot-count');
const bootStatus = document.getElementById('boot-status');
const BOOT_STAGES = ['INITIALIZING FIELD', 'LOADING TYPEFACES', 'CALIBRATING ORBITS', 'WARMING MATERIALS', 'SIGNAL LOCKED'];

function trackRealProgress() {
  const tasks = [];
  if (document.fonts?.ready) tasks.push(document.fonts.ready.catch(() => {}));
  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) {
      tasks.push(new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }));
    }
  });
  return Promise.race([Promise.all(tasks), new Promise((r) => setTimeout(r, 3800))]);
}

function finishBoot() {
  document.body.removeAttribute('data-loading');
  if (!gsap || reducedMotion) {
    boot.style.display = 'none';
    document.querySelectorAll('[data-split] .w>i').forEach((el) => { el.style.transform = 'none'; });
    startHeroIntro(true);
    return;
  }
  gsap.timeline()
    .to('.boot-letter', { y: '-118%', rotate: -5, opacity: 0, duration: 0.55, stagger: 0.035, ease: 'power3.in' })
    .to('.boot-core, .boot-hint', { opacity: 0, duration: 0.3 }, '<0.15')
    .to(boot, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
    .add(() => { boot.style.display = 'none'; boot.classList.add('is-done'); })
    .add(startHeroIntro, '-=0.45');
}

function runBoot() {
  const letters = boot.querySelectorAll('.boot-letter');
  if (!gsap || reducedMotion) {
    bootFill.style.width = '100%';
    bootCount.textContent = '100';
    trackRealProgress().then(finishBoot);
    return;
  }
  gsap.set(boot, { clipPath: 'inset(0 0 0% 0)' });
  gsap.to(letters, { y: 0, rotate: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: 'power4.out', delay: 0.15 });
  const counter = { value: 0 };
  const progressTween = gsap.to(counter, {
    value: 96, duration: 3.4, ease: 'power2.out',
    onUpdate: () => {
      const v = Math.round(counter.value);
      bootCount.textContent = String(v).padStart(3, '0');
      bootFill.style.width = `${v}%`;
      bootStatus.textContent = BOOT_STAGES[Math.min(BOOT_STAGES.length - 1, Math.floor(v / 22))];
    }
  });
  trackRealProgress().then(() => {
    progressTween.kill();
    gsap.to(counter, {
      value: 100, duration: 0.45, ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.value);
        bootCount.textContent = String(v).padStart(3, '0');
        bootFill.style.width = `${v}%`;
      },
      onComplete: () => { bootStatus.textContent = BOOT_STAGES[4]; finishBoot(); }
    });
  });
}

/* ══════════ KINETIC TYPE SPLITTING ══════════ */
function splitWords(element) {
  const words = element.textContent.trim().split(/\s+/);
  element.textContent = '';
  for (const word of words) {
    const wrap = document.createElement('span');
    wrap.className = 'w';
    const inner = document.createElement('i');
    inner.textContent = word;
    wrap.append(inner);
    element.append(wrap, ' ');
  }
}
document.querySelectorAll('[data-split]').forEach(splitWords);

function startHeroIntro(instant = false) {
  const targets = ['.hero-title .w>i', '.eyebrow', '.hero-intro-block', '.hero-portrait', '.circle-link', '.hero-footer', '.hero-topline'];
  if (instant || !gsap) {
    targets.forEach((sel) => document.querySelectorAll(sel).forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; }));
    return;
  }
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .to('.hero-topline', { opacity: 1, y: 0, duration: 0.7 }, 0)
    .to('.eyebrow', { opacity: 1, duration: 0.6 }, 0.1)
    .fromTo('.eyebrow-line', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0.1)
    .to('.hero-title .w>i', { y: 0, duration: 1.15, stagger: 0.07 }, 0.15)
    .fromTo('.hero-intro-block', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8 }, 0.55)
    .fromTo('.hero-portrait', { opacity: 0, y: 34, rotate: 5 }, { opacity: 1, y: 0, rotate: 0, duration: 1 }, 0.7)
    .fromTo('.circle-link', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, 0.85)
    .fromTo('.hero-footer', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.95);
}
if (gsap && !reducedMotion) {
  gsap.set(['.hero-topline', '.eyebrow'], { opacity: 0, y: 12 });
}

/* ══════════ SMOOTH SCROLL + REVEALS ══════════ */
function setUpLenis() {
  if (!enhancedMotion) return null;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const lenis = new Lenis({ autoRaf: false, lerp: 0.085, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.86, anchors: { offset: -88 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('pagehide', () => lenis.destroy(), { once: true });
  return lenis;
}

function setUpReveals() {
  const revealItems = document.querySelectorAll('.reveal, .lab');
  if (reducedMotion || !enhancedMotion) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
    if ('IntersectionObserver' in window && !reducedMotion) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
      revealItems.forEach((el) => observer.observe(el));
    }
    return;
  }
  revealItems.forEach((element, index) => {
    gsap.fromTo(element,
      { autoAlpha: 0, y: 38, filter: 'blur(5px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', delay: (index % 3) * 0.06, scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
  // feature title kinetic reveal
  gsap.to('.feature-title .w>i', {
    y: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out',
    scrollTrigger: { trigger: '.feature-title', start: 'top 85%', once: true }
  });
}

/* manifesto word-by-word illumination */
function setUpManifesto() {
  const copy = document.querySelector('[data-words]');
  if (!copy) return;
  const words = [];
  copy.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((piece) => {
        if (!piece.trim()) { frag.append(document.createTextNode(piece)); return; }
        const span = document.createElement('span');
        span.className = 'w dim';
        span.textContent = piece;
        frag.append(span);
        words.push(span);
      });
      copy.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const span = document.createElement('span');
      span.className = 'w dim';
      span.append(node.cloneNode(true));
      copy.replaceChild(span, node);
      words.push(span);
    }
  });
  if (reducedMotion || !enhancedMotion) { words.forEach((w) => { w.classList.remove('dim'); w.classList.add('lit'); }); return; }
  ScrollTrigger.create({
    trigger: copy, start: 'top 78%', end: 'bottom 45%', scrub: 0.4,
    onUpdate: (self) => {
      const litCount = Math.floor(self.progress * words.length);
      words.forEach((w, i) => { w.classList.toggle('lit', i <= litCount); w.classList.toggle('dim', i > litCount); });
    }
  });
}

/* ══════════ MARQUEE ══════════ */
function setUpMarquee() {
  if (!enhancedMotion) return;
  const track = document.querySelector('[data-marquee]');
  if (!track) return;
  const tween = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (self) => { tween.timeScale(1 + Math.abs(self.getVelocity()) / 900); }
  });
}


function setUpShowcaseScrollMotion() {
  if (!enhancedMotion) return;
  gsap.fromTo('.skills-section .data-visual', { rotateX: 4, rotateY: -3, scale: 0.975, transformPerspective: 1100 }, {
    rotateX: 0, rotateY: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.skills-section .data-visual', start: 'top 88%', end: 'bottom 30%', scrub: 0.7 }
  });
  gsap.to('.recognition-orbit', {
    rotateY: 360, rotateZ: 20, ease: 'none',
    scrollTrigger: { trigger: '.recognition-section', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
  });
  gsap.fromTo('.connect-section .exact-profiles-grid', { y: 26, rotateX: 2, transformPerspective: 1200 }, {
    y: 0, rotateX: 0, ease: 'none',
    scrollTrigger: { trigger: '.connect-section .exact-profiles-grid', start: 'top 92%', end: 'top 58%', scrub: 0.7 }
  });
}

function setUpEmailCopy() {
  const btn = document.getElementById('copy-email-btn');
  const text = document.getElementById('copy-email-text');
  if (!btn || !text) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('vijeyendranath@gmail.com');
      text.textContent = 'COPIED TO CLIPBOARD! ✓';
      btn.style.background = 'var(--ember)';
      btn.style.color = 'var(--dark-base)';
      setTimeout(() => {
        text.textContent = 'COPY EMAIL 📋';
        btn.style.background = '';
        btn.style.color = '';
      }, 2500);
    } catch {
      window.location.href = 'mailto:vijeyendranath@gmail.com';
    }
  });
}

/* ══════════ HEADER / CURSOR / TILT ══════════ */
function setUpHeader() {
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('primary-nav');
  if (!menuButton || !navigation) return;

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !expanded);
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-hidden', y > 140 && y > lastY && !navigation.classList.contains('is-open'));
    lastY = y;
  }, { passive: true });
}

function setUpCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || reducedMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  let x = -100, y = -100, tx = -100, ty = -100;
  window.addEventListener('pointermove', (event) => { tx = event.clientX; ty = event.clientY; }, { passive: true });
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.querySelectorAll('a, button, input, .lab-canvas').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });
  (function follow() {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(follow);
  })();
}

function setUpTilt() {
  if (reducedMotion) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const b = card.getBoundingClientRect();
      const px = (event.clientX - b.left) / b.width - 0.5;
      const py = (event.clientY - b.top) / b.height - 0.5;
      card.style.transform = `perspective(1100px) rotateX(${-py * 5}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; }, { passive: true });
  });
}

/* ══════════ CONTACT SIGNAL FIELD ══════════ */
function setUpContactField() {
  const canvas = document.getElementById('contact-canvas');
  const section = document.querySelector('.contact-section');
  if (!canvas || !section) return;
  const ctx = canvas.getContext('2d');
  let width = 1, height = 1, ripples = [], raf = 0, inView = false;
  const resize = () => {
    const b = section.getBoundingClientRect();
    width = Math.max(1, b.width); height = Math.max(1, b.height);
    canvas.width = width; canvas.height = height;
  };
  const draw = () => {
    raf = 0;
    ctx.clearRect(0, 0, width, height);
    ripples = ripples.filter((r) => performance.now() - r.born < 1600);
    for (const r of ripples) {
      const age = (performance.now() - r.born) / 1600;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 12 + age * 210, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(210,167,141,${(1 - age) * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (ripples.length && inView && !document.hidden) raf = requestAnimationFrame(draw);
  };
  const emit = (x, y) => {
    ripples.push({ x, y, born: performance.now() });
    if (ripples.length > 24) ripples.shift();
    if (!raf && inView) raf = requestAnimationFrame(draw);
  };
  if (!reducedMotion) {
    section.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const b = section.getBoundingClientRect();
      if (Math.random() > 0.72) emit(event.clientX - b.left, event.clientY - b.top);
    }, { passive: true });
    section.addEventListener('pointerdown', (event) => {
      const b = section.getBoundingClientRect();
      emit(event.clientX - b.left, event.clientY - b.top);
      window.dispatchEvent(new CustomEvent('ambient-pulse', { detail: { x: event.clientX, y: event.clientY } }));
    }, { passive: true });
    // idle beacon
    setInterval(() => { if (inView && !document.hidden) emit(width * (0.2 + Math.random() * 0.6), height * (0.25 + Math.random() * 0.5)); }, 2600);
  }
  new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; if (inView) resize(); }).observe(section);
  window.addEventListener('resize', resize, { passive: true });
  resize();
}

/* ══════════ PROJECT FILTERS ══════════ */
function setUpProjectFilters() {
  const projectList = document.getElementById('project-list');
  const items = [...projectList.querySelectorAll('.lab')];
  const buttons = [...document.querySelectorAll('.project-filter')];
  const status = document.getElementById('project-filter-status');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const focus = button.dataset.filter;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      const matching = items.filter((item) => focus === 'all' || item.dataset.focus === focus);
      const set = new Set(matching);
      status.textContent = `${matching.length} ${matching.length === 1 ? 'project' : 'projects'} / ${focus === 'all' ? 'all focus areas' : button.textContent.replace(/\d+/g, '').trim().toLowerCase()}`;
      if (!enhancedMotion) { items.forEach((item) => { item.hidden = !set.has(item); }); return; }
      items.forEach((item) => {
        gsap.killTweensOf(item);
        if (set.has(item)) {
          const wasHidden = item.hidden;
          item.hidden = false;
          gsap.fromTo(item, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: wasHidden ? 0.5 : 0.28, ease: 'power3.out', clearProps: 'transform' });
        } else if (!item.hidden) {
          gsap.to(item, { autoAlpha: 0, y: 13, duration: 0.22, ease: 'power2.in', onComplete: () => { item.hidden = true; } });
        }
      });
      window.setTimeout(() => ScrollTrigger.refresh(), 560);
    });
  });
}

/* ══════════ SCROLL PROGRESS ══════════ */
const progress = document.getElementById('scroll-progress');
let progressFrame = 0;
function updatePageProgress() {
  if (progressFrame) return;
  progressFrame = window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    progressFrame = 0;
  });
}
window.addEventListener('scroll', updatePageProgress, { passive: true });

/* ══════════ INIT ══════════ */
const lenis = setUpLenis();
setUpReveals();
setUpShowcaseScrollMotion();
setUpManifesto();
setUpMarquee();
setUpHeader();
setUpCursor();
setUpTilt();
setUpContactField();
setUpEmailCopy();
setUpProjectFilters();
updatePageProgress();
if (lenis && ScrollTrigger) {
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
initialize3DScenes();
runBoot();
