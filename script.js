/* ── Global Toast Notification Helper ── */
window.showToast = function(txt) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = txt;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
};

/* ── Global Theme Toggle (Immediate & Always Available with Debounce Guard) ── */
var themeToggleLock = false;
window.toggleTheme = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  if (themeToggleLock) return;
  themeToggleLock = true;
  setTimeout(function() { themeToggleLock = false; }, 300);

  var cur = document.documentElement.getAttribute('data-theme') || 'dark';
  var next = cur === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  if (document.body) document.body.setAttribute('data-theme', next);
  try { localStorage.setItem('site_theme', next); } catch(e) {}

  document.querySelectorAll('#themeToggle, .theme-toggle-btn, .glossy-theme-btn').forEach(function(btn) {
    btn.setAttribute('title', next === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });

  if (typeof window.showToast === 'function') {
    window.showToast(next === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
  }
};

(function () {
  try {
    var saved = localStorage.getItem('site_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    if (document.body) document.body.setAttribute('data-theme', saved);
  } catch (e) {}
})();

/* ── Page view counter ── */
(function () {
  try {
    var v = parseInt(localStorage.getItem('site_page_views') || '1280', 10) + 1;
    localStorage.setItem('site_page_views', String(v));
    localStorage.setItem('last_visit', new Date().toISOString());
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ────────────────────────────────────────
     DYNAMIC RESUME & SOCIAL LINKS SYNC CONTROLLER
  ─────────────────────────────────────────── */
  (function syncLinks() {
    var rData = localStorage.getItem('custom_resume_data');
    var rUrl = localStorage.getItem('custom_resume');
    var rTarget = rData || rUrl;
    if (rTarget) {
      document.querySelectorAll('a[href*="resume.pdf"], a.btn-primary[download], #resumeBtn').forEach(function(a) {
        a.href = rTarget;
        a.target = '_blank';
        if (rData && rData.indexOf('data:') === 0) a.download = 'Balaji_Chitrarasu_Resume.pdf';
      });
    }

    var gh = localStorage.getItem('custom_github');
    if (gh) {
      document.querySelectorAll('a[href*="github.com"]').forEach(function(a) { a.href = gh; });
    }

    var li = localStorage.getItem('custom_linkedin');
    if (li) {
      document.querySelectorAll('a[href*="linkedin.com"]').forEach(function(a) { a.href = li; });
    }

    var em = localStorage.getItem('custom_email');
    if (em) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function(a) { a.href = 'mailto:' + em; });
    }
  })();

  /* ────────────────────────────────────────
     CMS: Profile avatar / name from admin
     IMPORTANT: Validate the saved URL first —
     a corrupt localStorage value was hiding the photo
  ─────────────────────────────────────────── */
  (function applyCMS() {
    function loadLocal() {
      var imgEl = document.getElementById('heroAvatarImg');
      if (imgEl) {
        var savedAvatar = '';
        try { savedAvatar = localStorage.getItem('custom_profile_avatar') || ''; } catch (e) {}
        if (savedAvatar && savedAvatar.trim() !== '') {
          imgEl.src = savedAvatar;
        } else {
          imgEl.src = 'profile.jpg?v=28.0';
        }
        imgEl.onerror = function () {
          this.onerror = null;
          this.src = 'profile.jpg?v=28.0';
        };
      }

      var nm = '';
      try { nm = localStorage.getItem('custom_profile_name') || ''; } catch (e) {}
      if (nm) {
        var ni = document.getElementById('heroNameEl');
        if (ni) ni.textContent = nm;
      }
    }

    loadLocal();

    if (window.PortfolioAPI && window.PortfolioAPI.fetchGlobalCMSData) {
      window.PortfolioAPI.fetchGlobalCMSData().then(function(cloudData) {
        if (cloudData) {
          loadLocal();
          if (typeof renderCerts === 'function') renderCerts();
          if (typeof renderProjects === 'function') renderProjects();
          if (typeof renderSkills === 'function') renderSkills();
        }
      });
    }
  })();

  /* ────────────────────────────────────────
     DYNAMIC SECTION VISIBILITY CONTROLLER
     Controls all 13 portfolio sections via ON/OFF switches
  ─────────────────────────────────────────── */
  function applySectionVisibilities() {
    var map = [
      { key: 'hide_avail', sel: '.avail-banner' },
      { key: 'hide_stats', sel: '#stats' },
      { key: 'hide_about', sel: '#about' },
      { key: 'hide_ticker', sel: '.logo-ticker-wrap' },
      { key: 'hide_experience', sel: '#experience' },
      { key: 'hide_projects', sel: '#projects' },
      { key: 'hide_skills', sel: '#skills' },
      { key: 'hide_certifications', sel: '#certifications' },
      { key: 'hide_events', sel: '#events' },
      { key: 'hide_achievements', sel: '#achievements' },
      { key: 'hide_recommendations', sel: '#recommendations', defaultHide: true },
      { key: 'hide_github', sel: '#github' },
      { key: 'hide_contact', sel: '#contact' }
    ];

    map.forEach(function(item) {
      var val = localStorage.getItem(item.key);
      var isHidden = false;

      if (val === 'true') {
        isHidden = true;
      } else if (val === 'false') {
        isHidden = false;
      } else if (item.defaultHide) {
        isHidden = true;
      }

      document.querySelectorAll(item.sel).forEach(function(el) {
        el.style.display = isHidden ? 'none' : '';
      });

      if (item.sel.indexOf('#') === 0) {
        var navLink = document.querySelector('.navbar a[href="' + item.sel + '"]');
        if (navLink) {
          navLink.style.display = isHidden ? 'none' : '';
        }
      }
    });
  }

  applySectionVisibilities();

  /* ────────────────────────────────────────
     TYPING ANIMATION
     Uses a dedicated cursor <span> so there's
     no clash with ::after pseudo-elements
  ─────────────────────────────────────────── */
  var tyEl = document.getElementById('typing');
  var cursorEl = document.querySelector('.hero-type-cursor');
  if (tyEl) {
    var titles = [
      'AWS Cloud Engineer Intern',
      'B.E. ECE Student · Coimbatore',
      'Full-Stack ERM Developer',
      'Embedded Systems & IoT Builder',
      'Anthropic AI Fluency Certified'
    ];
    var ti = 0, ci = 0, del = false, speed = 90;

    function type() {
      var cur = titles[ti];
      if (del) {
        ci--;
        speed = 40;
      } else {
        ci++;
        speed = 90;
      }
      tyEl.textContent = cur.substring(0, ci);

      if (!del && ci === cur.length) { speed = 2600; del = true; }
      else if (del && ci === 0) { del = false; ti = (ti + 1) % titles.length; speed = 380; }

      setTimeout(type, speed);
    }
    setTimeout(type, 800);
  }

  /* ────────────────────────────────────────
     PARTICLES.JS
  ─────────────────────────────────────────── */
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    try {
      particlesJS('particles-js', {
        particles: {
          number: { value: 35, density: { enable: true, value_area: 950 } },
          color: { value: '#64ffda' },
          shape: { type: 'circle' },
          opacity: { value: 0.09, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.02 } },
          size: { value: 1.8, random: true },
          line_linked: { enable: true, distance: 140, color: '#64ffda', opacity: 0.06, width: 1 },
          move: { enable: true, speed: 0.45, random: true, out_mode: 'out' }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'grab' }, resize: true },
          modes: { grab: { distance: 140, line_linked: { opacity: 0.2 } } }
        },
        retina_detect: true
      });
    } catch (e) {}
  }

  /* ────────────────────────────────────────
     NAVBAR: hide on scroll down, show on up
  ─────────────────────────────────────────── */
  var nav = document.getElementById('navbar');
  var lastY = 0;
  if (nav) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > lastY && y > 120) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      nav.classList.toggle('scrolled', y > 40);
      lastY = Math.max(y, 0);
    }, { passive: true });
  }

  /* ────────────────────────────────────────
     ACTIVE NAV LINK on section scroll
  ─────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var navLinks = document.querySelectorAll('.navbar ul li a[href^="#"]');
    document.querySelectorAll('section[id], header[id]').forEach(function (s) {
      new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var al = document.querySelector('.navbar ul li a[href="#' + s.id + '"]');
          if (al) al.classList.add('active');
        }
      }, { threshold: 0.4 }).observe(s);
    });
  }

  /* ────────────────────────────────────────
     PROFESSIONAL NAVBAR CLICK SECTION BLINK & PULSE REVEAL
  ─────────────────────────────────────────── */
  var allNavAnchors = document.querySelectorAll('.navbar ul li a[href^="#"], .hero-ctas a[href^="#"], .avail-cta[href^="#"]');
  var progLine = document.getElementById('navProgressLine');
  var transOverlay = document.getElementById('pageTransitionOverlay');

  allNavAnchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.indexOf('#') !== 0) return;
      var targetSec = document.querySelector(targetId);
      if (!targetSec) return;

      e.preventDefault();

      if (progLine) {
        progLine.style.width = '0%';
        progLine.classList.add('active');
        setTimeout(function() { progLine.style.width = '100%'; }, 20);
        setTimeout(function() {
          progLine.classList.remove('active');
          progLine.style.width = '0%';
        }, 380);
      }

      if (transOverlay) {
        transOverlay.classList.remove('blink-active');
        void transOverlay.offsetWidth;
        transOverlay.classList.add('blink-active');
      }

      setTimeout(function() {
        var topY = targetSec.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: topY, behavior: 'auto' });

        targetSec.classList.remove('section-pulse-active');
        void targetSec.offsetWidth;
        targetSec.classList.add('section-pulse-active');

        var secTitle = targetSec.querySelector('.sec-title');
        if (secTitle) {
          secTitle.classList.remove('sec-title-pulse');
          void secTitle.offsetWidth;
          secTitle.classList.add('sec-title-pulse');
        }

        setTimeout(function() {
          targetSec.classList.remove('section-pulse-active');
        }, 1300);
      }, 140);
    });
  });

  /* ────────────────────────────────────────
     REVEAL ON SCROLL (fixed NodeList bug)
  ─────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el) { el.classList.add('visible'); });

  /* ────────────────────────────────────────
     DYNAMIC SKILLS RENDERING
     Reads from admin's localStorage custom_skills
     or falls back to hardcoded defaults
  ─────────────────────────────────────────── */
  var DEFAULT_SKILLS = [
    { name: 'AWS Cloud (EC2, S3, CloudFront, IAM, RDS, VPC, CloudWatch, CLI)', icon: 'amazonaws', pct: 92 },
    { name: 'Network Architecture (VPC, Subnets, Route Tables, Security Groups)', icon: 'cisco', pct: 88 },
    { name: 'Programming (Python, C, Java, JavaScript, REST APIs)', icon: 'python', pct: 85 },
    { name: 'Databases & Storage (MySQL, Amazon RDS, SQL queries)', icon: 'mysql', pct: 84 },
    { name: 'Embedded Systems & IoT (Arduino, IR, LDR, Solar, Boost Converter)', icon: 'arduino', pct: 86 },
    { name: 'Dev Tools (Git, GitHub, Linux Bash, Postman, AWS CLI)', icon: 'git', pct: 90 }
  ];

  function renderSkills() {
    var container = document.getElementById('skillBarsContainer');
    if (!container) return;

    var skills = DEFAULT_SKILLS;
    try {
      var saved = localStorage.getItem('custom_skills');
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) skills = parsed;
      }
    } catch (e) {}

    container.innerHTML = skills.map(function (s) {
      var iconSrc = '';
      if (s.icon && typeof s.icon === 'string') {
        var clean = s.icon.split('/')[0].trim().toLowerCase();
        if (clean === 'amazonaws' || clean === 'aws') {
          iconSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338bdf8'%3E%3Cpath d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/%3E%3C/svg%3E";
        } else if (/^[a-z0-9]+$/i.test(clean)) {
          iconSrc = 'https://cdn.simpleicons.org/' + clean;
        }
      }
      var iconEl = iconSrc
        ? '<img class="skill-icon" src="' + iconSrc + '" alt="" width="20" height="20" style="object-fit:contain;">'
        : '<span class="skill-icon">' + (s.icon || '⚡') + '</span>';

      return '<div class="skill-bar-item reveal">' +
        '<div class="skill-top">' +
          iconEl +
          '<span class="skill-name">' + s.name + '</span>' +
          '<span class="skill-pct">' + s.pct + '%</span>' +
        '</div>' +
        '<div class="sbar-track"><div class="sbar-fill" data-w="' + s.pct + '"></div></div>' +
      '</div>';
    }).join('');

    /* Re-observe new .reveal elements */
    if (typeof revealObs !== 'undefined') {
      container.querySelectorAll('.reveal').forEach(function (el) {
        revealObs.observe(el);
      });
    } else {
      container.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  renderSkills();

  var DEFAULT_PROJECTS = [
    {
      id: 'proj_1',
      title: 'ZentroShift ERM App',
      category: 'cloud',
      status: 'completed',
      progress: 100,
      image: 'project2.jpg',
      tags: 'EC2, S3, RDS, CloudFront, VPC',
      summary: 'Full-stack ERM system deployed across 6 AWS services with custom VPC, IAM roles, and CloudWatch monitoring.',
      details: 'During my internship at ZenFuture Technologies (June–July 2026), I built and deployed ZentroShift — a full-stack ERM system across 6 AWS services: EC2 (server), S3 (assets), CloudFront (CDN), RDS (MySQL database), custom VPC (with public subnets, Internet Gateway, NAT Gateway, security groups), and CloudWatch (server health alarms).'
    },
    {
      id: 'proj_2',
      title: 'Smart Solar Crossing',
      category: 'embedded',
      status: 'completed',
      progress: 100,
      image: 'project3.jpg',
      tags: 'Arduino, IR Sensor, Solar, LDR',
      summary: 'Arduino-powered pedestrian crossing alert system with solar panel, boost converter battery management, IR & LDR sensors.',
      details: 'Designed and built a solar-powered zebra crossing alert system. Hardware: Arduino Uno, IR sensors (pedestrian detection), LDR (ambient light sensing), solar panel, boost converter (battery charge management), Li-ion battery pack, LEDs, and a buzzer.'
    },
    {
      id: 'proj_3',
      title: 'Developer Portfolio',
      category: 'web',
      status: 'ongoing',
      progress: 85,
      image: 'project1.jpg',
      tags: 'HTML5, CSS3, JavaScript, Node.js',
      summary: 'Responsive developer portfolio website with 9-tab admin panel CMS, tech blog, dynamic progress bars, and real SVG tech icons.',
      details: 'Built a responsive developer portfolio showcasing AWS cloud projects, embedded systems hardware, and full-stack web applications.'
    }
  ];

  var DEFAULT_CERTS = [
    {
      id: 'cert_1',
      title: 'AWS Cloud Engineer Intern',
      org: 'ZenFuture Technologies',
      date: 'ZF-INTERN-0026 · June–July 2026',
      desc: 'Completed hands-on AWS Cloud internship. Deployed ZentroShift full-stack ERM app on EC2, S3, RDS, CloudFront, VPC, and CloudWatch with 4-tier IAM access control.',
      image: 'cert1.jpg',
      badgeText: '☁️ Production Certified',
      badgeClass: 'badge-teal'
    },
    {
      id: 'cert_2',
      title: 'AI Fluency Frameworks',
      org: 'Anthropic',
      date: 'Certified · 2025',
      desc: 'Certified by Anthropic in AI frameworks, LLM system architecture, prompt engineering, and AI safety foundations.',
      image: 'cert3.jpg',
      badgeText: '🤖 AI Certified',
      badgeClass: 'badge-violet'
    },
    {
      id: 'cert_3',
      title: 'Industry 4.0 & IIoT',
      org: 'NPTEL · IIT Kharagpur',
      date: 'NPTEL24CS112 · 2024',
      desc: 'Completed 12-week proctored NPTEL course on Industrial IoT funded by the Ministry of Education, Government of India.',
      image: 'cert2.jpg',
      badgeText: '🏭 IoT Certified',
      badgeClass: 'badge-teal'
    },
    {
      id: 'cert_4',
      title: 'Software Engineer Certificate',
      org: 'HackerRank',
      date: 'Role Certification (2024)',
      desc: 'Verified proficiency in data structures, algorithms, problem solving, and software design.',
      image: 'cert4.jpg',
      badgeText: '💻 Verified',
      badgeClass: 'badge-teal'
    }
  ];

  /* ────────────────────────────────────────
     DYNAMIC PROJECTS RENDERING
     Reads from admin's localStorage custom_projects
  ─────────────────────────────────────────── */
  function renderProjects() {
    var container = document.getElementById('projectsContainer');
    if (!container) return;

    var saved = null;
    try {
      saved = localStorage.getItem('custom_projects');
      if (saved) saved = JSON.parse(saved);
    } catch (e) {}

    if (!Array.isArray(saved) || saved.length === 0) {
      saved = DEFAULT_PROJECTS;
    }

    container.innerHTML = saved.map(function (p) {
      var status = p.status || 'ongoing';
      var progress = p.progress !== undefined ? p.progress : (status === 'completed' ? 100 : 65);
      var statusBadge = status === 'completed' 
        ? '<span class="proj-status-badge status-completed">✓ Completed</span>'
        : (status === 'planned' 
          ? '<span class="proj-status-badge status-planned">◷ Planned</span>'
          : '<span class="proj-status-badge status-ongoing">◉ Ongoing</span>');

      var progressHtml = '<div class="proj-status-bar">' +
        statusBadge +
        '<div class="proj-progress-track"><div class="proj-progress-fill" style="width:' + progress + '%"></div></div>' +
        (status === 'ongoing' ? '<span class="proj-progress-pct">' + progress + '%</span>' : '') +
      '</div>';

      var tagsHtml = (p.tags || '').split(',').map(function(t) {
        return '<span class="ptag">' + t.trim() + '</span>';
      }).join('');

      var catLabel = p.category === 'cloud' ? 'AWS Cloud · Full-Stack' :
                     p.category === 'embedded' ? 'Embedded Systems · IoT' :
                     p.category === 'web' ? 'Web Development' : (p.category || 'Project');

      var imgSrc = p.image || p.img || 'project1.jpg';
      var escTitle = (p.title || '').replace(/'/g, "\\'");
      var escDetails = (p.details || p.summary || '').replace(/'/g, "\\'");
      var escGallery = (p.gallery || p.image || p.img || '').replace(/'/g, "\\'");

      return '<div class="proj-card reveal" data-category="' + (p.category || 'all') + '" onclick="openPopup(\'' + escTitle + '\',\'' + escDetails + '\',\'' + escGallery + '\')">' +
        '<div class="proj-thumb">' +
          '<img src="' + imgSrc + '" alt="' + (p.title || '') + '">' +
          '<div class="proj-thumb-overlay"><span style="font-size:1.6rem">↗</span><p>View Details</p></div>' +
        '</div>' +
        '<div class="proj-body">' +
          '<span class="proj-cat">' + catLabel + '</span>' +
          progressHtml +
          '<h3 class="proj-title">' + (p.title || '') + '</h3>' +
          '<p class="proj-desc">' + (p.summary || p.details || '') + '</p>' +
          '<div class="proj-tags">' + tagsHtml + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    /* Re-observe new .reveal elements */
    if (typeof revealObs !== 'undefined') {
      container.querySelectorAll('.reveal').forEach(function (el) {
        revealObs.observe(el);
      });
    } else {
      container.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  renderProjects();

  /* ────────────────────────────────────────
     DYNAMIC CERTIFICATIONS RENDERING
     Reads from admin's localStorage custom_certs
  ─────────────────────────────────────────── */
  function renderCerts() {
    var container = document.getElementById('visualCertGallery');
    if (!container) return;

    var saved = null;
    try {
      saved = localStorage.getItem('custom_certs');
      if (saved) saved = JSON.parse(saved);
    } catch (e) {}

    // Baseline master list of 4 default certificates
    var masterList = DEFAULT_CERTS.map(function(c) {
      return {
        id: c.id,
        title: c.title,
        org: c.org,
        date: c.date,
        desc: c.desc,
        image: c.image,
        badgeText: c.badgeText,
        badgeClass: c.badgeClass
      };
    });

    if (Array.isArray(saved) && saved.length > 0) {
      // Merge updates for default 4 certificates
      masterList.forEach(function(m) {
        var userVer = saved.find(function(s) { return String(s.id) === String(m.id); });
        if (userVer) {
          if (userVer.title) m.title = userVer.title;
          if (userVer.org || userVer.issuer) m.org = userVer.org || userVer.issuer;
          if (userVer.date || userVer.status) m.date = userVer.date || userVer.status;
          if (userVer.desc || userVer.description) m.desc = userVer.desc || userVer.description;
          if (userVer.image && userVer.image.indexOf('WhatsApp_Image_') === -1) m.image = userVer.image;
        }
      });

      // Append any newly added custom certificates beyond the master 4
      saved.forEach(function(s) {
        var isMaster = masterList.some(function(m) { return String(m.id) === String(s.id); });
        if (!isMaster) {
          if (s.image && s.image.indexOf('WhatsApp_Image_') > -1 && s.image.indexOf('data:') !== 0) return;
          masterList.push(s);
        }
      });
    }

    container.innerHTML = masterList.map(function (c, idx) {
      var title = c.title || 'Certification';
      var issuer = c.org || c.issuer || 'Issuer';
      var statusDate = c.date || c.status || '';
      var desc = c.desc || c.description || '';
      var image = (c.image !== undefined && c.image !== null) ? String(c.image).trim() : (c.img ? String(c.img).trim() : '');

      var defaultMap = {
        'cert_1': 'cert1.jpg',
        'cert_2': 'cert3.jpg',
        'cert_3': 'cert2.jpg',
        'cert_4': 'cert4.jpg'
      };
      if (!image || image.trim() === '' || image.indexOf('WhatsApp_Image_') > -1 || (c.id === 'cert_3' && image === 'cert1.jpg')) {
        image = defaultMap[c.id] || (idx === 0 ? 'cert1.jpg' : (idx === 1 ? 'cert3.jpg' : (idx === 2 ? 'cert2.jpg' : (idx === 3 ? 'cert4.jpg' : ''))));
      }

      var badgeText = c.badgeText || (issuer.indexOf('AWS') > -1 || title.indexOf('AWS') > -1 ? '☁️ Production Certified' : '🏆 Certified');
      var badgeClass = c.badge || (issuer.indexOf('Anthropic') > -1 ? 'badge-violet' : 'badge-teal');

      var escTitle = title.replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ');
      var escIssuer = issuer.replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ');
      var escStatus = statusDate.replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ');
      var escDesc = desc.replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ');
      var escImg = image.replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ');

      var isPdf = (image.indexOf('data:application/pdf') === 0 || image.toLowerCase().endsWith('.pdf'));
      var imgHtml = '';
      if (!image) {
        imgHtml = '<div class="cert-no-img"><span class="cert-no-img-icon">📜</span><span class="cert-no-img-text">No Image Uploaded</span></div>';
      } else if (isPdf) {
        imgHtml = '<div style="height:150px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); color:var(--teal); font-weight:700; flex-direction:column; gap:0.5rem;"><span style="font-size:2.5rem;">📄</span><span style="font-size:0.8rem; font-family:\'DM Mono\',monospace;">PDF Certificate Document</span></div>';
      } else {
        imgHtml = '<img src="' + image + '" alt="' + title + '">';
      }

      return '<div class="cert-card reveal visible" onclick="openCertImg(\'' + escTitle + '\',\'' + escIssuer + '\',\'' + escStatus + '\',\'' + escDesc + '\',\'' + escImg + '\')">' +
        '<div class="cert-img-wrap">' +
          imgHtml +
          '<div class="cert-hover-overlay"><span style="font-size:1.5rem">🔍</span><p>' + (image ? 'View Certificate' : 'View Details') + '</p></div>' +
        '</div>' +
        '<div class="cert-body">' +
          '<h4>' + title + '</h4>' +
          '<p>' + issuer + (statusDate ? ' · ' + statusDate : '') + '</p>' +
          '<span class="cert-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    if (typeof revealObs !== 'undefined') {
      container.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });
    } else {
      container.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
    }

    setTimeout(renderCertSliderDots, 200);
  }

  renderCerts();

  /* GLOBAL CLOUD BACKEND CERTIFICATE HYDRATION FOR ALL DEVICES GLOBALLY */
  function syncCertsFromCloud() {
    if (window.PortfolioAPI && typeof window.PortfolioAPI.getCerts === 'function') {
      window.PortfolioAPI.getCerts().then(function(cloudCerts) {
        if (Array.isArray(cloudCerts) && cloudCerts.length > 0) {
          try {
            localStorage.setItem('custom_certs', JSON.stringify(cloudCerts));
          } catch(e) {}
          renderCerts();
        }
      }).catch(function() {});
    }
  }

  setTimeout(syncCertsFromCloud, 600);

  /* ────────────────────────────────────────
     INTERACTIVE CERTIFICATE SLIDER TICKER & ANDROID TOUCH SWIPE
  ─────────────────────────────────────────── */
  var certAutoSlideReq = null;
  var isCertUserInteracting = false;
  var certResumeTimeout = null;

  window.scrollCertSlider = function(direction) {
    var wrapper = document.getElementById('certSliderWrapper');
    if (!wrapper) return;
    stopCertAutoSlide();
    var cardWidth = 315;
    wrapper.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    updateCertSliderDots();
    scheduleCertResume();
  };

  function stepCertMarquee() {
    if (isCertUserInteracting) return;
    var wrapper = document.getElementById('certSliderWrapper');
    if (wrapper) {
      var maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
      if (maxScrollLeft > 0) {
        if (wrapper.scrollLeft >= maxScrollLeft - 2) {
          wrapper.scrollLeft = 0;
        } else {
          wrapper.scrollLeft += 0.75;
        }
        updateCertSliderDots();
      }
    }
    certAutoSlideReq = requestAnimationFrame(stepCertMarquee);
  }

  window.startCertAutoSlide = function() {
    isCertUserInteracting = false;
    if (certAutoSlideReq) cancelAnimationFrame(certAutoSlideReq);
    var statusBadge = document.getElementById('certAutoSlideStatus');
    if (statusBadge) {
      statusBadge.innerText = '⚡ Auto-Slide Active';
      statusBadge.style.color = 'var(--teal)';
      statusBadge.style.borderColor = 'rgba(100,255,218,0.25)';
    }
    certAutoSlideReq = requestAnimationFrame(stepCertMarquee);
  };

  window.stopCertAutoSlide = function() {
    isCertUserInteracting = true;
    if (certAutoSlideReq) cancelAnimationFrame(certAutoSlideReq);
    if (certResumeTimeout) clearTimeout(certResumeTimeout);

    var statusBadge = document.getElementById('certAutoSlideStatus');
    if (statusBadge) {
      statusBadge.innerText = '⏸️ Paused (Interactive)';
      statusBadge.style.color = 'var(--amber)';
      statusBadge.style.borderColor = 'rgba(251,191,36,0.3)';
    }
  };

  function scheduleCertResume() {
    if (certResumeTimeout) clearTimeout(certResumeTimeout);
    certResumeTimeout = setTimeout(function() {
      startCertAutoSlide();
    }, 2800);
  }

  function updateCertSliderDots() {
    var wrapper = document.getElementById('certSliderWrapper');
    var dotsContainer = document.getElementById('certSliderDots');
    var gallery = document.getElementById('visualCertGallery');
    if (!wrapper || !dotsContainer || !gallery) return;

    var cards = gallery.querySelectorAll('.cert-card');
    if (cards.length <= 1) {
      dotsContainer.innerHTML = '';
      return;
    }

    var cardWidth = 315;
    var activeIdx = Math.round(wrapper.scrollLeft / cardWidth);

    dotsContainer.innerHTML = Array.from(cards).map(function(_, idx) {
      var isActive = (idx === activeIdx || (idx === cards.length - 1 && wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10));
      return '<span class="cert-dot ' + (isActive ? 'active' : '') + '" onclick="jumpToCertSlide(' + idx + ')"></span>';
    }).join('');
  }

  window.jumpToCertSlide = function(index) {
    var wrapper = document.getElementById('certSliderWrapper');
    if (!wrapper) return;
    stopCertAutoSlide();
    wrapper.scrollTo({ left: index * 315, behavior: 'smooth' });
    setTimeout(updateCertSliderDots, 350);
    scheduleCertResume();
  };

  function renderCertSliderDots() {
    updateCertSliderDots();
  }

  // Setup Android Touch Navigation & Dragging
  setTimeout(function() {
    renderCertSliderDots();
    startCertAutoSlide();

    var wrapper = document.getElementById('certSliderWrapper');
    if (!wrapper) return;

    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;

    // Touch events for Android / Mobile
    wrapper.addEventListener('touchstart', function(e) {
      stopCertAutoSlide();
      isDown = true;
      startX = e.touches[0].pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    }, { passive: true });

    wrapper.addEventListener('touchmove', function(e) {
      if (!isDown) return;
      var x = e.touches[0].pageX - wrapper.offsetLeft;
      var walk = (x - startX) * 1.5;
      wrapper.scrollLeft = scrollLeft - walk;
      updateCertSliderDots();
    }, { passive: true });

    wrapper.addEventListener('touchend', function() {
      isDown = false;
      scheduleCertResume();
    });

    // Mouse drag for desktop
    wrapper.addEventListener('mousedown', function(e) {
      stopCertAutoSlide();
      isDown = true;
      wrapper.style.cursor = 'grabbing';
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', function() {
      if (isDown) {
        isDown = false;
        wrapper.style.cursor = 'grab';
        scheduleCertResume();
      }
    });

    wrapper.addEventListener('mouseup', function() {
      if (isDown) {
        isDown = false;
        wrapper.style.cursor = 'grab';
        scheduleCertResume();
      }
    });

    wrapper.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - wrapper.offsetLeft;
      var walk = (x - startX) * 1.8;
      wrapper.scrollLeft = scrollLeft - walk;
      updateCertSliderDots();
    });

    wrapper.addEventListener('scroll', function() {
      updateCertSliderDots();
    }, { passive: true });
  }, 350);

  /* ────────────────────────────────────────
     SKILL BAR ANIMATION
  ─────────────────────────────────────────── */
  function animateBars() {
    document.querySelectorAll('.sbar-fill').forEach(function (f) {
      var w = f.getAttribute('data-w');
      if (w) f.style.width = w + '%';
    });
  }

  if ('IntersectionObserver' in window) {
    var skillsSection = document.getElementById('skills');
    if (skillsSection) {
      var barsObs = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) { animateBars(); barsObs.disconnect(); }
      }, { threshold: 0.1 });
      barsObs.observe(skillsSection);
    }
  } else {
    setTimeout(animateBars, 600);
  }

  /* ────────────────────────────────────────
     STATS COUNTER — Fixed: fires on load
     AND on scroll, whichever comes first
  ─────────────────────────────────────────── */
  /* ────────────────────────────────────────
     LIVE DYNAMIC STATS COUNTER SYNC WITH DATABASE
  ─────────────────────────────────────────── */
  function updateDynamicStatTargets() {
    var projNumEl = document.getElementById('statProjNum');
    if (projNumEl) {
      var savedProjs = null;
      try { savedProjs = JSON.parse(localStorage.getItem('custom_projects')); } catch (e) {}
      var projCount = (Array.isArray(savedProjs) && savedProjs.length > 0) ? savedProjs.length : 3;
      projNumEl.setAttribute('data-target', String(projCount));
    }

    var certNumEl = document.getElementById('statCertNum');
    if (certNumEl) {
      var savedCerts = null;
      try { savedCerts = JSON.parse(localStorage.getItem('custom_certs')); } catch (e) {}
      var certCount = (Array.isArray(savedCerts) && savedCerts.length > 0) ? savedCerts.length : 4;
      certNumEl.setAttribute('data-target', String(certCount));
    }
  }

  function runCounters() {
    updateDynamicStatTargets();

    document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var start = null;
      var duration = 1200;

      function step(ts) {
        if (!start) start = ts;
        var elapsed = ts - start;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  var statsEl = document.getElementById('stats');
  runCounters();

  /* ────────────────────────────────────────
     DYNAMIC EXPERIENCE TIMELINE RENDERING
  ─────────────────────────────────────────── */
  function renderTimeline() {
    var container = document.getElementById('timelineContainer');
    if (!container) return;

    var saved = null;
    try {
      saved = localStorage.getItem('custom_timeline');
      if (saved) saved = JSON.parse(saved);
    } catch (e) {}

    if (!Array.isArray(saved) || saved.length === 0) {
      saved = [
        {
          date: 'JUNE 2026 — JULY 2026',
          role: 'AWS Cloud Engineer Intern',
          org: 'ZenFuture Technologies · Coimbatore, India (Cert No. ZF-INTERN-0026)',
          desc: 'Built and deployed ZentroShift ERM across 6 AWS services: EC2, S3, CloudFront, RDS, VPC, and CloudWatch alarms.'
        },
        {
          date: '2023 — PRESENT',
          role: 'Freelance IT Support & Digital Designer',
          org: 'Self-Employed · Coimbatore, India',
          desc: 'Hardware troubleshooting, software setup, and digital design deliverables for small business clients.'
        },
        {
          date: '2023 — 2027',
          role: 'B.E. Electronics & Communication Engineering',
          org: 'United Institute of Technology · Coimbatore, Tamil Nadu (CGPA: 7.13 / 10)',
          desc: 'Awarded Exemplary Achiever Award by ECE department. Serving as IIC Innovation Ambassador.'
        },
        {
          date: '2021 — 2023',
          role: 'Higher Secondary Certificate (Class XII)',
          org: 'Govt. Hr. Sec. School, Hale Dharmapuri · Tamil Nadu State Board',
          desc: 'Completed Higher Secondary Certificate with focus on Physics, Chemistry, and Mathematics.'
        }
      ];
    }

    container.innerHTML = saved.map(function(t) {
      return '<div class="tl-item reveal visible">' +
        '<p class="tl-date">' + (t.date || '') + '</p>' +
        '<h3 class="tl-role">' + (t.role || '') + '</h3>' +
        '<p class="tl-org">' + (t.org || '') + '</p>' +
        '<p class="tl-desc">' + (t.desc || '') + '</p>' +
      '</div>';
    }).join('');
  }

  renderTimeline();

  /* ────────────────────────────────────────
     DYNAMIC EVENTS & ACHIEVEMENTS RENDERING
  ─────────────────────────────────────────── */
  function renderEvents() {
    var container = document.getElementById('achievementsContainer');
    if (!container) return;

    var saved = null;
    try {
      saved = localStorage.getItem('custom_events');
      if (saved) saved = JSON.parse(saved);
    } catch (e) {}

    if (!Array.isArray(saved) || saved.length === 0) {
      saved = [
        {
          title: 'Exemplary Achiever Award',
          org: 'Academic Excellence — ECE Department',
          location: 'United Institute of Technology, Coimbatore',
          desc: 'Recognized for outstanding academic performance, leadership, and exemplary contribution in the Department of Electronics and Communication Engineering.',
          icon: '🎖️',
          color: 'gold'
        },
        {
          title: 'Production AWS Setup Across 6 Services',
          org: 'Real Infrastructure — Not a Tutorial Project',
          location: 'ZenFuture Technologies · June–July 2026',
          desc: 'Deployed a real, production-grade AWS setup across 6 services (EC2, S3, CloudFront, RDS, VPC, CloudWatch) during the ZenFuture Technologies internship.',
          icon: '☁️',
          color: 'teal'
        },
        {
          title: 'IIC Student Innovation Ambassador',
          org: 'Ministry of Education Innovation Cell',
          location: 'AICTE & MoE, Government of India',
          desc: 'Student Innovation Ambassador representing United Institute of Technology at the Institution\'s Innovation Council under the Ministry of Education, Government of India.',
          icon: '💡',
          color: 'violet'
        }
      ];
    }

    container.innerHTML = saved.map(function(a) {
      var escTitle = (a.title || '').replace(/'/g, "\\'");
      var escSub = (a.org || '').replace(/'/g, "\\'");
      var escWhere = (a.location || '').replace(/'/g, "\\'");
      var escDesc = (a.desc || '').replace(/'/g, "\\'");
      var icon = a.icon || '🎖️';
      var color = a.color || 'gold';
      var colorClass = color === 'teal' ? 'ach-icon-teal' : (color === 'violet' ? 'ach-icon-violet' : 'ach-icon-gold');

      return '<div class="ach-item reveal visible" onclick="openAch(\'' + escTitle + '\',\'' + escSub + '\',\'' + escWhere + '\',\'' + escDesc + '\',\'' + icon + '\',\'' + color + '\')">' +
        '<div class="ach-left">' +
          '<div class="ach-icon ' + colorClass + '">' + icon + '</div>' +
          '<div><p class="ach-title">' + (a.title || '') + '</p><p class="ach-sub">' + (a.location || a.org || '') + '</p></div>' +
        '</div>' +
        '<span class="ach-arrow">↗</span>' +
      '</div>';
    }).join('');
  }

  renderEvents();

  /* ────────────────────────────────────────
     SOCIAL MEDIA & CONTACT LINKS HYDRATION & vCARD GENERATOR
  ─────────────────────────────────────────── */
  function renderSocialLinks() {
    var linkedin = localStorage.getItem('custom_linkedin_url') || 'https://www.linkedin.com/in/balajichitrarasu';
    var github = localStorage.getItem('custom_github_url') || 'https://github.com/balajichitrarasu';
    var email = localStorage.getItem('custom_email_url') || 'balajichitrarasu07@gmail.com';
    var phone = localStorage.getItem('custom_phone_url') || '+91 76396 83223';
    var website = localStorage.getItem('custom_website_url') || 'https://balajichitrarasu.github.io';

    // Update LinkedIn Links
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(function(a) {
      a.href = linkedin;
    });

    // Update GitHub Links
    document.querySelectorAll('a[href*="github.com"]').forEach(function(a) {
      if (a.getAttribute('href') !== '#github') {
        a.href = github;
      }
    });

    // Update Email Links
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
      a.href = 'mailto:' + email;
    });

    // Update Phone Elements
    document.querySelectorAll('.phone-text-val').forEach(function(el) {
      el.textContent = phone;
    });
  }

  renderSocialLinks();

  window.downloadVCard = function() {
    var name = localStorage.getItem('custom_profile_name') || 'Balaji Chitrarasu';
    var role = localStorage.getItem('custom_profile_role') || 'AWS Cloud Engineer Intern';
    var email = localStorage.getItem('custom_email_url') || 'balajichitrarasu07@gmail.com';
    var phone = localStorage.getItem('custom_phone_url') || '+91 76396 83223';
    var linkedin = localStorage.getItem('custom_linkedin_url') || 'https://www.linkedin.com/in/balajichitrarasu';
    var website = localStorage.getItem('custom_website_url') || 'https://balajichitrarasu.github.io';

    var vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:' + name,
      'TITLE:' + role,
      'TEL;TYPE=CELL:' + phone,
      'EMAIL;TYPE=INTERNET:' + email,
      'URL;TYPE=LinkedIn:' + linkedin,
      'URL;TYPE=Portfolio:' + website,
      'END:VCARD'
    ].join('\n');

    var blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/\s+/g, '_') + '_Contact.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('📇 Contact vCard downloaded! Save directly to phone contacts.');
  };

  /* ────────────────────────────────────────
     DYNAMIC DYNAMIC RESUME LINK & BIO
  ─────────────────────────────────────────── */
  function renderBio() {
    var resumeUrl = localStorage.getItem('custom_resume_pdf') || 'resume.pdf?v=58.0';
    if (!resumeUrl || resumeUrl.trim() === '' || resumeUrl.indexOf('blob:') === 0 || resumeUrl.indexOf('data:') === 0) {
      resumeUrl = 'resume.pdf?v=58.0';
    }
    document.querySelectorAll('a[href*="resume"], a[href*="Resume"], a[href$=".pdf"], .btn-resume').forEach(function(a) {
      if (a.getAttribute('href') !== '#contact') {
        a.href = resumeUrl;
        a.setAttribute('target', '_blank');
      }
    });

    var customCopy = localStorage.getItem('custom_footer_copy');
    if (customCopy && customCopy.trim() !== '') {
      var copyEl = document.getElementById('footerCopyText');
      if (copyEl) copyEl.innerHTML = customCopy;
    }
  }

  renderBio();

  /* ────────────────────────────────────────
     MOBILE NAV TOGGLE
  ─────────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var nav = document.querySelector('.navbar');
  if (toggle && menu && nav) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    /* Close on nav link click (mobile) */
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ────────────────────────────────────────
     CLOSE MODALS on backdrop click / ESC / close buttons
  ─────────────────────────────────────────── */
  ['aboutPopup', 'popup', 'certPopup', 'achPopup', 'cmdPalette'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function (e) {
        if (e.target === el) closeAll();
      });
    }
  });

  document.querySelectorAll('.modal-close, #aboutClose, #popupClose, #certClose, #achClose').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeAll();
    });
  });

  document.addEventListener('click', function(e) {
    var closeBtn = e.target.closest('.modal-close, #popupClose, #aboutClose, #certClose, #achClose, .art-close');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeAll();
      if (typeof closeArticle === 'function') closeArticle();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closeAll();
      if (typeof closeArticle === 'function') closeArticle();
      if (typeof closeCmd === 'function') closeCmd();
    }
  });

  /* ────────────────────────────────────────
     CONTACT FORM
  ─────────────────────────────────────────── */
  var sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      var n  = (document.getElementById('cName')  ? document.getElementById('cName').value  : '').trim();
      var em = (document.getElementById('cEmail') ? document.getElementById('cEmail').value : '').trim();
      var m  = (document.getElementById('cMsg')   ? document.getElementById('cMsg').value   : '').trim();

      if (!n)  return showFormMsg('err', 'Please enter your name.');
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return showFormMsg('err', 'Please enter a valid email address.');
      if (!m)  return showFormMsg('err', 'Please enter a message.');

      var subj = encodeURIComponent('Portfolio Contact from ' + n);
      var body = encodeURIComponent('From: ' + n + ' (' + em + ')\n\n' + m);
      window.location.href = 'mailto:balajichitrarasu07@gmail.com?subject=' + subj + '&body=' + body;
      showFormMsg('ok', '✓ Opening your email client! Alternatively reach me at +91 76396 83223.');
    });
  }

  function showFormMsg(type, text) {
    var el = document.getElementById('formMsg');
    if (!el) return;
    el.className = 'form-msg ' + type;
    el.textContent = text;
    el.style.display = 'block';
    setTimeout(function () { el.style.display = 'none'; }, 6000);
  }

  /* ────────────────────────────────────────
     SCROLL TO TOP BUTTON
  ─────────────────────────────────────────── */
  var topBtn = document.getElementById('scrollTop');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('show', window.scrollY > 450);
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ────────────────────────────────────────
     CARD SPOTLIGHT EFFECT (Linear.app Style)
  ─────────────────────────────────────────── */
  function bindSpotlights() {
    document.querySelectorAll('.glass, .proj-card, .cert-card, .ach-item, .gh-repo').forEach(function (card) {
      if (card._spotlightBound) return;
      card._spotlightBound = true;
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }
  bindSpotlights();

  /* ────────────────────────────────────────
     COMMAND PALETTE (CTRL+K)
  ─────────────────────────────────────────── */
  var cmdBtn = document.getElementById('cmdBtn');
  var cmdModal = document.getElementById('cmdPalette');
  var cmdInput = document.getElementById('cmdInput');
  var cmdResults = document.getElementById('cmdResults');

  if (cmdModal && cmdInput) {
    if (cmdBtn) {
      cmdBtn.addEventListener('click', openCmd);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdModal.style.display === 'flex') {
          closeCmd();
        } else {
          openCmd();
        }
      } else if ((e.key === 'Escape' || e.keyCode === 27) && cmdModal.style.display === 'flex') {
        closeCmd();
      }
    });

    cmdModal.addEventListener('click', function (e) {
      if (e.target === cmdModal) closeCmd();
    });

    cmdInput.addEventListener('input', function () {
      var q = cmdInput.value.toLowerCase().trim();
      var items = cmdResults.querySelectorAll('.cmd-item');
      items.forEach(function (item) {
        var txt = item.textContent.toLowerCase();
        item.style.display = (txt.includes(q)) ? 'flex' : 'none';
      });
    });
  }

}); /* end DOMContentLoaded */

