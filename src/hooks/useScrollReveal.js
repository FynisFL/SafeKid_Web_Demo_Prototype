import { useEffect } from "react";

export default function useScrollReveal(rootRef, options = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    let fallbackTimer;
    let scrollTimeout;

    function revealAll() {
      observer?.disconnect();
      observer = undefined;
      root.classList.remove("motion-ready");
    }

    function revealTarget(target) {
      target.setAttribute("data-revealed", "true");
      observer?.unobserve(target);
    }

    function revealInViewport() {
      const viewportHeight = window.innerHeight;
      const unrevealed = root.querySelectorAll("[data-reveal]:not([data-revealed])");
      unrevealed.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top < viewportHeight + 800 && rect.bottom > -800) {
          revealTarget(target);
        }
      });
    }

    function revealWithStagger() {
      const viewportHeight = window.innerHeight;
      const unrevealed = Array.from(root.querySelectorAll("[data-reveal]:not([data-revealed])"));
      const inViewport = unrevealed.filter((target) => {
        const rect = target.getBoundingClientRect();
        return rect.top < viewportHeight + 800 && rect.bottom > -800;
      });

      // Sort by data-reveal-delay for stagger effect on initial load
      inViewport.sort((a, b) => {
        const delayA = parseInt(a.getAttribute("data-reveal-delay") || "0", 10);
        const delayB = parseInt(b.getAttribute("data-reveal-delay") || "0", 10);
        return delayA - delayB;
      });

      inViewport.forEach((target, index) => {
        const delay = parseInt(target.getAttribute("data-reveal-delay") || "0", 10);
        const baseDelay = delay * 64;
        const staggerDelay = index * 40;
        setTimeout(() => revealTarget(target), baseDelay + staggerDelay);
      });
    }

    function onScroll() {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = undefined;
        revealInViewport();
      }, 80);
    }

    function observeTargets() {
      revealAll();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

      const targets = root.querySelectorAll("[data-reveal]:not([data-revealed])");
      if (!targets.length) return;

      root.classList.add("motion-ready");

      // Use stagger reveal on initial load for intro animation
      revealWithStagger();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealTarget(entry.target);
          });
        },
        {
          rootMargin: "0px 0px 20% 0px",
          threshold: 0.1,
        }
      );

      targets.forEach((target) => {
        observer.observe(target);
      });

      fallbackTimer = setTimeout(() => {
        const remaining = root.querySelectorAll("[data-reveal]:not([data-revealed])");
        remaining.forEach((target) => revealTarget(target));
      }, 1200);
    }

    observeTargets();
    window.addEventListener("scroll", onScroll, { passive: true });
    reducedMotion.addEventListener("change", observeTargets);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", observeTargets);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      root.classList.remove("motion-ready");
      root.querySelectorAll("[data-reveal]").forEach((target) => target.removeAttribute("data-revealed"));
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [rootRef]);
}
