import { useState } from "react";
import SiteLayout from "../components/SiteLayout.jsx";

export default function SosPage() {
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <SiteLayout>
      <section className="sos-page" data-reveal="up"><div className="simulation-label">Local simulation only. No emergency alert is sent.</div><p className="eyebrow">SAFEKID SAFETY FEATURE</p><h1>SOS Simulation</h1><p>This screen demonstrates the SOS interaction shown in the design. It does not contact emergency services or share your location.</p><button className="sos-button" type="button" onClick={() => setAcknowledged(true)}>{acknowledged ? "Simulation Acknowledged" : "Try SOS Simulation"}</button>{acknowledged && <p className="form-notice" role="status">Simulation only — no alert was sent.</p>}</section>
    </SiteLayout>
  );
}
