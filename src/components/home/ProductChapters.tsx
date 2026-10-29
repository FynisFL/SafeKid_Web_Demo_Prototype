import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
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

function ZoneIllustration() {
  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="h-full w-full">
      <circle cx="120" cy="100" r="78" stroke="hsl(var(--primary))" strokeOpacity="0.18" strokeDasharray="4 7" />
      <circle cx="120" cy="100" r="54" stroke="hsl(var(--primary))" strokeOpacity="0.32" />
      <circle cx="120" cy="100" r="30" fill="hsl(var(--primary))" fillOpacity="0.08" />
      <path d="M120 62c11.6 0 21 9.4 21 21 0 15-21 33-21 33s-21-18-21-33c0-11.6 9.4-21 21-21Z" fill="hsl(var(--primary))" />
      <circle cx="120" cy="83" r="6" fill="white" />
      <circle cx="120" cy="100" r="44" stroke="hsl(var(--deep))" strokeOpacity="0.15" />
      <circle cx="120" cy="100" r="44" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="46 300" strokeLinecap="round" />
    </svg>
  );
}

function CallIllustration() {
  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="h-full w-full">
      <rect x="30" y="56" width="60" height="88" rx="18" stroke="hsl(var(--deep))" strokeOpacity="0.25" />
      <rect x="44" y="72" width="32" height="38" rx="8" fill="hsl(var(--deep))" fillOpacity="0.08" />
      <rect x="150" y="70" width="58" height="60" rx="16" stroke="hsl(var(--primary))" strokeOpacity="0.5" />
      <circle cx="179" cy="100" r="15" fill="hsl(var(--primary))" fillOpacity="0.18" />
      <path d="M174 94c4 0 7 3 7 7 0 5-7 11-7 11s-7-6-7-11c0-4 3-7 7-7Z" fill="hsl(var(--primary))" />
      <path d="M94 96h44" stroke="hsl(var(--primary))" strokeWidth="1.6" strokeDasharray="3 6" />
      <path d="M112 82c9 5 9 31 0 36" stroke="hsl(var(--primary))" strokeOpacity="0.5" strokeWidth="1.6" />
      <path d="M120 74c14 8 14 47 0 55" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="1.6" />
      <path d="M128 66c19 11 19 63 0 74" stroke="hsl(var(--primary))" strokeOpacity="0.16" strokeWidth="1.6" />
    </svg>
  );
}

function ZodiacIllustration() {
  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="h-full w-full">
      <circle cx="120" cy="100" r="66" stroke="hsl(var(--deep))" strokeOpacity="0.12" strokeDasharray="2 8" />
      <circle cx="120" cy="100" r="28" fill="hsl(var(--primary))" fillOpacity="0.12" />
      <rect x="106" y="80" width="28" height="40" rx="9" fill="white" stroke="hsl(var(--deep))" strokeOpacity="0.35" />
      <rect x="112" y="88" width="16" height="18" rx="4" fill="hsl(var(--primary))" fillOpacity="0.7" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * Math.PI * 2) / 12 - Math.PI / 2;
        const x = 120 + Math.cos(angle) * 66;
        const y = 100 + Math.sin(angle) * 66;
        const active = index === 0;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={active ? 6 : 4}
            fill={active ? "hsl(var(--primary))" : "white"}
            stroke={active ? "hsl(var(--primary))" : "hsl(var(--deep))"}
            strokeOpacity={active ? 1 : 0.2}
          />
        );
      })}
    </svg>
  );
}

const ILLUSTRATIONS = {
  zone: ZoneIllustration,
  call: CallIllustration,
  zodiac: ZodiacIllustration,
};

function ChapterRow({ chapter, index }: { chapter: (typeof CHAPTERS)[number]; index: number }) {
  const reduce = useReducedMotion();
  const Illustration = ILLUSTRATIONS[chapter.illustration];

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
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
        <Illustration />
      </div>
    </motion.article>
  );
}

export function ProductChapters() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.6"],
  });
  const line = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

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
            {!reduce && (
              <motion.span
                className="absolute left-0 top-0 w-px origin-top bg-primary/60"
                style={{ height: "100%", scaleY: line }}
              />
            )}
          </div>

          {CHAPTERS.map((chapter, index) => (
            <ChapterRow key={chapter.number} chapter={chapter} index={index} />
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
