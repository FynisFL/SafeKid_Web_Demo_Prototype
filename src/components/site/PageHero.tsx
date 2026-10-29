import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  const reduce = useReducedMotion();

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
        <motion.div
          className="min-w-0"
          initial={reduce ? undefined : { opacity: 0, y: 22 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
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
            {title}
          </h1>
          <p className="lede mt-6 max-w-[46ch]">{intro}</p>
          {actions && <div className="mt-8 flex flex-wrap items-center gap-5">{actions}</div>}
          {meta && (
            <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-deep/55">{meta}</p>
          )}
        </motion.div>

        {art && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-w-0"
          >
            {art}
          </motion.div>
        )}
      </div>
    </section>
  );
}
