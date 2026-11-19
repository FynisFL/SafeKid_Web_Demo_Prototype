import { useEffect, useRef, type RefObject } from "react";
import { EASE } from "../tokens";
import { useEnhancedMotion } from "../useEnhancedMotion";

type Entrance = {
  enabled: boolean;
  trigger: "enter" | "mount";
  duration: number;
  threshold?: number;
  firstSection?: boolean;
  filter?: string;
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
};

export function useSceneEntrance(node: RefObject<HTMLElement | null>, options: Entrance) {
  const played = useRef(false);
  const ready = useEnhancedMotion();
  const { enabled, trigger, threshold = 0.2, firstSection = false, duration, filter = "none", x = 0, y = 0, opacity = 1, scale = 1 } = options;

  useEffect(() => {
    const root = node.current;
    // Moving the page root can move hash targets while Firefox is scrolling to them.
    const element = firstSection ? root?.querySelector<HTMLElement>(":scope > section") ?? root : root;
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
  }, [node, ready, enabled, trigger, threshold, firstSection, duration, filter, x, y, opacity, scale]);
}
