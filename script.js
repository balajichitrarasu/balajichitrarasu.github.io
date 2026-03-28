document.addEventListener("DOMContentLoaded", function () {

    // ════════════════════════════════════════
    // 1. TYPING EFFECT
    // ════════════════════════════════════════
    const el = document.getElementById("typing");
    const text = "Balaji Chitrarasu";
    let i = 0;

    function typing() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 80);
        } else {
            el.classList.add("done");
        }
    }
    typing();

    // ════════════════════════════════════════
    // 2. PARTICLES
    // ════════════════════════════════════════
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 45, density: { enable: true, value_area: 900 } },
                color: { value: "#00ffcc" },
                shape: { type: "circle" },
                opacity: { value: 0.14, random: true },
                size: { value: 2.2, random: true },
                line_linked: {
                    enable: true,
                    distance: 130,
                    color: "#1c2530",
                    opacity: 0.26,
                    width: 1
                },
                move: { enable: true, speed: 0.75, random: true, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 155, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }

    // ════════════════════════════════════════
    // 3. CUSTOM CURSOR GLOW
    // ════════════════════════════════════════
    const glow = document.getElementById("cursor-glow");
    if (glow && window.innerWidth > 700) {
        document.addEventListener("mousemove", e => {
            glow.style.left = e.clientX + "px";
            glow.style.top  = e.clientY + "px";
        });
        document.addEventListener("mouseleave", () => {
            glow.style.opacity = "0";
        });
        document.addEventListener("mouseenter", () => {
            glow.style.opacity = "1";
        });
    }

    // ════════════════════════════════════════
    // 4. NAV — HIDE ON SCROLL DOWN, SHOW UP
    // ════════════════════════════════════════
    const navbar = document.getElementById("navbar");
    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const curr = window.scrollY;
                if (curr > lastY && curr > 80) {
                    navbar.classList.add("hidden");
                } else {
                    navbar.classList.remove("hidden");
                }
                navbar.classList.toggle("scrolled", curr > 20);
                lastY = curr;
                ticking = false;
            });
            ticking = true;
        }
    });

    // ════════════════════════════════════════
    // 5. ACTIVE NAV LINK ON SCROLL
    // ════════════════════════════════════════
    const sections = document.querySelectorAll("section[id], header[id]");
    const navLinks = document.querySelectorAll(".navbar ul li a");

    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(a => a.classList.remove("active"));
                const link = document.querySelector(`.navbar ul li a[href="#${e.target.id}"]`);
                if (link) link.classList.add("active");
            }
        });
    }, { threshold: 0.38 });

    sections.forEach(s => sectionObs.observe(s));

    // ════════════════════════════════════════
    // 6. SCROLL FADE-IN + SKILL BARS
    // ════════════════════════════════════════
    const fadeObs = new IntersectionObserver(entries => {
        entries.forEach((e, idx) => {
            if (e.isIntersecting) {
                setTimeout(() => {
                    e.target.classList.add("visible");
                    // animate skill bars
                    const fill = e.target.querySelector(".fill");
                    if (fill) {
                        const w = fill.getAttribute("data-width");
                        setTimeout(() => { fill.style.width = w + "%"; }, 120);
                    }
                }, idx * 80);
                fadeObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in").forEach(el => fadeObs.observe(el));

    // ════════════════════════════════════════
    // 7. TILT EFFECT ON CARDS
    // ════════════════════════════════════════
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) * 6;
            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    // ════════════════════════════════════════
    // 8. MOBILE NAV TOGGLE
    // ════════════════════════════════════════
    const toggle = document.getElementById("navToggle");
    const navUl  = document.getElementById("navMenu");

    if (toggle && navUl) {
        toggle.addEventListener("click", () => navUl.classList.toggle("open"));
        navUl.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => navUl.classList.remove("open"));
        });
    }

    // ════════════════════════════════════════
    // 9. CONTACT FORM — EmailJS Backend
    // ════════════════════════════════════════
    /*
     * HOW TO ENABLE REAL EMAIL SENDING:
     * 1. Go to https://www.emailjs.com and create a free account
     * 2. Add an Email Service (Gmail recommended) — copy your SERVICE_ID
     * 3. Create an Email Template with these variables:
     *    {{from_name}}, {{from_email}}, {{message}}
     *    Copy your TEMPLATE_ID
     * 4. Go to Account > API Keys — copy your PUBLIC_KEY
     * 5. Replace the three placeholders below
     *
     * Template subject suggestion: "Portfolio Message from {{from_name}}"
     * Template body: Name: {{from_name}} | Email: {{from_email}} | Message: {{message}}
     * Send TO: balajihck20@gmail.com
     */
    const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // ← replace
    const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // ← replace
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // ← replace

    if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const sendBtn = document.getElementById("sendBtn");
    const formMsg = document.getElementById("formMsg");

    function showMsg(type, text) {
        formMsg.className = "form-msg " + type;
        formMsg.textContent = text;
        formMsg.style.display = "block";
        setTimeout(() => { formMsg.style.display = "none"; }, 4500);
    }

    if (sendBtn) {
        sendBtn.addEventListener("click", () => {
            const name  = document.getElementById("cName").value.trim();
            const email = document.getElementById("cEmail").value.trim();
            const msg   = document.getElementById("cMsg").value.trim();

            if (!name || !email || !msg) {
                showMsg("error", "⚠️ Please fill in all fields before sending.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMsg("error", "⚠️ Please enter a valid email address.");
                return;
            }

            // If EmailJS is configured, send real email
            if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
                sendBtn.textContent = "Sending...";
                sendBtn.disabled = true;

                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    from_name:  name,
                    from_email: email,
                    message:    msg
                }).then(() => {
                    showMsg("success", "✓ Message sent successfully! I'll get back to you soon.");
                    sendBtn.textContent = "Send Message";
                    sendBtn.disabled = false;
                    document.getElementById("cName").value  = "";
                    document.getElementById("cEmail").value = "";
                    document.getElementById("cMsg").value   = "";
                }).catch(() => {
                    showMsg("error", "❌ Failed to send. Please email directly: balajihck20@gmail.com");
                    sendBtn.textContent = "Send Message";
                    sendBtn.disabled = false;
                });
            } else {
                // Fallback: open mail client
                const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
                window.open(`mailto:balajihck20@gmail.com?subject=Portfolio%20Message%20from%20${encodeURIComponent(name)}&body=${mailBody}`);
                showMsg("success", "✓ Your mail app opened! Alternatively email: balajihck20@gmail.com");
            }
        });
    }

}); // end DOMContentLoaded

// ════════════════════════════════════════
// 10. PROJECT POPUP
// ════════════════════════════════════════
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

// ════════════════════════════════════════
// 11. CERT POPUP
// ════════════════════════════════════════
function openCert(title, issuer, status, desc, imgSrc) {
    document.getElementById("certTitle").innerText   = title;
    document.getElementById("certIssuer").innerText  = issuer;
    document.getElementById("certStatus").innerText  = "⭐ " + status;
    document.getElementById("certDesc").innerText    = desc;

    const img = document.getElementById("certImg");
    if (imgSrc) {
        img.src = imgSrc;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }

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

// Escape key closes any open popup
document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closePopup(); closeCertPopup(); }
});
