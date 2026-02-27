/**
 * Gallery — Project Grid, Filters, Lightbox with Carousel
 */
(function () {
    const cards = document.querySelectorAll('.project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');

    let currentIndex = -1;

    // --- Staggered entry animation for cards ---
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    cards.forEach(card => cardObserver.observe(card));

    // --- Filters ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (!shouldShow) {
                    card.classList.add('filtering-out');
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.classList.remove('filtering-out');
                    }, 300);
                } else {
                    card.classList.remove('hidden');
                    card.classList.remove('filtering-out');
                    card.classList.remove('visible');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.classList.add('visible');
                        });
                    });
                }
            });
        });
    });

    // --- Get visible (non-hidden) cards ---
    function getVisibleCards() {
        return Array.from(cards).filter(card => !card.classList.contains('hidden'));
    }

    // --- Update lightbox content from a card ---
    function showCard(card) {
        const img = card.querySelector('.project-image img');
        const category = card.querySelector('.project-category');
        const title = card.querySelector('.project-title');
        const desc = card.querySelector('.project-desc');

        if (img) {
            lightboxImg.style.opacity = '0';
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = '1';
            };
        }
        if (category) lightboxCategory.textContent = category.textContent;
        if (title) lightboxTitle.textContent = title.textContent;
        if (desc) lightboxDesc.textContent = desc.textContent;

        const visible = getVisibleCards();
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visible.length;
    }

    // --- Navigate carousel ---
    function navigate(direction) {
        const visible = getVisibleCards();
        if (visible.length === 0) return;

        currentIndex += direction;
        if (currentIndex < 0) currentIndex = visible.length - 1;
        if (currentIndex >= visible.length) currentIndex = 0;

        showCard(visible[currentIndex]);
    }

    // --- Lightbox: open on card click ---
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const visible = getVisibleCards();
            currentIndex = visible.indexOf(card);

            showCard(card);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // --- Lightbox: navigation buttons ---
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });

    // --- Lightbox: close ---
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentIndex = -1;
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // --- Keyboard navigation ---
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // --- Touch swipe support ---
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            navigate(diff > 0 ? 1 : -1);
        }
    }, { passive: true });

    // --- Magnetic hover effect on cards ---
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