/* ══════════════════════════════════════
   GLOBAL HELPER FUNCTIONS
   (called from HTML onclick attributes and scripts)
   ══════════════════════════════════════ */

window.showToast = function(txt) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = txt;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
};

window.copyEmail = function() {
  var email = 'balajichitrarasu07@gmail.com';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(function () {
      showToast('✓ Email copied to clipboard!');
    }).catch(function () { showToast('Email: ' + email); });
  } else {
    showToast('Email: ' + email);
  }
};

window.filterProjects = function(cat, e) {
  if (e && e.target) {
    var btn = e.target.closest('.fbtn') || e.target;
    document.querySelectorAll('.fbtn').forEach(function (b) { b.classList.remove('active'); });
    if (btn && btn.classList) btn.classList.add('active');
  }
  document.querySelectorAll('.proj-card').forEach(function (c) {
    var catAttr = c.getAttribute('data-category') || '';
    var show = (cat === 'all' || catAttr === cat || catAttr.includes(cat));
    c.style.display = show ? 'flex' : 'none';
  });
};

window.closeAll = function() {
  ['aboutPopup', 'popup', 'certPopup', 'achPopup', 'cmdPalette', 'articleModal'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      if (id === 'cmdPalette') el.style.display = 'none';
    }
  });
  document.body.style.overflow = '';
};

