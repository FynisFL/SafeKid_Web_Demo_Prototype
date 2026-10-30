import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Our People — "Four minds. One direction."                                  */
/*                                                                            */
/*  Desktop: a sticky stage whose scroll progress drives six scenes            */
/*  (intro, four profiles, outro). Scrolling is never locked: the stage is     */
/*  plain `position: sticky`, and every scene holds long enough to be read.    */
/*  Mobile / short screens / reduced motion: the same scenes as a normal       */
/*  top-to-bottom flow, revealed by time instead of scroll position.           */
/*  Everything is built from the `motion` package already in the project.      */
/* -------------------------------------------------------------------------- */

export type TeamMember = {
  name: string;
  role: string;
  summary: string;
  responsibilities: string[];
  image: string;
};

type Kind = "lead" | "layers" | "research" | "story";

// One motion personality per person, in the same order as the TEAM array.
const KINDS: Kind[] = ["lead", "layers", "research", "story"];
const FLIPS = [false, true, false, true];

const ease = [0.22, 1, 0.36, 1] as const;

// Relative scroll length of each scene: intro, four profiles, outro.
const WEIGHTS = [0.7, 1.15, 1.15, 1.15, 1.15, 0.7];
const WEIGHT_SUM = WEIGHTS.reduce((a, b) => a + b, 0);
const BOUNDS = WEIGHTS.reduce<number[]>(
  (acc, w) => [...acc, acc[acc.length - 1] + w / WEIGHT_SUM],
  [0]
);
const OVERLAP = 0.025;
const TOTAL_VH = WEIGHT_SUM * 100;

const shortName = (name: string) => name.split(" ").pop() ?? name;

/* ------------------------------ small hooks -------------------------------- */

