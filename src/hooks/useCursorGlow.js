import { useEffect } from "react";

export default function useCursorGlow(rootRef, options = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const size = options.size ?? 320;
    const color = options.color ?? "rgba(0, 199, 202, 0.07)";

    let dot = root.querySelector(".cursor-glow");
    if (!dot) {
      dot = document.createElement("span");
      dot.className = "cursor-glow";
      dot.setAttribute("aria-hidden", "true");
      root.appendChild(dot);
    }

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;

    function update() {
      dot.style.setProperty("--cursor-x", `${mouseX}px`);
      dot.style.setProperty("--cursor-y", `${mouseY}px`);
    }

    function scheduleUpdate() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    }

    function handleMouseMove(e) {
      const rect = root.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      scheduleUpdate();
    }

    function handleMouseLeave() {
      dot.style.opacity = "0";
    }

    function handleMouseEnter() {
      dot.style.opacity = "1";
    }

    dot.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle, ${color}, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      left: var(--cursor-x, 50vw);
      top: var(--cursor-y, 50vh);
      opacity: 0;
      transition: opacity .4s ease;
    `;

    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("mouseleave", handleMouseLeave);
    root.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      root.removeEventListener("mousemove", handleMouseMove);
      root.removeEventListener("mouseleave", handleMouseLeave);
      root.removeEventListener("mouseenter", handleMouseEnter);
      if (raf) cancelAnimationFrame(raf);
      dot.remove();
    };
  }, [rootRef, options.size, options.color]);
}
