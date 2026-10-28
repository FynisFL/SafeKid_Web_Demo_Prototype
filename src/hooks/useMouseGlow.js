import { useEffect } from "react";

export default function useMouseGlow({ containerRef, selector = ".landing-hero, .zodiac-hero, .support-hero, .contact-hero, .product-hero, .secondary-hero" }) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hero = container.querySelector(selector);
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    function handleMouseMove(e) {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mouse-x", `${Math.max(0, Math.min(100, x))}%`);
      hero.style.setProperty("--mouse-y", `${Math.max(0, Math.min(100, y))}%`);
    }

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef, selector]);
}
