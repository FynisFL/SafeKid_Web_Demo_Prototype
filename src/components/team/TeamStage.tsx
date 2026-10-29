import { useMemo, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCanHover } from "@/hooks/useCanHover";
import { useElementSize } from "@/hooks/useElementSize";
import { cn } from "@/lib/utils";
import { PointerContext, SplitText } from "./kinetic";
import { SCENES } from "./scenes";
import { JourneyPill, givenName } from "./shared";
import type { Member } from "./types";

/**
 * Sticky storytelling stage (desktop, no reduced motion).
 *
 * One scroll track drives everything through a single smoothed progress value `sp` (0–1):
 *   0.00–0.06  the line from the opening splits into four threads, one per person
 *   STARTS[i]  profile i's slot (SLOT long); each holds fully visible before it leaves
 *   0.90–1.00  the four threads bend together into one line that leaves the stage
 * Scrolling is never locked or hijacked: the track is just a tall element.
 */
const STARTS = [0.06, 0.27, 0.48, 0.69] as const;
const SLOT = 0.21;
const END_AT = 0.9;
const TRACK_SVH = 640;
/** Space reserved under the fixed site header, and the height of the dot rail. */
const HEADER = 88;
const RAIL = 36;

function RailNode({
  index,
  member,
  sp,
  active,
  onGo,
}: {
  index: number;
  member: Member;
  sp: MotionValue<number>;
  active: boolean;
  onGo: (index: number) => void;
}) {
  const s = STARTS[index];
  const lit = useTransform(sp, [s - 0.02, s + 0.01], [0, 1]);
  const labelOpacity = useTransform(sp, [s - 0.04, s - 0.01, s + SLOT - 0.03, s + SLOT], [0.4, 1, 1, 0.4]);
  const role = member.role.split(" · ")[0];

  return (
    <button
      type="button"
      onClick={() => onGo(index)}
      aria-label={`Go to ${member.name}, ${member.role}`}
      aria-current={active ? "step" : undefined}
      className="pointer-events-auto relative block h-full w-full rounded-md"
    >
      <span className="absolute left-1/2 top-1/2 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/50 bg-mist">
        <motion.span className="h-1.5 w-1.5 rounded-full bg-primary" style={{ scale: lit, opacity: lit }} />
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute left-[calc(50%+16px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-left text-[10.5px] font-semibold uppercase tracking-[0.16em] text-deep"
        style={{ opacity: labelOpacity }}
      >
        <span className="text-primary">{String(index + 1).padStart(2, "0")}</span> {givenName(member.name)}
        <span className="ml-2 hidden font-medium normal-case tracking-normal text-deep/60 xl:inline">
          {role}
        </span>
      </motion.span>
    </button>
  );
}

/** One person's thread: a stub while they are on stage, then a curve that joins the others. */
function Thread({
  index,
  fan,
  merge,
  sp,
  fanLen,
}: {
  index: number;
  fan: string;
  merge: string;
  sp: MotionValue<number>;
  fanLen: MotionValue<number>;
}) {
  const s = STARTS[index];
  const stub = useTransform(sp, [s - 0.02, s + 0.02, END_AT + 0.008 * index, 0.97], [0, 0.07, 0.07, 1]);
  return (
    <>
      <motion.path
        d={fan}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={1.25}
        style={{ pathLength: fanLen }}
      />
      <motion.path
        d={merge}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={1.25}
        style={{ pathLength: stub }}
      />
    </>
  );
}

export function TeamStage({ members }: { members: Member[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const sp = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 });

  useMotionValueEvent(sp, "change", (value) => {
    const next = value >= END_AT ? members.length : STARTS.reduce((at, s, i) => (value >= s - 0.02 ? i : at), -1);
    setActive((prev) => (prev === next ? prev : next));
  });

  /* Pointer depth: a smoothed -0.5…0.5 offset, only on hover-capable devices. */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 90, damping: 20 });
  const py = useSpring(rawY, { stiffness: 90, damping: 20 });
  const pointer = useMemo(() => ({ x: px, y: py }), [px, py]);

  const { width: W, height: H } = useElementSize(innerRef);

  const geo = useMemo(() => {
    if (!W || !H) return null;
    const cx = W / 2;
    const cy = H * 0.56;
    const dotY = HEADER + RAIL / 2;
    const stemEnd = HEADER * 0.55;
    const xs = members.map((_, i) => ((i + 0.5) * W) / members.length);
    const fan = xs.map((x) => {
      const g = (dotY - stemEnd) * 0.6;
      return `M ${cx} 0 L ${cx} ${stemEnd} C ${cx} ${stemEnd + g}, ${x} ${dotY - g}, ${x} ${dotY}`;
    });
    const merge = xs.map((x) => {
      const g = (cy - dotY) * 0.55;
      return `M ${x} ${dotY} C ${x} ${dotY + g}, ${cx} ${cy - g}, ${cx} ${cy} L ${cx} ${H}`;
    });
    return { cx, cy, fan, merge };
  }, [W, H, members]);

  const fanLen = useTransform(sp, [0, 0.05], [0, 1]);
  const knot = useTransform(sp, [0.94, 0.98], [0, 1]);
  const minds = useTransform(sp, [0.925, 0.99], [0, 1]);

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * (STARTS[index] + SLOT * 0.5), behavior: "smooth" });
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canHover || event.pointerType === "touch") return;
    rawX.set(event.clientX / window.innerWidth - 0.5);
    rawY.set(event.clientY / window.innerHeight - 0.5);
  }

  return (
    <>
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_SVH}svh` }}>
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: "100svh" }}
          onPointerMove={onPointerMove}
        >
          <PointerContext.Provider value={pointer}>
            <div className="shell h-full">
              <div ref={innerRef} className="relative flex h-full flex-col">
                <div aria-hidden="true" style={{ height: HEADER }} className="shrink-0" />

                {/* Rail: the four starting points of the four threads. */}
                <nav aria-label="Team members" className="grid shrink-0 grid-cols-4" style={{ height: RAIL }}>
                  {members.map((member, i) => (
                    <RailNode
                      key={member.name}
                      index={i}
                      member={member}
                      sp={sp}
                      active={active === i}
                      onGo={goTo}
                    />
                  ))}
                </nav>

                {/* Scenes */}
                <div className="relative min-h-0 flex-1">
                  {members.map((member, i) => (
                    <SceneSlot key={member.name} index={i} sp={sp} member={member} />
                  ))}
                </div>

                {/* Threads: fan out of the opening line, then converge into one. */}
                {geo && (
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    width={W}
                    height={H}
                  >
                    {members.map((_, i) => (
                      <Thread key={i} index={i} fan={geo.fan[i]} merge={geo.merge[i]} sp={sp} fanLen={fanLen} />
                    ))}
                    <motion.circle
                      cx={geo.cx}
                      cy={geo.cy}
                      r={4}
                      fill="hsl(var(--primary))"
                      style={{ opacity: knot }}
                    />
                  </svg>
                )}

                {/* Ending words sit on either side of the single line. */}
                <div
                  className="pointer-events-none absolute inset-x-0 flex items-center"
                  style={{ top: "70%" }}
                >
                  <h3 className="sr-only">Four minds. One direction.</h3>
                  <div aria-hidden="true" className="w-1/2 pr-7 text-right">
                    <SplitText
                      decorative
                      text="Four minds."
                      progress={minds}
                      start={0}
                      end={0.6}
                      className="display display-lg"
                    />
                  </div>
                  <div aria-hidden="true" className="w-1/2 pl-7">
                    <SplitText
                      decorative
                      text="One direction."
                      progress={minds}
                      start={0.35}
                      end={1}
                      accent={["direction."]}
                      className="display display-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PointerContext.Provider>
        </div>
      </div>

      <Bridge />
    </>
  );
}

function SceneSlot({ index, sp, member }: { index: number; sp: MotionValue<number>; member: Member }) {
  const s = STARTS[index];
  const lp = useTransform(sp, [s - 0.021, s + SLOT + 0.021], [-0.1, 1.1]);
  const Scene = SCENES[index];
  return <Scene member={member} lp={lp} />;
}

/** The merged line keeps going below the stage and lands on a link into Our Journey. */
function Bridge({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "end 62%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto w-full", className)}
      style={{ height: "clamp(150px, 24svh, 260px)" }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 top-0 w-px origin-top bg-primary"
        style={{ scaleY: draw }}
      />
      <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
        <JourneyPill />
      </div>
    </div>
  );
}
