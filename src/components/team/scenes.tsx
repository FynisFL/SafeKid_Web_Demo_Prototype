import { useRef, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useElementSize } from "@/hooks/useElementSize";
import { cn } from "@/lib/utils";
import { Depth, SplitText } from "./kinetic";
import { RoleLabel } from "./shared";
import type { Member } from "./types";

/**
 * Stage scenes for desktop. Each scene receives `lp`, its local scroll progress:
 *   -0.1 → entering · 0.2 → fully revealed · 0.84 → still fully visible · 1.1 → gone
 * The long hold between 0.2 and 0.84 is the reading time; nothing leaves before it ends.
 */
export type SceneProps = { member: Member; lp: MotionValue<number> };

const RADIUS = "round 22px";
const inset = (top: number, right: number, bottom: number, left: number) =>
  `inset(${top}% ${right}% ${bottom}% ${left}% ${RADIUS})`;
const FULL = inset(0, 0, 0, 0);
/** Shared stops for a portrait mask: hidden → revealed → held → leaving. */
const STOPS = [-0.1, 0.2, 0.84, 1.1];

const itemText = "text-[14px] leading-[1.55] text-deep/85";

/* ------------------------------ building blocks ----------------------------- */

function SceneRoot({ lp, children }: { lp: MotionValue<number>; children: ReactNode }) {
  const opacity = useTransform(lp, [-0.1, 0.16, 0.84, 1.1], [0, 1, 1, 0]);
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      {children}
    </motion.div>
  );
}

/** Fades and moves its child in over a short window of the scene's progress. */
function Beat({
  lp,
  from,
  len = 0.1,
  dx = 0,
  dy = 14,
  as = "div",
  className,
  children,
}: {
  lp: MotionValue<number>;
  from: number;
  len?: number;
  dx?: number;
  dy?: number;
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(lp, [from, from + len], [0, 1]);
  const x = useTransform(lp, [from, from + len], [dx, 0]);
  const y = useTransform(lp, [from, from + len], [dy, 0]);
  if (as === "li") {
    return (
      <motion.li className={className} style={{ opacity, x, y }}>
        {children}
      </motion.li>
    );
  }
  return (
    <motion.div className={className} style={{ opacity, x, y }}>
      {children}
    </motion.div>
  );
}

function PortraitImage({
  member,
  scale,
  x,
  y,
}: {
  member: Member;
  scale: MotionValue<number>;
  x?: MotionValue<string>;
  y?: MotionValue<string>;
}) {
  return (
    <>
      <motion.img
        src={member.image}
        alt={`${member.name}, ${member.role}`}
        width={800}
        height={1000}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover saturate-[0.94]"
        style={{ scale, x, y }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/25 via-transparent to-transparent"
      />
    </>
  );
}

// Size the portrait from its grid cell rather than forcing a viewport-height-based height.
// The 80svh - 100px cap leaves room for the fixed header and team rail on short desktop screens.
const portraitBox = "relative aspect-[4/5] max-w-full";
const portraitBoxStyle = { width: "min(100%, 27rem, calc(80svh - 100px))" };
const portraitCell = "relative flex h-full items-center justify-center";
const grid = "grid h-full grid-rows-[minmax(0,1fr)] items-center";

function Dot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("mt-[9px] h-1 w-1 shrink-0 rounded-full bg-primary", className)} />;
}

/* ------------------------------------ Duy ----------------------------------- */
/* Leader: the portrait rises, a line leaves it and a spine opens for the text.  */

