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
  type MotionValue,
} from "motion/react";
import { ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import heroWatch from "@/assets/safekid/hero-watch.webp";
import { sosDisclosure } from "@/data/zodiac";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { DURATION, EASE } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";

type Chapter = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  watchState: string;
  appState: string;
  light: string;
};

const CHAPTERS: Chapter[] = [
  {
    id: "separation",
    kicker: "01 / The first step",
    title: "Room to explore.",
    body: "Growing up starts with a few more steps taken on their own. The space between you is where confidence begins.",
    watchState: "Heading out",
    appState: "Waiting for a check-in",
    light: "#123743",
  },
  {
    id: "signal",
    kicker: "02 / A way to reach you",
    title: "Close, even from afar.",
    body: "A small signal crosses the gap. On the watch, one familiar face. On the app, a moment of reassurance.",
    watchState: "Incoming call",
    appState: "Calling you",
    light: "#104655",
  },
  {
    id: "connection",
    kicker: "03 / Two perspectives",
    title: "One shared moment.",
    body: "Two screens describe the same walk: a child on their way, a parent following along. One story, seen from both sides.",
    watchState: "On my way",
    appState: "On the way home",
    light: "#163e56",
  },
  {
    id: "reassurance",
    kicker: "04 / What matters",
    title: "Independence, with connection.",
    body: "The walk ends. The connection doesn't. SafeKid is imagined around both halves of that feeling.",
    watchState: "Home",
    appState: "Arrived home",
    light: "#104a45",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function MiniMap({ chapter, height = 164 }: { chapter: number; height?: number }) {
  const moving = chapter >= 2;
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-[18px] bg-mist" style={{ height }}>
      <svg viewBox="0 0 320 168" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
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
            transition={{ duration: reduce ? 0 : 1.1, ease }}
          />
        )}
      </svg>

      <div
        className={cn(
          "absolute left-[20%] top-[79%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500",
          chapter === 0 ? "opacity-40" : "opacity-100"
        )}
      >
        <span className="block h-2.5 w-2.5 rounded-full border-2 border-white bg-deep shadow" />
      </div>

      <motion.div
        className="absolute"
        initial={false}
        animate={{ left: moving ? "72.5%" : "46.25%", top: moving ? "26%" : "45%" }}
        transition={{ duration: reduce ? 0 : 1.1, ease }}
      >
        <span className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <span className="absolute h-8 w-8 rounded-full bg-primary/25 animate-sk-pulse" />
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <MapPin className="h-3 w-3" aria-hidden="true" />
          </span>
        </span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.span
          key={moving ? "moving" : "waiting"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
          className={cn(
            "absolute rounded-full border px-2.5 py-1 text-[10px] font-medium",
            moving
              ? "right-2 top-2 border-primary/25 bg-white text-ink"
              : "left-2 top-2 border-ink/10 bg-white/80 text-deep/60"
          )}
        >
          {moving ? "On the way" : "No check-in yet"}
        </motion.span>
      </AnimatePresence>

      {chapter === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.5, ease }}
          className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-white/95 px-3 py-2"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          <span className="text-[11px] font-medium text-ink">Home safe · safe zone reached</span>
        </motion.div>
      )}
    </div>
  );
}

function ParentApp({ chapter, compact = false }: { chapter: number; compact?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative w-full rounded-[26px] border border-white/70 bg-white/95 p-3.5 text-left shadow-[0_36px_90px_-45px_rgba(8,30,40,0.7)] backdrop-blur",
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

      <AnimatePresence>
        {chapter === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.4, ease }}
            className="absolute inset-x-3.5 bottom-3.5 flex items-center gap-2.5 rounded-[18px] border border-primary/25 bg-night px-3 py-2.5 text-white shadow-lg"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span aria-hidden="true" className="animate-sk-ring absolute inset-0 rounded-full border border-primary/60" />
              <span
                aria-hidden="true"
                style={{ animationDelay: "1.3s" }}
                className="animate-sk-ring absolute inset-0 rounded-full border border-primary/40"
              />
              <Phone className="relative h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Incoming call</p>
              <p className="text-[12px] font-medium">Little explorer</p>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[8.5px] uppercase tracking-[0.14em] text-white/60">
              Demo
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!compact && (
        <p className="mt-2.5 px-1 text-[8.5px] leading-snug text-deep/50">
          Illustrative screen. No live location, pairing or call.
        </p>
      )}
    </div>
  );
}