/* About modal */
window.openAbout = function() {
  var el = document.getElementById('aboutPopup');
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
};
window.closeAbout = function() {
  var el = document.getElementById('aboutPopup');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
};

/* Section Visibility Controls */
(function initVisibility() {
  function apply() {
    var recs = localStorage.getItem('hide_recommendations');
    var rEl = document.querySelector('section.section#recommendations, #recommendations.section');
    if (rEl) rEl.style.display = (recs === 'false') ? 'block' : 'none';

    var evs = localStorage.getItem('hide_events');
    var eEl = document.querySelector('section.section#events, #events.section');
    if (eEl) eEl.style.display = (evs === 'true') ? 'none' : 'block';

    var ghs = localStorage.getItem('hide_github');
    var gEl = document.querySelector('section.section#github, #github.section');
    if (gEl) gEl.style.display = (ghs === 'true') ? 'none' : 'block';

    var achs = localStorage.getItem('hide_achievements');
    var aEl = document.querySelector('section.section#achievements, #achievements.section');
    if (aEl) aEl.style.display = (achs === 'true') ? 'none' : 'block';
  }
  document.addEventListener('DOMContentLoaded', apply);
  window.refreshVisibility = apply;
})();

/* Project modal with multi-image gallery support */
window.openPopup = function(title, body, galleryImagesStr) {
  var el = document.getElementById('popup'); if (!el) return;
  var pTitle = document.getElementById('ptitle');
  var pBody = document.getElementById('pbody');
  if (pTitle) pTitle.textContent = title || '';
  if (pBody) pBody.textContent = body || '';
  
  var oldGallery = document.getElementById('projModalGallery');
  if (oldGallery) oldGallery.remove();

  if (galleryImagesStr && galleryImagesStr.trim() !== '') {
    var imgs = galleryImagesStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    if (imgs.length > 0 && pBody) {
      var gDiv = document.createElement('div');
      gDiv.id = 'projModalGallery';
      gDiv.style.cssText = 'display:flex; gap:0.5rem; overflow-x:auto; margin:1rem 0; padding-bottom:0.5rem;';
      gDiv.innerHTML = imgs.map(function(src) {
        return '<img src="' + src + '" style="height:140px; border-radius:6px; object-fit:cover; border:1px solid var(--border); cursor:pointer;" onclick="window.open(\'' + src + '\',\'_blank\')">';
      }).join('');
      pBody.insertAdjacentElement('beforebegin', gDiv);
    }
  }

  el.classList.add('open'); document.body.style.overflow = 'hidden';
};

