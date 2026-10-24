import { useEffect, useRef } from "react";
import { LandingFooter, LandingHeader } from "../components/LandingChrome.jsx";
import { zodiacProducts } from "../data/zodiac.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "../styles/safekid-landing.css";
import "../styles/product-page.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function ProductArtwork({ product }) {
  return (
    <div className="product-artwork" data-reveal="fade">
      <span className="product-artwork-orbit product-artwork-orbit-one" aria-hidden="true" />
      <span className="product-artwork-orbit product-artwork-orbit-two" aria-hidden="true" />
      <span className="product-artwork-index">{product.animal}</span>
      <img src={product.image} alt={`${product.label} edition SafeKid smartwatch concept`} />
      <span className="product-artwork-caption"><i /> VIETNAMESE ZODIAC / {product.animal.toUpperCase()}</span>
    </div>
  );
}

function ConceptPillars() {
  return (
    <section className="product-pillars">
      <div className="landing-container">
        <div className="product-section-heading" data-reveal="up">
          <p className="landing-eyebrow"><span /> THE IDEA BEHIND SAFEKID</p>
          <h2 className="landing-display">A little watch.<br /><em>A lot of meaning.</em></h2>
          <p>Every edition belongs to the same story: making room for growing up, while keeping family connection close.</p>
        </div>
        <div className="product-pillar-grid">
          <article className="product-pillar" data-reveal="up" data-reveal-delay="1">
            <span>01 / THE CHILD</span>
            <h3>Room to discover.</h3>
            <p>A concept designed around the small steps children take as their world gets bigger.</p>
          </article>
          <article className="product-pillar" data-reveal="up" data-reveal-delay="2">
            <span>02 / THE FAMILY</span>
            <h3>Connection that reassures.</h3>
            <p>SafeKid imagines a simpler way for children and the people who care for them to stay in touch.</p>
          </article>
          <article className="product-pillar" data-reveal="up" data-reveal-delay="3">
            <span>03 / THEIR EDITION</span>
            <h3>A character of their own.</h3>
            <p>One of twelve playful designs inspired by the Vietnamese Zodiac, with its own little personality.</p>
          </article>
        </div>
        <p className="product-concept-note">Concept overview only — this page does not represent a live device, connected app, confirmed specification, price, or offer.</p>
      </div>
    </section>
  );
}

function RelatedEditions({ product }) {
  const productIndex = zodiacProducts.findIndex((item) => item.id === product.id);
  const relatedProducts = Array.from({ length: 4 }, (_, index) =>
    zodiacProducts[(productIndex + index + 1) % zodiacProducts.length],
  );

  return (
    <section className="product-related">
      <div className="landing-container">
        <div className="product-related-heading" data-reveal="up">
          <div>
            <p className="landing-eyebrow"><span /> KEEP EXPLORING</p>
            <h2 className="landing-display">Meet another<br /><em>little character.</em></h2>
          </div>
          <a className="product-related-all" href="#/zodiac">See all 12 editions <ArrowIcon /></a>
        </div>
        <div className="product-related-grid">
          {relatedProducts.map((item, index) => (
            <a
              className="product-related-card"
              data-reveal="up"
              data-reveal-delay={String(index + 1)}
              href={`#/product/${item.id}`}
              key={item.id}
            >
              <span className="product-related-art">
                <img src={item.image} alt="" loading="lazy" />
              </span>
              <span className="product-related-copy">
                <span>VIETNAMESE ZODIAC / {item.animal.toUpperCase()}</span>
                <strong>{item.label}</strong>
              </span>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductPage({ product }) {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);

  useEffect(() => {
    document.title = `${product.detailTitle} | SafeKid`;
  }, [product]);

  return (
    <div className="safekid-landing product-page" ref={pageRef}>
      <LandingHeader variant="product" />
      <main>
        <section className="product-hero">
          <div className="landing-container product-hero-inner">
            <ProductArtwork product={product} />
            <div className="product-hero-copy" data-reveal="up">
              <a className="product-back-link" href="#/zodiac"><ArrowIcon /> Zodiac collection</a>
              <p className="landing-eyebrow"><span /> SAFEKID / ZODIAC EDITION {product.animal.toUpperCase()}</p>
              <h1 className="landing-display">{product.label}<br /><em>little explorer.</em></h1>
              <p className="product-hero-description">
                Meet the {product.label} edition — a Vietnamese Zodiac-inspired character in the SafeKid watch concept.
              </p>
              <div className="product-hero-actions">
                <a className="product-primary-link" href="#/contact">Ask about this edition <ArrowIcon /></a>
                <a className="product-secondary-link" href="#product-story">Discover the idea</a>
              </div>
              <p className="product-hero-note"><span /> Design concept · No price or availability confirmed</p>
            </div>
          </div>
        </section>

        <section className="product-story" id="product-story">
          <div className="landing-container product-story-inner" data-reveal="up">
            <p className="landing-eyebrow landing-eyebrow-light"><span /> A DESIGN WITH A STORY</p>
            <h2 className="landing-display">A familiar character<br />for <em>unfamiliar adventures.</em></h2>
            <p>
              Inspired by {product.animal} in the Vietnamese Zodiac, this edition brings a little character to the SafeKid idea: giving children space to explore, with family connection at heart.
            </p>
            <a href="#/zodiac">Back to all Zodiac editions <ArrowIcon /></a>
          </div>
        </section>

        <ConceptPillars />
        <RelatedEditions product={product} />
      </main>
      <LandingFooter variant="product" />
    </div>
  );
}
