import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { usePageTitle } from "@/hooks/usePageTitle";

const DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "safekid.digibabi@gmail.com",
    href: "mailto:safekid.digibabi@gmail.com",
    external: false,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0377 430 400",
    href: "tel:+84377430400",
    external: false,
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "SafeKid on Facebook",
    href: "https://facebook.com/DigiBabi",
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Ho Chi Minh City, Vietnam",
    external: false,
  },
];

export default function Contact() {
  const [draftOpened, setDraftOpened] = useState(false);
  usePageTitle(
    "Contact | SafeKid",
    "Talk to the SafeKid team about the concept or the Zodiac collection. The form opens an email draft; nothing is sent automatically."
  );

  function openEmailDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");

    setDraftOpened(true);
    window.location.href = `mailto:safekid.digibabi@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  const fieldClass =
    "field-motion mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 font-sans text-[14px] text-ink outline-none transition-colors placeholder:text-deep/45 focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <SiteLayout>
      <PageHero
        compact
        eyebrow="Let's start a conversation"
        title={
          <>
            Let's talk
            <br />
            <span className="text-primary">SafeKid.</span>
          </>
        }
        intro="Curious about SafeKid or the idea behind the collection? We'd love to hear what you think."
        actions={
          <a
            href="mailto:safekid.digibabi@gmail.com"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
          >
            Write to the SafeKid team
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        }
        meta="Form opens an email draft · Nothing is sent automatically"
        art={
          <div className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
            <div aria-hidden="true" className="stage-glow absolute inset-[4%] rounded-full" />
            <div aria-hidden="true" className="absolute inset-[13%] rounded-full border border-primary/20" />
            <div
              aria-hidden="true"
              className="absolute inset-[22%] rounded-full border border-dashed border-primary/25 animate-sk-spin"
            />
            <p
              aria-hidden="true"
              className="relative select-none font-display text-[10rem] font-semibold leading-none tracking-[-0.08em] text-ink/[0.09]"
            >
              S<span className="text-primary/35">.</span>
            </p>
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <p className="rounded-full border border-white/80 bg-white/80 px-3.5 py-2 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-deep/55 backdrop-blur">
                Room to grow · Space to connect
              </p>
            </div>
          </div>
        }
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal variant="soft">
            <form onSubmit={openEmailDraft} className="rounded-[28px] border border-ink/10 bg-mist/40 p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <p className="text-[9.5px] uppercase tracking-[0.2em] text-primary">
                    01 / Your message
                  </p>
                  <h2 className="mt-2 font-display text-[22px] font-medium tracking-[-0.03em] text-ink">
                    What's on your mind?
                  </h2>
                </div>
                <span className="hidden text-[10px] uppercase tracking-[0.16em] text-deep/50 sm:block">
                  Draft only
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-deep/55">
                    Your name
                  </span>
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="How should we address you?"
                    required
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-deep/55">
                    Email address
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className={fieldClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-deep/55">
                    Subject
                  </span>
                  <input
                    name="subject"
                    placeholder="What would you like to talk about?"
                    required
                    className={fieldClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-deep/55">
                    Message
                  </span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Share a little more…"
                    required
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Open email draft
                </button>
                <p className="max-w-[38ch] text-[11px] leading-relaxed text-deep/60">
                  Your email app opens with this message ready. Nothing is sent until you press Send.
                </p>
              </div>

              <div aria-live="polite" className="mt-5">
                {draftOpened && (
                  <div className="rounded-2xl border border-primary/25 bg-white px-4 py-3 text-[12px] leading-relaxed text-deep/70">
                    An email draft should have opened. If nothing happened, email{" "}
                    <a
                      className="font-medium text-ink underline decoration-primary/40 underline-offset-2"
                      href="mailto:safekid.digibabi@gmail.com"
                    >
                      safekid.digibabi@gmail.com
                    </a>
                    . This concept site does not send messages automatically.
                  </div>
                )}
              </div>
            </form>
          </Reveal>

          <Reveal variant="soft" delay={0.08}>
            <aside className="h-full rounded-[28px] border border-ink/10 bg-white p-6 sm:p-8">
              <p className="text-[9.5px] uppercase tracking-[0.2em] text-primary">02 / Direct contact</p>
              <h2 className="mt-2 font-display text-[22px] font-medium tracking-[-0.03em] text-ink">
                Here's where
                <br />
                to find us.
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Prefer email or a quick call? Get in touch using the details below.
              </p>

              <ul className="mt-7 space-y-3">
                {DETAILS.map((detail) => {
                  const Icon = detail.icon;
                  const inner = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary-foreground">
                        <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[9px] uppercase tracking-[0.18em] text-deep/55">
                          {detail.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] font-medium text-ink">
                          {detail.value}
                        </span>
                      </span>
                      {detail.href && (
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-deep/40 transition-colors group-hover:text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  );

                  return (
                    <li key={detail.label}>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={detail.external ? "_blank" : undefined}
                          rel={detail.external ? "noopener noreferrer" : undefined}
                          className="group press flex items-center gap-3 rounded-2xl border border-ink/[0.08] px-3.5 py-3 transition-all duration-300 hover:translate-x-1 hover:border-primary/30 hover:bg-mist/50"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] px-3.5 py-3">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 border-t border-ink/10 pt-4">
                <p className="flex items-center gap-2 text-[11px] text-deep/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Developed by <span className="font-medium text-ink">DigiBabi</span>
                </p>
                <p className="mt-3 text-[10.5px] leading-relaxed text-deep/55">
                  Details are shown for this concept demonstration. No orders, payments or live
                  support queues are active.
                </p>
              </div>

              <Link
                to="/support"
                className="group mt-5 inline-flex items-center gap-2 text-[12.5px] font-medium text-ink"
              >
                Read the support notes
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
