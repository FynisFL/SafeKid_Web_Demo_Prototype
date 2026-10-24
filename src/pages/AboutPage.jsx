import SiteLayout from "../components/SiteLayout.jsx";
import mascot from "../assets/figma/zodiac-collection-hero-watch.png";
import brandLogo from "../assets/brand/Logo_SafeKid.png";

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="about-hero" data-reveal="up">
        <p className="eyebrow">DIGIBABI</p>
        <h1>Who We Are?</h1>
        <div className="about-intro-card">
          <p>DigiBabi is a young, dynamic, and innovative tech startup dedicated to becoming a pioneer in developing digital solutions and smart devices that support modern parenting in Vietnam.</p>
          <div className="team-wordmark" aria-label="E-commerce team">DIGIBABI<br /><span>E-COMMERCE TEAM</span></div>
        </div>
      </section>
      <section className="about-brand-section" data-reveal="up">
        <p className="eyebrow">OUR FLAGSHIP BRAND</p>
        <h2>Our Flagship Brand</h2>
        <p>DigiBabi’s strategic e-commerce project and core brand is SafeKid—a specialized line of smartwatches designed specifically for children aged 4–10.</p>
        <div className="flagship-panel"><img src={mascot} alt="SafeKid Mouse edition smartwatch concept" /><div><span>SAFEKID</span><p>Designed for curious minds and caring families.</p></div><img src={brandLogo} alt="" /></div>
      </section>
      <section className="mission-statement" data-reveal="up">
        <h2>Protecting Safety - Fostering Education</h2>
        <p>DigiBabi developed SafeKid to be more than just a tracking device with GPS and SOS features. It is a smart tool that empowers children to build self-discipline and healthy independent habits from an early age.</p>
      </section>
      <section className="differentiator-section" data-reveal="up">
        <h2>Strategic Differentiator</h2>
        <p>DigiBabi proudly delivers the perfect fusion of cutting-edge technology and Vietnamese cultural heritage through our exclusive 12 Zodiac Animals collection.</p>
        <a className="button button-light" href="#/zodiac">Explore the Zodiac Collection</a>
      </section>
    </SiteLayout>
  );
}
