// =====================================================
//  John Mark B. Genite – Portfolio Script
// =====================================================

/* ---- Typing Animation ---- */
const typingTexts = [
  'hello_world();',
  'const me = "Nichole Pancho";',
  'IS_Student.init();',
  'designFuture();',
  'buildSolutions.run();',
];
let typeIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeWriter() {
  const current = typingTexts[typeIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }
  let speed = isDeleting ? 60 : 110;
  if (!isDeleting && charIdx === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    typeIdx = (typeIdx + 1) % typingTexts.length;
    speed = 300;
  }
  setTimeout(typeWriter, speed);
}
typeWriter();

/* ---- Animated Canvas Background ---- */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#00d4ff' : Math.random() > 0.5 ? '#7c3aed' : '#06ffa5';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Create particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---- Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

/* ---- Active Nav Link ---- */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) link.classList.add('active');
  });
}

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

/* ---- Reveal on Scroll ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---- Skill Bar Animation ---- */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      setTimeout(() => {
        fill.style.width = fill.dataset.width + '%';
      }, 300);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(f => skillObserver.observe(f));

/* ---- Counter Animation ---- */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}
const statNums = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(el => animateCounter(el, parseInt(el.dataset.target)));
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
if (statNums.length) statsObserver.observe(statNums[0].closest('.hero-stats'));

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendMsgBtn');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  sendBtn.disabled = true;

  setTimeout(() => {
    sendBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
    sendBtn.style.background = 'linear-gradient(135deg, #06ffa5, #00d4ff)';
    contactForm.reset();
    setTimeout(() => {
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      sendBtn.style.background = '';
      sendBtn.disabled = false;
    }, 3000);
  }, 1500);
});

/* ---- Smooth scroll for nav links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Profile image fallback ---- */
const profileImg = document.getElementById('profileImg');
if (profileImg) {
  profileImg.onerror = function() {
    // Create initials placeholder if image fails to load
    const container = this.parentElement;
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width:100%; height:100%; border-radius:50%;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      display:flex; align-items:center; justify-content:center;
      font-size:4rem; font-weight:900; color:#fff;
      font-family:'Outfit',sans-serif; border:4px solid #00d4ff;
      box-shadow: 0 0 40px rgba(0,212,255,0.4);
    `;
    placeholder.textContent = 'NP';
    container.appendChild(placeholder);
  };
}

console.log('%c⚡ Nichole Pancho Portfolio', 'color:#00d4ff;font-size:18px;font-weight:bold;');
console.log('%cIS Student | Digital Designer | DNSC', 'color:#7c3aed;font-size:12px;');
