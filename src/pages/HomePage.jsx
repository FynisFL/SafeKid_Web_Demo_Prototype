import { useEffect, useRef, useState } from "react";
import heroWatch from "../assets/figma/zodiac-collection-hero-watch.png";
import { LandingFooter, LandingHeader } from "../components/LandingChrome.jsx";
import { zodiacProducts } from "../data/zodiac.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "../styles/safekid-landing.css";

const editionNames = {
  rat: "Mouse",
  buffalo: "Buffalo",
  tiger: "Tiger",
  cat: "Kitty",
  dragon: "Dragon",
  snake: "Snake",
  horse: "Pony",
  sheep: "Sheep",
  monkey: "Monkey",
  rooster: "Chick",
  dog: "Puppy",
  pig: "Piggy",
};

function ArrowIcon() {
  return (
    <svg className="landing-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function Hero({ heroRef }) {
  return (
    <section className="landing-hero" id="top" ref={heroRef}>
      <div className="landing-hero-glow" aria-hidden="true" />
      <div className="landing-container landing-hero-inner">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><span /> A LITTLE MORE ROOM TO GROW</p>
          <h1 className="landing-display landing-hero-title">
            Let them<br />explore <em>the world.</em>
          </h1>
          <p className="landing-hero-description">
            A little independence for them. A little more reassurance for you. SafeKid brings both sides closer.
          </p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-dark" href="#story">Discover SafeKid <ArrowIcon /></a>
            <a className="landing-text-link" href="#collection">Meet the 12 Zodiac editions <ArrowIcon /></a>
          </div>
        </div>
        <div className="landing-hero-art" aria-label="SafeKid Vietnamese Zodiac smartwatch concept">
          <span className="landing-hero-orbit landing-hero-orbit-one" aria-hidden="true" />
          <span className="landing-hero-orbit landing-hero-orbit-two" aria-hidden="true" />
          <span className="landing-hero-orbit landing-hero-orbit-three" aria-hidden="true" />
          <img
            className="landing-hero-watch"
            src={heroWatch}
            alt="SafeKid smartwatch, Mouse edition, from the Vietnamese Zodiac collection"
          />
          <p className="landing-hero-art-caption"><span /> MADE FOR THEIR NEXT LITTLE ADVENTURE</p>
        </div>
        <a className="landing-scroll-cue" href="#story" aria-label="Scroll to the SafeKid story">
          <span /> Scroll to explore
        </a>
      </div>
    </section>
  );
}

function Purpose() {
  return (
    <section className="landing-purpose" id="purpose">
      <div className="landing-container landing-purpose-inner">
        <div className="landing-purpose-heading" data-reveal="up">
          <p className="landing-eyebrow landing-eyebrow-light"><span /> WHY SAFE KID</p>
          <h2 className="landing-display">Growing up means<br />taking <em>small steps.</em></h2>
        </div>
        <div className="landing-purpose-copy" data-reveal="up" data-reveal-delay="1">
          <p className="landing-purpose-lead">
            The walk to a friend's home. The first trip around the block. Ordinary moments that feel like a big new beginning.
          </p>
          <p>
            SafeKid is a product concept built around that in-between space: giving children room to discover, while helping families feel connected as they do.
          </p>
          <a className="landing-light-link" href="#collection">Find their kind of adventure <ArrowIcon /></a>
        </div>
        <div className="landing-purpose-mark" aria-hidden="true">S<span>.</span></div>
      </div>
    </section>
  );
}

function StoryScene({ sectionRef, stageRef }) {
  return (
    <section className="landing-story" id="story" ref={sectionRef}>
      <div className="landing-container landing-story-intro">
        <div data-reveal="up">
          <p className="landing-eyebrow"><span /> THE SAFE KID STORY</p>
          <h2 className="landing-display">A little distance.<br />A lasting connection.</h2>
        </div>
        <p className="landing-story-intro-note" data-reveal="up" data-reveal-delay="1">A product concept, imagined around the moments that help children grow.</p>
      </div>
      <div className="landing-story-track">
        <div className="landing-story-stage" ref={stageRef}>
          <div className="landing-story-backdrop" aria-hidden="true" />
          <div className="landing-container landing-story-layout">
            <div className="landing-story-copy">
              <article className="landing-story-beat landing-story-beat-1">
                <span>01 / THE FIRST STEP</span>
                <h3>Room to explore.</h3>
                <p>Growing up starts with a few more steps taken on their own.</p>
              </article>
              <article className="landing-story-beat landing-story-beat-2">
                <span>02 / A WAY TO REACH YOU</span>
                <h3>Close, even from afar.</h3>
                <p>A simple call can make a new adventure feel a little less far away.</p>
              </article>
              <article className="landing-story-beat landing-story-beat-3">
                <span>03 / TWO PERSPECTIVES</span>
                <h3>One shared moment.</h3>
                <p>A watch for their world. A parent-app concept for yours.</p>
              </article>
              <article className="landing-story-beat landing-story-beat-4">
                <span>04 / WHAT MATTERS</span>
                <h3>Independence, with connection.</h3>
                <p>More confidence for children. More peace of mind for the people who love them.</p>
              </article>
              <div className="landing-story-progress" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
            </div>

            <div className="landing-story-product">
              <div className="landing-story-product-halo" aria-hidden="true" />
              <img src={heroWatch} alt="SafeKid smartwatch concept" />
              <span className="landing-story-product-label">THE CHILD'S WORLD</span>
            </div>

            <div className="landing-story-connector" aria-hidden="true"><span /></div>

            <div className="landing-parent-app" aria-label="Illustration of a parent app concept">
              <div className="landing-app-topline">
                <span className="landing-app-avatar">S</span>
                <span>SafeKid family</span>
                <i aria-hidden="true" />
              </div>
              <div className="landing-app-map">
                <span className="landing-map-road landing-map-road-one" />
                <span className="landing-map-road landing-map-road-two" />
                <span className="landing-map-road landing-map-road-three" />
                <span className="landing-map-pin"><span /></span>
                <span className="landing-map-label">On the way</span>
              </div>
              <div className="landing-app-child">
                <span className="landing-app-child-avatar">S</span>
                <span><strong>Little explorer</strong><small>Parent-app concept</small></span>
                <span className="landing-app-call" aria-hidden="true"><ArrowIcon /></span>
              </div>
              <p className="landing-app-disclaimer">Illustrative screen only. No live location or device connection.</p>
            </div>
            <p className="landing-story-disclaimer">A visual concept — no watch is connected and no live data is shown.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductOverview() {
  return (
    <section className="landing-overview">
      <div className="landing-container">
        <div className="landing-overview-heading" data-reveal="up">
          <div>
            <p className="landing-eyebrow"><span /> DESIGNED AROUND FAMILY</p>
            <h2 className="landing-display">A little watch.<br />A lot of meaning.</h2>
          </div>
          <p>SafeKid brings together thoughtful everyday capabilities and a playful collection, all with one purpose: helping families stay close as children grow.</p>
        </div>
        <div className="landing-overview-grid">
          <article className="landing-overview-card" data-reveal="up" data-reveal-delay="1">
            <span className="landing-overview-number">01</span>
            <div className="landing-overview-icon landing-icon-location" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none"><path d="M38 20c0 11-14 23-14 23S10 31 10 20a14 14 0 1 1 28 0Z" /><circle cx="24" cy="20" r="4.5" /></svg>
            </div>
            <h3>A little more reassurance.</h3>
            <p>Location and safe-zone ideas are designed to help parents stay informed as a child explores.</p>
          </article>
          <article className="landing-overview-card" data-reveal="up" data-reveal-delay="2">
            <span className="landing-overview-number">02</span>
            <div className="landing-overview-icon landing-icon-call" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none"><path d="M17 8h14a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z" /><path d="M21 34h6" /><path d="M21 16h6" /></svg>
            </div>
            <h3>A simple way to connect.</h3>
            <p>Two-way calling is at the heart of the concept: one familiar way for a child and parent to reach each other.</p>
          </article>
          <article className="landing-overview-card" data-reveal="up" data-reveal-delay="3">
            <span className="landing-overview-number">03</span>
            <div className="landing-overview-icon landing-icon-spark" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none"><path d="m24 5 4.7 13.3L42 23l-13.3 4.7L24 41l-4.7-13.3L6 23l13.3-4.7L24 5Z" /><path d="m38 5 1.8 5.2L45 12l-5.2 1.8L38 19l-1.8-5.2L31 12l5.2-1.8L38 5Z" /></svg>
            </div>
            <h3>Made to feel like theirs.</h3>
            <p>Twelve Vietnamese Zodiac characters bring warmth and personality to a watch made for little explorers.</p>
          </article>
        </div>
        <p className="landing-overview-disclaimer" data-reveal="fade">Product capabilities shown are part of a concept and are not connected to a live service.</p>
      </div>
    </section>
  );
}

function EditionButton({ product, selected, onSelect }) {
  const label = editionNames[product.id];
  return (
    <li>
      <button
        className="landing-edition-button"
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(product.id)}
      >
        <span className="landing-edition-index">{String(zodiacProducts.indexOf(product) + 1).padStart(2, "0")}</span>
        <span className="landing-edition-name">{label}</span>
        <span className="landing-edition-vn">{product.animal}</span>
      </button>
    </li>
  );
}

function ZodiacCollection({ selectedId, onSelect }) {
  const selectedProduct = zodiacProducts.find((item) => item.id === selectedId) ?? zodiacProducts[0];
  return (
    <section className="landing-collection" id="collection">
      <div className="landing-container">
        <div className="landing-collection-heading" data-reveal="up">
          <div>
            <p className="landing-eyebrow"><span /> THE VIETNAMESE ZODIAC COLLECTION</p>
            <h2 className="landing-display">Twelve characters.<br /><em>One little explorer.</em></h2>
          </div>
          <p>Inspired by the Vietnamese Zodiac, each edition brings its own character to the SafeKid watch concept. Find the one that feels like them.</p>
        </div>
        <div className="landing-edition-experience" data-reveal="up">
          <div className="landing-edition-picker">
            <p className="landing-picker-label">CHOOSE A CHARACTER</p>
            <ul className="landing-edition-list" aria-label="Vietnamese Zodiac editions">
              {zodiacProducts.map((product) => (
                <EditionButton
                  key={product.id}
                  product={product}
                  selected={product.id === selectedId}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>
          <div className="landing-edition-showcase">
            <div className="landing-edition-image-wrap">
              <span className="landing-edition-image-glow" aria-hidden="true" />
              <img
                key={selectedProduct.id}
                src={selectedProduct.image}
                alt={`${editionNames[selectedProduct.id]} edition SafeKid smartwatch concept`}
              />
              <span className="landing-edition-watermark" aria-hidden="true">{selectedProduct.animal}</span>
            </div>
            <div className="landing-edition-caption" aria-live="polite">
              <div>
                <span>VIETNAMESE ZODIAC / {selectedProduct.animal.toUpperCase()}</span>
                <h3>{editionNames[selectedProduct.id]} edition</h3>
              </div>
              <a className="landing-text-link" href="#/contact">Ask about SafeKid <ArrowIcon /></a>
            </div>
          </div>
        </div>
        <p className="landing-collection-note" data-reveal="fade">Twelve designs. One SafeKid concept. No prices or availability are implied.</p>
      </div>
    </section>
  );
}

function Closing({ selectedProduct }) {
  const label = editionNames[selectedProduct.id];
  return (
    <section className="landing-closing">
      <div className="landing-closing-orb landing-closing-orb-one" aria-hidden="true" />
      <div className="landing-closing-orb landing-closing-orb-two" aria-hidden="true" />
      <div className="landing-container landing-closing-inner" data-reveal="up">
        <p className="landing-eyebrow landing-eyebrow-light"><span /> FOR ALL THE LITTLE ADVENTURES AHEAD</p>
        <h2 className="landing-display">Independence,<br /><em>with connection.</em></h2>
        <p>SafeKid imagines a little more confidence for children, and a little more reassurance for the families cheering them on.</p>
        <div className="landing-closing-actions">
          <a className="landing-button landing-button-light" href="#/contact">Let’s talk about SafeKid <ArrowIcon /></a>
          <a className="landing-closing-edition-link" href="#collection">
            <img src={selectedProduct.image} alt="" />
            <span>Currently exploring<br /><strong>{label} edition</strong></span>
          </a>
        </div>
        <span className="landing-closing-credit">A concept by SafeKid <i /> Developed by DigiBabi</span>
      </div>
    </section>
  );
}

function useStoryMotion(sectionRef, stageRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 900px)");
    let frame = 0;

    function update() {
      frame = 0;
      if (!section || !stage || reducedMotion.matches || compactLayout.matches) {
        stage?.classList.remove("is-motion-ready");
        return;
      }
      stage.classList.add("is-motion-ready");
      const distance = section.offsetHeight - window.innerHeight;
      const progress = distance > 0
        ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / distance))
        : 1;
      stage.style.setProperty("--story-progress", `${progress}`);
      for (let index = 0; index < 4; index += 1) {
        const beatProgress = Math.min(1, Math.max(0, 1 - Math.abs(progress - (index / 3)) * 3));
        stage.style.setProperty(`--story-beat-${index + 1}`, `${beatProgress}`);
      }
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    function handleMediaChange() {
      if (reducedMotion.matches || compactLayout.matches) {
        stage?.classList.remove("is-motion-ready");
        stage?.removeAttribute("style");
      } else {
        scheduleUpdate();
      }
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", handleMediaChange);
    compactLayout.addEventListener("change", handleMediaChange);
    update();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", handleMediaChange);
      compactLayout.removeEventListener("change", handleMediaChange);
      if (frame) window.cancelAnimationFrame(frame);
      stage?.removeAttribute("style");
    };
  }, [sectionRef, stageRef]);
}

export default function HomePage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const [selectedId, setSelectedId] = useState("rat");
  const selectedProduct = zodiacProducts.find((item) => item.id === selectedId) ?? zodiacProducts[0];

  useScrollReveal(pageRef);
  useStoryMotion(storyRef, stageRef);

  return (
    <div className="safekid-landing" ref={pageRef}>
      <LandingHeader />
      <main>
        <Hero heroRef={heroRef} />
        <Purpose />
        <StoryScene sectionRef={storyRef} stageRef={stageRef} />
        <ProductOverview />
        <ZodiacCollection selectedId={selectedId} onSelect={setSelectedId} />
        <Closing selectedProduct={selectedProduct} />
      </main>
      <LandingFooter />
    </div>
  );
}
