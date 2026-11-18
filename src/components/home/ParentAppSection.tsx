import { Link } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";
import heroWatch from "@/assets/safekid/hero-watch.webp";
import { scenes } from "@/components/app-experience/scenes";
import { Reveal } from "@/components/site/Reveal";

export function ParentAppSection() {
  return (
    <section aria-labelledby="home-parent-app" className="relative overflow-hidden bg-night py-20 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,hsl(var(--primary)/0.2),transparent_65%)]"
      />
      <div className="shell relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <h2 id="home-parent-app" className="display display-lg text-white">
            SafeKid <span className="text-primary">Parent App</span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.75] text-white/75 sm:text-base">
            See how SafeKid brings safe zones, SOS events and everyday habits together in one place for parents.
          </p>
          <Link
            to="/app"
            className="btn-motion btn-motion-light group mt-8 inline-flex min-h-12 max-w-full items-center gap-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-aqua-soft"
          >
            Explore the Parent App
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal variant="soft" className="relative mx-auto w-full min-w-0 max-w-[620px]">
          <div className="relative isolate grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] items-center gap-2 overflow-hidden rounded-[28px] border border-white/15 bg-white/5 px-3 py-5 sm:gap-4 sm:px-7 sm:py-9">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_24%_50%,hsl(var(--primary)/0.19),transparent_70%)]" />
            <Reveal variant="drift" className="relative min-w-0">
              <div aria-hidden="true" className="absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2 rounded-full border border-primary/25" />
              <img
                src={heroWatch}
                alt=""
                width={620}
                height={620}
                loading="lazy"
                className="relative h-auto w-full object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)]"
              />
            </Reveal>
            <div className="min-w-0 rounded-2xl border border-white/80 bg-mist p-2.5 text-ink shadow-xl sm:rounded-[24px] sm:p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-deep sm:mb-3 sm:text-xs">
                <Smartphone className="h-4 w-4 shrink-0 text-deep" aria-hidden="true" />
                Sample activity
              </p>
              <ul className="grid gap-1.5 sm:gap-2">
                {scenes.map(({ id, icon: Icon, label, title, accent }, index) => (
                  <li key={id}>
                    <Reveal delay={index * 0.09} className="flex items-start gap-2 rounded-xl bg-white px-2 py-1.5 sm:px-3 sm:py-2">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold leading-snug sm:text-[13px]">{title}</p>
                        <p className="mt-0.5 text-[10px] leading-snug text-deep/75 sm:text-[11px]">{label}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
