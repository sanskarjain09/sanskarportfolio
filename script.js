const themeToggle = document.querySelector('[data-role="theme-toggle"]');
const menuToggle = document.getElementById("menu-toggle");
const navShell = document.getElementById("nav-shell");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
const footerYear = document.getElementById("footer-year");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const preferredTheme = savedTheme || "dark";

  applyTheme(preferredTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }
}

function closeMenu() {
  if (!navShell || !menuToggle) {
    return;
  }

  navShell.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function initMenu() {
  if (!navShell || !menuToggle) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navShell.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!navShell.contains(event.target) && navShell.classList.contains("is-open")) {
      closeMenu();
    }
  });
}

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navLink === sectionId);
  });
}

function initSectionTracking() {
  if (!sections.length) {
    return;
  }

  setActiveLink("home");

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length > 0) {
        setActiveLink(visibleEntries[0].target.dataset.section);
      }
    },
    {
      rootMargin: "-42% 0px -42% 0px",
      threshold: [0.2, 0.4, 0.65]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initReveal() {
  if (!revealElements.length) {
    return;
  }

  revealElements.forEach((element, index) => {
    const delay = Math.min(index * 50, 450);
    window.setTimeout(() => {
      element.classList.add("is-visible");
    }, delay);
  });
}

function setYear() {
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
}

initTheme();
initMenu();
initSectionTracking();
initReveal();
setYear();
