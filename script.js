document.addEventListener("DOMContentLoaded", function () {

    // ══════════════════════════════════
    // 1. TYPING EFFECT
    // ══════════════════════════════════
    var typingEl = document.getElementById("typing");
    if (typingEl) {
        var fullText = "Balaji Chitrarasu";
        var idx = 0;
        setTimeout(function () {
            typingEl.classList.add("typing-active");
            (function typeChar() {
                if (idx < fullText.length) {
                    typingEl.innerHTML += fullText.charAt(idx++);
                    setTimeout(typeChar, 80);
                } else {
                    typingEl.classList.remove("typing-active");
                    typingEl.classList.add("done");
                }
            })();
        }, 400);
    }

    // ══════════════════════════════════
    // 2. PARTICLES
    // ══════════════════════════════════
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 900 } },
                color: { value: "#00ffcc" },
                shape: { type: "circle" },
                opacity: { value: 0.14, random: true },
                size: { value: 2.2, random: true },
                line_linked: { enable: true, distance: 130, color: "#1a2535", opacity: 0.25, width: 1 },
                move: { enable: true, speed: 0.75, random: true, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
                modes: { grab: { distance: 150, line_linked: { opacity: 0.45 } }, push: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    }

    // ══════════════════════════════════
    // 3. CURSOR GLOW
    // ══════════════════════════════════
    var glowEl = document.getElementById("cursor-glow");
    if (glowEl && window.innerWidth > 768) {
        glowEl.style.display = "block";
        document.addEventListener("mousemove", function (e) {
            glowEl.style.left = e.clientX + "px";
            glowEl.style.top  = e.clientY + "px";
        });
    }

    // ══════════════════════════════════
    // 4. NAV HIDE ON SCROLL
    // ══════════════════════════════════
    var navbar = document.getElementById("navbar");
    var lastY  = 0;
    if (navbar) {
        window.addEventListener("scroll", function () {
            var curr = window.scrollY;
            if (curr > lastY && curr > 80) {
                navbar.classList.add("hidden");
            } else {
                navbar.classList.remove("hidden");
            }
            navbar.classList.toggle("scrolled", curr > 20);
            lastY = curr <= 0 ? 0 : curr;
        }, { passive: true });
    }

    // ══════════════════════════════════
    // 5. ACTIVE NAV LINK
    // ══════════════════════════════════
    var sections = document.querySelectorAll("section[id], header[id]");
    var navLinks = document.querySelectorAll(".navbar ul li a");

    if (sections.length && "IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    navLinks.forEach(function (a) { a.classList.remove("active"); });
                    var lnk = document.querySelector('.navbar ul li a[href="#' + e.target.id + '"]');
                    if (lnk) lnk.classList.add("active");
                }
            });
        }, { threshold: 0.35 }).observe && sections.forEach(function (s) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        navLinks.forEach(function (a) { a.classList.remove("active"); });
                        var lnk = document.querySelector('.navbar ul li a[href="#' + e.target.id + '"]');
                        if (lnk) lnk.classList.add("active");
                    }
                });
            }, { threshold: 0.35 }).observe(s);
        });
    }

    // ══════════════════════════════════
    // 6. FADE-IN + SKILL BARS
    // ══════════════════════════════════
    var fadeEls = document.querySelectorAll(".fade-in");

    // Always show everything after 1.5s no matter what
    var fallback = setTimeout(function () {
        fadeEls.forEach(function (el) { el.classList.add("visible"); });
        triggerBars();
    }, 1500);

    // Trigger bars after 900ms always
    setTimeout(triggerBars, 900);

    function triggerBars() {
        document.querySelectorAll(".fill").forEach(function (fill) {
            var w = fill.getAttribute("data-width");
            if (w && fill.style.width === "0%" || fill.style.width === "") {
                fill.style.width = w + "%";
            }
        });
    }

    if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    obs.unobserve(e.target);
                }
            });
            if (!document.querySelector(".fade-in:not(.visible)")) clearTimeout(fallback);
        }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
        fadeEls.forEach(function (el) { obs.observe(el); });
    }

    // ══════════════════════════════════
    // 7. HAMBURGER MENU
    // ══════════════════════════════════
    var navToggle = document.getElementById("navToggle");
    var navMenu   = document.getElementById("navMenu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            navMenu.classList.toggle("open");
        });

        // Close when any link clicked
        navMenu.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                navMenu.classList.remove("open");
            });
        });

        // Close when clicking outside
        document.addEventListener("click", function (e) {
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove("open");
            }
        });
    }

    // ══════════════════════════════════
    // 8. POPUP CLOSE BUTTONS
    // ══════════════════════════════════
    var popupCloseBtn = document.getElementById("popupClose");
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener("click", closePopup);
    }

    var certCloseBtn = document.getElementById("certClose");
    if (certCloseBtn) {
        certCloseBtn.addEventListener("click", closeCertPopup);
    }

    // Close on backdrop click
    var popupEl = document.getElementById("popup");
    if (popupEl) {
        popupEl.addEventListener("click", function (e) {
            if (e.target === this) closePopup();
        });
    }

    var certPopupEl = document.getElementById("certPopup");
    if (certPopupEl) {
        certPopupEl.addEventListener("click", function (e) {
            if (e.target === this) closeCertPopup();
        });
    }

    // ══════════════════════════════════
    // 9. CONTACT FORM
    // ══════════════════════════════════
    var sendBtn = document.getElementById("sendBtn");
    var formMsg = document.getElementById("formMsg");

    function showMsg(type, text) {
        if (!formMsg) return;
        formMsg.className = "form-msg " + type;
        formMsg.textContent = text;
        formMsg.style.display = "block";
        setTimeout(function () { formMsg.style.display = "none"; }, 4000);
    }

    if (sendBtn) {
        sendBtn.addEventListener("click", function () {
            var name  = (document.getElementById("cName").value  || "").trim();
            var email = (document.getElementById("cEmail").value || "").trim();
            var msg   = (document.getElementById("cMsg").value   || "").trim();

            if (!name || !email || !msg) {
                showMsg("error", "Please fill in all fields.");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMsg("error", "Please enter a valid email address.");
                return;
            }

            // Open mail client
            var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + msg);
            var sub  = encodeURIComponent("Portfolio Message from " + name);
            window.location.href = "mailto:balajihck20@gmail.com?subject=" + sub + "&body=" + body;
            showMsg("success", "Mail app opened! Or email: balajihck20@gmail.com");
        });
    }

    // Escape key closes popups
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { closePopup(); closeCertPopup(); }
    });

}); // end DOMContentLoaded

// ══════════════════════════════════
// PROJECT POPUP (called from onclick)
// ══════════════════════════════════
function openPopup(title, text) {
    var el = document.getElementById("popup");
    if (!el) return;
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-text").innerText  = text;
    el.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closePopup() {
    var el = document.getElementById("popup");
    if (el) el.classList.remove("open");
    document.body.style.overflow = "";
}

// ══════════════════════════════════
// CERT POPUP (called from onclick)
// ══════════════════════════════════
function openCert(title, issuer, status, desc) {
    var el = document.getElementById("certPopup");
    if (!el) return;
    document.getElementById("certTitle").innerText  = title;
    document.getElementById("certIssuer").innerText = issuer;
    document.getElementById("certStatus").innerText = "Elite Status";
    document.getElementById("certDesc").innerText   = desc;
    el.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCertPopup() {
    var el = document.getElementById("certPopup");
    if (el) el.classList.remove("open");
    document.body.style.overflow = "";
}
