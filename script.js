/* ============================================================
   BALAJI CHITRARASU — PORTFOLIO SCRIPT
   Features: page transitions, typing, particles, cursor glow,
   nav scroll/active, fade-in, skill bars, stats counter,
   hamburger X toggle, all popups
   ============================================================ */

/* ── PAGE TRANSITION ── */
(function () {
  /* On first load: slide overlay away */
  document.body.classList.add('page-loading');
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.body.classList.remove('page-loading');
    }, 80);
  });

  /* On navigation to blog: slide overlay in, then navigate */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    /* Only animate internal page links (blog.html etc.) */
    if (!href || href.charAt(0) === '#' || href.indexOf('://') !== -1 ||
        a.target === '_blank' || href === 'resume.pdf') return;

    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = href;
    }, 450);
  });
})();

/* ── MAIN INIT ── */
window.addEventListener('load', function () {

  /* ── Fix email link so Cloudflare cannot mangle it ── */
  var ec = document.getElementById('emailCard');
  if (ec) {
    var u = 'balajihck20', d = 'gmail.com';
    ec.href = 'mailto:' + u + '@' + d;
  }

  /* ── 1. TYPING ── */
  var el = document.getElementById('typing');
  if (el) {
    var txt = 'Balaji Chitrarasu', i = 0;
    setTimeout(function () {
      el.classList.add('typing-active');
      (function type() {
        if (i < txt.length) { el.innerHTML += txt[i++]; setTimeout(type, 78); }
        else { el.classList.remove('typing-active'); el.classList.add('done'); }
      })();
    }, 350);
  }

  /* ── 2. PARTICLES ── */
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 35, density: { enable: true, value_area: 900 } },
        color: { value: '#00ffcc' }, shape: { type: 'circle' },
        opacity: { value: 0.11, random: true }, size: { value: 2, random: true },
        line_linked: { enable: true, distance: 130, color: '#1a2535', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 0.6, random: true, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } }, push: { particles_nb: 2 } }
      },
      retina_detect: true
    });
  }

  /* ── 3. CURSOR GLOW ── */
  var glow = document.getElementById('cursor-glow');
  if (glow && window.innerWidth > 768) {
    glow.style.display = 'block';
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  /* ── 4. NAV SCROLL HIDE/SHOW ── */
  var navbar = document.getElementById('navbar');
  var lastY  = 0;
  if (navbar) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      navbar.classList.toggle('hidden',  y > lastY && y > 80);
      navbar.classList.toggle('scrolled', y > 20);
      lastY = y < 0 ? 0 : y;
    }, { passive: true });
  }

  /* ── 5. ACTIVE NAV LINK ── */
  if ('IntersectionObserver' in window) {
    var links = document.querySelectorAll('.navbar ul li a');
    document.querySelectorAll('section[id],header[id]').forEach(function (s) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) { a.classList.remove('active'); });
            var l = document.querySelector('.navbar ul li a[href="#' + e.target.id + '"]');
            if (l) l.classList.add('active');
          }
        });
      }, { threshold: 0.3 }).observe(s);
    });
  }

  /* ── 6. SCROLL REVEAL + SKILL BARS ── */
  function revealBars() {
    document.querySelectorAll('.sfill').forEach(function (f) {
      var w = f.getAttribute('data-w');
      if (w) f.style.width = w + '%';
    });
  }
  /* Always trigger bars after 900ms regardless */
  setTimeout(revealBars, 900);

  var fadeEls = document.querySelectorAll('.fade-in');
  /* Safety fallback: show everything after 1.6s */
  var fallback = setTimeout(function () {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
    revealBars();
  }, 1600);

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
      if (!document.querySelector('.fade-in:not(.visible)')) clearTimeout(fallback);
    }, { threshold: 0.07, rootMargin: '0px 0px -15px 0px' });
    fadeEls.forEach(function (el) { obs.observe(el); });
  }

  /* ── 7. STATS COUNTER — exact target always ── */
  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var target   = parseInt(el.getAttribute('data-target'), 10);
      var steps    = Math.min(target, 60);
      var interval = Math.round(1200 / steps);
      var increment = target / steps;
      var frame = 0;
      var timer = setInterval(function () {
        frame++;
        el.textContent = frame < steps ? Math.round(increment * frame) : target;
        if (frame >= steps) clearInterval(timer);
      }, interval);
    });
  }
  var statsEl = document.getElementById('stats');
  if (statsEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.3 }).observe(statsEl);
  } else {
    setTimeout(runCounters, 1200);
  }

  /* ── 8. HAMBURGER MENU with X animation + smooth scroll ── */
  var toggle  = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  /* Smooth scroll to section */
  function smoothScrollTo(targetId) {
    var target = document.getElementById(targetId);
    if (!target) return;
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 58;
    var top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* Attach smooth scroll to ALL internal anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      e.preventDefault();
      /* Close menu first if open */
      if (navMenu) navMenu.classList.remove('open');
      if (toggle)  { toggle.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
      /* Small delay on mobile so menu close animation plays first */
      var delay = (window.innerWidth <= 768 && navMenu && navMenu.classList.contains('open')) ? 320 : 0;
      setTimeout(function () { smoothScrollTo(id); }, delay);
    });
  });

  if (toggle && navMenu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 9. POPUP BINDINGS ── */
  function bindClose(id, fn) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
  }
  function bindBackdrop(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function (e) { if (e.target === this) fn(); });
  }
  bindClose('aboutClose', closeAbout);     bindBackdrop('aboutPopup', closeAbout);
  bindClose('popupClose', closePopup);     bindBackdrop('popup',      closePopup);
  bindClose('certClose',  closeCertPopup); bindBackdrop('certPopup',  closeCertPopup);
  bindClose('achClose',   closeAch);       bindBackdrop('achPopup',   closeAch);

  /* ── 10. CONTACT FORM ── */
  var sendBtn = document.getElementById('sendBtn');
  var formMsg = document.getElementById('formMsg');

  function showMsg(type, text) {
    if (!formMsg) return;
    formMsg.className = 'form-msg ' + type;
    formMsg.textContent = text;
    formMsg.style.display = 'block';
    setTimeout(function () { formMsg.style.display = 'none'; }, 5000);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      var name  = (document.getElementById('cName').value  || '').trim();
      var email = (document.getElementById('cEmail').value || '').trim();
      var msg   = (document.getElementById('cMsg').value   || '').trim();
      if (!name)  { showMsg('err', 'Please enter your name.'); return; }
      if (!email) { showMsg('err', 'Please enter your email address.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('err', 'Please enter a valid email address.'); return; }
      if (!msg)   { showMsg('err', 'Please enter a message.'); return; }
      var u    = 'balajihck20', d = 'gmail.com';
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + msg);
      var sub  = encodeURIComponent('Portfolio Message from ' + name);
      window.location.href = 'mailto:' + u + '@' + d + '?subject=' + sub + '&body=' + body;
      showMsg('ok', 'Mail app opened. You can also call +91 76396 83223.');
    });
  }

  /* ── Escape key ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAbout(); closePopup(); closeCertPopup(); closeAch(); }
  });

}); /* end load */

