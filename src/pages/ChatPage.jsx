import { useState } from "react";
import SiteLayout from "../components/SiteLayout.jsx";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setNotice("This is a visual prototype. No AI service is connected and your message was not sent.");
    setMessage("");
  }

  return (
    <SiteLayout>
      <section className="secondary-hero secondary-hero-compact">
        <div className="landing-container secondary-hero-inner">
          <div className="secondary-hero-copy" data-reveal="up">
            <p className="landing-eyebrow"><span /> SAFEKID CONCEPT</p>
            <h1 className="landing-display">Ask about SafeKid.</h1>
            <p>Use this prototype to explore the shape of a future SafeKid conversation, or browse the answers we can confirm today.</p>
            <a className="secondary-action" href="#/support">Visit Support <span aria-hidden="true">→</span></a>
          </div>
          <div className="chat-prototype" data-reveal="scale">
            <p className="chat-prototype-title">A conversation, imagined.</p>
            <div className="chat-message">Hi! What would you like to know about the SafeKid concept?</div>
            {notice && <div className="chat-notice" role="status">{notice}</div>}
            <form className="chat-form" onSubmit={submit}>
              <label className="visually-hidden" htmlFor="chat-message">Your message</label>
              <input
                id="chat-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message..."
              />
              <button className="button button-primary" type="submit">Send</button>
            </form>
            <p className="design-disclaimer">Prototype only — nothing is sent to a service.</p>
          </div>
        </div>
      </section>
      <section className="secondary-next-step" data-reveal="up">
        <h2 className="landing-display">Need a real answer?</h2>
        <p>Read the current product and availability notes, or contact the SafeKid team.</p>
        <div>
          <a className="landing-button landing-button-dark" href="#/support">Read Support</a>
          <a className="secondary-action" href="#/contact">Contact the team <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </SiteLayout>
  );
}
