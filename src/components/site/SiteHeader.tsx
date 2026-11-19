import { MEDIA } from "@/lib/breakpoints";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useShoppingBag } from "@/components/shop/shoppingBag";
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
  { label: "Parent App", to: "/app" },
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
  const { count } = useShoppingBag();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const searchReturn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

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

  const desktop = useMediaQuery(MEDIA.laptop);
  useEffect(() => {
    if (desktop) setMenuOpen(false);
  }, [desktop]);

  return (
    <>
    <Dialog.Root open={menuOpen && !desktop} onOpenChange={setMenuOpen}>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[var(--safe-top)] transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "border-b border-ink/8 bg-white/[0.98] shadow-[0_10px_40px_-30px_rgba(9,40,50,0.5)] backdrop-blur-sm"
            : "border-b border-ink/[0.05] bg-white/90 backdrop-blur-sm"
        )}
      >
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
            <Link
              id="site-shopping-bag"
              to="/cart"
              aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
              aria-current={location.pathname.startsWith("/cart") ? "page" : undefined}
              className="press relative grid size-11 shrink-0 place-items-center rounded-full border border-ink/12 text-ink transition-colors hover:bg-mist"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 0.75, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-ink"
                  aria-hidden="true"
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
              )}
            </Link>
            <button
              type="button"
              onClick={(event) => {
                searchReturn.current = event.currentTarget;
                setSearchOpen(true);
              }}
              aria-label="Search the 12 editions"
              className="hidden size-11 shrink-0 items-center justify-center rounded-full text-deep/70 transition-colors hover:bg-mist hover:text-ink sm:inline-flex"
            >
              <Search className="h-[17px] w-[17px]" aria-hidden="true" />
            </button>
            <Link
              to="/contact"
              className="hidden h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion sm:inline-flex lg:hidden xl:inline-flex"
            >
              Talk to the team
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Dialog.Trigger asChild>
              <button
                type="button"
                ref={menuTrigger}
                aria-label="Open menu"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors hover:bg-mist lg:hidden"
              >
                <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </Dialog.Trigger>
          </div>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[69] bg-mist/75" />
        <Dialog.Content aria-describedby={undefined} onOpenAutoFocus={(event) => {
          event.preventDefault();
          closeRef.current?.focus();
        }} onCloseAutoFocus={(event) => {
          if (searchOpen || desktop) event.preventDefault();
        }} className="fixed inset-0 z-[70] bg-mist pt-[var(--safe-top)] pb-[var(--safe-bottom)] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:slide-in-from-top-4 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 duration-200">
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="shell flex h-[78px] shrink-0 items-center justify-between">
              <BrandMark compact />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/12 bg-white/70 text-ink"
              >
                <X className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </div>

            <nav onClick={(event) => { if ((event.target as Element).closest("a")) setMenuOpen(false); }} aria-label="Mobile" className="shell flex-1 pt-6">
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
                  searchReturn.current = menuTrigger.current;
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-deep/70"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search the 12 editions
              </button>
            </nav>

            <div className="shell shrink-0 border-t border-ink/10 py-6 text-xs text-deep/55">
              <p>Store preview · Parent App testing · Watch orders closed.</p>
              <p className="mt-1">Developed by DigiBabi.</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
    <EditionSearch open={searchOpen} onClose={() => setSearchOpen(false)} returnFocus={searchReturn} />
    </>
  );
}
