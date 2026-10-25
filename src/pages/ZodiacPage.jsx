import { useRef } from "react";
import { LandingFooter, LandingHeader } from "../components/LandingChrome.jsx";
import { zodiacProducts } from "../data/zodiac.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "../styles/safekid-landing.css";
import "../styles/zodiac-page.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function EditionCard({ product, index }) {
  return (
    <article
      className="zodiac-edition-card"
      data-reveal="up"
      data-reveal-delay={String(index % 3 + 1)}
    >
      <a className="zodiac-edition-art" href={`#/product/${product.id}`} aria-label={`Explore the ${product.label} SafeKid concept`}>
        <span className="zodiac-edition-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="zodiac-edition-halo" aria-hidden="true" />
        <img src={product.image} alt={`${product.label} edition SafeKid smartwatch concept`} loading="lazy" />
        <span className="zodiac-edition-art-link">Explore <ArrowIcon /></span>
      </a>
      <div className="zodiac-edition-info">
        <div>
          <span>VIETNAMESE ZODIAC / {product.animal.toUpperCase()}</span>
          <h2>{product.label} edition</h2>
        </div>
        <a href={`#/product/${product.id}`} aria-label={`View ${product.label} edition details`}><ArrowIcon /></a>
      </div>
    </article>
  );
}

export default function ZodiacPage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);

  return (
    <div className="safekid-landing zodiac-page" ref={pageRef}>
      <LandingHeader variant="zodiac" />
      <main>
        <section className="zodiac-hero">
          <div className="landing-container zodiac-hero-inner">
            <div className="zodiac-hero-copy" data-reveal="up">
              <p className="landing-eyebrow"><span /> INSPIRED BY THE VIETNAMESE ZODIAC</p>
              <h1 className="landing-display" data-reveal="up" data-reveal-delay="1">Twelve little<br /><em>explorers.</em></h1>
              <p>Meet the SafeKid collection: playful Zodiac-inspired designs imagined for the curious little people finding their way in the world.</p>
              <a className="zodiac-hero-link" href="#zodiac-editions">Explore all 12 editions <ArrowIcon /></a>
            </div>
            <div className="zodiac-hero-art" data-reveal="fade" data-motion="drift">
              <span className="zodiac-hero-orbit zodiac-hero-orbit-one" aria-hidden="true" />
              <span className="zodiac-hero-orbit zodiac-hero-orbit-two" aria-hidden="true" />
              <img src={zodiacProducts[0].image} alt="Mouse edition SafeKid smartwatch concept" />
              <span className="zodiac-hero-caption"><i /> A COLLECTION WITH CHARACTER</span>
            </div>
          </div>
        </section>

        <section className="zodiac-intro">
          <div className="landing-container zodiac-intro-inner" data-reveal="up">
            <p className="landing-eyebrow landing-eyebrow-light"><span /> ONE DESIGN, TWELVE PERSONALITIES</p>
            <h2 className="landing-display">A familiar little friend<br />for every big adventure.</h2>
            <p>Each edition brings a different Vietnamese Zodiac character to the same SafeKid watch concept. Choose a favorite to explore its design.</p>
          </div>
        </section>

        <section className="landing-container zodiac-gallery" id="zodiac-editions">
          <div className="zodiac-gallery-heading" data-reveal="up">
            <div>
              <p className="landing-eyebrow"><span /> FIND THEIR FAVORITE</p>
              <h2 className="landing-display">Meet the collection.</h2>
            </div>
            <p>12 designs <i /> One SafeKid concept</p>
          </div>
          <div className="zodiac-edition-grid">
            {zodiacProducts.map((product, index) => (
              <EditionCard product={product} index={index} key={product.id} />
            ))}
          </div>
          <p className="zodiac-concept-note">These are design concepts. Pricing, availability, and live device capabilities have not been confirmed.</p>
        </section>

        <section className="zodiac-closing">
          <div className="landing-container zodiac-closing-inner" data-reveal="up">
            <p className="landing-eyebrow landing-eyebrow-light"><span /> THEIR NEXT CHAPTER</p>
            <h2 className="landing-display">Which one feels<br /><em>like them?</em></h2>
            <p>Take a closer look at an edition, or get in touch to talk about the SafeKid concept.</p>
            <div>
              <a className="zodiac-closing-button" href="#/contact">Talk to the SafeKid team <ArrowIcon /></a>
              <a className="zodiac-closing-text-link" href="#/">Back to the SafeKid story</a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter variant="zodiac" />
    </div>
  );
}
