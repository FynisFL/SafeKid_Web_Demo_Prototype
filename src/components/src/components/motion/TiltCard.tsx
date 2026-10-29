import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCanHover } from "@/hooks/useCanHover";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Cursor-following turquoise glow. */
  spotlight?: boolean;
};

const spring = { stiffness: 240, damping: 22, mass: 0.6 };

/**
 * Wraps a card with a soft 3D tilt, a lift on hover, a press-down on tap and a
 * cursor-following glow. Falls back to a plain wrapper for touch devices and
 * for people who prefer reduced motion. Put the radius on `className` so the
 * glow overlay can inherit it.
 */
export function TiltCard({ children, className, max = 7, spotlight = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const enabled = !reduce && canHover;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glow = useSpring(0, { stiffness: 180, damping: 24 });

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const gx = useTransform(px, (v) => v * 100);
  const gy = useTransform(py, (v) => v * 100);
  const background = useMotionTemplate`radial-gradient(240px circle at ${gx}% ${gy}%, hsl(var(--primary) / 0.18), transparent 70%)`;

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function onEnter() {
    if (enabled) glow.set(1);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  }

  if (!enabled) {
    return (
      <div className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative will-change-transform", className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
      {spotlight && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background, opacity: glow }}
        />
      )}
    </motion.div>
  );
}
