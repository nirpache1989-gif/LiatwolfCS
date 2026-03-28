const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const root = document.documentElement;
const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");

/* =============================================
   STAGGER GRID SETUP
   ============================================= */
document.querySelectorAll("[data-stagger-grid], [data-stagger-children]").forEach((group) => {
  [...group.children].forEach((child, index) => {
    if (child.classList.contains("flow-steps__line")) {
      return;
    }

    child.style.setProperty("--stagger-index", index);
  });
});

document.querySelectorAll("[data-animate]").forEach((item) => {
  item.classList.add("animate-on-scroll");
});

const animatedItems = [...document.querySelectorAll(".animate-on-scroll")];

/* =============================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================= */
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  animatedItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedItems.forEach((item) => observer.observe(item));
}

/* =============================================
   SCROLL STATE & HEADER
   ============================================= */
function syncScrollState() {
  const scrolled = window.scrollY > 20;

  header?.classList.toggle("is-scrolled", scrolled);
  nav?.classList.toggle("scrolled", scrolled);

  /* =============================================
     SCROLL-LINKED HUE SHIFT
     ============================================= */
  if (prefersReducedMotion) {
    return;
  }

  const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
  const hueShift = scrollPercent * 5;

  root.style.setProperty("--scroll-hue", `${hueShift.toFixed(2)}deg`);
}

syncScrollState();
window.addEventListener("scroll", syncScrollState, { passive: true });
