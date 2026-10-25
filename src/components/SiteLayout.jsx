import { useRef } from "react";
import { LandingFooter, LandingHeader } from "./LandingChrome.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "../styles/safekid-landing.css";
import "../styles/secondary-pages.css";

export default function SiteLayout({ children }) {
  const layoutRef = useRef(null);
  useScrollReveal(layoutRef);

  return (
    <div className="safekid-landing secondary-page" ref={layoutRef}>
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