window.closePopup = function() {
  var el = document.getElementById('popup');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
};

/* Certificate modal */
window.openCertImg = function(title, issuer, status, desc, imgUrl, verifyUrl) {
  var el = document.getElementById('certPopup'); if (!el) return;
  var cTitle = document.getElementById('cTitle');
  var cIssuer = document.getElementById('cIssuer');
  var cStatus = document.getElementById('cStatus');
  var cBody = document.getElementById('cBody');
  if (cTitle) cTitle.textContent  = title || '';
  if (cIssuer) cIssuer.textContent = issuer || '';
  if (cStatus) cStatus.textContent = status || '';
  if (cBody) cBody.textContent   = desc || '';
  var wrap = document.getElementById('certModalImgWrap');

  var verifyLinkHtml = '';
  if (verifyUrl && verifyUrl.trim() !== '') {
    verifyLinkHtml = '<div style="margin-top:1rem; text-align:center;"><a href="' + verifyUrl + '" target="_blank" class="btn btn-teal-ghost" style="padding:0.45rem 1.2rem; font-size:0.82rem; font-weight:700; border-radius:20px;">🔗 Verify Official Credential ↗</a></div>';
  }

  if (imgUrl && imgUrl.trim() !== '' && wrap) {
    var isPdf = (imgUrl.indexOf('data:application/pdf') === 0 || imgUrl.toLowerCase().endsWith('.pdf'));
    if (isPdf) {
      wrap.innerHTML = '<iframe src="' + imgUrl + '" style="width:100%; height:400px; border:1px solid var(--border); border-radius:6px; margin-top:1rem;"></iframe>' +
                       '<div style="text-align:center; margin-top:0.5rem; display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;"><a href="' + imgUrl + '" target="_blank" download class="btn btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem;">📥 Download PDF Certificate</a>' + verifyLinkHtml + '</div>';
      wrap.style.display = 'block';
    } else {
      wrap.innerHTML = '<img id="certModalImg" src="' + imgUrl + '" style="max-width:100%; border-radius:6px; margin-top:1rem;" alt="' + (title || 'Certificate') + '">' + verifyLinkHtml;
      wrap.style.display = 'block';
    }
  } else if (wrap) {
    wrap.innerHTML = '<div style="padding:1.2rem; text-align:center; background:rgba(255,255,255,0.02); border:1px dashed var(--border); border-radius:6px; margin:1rem 0; color:var(--text-muted); font-size:0.84rem;"><span style="font-size:1.8rem; display:block; margin-bottom:0.3rem; opacity:0.8;">📜</span><span>Verified Credential Record</span></div>' + verifyLinkHtml;
    wrap.style.display = 'block';
  }
  el.classList.add('open'); document.body.style.overflow = 'hidden';
};

