import SafeKidLogo from "../assets/brand/Logo_SafeKid.png";
import { createPortal } from "react-dom";
import MicroSlats from "./MicroSlats.jsx";

const links = [
  { label: "Home", href: "#/", route: "/" },
  { label: "Zodiac collection", href: "#/zodiac", route: "/zodiac" },
  { label: "About", href: "#/about", route: "/about" },
  { label: "Support", href: "#/support", route: "/support" },
];

function activeRoute() {
  const route = window.location.hash.slice(1).split("?")[0];
  if (!route || !route.startsWith("/")) return "/";
  return route;
}

function InteractiveBackdrop() {
  return createPortal(
    <div className="micro-slats-backdrop" aria-hidden="true">
      <MicroSlats
        className="micro-slats-canvas"
        preset="tide"
        color="#55d4d4"
        glintColor="#b7f2f2"
        backgroundColor="transparent"
        slatWidth={13}
        slatHeight={8}
        gap={5}
        speed={0.12}
        chop={0.18}
        glint={0.28}
        contrast={0.65}
        perspective={0.24}
        fog={0.84}
        interactive
        cursorStrength={0.32}
        cursorSize={48}
        swirl={0.22}
        trail={1}
        lean={0.2}
        intro={false}
      />
    </div>,
    document.body,
  );
}

export function LandingHeader() {
  const route = activeRoute();
  const isContact = route === "/contact";

  return (
    <>
      <InteractiveBackdrop />
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <a className="landing-brand" href="#/" aria-label="SafeKid home">
            <img src={SafeKidLogo} alt="" />
            <span>SafeKid</span>
          </a>
          <nav className="landing-nav" aria-label="Main navigation">
            {links.map(({ label, href, route: linkRoute }) => {
              const isActive = linkRoute === route
                || (linkRoute === "/zodiac" && route.startsWith("/product/"))
                || (linkRoute === "/support" && ["/chat", "/sos"].includes(route));
              return (
                <a href={href} key={label} aria-current={isActive ? "page" : undefined}>
                  {label}
                </a>
              );
            })}
          </nav>
          <a
            className="landing-header-cta"
            href={isContact ? "#contact-message" : "#/contact"}
            aria-current={isContact ? "page" : undefined}
          >
            {isContact ? "Write to the team" : "Talk to the team"}
            <svg className="landing-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12h15m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </header>
    </>
  );
}

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-main">
        <a className="landing-brand landing-footer-brand" href="#/" aria-label="SafeKid home">
          <img src={SafeKidLogo} alt="" />
          <span>SafeKid</span>
        </a>
        <div className="landing-footer-message">
          <p>Room to explore.<br />Connection to come home to.</p>
          <a href="#/contact">Tell us what you think <span aria-hidden="true">→</span></a>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#/">Home</a>
          <a href="#/zodiac">Zodiac collection</a>
          <a href="#/about">About SafeKid</a>
          <a href="#/support">Support</a>
          <a href="#/contact">Contact</a>
        </nav>
      </div>
      <div className="landing-container landing-footer-bottom">
        <span>© 2026 SafeKid · Concept site for demonstration</span>
        <span>Developed by DigiBabi</span>
        <a href="mailto:support@safekid.com">support@safekid.com</a>
      </div>
    </footer>
  );
}
