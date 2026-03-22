// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
setInterval(() => {
    tx += (mx - tx) * 0.2; ty += (my - ty) * 0.2;
    trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
}, 16);

// ── BOOT SCREEN ──
(function boot() {
    const bar = document.getElementById('boot-bar');
    const txt = document.getElementById('boot-text');
    const screen = document.getElementById('boot-screen');
    const msgs = ['INITIALIZING SYSTEM...', 'LOADING ASSETS...', 'CALIBRATING HUD...', 'CONNECTING TO SERVER...', 'LAUNCHING PORTFOLIO...'];
    let pct = 0, mi = 0;
    const iv = setInterval(() => {
        pct += Math.random() * 6 + 3;
        if (pct >= 100) { pct = 100; clearInterval(iv); }
        bar.style.width = pct + '%';
        const ni = Math.floor((pct / 100) * msgs.length);
        if (ni !== mi && ni < msgs.length) { mi = ni; txt.textContent = msgs[mi]; }
        if (pct >= 100) {
            setTimeout(() => {
                screen.style.transition = 'opacity .6s ease';
                screen.style.opacity = '0';
                setTimeout(() => { screen.style.display = 'none'; startAnimations(); }, 600);
            }, 300);
        }
    }, 60);
})();

function startAnimations() {
    typeHeroName();
    typeRole();
}

// ── TYPEWRITER: HERO NAME ──
function typeHeroName() {
    const el = document.getElementById('hero-name');
    const text = 'ASHISH JALAN';
    let i = 0;
    const iv = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(iv);
    }, 80);
}

// ── TYPEWRITER: ROLE ──
function typeRole() {
    const el = document.getElementById('role-text');
    const roles = ['UNITY GAME DEVELOPER', 'MOBILE GAME DEV', 'MULTIPLAYER ENGINEER', 'GAME ARCHITECT'];
    let ri = 0, ci = 0, deleting = false;
    setInterval(() => {
        const cur = roles[ri];
        if (!deleting) {
            el.textContent = cur.slice(0, ci + 1);
            ci++;
            if (ci >= cur.length) { deleting = true; setTimeout(() => { }, 1200); }
        } else {
            el.textContent = cur.slice(0, ci - 1);
            ci--;
            if (ci <= 0) { deleting = false; ri = (ri + 1) % roles.length; }
        }
    }, deleting ? 50 : 90);
}

// ── CANVAS: HEX GRID + PARTICLES ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const hexes = [];
function buildHexes() {
    hexes.length = 0;
    const size = 30, cols = Math.ceil(W / (size * 1.7)) + 2, rows = Math.ceil(H / (size * 1.5)) + 2;
    for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
            const x = c * size * 1.75 + (r % 2 === 0 ? 0 : size * 0.875);
            const y = r * size * 1.5;
            hexes.push({ x, y, s: size, a: 0.03 + Math.random() * 0.06, pulse: Math.random() * Math.PI * 2 });
        }
    }
}
buildHexes();
window.addEventListener('resize', buildHexes);

function drawHex(x, y, s) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
}

const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * 1920, y: Math.random() * 1080,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
    r: Math.random() * 1.5 + .5, a: Math.random() * .4 + .2,
    c: Math.random() > .5 ? '0,255,135' : '0,207,255'
}));

let t = 0;
function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.01;

    // hex grid
    hexes.forEach(h => {
        const pulse = Math.sin(t + h.pulse) * 0.03 + h.a;
        drawHex(h.x, h.y, h.s);
        ctx.strokeStyle = `rgba(0,255,135,${pulse})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    });

    // particles + connections
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,255,135,${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.4;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}
draw();

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 60 ? 'rgba(0,255,135,.2)' : 'rgba(0,255,135,.12)';
});

// ── HAMBURGER ──
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
});
document.getElementById('nav-links').querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// ── SCROLL REVEAL + SKILL BARS ──
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        // animate skill bars inside this element
        e.target.querySelectorAll('.sbar-fill').forEach((bar, idx) => {
            bar.style.transitionDelay = (idx * 0.12) + 's';
            bar.style.width = bar.style.getPropertyValue('--w') || bar.getAttribute('style').match(/--w:([^;)]+)/)?.[1] || '0%';
        });
        revealObs.unobserve(e.target);
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Also observe skill cards for bar animation
document.querySelectorAll('.skill-card').forEach(card => {
    const obs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        card.querySelectorAll('.sbar-fill').forEach((bar, idx) => {
            setTimeout(() => {
                const w = bar.style.cssText.match(/--w:\s*([^;]+)/)?.[1] || '0%';
                bar.style.width = w;
            }, idx * 120);
        });
        obs.disconnect();
    }, { threshold: 0.3 });
    obs.observe(card);
});
