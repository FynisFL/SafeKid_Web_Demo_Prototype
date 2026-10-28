import { useEffect } from "react";

export default function useParallax(rootRef, options = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const speed = options.speed ?? 0.08;
    let raf = 0;
    let lastOffset = null;

    function update() {
      const rect = root.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (center - viewportCenter) * speed;
      const rounded = Math.round(offset * 2) / 2;
      if (rounded === lastOffset) return;
      lastOffset = rounded;
      root.style.setProperty("--parallax-y", `${rounded}px`);
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef, options.speed]);
}
