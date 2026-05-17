const landingThemeButton = document.querySelector("#landingThemeBtn");
const landingStoredTheme = localStorage.getItem("nongpeung-landing-theme");

if (landingStoredTheme === "dark") {
  document.body.classList.add("landing-dark");
  landingThemeButton.textContent = "☀️";
}

landingThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("landing-dark");
  const dark = document.body.classList.contains("landing-dark");
  landingThemeButton.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("nongpeung-landing-theme", dark ? "dark" : "light");
});

const landingObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("landing-visible");
  });
}, { threshold: 0.18 });

document.querySelectorAll(".landing-section, .landing-final-cta").forEach((section) => {
  section.classList.add("landing-reveal");
  landingObserver.observe(section);
});
