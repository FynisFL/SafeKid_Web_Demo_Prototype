import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { DEMO_LABEL, LIFE_STAGES, SAMPLE_DEVICE_ID, wipeEventsAt } from "@/data/watchPassport";
import { cn } from "@/lib/utils";
import { DURATION, EASE, SCROLL_SPRING } from "@/components/motion/tokens";

const PILLARS = ["Core + Skin + Skill", "Trade-in", "Refurbishment", "Watch Passport"];
const LIVES = LIFE_STAGES.slice(0, 3);

/**
 * Homepage teaser. One scroll-linked idea: as the section passes, the sample
 * passport moves from Life 1 to Life 3. The dedicated page holds the full demo.
 */
export function WatchPassportSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? 2 : 0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING);
  // The line reaches its last dot just before the section leaves, and each dot lights as the line passes it.
  const fill = useTransform(smooth, [0, 0.85], [0.04, 1]);
  // A gentle depth drift: the passport card travels a little slower than the copy.
  const cardY = useTransform(smooth, [0, 1], [18, -18]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setActive(v < 0.4 ? 0 : v < 0.8 ? 1 : 2);
  });

  const shown = reduce ? LIVES.length - 1 : active;
  const stage = LIVES[shown];
  const wipeCount = wipeEventsAt(stage.id).length;

  return (
    <section ref={ref} className="relative overflow-hidden bg-mist py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-white/80 blur-[100px]"
      />
      <div className="shell relative grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Grow Sustainable
            </p>
            <h2 className="display display-lg mt-6 max-w-[14ch]">
              One Core. <span className="text-primary">More than one chapter.</span>
            </h2>
            <p className="lede mt-6 max-w-[48ch]">
              SafeKid is designed around a child's safety today, while the device itself can keep creating
              value beyond its first lifecycle. Watch Passport is the concept behind that: a lifecycle record
              for each Core, tracking the device and never the child.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Grow Sustainable pillar">
              {PILLARS.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-ink/12 bg-white/70 px-3.5 py-1.5 text-[12px] text-deep"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Magnetic>
                <Link
                  to="/watch-passport"
                  className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-ink pl-6 pr-5 text-[14px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
                >
                  Explore Watch Passport
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal variant="soft">
          <motion.div
            className="relative mx-auto w-full max-w-[460px]"
            style={reduce ? undefined : { y: cardY }}
          >
            <div className="overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-[0_40px_90px_-60px_rgba(16,42,56,0.55)] lg:rounded-[36px]">
              <div className="flex items-center justify-between gap-3 border-b border-border/80 px-6 py-4">
                <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-deep/70">
                  <Fingerprint className="h-4 w-4 text-primary" aria-hidden="true" />
                  Watch Passport
                </p>
                <span className="rounded-full border border-primary/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-deep">
                  {DEMO_LABEL}
                </span>
              </div>
              <div className="px-6 pb-7 pt-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-deep/55">Device ID · sample</p>
                <p className="mt-1 font-mono text-[1.25rem] tracking-[0.06em] text-ink">{SAMPLE_DEVICE_ID}</p>

                <div className="mt-7" aria-hidden="true">
                  <div className="relative h-px bg-border">
                    <motion.span
                      className="absolute inset-0 origin-left bg-primary"
                      style={reduce ? undefined : { scaleX: fill }}
                    />
                  </div>
                  <div className="mt-[-5px] flex justify-between">
                    {LIVES.map((life, i) => (
                      <span
                        key={life.id}
                        className={cn(
                          "h-2.5 w-2.5 rounded-full border-2 border-white transition-colors duration-500",
                          i <= shown ? "bg-primary" : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-7 min-h-[92px]" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={stage.id}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-deep/55">{stage.eyebrow}</p>
                      <p className="mt-1 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.04em] text-ink">
                        {stage.title}
                      </p>
                      <p className="mt-2 text-[13px] text-deep/65">
                        {wipeCount} Certified Data Wipe record{wipeCount === 1 ? "" : "s"} · {stage.status.split(" · ")[1]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-[11px] text-deep/55">
              Sample information. Not a real connected device.
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
