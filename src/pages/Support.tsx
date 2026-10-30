import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, HelpCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    title: "Zodiac collection",
    description: "Explore all 12 character editions inspired by the Vietnamese Zodiac.",
    href: "/zodiac",
    link: "Explore the collection",
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
      "This site presents a SafeKid product and brand concept. It does not connect to a watch, an account or a live service.",
  },
  {
    question: "Are the watch features available to use?",
    answer:
      "No live device features are connected on this site. Location, calling, safe-zone and SOS references describe the concept only.",
  },
  {
    question: "Do the Zodiac editions have different features?",
    answer:
      "The collection presents 12 visual designs for the same watch concept. Product specifications and edition availability have not been confirmed.",
  },
  {
    question: "Can I place an order or make a payment?",
    answer:
      "No. This concept site does not process orders or payments. Pricing, shipping and return policies are not currently confirmed.",
  },
  {
    question: "How can I contact the team?",
    answer:
      "Use the Contact page or email safekid.digibabi@gmail.com to reach the SafeKid / DigiBabi team.",
  },
];

export default function Support() {
  usePageTitle(
    "Support | SafeKid",
    "Clear answers about the SafeKid concept, the Zodiac collection and how to reach the team."
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
        intro="Find your way around the SafeKid concept, browse the collection, or get in touch with the team."
        actions={
          <a
            href="#faq"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion"
          >
            Browse common questions
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
        }
        meta="Concept site · Store, payment and delivery services are not active"
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
              Quick links to the most useful parts of the SafeKid concept site.
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
              This page stays focused on what the concept currently represents, and clear about what
              is not yet available.
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

      <section className="bg-white py-16">
        <div className="shell">
          <div className="flex flex-col gap-5 rounded-[26px] border border-ink/10 bg-mist/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-deep/60">
                  Concept site
                </p>
                <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
                  SafeKid is currently presented here as a product concept. Store, payment, delivery,
                  return and live device services are not active on this website.
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
