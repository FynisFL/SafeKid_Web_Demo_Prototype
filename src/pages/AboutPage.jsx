import SiteLayout from "../components/SiteLayout.jsx";
import mascot from "../assets/figma/zodiac-collection-hero-watch.png";
import brandLogo from "../assets/brand/Logo_SafeKid.png";

export default function AboutPage() {
  return (
    <SiteLayout>
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
            <img src={mascot} alt="SafeKid Mouse edition smartwatch concept" />
            <span>SAFEKID / VIETNAMESE ZODIAC</span>
          </div>
        </div>
      </section>

      <section className="landing-container secondary-story">
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
          <img src={brandLogo} alt="SafeKid by DigiBabi" />
          <div>
            <h2 className="landing-display">Made for curious minds and caring families.</h2>
            <p>Discover the 12 character editions, then tell us which one feels like your little explorer.</p>
            <a className="landing-button landing-button-light" href="#/zodiac">Meet the collection <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