function useMediaQuery(query: string) {
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/** 0 → 1 over time, started once the element scrolls into view. Instant when motion is reduced. */
function useInViewProgress(
  ref: RefObject<Element | null>,
  { duration = 1.2, delay = 0, amount = 0.3 } = {}
) {
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? 1 : 0);
  const inView = useInView(ref, { once: true, amount });

  useEffect(() => {
    if (reduce) {
      value.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(value, 1, { duration, delay, ease });
    return () => controls.stop();
  }, [inView, reduce, value, duration, delay]);

  return value;
}

/* ------------------------------ kinetic type ------------------------------- */

function KineticUnit({
  label,
  index,
  total,
  progress,
  from,
  to,
}: {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) {
  const span = to - from;
  const start = from + span * 0.62 * (total > 1 ? index / (total - 1) : 0);
  const y = useTransform(progress, [start, start + span * 0.38], ["118%", "0%"]);

  return (
    <span className="inline-block overflow-hidden py-[0.2em] align-bottom -my-[0.2em]">
      <motion.span className="inline-block" style={{ y }}>
        {label}
      </motion.span>
    </span>
  );
}

/** Words (or characters) rise out of a mask, staggered by a progress value. "\n" starts a new line. */
function KineticText({
  text,
  progress,
  from = 0,
  to = 1,
  by = "word",
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  from?: number;
  to?: number;
  by?: "word" | "char";
  className?: string;
}) {
  const lines = text
    .normalize("NFC")
    .split("\n")
    .map((line) => line.split(" "));
  const total = lines
    .flat()
    .reduce((sum, word) => sum + (by === "char" ? Array.from(word).length : 1), 0);
  let counter = 0;

  return (
    <span className={cn("block", className)}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden="true" className="block">
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => {
              const units = by === "char" ? Array.from(word) : [word];
              return (
                <span key={wordIndex}>
                  <span className="inline-block whitespace-nowrap">
                    {units.map((unit) => {
                      const index = counter++;
                      return (
                        <KineticUnit
                          key={index}
                          label={unit}
                          index={index}
                          total={total}
                          progress={progress}
                          from={from}
                          to={to}
                        />
                      );
                    })}
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </span>
  );
}

function DrawLine({
  progress,
  range = [0, 1],
  className,
  vertical = false,
}: {
  progress: MotionValue<number>;
  range?: [number, number];
  className?: string;
  vertical?: boolean;
}) {
  const t = useTransform(progress, range, [0, 1]);
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "block bg-primary",
        vertical ? "w-px origin-top" : "h-px origin-center",
        className
      )}
      style={vertical ? { scaleY: t } : { scaleX: t }}
    />
  );
}

/* --------------------------- profile: decoration ---------------------------- */

const CONNECT: Record<Kind, string> = {
  lead: "M0 20 H400",
  layers: "M0 32 H140 V8 H400",
  research: "M0 8 H400 M0 20 H400 M0 32 H400 M130 4 V36 M270 4 V36",
  story: "M0 20 C70 -8 130 48 200 20 S330 -8 400 20",
};

/** The line that links portrait and text. Its shape is different for each person. */
function ConnectLine({ kind, progress }: { kind: Kind; progress: MotionValue<number> }) {
  const pathLength = useTransform(progress, [0.05, 0.65], [0, 1]);
  const dot = useTransform(progress, [0.55, 0.75], [0, 1]);

  return (
    <div className="relative h-10 w-full text-primary" aria-hidden="true">
      <svg
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <motion.path
          d={CONNECT[kind]}
          stroke="currentColor"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />
      </svg>
      {kind === "lead" && (
        <motion.span
          className="absolute right-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-primary"
          style={{ opacity: dot }}
        />
      )}
    </div>
  );
}

/** Abstract "compare and contrast" tracks for the research profile. No labels, no data. */
function ResearchTracks({
  enter,
  hold,
}: {
  enter: MotionValue<number>;
  hold: MotionValue<number>;
}) {
  const l1 = useTransform(enter, [0.3, 0.8], [0, 1]);
  const l2 = useTransform(enter, [0.4, 0.9], [0, 1]);
  const l3 = useTransform(enter, [0.5, 1], [0, 1]);
  const link = useTransform(hold, [0.1, 0.6], [0, 1]);
  const dots = useTransform(enter, [0.7, 1], [0, 1]);

  return (
    <svg viewBox="0 0 300 48" className="mt-5 h-auto w-full" fill="none" aria-hidden="true">
      <g className="text-deep/30" stroke="currentColor" strokeWidth={1}>
        <motion.path d="M0 8H300" style={{ pathLength: l1 }} />
        <motion.path d="M0 24H300" style={{ pathLength: l2 }} />
        <motion.path d="M0 40H300" style={{ pathLength: l3 }} />
      </g>
      <g className="text-primary" stroke="currentColor" strokeWidth={1.25}>
        <motion.path d="M90 8 L150 24 L60 40" style={{ pathLength: link }} />
        <motion.path d="M210 8 L240 24 L180 40" style={{ pathLength: link }} />
      </g>
      <motion.g className="text-primary" fill="currentColor" style={{ opacity: dots }}>
        {[
          [90, 8],
          [210, 8],
          [150, 24],
          [240, 24],
          [60, 40],
          [180, 40],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3} />
        ))}
      </motion.g>
    </svg>
  );
}

