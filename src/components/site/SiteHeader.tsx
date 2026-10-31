import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { EditionSearch } from "./EditionSearch";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Zodiac collection", to: "/zodiac" },
  { label: "Watch Passport", to: "/watch-passport" },
  { label: "About", to: "/about" },
  { label: "Support", to: "/support" },
  { label: "S-F AI", to: "/chat" },
];

const SECONDARY = [
  { label: "Contact", to: "/contact" },
  { label: "SOS demo", to: "/sos" },
  { label: "Support centre", to: "/support" },
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/zodiac") return pathname.startsWith("/zodiac") || pathname.startsWith("/product");
  return pathname.startsWith(to);
}

export function SiteHeader() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "border-b border-ink/8 bg-white/95 shadow-[0_10px_40px_-30px_rgba(9,40,50,0.5)] backdrop-blur-xl"
            : "border-b border-ink/[0.05] bg-white/85 backdrop-blur-md"
        )}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary/70"
          style={{ scaleX: progress }}
        />
        <div className="shell flex items-center justify-between gap-6">
          <div
            className={cn(
              "flex items-center transition-[height] duration-500",
              scrolled ? "h-[66px]" : "h-[78px] lg:h-[88px]"
            )}
          >
            <BrandMark compact />
          </div>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = isActive(location.pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 font-sans text-[13.5px] transition-colors duration-300",
                    active ? "text-ink" : "text-deep/65 hover:text-ink"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-[3px] h-px bg-ink"
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the 12 editions"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-deep/70 transition-colors hover:bg-mist hover:text-ink sm:inline-flex"
            >
              <Search className="h-[17px] w-[17px]" aria-hidden="true" />
            </button>
            <Link
              to="/contact"
              className="hidden h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion sm:inline-flex"
            >
              Talk to the team
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors hover:bg-mist lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-mist"
              initial={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
              animate={reduce ? undefined : { clipPath: "inset(0 0 0% 0)" }}
              exit={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="flex h-full flex-col overflow-y-auto">
                <div className="shell flex h-[78px] shrink-0 items-center justify-between">
                  <BrandMark compact />
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 bg-white/70 text-ink"
                  >
                    <X className="h-[18px] w-[18px]" aria-hidden="true" />
                  </button>
                </div>

                <nav aria-label="Mobile" className="shell flex-1 pt-6">
                  <ul>
                    {NAV.map((item, index) => (
                      <motion.li
                        key={item.to}
                        initial={reduce ? undefined : { opacity: 0, y: 20 }}
                        animate={reduce ? undefined : { opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="border-b border-ink/10"
                      >
                        <Link
                          to={item.to}
                          className="flex items-baseline justify-between gap-4 py-4"
                        >
                          <span className="font-display text-[clamp(1.9rem,8vw,2.6rem)] font-medium tracking-[-0.045em] text-ink">
                            {item.label}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.2em] text-deep/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {SECONDARY.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-full border border-ink/15 bg-white/60 px-4 py-2 text-[13px] text-deep"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-deep/70"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Search the 12 editions
                  </button>
                </nav>

                <div className="shell shrink-0 border-t border-ink/10 py-6 text-xs text-deep/55">
                  <p>Product concept · No live device or service.</p>
                  <p className="mt-1">Developed by DigiBabi.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditionSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
