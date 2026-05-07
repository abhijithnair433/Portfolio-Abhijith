/* ═══════════════════════════════════════════
   app.js — SPA Router + Page Renderers
═══════════════════════════════════════════ */

// ── Cursor ────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * 0.14;     ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
function enableHover(el) {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
}

// ── Router ────────────────────────────────
const routes = ['home', 'about', 'experience', 'projects', 'education', 'contact'];
const pageEl  = document.getElementById('page');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');

function navigate(page, pushState = true) {
  if (!routes.includes(page)) page = 'home';
  if (pushState) history.pushState({ page }, '', page === 'home' ? '/' : `#${page}`);

  // active nav link
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === page));

  // exit animation then render new page
  pageEl.classList.remove('page-enter');
  pageEl.classList.add('page-exit');
  setTimeout(() => {
    pageEl.classList.remove('page-exit');
    render(page);
    pageEl.classList.add('page-enter');
    window.scrollTo(0, 0);
    setupPage(page);
  }, 280);
}

// click nav links
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    navigate(a.dataset.page);
  });
  enableHover(a);
});

// logo → home
document.querySelector('.nav-logo').addEventListener('click', e => {
  e.preventDefault(); navigate('home');
});
enableHover(document.querySelector('.nav-logo'));
enableHover(document.querySelector('.nav-cta'));

// browser back/forward
window.addEventListener('popstate', e => {
  const page = e.state?.page || 'home';
  navigate(page, false);
});

// ── Initial load ──────────────────────────
(function init() {
  const hash = location.hash.replace('#', '');
  const page = routes.includes(hash) ? hash : 'home';
  history.replaceState({ page }, '', page === 'home' ? '/' : `#${page}`);
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === page));
  render(page);
  pageEl.classList.add('page-enter');
  setupPage(page);
})();

// ── Render dispatcher ─────────────────────
function render(page) {
  const renderers = { home, about, experience, projects, education, contact };
  pageEl.innerHTML = (renderers[page] || home)();
}

// ── Post-render setup ─────────────────────
function setupPage(page) {
  // re-enable hover on all interactive elements
  document.querySelectorAll('a, button, .proj-card, .nav-cta, .contact-cta-item').forEach(enableHover);

  // nav link clicks inside page content
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.nav); });
    enableHover(el);
  });

  // intersection-based reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .exp-item, .proj-card').forEach(el => io.observe(el));

  // skill bars
  if (page === 'about') {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.querySelector('.skill-fill')?.classList.add('go'); sio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    document.querySelectorAll('.skill-bar').forEach(b => sio.observe(b));
  }

  // stagger proj cards
  if (page === 'projects') {
    document.querySelectorAll('.proj-card').forEach((c, i) => { c.style.transitionDelay = (i * 0.12) + 's'; });
  }
}

/* ═══════════════════════════════════════════
   PAGE TEMPLATES
═══════════════════════════════════════════ */

// ── HOME ──────────────────────────────────
function home() { return `
<div id="home-grid">
  <div class="home-left">
    <div>
      <div class="home-eyebrow">Available for work</div>
      <h1 class="home-name">Abhi<em>jith</em> R</h1>
      <p class="home-desc">CS &amp; AI/ML graduate. Full-stack developer, open source contributor, and builder of things that actually ship. Based in Kerala, India.</p>
      <div class="home-actions">
        <a href="#" class="btn-primary" data-nav="projects">View Projects</a>
        <a href="#" class="btn-ghost"   data-nav="contact">Get in Touch</a>
      </div>
    </div>
    <div class="home-scroll">Explore</div>
  </div>
  <div class="home-right">
    <div class="orbit-wrap">
      <div class="orbit-ring"><div class="orbit-dot"></div></div>
      <div class="orbit-ring"><div class="orbit-dot"></div></div>
      <div class="orbit-initials">AR</div>
    </div>
    <div class="home-stats">
      <div class="stat"><div class="stat-num">3+</div><div class="stat-label">Real-world roles</div></div>
      <div class="stat"><div class="stat-num">4+</div><div class="stat-label">Projects shipped</div></div>
      <div class="stat"><div class="stat-num">7.03</div><div class="stat-label">CGPA / 10</div></div>
      <div class="stat"><div class="stat-num">∞</div><div class="stat-label">Things to build</div></div>
    </div>
  </div>
</div>
<footer>
  <span>© 2025 Abhijith R</span>
  <span>Adoor, Kerala — India</span>
</footer>`; }