export function DuyScene({ member, lp }: SceneProps) {
  const clip = useTransform(lp, STOPS, [inset(100, 0, 0, 0), FULL, FULL, inset(0, 0, 100, 0)]);
  const scale = useTransform(lp, [-0.1, 0.2, 1.1], [1.3, 1.12, 1.1]);
  const y = useTransform(lp, [-0.1, 1.1], ["3.3%", "-3.3%"]);
  const frameY = useTransform(lp, [-0.1, 1.1], [34, -34]);
  const ghostY = useTransform(lp, [-0.1, 1.1], [90, -90]);
  const connect = useTransform(lp, [0.12, 0.34], [0, 1]);
  const junction = useTransform(lp, [0.3, 0.38], [0, 1]);
  const spine = useTransform(lp, [0.3, 0.54], [0, 1]);

  return (
    <SceneRoot lp={lp}>
      <div className={cn(grid, "grid-cols-[minmax(0,5fr)_minmax(3rem,1fr)_minmax(0,6fr)]")}>
        <Depth strength={12} className={portraitCell}>
          <div className={portraitBox} style={portraitBoxStyle}>
            <motion.span
              aria-hidden="true"
              className="absolute -left-[8%] -top-[9%] select-none font-display text-[clamp(9rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-ink opacity-[0.05]"
              style={{ y: ghostY }}
            >
              01
            </motion.span>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-[22px] border border-primary/45"
              style={{ x: 14, y: frameY }}
            />
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-[22px] bg-mist"
              style={{ clipPath: clip }}
            >
              <PortraitImage member={member} scale={scale} y={y} />
            </motion.div>
          </div>
        </Depth>

        <div aria-hidden="true" className="relative h-full">
          <motion.span
            className="absolute left-0 right-0 top-1/2 h-px origin-left bg-primary"
            style={{ scaleX: connect }}
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <motion.span className="block h-2.5 w-2.5 rounded-full bg-primary" style={{ scale: junction }} />
          </span>
        </div>

        <div className="relative pl-8 xl:pl-10">
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-px origin-center bg-primary/50"
            style={{ scaleY: spine }}
          />
          <Beat lp={lp} from={0.14} dx={-16} dy={0}>
            <RoleLabel>{member.role}</RoleLabel>
          </Beat>
          <h3 className="mt-4 font-display text-[clamp(2.2rem,4.2vw,3.9rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink">
            <SplitText text={member.name} progress={lp} start={0.1} end={0.34} by="char" />
          </h3>
          <Beat lp={lp} from={0.3} dy={16}>
            <p className="mt-5 max-w-[44ch] text-[15px] leading-[1.7] text-deep/80">{member.summary}</p>
          </Beat>
          <ul className="mt-6 space-y-2">
            {member.responsibilities.map((item, i) => (
              <Beat
                key={item}
                as="li"
                lp={lp}
                from={0.38 + i * 0.07}
                dx={-14}
                dy={0}
                className={cn("flex gap-3", itemText)}
              >
                <Dot />
                {item}
              </Beat>
            ))}
          </ul>
        </div>
      </div>
    </SceneRoot>
  );
}

/* ------------------------------------ Linh ---------------------------------- */
/* Deputy Leader: the scene slides sideways; six contributions arrive in order.  */

function GridItem({
  lp,
  from,
  index,
  children,
}: {
  lp: MotionValue<number>;
  from: number;
  index: number;
  children: string;
}) {
  const opacity = useTransform(lp, [from, from + 0.08], [0, 1]);
  const y = useTransform(lp, [from, from + 0.08], [12, 0]);
  const rule = useTransform(lp, [from, from + 0.1], [0, 1]);
  return (
    <motion.li className="relative pt-3" style={{ opacity, y }}>
      <span aria-hidden="true" className="absolute left-0 right-0 top-0 h-px bg-ink/10" />
      <motion.span
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px origin-left bg-primary"
        style={{ scaleX: rule }}
      />
      <span aria-hidden="true" className="font-display text-[11px] font-semibold text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className={cn("mt-1", itemText)}>{children}</p>
    </motion.li>
  );
}

