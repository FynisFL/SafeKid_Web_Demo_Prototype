import { MEDIA } from "@/lib/breakpoints";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import heroWatch from "@/assets/safekid/editions/rat.webp";
import { sosDisclosure } from "@/data/zodiac";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { DURATION, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Chapter = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  watchState: string;
  appState: string;
};

const CHAPTERS: Chapter[] = [
  {
    id: "separation",
    kicker: "01 / The first step",
    title: "Room to explore.",
    body: "Growing up starts with a few more steps taken on their own. The space between you is where confidence begins.",
    watchState: "Heading out",
    appState: "Waiting for a check-in",
  },
  {
    id: "arrival",
    kicker: "02 / The familiar route",
    title: "Made it to school.",
    body: "The watch reaches the school zone. A small signal begins its trip to the Parent App.",
    watchState: "Arrived at school",
    appState: "Check-in in transit",
  },
  {
    id: "connection",
    kicker: "03 / The check-in",
    title: "One shared moment.",
    body: "The Parent App shows the arrival as a simple update. A little reassurance, even from afar.",
    watchState: "Check-in sent",
    appState: "Arrived at school",
  },
];

const ease = EASE;

function MiniMap({ chapter, height = 164 }: { chapter: number; height?: number }) {
  const reduce = useReducedMotion();
  const moving = chapter >= 1;

  return (
    <div className="relative overflow-hidden rounded-[18px] bg-mist" style={{ height }}>
      <svg viewBox="0 0 320 168" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="320" height="168" fill="hsl(var(--mist))" />
        <g stroke="hsl(var(--deep) / 0.10)" strokeWidth="1">
          <path d="M-10 40 H330" />
          <path d="M-10 112 H330" />
          <path d="M64 -10 V178" />
          <path d="M212 -10 V178" />
        </g>
        <g stroke="hsl(var(--deep) / 0.06)" strokeWidth="6" strokeLinecap="round">
          <path d="M-10 76 C 70 76, 90 24, 160 24 S 250 100, 330 100" fill="none" />
        </g>
        <g stroke="hsl(var(--deep) / 0.13)" strokeWidth="1.4" fill="none">
          <path d="M-10 76 C 70 76, 90 24, 160 24 S 250 100, 330 100" />
        </g>
        {moving && (
          <motion.path
            d="M64 132 C 110 132, 96 76, 148 76 S 210 58, 232 44"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0 : DURATION.slow, ease }}
          />
        )}
      </svg>

      <div
        className={cn(
          "absolute left-[64px] top-[132px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500",
          chapter === 0 ? "opacity-40" : "opacity-100"
        )}
      >
        <span className="block h-2.5 w-2.5 rounded-full border-2 border-white bg-deep shadow" />
      </div>

      <motion.div
        className="absolute"
        initial={false}
        animate={{ left: moving ? 232 : 148, top: moving ? 44 : 76 }}
        transition={{ duration: reduce ? 0 : DURATION.slow, ease }}
      >
        <span className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <span className="absolute h-8 w-8 rounded-full bg-primary/25" />
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <MapPin className="h-3 w-3" aria-hidden="true" />
          </span>
        </span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.span
          key={chapter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "absolute rounded-full border px-2.5 py-1 text-[10px] font-medium",
            moving
              ? "right-2 top-[12px] border-primary/25 bg-white text-ink"
              : "left-[18px] top-[18px] border-ink/10 bg-white/80 text-deep/60"
          )}
        >
          {chapter === 2 ? "School zone" : moving ? "Check-in in transit" : "No check-in yet"}
        </motion.span>
      </AnimatePresence>

      {chapter === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-white/95 px-3 py-2"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          <span className="text-[11px] font-medium text-ink">School check-in received</span>
        </motion.div>
      )}
    </div>
  );
}