// ── ABOUT ─────────────────────────────────
function about() { return `
<div class="section-label"><span>About</span><span class="section-num">01</span></div>
<div class="about-grid">
  <div class="about-text reveal">
    <h2>Code that<br><em>actually</em><br>matters.</h2>
    <p>I'm a Computer Science graduate specialising in AI &amp; ML from Sree Buddha College of Engineering. I care about building real software — web platforms, IoT experiments, open-source contributions — not just personal projects that never see the world.</p>
    <p>I've contributed to a startup's live website, volunteered with researchers at the University of Zurich, and shipped a full Django marketplace with role-based access and compliance flows.</p>
    <p>I thrive in collaborative environments and learn fastest when there's a real problem on the table. My sweet spot is the intersection of backend logic and meaningful user experience.</p>
  </div>
  <div class="about-right reveal">
    <div class="skills-title">Technical skills</div>
    ${[
      ['Python',         'Core Lang', 82],
      ['Django / DRF',  'Backend',   75],
      ['HTML/CSS/JS',   'Frontend',  70],
      ['Machine Learning','Foundational',65],
      ['IoT / ESP32',   'Hardware',  60],
      ['Git & GitHub',  'VCS',       73],
      ['Java',          'OOP',       55],
    ].map(([name, tag, pct]) => `
    <div class="skill-bar">
      <div class="skill-bar-label"><span>${name}</span><span>${tag}</span></div>
      <div class="skill-track"><div class="skill-fill" style="width:${pct}%"></div></div>
    </div>`).join('')}
  </div>
</div>
<div class="about-strip">
  <div class="about-strip-item reveal"><div class="about-strip-num">3+</div><div class="about-strip-label">Roles held</div></div>
  <div class="about-strip-item reveal"><div class="about-strip-num">4+</div><div class="about-strip-label">Projects shipped</div></div>
  <div class="about-strip-item reveal"><div class="about-strip-num">2+</div><div class="about-strip-label">Countries collaborated</div></div>
  <div class="about-strip-item reveal"><div class="about-strip-num">3</div><div class="about-strip-label">Languages spoken</div></div>
</div>
<footer>
  <span>© 2025 Abhijith R</span>
  <span>Adoor, Kerala — India</span>
</footer>`; }

