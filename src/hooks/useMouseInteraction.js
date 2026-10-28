import { useState, useEffect, useRef, useCallback } from "react";

export default function useMouseInteraction({
  intensity = 8,
  scaleOnHover = 1.02,
  glowColor = "#00C7CA",
  disabled = false,
} = {}) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: true }
  );

  const handleMouseMove = useCallback((event) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) {
        rafRef.current = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = ((y - 0.5) * 2 * intensity).toFixed(2);
      const tiltY = ((x - 0.5) * -2 * intensity).toFixed(2);
      setTilt({ x: tiltX, y: tiltY });
      setMousePos({ x, y });
      rafRef.current = null;
    });
  }, [intensity]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion.current.matches || disabled) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [disabled, handleMouseEnter, handleMouseLeave, handleMouseMove]);

  const style = {
    "--tilt-x": `${tilt.x}deg`,
    "--tilt-y": `${tilt.y}deg`,
    "--mouse-x": `${mousePos.x}`,
    "--mouse-y": `${mousePos.y}`,
    "--glow-color": glowColor,
  };

  if (reducedMotion.current.matches || disabled) {
    return {
      ref,
      style: { "--glow-color": glowColor },
      handlers: {},
      isHovering: false,
      tiltX: 0,
      tiltY: 0,
      mousePos: { x: 0.5, y: 0.5 },
    };
  }

  return {
    ref,
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    isHovering,
    tiltX: tilt.x,
    tiltY: tilt.y,
    mousePos,
  };
}
