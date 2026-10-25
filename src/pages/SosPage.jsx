import { useState } from "react";
import SiteLayout from "../components/SiteLayout.jsx";

export default function SosPage() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <SiteLayout>
      <section className="secondary-hero secondary-hero-compact sos-screen">
        <div className="landing-container secondary-hero-inner">
          <div className="secondary-hero-copy" data-reveal="up">
            <p className="landing-eyebrow"><span /> INTERACTION CONCEPT</p>
            <h1 className="landing-display">A clear way to ask for help.</h1>
            <p>This screen demonstrates an SOS interaction from the design concept. It does not contact emergency services or share a location.</p>
            <a className="secondary-action" href="#/support">Read about the concept <span aria-hidden="true">→</span></a>
          </div>
          <div className="sos-demo" data-reveal="scale">
            <p>LOCAL DEMO ONLY</p>
            <button type="button" onClick={() => setAcknowledged(true)}>
              {acknowledged ? "Demo acknowledged" : "Try the demo"}
            </button>
            <span role="status">{acknowledged ? "No alert was sent." : "Tap to see a local confirmation."}</span>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