/* ══════════════════════════════════
   POPUP FUNCTIONS (called from onclick)
══════════════════════════════════ */
function openAbout() {
  var e = document.getElementById('aboutPopup');
  if (e) { e.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeAbout() {
  var e = document.getElementById('aboutPopup');
  if (e) e.classList.remove('open');
  document.body.style.overflow = '';
}

function openPopup(title, text) {
  var e = document.getElementById('popup'); if (!e) return;
  document.getElementById('ptitle').innerText = title;
  document.getElementById('pbody').innerText  = text;
  e.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closePopup() {
  var e = document.getElementById('popup');
  if (e) e.classList.remove('open');
  document.body.style.overflow = '';
}

function openCert(title, issuer, statusHTML, desc, orgShort, statusLabel, medal) {
  var e = document.getElementById('certPopup'); if (!e) return;
  var m = document.getElementById('cMedal'),
      o = document.getElementById('cOrg'),
      s = document.getElementById('cStatus'),
      t = document.getElementById('cTitle'),
      i = document.getElementById('cIssuer'),
      d = document.getElementById('cBody');
  if (m) m.innerHTML  = medal || '&#127885;';
  if (o) o.innerText  = orgShort || '';
  if (s) s.innerHTML  = statusHTML || '';
  if (t) t.innerText  = title;
  if (i) i.innerText  = issuer;
  if (d) d.innerText  = desc;
  e.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeCertPopup() {
  var e = document.getElementById('certPopup');
  if (e) e.classList.remove('open');
  document.body.style.overflow = '';
}

function openAch(title, subtitle, where, desc, icon, colorClass) {
  var e = document.getElementById('achPopup'); if (!e) return;
  var iconEl = document.getElementById('achIcon'),
      tEl    = document.getElementById('achTitle'),
      sEl    = document.getElementById('achSub'),
      wEl    = document.getElementById('achWhere'),
      dEl    = document.getElementById('achBody');
  if (iconEl) { iconEl.innerHTML = icon || '&#127941;'; iconEl.className = 'picon'; }
  if (tEl) tEl.innerText  = title;
  if (sEl) sEl.innerHTML  = subtitle;
  if (wEl) wEl.innerHTML  = where;
  if (dEl) dEl.innerText  = desc;
  e.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeAch() {
  var e = document.getElementById('achPopup');
  if (e) e.classList.remove('open');
  document.body.style.overflow = '';
}
