document.addEventListener("DOMContentLoaded", function () {

    // ════════════════════════════════════
    // 1. TYPING EFFECT
    // ════════════════════════════════════
    const typingEl = document.getElementById("typing");
    const fullText = "Balaji Chitrarasu";
    let charIdx = 0;

    function typeChar() {
        if (charIdx < fullText.length) {
            typingEl.innerHTML += fullText.charAt(charIdx);
            charIdx++;
            setTimeout(typeChar, 80);
        } else {
            typingEl.classList.add("done");
        }
    }
    typeChar();

    // ════════════════════════════════════
    // 2. PARTICLES
    // ════════════════════════════════════
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 900 } },
                color: { value: "#00ffcc" },
                shape: { type: "circle" },
                opacity: { value: 0.14, random: true },
                size: { value: 2.2, random: true },
                line_linked: {
                    enable: true,
                    distance: 130,
                    color: "#1a2535",
                    opacity: 0.25,
                    width: 1
                },
                move: { enable: true, speed: 0.75, random: true, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick:  { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 150, line_linked: { opacity: 0.45 } },
                    push: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }

    // ════════════════════════════════════
    // 3. CURSOR GLOW — desktop only
    // ════════════════════════════════════
    const glowEl = document.getElementById("cursor-glow");
    if (glowEl && window.innerWidth > 700) {
        glowEl.style.display = "block";
        document.addEventListener("mousemove", function (e) {
            glowEl.style.left = e.clientX + "px";
            glowEl.style.top  = e.clientY + "px";
        });
    }

    // ════════════════════════════════════
    // 4. NAV — scroll hide/show
    // ════════════════════════════════════
    const navbar  = document.getElementById("navbar");
    let lastScroll = 0;

    window.addEventListener("scroll", function () {
        const curr = window.scrollY;

        if (curr > lastScroll && curr > 80) {
            navbar.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
        }

        navbar.classList.toggle("scrolled", curr > 20);
        lastScroll = curr <= 0 ? 0 : curr;
    }, { passive: true });

    // ════════════════════════════════════
    // 5. ACTIVE NAV LINK
    // ════════════════════════════════════
    const allSections = document.querySelectorAll("section[id], header[id]");
    const allNavLinks = document.querySelectorAll(".navbar ul li a");

    const activeSectionObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                allNavLinks.forEach(function (a) { a.classList.remove("active"); });
                var link = document.querySelector('.navbar ul li a[href="#' + entry.target.id + '"]');
                if (link) link.classList.add("active");
            }
        });
    }, { threshold: 0.35 });

    allSections.forEach(function (s) { activeSectionObs.observe(s); });

    // ════════════════════════════════════
    // 6. SCROLL FADE-IN + SKILL BARS
    //    — with 1.5s fallback timer so
    //      content ALWAYS becomes visible
    // ════════════════════════════════════
    var fadeEls = document.querySelectorAll(".fade-in");

    // Fallback: if IntersectionObserver never fires (can happen on some
    // mobile WebViews), force all visible after 1.5s
    var fallbackTimer = setTimeout(function () {
        fadeEls.forEach(function (el) {
            el.classList.add("visible");
            var fill = el.querySelector(".fill");
            if (fill) fill.style.width = fill.getAttribute("data-width") + "%";
        });
    }, 1500);

    if ("IntersectionObserver" in window) {
        var fadeObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    var fill = entry.target.querySelector(".fill");
                    if (fill) {
                        var w = fill.getAttribute("data-width");
                        setTimeout(function () {
                            fill.style.width = w + "%";
                        }, 120);
                    }

                    fadeObs.unobserve(entry.target);
                }
            });

            // If all observed elements are now visible, clear fallback
            var remaining = document.querySelectorAll(".fade-in:not(.visible)");
            if (remaining.length === 0) clearTimeout(fallbackTimer);

        }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

        fadeEls.forEach(function (el) { fadeObs.observe(el); });
    }

    // ════════════════════════════════════
    // 7. MOBILE NAV TOGGLE
    // ════════════════════════════════════
    var navToggle = document.getElementById("navToggle");
    var navMenu   = document.getElementById("navMenu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            navMenu.classList.toggle("open");
        });

        navMenu.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                navMenu.classList.remove("open");
            });
        });
    }

    // ════════════════════════════════════
    // 8. CONTACT FORM
    // ════════════════════════════════════
    /*
     * To enable REAL email sending with EmailJS:
     * 1. Sign up at emailjs.com (free)
     * 2. Add Gmail service  → copy SERVICE_ID
     * 3. Create template with vars: {{from_name}} {{from_email}} {{message}}
     *    → copy TEMPLATE_ID
     * 4. Account > API Keys → copy PUBLIC_KEY
     * 5. Replace the three values below
     * 6. Set "To Email" in the template to: balajihck20@gmail.com
     */
    var EJS_PUBLIC_KEY   = "YOUR_PUBLIC_KEY";
    var EJS_SERVICE_ID   = "YOUR_SERVICE_ID";
    var EJS_TEMPLATE_ID  = "YOUR_TEMPLATE_ID";

    if (typeof emailjs !== "undefined" && EJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EJS_PUBLIC_KEY);
    }

    var sendBtn = document.getElementById("sendBtn");
    var formMsg = document.getElementById("formMsg");

    function showFormMsg(type, text) {
        formMsg.className = "form-msg " + type;
        formMsg.textContent = text;
        formMsg.style.display = "block";
        setTimeout(function () { formMsg.style.display = "none"; }, 4500);
    }

    if (sendBtn) {
        sendBtn.addEventListener("click", function () {
            var name  = (document.getElementById("cName").value  || "").trim();
            var email = (document.getElementById("cEmail").value || "").trim();
            var msg   = (document.getElementById("cMsg").value   || "").trim();

            if (!name || !email || !msg) {
                showFormMsg("error", "⚠️ Please fill in all fields.");
                return;
            }

            var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailReg.test(email)) {
                showFormMsg("error", "⚠️ Please enter a valid email address.");
                return;
            }

            // If EmailJS is configured — real send
            if (typeof emailjs !== "undefined" && EJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
                sendBtn.textContent = "Sending…";
                sendBtn.disabled = true;

                emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
                    from_name:  name,
                    from_email: email,
                    message:    msg
                }).then(function () {
                    showFormMsg("success", "✓ Message sent! I'll get back to you soon.");
                    sendBtn.textContent = "Send Message";
                    sendBtn.disabled = false;
                    document.getElementById("cName").value  = "";
                    document.getElementById("cEmail").value = "";
                    document.getElementById("cMsg").value   = "";
                }).catch(function () {
                    showFormMsg("error", "❌ Failed to send. Email me directly: balajihck20@gmail.com");
                    sendBtn.textContent = "Send Message";
                    sendBtn.disabled = false;
                });

            } else {
                // Fallback: open mail client
                var body = encodeURIComponent(
                    "Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + msg
                );
                var sub = encodeURIComponent("Portfolio Message from " + name);
                window.location.href = "mailto:balajihck20@gmail.com?subject=" + sub + "&body=" + body;
                showFormMsg("success", "✓ Your mail app opened! Or email: balajihck20@gmail.com");
            }
        });
    }

}); // end DOMContentLoaded

// ════════════════════════════════════
// 9. PROJECT POPUP
// ════════════════════════════════════
function openPopup(title, text) {
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-text").innerText  = text;
    document.getElementById("popup").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closePopup() {
    document.getElementById("popup").classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("popup").addEventListener("click", function (e) {
    if (e.target === this) closePopup();
});

// ════════════════════════════════════
// 10. CERT POPUP
// ════════════════════════════════════
function openCert(title, issuer, status, desc) {
    document.getElementById("certTitle").innerText  = title;
    document.getElementById("certIssuer").innerText = issuer;
    document.getElementById("certStatus").innerText = "⭐ " + status;
    document.getElementById("certDesc").innerText   = desc;
    document.getElementById("certPopup").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCertPopup() {
    document.getElementById("certPopup").classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("certPopup").addEventListener("click", function (e) {
    if (e.target === this) closeCertPopup();
});

// Escape closes any popup
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closePopup(); closeCertPopup(); }
});
