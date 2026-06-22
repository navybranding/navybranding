/* ─────────────────────────────────────────────────
   1. LENIS SMOOTH SCROLL
───────────────────────────────────────────────── */
const lenis = new Lenis({
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ─────────────────────────────────────────────────
   2. INTERSECTION OBSERVER — data-animate
───────────────────────────────────────────────── */
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
);

animateEls.forEach((el) => observer.observe(el));

/* ─────────────────────────────────────────────────
   3. ANIMATED COUNTERS
───────────────────────────────────────────────── */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterEls.forEach((el) => counterObserver.observe(el));

/* ─────────────────────────────────────────────────
   4. MARQUEE — duplicate track for seamless loop
───────────────────────────────────────────────── */
const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack) {
  const clone = marqueeTrack.cloneNode(true);
  marqueeTrack.parentElement.appendChild(clone);
}

/* ─────────────────────────────────────────────────
   5. SUCCESS STORIES CAROUSEL
───────────────────────────────────────────────── */
const storiesTrack = document.getElementById('storiesTrack');
const storiesCounter = document.getElementById('storiesCounter');

if (storiesTrack && storiesCounter) {
  const cards = storiesTrack.querySelectorAll('.story-card');
  const total = cards.length;

  function updateStoriesCounter() {
    const scrollLeft = storiesTrack.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 20; // gap
    const idx = Math.round(scrollLeft / cardWidth);
    const current = Math.min(idx + 1, total);
    storiesCounter.textContent = `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }

  storiesTrack.addEventListener('scroll', updateStoriesCounter, { passive: true });

  // Drag to scroll
  let isDown = false;
  let startX, scrollLeftStart;

  storiesTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    storiesTrack.style.cursor = 'grabbing';
    startX = e.pageX - storiesTrack.offsetLeft;
    scrollLeftStart = storiesTrack.scrollLeft;
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    storiesTrack.style.cursor = 'grab';
  });

  storiesTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - storiesTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    storiesTrack.scrollLeft = scrollLeftStart - walk;
  });

  // Video hover play
  cards.forEach((card) => {
    const video = card.querySelector('video');
    if (video) {
      card.addEventListener('mouseenter', () => video.play());
      card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    }
  });
}

/* ─────────────────────────────────────────────────
   6. TESTIMONIALS CAROUSEL
───────────────────────────────────────────────── */
const slides = document.querySelectorAll('.testimonials__slide');
const testimPrev = document.getElementById('testimPrev');
const testimNext = document.getElementById('testimNext');
const testimCounter = document.getElementById('testimCounter');
let currentSlide = 0;
let autoplayTimer;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('is-active');
  currentSlide = (idx + slides.length) % slides.length;
  slides[currentSlide].classList.add('is-active');
  if (testimCounter) {
    testimCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

if (slides.length > 0) {
  if (testimPrev) testimPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  if (testimNext) testimNext.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });
  resetAutoplay();
}

/* ─────────────────────────────────────────────────
   7. FAQ ACCORDION
───────────────────────────────────────────────── */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-item__trigger');
  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    // Close all
    faqItems.forEach((i) => i.classList.remove('is-open'));
    // Open this one if it was closed
    if (!isOpen) item.classList.add('is-open');
  });
});

/* ─────────────────────────────────────────────────
   8. SERVICES HOVER
───────────────────────────────────────────────── */
const serviceItems = document.querySelectorAll('.service-item');
const servicePreviews = document.querySelectorAll('.service-preview');

serviceItems.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    const idx = item.dataset.service;
    serviceItems.forEach((i) => i.classList.remove('is-active'));
    servicePreviews.forEach((p) => p.classList.remove('is-active'));
    item.classList.add('is-active');
    const preview = document.querySelector(`.service-preview[data-preview="${idx}"]`);
    if (preview) preview.classList.add('is-active');
  });
});

/* ─────────────────────────────────────────────────
   9. ABOUT MODAL
───────────────────────────────────────────────── */
const aboutModal = document.getElementById('aboutModal');
const aboutClose = document.getElementById('aboutClose');
const aboutTrigger = document.getElementById('aboutTrigger');
const aboutLink = document.getElementById('aboutLink');
const aboutLinkFooter = document.getElementById('aboutLinkFooter');

function openModal() {
  aboutModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lenis.stop();
}

function closeModal() {
  aboutModal.classList.remove('is-open');
  document.body.style.overflow = '';
  lenis.start();
}

[aboutTrigger, aboutLink, aboutLinkFooter].forEach((el) => {
  if (el) el.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
});

if (aboutClose) aboutClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aboutModal.classList.contains('is-open')) closeModal();
});

/* ─────────────────────────────────────────────────
   10. REAL-TIME CLOCK — Hanoi UTC+7
───────────────────────────────────────────────── */
const clockTime = document.getElementById('clockTime');
const clockDate = document.getElementById('clockDate');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function updateClock() {
  const now = new Date();
  // Hanoi is UTC+7, no DST
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const hanoi = new Date(utc + 7 * 3600000);

  const hh = String(hanoi.getHours()).padStart(2, '0');
  const mm = String(hanoi.getMinutes()).padStart(2, '0');
  const ss = String(hanoi.getSeconds()).padStart(2, '0');
  const day = DAYS[hanoi.getDay()];
  const month = MONTHS[hanoi.getMonth()];
  const date = hanoi.getDate();
  const year = hanoi.getFullYear();

  if (clockTime) clockTime.textContent = `${hh}:${mm}:${ss} (GMT +07)`;
  if (clockDate) clockDate.textContent = `${day}, ${month} ${date}, ${year}`;
}

updateClock();
setInterval(updateClock, 1000);

/* ─────────────────────────────────────────────────
   11. HEADER SCROLL BEHAVIOR
───────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

lenis.on('scroll', ({ scroll }) => {
  if (navbar) {
    if (scroll > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

/* ─────────────────────────────────────────────────
   12. CUSTOM CURSOR
───────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
  }
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverEls = document.querySelectorAll('a, button, .service-item, .faq-item__trigger');
hoverEls.forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─────────────────────────────────────────────────
   13. HERO ENTRY ANIMATION — wordmark scale
───────────────────────────────────────────────── */
const heroWordmark = document.querySelector('.hero__wordmark');
if (heroWordmark) {
  heroWordmark.style.transform = 'scale(1.05)';
  heroWordmark.style.transition = 'transform 1.4s cubic-bezier(0.16,1,0.35,1) 0.1s';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroWordmark.style.transform = 'scale(1)';
    });
  });
}

/* ─────────────────────────────────────────────────
   14. BACK TO TOP
───────────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.4 });
  });
}
