import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, RotateCcw, ShieldAlert } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { sosDisclosure } from "@/data/zodiac";

const HOLD_DURATION = 1200;
const CIRCUMFERENCE = 2 * Math.PI * 84;

export default function Sos() {
  usePageTitle(
    "SOS demo | SafeKid",
    "A local interaction demo of the SafeKid SOS concept. No emergency alert is sent."
  );

  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const frame = useRef<number | null>(null);
  const startedAt = useRef(0);

  const stop = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setHolding(false);
  }, []);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  function haptic(pattern: number | number[]) {
    // Optional haptics on devices that support them; silently ignored elsewhere.
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  }

  function begin() {
    if (acknowledged) return;
    haptic(15);
    setHolding(true);
    startedAt.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt.current;
      const next = Math.min(1, elapsed / HOLD_DURATION);
      setProgress(next);
      if (next >= 1) {
        setHolding(false);
        setAcknowledged(true);
        haptic([40, 60, 40]);
        frame.current = null;
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
  }

  function cancel() {
    stop();
    if (!acknowledged) setProgress(0);
  }

  function reset() {
    stop();
    setAcknowledged(false);
    setProgress(0);
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-night pb-16 pt-[112px] text-white sm:pb-20 lg:pt-[132px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[20%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[110px]"
        />
        <div className="shell relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <div>
              <p className="eyebrow eyebrow-inverse">
                <span className="eyebrow-line" />
                Interaction concept
              </p>
              <h1 className="display display-lg mt-6 text-white">
                A clear way
                <br />
                to ask <span className="text-primary">for help.</span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[14.5px] leading-relaxed text-white/55">
                This screen demonstrates an SOS interaction from the SafeKid concept. It does not
                contact emergency services, share a location, or notify anyone.
              </p>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/[0.07] p-4">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="max-w-[46ch] text-[12.5px] leading-relaxed text-white/70">
                  <span className="font-semibold text-white">Simulation notice.</span>{" "}
                  {sosDisclosure} Nothing on this page can reach a person or a service.
                </p>
              </div>

              <Link
                to="/support"
                className="group mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-white/75 transition-colors hover:text-white"
              >
                Read about the concept
                <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="relative flex aspect-square w-full max-w-[420px] items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-[6%] rounded-full border border-white/10"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-[16%] rounded-full border border-dashed border-primary/25 animate-sk-spin"
                />

                <div className="relative">
                  {!holding && !acknowledged && (
                    <>
                      <span
                        aria-hidden="true"
                        className="animate-sk-ring pointer-events-none absolute inset-0 m-auto h-[180px] w-[180px] rounded-full border border-primary/50 sm:h-[204px] sm:w-[204px]"
                      />
                      <span
                        aria-hidden="true"
                        style={{ animationDelay: "1.3s" }}
                        className="animate-sk-ring pointer-events-none absolute inset-0 m-auto h-[180px] w-[180px] rounded-full border border-primary/40 sm:h-[204px] sm:w-[204px]"
                      />
                    </>
                  )}
                  <svg
                    viewBox="0 0 200 200"
                    className="h-[248px] w-[248px] -rotate-90 sm:h-[280px] sm:w-[280px]"
                    aria-hidden="true"
                  >
                    <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
                    <circle
                      cx="100"
                      cy="100"
                      r="84"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE - progress * CIRCUMFERENCE}
                      style={{ opacity: holding || acknowledged ? 1 : 0, transition: holding ? "none" : "opacity 300ms" }}
                    />
                  </svg>

                  <button
                    type="button"
                    onPointerDown={(event) => {
                      if (event.pointerType === "mouse" && event.button !== 0) return;
                      begin();
                    }}
                    onPointerUp={cancel}
                    onPointerLeave={cancel}
                    onPointerCancel={cancel}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setAcknowledged(true);
                        setProgress(1);
                      }
                    }}
                    className="absolute inset-0 m-auto flex h-[180px] w-[180px] touch-none flex-col items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.8)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.95] sm:h-[204px] sm:w-[204px]"
                    aria-label="Press and hold to preview the SOS demonstration"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-70">
                      Hold
                    </span>
                    <span className="font-display text-[34px] font-bold tracking-[-0.04em]">
                      SOS
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-60">
                      Demo only
                    </span>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Local demo only
                  </p>
                  <p role="status" aria-live="polite" className="mt-3 text-[12px] text-white/70">
                    {acknowledged
                      ? "Demo acknowledged. No alert was sent."
                      : holding
                        ? "Keep holding to preview the demo…"
                        : "Hold the button to preview the interaction."}
                  </p>
                  {acknowledged && (
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[11px] text-white/70 transition-colors hover:border-primary/50 hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Reset demo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="shell grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "What this shows",
              body: "The intended feel of a press-and-hold SOS interaction: deliberate, difficult to trigger by accident, and easy to read.",
            },
            {
              title: "What this does not do",
              body: "It does not call emergency services, send a message, share location, or notify a parent, guardian or device.",
            },
            {
              title: "What stays unconfirmed",
              body: "Live SOS behaviour, device specifications and availability are not confirmed anywhere on this concept site.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[24px] border border-ink/10 bg-mist/40 p-6">
              <h2 className="font-display text-[16px] font-medium tracking-[-0.02em] text-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="shell mt-8">
          <p className="rounded-[20px] border border-ink/10 p-4 text-[11.5px] leading-relaxed text-deep/60">
            {sosDisclosure} If you need emergency help, contact your local emergency number directly.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