function PortraitDecor({
  kind,
  side,
  enter,
}: {
  kind: Kind;
  side: 1 | -1;
  enter: MotionValue<number>;
}) {
  const frameOpacity = useTransform(enter, [0.4, 1], [0, 1]);
  const panelA = useTransform(enter, [0, 1], [side * 90, side * 18]);
  const panelB = useTransform(enter, [0, 1], [side * 140, side * 36]);
  const panelOpacity = useTransform(enter, [0, 0.6], [0, 1]);
  const thread = useTransform(enter, [0.1, 1], [0, 1]);

  if (kind === "lead") {
    return (
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-[26px] border border-primary/40"
        style={{ opacity: frameOpacity, x: side * 14, y: 14 }}
      />
    );
  }

  if (kind === "layers") {
    return (
      <>
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-[26px] bg-deep/10"
          style={{ opacity: panelOpacity, x: panelB, y: 34 }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-[26px] bg-primary/20"
          style={{ opacity: panelOpacity, x: panelA, y: 18 }}
        />
      </>
    );
  }

  if (kind === "story") {
    return (
      <svg
        viewBox="0 0 64 360"
        preserveAspectRatio="none"
        aria-hidden="true"
        fill="none"
        className={cn(
          "absolute -inset-y-6 hidden w-14 overflow-visible text-primary lg:block",
          side === 1 ? "-right-9" : "-left-9"
        )}
      >
        <motion.path
          d="M32 0 C0 60 64 120 32 180 S0 300 32 360"
          stroke="currentColor"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: thread }}
        />
      </svg>
    );
  }

  return null;
}

/* ----------------------------- profile: pieces ----------------------------- */

function maskFor(kind: Kind, v: number) {
  const rest = (1 - v) * 100;
  switch (kind) {
    case "lead":
      return `inset(${rest}% 0% 0% 0%)`; // rises from the bottom
    case "layers":
      return `inset(0% 0% 0% ${rest}%)`; // slides in from the right
    case "research":
      return `inset(0% ${rest}% 0% 0%)`; // wipes in from the left
    default:
      return `circle(${v * 105}% at 50% 55%)`; // opens like an iris
  }
}

