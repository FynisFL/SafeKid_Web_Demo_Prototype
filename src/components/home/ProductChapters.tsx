import { useEffect, useId, useRef, useState, type RefObject } from "react";
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
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const CHAPTERS = [
  {
    number: "01",
    kicker: "Reassurance",
    title: "A little more reassurance.",
    body: "Location and safe-zone ideas are designed to help parents stay informed as a child explores — always as a concept, never a promise.",
    illustration: "zone" as const,
  },
  {
    number: "02",
    kicker: "Connection",
    title: "A simple way to connect.",
    body: "Two-way calling is at the heart of the concept: one familiar way for a child and a parent to reach each other.",
    illustration: "call" as const,
  },
  {
    number: "03",
    kicker: "Identity",
    title: "Made to feel like theirs.",
    body: "Twelve Vietnamese Zodiac characters bring warmth and personality to a watch imagined for little explorers.",
    illustration: "zodiac" as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  One trigger per row                                                       */
/*  `useChapterProgress` is the only observer on a row. It runs a single      */
/*  0 → 1 value over 2.2 s the first time the row is in view and never        */
/*  replays. The row's own fade-up and its illustration both read that value. */
/* -------------------------------------------------------------------------- */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** A 0 → 1 window of `p`, eased out. Holds at 0 before `from` and at 1 after `to`. */
function useSeg(p: MotionValue<number>, from: number, to: number) {
  return useTransform(p, (v) => easeOut(clamp01((v - from) / (to - from))));
}

function useChapterProgress(ref: RefObject<Element | null>) {
  const reduce = useReducedMotion();
  const p = useMotionValue(reduce ? 1 : 0);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  useEffect(() => {
    // Reduced motion, or no IntersectionObserver: show the finished state, never hide content.
    if (reduce || typeof IntersectionObserver === "undefined") {
      p.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(p, 1, { duration: 2.2, ease: "linear" });
    return () => controls.stop();
  }, [inView, reduce, p]);

  return p;
}

/* ------------------------------ illustrations ------------------------------ */

function ZoneIllustration({ p }: { p: MotionValue<number> }) {
  const outer = useSeg(p, 0, 0.14);
  const ring = useSeg(p, 0.1, 0.5);
  const core = useSeg(p, 0.3, 0.5);
  const pin = useSeg(p, 0.42, 0.62);
  const pinY = useTransform(pin, (v) => -10 * (1 - v));
  const arc = useSeg(p, 0.66, 1);
  // A zero-length round-capped stroke can paint a dot, so the arc also fades in at its very start.
  const arcOpacity = useTransform(arc, [0, 0.02], [0, 1]);

  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="h-full w-full">
      <motion.circle
        cx="120"
        cy="100"
        r="78"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.18"
        strokeDasharray="4 7"
        style={{ opacity: outer }}
      />
      <motion.circle
        cx="120"
        cy="100"
        r="54"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.32"
        style={{ pathLength: ring }}
      />
      <motion.circle
        cx="120"
        cy="100"
        r="30"
        fill="hsl(var(--primary))"
        fillOpacity="0.08"
        style={{ opacity: core }}
      />
      <motion.g style={{ opacity: pin, y: pinY }}>
        <path
          d="M120 62c11.6 0 21 9.4 21 21 0 15-21 33-21 33s-21-18-21-33c0-11.6 9.4-21 21-21Z"
          fill="hsl(var(--primary))"
        />
        <circle cx="120" cy="83" r="6" fill="white" />
      </motion.g>
      <motion.circle
        cx="120"
        cy="100"
        r="44"
        stroke="hsl(var(--deep))"
        strokeOpacity="0.15"
        style={{ opacity: outer }}
      />
      {/* Was a dashed circle ("46 300"); drawn as a real arc so pathLength can own the stroke. */}
      <motion.path
        d="M164 100A44 44 0 0 1 142.1 138.1"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: arc, opacity: arcOpacity }}
      />
    </svg>
  );
}