// ── EXPERIENCE ────────────────────────────
function experience() { return `
<div class="section-label"><span>Experience</span><span class="section-num">02</span></div>
<div class="exp-inner">

  <div class="exp-item">
    <div class="exp-meta">
      <div class="exp-date">Jun 2025 – Jul 2025</div>
      <div class="exp-company">DivisoSofttech</div>
      <div class="exp-loc">Palakkad, Kerala</div>
    </div>
    <div class="exp-content">
      <h3>Full Stack Developer Intern</h3>
      <ul>
        <li>Contributed to a Proof-of-Concept Game-Based Learning Framework.</li>
        <li>Handled multi-user interaction and database design via Tomcat web server.</li>
        <li>Gained foundational knowledge in Java web development and server management.</li>
        <li>Worked across the full stack — from UI rendering to back-end data handling.</li>
      </ul>
      <span class="exp-tag">Java</span>
      <span class="exp-tag">Tomcat</span>
      <span class="exp-tag">Databases</span>
      <span class="exp-tag">Full Stack</span>
    </div>
  </div>

  <div class="exp-item">
    <div class="exp-meta">
      <div class="exp-date">Nov 2024 – Jan 2025</div>
      <div class="exp-company">PyDew Valley — UZH</div>
      <div class="exp-loc">Remote / Virtual</div>
    </div>
    <div class="exp-content">
      <h3>Volunteer — Programming &amp; Code Review</h3>
      <ul>
        <li>Collaborated with psychology researchers from the University of Zurich, Germany.</li>
        <li>Developed features in Python using the Pygame library for a research game.</li>
        <li>Engaged in async code review with an international team of professionals on Discord.</li>
        <li>Project led by sub-project lead S.L. Kittelberger.</li>
      </ul>
      <span class="exp-tag">Python</span>
      <span class="exp-tag">Pygame</span>
      <span class="exp-tag">Code Review</span>
      <span class="exp-tag">Open Source</span>
    </div>
  </div>

  <div class="exp-item">
    <div class="exp-meta">
      <div class="exp-date">Sep 2024 – Oct 2024</div>
      <div class="exp-company">Assistrend</div>
      <div class="exp-loc">Chengannur, Kerala</div>
    </div>
    <div class="exp-content">
      <h3>Programmer / Code Review</h3>
      <ul>
        <li>Enhanced the UX and frontend of Assistrend's live startup website.</li>
        <li>Visitor metrics improved noticeably following the changes deployed.</li>
        <li>Maintained codebase using Git and GitHub on a real production repository.</li>
        <li>Contributed to early-stage backend development with the core team.</li>
      </ul>
      <span class="exp-tag">Python</span>
      <span class="exp-tag">Django</span>
      <span class="exp-tag">Git</span>
      <span class="exp-tag">Production</span>
    </div>
  </div>

</div>
<footer>
  <span>© 2025 Abhijith R</span>
  <span>Adoor, Kerala — India</span>
</footer>`; }

