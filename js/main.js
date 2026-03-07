/*=============== LOADING SCREEN ===============*/
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;

  setTimeout(() => {
    loadingScreen.classList.add('hide');
  }, 650);
});

/*=============== NAVIGATION (Mobile menu + overlay + body lock) ===============*/
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function openMenu() {
  if (!navMenu) return;
  navMenu.classList.add('show-menu');
  if (navOverlay) navOverlay.classList.add('show');
  document.body.classList.add('no-scroll');
}

function closeMenu() {
  if (!navMenu) return;
  navMenu.classList.remove('show-menu');
  if (navOverlay) navOverlay.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

// Show menu
if (navToggle) {
  navToggle.addEventListener('click', openMenu);
}

// Hide menu
if (navClose) {
  navClose.addEventListener('click', closeMenu);
}

// Click overlay to close
if (navOverlay) {
  navOverlay.addEventListener('click', closeMenu);
}

// Hide menu when clicking nav link
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close with ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/*=============== ACTIVE LINK ON SCROLL ===============*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);

    if (!link) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/*=============== SCROLL HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  if (window.scrollY >= 50) header.classList.add('scroll-header');
  else header.classList.remove('scroll-header');
}

/*=============== SMOOTH SCROLL ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = targetElement.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

/*=============== SCROLL TO TOP ===============*/
const scrollTop = document.getElementById('scrollTop');

function toggleScrollTop() {
  if (!scrollTop) return;

  if (window.scrollY >= 500) scrollTop.classList.add('show');
  else scrollTop.classList.remove('show');
}

if (scrollTop) {
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/*=============== STATS COUNTER ===============*/
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10);
  if (Number.isNaN(target)) return;

  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);

    element.textContent = value;

    if (progress < 1) requestAnimationFrame(tick);
    else element.textContent = `${target}+`;
  }

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const counters = entry.target.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
      if (counter.classList.contains('counted')) return;
      counter.classList.add('counted');
      animateCounter(counter);
    });

    obs.unobserve(entry.target);
  });
}, { threshold: 0.45 });

const aboutSection = document.querySelector('.about');
if (aboutSection) statsObserver.observe(aboutSection);

/*=============== GALLERY FILTERS ===============*/
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');

      if (filterValue === 'all' || category === filterValue) {
        item.classList.remove('hide');
        item.classList.add('aos-animate');
      } else {
        item.classList.add('hide');
      }
    });
  });
});

/*=============== LIGHTBOX ===============*/
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryButtons = document.querySelectorAll('.gallery-btn');

const galleryImages = Array.from(galleryItems).map(item => {
  const img = item.querySelector('img');
  return img ? { src: img.src, alt: img.alt } : null;
}).filter(Boolean);

let currentImageIndex = 0;

function showLightbox(index) {
  if (!lightbox || !lightboxImage) return;

  currentImageIndex = index;
  const data = galleryImages[currentImageIndex];
  if (!data) return;

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  lightboxImage.src = data.src;
  lightboxImage.alt = data.alt;

  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

galleryButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const index = parseInt(button.getAttribute('data-index'), 10);
    if (Number.isNaN(index)) return;
    showLightbox(index);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightbox(currentImageIndex);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showLightbox(currentImageIndex);
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
  else if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
});

/*=============== SIMPLE AOS (Animate On Scroll) ===============*/
function initAOS() {
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
      setTimeout(() => entry.target.classList.add('aos-animate'), delay);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  aosElements.forEach(element => aosObserver.observe(element));
}

document.addEventListener('DOMContentLoaded', initAOS);

/*=============== PERFORMANCE OPTIMIZATION ===============*/
function debounce(func, wait = 40) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
}

const onScroll = debounce(() => {
  scrollActive();
  scrollHeader();
  toggleScrollTop();
}, 40);

window.addEventListener('scroll', onScroll, { passive: true });

/*=============== REDUCE MOTION FOR ACCESSIBILITY ===============*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}

/*=============== TOUCH GESTURES FOR MOBILE (LIGHTBOX) ===============*/
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  if (!lightbox || !lightbox.classList.contains('active')) return;

  if (touchEndX < touchStartX - 50 && lightboxNext) {
    lightboxNext.click();
  }
  if (touchEndX > touchStartX + 50 && lightboxPrev) {
    lightboxPrev.click();
  }
}

if (lightbox) {
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });
}
