import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  motionValue,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* Text choreography                                                           */
/* -------------------------------------------------------------------------- */

function Unit({
  progress,
  from,
  to,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  children: ReactNode;
}) {
  const y = useTransform(progress, [from, to], ["115%", "0%"]);
  return (
    <motion.span aria-hidden="true" className="inline-block will-change-transform" style={{ y }}>
      {children}
    </motion.span>
  );
}

/** Clips each unit so it rises out of an invisible line. Padding gives Vietnamese diacritics room. */
function Mask({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block overflow-hidden pb-[0.14em] pt-[0.16em] align-top -my-[0.15em]"
    >
      {children}
    </span>
  );
}

type SplitTextProps = {
  /** Use "\n" for line breaks. */
  text: string;
  /** Any 0–1-ish MotionValue; units are staggered between `start` and `end`. */
  progress: MotionValue<number>;
  start?: number;
  end?: number;
  by?: "word" | "char";
  /** Words (exactly as written in `text`) rendered in the turquoise accent. */
  accent?: string[];
  className?: string;
  as?: "span" | "h2" | "h3" | "p";
  /** Skip the screen-reader copy when a parent already labels the text. */
  decorative?: boolean;
};

/**
 * Scroll- or time-linked word/character reveal. The visible units are aria-hidden and a single
 * sr-only copy keeps the text readable by assistive tech. With reduced motion it is plain text.
 */
export function SplitText({
  text,
  progress,
  start = 0,
  end = 1,
  by = "word",
  accent = [],
  className,
  as: Tag = "span",
  decorative = false,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const lines = text.split("\n").map((line) => line.split(" ").filter(Boolean));

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((words, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            {words.map((word, wi) => (
              <Fragment key={wi}>
                {wi > 0 && " "}
                <span className={accent.includes(word) ? "text-primary" : undefined}>{word}</span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </Tag>
    );
  }

  const total = lines.reduce(
    (count, words) =>
      count +
      (by === "char"
        ? words.reduce((n, word) => n + Array.from(word.normalize("NFC")).length, 0)
        : words.length),
    0
  );
  const span = Math.max(end - start, 0.0001);
  const dur = span * (total > 1 ? 0.55 : 1);
  const step = total > 1 ? (span - dur) / (total - 1) : 0;
  let k = 0;
  const unit = (node: ReactNode) => {
    const from = start + step * k;
    k += 1;
    return (
      <Unit key={k} progress={progress} from={from} to={from + dur}>
        {node}
      </Unit>
    );
  };

  return (
    <Tag className={className}>
      {!decorative && <span className="sr-only">{text.replace(/\n/g, " ")}</span>}
      {lines.map((words, li) => (
        <Fragment key={li}>
          {li > 0 && <br aria-hidden="true" />}
          {words.map((word, wi) => {
            const tone = accent.includes(word) ? "text-primary" : undefined;
            return (
              <Fragment key={wi}>
                {wi > 0 && " "}
                {by === "char" ? (
                  <span aria-hidden="true" className={cn("inline-block whitespace-nowrap", tone)}>
                    {Array.from(word.normalize("NFC")).map((char, ci) => (
                      <Mask key={ci}>{unit(char)}</Mask>
                    ))}
                  </span>
                ) : (
                  <Mask>{unit(<span className={tone}>{word}</span>)}</Mask>
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * One-shot 0→1 progress that plays when the element first enters the viewport. Lets the
 * sequential (mobile / reduced-motion) layout reuse SplitText without scroll-linking.
 */
export function useRevealOnView<T extends Element>(reduce: boolean, duration = 1.3) {
  const ref = useRef<T>(null);
  const progress = useMotionValue(reduce ? 1 : 0);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(progress, 1, { duration, ease });
    return () => controls.stop();
  }, [inView, reduce, duration, progress]);

  return { ref, progress };
}

/* -------------------------------------------------------------------------- */
/* Pointer depth                                                               */
/* -------------------------------------------------------------------------- */

const idle = motionValue(0);

/** Smoothed pointer offset (-0.5…0.5) shared by the sticky stage. Idle (always 0) outside it. */
export const PointerContext = createContext<{ x: MotionValue<number>; y: MotionValue<number> }>({
  x: idle,
  y: idle,
});

/** Nudges its children against the pointer for a subtle layered depth. Positive = follows. */
export function Depth({
  strength,
  className,
  children,
}: {
  strength: number;
  className?: string;
  children: ReactNode;
}) {
  const { x, y } = useContext(PointerContext);
  const dx = useTransform(x, (v) => v * strength);
  const dy = useTransform(y, (v) => v * strength);
  return (
    <motion.div className={className} style={{ x: dx, y: dy }}>
      {children}
    </motion.div>
  );
}
