import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { sosDisclosure } from "@/data/zodiac";

export function SOSIntroduction() {
  return (
    <section aria-labelledby="home-sos-title" className="bg-white py-14 sm:py-20">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-ink/10 bg-mist px-6 py-12 sm:px-10 sm:py-14 lg:rounded-[40px] lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-primary/[0.09] blur-[100px]"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <Reveal>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                One touch · SOS concept
              </p>
              <h2 id="home-sos-title" className="display display-lg mt-6 max-w-[15ch]">
                One touch.
                <br />
                <span className="text-primary">A way to ask for help.</span>
              </h2>
              <p className="lede mt-6 max-w-[48ch]">
                Explore how the SafeKid concept imagines a deliberate, press-and-hold SOS interaction
                for a child.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                <Link
                  to="/sos"
                  className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-ink px-6 text-[13px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
                >
                  Explore SOS Demo
                  <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <p className="max-w-[40ch] text-[10.5px] leading-relaxed text-deep/55">
                  {sosDisclosure}
                </p>
              </div>
            </Reveal>

            <Reveal variant="soft" className="relative mx-auto flex w-full max-w-[300px] items-center justify-center">
              <div className="relative flex aspect-square w-full items-center justify-center">
                <span aria-hidden="true" className="absolute inset-[3%] rounded-full border border-primary/20" />
                <span aria-hidden="true" className="absolute inset-[14%] rounded-full border border-dashed border-primary/30" />
                <span aria-hidden="true" className="absolute inset-[25%] rounded-full bg-white/80 shadow-[0_24px_70px_-34px_rgba(16,42,56,0.28)]" />
                <div className="relative flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-full bg-white text-ink shadow-[0_18px_50px_-24px_rgba(16,42,56,0.25)]">
                  <ShieldAlert className="h-9 w-9 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-[10px] font-semibold tracking-[0.2em]">SOS</span>
                </div>
                <span className="absolute bottom-[7%] rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-deep/55 backdrop-blur">
                  Local simulation
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
