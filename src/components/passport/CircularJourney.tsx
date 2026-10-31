import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { JOURNEY } from "@/data/watchPassport";
import { cn } from "@/lib/utils";
import { useSectionProgress } from "./useSectionProgress";

/**
 * The circular journey. Scroll lights the steps in order; each step can also be
 * focused or hovered. With reduced motion every step is simply shown.
 */
export function CircularJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const progress = useSectionProgress(ref, ["start 70%", "end 55%"]);
  const [reached, setReached] = useState(reduce ? JOURNEY.length - 1 : 0);
  const [picked, setPicked] = useState<number | null>(null);

  useMotionValueEvent(progress, "change", (v) => {
    setReached(Math.min(JOURNEY.length - 1, Math.max(0, Math.floor(v * JOURNEY.length))));
  });

  const ring = useTransform(progress, [0, 1], [0, 1]);
  const settled = reduce ? JOURNEY.length - 1 : reached;
  const current = picked ?? settled;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            Circular journey
          </p>
          <h2 className="display display-lg mt-6 max-w-[16ch]">
            Not an ending. <span className="text-primary">A loop.</span>
          </h2>
          <p className="lede mt-6 max-w-[52ch]">
            When a family is ready to move on, the Core follows six steps and returns to use. The passport
            is updated along the way.
          </p>
        </Reveal>

        <div ref={ref} className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          {/* Ring */}
          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true" fill="none">
              <circle cx="100" cy="100" r="82" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <motion.circle
                cx="100"
                cy="100"
                r="82"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: reduce ? 1 : ring }}
              />
              {JOURNEY.map((step, i) => {
                const angle = (i / JOURNEY.length) * Math.PI * 2;
                const x = 100 + 82 * Math.cos(angle);
                const y = 100 + 82 * Math.sin(angle);
                const on = i <= current;
                return (
                  <circle
                    key={step.id}
                    cx={x}
                    cy={y}
                    r={on ? 5 : 3.5}
                    fill={on ? "hsl(var(--primary))" : "white"}
                    stroke={on ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth="1.5"
                    style={{ transition: "all 0.4s ease" }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
              <RefreshCw className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-deep/55">
                STEP {String(current + 1).padStart(2, "0")} / {String(JOURNEY.length).padStart(2, "0")}
              </p>
              <p className="mt-2 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.04em] text-ink">
                {JOURNEY[current].title}
              </p>
            </div>
          </div>

          {/* Steps */}
          <ol className="grid gap-2">
            {JOURNEY.map((step, i) => {
              const on = i <= settled;
              const active = i === current;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    onClick={() => setPicked(i === picked ? null : i)}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5",
                      active ? "border-primary/50 bg-aqua-soft/60" : "border-transparent hover:bg-mist"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-colors duration-500",
                        on ? "bg-primary text-ink" : "bg-mist text-deep/55"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium text-ink">{step.title}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-relaxed text-deep/65">
                        {step.body}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
