import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { Magnetic } from "@/components/motion/Magnetic";
import { usePageTitle } from "@/hooks/usePageTitle";
import { OurPeople } from "@/components/team/OurPeople";
import type { Member } from "@/components/team/types";
import heroWatch from "@/assets/safekid/hero-watch.webp";
import duy from "@/assets/digibabi/duy.webp";
import linh from "@/assets/digibabi/linh.webp";
import nhan from "@/assets/digibabi/nhan.webp";
import uyen from "@/assets/digibabi/uyen.webp";
import { conceptCapabilities, conceptNote } from "@/data/zodiac";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Team data as confirmed by DigiBabi. Keep roles and responsibilities exactly as
 * listed here; Duy is Leader and Linh is Deputy Leader.
 */
const TEAM: Member[] = [
  {
    name: "Nguyễn Trường Duy",
    role: "Leader · Co-founder",
    summary:
      "Leads the journey from idea to product, connecting design, user experience and development direction.",
    responsibilities: [
      "Development",
      "Design",
      "UX/UI creation",
      "Finding and working with OEM suppliers",
    ],
    image: duy,
  },
  {
    name: "Huỳnh Kiều Ngọc Linh",
    role: "Deputy Leader · Co-founder",
    summary: "Connects ideas, tests solutions and weighs how feasible the business model is.",
    responsibilities: [
      "Tester",
      "Helped shape the original idea, challenging and improving solutions",
      "Competitor research",
      "Revenue model proposals",
      "Marketing scenarios",
      "Cost calculation",
    ],
    image: linh,
  },
  {
    name: "Tô Đỗ Trọng Nhân",
    role: "Co-founder",
    summary:
      "Organises information and market analysis so the team can make informed decisions.",
    responsibilities: [
      "Storytelling",
      "In-depth competitor research",
      "Comparison tables",
      "Ideas and feedback for the project",
    ],
    image: nhan,
  },
  {
    name: "Nguyễn Thị Phương Uyên",
    role: "Co-founder",
    summary:
      "Helps shape how the project's story is told, and contributes to research and refining the solution.",
    responsibilities: [
      "Storytelling",
      "In-depth competitor research",
      "Comparison tables",
      "Ideas and feedback for the project",
    ],
    image: uyen,
  },
];

const JOURNEY = [
  {
    number: "01",
    verb: "Listen",
    title: "Understanding the need",
    body: "It began with everyday moments: the walk to a friend's home, the first trip around the block. We looked at what children and families need as a child's world starts to grow.",
  },
  {
    number: "02",
    verb: "Explore",
    title: "Exploring solutions",
    body: "We explored how a watch and a parent app could give children room while keeping families connected: location, calling, safe zones and a simple way to ask for help.",
  },
  {
    number: "03",
    verb: "Build",
    title: "Building the prototype",
    body: "The ideas became this concept: twelve Vietnamese Zodiac editions, an interactive site, and demo screens such as SOS and a scripted support assistant. Everything is a prototype; nothing is live.",
  },
];

