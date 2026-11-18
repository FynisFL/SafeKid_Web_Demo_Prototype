import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, HelpCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatVnd, WATCH_PRICE_VND } from "@/components/shop/shoppingBag";
import { usePageTitle } from "@/hooks/usePageTitle";

const TOPICS = [
  {
    number: "01",
    title: "Product & features",
    description: "Learn what the SafeKid watch concept is designed to represent.",
    href: "#faq",
    link: "Read common questions",
  },
  {
    number: "02",
    title: "Parent App",
    description: "Try the Web App or check the Android test build.",
    href: "/app",
    link: "Explore the Parent App",
    internal: true,
  },
  {
    number: "03",
    title: "Talk to the team",
    description: "Have feedback or a question about the concept? Send the team a note.",
    href: "/contact",
    link: "Get in touch",
    internal: true,
  },
];

const FAQS = [
  {
    question: "What is SafeKid right now?",
    answer:
      "SafeKid has a store preview and a separate Parent App in testing. You can explore twelve watch designs, add them to your bag and preview checkout. Watch orders are closed.",
  },
  {
    question: "Are the watch features available to use?",
    answer:
      "No live device features are connected on this site. Location, calling, safe-zone and SOS references describe the concept only.",
  },
  {
    question: "Do the Zodiac editions have different features?",
    answer:
      "The collection presents twelve visual designs for the same planned watch. Final edition specifications are pending and all watch orders are currently closed.",
  },
  {
    question: "Can I place an order or make a payment?",
    answer:
      "The store preview lets you add editions to your bag and explore checkout. Ordering and payments are closed until launch. Shipping and return details are pending.",
  },
  {
    question: "How much does a SafeKid watch cost?",
    answer: `Each watch is listed at ${formatVnd(WATCH_PRICE_VND)}. Preview checkout shows shipping, VAT and platform fees as Free. These are preview amounts; launch rates may differ.`,
  },
  {
    question: "How can I try the Parent App?",
    answer: "Open the Parent App page to launch the Web App on iPhone, Android or desktop, or check the Android APK test release. The Web App and Android app keep their data separately. The location view shows the device running the app.",
  },
  {
    question: "How can I contact the team?",
    answer:
      "Use the Contact page to email safekid.digibabi@gmail.com, call 0377 430 400, or open the SafeKid Facebook page.",
  },
];

