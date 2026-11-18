import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { Recycle } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { LIFE_STAGES } from "@/data/watchPassport";
import { cn } from "@/lib/utils";
import { useSectionProgress } from "./useSectionProgress";

const LAYERS = [
  {
    name: "Core",
    body: "The hardware and connectivity foundation. It carries the Device ID and the passport.",
  },
  {
    name: "Skin",
    body: "Replaceable physical components, such as straps and cases.",
  },
  {
    name: "Skill",
    body: "Software capabilities that evolve with the child's needs.",
  },
];

/** Three controlled lives and an end of life, joined by one line that draws as you scroll. */
export function LivesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const progress = useSectionProgress(ref);
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden bg-night py-20 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[110px]"
      />
      <div className="shell relative">
        <Reveal>
          <p className="eyebrow eyebrow-inverse">
            <span className="eyebrow-line" />
            Three controlled lives
          </p>
          <h2 className="display display-lg mt-6 max-w-[16ch] text-white">
            A Core is made to <span className="text-primary">last, on purpose.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.75] text-white/60">
            Each chapter is deliberate: a new device, two certified refurbished lives, then a responsible
            end. The passport keeps the record of the device, not of the people who used it.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14 lg:mt-20">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-[19px] top-3 h-[calc(100%-1.5rem)] w-px bg-white/10 lg:left-0 lg:top-[19px] lg:h-px lg:w-full"
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-[19px] top-3 h-[calc(100%-1.5rem)] w-px origin-top bg-primary lg:hidden"
            style={reduce ? undefined : { scaleY: lineScale }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-[19px] hidden h-px w-full origin-left bg-primary lg:block"
            style={reduce ? undefined : { scaleX: lineScale }}
          />

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {LIFE_STAGES.map((stage, i) => {
              const isEnd = stage.id === "end";
              return (
                <li key={stage.id} className="relative pl-14 lg:pl-0 lg:pt-14">
                  <span
                    className={cn(
                      "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-[12px] lg:left-0",
                      isEnd
                        ? "border-white/25 bg-night text-white/80"
                        : "border-primary/60 bg-night text-primary"
                    )}
                  >
                    {isEnd ? <Recycle className="h-4 w-4" aria-hidden="true" /> : stage.index}
                  </span>
                  <Reveal delay={i * 0.08}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-aqua-soft/70">
                      {stage.eyebrow}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.04em]">
                      {stage.title}
                    </h3>
                    <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-white/55">
                      {stage.summary}
                    </p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal className="mt-14 lg:mt-20">
          <div className="grid gap-6 border-t border-white/10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-aqua-soft/70">
                When a new life begins
              </p>
              <p className="mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-white/75">
                Repairing a device does not start a new lifecycle. A new life begins only after the Core
                passes inspection and is reactivated for another user.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-aqua-soft/70">
                Core + Skin + Skill, built for a longer life
              </p>
              <dl className="mt-3 grid gap-4 sm:grid-cols-3">
                {LAYERS.map((layer) => (
                  <div key={layer.name}>
                    <dt className="text-[13.5px] font-medium text-primary">{layer.name}</dt>
                    <dd className="mt-1 text-[12.5px] leading-relaxed text-white/55">{layer.body}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 max-w-[52ch] text-[12.5px] leading-relaxed text-white/55">
                Wear, style and needs change in the outer layers, so the Core underneath can stay in service
                longer.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
