import { SceneSignature, type SceneName } from "@/components/motion/SceneSignature";
import { AnimatedContent } from "@/components/motion/reactbits/AnimatedContent";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useReducedMotion } from "motion/react";
import { collectionVisit } from "./collectionVisit";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

const signatures: Record<string, SceneName> = {
  zodiac: "zodiac", product: "product", "watch-passport": "passport", about: "about",
  support: "support", contact: "contact", chat: "chat", "s-f-ai": "chat", sos: "sos", cart: "bag", checkout: "bag",
};

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const previousPath = useRef("");
  const reduce = useReducedMotion();
  const route = location.pathname.split("/")[1];
  const signature = route ? signatures[route] ?? "missing" : undefined;

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
        if (hash === "#collection") {
          const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - padding,
            behavior: reduce ? "instant" : "smooth",
          });
        } else {
          target.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
        }
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
      <AnimatedContent
        key={route}
        as="main"
        trigger="mount"
        distance={8}
        duration={0.46}
        id="main"
        className="relative flex-1 pt-[var(--safe-top)]"
        tabIndex={-1}
      >
        {signature && <SceneSignature scene={signature} className="sk-page-signature" />}
        {children}
      </AnimatedContent>
      <SiteFooter />
    </div>
  );
}
