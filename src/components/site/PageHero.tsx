import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { useFirstScene } from "@/components/preloader/firstSceneContext";
import { DURATION, EASE } from "@/components/motion/tokens";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  actions?: ReactNode;
  art?: ReactNode;
  meta?: string;
  compact?: boolean;
};

export function PageHero({ eyebrow, title, intro, actions, art, meta, compact }: PageHeroProps) {
  const { entrance } = useFirstScene();
  const reduce = useReducedMotion() || entrance === "static";
  const waiting = entrance === "waiting" && !reduce;

  return (
    <section className="relative overflow-hidden bg-mist pb-14 pt-[112px] sm:pb-16 lg:pb-20 lg:pt-[132px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -top-[30%] h-[720px] w-[720px] rounded-full bg-white/70 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white/70"
      />
      <div className="shell relative grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12">
        <div className="min-w-0">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {eyebrow}
          </p>
          <h1
            className={
              compact
                ? "display mt-6 text-[clamp(2.3rem,4.4vw,3.7rem)]"
                : "display display-lg mt-6"
            }
          >
            <motion.span
              className="block pb-[0.08em]"
              initial={reduce ? false : { opacity: 0.45, y: 16, clipPath: "inset(0 0 100% 0)" }}
              animate={waiting ? { opacity: 0.45, y: 16, clipPath: "inset(0 0 100% 0)" } : { opacity: 1, y: 0, clipPath: "inset(-10% -5% -12% -5%)" }}
              transition={{ duration: reduce ? 0 : DURATION.base, ease: EASE }}
            >
              {title}
            </motion.span>
          </h1>
          <motion.p
            className="lede mt-6 max-w-[46ch] text-deep"
            initial={reduce ? false : { y: 8 }}
            animate={{ y: waiting ? 8 : 0 }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.09, ease: EASE }}
          >
            {intro}
          </motion.p>
          {actions && <div className="mt-8 flex flex-wrap items-center gap-5">{actions}</div>}
          {meta && (
            <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-deep/85">{meta}</p>
          )}
        </div>

        {art && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : DURATION.base, delay: reduce ? 0 : 0.07, ease: EASE }}
            className="relative min-w-0"
          >
            {art}
          </motion.div>
        )}
      </div>
    </section>
  );
}
