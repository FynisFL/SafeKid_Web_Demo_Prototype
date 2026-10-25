import { useRef } from "react";
import { LandingFooter, LandingHeader } from "../components/LandingChrome.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "../styles/safekid-landing.css";
import "../styles/contact-page.css";

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
              <span className="contact-orbit contact-orbit-one" />
              <span className="contact-orbit contact-orbit-two" />
              <span className="contact-orbit contact-orbit-three" />
              <span className="contact-orbit-dot contact-orbit-dot-one" />
              <span className="contact-orbit-dot contact-orbit-dot-two" />
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
                <button className="contact-submit" type="submit">Open email draft <ContactArrow /></button>
                <p>Your email app opens with this message ready. Nothing is sent until you press Send.</p>
              </div>
            </form>

            <aside className="contact-details" data-reveal="up" data-reveal-delay="1">
              <p className="contact-details-kicker">02 / DIRECT CONTACT</p>
              <h3>Here’s where<br />to find us.</h3>
              <p className="contact-details-copy">Prefer email or a quick call? Get in touch using the details below.</p>
              <div className="contact-detail-list">
                <a className="contact-detail" href="mailto:support@safekid.com">
                  <span className="contact-detail-icon" aria-hidden="true">@</span>
                  <span><small>EMAIL</small><strong>support@safekid.com</strong></span>
                  <ContactArrow />
                </a>
                <a className="contact-detail" href="tel:+84123456789">
                  <span className="contact-detail-icon" aria-hidden="true">↗</span>
                  <span><small>PHONE</small><strong>+(84) 123 456 789</strong></span>
                  <ContactArrow />
                </a>
                <div className="contact-detail">
                  <span className="contact-detail-icon" aria-hidden="true">⌖</span>
                  <span><small>LOCATION</small><strong>Ho Chi Minh City, Vietnam</strong></span>
                </div>
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
