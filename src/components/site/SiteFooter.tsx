import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { LittleDetourGame } from "../easter-egg/LittleDetourGame";

const explore = [
  { label: "Home", to: "/" },
  { label: "Zodiac collection", to: "/zodiac" },
  { label: "About SafeKid", to: "/about" },
  { label: "S-F AI", to: "/chat" },
];

const support = [
  { label: "Support centre", to: "/support" },
  { label: "FAQ", to: "/support#faq" },
  { label: "Contact", to: "/contact" },
  { label: "Shipping information", to: "/support" },
  { label: "Payment method", to: "/support" },
  { label: "Return & refund", to: "/support" },
  { label: "Privacy policy", to: "/support" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div className="shell relative">
        <div className="grid gap-10 border-b border-white/10 py-16 md:grid-cols-[1.3fr_0.7fr] md:items-end lg:py-20">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-aqua-soft/60">
              <span className="block h-px w-8 bg-primary" />
              The space between them
            </p>
            <h2 className="mt-6 max-w-xl font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">
              Room to explore.
              <br />
              <span className="text-primary">Somewhere to come home to.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <a
              href="mailto:support@safekid.com"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua-soft btn-motion btn-motion-light"
            >
              Tell us what you think
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <p className="text-[11px] text-white/55">A product concept by DigiBabi.</p>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1fr]">
          <div>
            <BrandMark tone="light" compact onSecretUnlock={() => setLittleDetourOpen(true)} />
            <p className="mt-5 max-w-[26ch] text-sm leading-relaxed text-white/55">
              A child-focused watch concept and twelve Vietnamese Zodiac editions, imagined around
              growing independence.
            </p>
            <div className="mt-6 flex items-center gap-2" aria-label="Social channels">
              {[Instagram, Youtube, Linkedin].map((Icon, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </span>
              ))}
              <span className="ml-1 text-[10px] leading-tight text-white/45">
                Social channels
                <br />
                not yet published
              </span>
            </div>
          </div>

          <nav aria-label="Explore">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/70 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Support
            </h3>
            <ul className="mt-5 space-y-3">
              {support.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/70 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="mailto:support@safekid.com"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary/80" aria-hidden="true" />
                  support@safekid.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+84123456789"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary/80" aria-hidden="true" />
                  +(84) 123 456 789
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" aria-hidden="true" />
                Ho Chi Minh City, Vietnam
              </li>
            </ul>
            <p className="mt-6 max-w-[30ch] text-[11px] leading-relaxed text-white/50">
              Contact details are shown for this concept demonstration. No orders or payments are
              processed on this site.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-[11px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SafeKid · Concept site for demonstration</p>
          <p>
            Developed by <span className="text-white/65">DigiBabi</span>
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden px-4 pb-2 text-center font-display text-[19vw] font-semibold leading-[0.75] tracking-[-0.05em] text-white/[0.045]"
      >
        SafeKid
      </div>
    </footer>
  );
}