function ParentApp({ chapter, compact = false }: { chapter: number; compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative w-full rounded-[26px] border border-white/70 bg-white/95 p-3.5 text-left shadow-[0_36px_90px_-45px_rgba(8,30,40,0.7)]",
        compact && "p-3"
      )}
    >
      <div className="flex items-center gap-2.5 px-1 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-night font-display text-[13px] font-semibold text-white">
          S
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[12.5px] font-semibold tracking-tight text-ink">
            SafeKid family
          </p>
          <p className="text-[9.5px] uppercase tracking-[0.14em] text-deep/60">
            Illustrative app screen
          </p>
        </div>
        <span
          className={cn("h-1.5 w-1.5 rounded-full", chapter >= 1 ? "bg-primary" : "bg-deep/20")}
          aria-hidden="true"
        />
      </div>

      <MiniMap chapter={chapter} height={compact ? 146 : 164} />

      <div className="mt-2.5 flex items-center gap-2.5 rounded-[16px] border border-ink/[0.07] px-3 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-[12px] font-semibold text-primary-foreground">
          S
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-[12px] font-medium text-ink">Little explorer</p>
          <p className="break-words text-[10px] text-muted-foreground">{CHAPTERS[chapter].appState}</p>
        </div>
        <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:flex">
          <Phone className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>



      {!compact && (
        <p className="mt-2.5 px-1 text-[8.5px] leading-snug text-deep/50">
          Illustrative screen. No live location, pairing or call.
        </p>
      )}
    </div>
  );
}

