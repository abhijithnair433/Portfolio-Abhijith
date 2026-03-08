const sections = Array.from(document.querySelectorAll('section'));
let isScrolling = false;
let cooldown = 400;

const sectionAnimations = {
    'home': [
        { el: document.querySelector('#home-title-name'), cls: 'slide-left' },
        { el: document.querySelector('#title-main'),      cls: 'slide-left' },
        { el: document.querySelector('.descriptions'),    cls: 'slide-left' },
        { el: document.querySelector('#home-image'),      cls: 'slide-right' },
    ],
};

function triggerAnimation(sectionId) {
    const elements = sectionAnimations[sectionId];
    if (!elements) return;

    elements.forEach(({ el, cls }) => {
        if (!el) return;
        el.classList.remove('slide-left', 'slide-right');
        void el.offsetWidth;
        el.classList.add(cls);
    });
}

window.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    const current = sections.findIndex(sec => {
        const rect = sec.getBoundingClientRect();
        return rect.top >= -50 && rect.top < window.innerHeight / 2;
    });

    let target = null;

    if (e.deltaY > 0 && current < sections.length - 1) {
        target = sections[current + 1];
    } else if (e.deltaY < 0 && current > 0) {
        target = sections[current - 1];
    }

    if (target) {
        smoothWave(target.offsetTop, cooldown);
        if (target.id === 'home') {
            setTimeout(() => triggerAnimation('home'), cooldown * 0.6);
        }
    }

    setTimeout(() => { isScrolling = false; }, cooldown);

}, { passive: false });


function smoothWave(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function easeInOutQuart(t) {
        return t < 0.5
            ? 8 * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuart(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// fire on page load
triggerAnimation('home');


const navLinks = document.querySelectorAll('#navbar a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);

        if (!target || isScrolling) return;
        isScrolling = true;

        smoothWave(target.offsetTop, cooldown);

        if (targetId === 'home') {
            setTimeout(() => triggerAnimation('home'), cooldown * 0.6);
        }

        setTimeout(() => { isScrolling = false; }, cooldown);
    });
});