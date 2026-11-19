import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Closing() {
  return (
    <section aria-labelledby="home-closing-heading" className="bg-white pb-14 sm:pb-20">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-ink/10 bg-mist px-5 py-8 sm:px-10 sm:py-10 lg:rounded-[40px] lg:px-14 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 hidden h-44 w-72 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--aqua-soft)),transparent_72%)] lg:block"
          />

          <div className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
            <div className="min-w-0">
              <span aria-hidden="true" className="eyebrow-line" />
              <h2 id="home-closing-heading" className="display mt-5 text-[clamp(2rem,4.7vw,4.3rem)] leading-[1.02]">
                Independence,{" "}
                <span className="block text-aqua-ink">with connection.</span>
              </h2>
              <p className="lede mt-4 max-w-[48ch]">
                SafeKid imagines a little more confidence for children, and a little more reassurance
                for the families cheering them on.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 lg:mt-0">
              <Link
                to="/zodiac"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-night"
              >
                Meet the 12 editions
                <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
              </Link>
              <Link
                to="/app"
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-2 py-2.5 text-sm font-semibold text-aqua-ink transition-colors hover:bg-white"
              >
                Try the Parent App
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="relative mt-4 text-xs leading-relaxed text-deep sm:mt-6">
            A concept by SafeKid, developed by DigiBabi. No live device or service.
          </p>
        </div>
      </div>
    </section>
  );
}
