document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap) return;

  var hero = document.querySelector(".lp-hero");
  if (hero) {
    window.gsap.from(hero.querySelectorAll(".lp-eyebrow, .lp-hero__title, .lp-hero__sub, .lp-hero__actions"), {
      y: 22,
      duration: 0.65,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "transform"
    });
    var visual = hero.querySelector(".lp-hero__cover, .lp-hero__visual");
    if (visual) window.gsap.from(visual, { scale: 0.96, duration: 0.8, delay: 0.18, ease: "power3.out", clearProps: "transform" });
  }

  if (!("IntersectionObserver" in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      window.gsap.from(entry.target.querySelectorAll(".lp-section__title, .lp-section__sub, .lp-product, .lp-price, .lp-model, .lp-feature, .lp-faq__item"), {
        y: 20,
        duration: 0.55,
        stagger: 0.045,
        ease: "power3.out",
        clearProps: "transform"
      });
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  document.querySelectorAll(".lp-section, .lp-cta").forEach(function (section) { observer.observe(section); });
});