function WatchPanel({ chapter, className }: { chapter: number; className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <span
        aria-hidden="true"
        className="absolute inset-[6%] rounded-full bg-primary/10 blur-2xl transition-opacity duration-700"
        style={{ opacity: chapter >= 1 ? 0.9 : 0.35 }}
      />
      <img
        src={heroWatch}
        alt="SafeKid smartwatch concept, Mouse edition"
        className="relative h-full w-auto max-w-full select-none object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)]"
        draggable="false"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-x-0 top-[15%] flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            className="flex max-w-full items-center gap-1.5 rounded-full border border-white/15 bg-night/90 px-2 py-1.5 text-center backdrop-blur sm:gap-2 sm:px-3"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-[9px] font-medium uppercase tracking-[0.09em] text-white/85 sm:text-[9.5px] sm:tracking-[0.14em]">
              {CHAPTERS[chapter].watchState}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChapterCopy({ chapter, direction }: { chapter: number; direction: 1 | -1 }) {
  const item = CHAPTERS[chapter];
  const slide = {
    enter: (dir: number) => ({ opacity: 0, y: dir * 20 }),
    center: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
    exit: (dir: number) => ({ opacity: 0, y: dir * -14, transition: { duration: 0.22 } }),
  };
  // Each line arrives a beat after the one above it.
  const line = (delay: number) => ({
    initial: { opacity: 0, y: direction * 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease, delay },
  });

  return (
    <div className="min-h-[176px]">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={item.id}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <motion.p
            {...line(0.04)}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"
          >
            {item.kicker}
          </motion.p>
          <motion.h3
            {...line(0.1)}
            className="mt-4 font-display text-[clamp(1.9rem,2.7vw,2.7rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white"
          >
            {item.title}
          </motion.h3>
          <motion.p {...line(0.18)} className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-white/55">
            {item.body}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StaticStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-night py-20">
      <div className="shell">
        <p className="eyebrow eyebrow-inverse">
          <span className="eyebrow-line" />
          The SafeKid story
        </p>
        <h2 className="display display-lg mt-6 max-w-[18ch] text-white">
          A little distance. A lasting connection.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CHAPTERS.map((chapter, index) => (
            <article
              key={chapter.id}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {chapter.kicker}
              </p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-[-0.04em] text-white">
                {chapter.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">{chapter.body}</p>
              <div className="mt-6 flex flex-col items-center gap-4">
                <WatchPanel chapter={index} className="h-[250px] w-[200px] shrink-0" />
                <div className="w-full max-w-[330px]">
                  <ParentApp chapter={index} compact />
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-[11px] text-white/55">
          Illustrative concept. No watch is connected and no live data is shown. {sosDisclosure}
        </p>
      </div>
    </section>
  );
}

function StoryBeat({ chapter, index, active, direction }: { chapter: Chapter; index: number; active: boolean; direction: number }) {
  return (
    <article className="relative border-t border-white/10 pt-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          {chapter.kicker}
        </p>
        <span className="text-[10px] tabular-nums text-white/45">0{index + 1} / 0{CHAPTERS.length}</span>
      </div>
      <h3 className="mt-4 font-display text-[clamp(1.8rem,7vw,2.2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
        {chapter.title}
      </h3>
      <p className="mt-3 max-w-[40ch] text-[13.5px] leading-relaxed text-white/55">{chapter.body}</p>
      <div className="mt-7 grid min-w-0 items-center gap-3 min-[390px]:grid-cols-[minmax(0,0.40fr)_minmax(0,0.60fr)] sm:mx-auto sm:max-w-[590px] sm:gap-5">
        <motion.div initial={false} animate={{ x: active ? 0 : 12 * direction }} transition={{ duration: DURATION.quick, ease: EASE }}>
          <WatchPanel chapter={index} className="mx-auto h-[clamp(154px,48vw,260px)] w-full max-w-[240px]" />
        </motion.div>
        <motion.div initial={false} animate={{ x: active ? 0 : 18 * direction }} transition={{ duration: DURATION.base, ease: EASE }} className="relative mx-auto w-full min-w-0 max-w-[310px]">
          <span
            aria-hidden="true"
            className="absolute -left-2 hidden min-[390px]:block top-1/2 h-px w-2 bg-primary/55 sm:-left-5 sm:w-5"
          />
          <ParentApp chapter={index} compact />
        </motion.div>
      </div>
    </article>
  );
}

function StoryCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [selection, setSelection] = useState({ index: 0, direction: 1 });

  useEffect(() => {
    if (!api) return;
    const update = () => {
      const index = api.selectedScrollSnap();
      setSelection((current) => current.index === index ? current : {
        index,
        direction: index > current.index ? 1 : -1,
      });
    };
    update();
    api.on("select", update).on("reInit", update);
    return () => { api.off("select", update).off("reInit", update); };
  }, [api]);

  const buttonClass = "static h-11 w-11 translate-y-0 border-white/25 bg-white/10 text-white hover:bg-white hover:text-ink";

  return (
    <Carousel setApi={setApi} opts={{ watchFocus: false }} aria-label="SafeKid story chapters" className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 gap-1">
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              aria-label={`Chapter ${index + 1}: ${chapter.title} (${String(index + 1).padStart(2, "0")})`}
              aria-current={selection.index === index ? "step" : undefined}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "size-11 rounded-full text-[11px] font-semibold tabular-nums",
                selection.index === index ? "bg-primary text-ink" : "bg-white/10 text-white"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-1">
          <CarouselPrevious className={buttonClass} aria-label="Previous story chapter" />
          <CarouselNext className={buttonClass} aria-label="Next story chapter" />
        </div>
      </div>
      <span className="sr-only" aria-live="polite">Chapter {selection.index + 1} of {CHAPTERS.length}</span>
      <CarouselContent>
        {CHAPTERS.map((chapter, index) => (
          <CarouselItem key={chapter.id} aria-hidden={index !== selection.index}>
            <StoryBeat chapter={chapter} index={index} direction={selection.direction} active={index === selection.index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export function StorySequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const tablet = useMediaQuery(MEDIA.tabletStage);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const activeRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(value * CHAPTERS.length)));
    if (next === activeRef.current) return;
    setDirection(next > activeRef.current ? 1 : -1);
    activeRef.current = next;
    setActive(next);
  });

  // The top edge starts rounded and flattens as the stage pins, like a sheet settling into place.
  const topRadius = useTransform(scrollYProgress, [0, 0.06], [48, 0]);

  const watchX = useTransform(progress, [0, 1], [-26, 0]);
  const appX = useTransform(progress, [0, 1], [46, 0]);
  const appScale = useTransform(progress, [0, 0.6, 1], [0.88, 0.97, 1]);

  function goTo(index: number) {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const sticky = section.firstElementChild;
    const scrollable = section.offsetHeight - (sticky?.clientHeight || window.innerHeight);
    window.scrollTo({
      top: top + scrollable * ((index + 0.5) / CHAPTERS.length),
      behavior: "smooth",
    });
  }

  if (reduce) return <StaticStory />;

  return (
    <div id="story" className="lg:bg-mist">
      <motion.section
        ref={sectionRef}
        className="relative hidden bg-[radial-gradient(ellipse_at_50%_0%,#19404a_0%,#0b2531_34%,#0a1924_75%)] desktop-stage:block"
        style={{
          height: "265svh",
          borderTopLeftRadius: topRadius,
          borderTopRightRadius: topRadius,
        }}
        aria-label="The SafeKid story: from the child's watch to the parent's app"
      >
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[calc(88px+var(--safe-top))]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/4 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.11),transparent_72%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.08),transparent_72%)]"
          />

          <div className="shell relative flex items-center justify-between border-b border-white/10 py-4">
            <p className="eyebrow eyebrow-inverse">
              <span className="eyebrow-line" />
              The SafeKid story
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55">
              <span className="tabular-nums text-white">0{active + 1}</span>
              <span className="h-px w-10 bg-white/20" />
              <span className="tabular-nums">0{CHAPTERS.length}</span>
            </div>
          </div>

          <div className="shell relative grid flex-1 items-center gap-8 py-6 lg:grid-cols-[0.62fr_1.38fr] xl:gap-10">
            <div className="max-w-[340px]">
              <ChapterCopy chapter={active} direction={direction} />
              <Link
                to="/app"
                className="group mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-white/75 transition-colors hover:text-white"
              >
                Try the Parent App
                <ArrowUpRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative grid h-[clamp(320px,53svh,560px)] w-full grid-cols-[44%_12%_44%] items-center">
              <motion.div
                style={{ x: watchX }}
                className="col-start-1 flex h-full min-w-0 items-center justify-center"
              >
                <WatchPanel chapter={active} className="h-full w-full" />
              </motion.div>

              <motion.div
                style={{ x: appX, scale: appScale }}
                className="col-start-3 w-full min-w-0 justify-self-end"
              >
                <ParentApp chapter={active} compact />
              </motion.div>
            </div>
          </div>

          <div className="shell relative border-t border-white/10 py-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {CHAPTERS.map((chapter, index) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={active === index ? "step" : undefined}
                  aria-label={`Go to chapter ${index + 1}: ${chapter.title}`}
                  className="group text-left"
                >
                  <span className="relative block h-px w-full overflow-hidden bg-white/15">
                    <motion.span
                      className="absolute inset-y-0 left-0 w-full origin-left bg-primary"
                      initial={false}
                      animate={{
                        scaleX: active >= index ? 1 : 0,
                        opacity: active > index ? 0.35 : 1,
                      }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </span>
                  <span
                    className={cn(
                      "mt-2.5 block text-[9px] uppercase tracking-[0.16em] transition-colors sm:text-[9.5px]",
                      active === index ? "text-white" : "text-white/50 group-hover:text-white/60"
                    )}
                  >
                    0{index + 1} · {chapter.title}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-white/45">
              Illustrative concept. No watch is connected, no live location is shown, and no call is
              made. {sosDisclosure}
            </p>
          </div>
        </div>
      </motion.section>

      <section id="story-mobile" className="bg-[linear-gradient(180deg,#173b43,#0a1924_28%)] pb-16 lg:[@media(min-height:650px)]:hidden">
        <div className="shell pt-14">
          <p className="eyebrow eyebrow-inverse">
            <span className="eyebrow-line" />
            The SafeKid story
          </p>
          <h2 className="display display-lg mt-5 text-white">
            A little distance.
            <br />
            A lasting connection.
          </h2>
          <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-white/50">
            A product concept, imagined around the moments that help children grow. Three moments
            between the watch and the app.
          </p>
          {tablet ? (
            <div className="mt-9 grid gap-7">
              {CHAPTERS.map((chapter, index) => (
                <StoryBeat key={chapter.id} chapter={chapter} index={index} direction={1} active />
              ))}
            </div>
          ) : <StoryCarousel />}
          <Link to="/app" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">
            Try the Parent App <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="mt-9 text-[11px] leading-relaxed text-white/45">
            Illustrative concept. No watch is connected and no live data is shown.
          </p>
        </div>
      </section>
    </div>
  );
}