window.closeCertPopup = function() {
  var el = document.getElementById('certPopup');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
};

/* Achievement modal */
window.openAch = function(title, sub, where, desc, icon, color) {
  var el = document.getElementById('achPopup'); if (!el) return;
  var ic = document.getElementById('achIcon');
  if (ic) {
    ic.textContent = icon || '🏆';
    if (color) {
      ic.className = 'modal-icon ach-icon-' + color;
    }
  }
  var aTitle = document.getElementById('achTitle');
  var aSub = document.getElementById('achSub');
  var aWhere = document.getElementById('achWhere');
  var aBody = document.getElementById('achBody');
  if (aTitle) aTitle.textContent = title || '';
  if (aSub) aSub.innerHTML   = sub || '';
  if (aWhere) aWhere.innerHTML = where || '';
  if (aBody) aBody.textContent = desc || '';
  el.classList.add('open'); document.body.style.overflow = 'hidden';
};

window.closeAch = function() {
  var el = document.getElementById('achPopup');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
};

/* Command Palette Helpers */
window.openCmd = function() {
  var modal = document.getElementById('cmdPalette');
  var input = document.getElementById('cmdInput');
  if (modal && input) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    input.value = '';
    input.focus();
    var items = document.querySelectorAll('#cmdResults .cmd-item');
    items.forEach(function (item) { item.style.display = 'flex'; });
  }
};

window.closeCmd = function() {
  var modal = document.getElementById('cmdPalette');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};
