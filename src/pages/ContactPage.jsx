import { useRef } from "react";
import { LandingFooter, LandingHeader } from "../components/LandingChrome.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import useParallax from "../hooks/useParallax.js";
import InteractiveCard from "../components/InteractiveCard.jsx";
import RippleButton from "../components/RippleButton.jsx";
import ShapeGrid from "../components/ShapeGrid.jsx";
import "../styles/safekid-landing.css";
import "../styles/contact-page.css";
import "../styles/interactive.css";

function ContactArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function ContactPage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  useParallax(pageRef, { speed: 0.05 });

  function openEmailDraft(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");

    window.location.href = `mailto:support@safekid.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="safekid-landing contact-page" ref={pageRef}>
      <LandingHeader variant="contact" />
      <main>
        <section className="contact-hero">
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
          <div className="landing-container contact-hero-inner">
            <div className="contact-hero-copy" data-reveal="up">
              <p className="landing-eyebrow"><span /> LET'S START A CONVERSATION</p>
              <h1 className="landing-display" data-reveal="up" data-reveal-delay="1">Let’s talk<br />SafeKid.</h1>
              <p data-reveal="up" data-reveal-delay="2">
                Curious about SafeKid or the idea behind the collection? We’d love to hear what you think.
              </p>
              <a className="contact-hero-link" href="mailto:support@safekid.com">
                Write to the SafeKid team <ContactArrow />
              </a>
            </div>
            <div className="contact-hero-art" data-reveal="fade" aria-hidden="true">
              <span className="contact-orbit contact-orbit-one" data-motion="spin-slow" />
              <span className="contact-orbit contact-orbit-two" data-motion="spin-slow" />
              <span className="contact-orbit contact-orbit-three" data-motion="spin-slow" />
              <span className="contact-orbit-dot contact-orbit-dot-one" data-motion="pulse" />
              <span className="contact-orbit-dot contact-orbit-dot-two" data-motion="pulse" />
              <span className="contact-hero-monogram" data-motion="drift">S<span>.</span></span>
              <p>ROOM TO GROW<br />SPACE TO CONNECT</p>
            </div>
          </div>
        </section>

        <section className="landing-container contact-content">
          <div className="contact-intro" data-reveal="up">
            <p className="landing-eyebrow"><span /> GET IN TOUCH</p>
            <h2 className="landing-display">We’re listening.</h2>
            <p>Use the form to open an email draft, or reach out directly.</p>
          </div>

          <div className="contact-grid">
            <form className="contact-form" id="contact-message" data-reveal="up" onSubmit={openEmailDraft}>
              <div className="contact-form-heading">
                <span>01 / YOUR MESSAGE</span>
                <h3>What’s on your mind?</h3>
              </div>
              <div className="contact-form-fields">
                <label>
                  <span>Your name</span>
                  <input name="name" autoComplete="name" placeholder="How should we address you?" required />
                </label>
                <label>
                  <span>Email address</span>
                  <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                </label>
                <label className="contact-field-wide">
                  <span>Subject</span>
                  <input name="subject" placeholder="What would you like to talk about?" required />
                </label>
                <label className="contact-field-wide">
                  <span>Message</span>
                  <textarea name="message" rows="5" placeholder="Share a little more..." required />
                </label>
              </div>
              <div className="contact-form-bottom">
                <RippleButton className="contact-submit" type="submit" glowColor="#00C7CA">Open email draft <ContactArrow /></RippleButton>
                <p>Your email app opens with this message ready. Nothing is sent until you press Send.</p>
              </div>
            </form>

            <aside className="contact-details" data-reveal="up" data-reveal-delay="1">
              <p className="contact-details-kicker">02 / DIRECT CONTACT</p>
              <h3>Here’s where<br />to find us.</h3>
              <p className="contact-details-copy">Prefer email or a quick call? Get in touch using the details below.</p>
              <div className="contact-detail-list">
                <InteractiveCard as="a" className="contact-detail" href="mailto:support@safekid.com" intensity={4} scaleOnHover={1.01} glowColor="#00C7CA" variant="border-glow">
                  <span className="contact-detail-icon" aria-hidden="true">@</span>
                  <span><small>EMAIL</small><strong>support@safekid.com</strong></span>
                  <ContactArrow />
                </InteractiveCard>
                <InteractiveCard as="a" className="contact-detail" href="tel:+841****6789" intensity={4} scaleOnHover={1.01} glowColor="#00C7CA" variant="border-glow">
                  <span className="contact-detail-icon" aria-hidden="true">↗</span>
                  <span><small>PHONE</small><strong>+(84) 123 456 789</strong></span>
                  <ContactArrow />
                </InteractiveCard>
                <InteractiveCard as="div" className="contact-detail" intensity={3} scaleOnHover={1.01} glowColor="#00C7CA" variant="border-glow">
                  <span className="contact-detail-icon" aria-hidden="true">⌖</span>
                  <span><small>LOCATION</small><strong>Ho Chi Minh City, Vietnam</strong></span>
                </InteractiveCard>
              </div>
              <div className="contact-details-footer">
                <span className="contact-status-dot" />
                <span>Developed by <strong>DigiBabi</strong></span>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <LandingFooter variant="contact" />
    </div>
  );
}
