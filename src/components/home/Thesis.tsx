import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

const STATEMENT = ["Growing", "up", "means", "taking", "small", "steps."];
// The last two words land in turquoise.
const ACCENT = new Set(["small", "steps."]);

function Word({
  children,
  progress,
  range,
  accent = false,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.24, 1]);
  // A small rise travels with the opacity. The span is inline-block so the transform applies.
  const y = useTransform(progress, range, [6, 0]);

  // Accent words stay neutral while they are dim, so they never read as a rendering defect,
  // and turn turquoise only once they are almost fully lit. State flips at one threshold only.
  const litAt = range[0] + (range[1] - range[0]) * 0.8;
  const [lit, setLit] = useState(() => accent && progress.get() >= litAt);
  useMotionValueEvent(progress, "change", (value) => {
    if (accent) setLit(value >= litAt);
  });

  return (
    <span className="relative mr-[0.22em] inline-block">
      <motion.span
        className={cn("inline-block transition-colors duration-500", accent && lit && "text-primary")}
        style={{ opacity, y }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Thesis() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.72"],
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-mist py-20 sm:py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-white/70 blur-[80px]"
      />
      <div className="shell relative grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Why SafeKid
            </p>
          </Reveal>
          <h2 className="display display-lg mt-8 max-w-[16ch]">
            {STATEMENT.map((word, index) => {
              const start = index / STATEMENT.length;
              const end = Math.min(1, start + 0.42);
              return reduce ? (
                <span
                  key={word}
                  className={cn("mr-[0.22em] inline-block", ACCENT.has(word) && "text-primary")}
                >
                  {word}
                </span>
              ) : (
                <Word
                  key={word}
                  progress={scrollYProgress}
                  range={[start, end]}
                  accent={ACCENT.has(word)}
                >
                  {word}
                </Word>
              );
            })}
          </h2>
        </div>

        <div className="flex flex-col justify-end gap-6 lg:pb-3">
          <Reveal variant="soft">
            <p className="max-w-[38ch] font-display text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.45] tracking-[-0.02em] text-ink">
              The walk to a friend's home. The first trip around the block. Ordinary moments that
              feel like a big new beginning.
            </p>
          </Reveal>
          <Reveal variant="soft" delay={0.08}>
            <p className="lede max-w-[42ch]">
              SafeKid is a product concept built around that in-between space: giving children room
              to discover, while helping families feel connected as they do.
            </p>
          </Reveal>
          <Reveal variant="soft" delay={0.16}>
            <Link to="/zodiac" className="group inline-flex items-center gap-2 text-sm font-medium text-ink">
              Find their kind of adventure
              <ArrowUpRight
                className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
