import { useLayoutEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { formatVnd, WATCH_PRICE_VND } from "@/components/shop/shoppingBag";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ZodiacStage } from "@/components/home/ZodiacStage";
import { Reveal } from "@/components/site/Reveal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TiltCard } from "@/components/motion/TiltCard";
import { Magnetic } from "@/components/motion/Magnetic";
import { usePageTitle } from "@/hooks/usePageTitle";
import { zodiacProducts } from "@/data/zodiac";
import { collectionVisit } from "@/components/site/collectionVisit";
import heroWatch from "@/assets/safekid/editions/rat.webp";

function CollectionRail({ stageOwnsTransition, onEditionClick }: { stageOwnsTransition: boolean; onEditionClick: () => void }) {
  const reduce = useReducedMotion();
  const control = "static h-11 w-11 translate-y-0 border-ink/12 bg-white text-deep transition-colors hover:border-primary/40 hover:text-ink";

  return (
    <section className="overflow-hidden bg-mist py-20 sm:py-24">
      <Carousel aria-label="All twelve editions" opts={{ align: "start" }}>
        <div className="shell flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              The full collection
            </p>
            <h2 className="display display-md mt-5 max-w-[18ch]">
              One watch.
              <br />
              Twelve personalities.
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <CarouselPrevious aria-label="Scroll collection left" className={control} />
            <CarouselNext aria-label="Scroll collection right" className={control} />
          </div>
        </div>
        <CarouselContent className="mt-8 px-5 pb-6 pt-3 sm:px-8 lg:px-12">
          {zodiacProducts.map((product, index) => (
            <CarouselItem key={product.id} className="basis-[244px] sm:basis-[268px]">
              <TiltCard className="h-full rounded-[24px]">
                <NavLink
                  to={`/product/${product.id}`}
                  viewTransition={!reduce}
                  onClick={onEditionClick}
                  className="group block h-full rounded-[24px] border border-ink/[0.07] bg-white p-3 transition-colors duration-500 hover:border-primary/25"
                >
                  {({ isTransitioning }) => (
                    <>
                      <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[18px] bg-mist">
                        <span
                          aria-hidden="true"
                          className="absolute inset-6 rounded-full bg-white/60 blur-xl transition-transform duration-700 group-hover:scale-110"
                        />
                        <img
                          style={isTransitioning && !stageOwnsTransition ? { viewTransitionName: `edition-${product.id}` } : undefined}
                          src={product.image}
                          alt={`${product.label} edition SafeKid smartwatch concept`}
                          loading="lazy"
                          width={900}
                          height={900}
                          className="relative h-[86%] w-[86%] object-contain transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                        />
                        <span className="absolute left-3 top-3 text-[9px] tabular-nums tracking-[0.14em] text-deep/55">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <span className="flex items-end justify-between gap-3 px-2 pb-1 pt-3.5">
                        <span>
                          <span className="block text-[9px] uppercase tracking-[0.18em] text-primary">
                            {product.animal}
                          </span>
                          <span className="mt-1 block font-display text-[16px] font-medium tracking-[-0.02em] text-ink">
                            {product.label}
                          </span>
                          <span className="mt-1 block text-xs font-semibold tabular-nums text-deep">{formatVnd(WATCH_PRICE_VND)}</span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-deep/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </span>
                    </>
                  )}
                </NavLink>
              </TiltCard>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function Closing() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Their next chapter
            </p>
          </Reveal>
          <Reveal variant="clip" delay={0.05}>
            <h2 className="display display-lg mt-6 max-w-[16ch]">
              Which one feels
              <br />
              <span className="text-primary">like them?</span>
            </h2>
          </Reveal>
          <Reveal variant="soft" delay={0.1}>
            <p className="mt-6 max-w-[44ch] text-[14.5px] leading-relaxed text-muted-foreground">
              Choose an edition to see its price and add it to your bag. You can explore checkout
              while watch orders remain closed.
            </p>
          </Reveal>
        </div>
        <Reveal variant="soft" delay={0.15}>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
            >
              Talk to the SafeKid team
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            </Magnetic>
            <Link
              to="/"
              className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-[13.5px] font-medium text-ink transition-colors hover:bg-mist"
            >
              Back to the story
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Zodiac() {
  const { key, pathname } = useLocation();
  const visit = collectionVisit(key, pathname);
  const [stageOwnsTransition, setStageOwnsTransition] = useState(visit.stageOwnsTransition);

  useLayoutEffect(() => {
    function rememberScroll() {
      if (window.history.state?.key === key || (key === "default" && !window.history.state?.key)) {
        visit.scrollY = window.scrollY;
      }
    }
    window.addEventListener("scroll", rememberScroll, { passive: true });
    return () => window.removeEventListener("scroll", rememberScroll);
  }, [key, visit]);

  function chooseTransitionSource(stage: boolean) {
    visit.scrollY = window.scrollY;
    visit.stageOwnsTransition = stage;
    setStageOwnsTransition(stage);
  }
  usePageTitle(
    "Zodiac Collection | SafeKid",
    "Twelve SafeKid smartwatch concepts inspired by the Vietnamese Zodiac. Explore every edition."
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Inspired by the Vietnamese Zodiac"
        title={
          <>
            Twelve little
            <br />
            <span className="text-primary">explorers.</span>
          </>
        }
        intro="Meet the SafeKid collection: playful Zodiac-inspired designs imagined for the curious little people finding their way in the world."
        actions={
          <a
            href="#collection"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
          >
            Explore all 12 editions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        }
        meta={`${formatVnd(WATCH_PRICE_VND)} per watch · Not available to order yet`}
        art={
          <div className="relative mx-auto aspect-square w-full max-w-[440px]">
            <div aria-hidden="true" className="stage-glow absolute inset-[4%] rounded-full" />
            <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-primary/20" />
            <div
              aria-hidden="true"
              className="absolute inset-[20%] rounded-full border border-dashed border-primary/25 animate-sk-spin"
            />
            <img
              src={heroWatch}
              alt="SafeKid Mouse edition smartwatch concept"
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_40px_70px_rgba(16,42,56,0.16)]"
            />
            <span className="absolute left-0 top-6 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-deep/60 backdrop-blur">
              12 editions
            </span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-deep/60 backdrop-blur">
              Vietnamese Zodiac
            </span>
          </div>
        }
      />

      <div id="collection" />
      <ZodiacStage
        variant="page"
        initialIndex={visit.index}
        onSelectionChange={(index) => { visit.index = index; }}
        ownsEditionTransition={stageOwnsTransition}
        onEditionClick={() => chooseTransitionSource(true)}
      />
      <CollectionRail stageOwnsTransition={stageOwnsTransition} onEditionClick={() => chooseTransitionSource(false)} />
      <Closing />
    </SiteLayout>
  );
}
