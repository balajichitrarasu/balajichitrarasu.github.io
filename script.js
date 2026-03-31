window.addEventListener("load", function () {

    // LOADER
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 600);
    }, 1200);

    // TYPING
    var el = document.getElementById("typing");
    var text = "Balaji Chitrarasu";
    var i = 0;
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    }
    type();

    // PARTICLES
    particlesJS("particles-js", {
        particles: {
            number: { value: 40 },
            size: { value: 2 },
            color: { value: "#00ffcc" },
            line_linked: { enable: true, color: "#00ffcc", opacity: 0.2 }
        }
    });

    // FADE IN
    const faders = document.querySelectorAll(".fade-in");
    const appear = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    });
    faders.forEach(el => appear.observe(el));

});

// POPUP
function openPopup(title, text) {
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-text").innerText = text;
    document.getElementById("popup").classList.add("open");
}
function closePopup() {
    document.getElementById("popup").classList.remove("open");
}