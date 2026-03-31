window.addEventListener('load', function () {

    // ── 1. TYPING ──
    var el = document.getElementById('typing');
    if (el) {
        var text = 'Balaji Chitrarasu', i = 0;
        setTimeout(function () {
            el.classList.add('typing-active');
            (function type() {
                if (i < text.length) { el.innerHTML += text[i++]; setTimeout(type, 78); }
                else { el.classList.remove('typing-active'); el.classList.add('done'); }
            })();
        }, 350);
    }

    // ── 2. PARTICLES ──
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 38, density: { enable: true, value_area: 900 } },
                color: { value: '#00ffcc' }, shape: { type: 'circle' },
                opacity: { value: 0.12, random: true }, size: { value: 2, random: true },
                line_linked: { enable: true, distance: 130, color: '#1a2535', opacity: 0.22, width: 1 },
                move: { enable: true, speed: 0.65, random: true, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } }, push: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    }

    // ── 3. CURSOR GLOW ──
    var glow = document.getElementById('cursor-glow');
    if (glow && window.innerWidth > 768) {
        glow.style.display = 'block';
        document.addEventListener('mousemove', function (e) {
            glow.style.left = e.clientX + 'px';
            glow.style.top  = e.clientY + 'px';
        });
    }

    // ── 4. NAV SCROLL ──
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

    // ── 5. ACTIVE NAV ──
    var sections = document.querySelectorAll('section[id], header[id]');
    var links    = document.querySelectorAll('.navbar ul li a');
    sections.forEach(function (s) {
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

    // ── 6. FADE-IN + SKILL BARS ──
    var fadeEls = document.querySelectorAll('.fade-in');

    function revealBars() {
        document.querySelectorAll('.fill').forEach(function (f) {
            var w = f.getAttribute('data-width');
            if (w) f.style.width = w + '%';
        });
    }

    setTimeout(revealBars, 900);

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
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
        fadeEls.forEach(function (el) { obs.observe(el); });
    }

    // ── 7. STATS COUNTER ──
    var counters = document.querySelectorAll('.stat-num');
    var counted  = false;

    function runCounters() {
        if (counted) return; counted = true;
        counters.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var step = Math.max(1, Math.floor(target / 40));
            var curr = 0;
            var timer = setInterval(function () {
                curr += step;
                if (curr >= target) { curr = target; clearInterval(timer); }
                el.textContent = curr;
            }, 40);
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

    // ── 8. HAMBURGER ──
    var toggle  = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    if (toggle && navMenu) {
        toggle.addEventListener('click', function (e) { e.stopPropagation(); navMenu.classList.toggle('open'); });
        navMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { navMenu.classList.remove('open'); });
        });
        document.addEventListener('click', function (e) {
            if (navbar && !navbar.contains(e.target)) navMenu.classList.remove('open');
        });
    }

    // ── 9. POPUP CLOSE BUTTONS ──
    var popupCloseBtn = document.getElementById('popupClose');
    if (popupCloseBtn) popupCloseBtn.addEventListener('click', function (e) { e.stopPropagation(); closePopup(); });

    var certCloseBtn = document.getElementById('certClose');
    if (certCloseBtn) certCloseBtn.addEventListener('click', function (e) { e.stopPropagation(); closeCertPopup(); });

    var popupEl = document.getElementById('popup');
    if (popupEl) popupEl.addEventListener('click', function (e) { if (e.target === this) closePopup(); });

    var certEl = document.getElementById('certPopup');
    if (certEl) certEl.addEventListener('click', function (e) { if (e.target === this) closeCertPopup(); });

    // ── 10. CONTACT FORM ──
    var sendBtn = document.getElementById('sendBtn');
    var formMsg = document.getElementById('formMsg');

    function showMsg(type, txt) {
        if (!formMsg) return;
        formMsg.className = 'form-msg ' + type;
        formMsg.textContent = txt;
        formMsg.style.display = 'block';
        setTimeout(function () { formMsg.style.display = 'none'; }, 4000);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            var name  = (document.getElementById('cName').value  || '').trim();
            var email = (document.getElementById('cEmail').value || '').trim();
            var msg   = (document.getElementById('cMsg').value   || '').trim();
            if (!name || !email || !msg) { showMsg('error', 'Please fill in all fields.'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('error', 'Please enter a valid email.'); return; }
            var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + msg);
            var sub  = encodeURIComponent('Portfolio Message from ' + name);
            window.location.href = 'mailto:balajihck20@gmail.com?subject=' + sub + '&body=' + body;
            showMsg('success', 'Mail app opened! Or email: balajihck20@gmail.com');
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closePopup(); closeCertPopup(); }
    });

}); // end window.onload

// ── PROJECT POPUP (global — called from onclick) ──
function openPopup(title, text) {
    var el = document.getElementById('popup');
    if (!el) return;
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-text').innerText  = text;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    var el = document.getElementById('popup');
    if (el) el.classList.remove('open');
    document.body.style.overflow = '';
}

// ── CERT POPUP (global — called from onclick) ──
// Parameters: title, issuer, statusText, desc, orgShort, statusKey, medal
function openCert(title, issuer, statusText, desc, orgShort, statusKey, medal) {
    var el = document.getElementById('certPopup');
    if (!el) return;

    var medalEl  = document.getElementById('certMedalIcon');
    var orgEl    = document.getElementById('certOrgName');
    var statEl   = document.getElementById('certStatusBadge');
    var titleEl  = document.getElementById('certTitle');
    var issuerEl = document.getElementById('certIssuer');
    var descEl   = document.getElementById('certDesc');

    if (medalEl)  medalEl.innerHTML  = medal || '&#127885;';
    if (orgEl)    orgEl.innerText    = orgShort || '';
    if (statEl)   statEl.innerHTML   = statusText || '';
    if (titleEl)  titleEl.innerText  = title;
    if (issuerEl) issuerEl.innerText = issuer;
    if (descEl)   descEl.innerText   = desc;

    el.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertPopup() {
    var el = document.getElementById('certPopup');
    if (el) el.classList.remove('open');
    document.body.style.overflow = '';
}
