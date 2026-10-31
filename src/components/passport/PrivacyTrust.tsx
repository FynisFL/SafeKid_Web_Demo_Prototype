import { Check, EyeOff, Lock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PRIVACY_NEVER, PRIVACY_TRACKS } from "@/data/watchPassport";

export function PrivacyTrust() {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            Privacy &amp; trust
          </p>
          <h2 className="display display-lg mt-6 max-w-[18ch]">
            It follows the device. <span className="text-primary">Never the child.</span>
          </h2>
          <p className="lede mt-6 max-w-[56ch]">
            Watch Passport is a record of the Core itself. A Certified Data Wipe is logged as a fact about the
            device, so the next chapter starts clean and the previous child's personal information is never
            part of the passport.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="hairline-card h-full p-7 sm:p-9">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-deep/70">
                <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
                What the passport tracks
              </p>
              <ul className="mt-6 space-y-3.5">
                {PRIVACY_TRACKS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14.5px] text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-[28px] bg-ink p-7 text-white sm:p-9">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-aqua-soft/75">
                <EyeOff className="h-4 w-4 text-primary" aria-hidden="true" />
                What it never holds
              </p>
              <ul className="mt-6 space-y-3.5">
                {PRIVACY_NEVER.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14.5px] text-white/85">
                    <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <p className="mt-8 max-w-[70ch] text-[12px] leading-relaxed text-deep/60">
          Concept note: this page does not connect to a device, collect information about children or families,
          or run any certification process. Everything shown is local sample content.
        </p>
      </div>
    </section>
  );
}