// ── PROJECTS ──────────────────────────────
function projects() { return `
<div class="section-label"><span>Projects</span><span class="section-num">03</span></div>
<div class="proj-grid">

  <div class="proj-card">
    <div class="proj-inner">
      <div class="proj-num">01</div>
      <div class="proj-title">SugarPetals</div>
      <p class="proj-desc">A full-featured online bakery marketplace with role-based dashboards for customers, sellers, delivery agents &amp; admins. Includes FSSAI compliance flow, certificate uploads, and purchase-gated reviews with parallel fetching.</p>
      <div class="proj-tech">
        <span>Django</span><span>DRF</span><span>JavaScript</span><span>SQLite</span>
      </div>
      <a href="https://github.com/abhijithnair433/sugarpetals" target="_blank" class="proj-link">↗ GitHub</a>
    </div>
  </div>

  <div class="proj-card">
    <div class="proj-inner">
      <div class="proj-num">02</div>
      <div class="proj-title">Clockwork RPG</div>
      <p class="proj-desc">An orthogonal RPG project built in Java. Demonstrates game-loop architecture, sprite rendering, tile-map traversal, and multi-character interaction mechanics — built during a fullstack internship.</p>
      <div class="proj-tech">
        <span>Java</span><span>Tomcat</span><span>OOP</span><span>Game Loop</span>
      </div>
      <a href="https://github.com/abhijithnair433/clockwork" target="_blank" class="proj-link">↗ GitHub</a>
    </div>
  </div>

  <div class="proj-card">
    <div class="proj-inner">
      <div class="proj-num">03</div>
      <div class="proj-title">IoT Crop Recommender</div>
      <p class="proj-desc">ESP32-based sensor network that detects soil and environmental conditions in real time, feeding a deep learning model to recommend optimal crops — built as the mini-project for final year.</p>
      <div class="proj-tech">
        <span>Python</span><span>ESP32</span><span>Deep Learning</span><span>IoT</span>
      </div>
      <a href="#" class="proj-link" style="pointer-events:none; opacity:0.5;">Academic</a>
    </div>
  </div>

  <div class="proj-card">
    <div class="proj-inner">
      <div class="proj-num">04</div>
      <div class="proj-title">Low-Light Enhancer</div>
      <p class="proj-desc">Final year thesis project: Zero-Shot Low-Light Image Enhancement using Vision Language Models and Semantic Diffusion. Benchmarked against EnlightenGAN and Zero-DCE on the LOL dataset.</p>
      <div class="proj-tech">
        <span>Python</span><span>VLM</span><span>Diffusion</span><span>CV</span>
      </div>
      <a href="#" class="proj-link" style="pointer-events:none; opacity:0.5;">Thesis</a>
    </div>
  </div>

  <div class="proj-card">
    <div class="proj-inner">
      <div class="proj-num">05</div>
      <div class="proj-title">Assistrend Website</div>
      <p class="proj-desc">Enhanced the live website of Assistrend, a Kerala-based startup. Improved UX flows, fixed production issues, and managed the codebase with Git — resulting in increased visitor metrics.</p>
      <div class="proj-tech">
        <span>HTML/CSS</span><span>JS</span><span>Django</span><span>Git</span>
      </div>
      <a href="https://github.com/abhijithnair433/Assistrend" target="_blank" class="proj-link">↗ GitHub</a>
    </div>
  </div>

  <div class="proj-card">
    <div class="proj-inner">
      <div class="proj-num">06</div>
      <div class="proj-title">PyDew Valley Game</div>
      <p class="proj-desc">Open-source psychology research game built in Python with Pygame, in collaboration with University of Zurich researchers. Contributed feature development and async code reviews with an international team.</p>
      <div class="proj-tech">
        <span>Python</span><span>Pygame</span><span>Open Source</span>
      </div>
      <a href="#" class="proj-link" style="pointer-events:none; opacity:0.5;">Research</a>
    </div>
  </div>

</div>
<footer>
  <span>© 2025 Abhijith R</span>
  <span>Adoor, Kerala — India</span>
</footer>`; }

// ── EDUCATION ─────────────────────────────
function education() { return `
<div class="section-label"><span>Education</span><span class="section-num">04</span></div>
<div class="edu-inner">
  <div class="edu-main reveal">
    <div class="edu-badge">2022 – 2026 · Ongoing</div>
    <h2>Sree Buddha<br>College of<br>Engineering</h2>
    <div class="edu-detail">
      <p><strong>BTech — Computer Science &amp; Engineering (AI &amp; ML)</strong></p>
      <p>Patoor, Kerala, India</p>
      <div class="cgpa">7.03</div>
      <div class="cgpa-label">CGPA out of 10</div>
    </div>
  </div>
  <div class="edu-highlights reveal">
    <div class="edu-hl-title">Highlights &amp; Activities</div>
    <div class="edu-hl-item">
      <div class="edu-hl-icon">✦</div>
      <div>Led the final year group project as team leader — coordinating research, implementation, and documentation across the team.</div>
    </div>
    <div class="edu-hl-item">
      <div class="edu-hl-icon">✦</div>
      <div>Contributed mini-project on <em>IoT-Based Crop Recommendation using Deep Learning</em> — involving ESP32 sensor integration.</div>
    </div>
    <div class="edu-hl-item">
      <div class="edu-hl-icon">✦</div>
      <div>Volunteered as mentor at <em>Hackbells 26</em>, the college's annual student hackathon.</div>
    </div>
    <div class="edu-hl-item">
      <div class="edu-hl-icon">✦</div>
      <div>Programmed ESP32 microcontrollers to interface with multiple sensor types for live crop-environment detection.</div>
    </div>
    <div class="edu-hl-item">
      <div class="edu-hl-icon">✦</div>
      <div>Worked on final year thesis in Zero-Shot Low-Light Image Enhancement using Vision Language Models &amp; Semantic Diffusion.</div>
    </div>
  </div>
</div>
<div class="edu-thesis reveal">
  <h3>Final Year Thesis</h3>
  <p>
    <strong>Zero-Shot Low-Light Image Enhancement Using Vision Language Models and Semantic Diffusion</strong><br><br>
    A novel approach to enhancing images captured in poorly-lit environments without task-specific training data (zero-shot). The system leverages Vision Language Model prompting to guide a Semantic Diffusion pipeline, producing perceptually accurate, well-lit outputs. Benchmarked on the LOL dataset against leading models including EnlightenGAN, Zero-DCE, and others using PSNR, SSIM, LPIPS, and FID metrics.
  </p>
</div>
<footer>
  <span>© 2025 Abhijith R</span>
  <span>Adoor, Kerala — India</span>
</footer>`; }