function JourneyStep({
  step,
  index,
  progress,
  reduce,
}: {
  step: (typeof JOURNEY)[number];
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const at = index / JOURNEY.length;
  const active = useTransform(progress, [at - 0.08, at + 0.05], [0, 1]);
  const textOpacity = useTransform(active, [0, 1], [0.38, 1]);
  const titleY = useTransform(active, [0, 1], [10, 0]);
  const ghostOpacity = useTransform(active, [0, 1], [0.03, 0.08]);

  return (
    <li className="relative pb-14 pl-10 last:pb-0 sm:pb-20 sm:pl-14 lg:min-h-[38vh]">
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 flex h-[15px] w-[15px] -translate-x-1/2 items-center justify-center rounded-full border border-primary/40 bg-white"
      >
        <motion.span
          className="h-[7px] w-[7px] rounded-full bg-primary"
          style={{ opacity: reduce ? 1 : active, scale: reduce ? 1 : active }}
        />
      </span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 select-none font-display text-[clamp(4.5rem,9vw,7.5rem)] font-semibold leading-none tracking-[-0.06em] text-ink"
        style={{ opacity: reduce ? 0.06 : ghostOpacity }}
      >
        {step.number}
      </motion.span>
      <motion.div className="relative" style={reduce ? undefined : { opacity: textOpacity }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-deep/80">
          <span className="text-primary">{step.number}</span> · {step.verb}
        </p>
        <motion.h3
          className="mt-3 font-display text-[clamp(1.35rem,2.2vw,1.8rem)] font-medium tracking-[-0.03em] text-ink"
          style={reduce ? undefined : { y: titleY }}
        >
          {step.title}
        </motion.h3>
        <p className="mt-3 max-w-[48ch] text-[14.5px] leading-[1.75] text-deep/75">{step.body}</p>
      </motion.div>
    </li>
  );
}

/** The page's one scroll-linked moment: a line that draws itself as each step is reached. */
function Journey() {
  const reduce = useReducedMotion() ?? false;
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 62%", "end 58%"],
  });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="our-journey" className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Our journey
            </p>
          </Reveal>
          <Reveal variant="clip" delay={0.05}>
            <h2 className="display display-lg mt-6">
              From a question
              <br />
              to a <span className="text-primary">prototype.</span>
            </h2>
          </Reveal>
          <Reveal variant="soft" delay={0.12}>
            <p className="lede mt-6 max-w-[40ch]">
              Three stages, told as they happened: listening first, exploring next, then making
              something people can actually try.
            </p>
          </Reveal>
        </div>

        <ol ref={timelineRef} className="relative ml-2 sm:ml-3">
          <span aria-hidden="true" className="absolute bottom-0 left-0 top-2 w-px bg-ink/10" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-2 w-px origin-top bg-primary"
            style={{ scaleY: reduce ? 1 : line }}
          />
          {JOURNEY.map((step, index) => (
            <JourneyStep
              key={step.number}
              step={step}
              index={index}
              progress={scrollYProgress}
              reduce={reduce}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function Featured() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const y = useTransform(smooth, [0, 1], [28, -28]);
  const rotate = useTransform(smooth, [0, 1], [-3, 3]);
  const glowY = useTransform(smooth, [0, 1], [-22, 22]);
  const ringY = useTransform(smooth, [0, 1], [14, -14]);

  return (
    <section ref={ref} className="bg-white py-20 sm:py-24">
      <div className="shell">
        <Reveal variant="soft">
          <div className="relative overflow-hidden rounded-[32px] bg-night px-6 py-14 text-white sm:px-10 sm:py-16 lg:rounded-[44px] lg:px-16 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-primary/12 blur-[100px]"
            />
            <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <p className="eyebrow eyebrow-inverse">
                  <span className="eyebrow-line" />
                  Featured project
                </p>
                <h2 className="display display-lg mt-6 text-white">
                  SafeKid,
                  <br />
                  <span className="text-primary">our first concept.</span>
                </h2>
                <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.75] text-white/70">
                  A child-focused smartwatch and parent app, shaped by the ideas in this story and
                  dressed in twelve characters inspired by the Vietnamese Zodiac.
                </p>

                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Concept features · not live
                </p>
                <Stagger className="mt-3" gap={0.06}>
                  <ul className="flex flex-wrap gap-2">
                    {conceptCapabilities.map((item) => (
                      <motion.li
                        key={item}
                        variants={chipVariants}
                        className="rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[12px] text-white/75"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </Stagger>

                <p className="mt-6 max-w-[52ch] text-[12.5px] leading-relaxed text-white/55">
                  {conceptNote}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Link
                      to="/zodiac"
                      className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[13.5px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-soft btn-motion btn-motion-light"
                    >
                      Meet the collection
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Magnetic>
                  <Link
                    to="/sos"
                    className="press inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-[13.5px] font-medium text-white/85 transition-colors hover:border-primary/50 hover:text-white"
                  >
                    Try the SOS demo
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[6%] rounded-full bg-primary/15 blur-[60px]"
                  style={reduce ? undefined : { y: glowY }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={reduce ? undefined : { y: ringY }}
                >
                  <div className="absolute inset-[10%] rounded-full border border-white/10" />
                  <div className="animate-sk-spin absolute inset-[20%] rounded-full border border-dashed border-primary/25" />
                </motion.div>
                <motion.img
                  src={heroWatch}
                  alt="SafeKid smartwatch concept"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.45)]"
                  style={reduce ? undefined : { y, rotate }}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** A turquoise accent line that draws itself once as the closing scrolls into view. */
function AccentLine() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="mx-auto mt-8 block h-px w-28 origin-center bg-primary"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease }}
    />
  );
}

export default function About() {
  usePageTitle(
    "About DigiBabi | SafeKid",
    "DigiBabi is the team behind SafeKid, a concept about helping families stay close while children take their first independent steps."
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="A story by DigiBabi"
        title={
          <>
            More room
            <br />
            to <span className="text-primary">grow.</span>
          </>
        }
        intro="DigiBabi is a team exploring how technology can help families stay close while children take their first steps on their own."
        actions={
          <Link
            to="/zodiac"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
          >
            Explore the Zodiac collection
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
        meta="Concept site · Developed by DigiBabi"
        art={
          <div className="relative mx-auto aspect-square w-full max-w-[430px]">
            <div aria-hidden="true" className="stage-glow absolute inset-[3%] rounded-full" />
            <div aria-hidden="true" className="absolute inset-[13%] rounded-full border border-primary/20" />
            <img
              src={heroWatch}
              alt="SafeKid Mouse edition smartwatch concept"
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_40px_70px_rgba(16,42,56,0.15)]"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-deep/65 backdrop-blur">
              SafeKid / Vietnamese Zodiac
            </span>
          </div>
        }
      />

      {/* Philosophy */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                Our philosophy
              </p>
            </Reveal>
            <Reveal variant="clip" delay={0.05}>
              <h2 className="display display-lg mt-6">
                Growing up.
                <br />
                Staying <span className="text-primary">connected.</span>
              </h2>
            </Reveal>
            <Reveal variant="soft" delay={0.12}>
              <div className="mt-10 flex items-center gap-4 rounded-[24px] border border-ink/10 bg-mist/60 p-4">
                <img
                  src={heroWatch}
                  alt=""
                  aria-hidden="true"
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 object-contain"
                  loading="lazy"
                />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-primary">A little watch</p>
                  <p className="mt-1 font-display text-[15px] font-medium tracking-[-0.02em] text-ink">
                    A lot of meaning.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            <Reveal variant="soft">
              <p className="font-display text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-[1.45] tracking-[-0.025em] text-ink">
                The walk to a friend's home. The first trip around the block. Small moments can feel
                like big beginnings for children and parents alike.
              </p>
            </Reveal>
            <Reveal variant="soft" delay={0.06}>
              <p className="lede">
                We build around two ideas: giving children room to explore, and giving families a
                calmer way to stay close. Technology for family safety should support that
                connection, not replace it.
              </p>
            </Reveal>
            <Reveal variant="soft" delay={0.12}>
              <p className="lede">
                SafeKid is where we explore it: a child-focused watch concept with playful
                characters inspired by the Vietnamese Zodiac. The Cat sits where the Rabbit would
                traditionally be, a small detail that makes the twelve feel distinctly Vietnamese.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our people: cinematic scroll story, see components/team */}
      <OurPeople members={TEAM} />

      <Journey />

      {/* Purpose */}
      <section className="bg-mist py-20 sm:py-24 lg:py-28">
        <div className="shell-tight text-center">
          <Reveal>
            <p className="eyebrow justify-center">
              <span className="eyebrow-line" />
              Our purpose
              <span className="eyebrow-line" />
            </p>
          </Reveal>
          <Reveal variant="clip" delay={0.05}>
            <h2 className="display display-lg mx-auto mt-6 max-w-[18ch]">
              Room for children.
              <br />
              <span className="text-primary">Calm for families.</span>
            </h2>
          </Reveal>
          <Reveal variant="soft" delay={0.12}>
            <p className="lede mx-auto mt-6 max-w-[52ch]">
              We want to explore how technology can give children space to grow and give families a
              gentler way to stay in touch. SafeKid is a design exploration of that goal, not a
              claim about a shipping product.
            </p>
          </Reveal>
        </div>
      </section>

      <Featured />

      {/* Closing */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="shell-tight text-center">
          <Reveal>
            <p className="eyebrow justify-center">
              <span className="eyebrow-line" />
              Still on the way
              <span className="eyebrow-line" />
            </p>
          </Reveal>
          <Reveal variant="clip" delay={0.05}>
            <h2 className="display display-lg mx-auto mt-6 max-w-[16ch]">
              The journey
              <br />
              is <span className="text-primary">still going.</span>
            </h2>
          </Reveal>
          <AccentLine />
          <Reveal variant="soft" delay={0.12}>
            <p className="lede mx-auto mt-6 max-w-[44ch]">
              This is one chapter. Tell us what you think of the concept and which edition feels
              like your little explorer.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <Link
                  to="/zodiac"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
                >
                  Meet the collection
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Magnetic>
              <Link
                to="/contact"
                className="press inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-[13.5px] font-medium text-ink transition-colors hover:bg-white"
              >
                Talk to the team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
