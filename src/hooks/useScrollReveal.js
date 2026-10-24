import { useEffect } from "react";

export default function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;

    function revealAll() {
      observer?.disconnect();
      observer = undefined;
      root.classList.remove("motion-ready");
    }

    function observeTargets() {
      revealAll();
      if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

      const targets = root.querySelectorAll("[data-reveal]");
      if (!targets.length) return;

      root.classList.add("motion-ready");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer?.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

      targets.forEach((target) => {
        target.classList.remove("is-revealed");
        observer.observe(target);
      });
    }

    observeTargets();
    reducedMotion.addEventListener("change", observeTargets);

    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener("change", observeTargets);
      root.classList.remove("motion-ready");
      root.querySelectorAll("[data-reveal]").forEach((target) => target.classList.remove("is-revealed"));
    };
  }, [rootRef]);
}