export default function Support() {
  usePageTitle(
    "Support | SafeKid",
    "Help with the SafeKid store preview, watch pricing, Parent App testing and contacting the team."
  );

  return (
    <SiteLayout>
      <PageHero
        compact
        eyebrow="Here to help you find your way"
        title={
          <>
            Clear answers
            <br />
            for <span className="text-primary">SafeKid.</span>
          </>
        }
        intro="Find help with the store preview and Parent App, browse the collection, or get in touch with the team."
        actions={
          <a
            href="#faq"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
          >
            Browse common questions
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
        }
        meta="Store preview available · Parent App testing · Watch orders closed"
        art={
          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <div aria-hidden="true" className="stage-glow absolute inset-[4%] rounded-full" />
            <div aria-hidden="true" className="absolute inset-[14%] rounded-full border border-primary/25" />
            <div
              aria-hidden="true"
              className="absolute inset-[24%] rounded-full border border-dashed border-primary/25 animate-sk-spin"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-32 w-32 items-center justify-center rounded-[36px] bg-white text-primary shadow-[0_30px_60px_-30px_rgba(16,42,56,0.35)]">
                <HelpCircle className="h-14 w-14" aria-hidden="true" strokeWidth={1.3} />
              </span>
            </div>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-deep/55 backdrop-blur">
              One family, one question at a time
            </span>
          </div>
        }
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                How can we help?
              </p>
              <h2 className="display display-lg mt-6 max-w-[18ch]">
                Start with what
                <br />
                you're <span className="text-primary">looking for.</span>
              </h2>
            </div>
            <p className="max-w-[32ch] text-[13.5px] leading-relaxed text-muted-foreground lg:pb-2">
              Quick links to product details, Parent App testing and the SafeKid team.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {TOPICS.map((topic, index) => {
              const content = (
                <>
                  <span className="flex items-center justify-between">
                    <span className="text-[9.5px] uppercase tracking-[0.2em] text-primary">
                      {topic.number}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-deep/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-8 block font-display text-[20px] font-medium tracking-[-0.03em] text-ink">
                    {topic.title}
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-muted-foreground">
                    {topic.description}
                  </span>
                  <span className="mt-6 block text-[12px] font-medium text-ink">{topic.link}</span>
                </>
              );

              return (
                <Reveal key={topic.number} variant="soft" delay={index * 0.06}>
                  <TiltCard className="h-full rounded-[26px]">
                  {topic.internal ? (
                    <Link
                      to={topic.href}
                      className="group flex h-full flex-col rounded-[26px] border border-ink/10 bg-mist/50 p-6 transition-colors duration-500 hover:border-primary/30 hover:bg-white"
                    >
                      {content}
                    </Link>
                  ) : (
                    <a
                      href={topic.href}
                      className="group flex h-full flex-col rounded-[26px] border border-ink/10 bg-mist/50 p-6 transition-colors duration-500 hover:border-primary/30 hover:bg-white"
                    >
                      {content}
                    </a>
                  )}
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-mist py-20 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              The details
            </p>
            <h2 className="display display-lg mt-6">
              Frequently
              <br />
              asked <span className="text-primary">questions.</span>
            </h2>
            <p className="mt-5 max-w-[36ch] text-[13.5px] leading-relaxed text-muted-foreground">
              Find the current watch price, learn how preview checkout works, and get started with
              the Parent App test build.
            </p>
            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-ink"
            >
              Still have a question?
              <ArrowUpRight
                className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <Accordion type="single" collapsible className="border-t border-ink/10">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border-ink/10">
                <AccordionTrigger className="group gap-4 py-5 text-left hover:no-underline [&>svg]:hidden">
                  <span className="flex items-baseline gap-4">
                    <span className="text-[9.5px] tabular-nums tracking-[0.16em] text-deep/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[16.5px] font-medium tracking-[-0.02em] text-ink sm:text-[18px]">
                      {faq.question}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/12 text-deep/50 transition-all duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:border-primary/40 group-data-[state=open]:text-primary"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-9 pr-10 text-[13.5px] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section aria-labelledby="before-launch-title" className="bg-white py-16">
        <div className="shell">
          <h2 id="before-launch-title" className="display display-md">Before you check out</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                id: "payments",
                title: "Payment methods",
                body: "Preview Bank QR (VNPAY-QR), debit or credit card, and MoMo in checkout. Confirm payment opens a notice that ordering is closed. Card entry, QR transfers and wallet payments will be available when ordering opens.",
              },
              {
                id: "shipping",
                title: "Shipping & preview fees",
                body: "Preview totals show shipping, VAT and platform fees as Free. These are preview amounts. Delivery areas, shipping rates, tax treatment and delivery times will be published before watch orders open.",
              },
              {
                id: "returns",
                title: "Returns & warranty",
                body: "Return, refund and warranty terms will be published before watch orders open. Watch Passport displays sample lifecycle and warranty information. Contact the team if you have a question about the planned product.",
              },
              {
                id: "privacy",
                title: "Privacy & data",
                body: "Your shopping bag is saved in this browser. Checkout asks for no address or card details. Contact opens your email app so you can send your message. S-F AI is a local scripted demo. The Web App and Android Parent App store data separately; their location view shows the device running the app.",
              },
            ].map(({ id, title, body }) => (
              <Reveal key={id} variant="soft">
                <article id={id} className="h-full scroll-mt-28 rounded-[26px] border border-border bg-mist/50 p-6">
                  <h3 className="font-display text-xl font-medium tracking-tight text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-deep/75">{body}</p>
                  {id === "payments" && <Link className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-ink underline underline-offset-4" to="/checkout">Explore checkout</Link>}
                  {id === "privacy" && <Link className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-ink underline underline-offset-4" to="/app">Explore the Parent App</Link>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="shell">
          <div className="flex flex-col gap-5 rounded-[26px] border border-ink/10 bg-mist/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-deep/60">
                  Before launch
                </p>
                <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
                  Explore the store preview and Parent App test build today. Watch ordering, payment
                  collection and fulfilment will open at launch.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-[13px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion sm:self-auto"
            >
              Ask us about SafeKid
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
