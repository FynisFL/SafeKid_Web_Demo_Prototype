import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import heroWatch from "@/assets/safekid/hero-watch.webp";

/* -------------------------------------------------------------------------- */
/*  One timeline, one trigger.                                                */
/*  `useRevealProgress` runs a single 0 → 1 value (2.4 s) when the copy       */
/*  scrolls into view. Every element below reads a window of it, in order:    */
/*  eyebrow → headline (by word, ≈0.1–1.2 s) → paragraph → CTAs → footnote.   */
/*  The watch's depth drift is the only other motion, and it is scroll-linked. */
/* -------------------------------------------------------------------------- */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useSeg(p: MotionValue<number>, from: number, to: number) {
  return useTransform(p, (v) => easeOut(clamp01((v - from) / (to - from))));
}

function useRevealProgress(ref: RefObject<Element | null>) {
  const reduce = useReducedMotion();
  const p = useMotionValue(reduce ? 1 : 0);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    // Reduced motion, or no IntersectionObserver: show the finished state, never hide content.
    if (reduce || typeof IntersectionObserver === "undefined") {
      p.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(p, 1, { duration: 2.4, ease: "linear" });
    return () => controls.stop();
  }, [inView, reduce, p]);

  return p;
}

/** Fades and lifts a block in once its window of the timeline opens. */
function Step({
  p,
  from,
  to,
  lift = 12,
  className,
  children,
}: {
  p: MotionValue<number>;
  from: number;
  to: number;
  lift?: number;
  className?: string;
  children: ReactNode;
}) {
  const t = useSeg(p, from, to);
  const y = useTransform(t, (v) => lift * (1 - v));
  return (
    <motion.div className={className} style={{ opacity: t, y }}>
      {children}
    </motion.div>
  );
}

function Word({
  text,
  p,
  from,
  to,
  accent = false,
}: {
  text: string;
  p: MotionValue<number>;
  from: number;
  to: number;
  accent?: boolean;
}) {
  const t = useSeg(p, from, to);
  const y = useTransform(t, (v) => `${(1 - v) * 115}%`);
  return (
    <span className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-bottom">
      <motion.span className={accent ? "inline-block text-primary" : "inline-block"} style={{ y }}>
        {text}
      </motion.span>
    </span>
  );
}

export function Closing() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const p = useRevealProgress(copyRef);

  // Depth: the watch drifts a little slower than the page. Moves a wrapper, never the filtered image.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const watchY = useTransform(scrollYProgress, [0, 1], [-36, 36]);

  // The panel's left rule draws once, top to bottom.
  const rule = useSeg(p, 0.15, 0.95);
  const ruleClip = useTransform(rule, (v) => `inset(0% 0% ${(1 - v) * 100}% 0%)`);

  return (
    <section ref={sectionRef} className="bg-white pb-20 pt-4 sm:pb-24">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[32px] bg-night px-6 py-16 sm:px-10 sm:py-20 lg:rounded-[44px] lg:px-16 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-primary/12 blur-[100px]"
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] top-1/2 hidden h-[300px] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-primary/45 to-transparent lg:block"
            style={{ clipPath: ruleClip }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 hidden w-[42%] max-w-[440px] lg:block"
          >
            <motion.div className="relative" style={reduce ? undefined : { y: watchY }}>
              <div className="absolute inset-[8%] rounded-full bg-primary/15 blur-[60px]" />
              <img
                src={heroWatch}
                alt=""
                className="relative h-full w-full object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.45)]"
                loading="lazy"
              />
            </motion.div>
          </div>

          <div ref={copyRef} className="relative max-w-[720px]">
            <Step p={p} from={0} to={0.12} lift={8}>
              <p className="eyebrow eyebrow-inverse">
                <span className="eyebrow-line" />
                For all the little adventures ahead
              </p>
            </Step>

            <h2 className="display display-lg mt-6 text-white">
              <span className="sr-only">Independence, with connection.</span>
              <span aria-hidden="true" className="block">
                <span className="block">
                  <Word text="Independence," p={p} from={0.04} to={0.3} />
                </span>
                <span className="block">
                  <Word text="with" p={p} from={0.2} to={0.44} accent />{" "}
                  <Word text="connection." p={p} from={0.28} to={0.52} accent />
                </span>
              </span>
            </h2>

            <Step p={p} from={0.5} to={0.68}>
              <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-white/55">
                SafeKid imagines a little more confidence for children, and a little more reassurance
                for the families cheering them on.
              </p>
            </Step>

            <Step p={p} from={0.66} to={0.86}>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Magnetic>
                  <Link
                    to="/zodiac"
                    className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-white pl-6 pr-5 text-[14px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-soft btn-motion btn-motion-light"
                  >
                    Meet the 12 editions
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Magnetic>
                <Link
                  to="/contact"
                  className="group press inline-flex items-center gap-2 text-[14px] font-medium text-white/75 transition-colors hover:text-white"
                >
                  Let's talk about SafeKid
                  <ArrowUpRight
                    className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Step>

            <Step p={p} from={0.82} to={1} lift={0}>
              <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-white/50">
                <span>A concept by SafeKid</span>
                <span className="h-3 w-px bg-white/15" />
                <span>Developed by DigiBabi</span>
                <span className="h-3 w-px bg-white/15" />
                <span>No live device or service</span>
              </div>
            </Step>
          </div>
        </div>
      </div>
    </section>
  );
}
