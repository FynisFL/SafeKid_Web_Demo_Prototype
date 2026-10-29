import { useRef, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, MoveDown } from "lucide-react";
import heroWatch from "@/assets/safekid/hero-watch.webp";

const ease = [0.16, 1, 0.3, 1] as const;

function OrbitTicks() {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-primary/45"
    >
      <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <circle
        cx="200"
        cy="200"
        r="178"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="1 13"
        opacity="0.9"
      />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * 360) / 12;
        return (
          <line
            key={angle}
            x1="200"
            y1="14"
            x2="200"
            y2={index % 3 === 0 ? 30 : 22}
            stroke="currentColor"
            strokeWidth={index % 3 === 0 ? 1.4 : 0.8}
            transform={`rotate(${angle} 200 200)`}
          />
        );
      })}
    </svg>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.5 });
  const rotateY = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.5 });

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
        animate: "show" as const,
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
      className="relative overflow-hidden bg-white pb-10 pt-[92px] lg:pb-14 lg:pt-[104px]"
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-mist/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[7%] hidden w-px bg-ink/[0.05] lg:block"
      />

      <div className="shell relative grid items-center gap-12 pb-8 pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-4 lg:pb-12">
        <motion.div
          style={reduce ? undefined : { y: copyY }}
          {...motionProps}
          variants={container}
          className="relative z-10 max-w-[620px]"
        >
          <motion.p variants={reduce ? undefined : soft} className="eyebrow">
            <span className="eyebrow-line" />
            A little more room to grow
          </motion.p>

          <h1 className="display display-xl mt-6 text-ink">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={reduce ? undefined : line} className="block">
                Let them
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={reduce ? undefined : line} className="block">
                explore <span className="text-primary">the world.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={reduce ? undefined : soft}
            className="lede mt-7 max-w-[46ch] text-[16px] sm:text-[17px]"
          >
            A little independence for them. A little more reassurance for you. SafeKid is a product
            concept built around the space between both.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : soft}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7"
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
              className="group inline-flex items-center gap-2 text-[14px] font-medium text-ink"
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
            className="mt-11 flex items-center gap-4 text-[11px] text-deep/50"
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
            <span>12 editions</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: artY, scale: artScale }}
          className="relative z-0 flex w-full justify-center lg:justify-end"
        >
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.94, y: 30 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.12 }}
            className="flex w-full justify-center lg:justify-end"
          >
          <div
            ref={artRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className="perspective-1200 relative aspect-square w-full max-w-[520px] lg:max-w-[580px]"
          >
            <div aria-hidden="true" className="stage-glow absolute inset-[2%] rounded-full" />
            <OrbitTicks />
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
                width={1300}
                height={1300}
                fetchPriority="high"
                className="h-[92%] w-[92%] select-none object-contain drop-shadow-[0_40px_60px_rgba(16,42,56,0.16)]"
                draggable="false"
              />
            </motion.div>

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

            <p className="absolute inset-x-0 -bottom-2 text-center text-[9px] uppercase tracking-[0.24em] text-deep/50">
              Illustrative product render
            </p>
          </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="shell relative flex items-center justify-between border-t border-ink/[0.07] pt-5">
        <a href="#story" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-deep/55">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-primary group-hover:text-primary">
            <MoveDown className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          Scroll to explore
        </a>
        <p className="hidden text-[10px] uppercase tracking-[0.2em] text-deep/50 sm:block">
          The space between them
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-deep/50">01 / 06</p>
      </div>
    </section>
  );
}
