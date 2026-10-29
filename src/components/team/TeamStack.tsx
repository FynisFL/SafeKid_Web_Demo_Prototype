import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { Stagger } from "@/components/motion/Stagger";
import { SplitText, useRevealOnView } from "./kinetic";
import { JourneyPill, RoleLabel } from "./shared";
import type { Member } from "./types";

const ease = [0.22, 1, 0.36, 1] as const;

const inset = (top: number, right: number, bottom: number, left: number) =>
  `inset(${top}% ${right}% ${bottom}% ${left}% round 22px)`;
const FULL = inset(0, 0, 0, 0);
/** Each portrait opens from a different edge, echoing the desktop stage. */
const FROM = [inset(100, 0, 0, 0), inset(0, 0, 0, 100), inset(0, 100, 0, 0), inset(0, 0, 100, 0)];

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

function StackProfile({ member, index, reduce }: { member: Member; index: number; reduce: boolean }) {
  const { ref, progress } = useRevealOnView<HTMLLIElement>(reduce);
  const clip = useTransform(progress, [0, 0.7], [FROM[index % FROM.length], FULL]);
  const scale = useTransform(progress, [0, 1], [1.24, 1.08]);
  const branch = useTransform(progress, [0, 0.35], [0, 1]);
  const dot = useTransform(progress, [0.25, 0.45], [0, 1]);
  const body = useTransform(progress, [0.45, 0.85], [0, 1]);
  const bodyY = useTransform(progress, [0.45, 0.85], [14, 0]);

  return (
    <li ref={ref} className="relative pb-14 pl-9 last:pb-0 sm:pb-20 sm:pl-14">
      {/* Branch: this person's line joining the single spine. */}
      <span aria-hidden="true" className="absolute left-0 top-2 -translate-x-1/2 -translate-y-1/2">
        <motion.span className="block h-[9px] w-[9px] rounded-full bg-primary" style={{ scale: dot }} />
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-2 h-px w-6 origin-left bg-primary sm:w-10"
        style={{ scaleX: branch }}
      />

      <div className="grid gap-6 sm:grid-cols-[200px_1fr] sm:gap-8 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-[4/5] w-full max-w-[260px] sm:max-w-none">
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[22px] bg-mist"
            style={{ clipPath: clip }}
          >
            <motion.img
              src={member.image}
              alt={`${member.name}, ${member.role}`}
              width={800}
              height={1000}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover saturate-[0.94]"
              style={{ scale }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/25 via-transparent to-transparent"
            />
          </motion.div>
        </div>

        <div className="min-w-0">
          <RoleLabel>{member.role}</RoleLabel>
          <h3 className="mt-3 font-display text-[clamp(1.7rem,6.4vw,2.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ink">
            <SplitText text={member.name} progress={progress} start={0.1} end={0.6} by="word" />
          </h3>
          <motion.p
            className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.7] text-deep/75"
            style={{ opacity: body, y: bodyY }}
          >
            {member.summary}
          </motion.p>
          <Stagger className="mt-4" gap={0.06}>
            <ul className="space-y-1.5">
              {member.responsibilities.map((item) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  className="flex gap-2.5 text-[13.5px] leading-relaxed text-deep/80"
                >
                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </Stagger>
        </div>
      </div>
    </li>
  );
}

function StackEnding({ reduce }: { reduce: boolean }) {
  const { ref, progress } = useRevealOnView<HTMLDivElement>(reduce);
  const dot = useTransform(progress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="relative pl-9 pt-6 sm:pl-14">
      <span aria-hidden="true" className="absolute left-0 top-8 -translate-x-1/2 -translate-y-1/2">
        <motion.span className="block h-[9px] w-[9px] rounded-full bg-primary" style={{ scale: dot }} />
      </span>
      <h3 className="display display-md">
        <SplitText
          text={"Four minds.\nOne direction."}
          progress={progress}
          start={0.05}
          end={0.8}
          accent={["direction."]}
        />
      </h3>
      <div className="mt-8">
        <JourneyPill />
      </div>
    </div>
  );
}

/** Sequential profiles: no sticky stage, nothing scroll-jacked, readable at any pace. */
export function TeamStack({ members }: { members: Member[] }) {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 70%", "end 75%"] });
  const spine = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div className="shell pb-24 pt-4 sm:pb-28">
      <div ref={wrapRef} className="relative ml-2 sm:ml-3">
        <span aria-hidden="true" className="absolute bottom-0 left-0 top-2 w-px bg-ink/10" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-2 w-px origin-top bg-primary"
          style={{ scaleY: reduce ? 1 : spine }}
        />
        <ol className="relative">
          {members.map((member, i) => (
            <StackProfile key={member.name} member={member} index={i} reduce={reduce} />
          ))}
        </ol>
        <StackEnding reduce={reduce} />
      </div>
    </div>
  );
}
