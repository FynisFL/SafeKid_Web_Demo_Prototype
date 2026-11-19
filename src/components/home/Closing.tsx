import { SET_PIECES } from "@/components/motion/setPieces";
import { useEnhancedMotion } from "@/components/motion/useEnhancedMotion";
import { ScrollFloat } from "@/components/motion/reactbits/ScrollFloat";
import { ScrollReveal } from "@/components/motion/reactbits/ScrollReveal";
import { useRef, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Radio } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import dragonWatch from "@/assets/safekid/editions/dragon.webp";
import { DISTANCE, DURATION, EASE } from "@/components/motion/tokens";
import { useFirstScene } from "@/components/preloader/firstSceneContext";

const shieldPoints = [[60, 6], [78, 13], [101, 23], [101, 43], [89, 72], [78, 87],
  [60, 98], [42, 87], [31, 72], [19, 43], [19, 23], [42, 13]];

const settle = { duration: DURATION.base, ease: EASE };

const closingPulse = (delay: number) =>
  `sk-closing-pulse ${DURATION.base}s cubic-bezier(${EASE.join(",")}) ${delay}s both`;

function ClosingSignal({ ready, reduce }: { ready: boolean; reduce: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.42 });
  const motionAllowed = useEnhancedMotion();
  const active = ready && !reduce && inView && motionAllowed;

  return (
    <motion.div
      ref={stage}
      data-closing-stage
      aria-hidden="true"
      initial={false}
      animate={active ? "arrive" : "rest"}
      className="relative isolate aspect-[2/1] min-h-36 w-full overflow-hidden rounded-[22px] border border-white/10 bg-night md:aspect-[1.4/1] md:rounded-[28px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_33%_44%,hsl(var(--primary)/0.26),transparent_62%)]" />
      {SET_PIECES.closingShield && (
        <motion.svg viewBox="0 0 120 104" className="pointer-events-none absolute left-[53%] top-1/2 h-full w-[48%] -translate-x-1/2 -translate-y-1/2"
          variants={{ rest: { opacity: .34 }, arrive: { opacity: [.34, .94, .62], transition: { duration: 1.24, ease: EASE } } }}>
          <motion.path d="M60 6L101 23v20c0 25-17 43-41 55-24-12-41-30-41-55V23Z"
            fill="none" stroke="#52f4e0" strokeWidth="1.4"
            variants={{ rest: { pathLength: 1 }, arrive: { pathLength: [.07, 1], transition: { duration: 1.18, ease: EASE } } }} />
          {shieldPoints.map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="1.25" fill="#8ff9e8"
              className={active ? "sk-shield-point sk-shield-point-active" : "sk-shield-point"}
              style={{ "--dx": `${(x - 60) * .72}px`, "--dy": `${(y - 52) * .72}px`,
                "--wait": `${index * .017}s` } as CSSProperties} />
          ))}
          <motion.path d="m46 51 10 10 19-23" fill="none" stroke="#52f4e0" strokeWidth="1.8" strokeLinecap="round"
            variants={{ rest: { opacity: .42 }, arrive: { opacity: [.16, 1, .66], transition: { duration: 1.3, ease: EASE } } }} />
        </motion.svg>
      )}
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(var(--primary)/0.65)_1px,transparent_1px)] [background-size:15px_15px]" />

      <div className="absolute left-[33%] top-1/2 grid w-[42%] -translate-x-1/2 -translate-y-1/2 place-items-center">
        <span className="absolute aspect-square w-full rounded-full border border-primary/20" />
        <span data-closing-pulse="watch" className="absolute aspect-square w-full rounded-full border-2 border-primary opacity-0"
          style={{ animation: active ? closingPulse(DURATION.feedback) : undefined }} />
        <motion.img
          src={dragonWatch}
          alt=""
          width={620}
          height={620}
          loading="lazy"
          decoding="async"
          variants={{
            rest: { y: reduce ? 0 : DISTANCE.sm, rotate: -9 },
            arrive: { y: 0, rotate: -6, transition: settle },
          }}
          className="relative w-full select-none drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]"
        />
      </div>

      <div className="absolute left-[73%] top-1/2 grid aspect-square w-[32%] -translate-x-1/2 -translate-y-1/2 place-items-center">
        <span className="absolute inset-0 rounded-full border border-primary/20" />
        <span data-closing-pulse="app" className="absolute inset-0 rounded-full border-2 border-primary opacity-0"
          style={{ animation: active ? closingPulse(DURATION.quick) : undefined }} />
        <motion.div
          variants={{
            rest: { y: reduce ? 0 : DISTANCE.sm, rotate: 8 },
            arrive: { y: 0, rotate: 5, transition: { ...settle, delay: DURATION.feedback } },
          }}
          className="relative grid aspect-[0.59] w-[53%] place-items-center rounded-[0.8rem] border border-white/35 bg-[#153744] p-1 shadow-[0_10px_20px_rgba(0,0,0,0.4)] md:rounded-[1.05rem] md:p-1.5"
        >
          <div className="flex size-full flex-col items-center justify-center gap-1.5 rounded-[0.56rem] bg-aqua-soft md:gap-2.5 md:rounded-[0.75rem]">
            <Radio aria-hidden="true" className="size-[30%] text-aqua-ink" strokeWidth={1.5} />
            <span className="h-px w-[52%] rounded-full bg-deep/25 md:h-0.5" />
            <span className="h-px w-[34%] rounded-full bg-deep/25 md:h-0.5" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Closing() {
  const reduce = useReducedMotion() ?? false;
  const { entrance } = useFirstScene();
  const ready = entrance !== "waiting";

  return (
    <section aria-labelledby="home-closing-heading" className="bg-white pb-14 sm:pb-20">
      <div className="shell">
        <div className="rounded-[32px] border border-ink/10 bg-mist px-5 py-7 sm:px-8 sm:py-9 md:grid md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:items-center md:gap-7 lg:rounded-[40px] lg:px-12 lg:py-11 xl:gap-14">
          <div className="min-w-0">
            <span aria-hidden="true" className="eyebrow-line" />
            <h2 id="home-closing-heading" className="display mt-4 text-[clamp(2rem,4.2vw,4.3rem)] leading-[1.02]">
              Independence,{" "}
              <span className="block text-aqua-ink"><ScrollFloat>with connection.</ScrollFloat></span>
            </h2>
            <ScrollReveal className="lede mt-4 max-w-[48ch]">
              SafeKid imagines a little more confidence for children, and a little more reassurance
              for the families cheering them on.
            </ScrollReveal>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link
                to="/zodiac"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-night"
              >
                Meet the 12 editions
                <ArrowRight className="size-4 shrink-0 text-primary motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/app"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full px-2 py-2.5 text-[13px] font-semibold text-aqua-ink transition-colors hover:bg-white"
              >
                Try the Parent App
                <ArrowUpRight className="size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-deep">
              A concept by SafeKid, developed by DigiBabi. No live device or service.
            </p>
          </div>

          <div className="mt-5 min-w-0 md:mt-0">
            <ClosingSignal ready={ready} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}
