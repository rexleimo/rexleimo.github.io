document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".wp2-home__collection-image img").forEach(function (image) {
    function replaceBrokenImage() {
      var frame = image.parentElement;
      image.remove();
      if (frame) frame.classList.add("is-empty");
    }
    if (image.complete && !image.naturalWidth) replaceBrokenImage();
    else image.addEventListener("error", replaceBrokenImage, { once: true });
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap) return;

  var capabilityCards = Array.prototype.slice.call(document.querySelectorAll("[data-wp2-capability]"));
  if (capabilityCards.length) {
    window.gsap.from(capabilityCards, {
      y: function (index) { return index % 2 ? 18 : 28; },
      duration: 0.55,
      stagger: 0.06,
      ease: "power3.out",
      clearProps: "transform"
    });
  }

  var collectionCards = Array.prototype.slice.call(document.querySelectorAll("[data-wp2-collection-card]"));
  if (!collectionCards.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var grid = entry.target;
      observer.unobserve(grid);
      window.gsap.from(grid.querySelectorAll("[data-wp2-collection-card]"), {
        y: function (index) { return index === 0 ? 30 : 18; },
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform"
      });
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  document.querySelectorAll(".wp2-home__collection-grid").forEach(function (grid) {
    observer.observe(grid);
  });
});
