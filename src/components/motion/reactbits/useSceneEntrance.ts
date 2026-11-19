import { useEffect, useRef, type RefObject } from "react";
import { EASE } from "../tokens";
import { useEnhancedMotion } from "../useEnhancedMotion";

type Entrance = {
  enabled: boolean;
  trigger: "enter" | "mount";
  duration: number;
  threshold?: number;
  filter?: string;
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
};

export function useSceneEntrance(node: RefObject<HTMLElement | null>, options: Entrance) {
  const played = useRef(false);
  const ready = useEnhancedMotion();
  const { enabled, trigger, threshold = 0.2, duration, filter = "none", x = 0, y = 0, opacity = 1, scale = 1 } = options;

  useEffect(() => {
    const element = node.current;
    if (!ready || !enabled || played.current || !element?.animate) return;
    let animation: Animation | undefined;
    let observer: IntersectionObserver | undefined;

    function start() {
      if (played.current || !element) return;
      played.current = true;
      observer?.disconnect();
      animation = element.animate(
        [{ transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity, filter },
          { transform: "none", opacity: 1, filter: "none" }],
        { duration: duration * 1000, easing: `cubic-bezier(${EASE.join(",")})` },
      );
    }

    if (trigger === "mount" || typeof IntersectionObserver === "undefined") start();
    else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) start();
      }, { threshold });
      observer.observe(element);
    }
    return () => {
      observer?.disconnect();
      animation?.cancel();
    };
  }, [node, ready, enabled, trigger, threshold, duration, filter, x, y, opacity, scale]);
}