// ── CONTACT ───────────────────────────────
function contact() { return `
<div class="section-label"><span>Contact</span><span class="section-num">05</span></div>
<div class="contact-hero">
  <div class="contact-left reveal">
    <div>
      <h2>Let's<br><em>build</em><br>something.</h2>
      <div class="contact-item">
        <div class="contact-item-label">Email</div>
        <a href="mailto:abhijithnair433@gmail.com" class="contact-item-val">abhijithnair433@gmail.com</a>
      </div>
      <div class="contact-item">
        <div class="contact-item-label">Phone</div>
        <a href="tel:+918111952603" class="contact-item-val">+91 8111 952 603</a>
      </div>
      <div class="contact-item">
        <div class="contact-item-label">LinkedIn</div>
        <a href="https://www.linkedin.com/in/abhijith-r-b7778b257" target="_blank" class="contact-item-val">linkedin.com/in/abhijith-r-b7778b257</a>
      </div>
      <div class="contact-item">
        <div class="contact-item-label">GitHub</div>
        <a href="https://github.com/abhijithnair433" target="_blank" class="contact-item-val">github.com/abhijithnair433</a>
      </div>
      <div class="contact-item">
        <div class="contact-item-label">Location</div>
        <span class="contact-item-val" style="cursor:default;">Adoor, Kerala, India</span>
      </div>
    </div>
    <div class="contact-langs">
      <div class="contact-langs-title">Languages spoken</div>
      <span class="lang-pill">Malayalam</span>
      <span class="lang-pill">English</span>
      <span class="lang-pill">Hindi</span>
    </div>
  </div>
  <div class="contact-right">
    <div class="contact-big-text">GET<br>IN<br>TOUCH</div>
  </div>
</div>
<div class="contact-cta-strip">
  <div class="contact-cta-item">
    <div class="contact-cta-icon">✉</div>
    <div class="contact-cta-title">Send a mail</div>
    <div class="contact-cta-desc">Reach out for opportunities, collaborations, or just to say hello.</div>
    <a href="mailto:abhijithnair433@gmail.com" class="contact-cta-link">abhijithnair433@gmail.com →</a>
  </div>
  <div class="contact-cta-item">
    <div class="contact-cta-icon">⌥</div>
    <div class="contact-cta-title">See the code</div>
    <div class="contact-cta-desc">Browse my public repositories, open source work, and project archives.</div>
    <a href="https://github.com/abhijithnair433" target="_blank" class="contact-cta-link">github.com/abhijithnair433 →</a>
  </div>
  <div class="contact-cta-item">
    <div class="contact-cta-icon">◈</div>
    <div class="contact-cta-title">Connect</div>
    <div class="contact-cta-desc">Let's connect professionally — I'm open to full-time, part-time, and remote roles.</div>
    <a href="https://www.linkedin.com/in/abhijith-r-b7778b257" target="_blank" class="contact-cta-link">LinkedIn profile →</a>
  </div>
</div>
<footer>
  <span>© 2025 Abhijith R</span>
  <span>Adoor, Kerala — India</span>
</footer>`; }