function CallIllustration({ p }: { p: MotionValue<number> }) {
  const clipId = `sk-call-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const devices = useSeg(p, 0, 0.18);
  const link = useSeg(p, 0.2, 0.5);
  const linkWidth = useTransform(link, (v) => 44 * v);
  const arc1 = useSeg(p, 0.5, 0.65);
  const arc2 = useSeg(p, 0.58, 0.73);
  const arc3 = useSeg(p, 0.66, 0.81);
  const pin = useSeg(p, 0.78, 1);
  const pinY = useTransform(pin, (v) => -8 * (1 - v));

  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="h-full w-full">
      <defs>
        <clipPath id={clipId}>
          <motion.rect x="94" y="88" height="16" width={linkWidth} />
        </clipPath>
      </defs>
      <motion.g style={{ opacity: devices }}>
        <rect x="30" y="56" width="60" height="88" rx="18" stroke="hsl(var(--deep))" strokeOpacity="0.25" />
        <rect x="44" y="72" width="32" height="38" rx="8" fill="hsl(var(--deep))" fillOpacity="0.08" />
        <rect x="150" y="70" width="58" height="60" rx="16" stroke="hsl(var(--primary))" strokeOpacity="0.5" />
        <circle cx="179" cy="100" r="15" fill="hsl(var(--primary))" fillOpacity="0.18" />
      </motion.g>
      <path
        d="M94 96h44"
        stroke="hsl(var(--primary))"
        strokeWidth="1.6"
        strokeDasharray="3 6"
        clipPath={`url(#${clipId})`}
      />
      <motion.path
        d="M112 82c9 5 9 31 0 36"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.5"
        strokeWidth="1.6"
        style={{ opacity: arc1 }}
      />
      <motion.path
        d="M120 74c14 8 14 47 0 55"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.3"
        strokeWidth="1.6"
        style={{ opacity: arc2 }}
      />
      <motion.path
        d="M128 66c19 11 19 63 0 74"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.16"
        strokeWidth="1.6"
        style={{ opacity: arc3 }}
      />
      <motion.path
        d="M174 94c4 0 7 3 7 7 0 5-7 11-7 11s-7-6-7-11c0-4 3-7 7-7Z"
        fill="hsl(var(--primary))"
        style={{ opacity: pin, y: pinY }}
      />
    </svg>
  );
}

function ZodiacDot({ index, p }: { index: number; p: MotionValue<number> }) {
  // Clockwise from the top, 12 dots spread across the middle of the sequence.
  const start = 0.3 + index * 0.045;
  const opacity = useSeg(p, start, start + 0.1);
  const angle = (index * Math.PI * 2) / 12 - Math.PI / 2;
  const active = index === 0;

  return (
    <motion.circle
      cx={120 + Math.cos(angle) * 66}
      cy={100 + Math.sin(angle) * 66}
      r={active ? 6 : 4}
      fill={active ? "hsl(var(--primary))" : "white"}
      stroke={active ? "hsl(var(--primary))" : "hsl(var(--deep))"}
      strokeOpacity={active ? 1 : 0.2}
      style={{ opacity }}
    />
  );
}

