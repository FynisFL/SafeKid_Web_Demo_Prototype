import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { zodiacProducts } from "@/data/zodiac";

type EditionSearchProps = {
  open: boolean;
  onClose: () => void;
};

export function EditionSearch({ open, onClose }: EditionSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zodiacProducts;
    return zodiacProducts.filter((product) =>
      `${product.label} ${product.animal} ${product.id}`.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  function goToEdition(id: string) {
    onClose();
    navigate(`/product/${id}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-20 sm:pt-28"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 cursor-default bg-night/35 backdrop-blur-[6px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the Zodiac collection"
            className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_40px_120px_-40px_rgba(8,30,40,0.55)]"
            initial={reduce ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <Search className="h-4 w-4 text-deep/50" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && results[0]) goToEdition(results[0].id);
                }}
                placeholder="Search Buffalo, Dragon, Tý…"
                aria-label="Search editions"
                className="h-8 w-full bg-transparent font-sans text-[15px] text-ink outline-none placeholder:text-deep/55"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-deep/50 transition-colors hover:bg-mist hover:text-ink"
                aria-label="Close search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[54vh] overflow-y-auto p-2">
              <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-deep/60">
                {query ? `${results.length} edition${results.length === 1 ? "" : "s"}` : "All 12 editions"}
              </p>
              {results.length === 0 && (
                <p className="px-3 pb-6 pt-2 text-sm text-muted-foreground">
                  No edition matches “{query}”. Try a Zodiac name or character.
                </p>
              )}
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-mist focus-visible:bg-mist"
                    >
                      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-mist">
                        <img
                          src={product.image}
                          alt=""
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[15px] font-semibold tracking-tight text-ink">
                          {product.label} edition
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Vietnamese Zodiac · {product.animal}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-deep/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className="border-t border-ink/10 px-5 py-3 text-[11px] text-deep/60">
              Design concepts. No prices, stock or availability are confirmed.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