function ScenePortrait({
  member,
  kind,
  side,
  enter,
  depth,
}: {
  member: TeamMember;
  kind: Kind;
  side: 1 | -1;
  enter: MotionValue<number>;
  depth: MotionValue<number>;
}) {
  const clip = useTransform(enter, (v) => maskFor(kind, v));
  const scale = useTransform(enter, [0, 1], [1.32, 1.12]);
  const y = useTransform(depth, [0, 1], ["-5%", "5%"]);

  return (
    <div className="relative">
      <PortraitDecor kind={kind} side={side} enter={enter} />
      <div className="relative overflow-hidden rounded-[22px] bg-mist">
        <motion.div className="relative" style={{ clipPath: clip }}>
          <motion.img
            src={member.image}
            alt={`${member.name}, ${member.role}`}
            width={800}
            height={1000}
            loading="lazy"
            className="aspect-[4/5] h-full w-full object-cover saturate-[0.92]"
            style={{ scale, y }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/25 via-transparent to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}

function ResItem({
  text,
  index,
  count,
  hold,
  kind,
}: {
  text: string;
  index: number;
  count: number;
  hold: MotionValue<number>;
  kind: Kind;
}) {
  const start = 0.02 + (0.7 * index) / count;
  const p = useTransform(hold, [start, start + 0.26], [0, 1]);
  const x = useTransform(p, [0, 1], [kind === "layers" ? 28 : kind === "story" ? -14 : 0, 0]);
  const y = useTransform(p, [0, 1], [kind === "lead" || kind === "research" ? 14 : 0, 0]);
  const clip = useTransform(p, (v) =>
    kind === "research" ? `inset(0% ${(1 - v) * 100}% 0% 0%)` : "none"
  );

  return (
    <motion.li
      className="relative text-[14.5px] leading-relaxed text-deep/85"
      style={{ opacity: p, x, y, clipPath: clip }}
    >
      <span
        aria-hidden="true"
        className="absolute -left-6 top-[9px] h-[7px] w-[7px] rounded-full bg-primary"
      />
      {text}
    </motion.li>
  );
}

function SceneInfo({
  member,
  index,
  total,
  kind,
  enter,
  hold,
}: {
  member: TeamMember;
  index: number;
  total: number;
  kind: Kind;
  enter: MotionValue<number>;
  hold: MotionValue<number>;
}) {
  const roleOpacity = useTransform(enter, [0.15, 0.5], [0, 1]);
  const summaryOpacity = useTransform(enter, [0.5, 1], [0, 1]);
  const summaryY = useTransform(enter, [0.5, 1], [14, 0]);
  const listLine = useTransform(hold, [0, 1], [0, 1]);

  return (
    <div className="relative">
      <ConnectLine kind={kind} progress={enter} />
      <motion.div
        className="mt-5 flex items-center justify-between gap-4"
        style={{ opacity: roleOpacity }}
      >
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-deep/80">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
          {member.role}
        </p>
        <p className="text-[11px] tracking-[0.18em] text-deep/65" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </motion.div>

      <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink">
        <KineticText
          text={member.name}
          progress={enter}
          from={0.15}
          to={0.8}
          by={kind === "lead" ? "char" : "word"}
        />
      </h3>

      <motion.p
        className="mt-4 max-w-[46ch] text-[15px] leading-[1.7] text-deep/75"
        style={{ opacity: summaryOpacity, y: summaryY }}
      >
        {member.summary}
      </motion.p>

      <div className="relative mt-6 pl-6">
        <motion.span
          aria-hidden="true"
          className="absolute bottom-1 left-[3px] top-1 w-px origin-top bg-primary/60"
          style={{ scaleY: listLine }}
        />
        <ul className="space-y-2.5">
          {member.responsibilities.map((item, i) => (
            <ResItem
              key={item}
              text={item}
              index={i}
              count={member.responsibilities.length}
              hold={hold}
              kind={kind}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

type SceneProps = {
  member: TeamMember;
  index: number;
  total: number;
  kind: Kind;
  flip: boolean;
  enter: MotionValue<number>;
  hold: MotionValue<number>;
  depth: MotionValue<number>;
};

function ProfileScene({ member, index, total, kind, flip, enter, hold, depth }: SceneProps) {
  const side: 1 | -1 = flip ? -1 : 1;
  const ghostY = useTransform(depth, [0, 1], [50, -50]);
  const initial = shortName(member.name).charAt(0);

  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-x-14">
      <div
        className={cn(
          "w-full max-w-[min(420px,calc((100vh_-_17rem)_*_0.8))] lg:row-start-1",
          flip ? "lg:col-span-5 lg:col-start-8 lg:ml-auto" : "lg:col-span-5 lg:col-start-1"
        )}
      >
        <ScenePortrait member={member} kind={kind} side={side} enter={enter} depth={depth} />
        {kind === "research" && <ResearchTracks enter={enter} hold={hold} />}
      </div>

      <div
        className={cn(
          "relative min-w-0 lg:row-start-1",
          flip ? "lg:col-span-6 lg:col-start-1" : "lg:col-span-6 lg:col-start-7"
        )}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 right-0 hidden select-none font-display text-[clamp(11rem,22vw,20rem)] font-semibold leading-none tracking-[-0.06em] text-ink/[0.045] lg:block"
          style={{ y: ghostY }}
        >
          {initial}
        </motion.span>
        <SceneInfo
          member={member}
          index={index}
          total={total}
          kind={kind}
          enter={enter}
          hold={hold}
        />
      </div>
    </div>
  );
}

/* ------------------------------ intro and outro ----------------------------- */

function IntroContent({ progress }: { progress: MotionValue<number> }) {
  const eyebrow = useTransform(progress, [0.2, 0.55], [0, 1]);
  const lede = useTransform(progress, [0.8, 1], [0, 1]);

  return (
    <div className="flex flex-col items-center text-center">
      <DrawLine progress={progress} range={[0.05, 0.6]} vertical className="h-16 sm:h-24" />
      <motion.p className="eyebrow mt-6 justify-center" style={{ opacity: eyebrow }}>
        <span className="eyebrow-line" />
        Our people
        <span className="eyebrow-line" />
      </motion.p>
      <h2 className="display mt-5 text-[clamp(2.8rem,8vw,6.6rem)] leading-[0.98]">
        <KineticText text="Four minds." progress={progress} from={0.2} to={0.6} by="char" />
        <span className="block text-primary">
          <KineticText text="One direction." progress={progress} from={0.5} to={0.95} by="char" />
        </span>
      </h2>
      <DrawLine progress={progress} range={[0.6, 1]} className="mt-8 w-40" />
      <motion.p className="lede mx-auto mt-6 max-w-[46ch]" style={{ opacity: lede }}>
        Four co-founders who research, test, design and tell the story of SafeKid.
      </motion.p>
    </div>
  );
}

const OUTRO_X = [14, 38, 62, 86];

function OutroThumb({
  member,
  x,
  index,
  progress,
}: {
  member: TeamMember;
  x: number;
  index: number;
  progress: MotionValue<number>;
}) {
  const s = 0.06 + index * 0.05;
  const opacity = useTransform(progress, [s, s + 0.15], [0, 1]);
  const scale = useTransform(progress, [s, s + 0.15], [0.7, 1]);

  return (
    <motion.div
      className="absolute top-[36%] flex flex-col items-center"
      style={{ left: `${x}%`, x: "-50%", opacity, scale }}
    >
      <div className="h-14 w-14 overflow-hidden rounded-full border border-primary/40 bg-white sm:h-16 sm:w-16">
        <img
          src={member.image}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="h-full w-full object-cover object-[50%_18%]"
        />
      </div>
      <span className="mt-2 text-[11px] uppercase tracking-[0.16em] text-deep/75">
        {shortName(member.name)}
      </span>
    </motion.div>
  );
}

function OutroLine({
  x,
  index,
  progress,
}: {
  x: number;
  index: number;
  progress: MotionValue<number>;
}) {
  const s = 0.25 + index * 0.04;
  const pathLength = useTransform(progress, [s, s + 0.3], [0, 1]);
  return (
    <motion.path
      d={`M${x} 60 C${x} 70 50 68 50 80`}
      stroke="currentColor"
      strokeWidth={1.25}
      vectorEffect="non-scaling-stroke"
      style={{ pathLength }}
    />
  );
}

/** Four lines, one from each person, merge into a single path that leads on to Our Journey. */
function OutroContent({
  members,
  progress,
  className,
}: {
  members: TeamMember[];
  progress: MotionValue<number>;
  className?: string;
}) {
  const heading = useTransform(progress, [0, 0.3], [0, 1]);
  const down = useTransform(progress, [0.62, 1], [0, 1]);
  const merge = useTransform(progress, [0.55, 0.7], [0, 1]);
  const label = useTransform(progress, [0.85, 1], [0, 1]);

  return (
    <div className={cn("relative mx-auto w-full max-w-[980px]", className)}>
      <motion.div
        className="absolute inset-x-0 top-0 flex flex-col items-center text-center"
        style={{ opacity: heading }}
      >
        <p className="eyebrow justify-center">
          <span className="eyebrow-line" />
          Together
          <span className="eyebrow-line" />
        </p>
        <h3 className="display mt-4 text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.05]">
          Different strengths.
          <span className="block text-primary">Shared direction.</span>
        </h3>
      </motion.div>

      {members.map((member, i) => (
        <OutroThumb
          key={member.name}
          member={member}
          x={OUTRO_X[i]}
          index={i}
          progress={progress}
        />
      ))}

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-primary"
        fill="none"
        aria-hidden="true"
      >
        {OUTRO_X.map((x, i) => (
          <OutroLine key={x} x={x} index={i} progress={progress} />
        ))}
        <motion.path
          d="M50 80 V100"
          stroke="currentColor"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: down }}
        />
      </svg>
      <motion.span
        aria-hidden="true"
        className="absolute left-1/2 top-[80%] -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary"
        style={{ opacity: merge }}
      />
      <motion.p
        className="absolute left-1/2 top-[88%] ml-5 whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-deep/75"
        style={{ opacity: label }}
      >
        Next · Our journey
      </motion.p>
    </div>
  );
}

/** The line that carries the story out of the stage and down towards Our Journey. */
function Connector() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <div ref={ref} aria-hidden="true" className="flex h-24 flex-col items-center">
      <motion.span
        className="block w-px flex-1 origin-top bg-primary"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
      <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
    </div>
  );
}

/* ------------------------------ desktop stage ------------------------------- */

function SceneShell({
  progress,
  start,
  end,
  position,
  className,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  position: "first" | "middle" | "last";
  className?: string;
  children: ReactNode;
}) {
  const input =
    position === "first"
      ? [0, end - OVERLAP, end + OVERLAP]
      : position === "last"
        ? [start - OVERLAP, start + OVERLAP, 1]
        : [start - OVERLAP, start + OVERLAP, end - OVERLAP, end + OVERLAP];
  const fade =
    position === "first" ? [1, 1, 0] : position === "last" ? [0, 1, 1] : [0, 1, 1, 0];
  const drift =
    position === "first" ? [0, 0, -28] : position === "last" ? [28, 0, 0] : [28, 0, 0, -28];

  const opacity = useTransform(progress, input, fade);
  const y = useTransform(progress, input, drift);
  const visibility = useTransform(opacity, (v) => (v > 0.01 ? ("visible" as const) : ("hidden" as const)));

  return (
    <motion.div
      className={cn("absolute inset-0 flex items-center", className ?? "pb-24 pt-20")}
      style={{ opacity, y, visibility }}
    >
      {children}
    </motion.div>
  );
}

function StageProfile({
  member,
  index,
  progress,
}: {
  member: TeamMember;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = BOUNDS[index + 1];
  const end = BOUNDS[index + 2];
  const len = end - start;
  const enter = useTransform(progress, [start - OVERLAP, start + len * 0.28], [0, 1]);
  const hold = useTransform(progress, [start + len * 0.15, start + len * 0.62], [0, 1]);
  const depth = useTransform(progress, [start, end], [0, 1]);

  return (
    <SceneShell progress={progress} start={start} end={end} position="middle">
      <div className="shell w-full">
        <ProfileScene
          member={member}
          index={index}
          total={KINDS.length}
          kind={KINDS[index]}
          flip={FLIPS[index]}
          enter={enter}
          hold={hold}
          depth={depth}
        />
      </div>
    </SceneShell>
  );
}

function RailItem({
  member,
  index,
  active,
  progress,
  onJump,
}: {
  member: TeamMember;
  index: number;
  active: boolean;
  progress: MotionValue<number>;
  onJump: () => void;
}) {
  const fill = useTransform(progress, [BOUNDS[index + 1], BOUNDS[index + 2]], [0, 1]);
  return (
    <li>
      <button
        type="button"
        onClick={onJump}
        aria-current={active ? "step" : undefined}
        aria-label={`Go to ${member.name}`}
        className="group block w-full text-left"
      >
        <span className="relative block h-px bg-ink/15">
          <motion.span className="absolute inset-0 origin-left bg-primary" style={{ scaleX: fill }} />
        </span>
        <span
          className={cn(
            "mt-2.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] transition-colors",
            active ? "text-ink" : "text-deep/70 group-hover:text-ink"
          )}
        >
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {shortName(member.name)}
        </span>
      </button>
    </li>
  );
}

function StageTeam({ members }: { members: TeamMember[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: rise } = useScroll({
    target: trackRef,
    offset: ["start end", "start start"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    let scene = 0;
    for (let i = 0; i < BOUNDS.length - 1; i++) if (value >= BOUNDS[i]) scene = i;
    setActive(scene);
  });

  const outroT = useTransform(progress, [BOUNDS[5] - OVERLAP, 1], [0, 1]);
  const railOpacity = useTransform(
    progress,
    [BOUNDS[1] - OVERLAP, BOUNDS[1] + OVERLAP, BOUNDS[5] - OVERLAP, BOUNDS[5] + OVERLAP],
    [0, 1, 1, 0]
  );
  const railVisibility = useTransform(railOpacity, (v) =>
    v > 0.01 ? ("visible" as const) : ("hidden" as const)
  );

  function jumpTo(scene: number) {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    const target = BOUNDS[scene] + (BOUNDS[scene + 1] - BOUNDS[scene]) * 0.7;
    window.scrollTo({ top: top + target * distance, behavior: "smooth" });
  }

  return (
    <div ref={trackRef} className="relative" style={{ height: `${TOTAL_VH + 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <SceneShell progress={progress} start={0} end={BOUNDS[1]} position="first">
          <div className="shell w-full">
            <IntroContent progress={rise} />
          </div>
        </SceneShell>

        {members.map((member, i) => (
          <StageProfile key={member.name} member={member} index={i} progress={progress} />
        ))}

        <SceneShell
          progress={progress}
          start={BOUNDS[5]}
          end={1}
          position="last"
          className="pt-20"
        >
          <div className="shell h-full w-full">
            <OutroContent members={members} progress={outroT} className="h-full" />
          </div>
        </SceneShell>

        <motion.nav
          aria-label="Team members"
          className="absolute inset-x-0 bottom-6 z-10"
          style={{ opacity: railOpacity, visibility: railVisibility }}
        >
          <div className="shell">
            <ol className="grid grid-cols-4 gap-4">
              {members.map((member, i) => (
                <RailItem
                  key={member.name}
                  member={member}
                  index={i}
                  active={active === i + 1}
                  progress={progress}
                  onJump={() => jumpTo(i + 1)}
                />
              ))}
            </ol>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}

/* ------------------------- mobile / reduced-motion flow ---------------------- */

function FlowProfile({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const enter = useInViewProgress(ref, { duration: 1.1, amount: 0.25 });
  const hold = useInViewProgress(ref, { duration: 2.2, delay: 0.5, amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useMotionValue(0.5);

  return (
    <div ref={ref}>
      <ProfileScene
        member={member}
        index={index}
        total={KINDS.length}
        kind={KINDS[index]}
        flip={FLIPS[index]}
        enter={enter}
        hold={hold}
        depth={reduce ? still : scrollYProgress}
      />
    </div>
  );
}

function FlowIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useInViewProgress(ref, { duration: 1.6, amount: 0.4 });
  return (
    <div ref={ref} className="shell">
      <IntroContent progress={progress} />
    </div>
  );
}

function FlowOutro({ members }: { members: TeamMember[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useInViewProgress(ref, { duration: 2.6, amount: 0.4 });
  return (
    <div ref={ref} className="shell">
      <OutroContent members={members} progress={progress} className="h-[460px]" />
    </div>
  );
}

function FlowTeam({ members }: { members: TeamMember[] }) {
  return (
    <div className="space-y-20 py-20 sm:space-y-28 sm:py-24">
      <FlowIntro />
      <div className="shell space-y-24 sm:space-y-28">
        {members.map((member, i) => (
          <FlowProfile key={member.name} member={member} index={i} />
        ))}
      </div>
      <FlowOutro members={members} />
    </div>
  );
}

/* ---------------------------------- entry ---------------------------------- */

export function TeamStory({ members }: { members: TeamMember[] }) {
  const reduce = useReducedMotion();
  const roomy = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const stage = roomy && !reduce;

  return (
    <section aria-label="Our people" className="bg-white">
      <div className="rounded-[36px] bg-mist lg:rounded-[56px]">
        {stage ? <StageTeam members={members} /> : <FlowTeam members={members} />}
      </div>
      <Connector />
    </section>
  );
}
