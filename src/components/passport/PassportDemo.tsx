import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BadgeCheck, Eraser, Fingerprint, ShieldCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEMO_LABEL,
  LIFE_ORDER,
  LIFE_STAGES,
  SAMPLE_DEVICE_ID,
  eventsAt,
  wipeEventsAt,
  WIPE_NOTE,
  type LifeId,
} from "@/data/watchPassport";

type View = "overview" | "history" | "wipe";

const VIEWS: { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "history", label: "Service history" },
  { id: "wipe", label: "Data wipe" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function PassportDemo({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [life, setLife] = useState<LifeId>("life1");
  const [view, setView] = useState<View>("overview");

  const lifeIndex = LIFE_ORDER.indexOf(life);
  const stage = LIFE_STAGES[lifeIndex];
  const events = useMemo(() => eventsAt(life), [life]);
  const wipeEvents = useMemo(() => wipeEventsAt(life), [life]);
  const wipeCount = wipeEvents.length;

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[0.62fr_1.38fr] lg:gap-10", className)}>
      {/* Stage selector */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-deep/65">
          Choose a chapter
        </p>
        <div
          role="group"
          aria-label="Lifecycle chapter"
          className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:flex-col lg:overflow-visible"
        >
          {LIFE_STAGES.map((item) => {
            const active = item.id === life;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setLife(item.id)}
                className={cn(
                  "group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:w-full",
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-border bg-white text-ink hover:border-primary/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px]",
                    active ? "bg-primary text-ink" : "bg-mist text-deep"
                  )}
                >
                  {item.index}
                </span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap text-[13.5px] font-medium">{item.tab}</span>
                  <span
                    className={cn(
                      "hidden whitespace-nowrap text-[11.5px] lg:block",
                      active ? "text-white/65" : "text-deep/60"
                    )}
                  >
                    {item.title.replace(".", "")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 max-w-[32ch] text-[13px] leading-relaxed text-deep/65">{stage.summary}</p>
      </div>

      {/* Passport */}
      <div className="relative overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-[0_40px_90px_-60px_rgba(16,42,56,0.55)] lg:rounded-[36px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-[320px] w-[320px] rounded-full bg-primary/10 blur-[80px]"
        />
        <div className="relative border-b border-border/80 bg-mist px-5 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-deep/70">
              <Fingerprint className="h-4 w-4 text-primary" aria-hidden="true" />
              Watch Passport
            </p>
            <span className="rounded-full border border-primary/40 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-deep">
              {DEMO_LABEL}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-deep/55">Device ID · sample</p>
              <p className="mt-1 font-mono text-[clamp(1.1rem,2.4vw,1.55rem)] tracking-[0.06em] text-ink">
                {SAMPLE_DEVICE_ID}
              </p>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[12px] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {stage.status}
            </p>
          </div>

          {/* Lifecycle bar */}
          <div className="mt-5 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {LIFE_ORDER.map((id, i) => (
              <span key={id} className="h-1 overflow-hidden rounded-full bg-ink/10">
                <motion.span
                  className="block h-full origin-left rounded-full bg-primary"
                  initial={false}
                  animate={{ scaleX: i <= lifeIndex ? 1 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.6, ease }}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="relative px-5 pt-5 sm:px-8">
          <div role="group" aria-label="Passport section" className="flex flex-wrap gap-1.5">
            {VIEWS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={view === item.id}
                onClick={() => setView(item.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-[12.5px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  view === item.id ? "bg-aqua-soft text-ink" : "text-deep/65 hover:text-ink"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[330px] px-5 pb-7 pt-5 sm:px-8" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={\`\${view}-\${life}\`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.35, ease }}
            >
              {view === "overview" && (
                <div>
                  <dl className="grid gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/80 sm:grid-cols-2">
                    {stage.condition.map((row) => (
                      <div key={row.label} className="bg-white px-4 py-3.5">
                        <dt className="text-[10px] uppercase tracking-[0.18em] text-deep/55">{row.label}</dt>
                        <dd className="mt-1 text-[14px] text-ink">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl bg-mist px-4 py-3.5">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-deep/55">Warranty eligibility</p>
                        <p className="mt-1 text-[14px] text-ink">{stage.warranty}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-mist px-4 py-3.5">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-deep/55">Lifecycle status</p>
                        <p className="mt-1 text-[14px] text-ink">{stage.status.split(" · ")[1]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {view === "history" && (
                <ol className="relative space-y-4 border-l border-border pl-6">
                  {events.map((event, i) => {
                    const latest = i === events.length - 1;
                    return (
                      <li key={event.id} className="relative">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                            latest ? "bg-primary" : "bg-deep/30"
                          )}
                        />
                        <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
                          <Wrench className="h-3.5 w-3.5 text-deep/45" aria-hidden="true" />
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-deep/65">{event.detail}</p>
                      </li>
                    );
                  })}
                </ol>
              )}

              {view === "wipe" && (
                <div>
                  <div className="flex items-center gap-4 rounded-2xl bg-mist px-5 py-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
                      <Eraser className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-display text-3xl font-medium tracking-[-0.04em] text-ink">
                        {wipeCount}
                      </p>
                      <p className="text-[12px] text-deep/65">
                        Certified Data Wipe record{wipeCount === 1 ? "" : "s"} on this passport
                      </p>
                    </div>
                  </div>
                  {wipeEvents.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {wipeEvents.map((event) => (
                        <li key={event.id} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {event.wipeLabel}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[13.5px] text-deep/65">
                      No wipe record yet. The first cycle begins with a new device.
                    </p>
                  )}
                  <p className="mt-5 text-[12.5px] leading-relaxed text-deep/65">{WIPE_NOTE}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="relative border-t border-border/80 bg-mist/70 px-5 py-3.5 text-[11px] leading-relaxed text-deep/60 sm:px-8">
          Sample information only. This is not a real connected device or an operational certification
          system, and warranty terms are not defined in this concept.
        </p>
      </div>
    </div>
  );
}
