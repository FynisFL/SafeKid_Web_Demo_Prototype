import { useRef, useState } from "react";
import { Layers, Shield, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { DURATION, EASE } from "@/components/motion/tokens";
import { DEMO_LABEL } from "@/data/watchPassport";
import { cn } from "@/lib/utils";

const LAYERS = [
  { name: "Core", icon: Shield, color: "#0D2736", label: "Device identity",
    detail: "The hardware carries the Device ID and the sample passport through each lifecycle." },
  { name: "Skin", icon: Layers, color: "#00787a", label: "Replaceable shell",
    detail: "Straps and cases can be renewed as the watch changes hands or a child’s style changes." },
  { name: "Skill", icon: Sparkles, color: "#8f6517", label: "Software capabilities",
    detail: "Software capabilities can evolve while the physical Core stays in service." },
] as const;

export function CoreLayers() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const selected = LAYERS[active];
  const figure = useRef<SVGSVGElement>(null);
  const seen = useInView(figure, { once: true });
  const exploded = reduce || seen;

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-[0_28px_70px_-52px_#102a38] sm:p-8"
      aria-label="SafeKid concept layers">
      <p className="eyebrow"><span className="eyebrow-line" />{DEMO_LABEL}</p>
      <h2 className="display mt-3 text-[clamp(1.8rem,4vw,2.8rem)]">What stays. What can change.</h2>
      <svg ref={figure} data-passport-explode="" viewBox="0 0 340 112" className="h-24 w-full sm:h-28" aria-hidden="true">
        <path d="M38 93 C83 93 88 78 110 78 H226 C255 78 257 93 302 93"
          fill="none" stroke="#00787a" strokeOpacity=".38" strokeDasharray="3 4" />
        <motion.g initial={false} animate={{ x: exploded ? (active === 1 ? -45 : -30) : 33, y: exploded ? 6 : 0, opacity: active === 1 ? 1 : .55 }}
          transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}>
          <rect x="99" y="27" width="74" height="66" rx="20" fill="#bce8e4" stroke="#00787a" strokeWidth="1.5" />
          <rect x="107" y="35" width="58" height="50" rx="14" fill="#eaf4f5" stroke="#00787a" />
        </motion.g>
        <motion.g initial={false} animate={{ y: exploded ? -4 : 0, scale: exploded && active === 0 ? 1.04 : .9 }}
          style={{ transformOrigin: "50% 52%" }}
          transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}>
          <rect x="137" y="17" width="68" height="78" rx="18" fill="#0d2736" />
          <rect x="145" y="25" width="52" height="62" rx="13" fill="#173c4d" stroke="#32c7c4" />
          <path d="M155 58H164L168 50L174 65L178 56H187" stroke="#82f4e7" fill="none" strokeWidth="2" />
        </motion.g>
        <motion.g initial={false} animate={{ x: exploded ? (active === 2 ? 48 : 30) : -30, y: exploded ? 7 : 0, opacity: active === 2 ? 1 : .57 }}
          transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}>
          <rect x="186" y="34" width="48" height="54" rx="12" fill="#fff5dd" stroke="#8f6517" strokeWidth="1.5" />
          <path d="M196 49H224M196 58H224M196 67H214" stroke="#8f6517" strokeLinecap="round" />
        </motion.g>
      </svg>
      <div className="relative mt-2 grid gap-2 sm:grid-cols-3" role="group" aria-label="Choose a concept layer">
        <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-6 hidden h-8 w-full sm:block" aria-hidden="true">
          <path d="M45 15H255" stroke="#00a1a4" strokeLinecap="round" strokeDasharray="3 5" />
        </svg>
        {LAYERS.map(({ name, icon: Icon, color, label }, index) => (
          <motion.button key={name} type="button" onClick={() => setActive(index)} aria-pressed={active === index}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            transition={{ duration: DURATION.feedback, ease: EASE }}
            className={cn("relative flex min-h-14 items-center gap-3 rounded-2xl border p-3 text-left sm:flex-col sm:items-start",
              active === index ? "border-[#00787a]/40 bg-mist ring-1 ring-[#00787a]/30" : "border-ink/10 bg-white hover:bg-mist")}>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: color }}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{name}</span>
              <span className="block text-xs text-deep">{label}</span>
            </span>
          </motion.button>
        ))}
      </div>
      <div className="mt-4 min-h-[4.5rem] border-t border-ink/10 pt-3 text-sm leading-relaxed text-deep" aria-live="polite">
        <AnimatePresence initial={false} mode="wait">
          <motion.p key={selected.name} initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : DURATION.feedback, ease: EASE }}>
            {selected.detail}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