export function LinhScene({ member, lp }: SceneProps) {
  const clip = useTransform(lp, STOPS, [inset(0, 0, 0, 100), FULL, FULL, inset(0, 100, 0, 0)]);
  const scale = useTransform(lp, [-0.1, 0.2, 1.1], [1.3, 1.14, 1.12]);
  const x = useTransform(lp, [-0.1, 1.1], ["4%", "-4%"]);
  const panelX = useTransform(lp, [-0.1, 0.24, 1.1], [220, -22, -60]);
  const infoX = useTransform(lp, [-0.1, 0.2, 0.84, 1.1], [-60, 0, 0, -90]);
  const ghostX = useTransform(lp, [-0.1, 1.1], [60, -60]);

  return (
    <SceneRoot lp={lp}>
      <div className={cn(grid, "grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-12 xl:gap-x-20")}>
        <motion.div className="relative" style={{ x: infoX }}>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 -top-24 select-none font-display text-[clamp(9rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-ink opacity-[0.045]"
            style={{ x: ghostX }}
          >
            02
          </motion.span>
          <Beat lp={lp} from={0.08} dx={-20} dy={0} className="relative">
            <RoleLabel>{member.role}</RoleLabel>
          </Beat>
          <h3 className="relative mt-4 font-display text-[clamp(2rem,3.7vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink">
            <SplitText text={member.name} progress={lp} start={0.06} end={0.3} by="word" />
          </h3>
          <Beat lp={lp} from={0.22} dy={14} className="relative">
            <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.7] text-deep/80">{member.summary}</p>
          </Beat>
          <ul className="relative mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
            {member.responsibilities.map((item, i) => (
              <GridItem key={item} lp={lp} from={0.26 + i * 0.085} index={i}>
                {item}
              </GridItem>
            ))}
          </ul>
        </motion.div>

        <Depth strength={-10} className={portraitCell}>
          <div className={portraitBox} style={portraitBoxStyle}>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-[22px] bg-aqua-soft"
              style={{ x: panelX, y: 22 }}
            />
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-[22px] bg-mist"
              style={{ clipPath: clip }}
            >
              <PortraitImage member={member} scale={scale} x={x} />
            </motion.div>
          </div>
        </Depth>
      </div>
    </SceneRoot>
  );
}

/* ------------------------------------ Nhân ---------------------------------- */
/* Co-founder: a scan line wipes the portrait open; rules close in on each item. */

function CompareRow({
  lp,
  from,
  index,
  children,
}: {
  lp: MotionValue<number>;
  from: number;
  index: number;
  children: string;
}) {
  const opacity = useTransform(lp, [from, from + 0.07], [0, 1]);
  const close = useTransform(lp, [from, from + 0.12], [0, 1]);
  return (
    <motion.li className="relative py-3 pr-2" style={{ opacity }}>
      <span aria-hidden="true" className="mr-3 font-display text-[11px] font-semibold text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={itemText}>{children}</span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
        <motion.span
          className="absolute inset-y-0 left-0 w-1/2 origin-left bg-primary/60"
          style={{ scaleX: close }}
        />
        <motion.span
          className="absolute inset-y-0 right-0 w-1/2 origin-right bg-primary/60"
          style={{ scaleX: close }}
        />
      </span>
    </motion.li>
  );
}

export function NhanScene({ member, lp }: SceneProps) {
  const clip = useTransform(lp, STOPS, [inset(0, 100, 0, 0), FULL, FULL, inset(0, 0, 0, 100)]);
  const scale = useTransform(lp, [-0.1, 0.2, 1.1], [1.28, 1.14, 1.1]);
  const x = useTransform(lp, [-0.1, 1.1], ["-3.5%", "3.5%"]);
  const scanX = useTransform(lp, [-0.1, 0.2, 0.3], ["-100%", "0%", "0%"]);
  const scanOpacity = useTransform(lp, [-0.1, -0.06, 0.16, 0.22], [0, 1, 1, 0]);
  const lens = useTransform(lp, [0.22, 0.42], [0.4, 1]);
  const lensOpacity = useTransform(lp, [0.22, 0.34], [0, 1]);
  const ghostY = useTransform(lp, [-0.1, 1.1], [70, -70]);

  return (
    <SceneRoot lp={lp}>
      <div className={cn(grid, "grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-12 xl:gap-x-20")}>
        <Depth strength={11} className={portraitCell}>
          <div className={portraitBox} style={portraitBoxStyle}>
            <motion.span
              aria-hidden="true"
              className="absolute -right-[18%] -top-[9%] select-none font-display text-[clamp(9rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-ink opacity-[0.05]"
              style={{ y: ghostY }}
            >
              03
            </motion.span>
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-[22px] bg-mist"
              style={{ clipPath: clip }}
            >
              <PortraitImage member={member} scale={scale} x={x} />
            </motion.div>
            <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[22px]">
              <motion.span
                className="absolute inset-y-0 left-0 w-full border-r border-primary bg-gradient-to-r from-transparent to-primary/15"
                style={{ x: scanX, opacity: scanOpacity }}
              />
            </span>
            <motion.span
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 h-24 w-24 rounded-full border border-primary/70"
              style={{ scale: lens, opacity: lensOpacity }}
            >
              <span className="absolute inset-3 rounded-full border border-primary/30" />
            </motion.span>
          </div>
        </Depth>

        <div className="relative">
          <Beat lp={lp} from={0.1} dy={0} dx={20}>
            <RoleLabel>{member.role}</RoleLabel>
          </Beat>
          <h3 className="mt-4 font-display text-[clamp(2.1rem,4vw,3.7rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink">
            <SplitText text={member.name} progress={lp} start={0.08} end={0.36} by="char" />
          </h3>
          <Beat lp={lp} from={0.3} dy={14}>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.7] text-deep/80">{member.summary}</p>
          </Beat>
          <ul className="mt-6">
            {member.responsibilities.map((item, i) => (
              <CompareRow key={item} lp={lp} from={0.38 + i * 0.1} index={i}>
                {item}
              </CompareRow>
            ))}
          </ul>
        </div>
      </div>
    </SceneRoot>
  );
}