function ZodiacIllustration({ p }: { p: MotionValue<number> }) {
  const ring = useSeg(p, 0, 0.14);
  const watch = useSeg(p, 0.1, 0.3);

  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="h-full w-full">
      <motion.circle
        cx="120"
        cy="100"
        r="66"
        stroke="hsl(var(--deep))"
        strokeOpacity="0.12"
        strokeDasharray="2 8"
        style={{ opacity: ring }}
      />
      <motion.g style={{ opacity: watch }}>
        <circle cx="120" cy="100" r="28" fill="hsl(var(--primary))" fillOpacity="0.12" />
        <rect x="106" y="80" width="28" height="40" rx="9" fill="white" stroke="hsl(var(--deep))" strokeOpacity="0.35" />
        <rect x="112" y="88" width="16" height="18" rx="4" fill="hsl(var(--primary))" fillOpacity="0.7" />
      </motion.g>
      {Array.from({ length: 12 }).map((_, index) => (
        <ZodiacDot key={index} index={index} p={p} />
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = {
  zone: ZoneIllustration,
  call: CallIllustration,
  zodiac: ZodiacIllustration,
};

/* ----------------------------------- rows ---------------------------------- */

function ChapterRow({ chapter }: { chapter: (typeof CHAPTERS)[number] }) {
  const ref = useRef<HTMLElement>(null);
  const p = useChapterProgress(ref);
  const rise = useSeg(p, 0, 0.2);
  const y = useTransform(rise, (v) => 26 * (1 - v));
  const Illustration = ILLUSTRATIONS[chapter.illustration];

  return (
    <motion.article
      ref={ref}
      data-chapter-row
      style={{ opacity: rise, y }}
      className="group relative grid gap-6 border-t border-ink/10 py-9 sm:grid-cols-[64px_1fr_auto] sm:items-center sm:gap-8 lg:py-11"
    >
      <div className="flex items-center gap-3 sm:block">
        <span className="font-display text-[13px] font-semibold tabular-nums tracking-[0.1em] text-primary">
          {chapter.number}
        </span>
      </div>

      <div className="max-w-[46ch]">
        <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-deep/55">{chapter.kicker}</p>
        <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-tight tracking-[-0.035em] text-ink">
          {chapter.title}
        </h3>
        <p className="mt-2.5 max-w-[48ch] text-[13.5px] leading-relaxed text-muted-foreground">
          {chapter.body}
        </p>
      </div>

      <div className="h-[150px] w-[190px] justify-self-start overflow-hidden rounded-2xl bg-mist/70 p-2 transition-transform duration-700 ease-smooth group-hover:-translate-y-1 sm:justify-self-end">
        <Illustration p={p} />
      </div>
    </motion.article>
  );
}

/* ------------------------------- rule and nodes ------------------------------ */

type Stops = { tops: number[]; height: number };

/** Measures where each row starts inside the rule's container, so nodes never rely on guessed offsets. */
function useRowStops(containerRef: RefObject<HTMLDivElement | null>) {
  const [stops, setStops] = useState<Stops | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rows = Array.from(container.querySelectorAll<HTMLElement>("[data-chapter-row]"));
      const tops = rows.map((row) => Math.round(row.offsetTop));
      const height = Math.round(container.offsetHeight);
      setStops((prev) =>
        prev &&
        prev.height === height &&
        prev.tops.length === tops.length &&
        prev.tops.every((top, i) => top === tops[i])
          ? prev
          : { tops, height }
      );
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    container.querySelectorAll("[data-chapter-row]").forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [containerRef]);

  return stops;
}

/** A station on the rule. It fills once the scroll-linked rule has reached its row. */
function RuleNode({
  top,
  at,
  line,
  reduce,
}: {
  top: number;
  at: number;
  line: MotionValue<number>;
  reduce: boolean;
}) {
  const lit = useTransform(line, [at, at + 0.05], [0, 1]);

  return (
    <span
      className="absolute left-1/2 block h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2"
      style={{ top: top + 0.5 }}
    >
      <span className="absolute inset-0 rounded-full border border-primary/40 bg-white" />
      <motion.span
        className="absolute inset-0 rounded-full bg-primary"
        style={{ opacity: reduce ? 1 : lit, scale: reduce ? 1 : lit }}
      />
    </span>
  );
}

export function ProductChapters() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.6"],
  });
  const line = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const stops = useRowStops(ref);

  return (
    <section id="capabilities" className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                Designed around family
              </p>
            </Reveal>
            <Reveal variant="clip" delay={0.05}>
              <h2 className="display display-lg mt-6">
                A little watch.
                <br />
                A lot of meaning.
              </h2>
            </Reveal>
          </div>
          <Reveal variant="soft" delay={0.1}>
            <p className="max-w-[40ch] text-[14.5px] leading-relaxed text-muted-foreground lg:pb-2">
              SafeKid brings together thoughtful everyday capabilities and a playful collection, all
              with one purpose: helping families stay close as children grow.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-14 lg:mt-16">
          <div aria-hidden="true" className="absolute left-[31px] top-0 hidden h-full w-px bg-ink/10 sm:block">
            {reduce ? (
              <span className="absolute left-0 top-0 h-full w-px bg-primary/60" />
            ) : (
              <motion.span
                className="absolute left-0 top-0 w-px origin-top bg-primary/60"
                style={{ height: "100%", scaleY: line }}
              />
            )}
            {stops?.tops.map((top, index) => (
              <RuleNode
                key={index}
                top={top}
                at={stops.height > 0 ? top / stops.height : 0}
                line={line}
                reduce={reduce}
              />
            ))}
          </div>

          {CHAPTERS.map((chapter) => (
            <ChapterRow key={chapter.number} chapter={chapter} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center">
          <p className="max-w-[54ch] text-[11px] leading-relaxed text-deep/60">
            Product capabilities shown are part of a concept and are not connected to a live service.
            No watch, account or app is available.
          </p>
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink"
          >
            Read the idea behind SafeKid
            <ArrowUpRight
              className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
