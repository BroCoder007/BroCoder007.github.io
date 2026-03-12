/* ========================================
   BroCoder007 Portfolio — JavaScript
   Particles, scroll reveals, navbar, 
   dynamic project rendering
   ======================================== */

// ---- GitHub Data (Pre-filtered: NOT fork AND has description) ----
const projects = [
  {
    name: "Loopy_SimonTatham_Games",
    description: "Loopy (also known as Slitherlink) is a logic puzzle included in Simon Tatham's Portable Puzzle Collection. The goal is to form a single, continuous, closed loop by connecting the edges of a grid based on numerical clues.",
    language: "Python",
    stars: 0,
    forks: 2,
    url: "https://github.com/BroCoder007/Loopy_SimonTatham_Games"
  },
  {
    name: "Jugaad-TheOnlineThriftStore",
    description: "A repo for selling 2nd hand goods, without revealing your identity to the seller. Provides an interface to contact buyer and seller anonymously with an option to bid for in-demand products.",
    language: "JavaScript",
    stars: 1,
    forks: 0,
    url: "https://github.com/BroCoder007/Jugaad-TheOnlineThriftStore"
  },
  {
    name: "AUMS-EXTENSION",
    description: "A browser extension project.",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    url: "https://github.com/BroCoder007/AUMS-EXTENSION"
  },
  {
    name: "conflict-simuation",
    description: "A project which allows you to simulate conflicts in the world based on previous wartime data in various regions of the world.",
    language: null,
    stars: 0,
    forks: 0,
    url: "https://github.com/BroCoder007/conflict-simuation"
  },
  {
    name: "ExamSurvivalApp",
    description: "A fun simulation of a current gen task management program.",
    language: "Java",
    stars: 0,
    forks: 0,
    url: "https://github.com/BroCoder007/ExamSurvivalApp"
  },
  {
    name: "git-github-workshop",
    description: "A beginner-friendly workshop to learn Git and GitHub — covers installation, essential commands, branching, pull requests, and best practices for open-source contribution.",
    language: "Python",
    stars: 0,
    forks: 0,
    url: "https://github.com/BroCoder007/git-github-workshop",
    fork: true
  },
  {
    name: "scraperPro",
    description: "A web scraping tool built with Python.",
    language: "Python",
    stars: 0,
    forks: 0,
    url: "https://github.com/BroCoder007/scraperPro"
  },
  {
    name: "SimpleBlockChainTool",
    description: "A simple blockchain simulation using the most basic Data structure — LinkedList. Anyone interested can build upon the basic idea.",
    language: "Java",
    stars: 0,
    forks: 0,
    url: "https://github.com/BroCoder007/SimpleBlockChainTool"
  }
];

// ---- Language Color Map ----
function getLangClass(lang) {
  if (!lang) return 'lang-dot--unknown';
  const map = {
    'Java': 'lang-dot--java',
    'JavaScript': 'lang-dot--javascript',
    'Python': 'lang-dot--python'
  };
  return map[lang] || 'lang-dot--unknown';
}

// ---- Render Projects ----
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map((project, i) => `
    <article class="project-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="project-card__header">
        <div class="project-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-card__link" aria-label="View ${project.name} on GitHub">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
      <h3 class="project-card__name">${project.name.replace(/[-_]/g, ' ')}</h3>
      <p class="project-card__desc">${project.description}</p>
      <div class="project-card__footer">
        <span class="project-card__lang">
          <span class="lang-dot ${getLangClass(project.language)}"></span>
          ${project.language || 'N/A'}
        </span>
        <div class="project-card__meta">
          <span class="project-card__meta-item" title="Stars">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            ${project.stars}
          </span>
          <span class="project-card__meta-item" title="Forks">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="18" r="3"/>
              <circle cx="6" cy="6" r="3"/>
              <circle cx="18" cy="6" r="3"/>
              <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
              <path d="M12 12v3"/>
            </svg>
            ${project.forks}
          </span>
        </div>
      </div>
    </article>
  `).join('');
}

// ---- Particles Animation ----
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  animate();
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ---- Navbar Scroll Effect ----
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const links = document.querySelector('.navbar__links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }
}

// ---- Smooth Scroll for Anchor Links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---- Typing Effect for Hero ----
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Securing systems, one vulnerability at a time',
    'CTF competitor — Ranked 38/900 at Pragyan',
    'Google Security Professional certified',
    'Building secure & scalable software',
    'Exploring ethical hacking with Kali Linux'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      currentText = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    el.textContent = currentText;

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

// ---- Counter Animation ----
function animateCounters() {
  const counters = document.querySelectorAll('.stat__number');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(update);
        observer.unobserve(counter);
      }
    });

    observer.observe(counter);
  });
}

// ---- Logo Name Cycling ----
function initLogoCycle() {
  const el = document.getElementById('logo-name');
  if (!el) return;

  const names = ['Abhinav Raghavendra', 'BroCoder007', 'DirtyCow666'];
  let index = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      index = (index + 1) % names.length;
      el.textContent = names[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300);
  }, 5000);
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initParticles();
  initScrollReveal();
  initNavbar();
  initSmoothScroll();
  initTypingEffect();
  animateCounters();
  initLogoCycle();
});
