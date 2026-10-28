import { useState, useEffect, useRef } from "react";
import SafeKidLogo from "../assets/brand/Logo_SafeKid.png";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import MicroSlats from "./MicroSlats.jsx";

const links = [
  { label: "Home", href: "#/", route: "/" },
  { label: "Zodiac collection", href: "#/zodiac", route: "/zodiac" },
  { label: "About", href: "#/about", route: "/about" },
  { label: "Support", href: "#/support", route: "/support" },
  { label: "S.F AI", href: "#/chat", route: "/chat" },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchToggleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        searchToggleRef.current?.focus();
      }
    };
    const handleClickOutside = (event) => {
      if (!event.target.closest(".landing-header-search-bar, .landing-header-search-toggle")) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchOpen]);

  const handleSearchToggle = () => {
    if (menuOpen) setMenuOpen(false);
    setSearchOpen((v) => !v);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    searchToggleRef.current?.focus();
  };

  const headerClass = [
    "landing-header",
    scrolled ? "landing-header--scrolled" : "",
    searchOpen ? "is-search-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <InteractiveBackdrop />
      <header className={headerClass}>
        <div className="landing-container landing-header-inner">
          <a className="landing-brand" href="#/" aria-label="SafeKid home">
            <img src={SafeKidLogo} alt="" />
            <span>SafeKid</span>
          </a>
          <button
            type="button"
            className="landing-header-menu"
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="landing-header-menu-line" />
            <span className="landing-header-menu-line" />
          </button>
          <nav className="landing-nav" id="landing-mobile-menu" aria-label="Main navigation">
            {links.map(({ label, href, route: linkRoute }) => {
              const isSupportRoute = route === "/support";
              const isChatRoute = route === "/chat";
              const isActive = linkRoute === route
                || (linkRoute === "/zodiac" && route.startsWith("/product/"))
                || (linkRoute === "/support" && isSupportRoute)
                || (linkRoute === "/chat" && isChatRoute);
              return (
                <a
                  href={href}
                  key={label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              );
            })}
          </nav>
          <button
            ref={searchToggleRef}
            type="button"
            className="landing-header-search-toggle"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={handleSearchToggle}
          >
            <HugeiconsIcon icon={Search01Icon} size="16" strokeWidth={2} />
          </button>
          <div className="landing-header-search-bar" aria-hidden={!searchOpen}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search SafeKid…"
              aria-label="Search"
            />
            <button
              type="button"
              className="landing-header-search-close"
              aria-label="Close search"
              onClick={handleSearchClose}
            >
              ×
            </button>
          </div>
          <a
            className="landing-header-cta"
            href="#/contact"
            aria-current={isContact ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
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
