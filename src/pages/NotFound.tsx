import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found | SafeKid");

  return (
    <SiteLayout>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-mist pb-16 pt-[120px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] top-0 h-[560px] w-[560px] rounded-full bg-white/70 blur-[90px]"
        />
        <div className="shell relative grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              404 / Off the map
            </p>
            <h1 className="display display-lg mt-6 max-w-[16ch]">
              This path hasn't been
              <br />
              <span className="text-primary">drawn yet.</span>
            </h1>
            <p className="lede mt-6 max-w-[42ch]">
              The page you were looking for isn't part of the SafeKid concept. Let's get you back to
              somewhere familiar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to the story
              </Link>
              <Link
                to="/zodiac"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 px-6 text-[13.5px] font-medium text-ink transition-colors hover:bg-white"
              >
                See the collection
                <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center">
            <div aria-hidden="true" className="stage-glow absolute inset-[4%] rounded-full" />
            <div aria-hidden="true" className="absolute inset-[14%] rounded-full border border-primary/20" />
            <div
              aria-hidden="true"
              className="absolute inset-[24%] rounded-full border border-dashed border-primary/25 animate-sk-spin"
            />
            <p
              aria-hidden="true"
              className="relative font-display text-[6.5rem] font-semibold tracking-[-0.07em] text-ink/15"
            >
              404
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
