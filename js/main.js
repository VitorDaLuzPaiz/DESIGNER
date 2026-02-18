/*=============== LOADING SCREEN ===============*/
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hide');
    }, 800);
});

/*=============== NAVIGATION ===============*/
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navLinks = document.querySelectorAll('.nav-link');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Hide menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

/*=============== SCROLL HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

/*=============== SMOOTH SCROLL ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*=============== SCROLL TO TOP ===============*/
const scrollTop = document.getElementById('scrollTop');

function toggleScrollTop() {
    if (this.scrollY >= 500) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
}

window.addEventListener('scroll', toggleScrollTop);

if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/*=============== STATS COUNTER ===============*/
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number[data-count]');
            counters.forEach(counter => {
                if (!counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

/*=============== GALLERY FILTERS ===============*/
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                item.classList.remove('hide');
                // Re-trigger AOS animation
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

// Array to store all gallery images
const galleryImages = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
        src: img.src,
        alt: img.alt
    };
});

let currentImageIndex = 0;

// Open lightbox
galleryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        currentImageIndex = parseInt(button.getAttribute('data-index'));
        showLightbox(currentImageIndex);
    });
});

function showLightbox(index) {
    lightbox.classList.add('active');
    lightboxImage.src = galleryImages[index].src;
    lightboxImage.alt = galleryImages[index].alt;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Previous image
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
});

// Next image
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        lightboxPrev.click();
    } else if (e.key === 'ArrowRight') {
        lightboxNext.click();
    }
});

/*=============== SIMPLE AOS (Animate On Scroll) ===============*/
function initAOS() {
    const aosElements = document.querySelectorAll('[data-aos]');
    
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(element => {
        aosObserver.observe(element);
    });
}

// Initialize AOS on page load
document.addEventListener('DOMContentLoaded', initAOS);

/*=============== LAZY LOADING IMAGES ===============*/
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger load
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => imageObserver.observe(img));
}

/*=============== PERFORMANCE OPTIMIZATION ===============*/
// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(scrollActive));
window.addEventListener('scroll', debounce(scrollHeader));
window.addEventListener('scroll', debounce(toggleScrollTop));

/*=============== PRELOAD CRITICAL IMAGES ===============*/
const criticalImages = [
    'https://sspark.genspark.ai/cfimages?u1=dDRQdmOk7DwwcPC2KdAEZtzWLMRjLR6VwBVv%2FE4UjmKZbnnudscpKGzignWAdkSsPWc2geU7PKB6rJNqrKJZ8yTs5A8NJRsz%2FsQqcmC%2Bgodf4ckJz3OCrhEMEgAb4vuOElntj7ovyB2Ofxy4miL9Wrkf&u2=63daWCdKECfRm9kO&width=2560'
];

criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
});

/*=============== SERVICE WORKER (Optional for PWA) ===============*/
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to register service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

/*=============== REDUCE MOTION FOR ACCESSIBILITY ===============*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

/*=============== TOUCH GESTURES FOR MOBILE ===============*/
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (!lightbox.classList.contains('active')) return;
    
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next image
        lightboxNext.click();
    }
    
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous image
        lightboxPrev.click();
    }
}

lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

/*=============== FORM VALIDATION (if forms are added later) ===============*/
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/*=============== CONSOLE SIGNATURE ===============*/
console.log(
    '%c Portfolio Ana Silva',
    'color: #8B5CF6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%c Design by Ana Silva | Developed with ❤️',
    'color: #EC4899; font-size: 14px;'
);

/*=============== ANIMATED GRADIENT BACKGROUND ===============*/
function createGradientAnimation() {
    const home = document.querySelector('.home');
    if (!home) return;

    let hue = 0;
    
    function updateGradient() {
        hue = (hue + 0.5) % 360;
        // Subtle animated gradient - disabled by default for performance
        // home.style.background = `linear-gradient(135deg, 
        //     hsl(${hue}, 70%, 95%) 0%, 
        //     hsl(${(hue + 60) % 360}, 70%, 90%) 100%)`;
        requestAnimationFrame(updateGradient);
    }
    
    // Uncomment to enable animated gradient
    // updateGradient();
}

// Initialize gradient animation
// createGradientAnimation();

/*=============== PERFORMANCE MONITORING ===============*/
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        if (pageLoadTime > 0) {
            console.log(`%c⚡ Page loaded in ${pageLoadTime}ms`, 'color: #10B981; font-weight: bold;');
        }
    });
}

/*=============== ERROR HANDLING ===============*/
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
    // Could send to error tracking service in production
});

/*=============== NETWORK STATUS ===============*/
window.addEventListener('online', () => {
    console.log('🟢 Back online');
});

window.addEventListener('offline', () => {
    console.log('🔴 Connection lost');
});

/*=============== VISIBILITY CHANGE ===============*/
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or videos when tab is not visible
        console.log('Tab hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Tab visible - resuming animations');
    }
});

/*=============== PRINT STYLES ===============*/
window.addEventListener('beforeprint', () => {
    console.log('Preparing to print...');
});

window.addEventListener('afterprint', () => {
    console.log('Print complete');
});

/*=============== COPY PROTECTION (Optional) ===============*/
// Uncomment to disable right-click on images
// document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('contextmenu', e => e.preventDefault());
// });

/*=============== ANALYTICS (Integration point) ===============*/
function trackEvent(category, action, label) {
    // Integration point for Google Analytics, Plausible, etc.
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
    
    // Example for Google Analytics:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Track gallery item clicks
galleryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const galleryItem = button.closest('.gallery-item');
        const category = galleryItem.getAttribute('data-category');
        trackEvent('Gallery', 'view', category);
    });
});

// Track contact button clicks
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Contact', 'click', link.textContent.trim());
    });
});

/*=============== INITIALIZATION COMPLETE ===============*/
console.log('%c✨ Portfolio initialized successfully!', 'color: #8B5CF6; font-weight: bold;');
