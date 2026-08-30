/* ── Theme Initialization (Immediate to prevent flash) ── */
(function () {
  try {
    var saved = localStorage.getItem('site_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
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
     LIGHT / DARK THEME TOGGLE (Sun / Moon)
  ─────────────────────────────────────────── */
  var themeBtn = document.getElementById('themeToggle');
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('site_theme', theme); } catch(e) {}
    if (themeBtn) {
      themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      if (typeof showToast === 'function') {
        showToast(next === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
      }
    });
  }

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
          imgEl.src = 'profile.jpg';
        }
        imgEl.onerror = function () {
          this.onerror = null;
          this.src = 'profile.jpg';
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

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target); /* only fire once */
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    /* Fallback for old browsers */
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

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
      var iconSrc = s.icon && s.icon.length > 2
        ? 'https://cdn.simpleicons.org/' + s.icon + '/38bdf8'
        : '';
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

    if (!Array.isArray(saved) || saved.length === 0) return;

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

    if (!Array.isArray(saved) || saved.length === 0) return;

    container.innerHTML = saved.map(function (c) {
      var title = c.title || 'Certification';
      var issuer = c.org || c.issuer || 'Issuer';
      var statusDate = c.date || c.status || '';
      var desc = c.desc || c.description || '';
      var image = c.image || c.img || 'cert1.jpg';
      var badgeText = c.badgeText || (issuer.indexOf('AWS') > -1 || title.indexOf('AWS') > -1 ? '☁️ Production Certified' : '🏆 Certified');
      var badgeClass = c.badge || (issuer.indexOf('Anthropic') > -1 ? 'badge-violet' : 'badge-teal');

      var escTitle = title.replace(/'/g, "\\'");
      var escIssuer = issuer.replace(/'/g, "\\'");
      var escStatus = statusDate.replace(/'/g, "\\'");
      var escDesc = desc.replace(/'/g, "\\'");
      var escImg = image.replace(/'/g, "\\'");

      var isPdf = image.toLowerCase().endsWith('.pdf');
      var imgHtml = isPdf 
        ? '<div style="height:160px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); color:var(--teal); font-weight:700; flex-direction:column; gap:0.5rem;"><span style="font-size:2.5rem;">📄</span><span>PDF Certificate Document</span></div>'
        : '<img src="' + image + '" alt="' + title + '">';

      return '<div class="cert-card reveal" onclick="openCertImg(\'' + escTitle + '\',\'' + escIssuer + '\',\'' + escStatus + '\',\'' + escDesc + '\',\'' + escImg + '\')">' +
        '<div class="cert-img-wrap">' +
          imgHtml +
          '<div class="cert-hover-overlay"><span style="font-size:1.5rem">🔍</span><p>View Certificate</p></div>' +
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
  }

  renderCerts();

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
  var counted = false;

  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var start = null;
      var duration = 1800;

      function step(ts) {
        if (!start) start = ts;
        var elapsed = ts - start;
        var progress = Math.min(elapsed / duration, 1);
        /* ease-out cubic */
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* Try IntersectionObserver with a very low threshold */
  var statsEl = document.getElementById('stats');
  if (statsEl) {
    if ('IntersectionObserver' in window) {
      var statsObs = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) { runCounters(); statsObs.disconnect(); }
      }, { threshold: 0 });  /* threshold 0 = fires as soon as ANY pixel is visible */
      statsObs.observe(statsEl);
    }
    /* ALSO fire after 1.5s as a hard fallback (catches cases where element
       is visible on load but the observer fires too late) */
    setTimeout(runCounters, 1500);
  }

  /* ────────────────────────────────────────
     MOBILE NAV TOGGLE
  ─────────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
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
     CLOSE MODALS on backdrop click / ESC
  ─────────────────────────────────────────── */
  ['aboutPopup', 'popup', 'certPopup', 'achPopup'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function (e) { if (e.target === el) closeAll(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

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
      } else if (e.key === 'Escape' && cmdModal.style.display === 'flex') {
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
   (called from HTML onclick attributes)
   ══════════════════════════════════════ */

function showToast(txt) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = txt;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
}

function copyEmail() {
  var email = 'balajichitrarasu07@gmail.com';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(function () {
      showToast('✓ Email copied to clipboard!');
    }).catch(function () { showToast('Email: ' + email); });
  } else {
    showToast('Email: ' + email);
  }
}

function filterProjects(cat, e) {
  if (e && e.target) {
    document.querySelectorAll('.fbtn').forEach(function (b) { b.classList.remove('active'); });
    e.target.classList.add('active');
  }
  document.querySelectorAll('.proj-card').forEach(function (c) {
    var catAttr = c.getAttribute('data-category') || '';
    var show = (cat === 'all' || catAttr === cat || catAttr.includes(cat));
    c.style.display = show ? 'flex' : 'none';
  });
}

function closeAll() {
  ['aboutPopup', 'popup', 'certPopup', 'achPopup'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  document.body.style.overflow = '';
}

/* About modal */
function openAbout() {
  var el = document.getElementById('aboutPopup');
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeAbout() {
  var el = document.getElementById('aboutPopup');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

/* Section Visibility Controls */
(function initVisibility() {
  function apply() {
    var recs = localStorage.getItem('hide_recommendations');
    var rEl = document.getElementById('recommendations');
    if (rEl) rEl.style.display = (recs === 'false') ? 'block' : 'none';

    var evs = localStorage.getItem('hide_events');
    var eEl = document.getElementById('events');
    if (eEl) eEl.style.display = (evs === 'true') ? 'none' : 'block';

    var ghs = localStorage.getItem('hide_github');
    var gEl = document.getElementById('github');
    if (gEl) gEl.style.display = (ghs === 'true') ? 'none' : 'block';

    var achs = localStorage.getItem('hide_achievements');
    var aEl = document.getElementById('achievements');
    if (aEl) aEl.style.display = (achs === 'true') ? 'none' : 'block';
  }
  document.addEventListener('DOMContentLoaded', apply);
  window.refreshVisibility = apply;
})();

/* Project modal with multi-image gallery support */
function openPopup(title, body, galleryImagesStr) {
  var el = document.getElementById('popup'); if (!el) return;
  document.getElementById('ptitle').textContent = title;
  document.getElementById('pbody').textContent  = body;
  
  var oldGallery = document.getElementById('projModalGallery');
  if (oldGallery) oldGallery.remove();

  if (galleryImagesStr && galleryImagesStr.trim() !== '') {
    var imgs = galleryImagesStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    if (imgs.length > 0) {
      var gDiv = document.createElement('div');
      gDiv.id = 'projModalGallery';
      gDiv.style.cssText = 'display:flex; gap:0.5rem; overflow-x:auto; margin:1rem 0; padding-bottom:0.5rem;';
      gDiv.innerHTML = imgs.map(function(src) {
        return '<img src="' + src + '" style="height:140px; border-radius:6px; object-fit:cover; border:1px solid var(--border); cursor:pointer;" onclick="window.open(\'' + src + '\',\'_blank\')">';
      }).join('');
      document.getElementById('pbody').insertAdjacentElement('beforebegin', gDiv);
    }
  }

  el.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closePopup() {
  var el = document.getElementById('popup'); if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

/* Certificate modal */
function openCertImg(title, issuer, status, desc, imgUrl) {
  var el = document.getElementById('certPopup'); if (!el) return;
  document.getElementById('cTitle').textContent  = title;
  document.getElementById('cIssuer').textContent = issuer;
  document.getElementById('cStatus').textContent = status || '';
  document.getElementById('cBody').textContent   = desc;
  var wrap = document.getElementById('certModalImgWrap');

  if (imgUrl && wrap) {
    var isPdf = (imgUrl.indexOf('data:application/pdf') === 0 || imgUrl.toLowerCase().endsWith('.pdf'));
    if (isPdf) {
      wrap.innerHTML = '<iframe src="' + imgUrl + '" style="width:100%; height:400px; border:1px solid var(--border); border-radius:6px; margin-top:1rem;"></iframe>' +
                       '<div style="text-align:center; margin-top:0.5rem;"><a href="' + imgUrl + '" target="_blank" download class="btn btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem;">📥 Download PDF Certificate</a></div>';
      wrap.style.display = 'block';
    } else {
      wrap.innerHTML = '<img id="certModalImg" src="' + imgUrl + '" style="max-width:100%; border-radius:6px; margin-top:1rem;" alt="' + title + '">';
      wrap.style.display = 'block';
    }
  } else if (wrap) {
    wrap.style.display = 'none';
  }
  el.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeCertPopup() {
  var el = document.getElementById('certPopup'); if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

/* Achievement modal */
function openAch(title, sub, where, desc, icon) {
  var el = document.getElementById('achPopup'); if (!el) return;
  var ic = document.getElementById('achIcon');
  if (ic) ic.textContent = icon || '🏆';
  document.getElementById('achTitle').textContent = title;
  document.getElementById('achSub').innerHTML   = sub;
  document.getElementById('achWhere').innerHTML = where;
  document.getElementById('achBody').textContent = desc;
  el.classList.add('open'); document.body.style.overflow = 'hidden';
}
function openCmd() {
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
}

function closeCmd() {
  var modal = document.getElementById('cmdPalette');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
