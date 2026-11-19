import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { motion, useReducedMotion } from "motion/react";
import { DURATION, EASE } from "@/components/motion/tokens";
import { collectionVisit } from "./collectionVisit";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const previousPath = useRef("");
  const reduce = useReducedMotion();

  // The original site used hash routing (#/zodiac). Keep those links working.
  useEffect(() => {
    if (location.hash.startsWith("#/")) {
      navigate(location.hash.slice(1), { replace: true });
    }
  }, [location.hash, navigate]);

  useLayoutEffect(() => {
    const { hash, key, pathname, state } = location;
    const movedBetweenEditions = previousPath.current.startsWith("/product/") &&
      pathname.startsWith("/product/") && previousPath.current !== pathname;
    previousPath.current = pathname;

    if (navigationType === "POP" && /^\/zodiac\/?$/.test(pathname)) {
      const { scrollY } = collectionVisit(key, pathname);
      if (scrollY !== undefined) {
        window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
        return;
      }
    }

    if (hash && !hash.startsWith("#/")) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
        return;
      }
    }

    if (movedBetweenEditions && (state?.keepProductScroll || navigationType === "POP")) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location, navigationType, reduce]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />
      <motion.main
        id="main"
        className="flex-1"
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0.88 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
      >
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  );
}
