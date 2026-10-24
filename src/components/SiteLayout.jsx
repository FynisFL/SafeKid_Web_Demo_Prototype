import { useRef } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";

export default function SiteLayout({ children }) {
  const layoutRef = useRef(null);
  useScrollReveal(layoutRef);

  return (
    <div className="motion-surface" ref={layoutRef}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