/* ------------------------------------ Uyên ---------------------------------- */
/* Co-founder: layered pages, a story thread and a sentence told word by word.   */

export function UyenScene({ member, lp }: SceneProps) {
  const box = useRef<HTMLDivElement>(null);
  const { width: w, height: h } = useElementSize(box);

  const clip = useTransform(lp, STOPS, [inset(0, 0, 100, 0), FULL, FULL, inset(100, 0, 0, 0)]);
  const scale = useTransform(lp, [-0.1, 0.2, 1.1], [1.3, 1.14, 1.1]);
  const y = useTransform(lp, [-0.1, 1.1], ["-3.3%", "3.3%"]);
  const page1X = useTransform(lp, [-0.1, 0.22, 1.1], [160, -16, -26]);
  const page2X = useTransform(lp, [-0.1, 0.28, 1.1], [260, -32, -52]);
  const thread = useTransform(lp, [0.1, 0.7], [0, 1]);
  const ghostY = useTransform(lp, [-0.1, 1.1], [80, -80]);

  const path =
    w && h
      ? `M ${w * 0.66} ${h * 0.84} C ${w * 0.5} ${h * 0.98}, ${w * 0.36} ${h * 0.7}, ${w * 0.22} ${h * 0.86} S ${w * 0.02} ${h * 0.86}, ${w * 0.02} ${h * 0.5}`
      : "";

  return (
    <SceneRoot lp={lp}>
      <div ref={box} className="absolute inset-0">
        {path && (
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" width={w} height={h}>
            <motion.path
              d={path}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={1.25}
              strokeOpacity={0.7}
              strokeLinecap="round"
              style={{ pathLength: thread }}
            />
          </svg>
        )}
      </div>

      <div className={cn(grid, "relative grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-12 xl:gap-x-20")}>
        <div className="relative">
          <Beat lp={lp} from={0.1} dx={-20} dy={0}>
            <RoleLabel>{member.role}</RoleLabel>
          </Beat>
          <h3 className="mt-4 font-display text-[clamp(2rem,3.7vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink">
            <SplitText text={member.name} progress={lp} start={0.06} end={0.3} by="word" />
          </h3>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.7] text-deep/80">
            <SplitText text={member.summary} progress={lp} start={0.2} end={0.5} by="word" />
          </p>
          <ul className="mt-6 space-y-2">
            {member.responsibilities.map((item, i) => (
              <Beat
                key={item}
                as="li"
                lp={lp}
                from={0.44 + i * 0.07}
                dx={36}
                dy={0}
                className={cn("flex gap-3", itemText)}
              >
                <Dot />
                {item}
              </Beat>
            ))}
          </ul>
        </div>

        <Depth strength={-11} className={portraitCell}>
          <div className={portraitBox} style={portraitBoxStyle}>
            <motion.span
              aria-hidden="true"
              className="absolute -left-[22%] -top-[9%] select-none font-display text-[clamp(9rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-ink opacity-[0.05]"
              style={{ y: ghostY }}
            >
              04
            </motion.span>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-[22px] border border-primary/20 bg-aqua-soft/70"
              style={{ x: page2X, y: 40 }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-[22px] border border-primary/35 bg-white"
              style={{ x: page1X, y: 20 }}
            />
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-[22px] bg-mist"
              style={{ clipPath: clip }}
            >
              <PortraitImage member={member} scale={scale} y={y} />
            </motion.div>
          </div>
        </Depth>
      </div>
    </SceneRoot>
  );
}

export const SCENES = [DuyScene, LinhScene, NhanScene, UyenScene] as const;
