import { useRef, useCallback } from "react";
import { LandingFooter, LandingHeader } from "../components/LandingChrome.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import useParallax from "../hooks/useParallax.js";
import InteractiveCard from "../components/InteractiveCard.jsx";
import "../styles/safekid-landing.css";
import "../styles/support-page.css";
import "../styles/interactive.css";

const faqs = [
  ["What is SafeKid right now?", "This site presents a SafeKid product and brand concept. It does not connect to a watch, account, or live service."],
  ["Are the watch features available to use?", "No live device features are connected on this site. Location, calling, safe-zone, and SOS references describe the concept only."],
  ["Do the Zodiac editions have different features?", "The collection presents 12 visual designs for the same watch concept. Product specifications and edition availability have not been confirmed."],
  ["Can I place an order or make a payment?", "No. This concept site does not process orders or payments. Pricing, shipping, and return policies are not currently confirmed."],
  ["How can I contact the team?", "Use the Contact page or email support@safekid.com to reach the SafeKid / DigiBabi team."],
];

const topics = [
  {
    number: "01",
    title: "Product & features",
    description: "Learn what the SafeKid watch concept is designed to represent.",
    href: "#support-faq",
    link: "Read common questions",
  },
  {
    number: "02",
    title: "Zodiac collection",
    description: "Explore all 12 character editions inspired by the Vietnamese Zodiac.",
    href: "#/zodiac",
    link: "Explore the collection",
  },
  {
    number: "03",
    title: "Talk to the team",
    description: "Have feedback or a question about the concept? Send the team a note.",
    href: "#/contact",
    link: "Get in touch",
  },
];

export default function SupportPage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  useParallax(pageRef, { speed: 0.05 });

  const handleFaqClick = useCallback((event) => {
    event.preventDefault();
    const btn = event.currentTarget;
    const item = btn.parentElement;
    if (!item) return;
    const isOpen = item.classList.contains("is-open");
    item.classList.toggle("is-open", !isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
  }, []);

  const handleFaqKeyDown = useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleFaqClick(event);
    }
  }, [handleFaqClick]);

  return (
    <div className="safekid-landing support-page" ref={pageRef}>
      <LandingHeader variant="support" />
      <main>
        <section className="support-hero">
          <div className="landing-container support-hero-inner">
            <div data-reveal="up">
              <p className="landing-eyebrow"><span /> HERE TO HELP YOU FIND YOUR WAY</p>
              <h1 className="landing-display">Clear answers<br />for SafeKid.</h1>
              <p>Find your way around the SafeKid concept, browse the collection, or get in touch with the team.</p>
              <a className="support-hero-link" href="#support-faq">Browse common questions <span aria-hidden="true">↓</span></a>
            </div>
            <div className="support-hero-art" data-reveal="fade" aria-hidden="true">
              <InteractiveCard intensity={4} scaleOnHover={1.01} glowColor="#00C7CA">
                <span className="support-orbit support-orbit-one" data-motion="spin-slow" />
                <span className="support-orbit support-orbit-two" data-motion="spin-slow" />
                <span className="support-orbit support-orbit-three" data-motion="spin-slow" />
                <span className="support-hero-mark" data-motion="drift">?</span>
                <span className="support-hero-dot" data-motion="pulse" />
                <p>ONE FAMILY<br />ONE QUESTION AT A TIME</p>
              </InteractiveCard>
            </div>
          </div>
        </section>

        <section className="landing-container support-topics">
          <div className="support-section-heading" data-reveal="up">
            <div>
              <p className="landing-eyebrow"><span /> HOW CAN WE HELP?</p>
              <h2 className="landing-display">Start with what<br />you’re looking for.</h2>
            </div>
            <p>Quick links to the most useful parts of the SafeKid concept site.</p>
          </div>
          <div className="support-topic-grid">
            {topics.map((topic, index) => (
              <InteractiveCard key={topic.number} intensity={5} scaleOnHover={1.02} glowColor="#00C7CA" as="a" className="support-topic-card" data-reveal="up" data-reveal-delay={String(index + 1)} href={topic.href}>
                <span>{topic.number}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <strong>{topic.link} <i aria-hidden="true">→</i></strong>
              </InteractiveCard>
            ))}
          </div>
        </section>

        <section className="support-faq-section" id="support-faq">
          <div className="landing-container support-faq-layout">
            <div className="support-faq-intro" data-reveal="up">
              <p className="landing-eyebrow"><span /> THE DETAILS</p>
              <h2 className="landing-display">Frequently<br />asked questions.</h2>
              <p>We’ll keep this page focused on what is currently represented by the concept, and clear about what is not yet available.</p>
              <a href="#/contact">Still have a question? <span aria-hidden="true">→</span></a>
            </div>
            <div className="support-faq-list" data-reveal="up" data-reveal-delay="1">
              {faqs.map(([question, answer], index) => (
                <div key={question} data-reveal="up" data-reveal-delay={String(index + 1)}>
                  <button
                    className="support-faq-summary"
                    onClick={handleFaqClick}
                    onKeyDown={handleFaqKeyDown}
                    aria-expanded="false"
                    type="button"
                  >
                    <span className="support-faq-number">{String(index + 1).padStart(2, "0")}</span>
                    <span>{question}</span>
                    <i aria-hidden="true" />
                  </button>
                  <div className="support-faq-answer">
                    <div>
                      <p>{answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="support-concept-note">
          <div className="landing-container support-concept-inner" data-reveal="up">
            <span className="support-concept-indicator"><i /> CONCEPT SITE</span>
            <p>SafeKid is currently presented here as a product concept. Store, payment, delivery, return, and live device services are not active on this website.</p>
            <a href="#/contact">Ask us about SafeKid <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>
      <LandingFooter variant="support" />
    </div>
  );
}
