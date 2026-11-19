// Adapted from React Bits Count Up (TS-TW).
// https://reactbits.dev/r/CountUp-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { DURATION, EASE } from "../tokens";
import { useEnhancedMotion } from "../useEnhancedMotion";

export function CountUp({ value, digits = 0, className }: { value: number; digits?: number; className?: string }) {
  const element = useRef<HTMLSpanElement>(null);
  const inView = useInView(element, { once: true });
  const enabled = useEnhancedMotion();
  const final = value.toFixed(digits);
  useEffect(() => {
    const node = element.current;
    if (!node || !inView || !enabled) return;
    const controls = animate(0, value, {
      duration: DURATION.base, ease: EASE,
      onUpdate: current => { node.textContent = current.toFixed(digits); },
    });
    return () => {
      controls.stop();
      node.textContent = final;
    };
  }, [digits, enabled, final, inView, value]);
  return <span className={className} data-count-up=""><span className="sr-only">{final}</span><span ref={element} aria-hidden="true">{final}</span></span>;
}
