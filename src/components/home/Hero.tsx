import { CountUp } from "@/components/motion/reactbits/CountUp";
import { ErrorBoundary } from "react-error-boundary";
import { SET_PIECES } from "@/components/motion/setPieces";
import { useEnhancedMotion } from "@/components/motion/useEnhancedMotion";
import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useInView,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, MoveDown } from "lucide-react";
import heroWatch from "@/assets/safekid/editions/rat.webp";
import { useFirstScene } from "@/components/preloader/firstSceneContext";
import { DURATION, EASE } from "@/components/motion/tokens";

const ease = EASE;
const HeroSignal = lazy(() => import("./HeroSignal"));

function OrbitTicks() {
  const reduce = useReducedMotion();
  const { entrance } = useFirstScene();
  const animate = entrance === "play" && !reduce;

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-primary/45"
    >
      <motion.circle
        cx="200"
        cy="200"
        r="196"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.45"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: entrance === "waiting" ? 0 : 1 }}
        transition={{ duration: animate ? 1.8 : 0, delay: animate ? 0.35 : 0, ease }}
      />
      <motion.circle
        cx="200"
        cy="200"
        r="178"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="1 13"
        opacity="0.9"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: entrance === "waiting" ? 0 : 0.9 }}
        transition={{ duration: animate ? DURATION.slow : 0, delay: animate ? 0.9 : 0 }}
      />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * 360) / 12;
        return (
          <motion.line
            key={angle}
            x1="200"
            y1="14"
            x2="200"
            y2={index % 3 === 0 ? 30 : 22}
            stroke="currentColor"
            strokeWidth={index % 3 === 0 ? 1.4 : 0.8}
            transform={`rotate(${angle} 200 200)`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: entrance === "waiting" ? 0 : 1 }}
            transition={{ duration: animate ? 0.5 : 0, delay: animate ? 0.8 + index * 0.06 : 0 }}
          />
        );
      })}
    </svg>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const { entrance } = useFirstScene();
  const systemReduce = useReducedMotion();
  const reduce = systemReduce || entrance === "static";
  const waiting = entrance === "waiting";

  useEffect(() => {
    if (!waiting) performance.mark("safekid-hero-enter");
  }, [waiting]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visible = useInView(sectionRef);
  const artVisible = useInView(artRef);
  const enhanced = useEnhancedMotion();
  const [signalReady, setSignalReady] = useState(false);
  useEffect(() => {
    if (waiting || reduce || !enhanced || !artVisible || !SET_PIECES.heroSignal) return;
    const timer = window.setTimeout(() => setSignalReady(true), 420);
    return () => window.clearTimeout(timer);
  }, [enhanced, reduce, artVisible, waiting]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  // Starts late on purpose: the CTAs sit about 60-70% down the hero and must stay readable
  // (>= ~0.7 opacity) for as long as they are on screen. See HE-1.
  const copyOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0.82]);
  // 36 degrees in total while the hero scrolls away.
  const ticksRotate = useTransform(scrollYProgress, [0, 1], [0, 36]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.5 });
  const rotateY = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.5 });

  // Layers share the watch's two springs with different multipliers. Wrappers carry the offsets,
  // so no element has two owners for x/y (the chips keep their own entrance animation).
  const glowX = useTransform(rotateY, (v) => v * -3);
  const glowY = useTransform(rotateX, (v) => v * 3);
  const ticksX = useTransform(rotateY, (v) => v * 1.5);
  const ticksY = useTransform(rotateX, (v) => v * -1.5);
  const chipX = useTransform(rotateY, (v) => v * 4);
  const chipY = useTransform(rotateX, (v) => v * -4);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse" || !artRef.current) return;
    const rect = artRef.current.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 9);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -7);
  }

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }


  const motionProps = reduce
    ? {}
    : {
        initial: "hidden" as const,
        animate: waiting ? "hidden" as const : "show" as const,
      };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.075, delayChildren: 0.12 } },
  };

  const line = {
    hidden: { y: "112%" },
    show: { y: "0%", transition: { duration: 1.05, ease } },
  };

  const soft = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-white pb-12 pt-[92px] lg:pb-20 lg:pt-[104px]"
      aria-label="SafeKid introduction"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18%] top-[-12%] h-[860px] w-[860px] rounded-full opacity-90 blur-[2px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--secondary) / 0.85) 0%, hsl(var(--mist) / 0.55) 46%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[29%] bg-gradient-to-b from-transparent via-mist/70 to-[#dcefee]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[7%] hidden w-px bg-ink/[0.05] lg:block"
      />

      <div className="shell relative grid items-center gap-5 pb-8 pt-2 sm:gap-12 sm:pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-4 lg:pb-12">
        <motion.div
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
          {...motionProps}
          variants={container}
          className="relative z-10 max-w-[620px]"
        >
          <motion.p variants={reduce ? undefined : soft} className="eyebrow">
            <span className="eyebrow-line" />
            A little more room to grow
          </motion.p>

          <h1 className="display display-xl mt-4 sm:mt-6 text-ink">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={reduce ? undefined : line} className="block">
                Let them
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={reduce ? undefined : line} className="block">
                explore <span className="text-aqua-ink">the world.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={reduce ? undefined : soft}
            className="lede mt-4 max-w-[46ch] text-[15px] leading-relaxed sm:mt-7 sm:text-[17px]"
          >
            A little independence for them. A little more reassurance for you. SafeKid is a product
            concept built around the space between both.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : soft}
            className="mt-5 flex flex-wrap items-center gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-7"
          >
            <a
              href="#story"
              className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-ink pl-6 pr-5 text-[14px] font-medium text-white shadow-pill transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
            >
              Discover SafeKid
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 transition-transform duration-300 group-hover:translate-y-0.5">
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
            <Link
              to="/zodiac"
              className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-ink"
            >
              Meet the 12 Zodiac editions
              <ArrowUpRight
                className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : soft}
            className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-deep/85 sm:mt-11 sm:gap-4"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-sk-pulse" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Product concept
            </span>
            <span className="h-3 w-px bg-ink/10" />
            <span>No device connected</span>
            <span className="h-3 w-px bg-ink/10" />
            <span><CountUp value={12} /> editions</span>
          </motion.div>
        </motion.div>

        <div className="relative z-0 flex w-full justify-center lg:justify-end">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: waiting && !reduce ? 0 : 1 }}
            transition={{ duration: reduce || waiting ? 0 : DURATION.slow, ease, delay: reduce || waiting ? 0 : 0.12 }}
            className="flex w-full justify-center lg:justify-end"
            style={{ willChange: waiting && !reduce ? "opacity" : undefined }}
          >
          <div
            ref={artRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className="perspective-1200 relative aspect-square w-full max-w-[320px] sm:max-w-[520px] lg:max-w-[580px]"
          >
            {signalReady && enhanced && artVisible && !reduce && (
              <ErrorBoundary fallback={null}>
                <Suspense fallback={null}><HeroSignal /></Suspense>
              </ErrorBoundary>
            )}
            <motion.div
              aria-hidden="true"
              className="stage-glow absolute inset-[2%] rounded-full"
              style={reduce ? undefined : { x: glowX, y: glowY }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={reduce ? undefined : { rotate: ticksRotate, x: ticksX, y: ticksY }}
            >
              <OrbitTicks />
            </motion.div>
            <span
              aria-hidden="true"
              className="absolute inset-[21%] rounded-full border border-primary/25"
            />

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={
                reduce
                  ? undefined
                  : { rotateX, rotateY, transformStyle: "preserve-3d" }
              }
            >
              <img
                src={heroWatch}
                alt="SafeKid smartwatch concept, Mouse edition, from the Vietnamese Zodiac collection"
                width={620}
                height={620}
                fetchPriority="high"
                className="h-[92%] w-[92%] select-none object-contain drop-shadow-[0_40px_60px_rgba(16,42,56,0.16)]"
                draggable="false"
              />
            </motion.div>

            {!reduce && !waiting && visible && (
              <motion.div aria-hidden="true"
                className="pointer-events-none absolute inset-[8%] rounded-full border border-primary/60"
                initial={{ scale: .85, opacity: 0 }} animate={{ scale: [0.85, 1.04, 1.09], opacity: [0, 0.62, 0] }}
                transition={{ duration: DURATION.slow, delay: .22, ease }}
              />
            )}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={reduce ? undefined : { x: chipX, y: chipY }}
            >
            <motion.div
              initial={reduce ? undefined : { opacity: 0, x: 14 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.9, ease }}
              className="absolute right-0 top-[13%] hidden items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-deep/70 shadow-[0_18px_40px_-28px_rgba(16,42,56,0.5)] backdrop-blur-md sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Zodiac Collection
            </motion.div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, x: -14 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.9, ease }}
              className="absolute bottom-[9%] left-0 hidden max-w-[190px] rounded-2xl border border-white/80 bg-white/85 p-3.5 shadow-[0_24px_60px_-40px_rgba(16,42,56,0.6)] backdrop-blur-md sm:block"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
                Mouse edition / Tý
              </p>
              <p className="mt-1 font-display text-[13px] leading-snug tracking-tight text-ink">
                Made for their next little adventure.
              </p>
            </motion.div>
            </motion.div>

            <p className="absolute inset-x-0 -bottom-2 text-center text-[9px] uppercase tracking-[0.24em] text-deep/50">
              Illustrative product render
            </p>
          </div>
          </motion.div>
        </div>
      </div>

      <div className="shell relative flex items-center justify-between border-t border-ink/[0.07] pt-5">
        <a href="#story" className="group inline-flex min-h-11 items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-deep/55">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-primary group-hover:text-primary">
            <MoveDown className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          Scroll to explore
        </a>
        <p className="hidden text-[10px] uppercase tracking-[0.2em] text-deep/50 sm:block">
          The space between them
        </p>
      </div>
    </section>
  );
}