function WatchPanel({ chapter, className }: { chapter: number; className?: string }) {
  const reduce = useReducedMotion();

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
            transition={{ duration: reduce ? 0 : 0.4, ease }}
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

  return (
    <div className="min-h-[180px]">
      <motion.div
        key={item.id}
        initial={{ opacity: 0.45, y: direction * 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          {item.kicker}
        </p>
        <h3 className="mt-4 font-display text-[clamp(1.9rem,2.7vw,2.7rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
          {item.title}
        </h3>
        <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-white/70">
          {item.body}
        </p>
      </motion.div>
    </div>
  );
}

function Thread({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [0.06, 1], ["44%", "60%"]);
  const y = useTransform(progress, [0.06, 1], ["58%", "47%"]);
  const opacity = useTransform(progress, [0, 0.06, 0.93, 1], [0, 1, 1, 0.25]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sk-thread" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
            <stop offset="45%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <motion.line
          x1="440"
          y1="580"
          x2="600"
          y2="470"
          stroke="url(#sk-thread)"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
        <motion.line
          x1="440"
          y1="580"
          x2="600"
          y2="470"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.06"
          style={{ pathLength: progress }}
        />
      </svg>
      <motion.span
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_4px_hsl(var(--primary)/0.45)]"
        style={{ left: x, top: y, opacity }}
      />
    </div>
  );
}

function StoryBeat({ chapter, index, active, direction }: { chapter: Chapter; index: number; active: boolean; direction: number }) {
  const reduce = useReducedMotion();

  return (
    <article className="relative isolate overflow-hidden rounded-3xl border border-white/10 px-3 py-5 min-[375px]:px-4 sm:px-6" style={{ background: `radial-gradient(ellipse at 50% 100%, ${chapter.light}, #102a38 78%)` }}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          {chapter.kicker}
        </p>
        <span className="text-[10px] tabular-nums text-white/45">0{index + 1} / 04</span>
      </div>
      <h3 className="mt-4 font-display text-[clamp(1.8rem,7vw,2.2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
        {chapter.title}
      </h3>
      <p className="mt-3 max-w-[40ch] text-[13.5px] leading-relaxed text-white/55">{chapter.body}</p>
      <div className="mt-5 grid min-w-0 items-center gap-3 min-[390px]:grid-cols-[minmax(0,0.40fr)_minmax(0,0.60fr)] sm:mt-7 sm:gap-7">
        <motion.div initial={false} animate={{ x: active || reduce ? 0 : 16 * direction }} transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}>
          <WatchPanel chapter={index} className="mx-auto h-[clamp(154px,min(46vw,43svh),250px)] w-full max-w-[240px]" />
        </motion.div>
        <motion.div initial={false} animate={{ x: active || reduce ? 0 : 22 * direction }} transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }} className="relative mx-auto w-full min-w-0 max-w-[310px]">
          <div aria-hidden="true" className="absolute -left-3 top-1/2 hidden h-px w-3 bg-white/20 min-[390px]:block sm:-left-7 sm:w-7">
            {active && (
              <motion.span
                className="block h-full origin-left bg-primary shadow-[0_0_10px_2px_hsl(var(--primary)/0.5)]"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduce ? 0 : 0.34, delay: reduce ? 0 : 0.16, ease: EASE }}
              />
            )}
          </div>
          <ParentApp chapter={index} compact />
        </motion.div>
      </div>
    </article>
  );
}

function StoryCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const reduce = useReducedMotion();
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
              aria-label={`Chapter ${index + 1}: ${chapter.title}`}
              aria-current={selection.index === index ? "step" : undefined}
              onClick={() => api?.scrollTo(index, Boolean(reduce))}
              className={cn(
                "h-11 w-9 rounded-full text-[11px] font-semibold tabular-nums sm:w-11",
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
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const activeRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 30, mass: 0.35 });

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(value * CHAPTERS.length)));
    if (next === activeRef.current) return;
    setDirection(next > activeRef.current ? 1 : -1);
    activeRef.current = next;
    setActive(next);
  });

  // The top edge starts rounded and flattens as the stage pins, like a sheet settling into place.
  const topRadius = useTransform(scrollYProgress, [0, 0.06], [48, 0]);

  const stops = [0, 0.25, 0.5, 0.75, 1];
  const watchX = useTransform(progress, stops, [-30, 0, 14, -6, 0]);
  const watchScale = useTransform(progress, stops, [0.9, 1.025, 0.98, 1.02, 1]);
  const appX = useTransform(progress, stops, [38, 22, 0, 8, 0]);
  const appScale = useTransform(progress, stops, [0.92, 0.98, 1.025, 1, 1]);
  const chapterProgress = useTransform(progress, (value) => Math.max(0, Math.min(1, value)));


  function goTo(index: number) {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + scrollable * ((index + 0.5) / CHAPTERS.length),
      behavior: "smooth",
    });
  }



  return (
    <div id="story" className="lg:bg-mist">
      {!reduce && <motion.section
        ref={sectionRef}
        className="relative hidden bg-night lg:[@media(min-height:650px)]:block"
        style={{
          height: `${CHAPTERS.length * 100}vh`,
          borderTopLeftRadius: topRadius,
          borderTopRightRadius: topRadius,
        }}
        aria-label="The SafeKid story: from the child's watch to the parent's app"
      >
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[66px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/4 h-[620px] w-[620px] rounded-full bg-primary/[0.07] blur-[120px]"
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            initial={false}
            animate={{ backgroundColor: CHAPTERS[active].light }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ maskImage: "radial-gradient(ellipse at 70% 58%, black, transparent 68%)" }}
          />

          <div className="shell relative flex items-center justify-between border-b border-white/10 py-4">
            <p className="eyebrow eyebrow-inverse">
              <span className="eyebrow-line" />
              The SafeKid story
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55">
              <span className="tabular-nums text-white">0{active + 1}</span>
              <span className="h-px w-10 bg-white/20" />
              <span className="tabular-nums">04</span>
            </div>
          </div>

          <div className="shell relative grid flex-1 items-center gap-8 py-6 lg:grid-cols-[0.62fr_1.38fr] xl:gap-10">
            <div className="max-w-[340px]">
              <ChapterCopy chapter={active} direction={direction} />
              <Link
                to="/zodiac"
                className="group mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-white/75 transition-colors hover:text-white"
              >
                Meet the 12 editions
                <ArrowUpRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative grid h-[clamp(400px,60vh,580px)] w-full grid-cols-[44%_12%_44%] items-center">
              <Thread progress={progress} />

              <motion.div
                style={{ x: watchX, scale: watchScale }}
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
            <div className="absolute inset-x-5 top-0 h-px bg-white/10 sm:inset-x-8" aria-hidden="true">
              <motion.div className="h-full origin-left bg-primary" style={{ scaleX: chapterProgress }} />
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
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
      </motion.section>}

      <section id="story-mobile" className={cn("bg-night pb-16", !reduce && "lg:[@media(min-height:650px)]:hidden")}>
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
            A product concept, imagined around the moments that help children grow. Four moments
            between the watch and the app.
          </p>
          <StoryCarousel />
          <p className="mt-9 text-[11px] leading-relaxed text-white/45">
            Illustrative concept. No watch is connected and no live data is shown. {sosDisclosure}
          </p>
        </div>
      </section>
    </div>
  );
}
