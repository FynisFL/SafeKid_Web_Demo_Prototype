import { useRef } from "react";
import SiteLayout from "../components/SiteLayout.jsx";
import InteractiveCard from "../components/InteractiveCard.jsx";
import RippleButton from "../components/RippleButton.jsx";
import mascot from "../assets/figma/zodiac-collection-hero-watch.png";
import useScrollReveal from "../hooks/useScrollReveal.js";
import useParallax from "../hooks/useParallax.js";
import ShapeGrid from "../components/ShapeGrid.jsx";
import "../styles/interactive.css";

export default function AboutPage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  useParallax(pageRef, { speed: 0.05 });

  return (
    <SiteLayout>
      <div ref={pageRef}>
        <section className="secondary-hero brand-hero">
        <div className="landing-container secondary-hero-inner">
          <div className="secondary-hero-copy" data-reveal="up">
            <p className="landing-eyebrow"><span /> A STORY BY DIGIBABI</p>
            <h1 className="landing-display">More room to<br />grow.</h1>
            <p>
              SafeKid is a concept about the space between a child’s first independent steps and the family connection that helps them feel ready.
            </p>
            <a className="secondary-action" href="#/zodiac">Explore the Zodiac collection <span aria-hidden="true">→</span></a>
          </div>
          <div className="secondary-hero-art" data-reveal="scale">
            <InteractiveCard intensity={4} scaleOnHover={1.02} glowColor="#00C7CA">
              <img src={mascot} alt="SafeKid Mouse edition smartwatch concept" />
              <span>SAFEKID / VIETNAMESE ZODIAC</span>
            </InteractiveCard>
          </div>
        </div>
      </section>
      <section className="landing-container secondary-story">
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
          <ShapeGrid
            shape="cross"
            direction="none"
            lineColor="#c8eaea"
            hoverColor="#00c7ca"
            hoverFillColor="#66fcff"
            fillOpacity={0}
            cellSize={34}
            speed={0.45}
            tiltX={0}
            tiltY={0}
            rainbow={false}
            lineWidth={0.75}
            radius={1.3}
            glow={1}
            twinkle={0.4}
          />
        </div>
        <div data-reveal="up">
          <p className="landing-eyebrow"><span /> THE IDEA</p>
          <h2 className="landing-display">Growing up.<br />Staying connected.</h2>
        </div>
        <div className="secondary-story-copy" data-reveal="up" data-reveal-delay="1">
          <p>
            The walk to a friend’s home. The first trip around the block. Small moments can feel like big beginnings for children and parents alike.
          </p>
          <p>
            SafeKid imagines a child-focused watch concept shaped around those moments, with playful characters inspired by the Vietnamese Zodiac.
          </p>
          <p className="secondary-concept-note">The device, app, and features shown across this site are visual concepts. No live product or connected service is represented.</p>
        </div>
      </section>

      <section className="secondary-brand-close">
        <div className="landing-container secondary-brand-close-inner" data-reveal="up">
          <div>
            <h2 className="landing-display">Made for curious minds and caring families.</h2>
            <p>Discover the 12 character editions, then tell us which one feels like your little explorer.</p>
            <RippleButton className="landing-button landing-button-light" as="a" href="#/zodiac">Meet the collection <span aria-hidden="true">→</span></RippleButton>
          </div>
        </div>
      </section>
    </div>
  </SiteLayout>
  );
}
