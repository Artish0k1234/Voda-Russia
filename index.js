// 1. MOBILE MENU TOGGLE
const burgerBtn = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');

burgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// 2. WAVE-TEXT BUTTON ANIMATION
document.querySelectorAll('.wave-text').forEach(el => {
    const text = el.innerText.trim();
    el.innerHTML = '';
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'wave-char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        span.style.animationDelay = `${i * 0.04}s`;
        el.appendChild(span);
    });
});

// 3. HERO CANVAS BACKGROUND WAVES & BUBBLES
const heroCanvas = document.getElementById('hero-water-canvas');
const heroCtx = heroCanvas.getContext('2d');
let heroW, heroH;

function resizeHero() {
    heroW = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
    heroH = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
}

const heroBubbles = Array.from({ length: 20 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * 600,
    r: Math.random() * 3 + 1.5,
    speed: Math.random() * 0.5 + 0.2,
    alpha: Math.random() * 0.2 + 0.05
}));

let heroStep = 0;
function renderHero() {
    heroCtx.clearRect(0, 0, heroW, heroH);
    heroStep += 0.015;

    heroBubbles.forEach(b => {
        b.y -= b.speed;
        if (b.y < -10) {
            b.y = heroH + 10;
            b.x = Math.random() * heroW;
        }
        heroCtx.beginPath();
        heroCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        heroCtx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
        heroCtx.fill();
    });

    heroCtx.beginPath();
    heroCtx.moveTo(0, heroH);
    for (let x = 0; x <= heroW; x += 20) {
        const y = Math.sin(x * 0.005 - heroStep) * 15 + (heroH - 25);
        heroCtx.lineTo(x, y);
    }
    heroCtx.lineTo(heroW, heroH);
    heroCtx.fillStyle = 'rgba(2, 132, 199, 0.1)';
    heroCtx.fill();

    requestAnimationFrame(renderHero);
}

// 4. SUBTLE AMBIENT SIDE BACKGROUND FLOW (Disabled on Mobile to keep UI clean)
const sideCanvas = document.getElementById('side-water-canvas');
const sideCtx = sideCanvas.getContext('2d');
let sideW, sideH;

function resizeSideCanvas() {
    sideW = sideCanvas.width = window.innerWidth;
    sideH = sideCanvas.height = window.innerHeight;
}

// Very soft, ambient glowing particles on the far left and right edges
const ambientParticles = Array.from({ length: 24 }, () => ({
    x: Math.random() > 0.5 ? Math.random() * 60 : window.innerWidth - (Math.random() * 60),
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 0.4 + 0.2,
    alpha: Math.random() * 0.25 + 0.05
}));

function renderSideAmbient() {
    sideCtx.clearRect(0, 0, sideW, sideH);

    // Only render ambient side particles on desktop/tablet screens
    if (window.innerWidth > 768) {
        ambientParticles.forEach(p => {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = sideH;
                p.x = Math.random() > 0.5 ? Math.random() * 60 : sideW - (Math.random() * 60);
            }

            sideCtx.beginPath();
            sideCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            sideCtx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
            sideCtx.fill();
        });
    }

    requestAnimationFrame(renderSideAmbient);
}

// 5. BOTTOM SECTION: 3D PARTICLE WAVE BASIN
const bottomCanvas = document.getElementById('bottom-wave-canvas');
const bottomCtx = bottomCanvas.getContext('2d');
let bW, bH;

function resizeBottomCanvas() {
    bW = bottomCanvas.width = bottomCanvas.parentElement.offsetWidth;
    bH = bottomCanvas.height = bottomCanvas.parentElement.offsetHeight;
}

const COLS = 45;
const ROWS = 20;
let waveMatrixTime = 0;

function renderBottomWave() {
    bottomCtx.clearRect(0, 0, bW, bH);
    waveMatrixTime += 0.02;

    const startY = bH * 0.45;
    const gridW = bW * 0.95;
    const startX = (bW - gridW) / 2;
    const stepX = gridW / COLS;

    for (let r = 0; r < ROWS; r++) {
        const depth = r / ROWS;
        const perspective = 0.5 + depth * 0.5;
        const rowBaseY = startY + depth * (bH - startY);

        for (let c = 0; c < COLS; c++) {
            const px = startX + c * stepX;
            const wave = Math.sin(c * 0.25 + waveMatrixTime * 1.5 + depth * 3) * (10 * perspective) +
                Math.cos(r * 0.3 - waveMatrixTime) * (6 * perspective);
            const py = rowBaseY + wave;

            bottomCtx.beginPath();
            bottomCtx.arc(px, py, (1 + depth * 2) * perspective, 0, Math.PI * 2);
            bottomCtx.fillStyle = `rgba(${56 + Math.floor(depth * 30)}, ${189 + Math.floor(depth * 30)}, 248, ${0.15 + depth * 0.45})`;
            bottomCtx.fill();
        }
    }

    const horizonGlow = bottomCtx.createLinearGradient(0, startY - 40, 0, bH);
    horizonGlow.addColorStop(0, 'rgba(56, 189, 248, 0)');
    horizonGlow.addColorStop(0.3, 'rgba(2, 132, 199, 0.12)');
    horizonGlow.addColorStop(1, 'rgba(1, 12, 27, 0.85)');
    bottomCtx.fillStyle = horizonGlow;
    bottomCtx.fillRect(0, startY - 40, bW, bH - startY + 40);

    requestAnimationFrame(renderBottomWave);
}

// RESIZE DISPATCHER
window.addEventListener('resize', () => {
    resizeHero();
    resizeSideCanvas();
    resizeBottomCanvas();
});

// START ALL ENGINES
resizeHero();
resizeSideCanvas();
resizeBottomCanvas();
renderHero();
renderSideAmbient();
renderBottomWave();