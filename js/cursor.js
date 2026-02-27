/**
 * Custom Brush Cursor (no paint trail)
 */
(function () {
    const cursorEl = document.getElementById('custom-cursor');

    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop
    function animate() {
        // Smooth cursor movement (lerp)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        // Update cursor element position
        cursorEl.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px) rotate(-135deg)`;

        requestAnimationFrame(animate);
    }

    // Start
    document.body.classList.add('cursor-ready');
    animate();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorEl.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorEl.style.opacity = '1';
    });

    // Scale cursor on interactive elements
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .project-card, .filter-btn, .tool-tag')) {
            cursorEl.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px) rotate(-135deg) scale(1.3)`;
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .project-card, .filter-btn, .tool-tag')) {
            cursorEl.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px) rotate(-135deg) scale(1)`;
        }
    });
})();
