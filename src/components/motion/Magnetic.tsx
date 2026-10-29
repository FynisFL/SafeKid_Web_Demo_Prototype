import { type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCanHover } from "@/hooks/useCanHover";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** 0–1: how far the element follows the cursor. */
  strength?: number;
  /** Hard cap on travel in px so big buttons never wander off. */
  limit?: number;
};

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/**
 * A button/link magnet: the child drifts gently toward the cursor and springs
 * back on leave, and squishes slightly on press. Pointer-fine devices only.
 */
export function Magnetic({ children, className, strength = 0.22, limit = 9 }: MagneticProps) {
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const enabled = !reduce && canHover;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  function onMove(event: PointerEvent<HTMLSpanElement>) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(clamp(dx * strength, limit));
    y.set(clamp(dy * strength, limit));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  if (!enabled) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <motion.span
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
