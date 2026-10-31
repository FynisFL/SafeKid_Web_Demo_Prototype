import { useMotionValue, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import type { RefObject } from "react";

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

/**
 * Scroll progress (0 → 1) of a section. With reduced motion it is fixed at 1,
 * so anything driven by it renders in its finished state and nothing is hidden.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  offset: ScrollOffset = ["start 80%", "end 60%"]
): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const finished = useMotionValue(1);
  return reduce ? finished : scrollYProgress;
}
