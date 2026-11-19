import { ScrollFloat } from "@/components/motion/reactbits/ScrollFloat";
import { ScrollReveal } from "@/components/motion/reactbits/ScrollReveal";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { CoreLayers } from "@/components/passport/CoreLayers";
import { PassportDemo } from "@/components/passport/PassportDemo";
import { LivesSection } from "@/components/passport/LivesSection";
import { CircularJourney } from "@/components/passport/CircularJourney";
import { PrivacyTrust } from "@/components/passport/PrivacyTrust";
import { usePageTitle } from "@/hooks/usePageTitle";
import { DEMO_LABEL } from "@/data/watchPassport";


export default function WatchPassport() {
  usePageTitle(
    "Watch Passport | SafeKid",
    "Watch Passport is SafeKid's concept for a Digital Life Passport: a lifecycle record for each Core that tracks the device, never the child."
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Watch Passport · Grow Sustainable"
        title={
          <>
            Every Core
            <br />
            has a <span className="text-aqua-ink">story.</span>
          </>
        }
        intro="Watch Passport is SafeKid's Digital Life Passport concept: a lifecycle record for each physical Core, so a device can have a meaningful life beyond its first user."
        actions={
          <a
            href="#passport"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 py-2 text-[13.5px] font-medium text-white transition-all duration-300 motion-safe:hover:-translate-y-0.5 hover:bg-night btn-motion sm:px-6"
          >
            Open the sample passport
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        }
        meta={`${DEMO_LABEL} · No live device or certification system`}
        art={<CoreLayers />}
      />

      <section id="passport" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Digital passport
            </p>
            <h2 className="display display-lg mt-6 max-w-[16ch]">
              One record. <ScrollFloat className="text-aqua-ink">Every chapter.</ScrollFloat>
            </h2>
            <ScrollReveal className="lede mt-6 max-w-[54ch]">
              Pick a chapter to see how a sample passport changes: Device ID, condition, service history,
              warranty eligibility and lifecycle status.
            </ScrollReveal>
          </Reveal>
          <Reveal delay={0.06} className="mt-12">
            <PassportDemo />
          </Reveal>
        </div>
      </section>

      <LivesSection />
      <CircularJourney />
      <PrivacyTrust />

      <section className="bg-white pb-20 pt-4 sm:pb-24">
        <div className="shell">
          <div className="relative overflow-hidden rounded-[32px] bg-night px-6 py-16 sm:px-10 sm:py-20 lg:rounded-[44px] lg:px-16 lg:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-primary/12 blur-[100px]"
            />
            <div className="relative max-w-[720px]">
              <p className="eyebrow eyebrow-inverse">
                <span className="eyebrow-line" />
                Grow Sustainable
              </p>
              <Reveal>
                <h2 className="display display-lg mt-6 text-white">
                  Protection for today.
                  <br />
                  <span className="text-primary">Value beyond tomorrow.</span>
                </h2>
                <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-white/60">
                  SafeKid is designed to protect children while allowing the device itself to have a meaningful
                  lifecycle beyond its first user.
                </p>
                <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <Magnetic>
                    <Link
                      to="/zodiac"
                      className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-white pl-6 pr-5 text-[14px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-soft btn-motion btn-motion-light"
                    >
                      Meet the 12 editions
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/5">
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </Magnetic>
                  <Link
                    to="/contact"
                    className="press text-[14px] font-medium text-white/75 transition-colors hover:text-white"
                  >
                    Let's talk about SafeKid
                  </Link>
                </div>
                <p className="mt-12 text-[10px] uppercase tracking-[0.18em] text-white/50">
                  {DEMO_LABEL} · A concept by SafeKid · Developed by DigiBabi
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
