/**
 * Main — Loader, Scroll Animations, Navigation, Parallax
 */
(function () {
    // --- Loader ---
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Start reveal animations after loader hides
            setTimeout(initRevealAnimations, 300);
        }, 2200);
    });

    // --- Navbar scroll behavior ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }, { passive: true });

    // --- Mobile menu ---
    const menuBtn = document.getElementById('nav-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Reveal animations with Intersection Observer ---
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-text');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el, index) => {
            // Add stagger delay to child spans
            const span = el.querySelector('span');
            if (span) {
                span.style.transitionDelay = `${index * 0.05}s`;
            }

            // Elements in hero should reveal immediately
            if (el.closest('.hero')) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, 100 + index * 100);
            } else {
                observer.observe(el);
            }
        });
    }

    // --- Parallax on hero ---
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        if (!heroContent) return;
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - progress * 1.2;
        }
    }, { passive: true });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--text-primary)';
                } else {
                    link.style.color = '';
                }
            }
        });
    }, { passive: true });
})();
