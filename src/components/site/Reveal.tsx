import { motion, useReducedMotion, type Variants } from "motion/react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { DISTANCE, DURATION, EASE } from "@/components/motion/tokens";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  variant?: "up" | "soft" | "clip" | "drift";
  once?: boolean;
}>;

const variantsFor = (variant: RevealProps["variant"]): Variants => {
  switch (variant) {
    case "clip":
      return {
        hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        show: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
      };
    case "soft":
      return {
        hidden: { opacity: 0, scale: 0.985 },
        show: { opacity: 1, scale: 1 },
      };
    case "drift":
      return {
        hidden: { opacity: 0, y: DISTANCE.lg, rotate: -0.6 },
        show: { opacity: 1, y: 0, rotate: 0 },
      };
    default:
      return {
        hidden: { opacity: 0, y: DISTANCE.md },
        show: { opacity: 1, y: 0 },
      };
  }
};

/**
 * A rare, purposeful viewport reveal. Scroll-linked choreography lives in the
 * dedicated scene components — this is only for reading rhythm.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variantsFor(variant)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -8% 0px" }}
      transition={{ duration: DURATION.base, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
