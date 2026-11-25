/* Japan Lost — redesign-v1 motion
   Vanilla JS only. Quiet, VUILD-range motion: fade + small rise,
   one easing curve, no bounce. See site-design.md "動きの型". */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var videos = document.querySelectorAll("video[autoplay]");

  if (reduced) {
    // No autoplay, no reveal animation, no parallax. Posters carry the visuals.
    videos.forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
    return;
  }

  /* --- Scroll reveal: fade + 26px rise, staggered by --d on each element --- */
  var targets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* --- Hero parallax: media layer drifts at 0.28x scroll, rAF-throttled --- */
  var layer = document.querySelector("[data-parallax]");
  var hero = document.querySelector(".hero");
  if (layer && hero) {
    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (y < hero.offsetHeight) {
        layer.style.transform = "translate3d(0," + (y * 0.28).toFixed(1) + "px,0)";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
