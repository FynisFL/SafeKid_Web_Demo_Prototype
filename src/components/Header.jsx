import shieldBase from "../assets/figma/header-logo-shield-base.png";
import shieldMark from "../assets/figma/header-logo-shield-mark.png";
import wordmark from "../assets/brand/Logo_SafeKid.png";
import shoppingBag from "../assets/figma/header-store-bag.svg";

const links = [
  ["Home", "#/"],
  ["Store", "#/zodiac"],
  ["About", "#/about"],
  ["Contact", "#/contact"],
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.4 15.4 5 5" />
    </svg>
  );
}

function ZodiacIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" />
      <path d="M8 10.5h8v5H8zM10 9V7.5h4V9" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#/" aria-label="SafeKid home">
        <span className="brand-emblem" aria-hidden="true">
          <img src={shieldBase} alt="" />
          <img src={shieldMark} alt="" />
        </span>
        <img className="brand-wordmark" src={wordmark} alt="SafeKid" />
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a href={href} key={label}>{label}</a>
        ))}
      </nav>
      <nav className="header-utilities" aria-label="Quick navigation">
        <a href="#/zodiac" aria-label="Search SafeKid designs"><SearchIcon /></a>
        <a href="#/zodiac" aria-label="Browse the Zodiac collection">
          <img src={shoppingBag} alt="" />
        </a>
        <a href="#/support" aria-label="SafeKid support"><ZodiacIcon /></a>
        <span className="header-avatar" aria-label="Profile icon">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="15" r="5" />
            <path d="M8 36c.6-7.1 5.2-11 12-11s11.4 3.9 12 11" />
          </svg>
        </span>
      </nav>
    </header>
  );
}
