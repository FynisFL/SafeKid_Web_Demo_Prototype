import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Closing() {
  return (
    <section
      aria-labelledby="home-closing-heading"
      className="border-y border-deep/10 bg-mist"
    >
      <div className="shell py-10 sm:py-14 lg:py-[4.5rem]">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:gap-10 lg:gap-14">
          <div className="min-w-0">
            <h2 id="home-closing-heading" className="display text-[clamp(2rem,5.8vw,4.65rem)] leading-[1.02]">
              Independence,{" "}
              <span className="block text-aqua-ink">with connection.</span>
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-deep">
              SafeKid imagines a little more confidence for children, and a little more reassurance
              for the families cheering them on.
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 md:border-l md:border-deep/15 md:pl-8 lg:pl-10">
            <Link
              to="/zodiac"
              className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-deep"
            >
              Meet the 12 editions
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              to="/app"
              className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-deep/25 bg-white/70 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              Try the Parent App
              <ArrowUpRight className="size-4 shrink-0 text-aqua-ink" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <p className="mt-6 border-t border-deep/15 pt-4 text-xs leading-relaxed text-deep sm:mt-9">
          A concept by SafeKid, developed by DigiBabi. No live device or service.
        </p>
      </div>
    </section>
  );
}
