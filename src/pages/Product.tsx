import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useViewTransitionState } from "react-router-dom";
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from "lucide-react";
import { EditionThumbnails } from "@/components/zodiac/EditionThumbnails";
import { collectionPosition } from "@/components/zodiac/collectionReturn";
import { AddToBag } from "@/components/shop/AddToBag";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { DURATION, EASE } from "@/components/motion/tokens";
import NotFound from "@/pages/NotFound";
import { usePageTitle } from "@/hooks/usePageTitle";
import { conceptCapabilities, conceptNote, zodiacProducts } from "@/data/zodiac";

const PILLARS = [
  {
    number: "01 / The child",
    title: "Room to discover.",
    body: "A concept designed around the small steps children take as their world gets bigger.",
  },
  {
    number: "02 / The family",
    title: "Connection that reassures.",
    body: "SafeKid imagines a simpler way for children and the people who care for them to stay in touch.",
  },
  {
    number: "03 / Their edition",
    title: "A character of their own.",
    body: "One of twelve playful designs inspired by the Vietnamese Zodiac, with its own little personality.",
  },
];

const artwork = {
  incoming: (direction: number) => ({ opacity: 0, scale: 0.97, x: direction * 28 }),
  active: { opacity: 1, scale: 1, x: 0 },
  outgoing: (direction: number) => ({ opacity: 0, scale: 0.98, x: direction * -22 }),
};

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const zodiacEntry = state?.zodiacEntry as string | undefined;
  const returnPosition = collectionPosition(zodiacEntry);
  const editionState = { keepProductScroll: true, zodiacEntry };
  const reduce = useReducedMotion();
  const sharedFromCollection = useViewTransitionState("/zodiac");
  const index = zodiacProducts.findIndex((item) => item.id === id);
  const product = index >= 0 ? zodiacProducts[index] : null;
  const previousIndex = useRef(index);
  const recentSwipe = useRef(0);
  const panX = useMotionValue(0);
  const [zoomed, setZoomed] = useState(false);
  const total = zodiacProducts.length;
  const forward = (index - previousIndex.current + total) % total;
  const direction = forward > total / 2 ? -1 : 1;

  useEffect(() => {
    previousIndex.current = index;
    setZoomed(false);
  }, [index]);

  usePageTitle(product ? `${product.detailTitle} | SafeKid` : "Edition not found | SafeKid");

  if (!product) return <NotFound />;

  const previous = zodiacProducts[(index - 1 + zodiacProducts.length) % zodiacProducts.length];
  const next = zodiacProducts[(index + 1) % zodiacProducts.length];
  const related = Array.from(
    { length: 4 },
    (_, offset) => zodiacProducts[(index + offset + 1) % zodiacProducts.length]
  );

  return (
    <SiteLayout>
      <section style={{ backgroundColor: product.tint }} className="relative overflow-hidden motion-safe:transition-colors motion-safe:duration-500 pb-16 pt-[94px] sm:pb-20 sm:pt-[104px] lg:pt-[124px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[16%] -top-[22%] h-[760px] w-[760px] rounded-full bg-white/80 blur-[90px]"
        />
        <div className="shell relative">
          <Link
            to="/zodiac"
            state={{ restoreZodiac: zodiacEntry }}
            viewTransition={!reduce && returnPosition?.edition === product.id}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-deep/50 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
            Zodiac collection
          </Link>

          <div className="mt-4 grid items-center gap-y-3 sm:mt-6 lg:mt-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-x-14">
            <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:self-end">
              <p className="eyebrow">
                <span className="eyebrow-line" />
                SafeKid / Zodiac edition {product.animal}
              </p>
              <h1 className="display display-lg mt-3 sm:mt-5">
                <motion.span
                  key={product.id}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0.6, x: direction * 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
                >
                  {product.label}
                </motion.span>
                <br />
                <span className="text-[var(--accent-ink)]">little explorer.</span>
              </h1>
            </div>
            <div className="relative lg:col-start-1 lg:row-start-1 lg:row-span-2">
              <div className="relative mx-auto aspect-square w-full max-w-[min(540px,65svh)] lg:max-w-[540px]">
                <div aria-hidden="true" className="stage-glow absolute inset-[2%] rounded-full" />
                <div aria-hidden="true" className="absolute inset-[10%] rounded-full border border-primary/20" />
                <div
                  aria-hidden="true"
                  className="absolute inset-[18%] rounded-full border border-dashed border-primary/20 animate-sk-spin"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[15rem] font-extrabold leading-none text-primary/[0.10]"
                >
                  {product.animal.charAt(0)}
                </span>

                <Dialog open={zoomed} onOpenChange={setZoomed}>
                  <DialogTrigger asChild>
                    <motion.button
                      type="button"
                      aria-label={`Enlarge ${product.label} edition image`}
                      className="absolute inset-0 h-full w-full cursor-zoom-in rounded-[32px] touch-pan-y touch-pinch-zoom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onPanStart={() => panX.stop()}
                      onPan={(_, { offset }) => {
                        if (!reduce && Math.abs(offset.x) > 1.4 * Math.abs(offset.y)) {
                          panX.set(Math.max(-86, Math.min(86, offset.x * 0.72)));
                        }
                      }}
                      onPanEnd={(_, { offset }) => {
                        if (!reduce) animate(panX, 0, { type: "spring", stiffness: 360, damping: 32 });
                        if (Math.abs(offset.x) < 48 || Math.abs(offset.x) < 1.4 * Math.abs(offset.y)) return;
                        recentSwipe.current = performance.now();
                        navigate(`/product/${offset.x < 0 ? next.id : previous.id}`, { state: editionState });
                      }}
                      onClick={(event) => {
                        if (event.detail > 0 && performance.now() - recentSwipe.current < 400 && recentSwipe.current > 0) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <motion.div className="pointer-events-none absolute inset-0" style={{ x: panX }}>
                        <AnimatePresence initial={false} custom={direction}>
                          <motion.img
                            key={product.id}
                            custom={direction}
                            src={product.image}
                            alt={`SafeKid smartwatch concept in the ${product.label} edition`}
                            data-edition-art={product.id}
                            draggable={false}
                            style={sharedFromCollection ? { viewTransitionName: `edition-${product.id}` } : undefined}
                            variants={artwork}
                            initial={reduce || sharedFromCollection ? false : "incoming"}
                            animate="active"
                            exit={reduce || sharedFromCollection ? undefined : "outgoing"}
                            transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
                            className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_44px_70px_rgba(16,42,56,0.16)]"
                          />
                        </AnimatePresence>
                      </motion.div>
                      <span className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-deep shadow-sm sm:right-4 sm:top-4" aria-hidden="true">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="product-image-dialog max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[700px] gap-1 overflow-auto rounded-[26px] bg-mist p-5 sm:p-7">
                    <DialogTitle>{product.label} edition</DialogTitle>
                    <DialogDescription>SafeKid smartwatch concept</DialogDescription>
                    <img src={product.image} alt={`Enlarged view of the ${product.label} edition`} className="mx-auto max-h-[68dvh] w-full object-contain" />
                  </DialogContent>
                </Dialog>

                <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  <Link
                    to={`/product/${previous.id}`}
                    state={editionState}
                    aria-label={`Previous edition: ${previous.label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-deep/60 backdrop-blur transition-colors hover:border-primary/40 hover:text-ink"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <motion.span
                    key={product.id}
                    initial={reduce ? false : { opacity: 0.6, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
                    className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-deep/75 backdrop-blur"
                  >
                    {String(index + 1).padStart(2, "0")} / {total}
                  </motion.span>
                  <Link
                    to={`/product/${next.id}`}
                    state={editionState}
                    aria-label={`Next edition: ${next.label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-deep/60 backdrop-blur transition-colors hover:border-primary/40 hover:text-ink"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-start-2 lg:row-start-2 lg:self-start">
              <AddToBag key={product.id} editionId={product.id} image={product.image} />
              <EditionThumbnails
                className="mt-4 max-w-[31rem]"
                index={index}
                onPick={(selected) => {
                  if (selected !== index) navigate(`/product/${zodiacProducts[selected].id}`, { state: editionState });
                }}
              />
              <p className="lede mt-6 max-w-[42ch]">
                Meet the {product.label} edition — a Vietnamese Zodiac-inspired character in the
                SafeKid watch concept, made for the little person who is always a few steps ahead.
              </p>
              <a href="#idea" className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[13.5px] font-medium text-ink">
                Discover the idea
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="idea" className="relative overflow-hidden bg-night py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-primary/[0.08] blur-[110px]"
        />
        <div className="shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow eyebrow-inverse">
              <span className="eyebrow-line" />
              A design with a story
            </p>
            <h2 className="display display-lg mt-6 text-white">
              A familiar character
              <br />
              for unfamiliar <span className="text-primary">adventures.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[14.5px] leading-relaxed text-white/55">
              Inspired by {product.animal} in the Vietnamese Zodiac, this edition brings a little
              character to the SafeKid idea: giving children space to explore, with family connection
              at heart.
            </p>
            <Link
              to="/zodiac"
              className="group mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
            >
              Back to all Zodiac editions
              <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <span aria-hidden="true" className="absolute inset-[8%] rounded-full bg-primary/10 blur-3xl" />
            <img
              src={product.image}
              alt=""
              aria-hidden="true"
              className="relative h-full w-full object-contain opacity-95"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                Designed around family
              </p>
              <h2 className="display display-lg mt-6 max-w-[18ch]">
                One idea,
                <br />
                three <span className="text-primary">perspectives.</span>
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted-foreground lg:pb-2">
              Every edition belongs to the same story: making room for growing up, while keeping
              family connection close.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-ink/10 bg-ink/10 sm:grid-cols-3">
            {PILLARS.map((pillar, pillarIndex) => (
              <Reveal key={pillar.number} variant="soft" delay={pillarIndex * 0.06}>
                <article className="group h-full bg-white p-6 transition-colors duration-500 hover:bg-mist lg:p-8">
                  <p className="text-[9.5px] uppercase tracking-[0.2em] text-primary">
                    {pillar.number}
                  </p>
                  <h3 className="mt-4 font-display text-[20px] font-medium tracking-[-0.03em] text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 rounded-[28px] border border-ink/10 bg-mist/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-display text-[19px] font-medium tracking-[-0.03em] text-ink">
                Concept capabilities
              </h3>
              <p className="text-[10px] uppercase tracking-[0.18em] text-deep/55">
                Illustrative watch features
              </p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {conceptCapabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-full border border-ink/10 bg-white px-3.5 py-2 text-[12px] text-deep/70"
                >
                  {capability}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[70ch] text-[11px] leading-relaxed text-deep/60">{conceptNote}</p>
            <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-[13px] font-medium text-ink">Explore the one-touch SOS concept.</p>
                <p className="mt-1 text-[11px] leading-relaxed text-deep/55">
                  A local interaction preview only. No emergency alert is sent.
                </p>
              </div>
              <Link
                to="/sos"
                className="group inline-flex h-11 shrink-0 items-center gap-3 rounded-full bg-ink px-5 text-[12px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
              >
                Explore SOS
                <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                Keep exploring
              </p>
              <h2 className="display display-md mt-5 max-w-[16ch]">
                Meet another
                <br />
                little character.
              </h2>
            </div>
            <Link
              to="/zodiac"
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink"
            >
              See all 12 editions
              <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <Carousel className="mt-7" aria-label="Related editions" opts={{ align: "start" }}>
            <div className="mb-3 flex justify-end gap-1.5 lg:hidden">
              <CarouselPrevious aria-label="Previous related editions" className="static h-11 w-11 translate-y-0 bg-white text-deep" />
              <CarouselNext aria-label="Next related editions" className="static h-11 w-11 translate-y-0 bg-white text-deep" />
            </div>
            <CarouselContent>
              {related.map((item, itemIndex) => (
                <CarouselItem key={item.id} className="basis-[76%] sm:basis-1/2 lg:basis-1/4">
                  <Reveal key={item.id} variant="soft" delay={itemIndex * 0.05}>
                    <TiltCard className="h-full rounded-[24px]">
                      <Link
                        to={`/product/${item.id}`}
                        state={{ zodiacEntry }}
                        className="group flex h-full flex-col rounded-[24px] border border-ink/[0.07] bg-white p-3 transition-colors duration-500 hover:border-primary/25"
                      >
                        <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[18px] bg-mist">
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            width={900}
                            height={900}
                            className="relative h-[88%] w-[88%] object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </span>
                        <span className="flex items-end justify-between gap-2 px-2 pb-1 pt-3.5">
                          <span>
                            <span className="block text-[9px] uppercase tracking-[0.18em] text-[var(--accent-ink)]">
                              {item.animal}
                            </span>
                            <span className="mt-1 block font-display text-[15px] font-medium text-ink">
                              {item.label} edition
                            </span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-deep/40 transition-all duration-300 group-hover:text-primary" aria-hidden="true" />
                        </span>
                      </Link>
                    </TiltCard>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
            <Link
              to={`/product/${previous.id}`}
              className="group inline-flex items-center gap-2 text-[12px] text-deep/60 transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {previous.label} edition
            </Link>
            <p className="text-[10px] uppercase tracking-[0.18em] text-deep/50">
              {product.detailTitle} · Concept
            </p>
            <Link
              to={`/product/${next.id}`}
              className="group inline-flex items-center gap-2 text-[12px] text-deep/60 transition-colors hover:text-ink"
            >
              {next.label} edition
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-6 max-w-[80ch] text-[11px] leading-relaxed text-deep/55">
            {conceptNote} Final edition specifications are pending.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
