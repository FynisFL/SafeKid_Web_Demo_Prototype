import { useState } from "react";
import SiteLayout from "../components/SiteLayout.jsx";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setNotice("This chat screen is a Figma prototype. No AI service is connected, and your message was not sent.");
    setMessage("");
  }

  return (
    <SiteLayout>
      <section className="chat-page">
        <div className="chat-panel" data-reveal="up"><p className="eyebrow">SAFEKID AI</p><h1>How can I help you?</h1><p>Ask a question about SafeKid.</p><div className="chat-message">Hi! I’m your SafeKid assistant. What would you like to know?</div>{notice && <div className="chat-notice" role="status">{notice}</div>}<form className="chat-form" onSubmit={submit}><label className="visually-hidden" htmlFor="chat-message">Your message</label><input id="chat-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message…" /><button className="button button-primary" type="submit">Send</button></form><p className="design-disclaimer">Prototype only — no message is sent to a service.</p></div>
      </section>
    </SiteLayout>
  );
}
