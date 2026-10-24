import SafeKidLogo from "../assets/brand/Logo_SafeKid.png";

export function LandingHeader({ variant = "home" }) {
  const isHome = variant === "home";
  const linksByVariant = {
    home: [
      ["Our story", "#story"],
      ["Our purpose", "#purpose"],
      ["Zodiac collection", "#collection"],
    ],
    zodiac: [
      ["Home", "#/"],
      ["Support", "#/support"],
      ["Contact", "#/contact"],
    ],
    support: [
      ["Home", "#/"],
      ["Zodiac collection", "#/zodiac"],
      ["Contact", "#/contact"],
    ],
    product: [
      ["Home", "#/"],
      ["Zodiac collection", "#/zodiac"],
      ["Support", "#/support"],
    ],
    contact: [
      ["Home", "#/"],
      ["Zodiac collection", "#/zodiac"],
      ["Support", "#/support"],
    ],
  };
  const links = linksByVariant[variant] ?? linksByVariant.contact;

  return (
    <header className="landing-header">
      <div className="landing-container landing-header-inner">
        <a className="landing-brand" href={isHome ? "#top" : "#/"} aria-label="SafeKid home">
          <img src={SafeKidLogo} alt="" />
          <span>SafeKid</span>
        </a>
        <nav className="landing-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </nav>
        <a className="landing-header-cta" href={isHome || variant === "zodiac" || variant === "support" || variant === "product" ? "#/contact" : "#/"}>
          {isHome || variant === "zodiac" || variant === "support" || variant === "product" ? "Get in touch" : "Back to home"}
          <svg className="landing-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12h15m-6-6 6 6-6 6" />
          </svg>
        </a>
      </div>
    </header>
  );
}

export function LandingFooter({ variant = "home" }) {
  const homeHref = variant === "home" ? "#top" : "#/";
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-main">
        <a className="landing-brand landing-footer-brand" href={homeHref} aria-label="SafeKid home">
          <img src={SafeKidLogo} alt="" />
          <span>SafeKid</span>
        </a>
        <p>Inspired by little explorers and the Vietnamese Zodiac.</p>
        <nav aria-label="Footer navigation">
          <a href={homeHref}>Home</a>
          <a href="#/zodiac">Zodiac collection</a>
          <a href="#/support">Support</a>
          <a href="#/contact">Contact</a>
        </nav>
      </div>
      <div className="landing-container landing-footer-bottom">
        <span>© 2026 SafeKid. Concept site for demonstration.</span>
        <span>Developed by DigiBabi</span>
        <a href="mailto:support@safekid.com">support@safekid.com</a>
      </div>
    </footer>
  );
}
