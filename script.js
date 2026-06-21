/* ═══════════════════════════════════════════════════
   MANAVALLA KRISHNA VAMSI — PORTFOLIO SCRIPT
═══════════════════════════════════════════════════ */

/* ── 1. PARTICLE CANVAS BACKGROUND ── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const PARTICLE_COUNT = 90;
  const COLORS = ['#9b59f5', '#c084fc', '#e879f9', '#c4b5fd', '#7c3aed'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      r:     randomBetween(0.6, 2.4),
      dx:    randomBetween(-0.25, 0.25),
      dy:    randomBetween(-0.25, 0.25),
      alpha: randomBetween(0.2, 0.7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawLines() {
    const MAX_DIST = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(155,89,245,${0.07 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  initParticles();
  animate();
})();


/* ── 3. NAVBAR SCROLL EFFECT ── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('back-to-top');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backTop.classList.remove('visible');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Back to top */
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ── 4. HAMBURGER MENU ── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });

  /* Close menu when a nav link is clicked */
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });
})();


/* ── 5. ACTIVE NAV LINK ON SCROLL ── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}


/* ── 6. SCROLL REVEAL (Intersection Observer) ── */
(function initReveal() {
  /* Add .reveal to every major child element */
  const targets = document.querySelectorAll(
    '.about-image-col, .about-text-col, ' +
    '.skill-card, .domain-tag, ' +
    '.project-card, ' +
    '.timeline-item, ' +
    '.cert-card, ' +
    '.contact-info, .contact-form-wrap, ' +
    '.section-header'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.06}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ── 8. CONTACT FORM (mailto fallback) ── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const sendBtn = document.getElementById('send-btn');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) return;

    /* Animate button */
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    sendBtn.disabled = true;

    setTimeout(() => {
      /* Open mailto as a fallback */
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:mkvamsi246@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      sendBtn.disabled = false;
      success.classList.add('show');
      form.reset();

      setTimeout(() => success.classList.remove('show'), 5000);
    }, 800);
  });
})();


/* ── 9. SMOOTH HOVER GLOW ON PROJECT & CERT CARDS ── */
(function initCardGlow() {
  const cards = document.querySelectorAll('.project-card, .cert-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,245,255,0.07), transparent 60%), var(--bg-card)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ── 10. PROFILE IMAGE FALLBACK ── */
(function initProfileFallback() {
  const imgs = document.querySelectorAll('.profile-img, .about-img-card img');
  imgs.forEach(img => {
    img.addEventListener('error', () => {
      /* Replace with a generated SVG avatar */
      const svg = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00f5ff"/>
              <stop offset="100%" style="stop-color:#7c3aed"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="100" fill="#0d1225"/>
          <circle cx="100" cy="80" r="38" fill="url(#g)" opacity="0.9"/>
          <ellipse cx="100" cy="175" rx="60" ry="45" fill="url(#g)" opacity="0.7"/>
          <text x="100" y="108" text-anchor="middle" font-size="36"
            font-family="Outfit,sans-serif" fill="white" font-weight="800">MKV</text>
        </svg>
      `)}`;
      img.src = svg;
    });
  });
})();
