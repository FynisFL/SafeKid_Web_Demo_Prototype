import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { Thesis } from "@/components/home/Thesis";
import { StorySequence } from "@/components/home/StorySequence";
import { ProductChapters } from "@/components/home/ProductChapters";
import { ZodiacStage } from "@/components/home/ZodiacStage";
import { Reveal } from "@/components/site/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import heroWatch from "@/assets/safekid/hero-watch.webp";
import { usePageTitle } from "@/hooks/usePageTitle";

function Closing() {
  return (
    <section className="bg-white pb-20 pt-4 sm:pb-24">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[32px] bg-night px-6 py-16 sm:px-10 sm:py-20 lg:rounded-[44px] lg:px-16 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-primary/12 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] top-1/2 hidden h-[300px] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 hidden w-[42%] max-w-[440px] lg:block"
          >
            <div className="absolute inset-[8%] rounded-full bg-primary/15 blur-[60px]" />
            <img
              src={heroWatch}
              alt=""
              className="relative h-full w-full object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.45)]"
              loading="lazy"
            />
          </div>

          <div className="relative max-w-[720px]">
            <Reveal>
              <p className="eyebrow eyebrow-inverse">
                <span className="eyebrow-line" />
                For all the little adventures ahead
              </p>
            </Reveal>
            <Reveal variant="clip" delay={0.05}>
              <h2 className="display display-lg mt-6 text-white">
                Independence,
                <br />
                <span className="text-primary">with connection.</span>
              </h2>
            </Reveal>
            <Reveal variant="soft" delay={0.1}>
              <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-white/55">
                SafeKid imagines a little more confidence for children, and a little more reassurance
                for the families cheering them on.
              </p>
            </Reveal>
            <Reveal variant="soft" delay={0.16}>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Magnetic>
                <Link
                  to="/zodiac"
                  className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-white pl-6 pr-5 text-[14px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-soft btn-motion btn-motion-light"
                >
                  Meet the 12 editions
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
                </Magnetic>
                <Link
                  to="/contact"
                  className="group press inline-flex items-center gap-2 text-[14px] font-medium text-white/75 transition-colors hover:text-white"
                >
                  Let's talk about SafeKid
                  <ArrowUpRight
                    className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-white/50">
              <span>A concept by SafeKid</span>
              <span className="h-3 w-px bg-white/15" />
              <span>Developed by DigiBabi</span>
              <span className="h-3 w-px bg-white/15" />
              <span>No live device or service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle(
    "SafeKid — The space between them",
    "SafeKid is a product concept: a child's smartwatch and a parent's app, imagined around the space between independence and connection."
  );

  return (
    <SiteLayout>
      <Hero />
      <Thesis />
      <StorySequence />
      <ProductChapters />
      <ZodiacStage />
      <Closing />
    </SiteLayout>
  );
}
