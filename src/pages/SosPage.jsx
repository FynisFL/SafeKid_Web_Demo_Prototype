import { useState } from "react";
import SiteLayout from "../components/SiteLayout.jsx";
import usePressHold from "../hooks/usePressHold.js";
import "../styles/interactive.css";

export default function SosPage() {
  const [acknowledged, setAcknowledged] = useState(false);

  const { progress, isHolding, handlers } = usePressHold({
    duration: 1200,
    onHoldComplete: () => setAcknowledged(true),
  });

  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference - progress * circumference;

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
            <div className="sos-button-wrap" {...handlers}>
              <button type="button" onClick={() => setAcknowledged(true)}>
                <svg className="sos-progress-ring" viewBox="0 0 200 200" aria-hidden="true">
                  <circle className="sos-progress-bg" cx="100" cy="100" r="90" />
                  <circle
                    className="sos-progress-fill"
                    cx="100"
                    cy="100"
                    r="90"
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: dashOffset,
                      opacity: isHolding ? 1 : 0,
                    }}
                  />
                </svg>
                {acknowledged ? "Demo acknowledged" : "Try the demo"}
              </button>
            </div>
            <span role="status">{acknowledged ? "No alert was sent." : "Hold to confirm the demo."}</span>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
