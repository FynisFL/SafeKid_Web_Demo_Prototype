import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { motion, useReducedMotion } from "motion/react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  // The original site used hash routing (#/zodiac). Keep those links working.
  useEffect(() => {
    if (location.hash.startsWith("#/")) {
      navigate(location.hash.slice(1), { replace: true });
    }
  }, [location.hash, navigate]);

  useEffect(() => {
    const hash = location.hash;

    if (hash && !hash.startsWith("#/")) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const timer = window.setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 90);
        return () => window.clearTimeout(timer);
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

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
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  );
}
