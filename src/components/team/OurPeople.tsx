import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Reveal } from "@/components/site/Reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SplitText } from "./kinetic";
import { TeamStack } from "./TeamStack";
import { TeamStage } from "./TeamStage";
import type { Member } from "./types";

/**
 * Opening: a kinetic heading and a turquoise line that draws itself downward. On the desktop
 * stage that line is the one that later splits into four threads; in the sequential layout the
 * spine of the list takes over instead, so no line is drawn here.
 */
function Opening({ withLine }: { withLine: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const o = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 });

  const ledeOpacity = useTransform(o, [0.25, 0.55], [0, 1]);
  const ledeY = useTransform(o, [0.25, 0.55], [18, 0]);
  const line = useTransform(o, [0.45, 1], [0, 1]);

  return (
    <div ref={ref} className="shell relative pt-20 sm:pt-24 lg:pt-28">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Our people
            </p>
          </Reveal>
          <h2 id="our-people-title" className="display display-lg mt-5">
            <SplitText
              text={"The people behind\nthe concept."}
              progress={o}
              start={0}
              end={0.6}
              accent={["concept."]}
            />
          </h2>
        </div>
        <motion.p
          className="lede max-w-[40ch]"
          style={reduce ? undefined : { opacity: ledeOpacity, y: ledeY }}
        >
          Four co-founders. One leads the way from idea to product; together they research, test,
          design and tell the story of SafeKid.
        </motion.p>
      </div>

      {withLine ? (
        <div className="relative mt-10" style={{ height: "clamp(110px, 20svh, 220px)" }}>
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 top-0 w-px origin-top bg-primary"
            style={{ scaleY: reduce ? 1 : line }}
          />
        </div>
      ) : (
        <div className="h-10 sm:h-12" />
      )}
    </div>
  );
}

/**
 * Our People: "Four minds. One direction."
 * Desktop → sticky scroll-driven stage. Mobile, short screens and reduced motion → sequential
 * profiles. Both render the same confirmed team data passed in by the page.
 */
export function OurPeople({ members }: { members: Member[] }) {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const stage = wide && !reduce;

  return (
    <section aria-labelledby="our-people-title" className="relative bg-mist">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent"
      />
      <Opening withLine={stage} />
      {stage ? <TeamStage members={members} /> : <TeamStack members={members} />}
    </section>
  );
}
