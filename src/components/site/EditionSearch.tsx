import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Search, X } from "lucide-react";
import { zodiacProducts } from "@/data/zodiac";

type EditionSearchProps = {
  open: boolean;
  onClose: () => void;
  restoreFocus: () => void;
};

export function EditionSearch({ open, onClose, restoreFocus }: EditionSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zodiacProducts;
    return zodiacProducts.filter((product) =>
      `${product.label} ${product.animal} ${product.id}`.toLowerCase().includes(q)
    );
  }, [query]);

  function goToEdition(id: string) {
    onClose();
    navigate(`/product/${id}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-night/35 backdrop-blur-[6px] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content
          aria-describedby="edition-search-note"
          className="fixed left-1/2 top-[clamp(0.75rem,9dvh,6rem)] z-[81] flex max-h-[min(34rem,calc(100dvh-clamp(0.75rem,9dvh,6rem)-max(0.75rem,env(safe-area-inset-bottom))))] w-[calc(100%-2rem)] max-w-xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_40px_120px_-40px_rgba(8,30,40,0.55)] [translate:-50%_0] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:slide-in-from-top-2 duration-300"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            setQuery("");
            inputRef.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restoreFocus();
          }}
        >
          <Dialog.Title className="sr-only">Search the Zodiac collection</Dialog.Title>
          <div className="flex shrink-0 items-center gap-3 border-b border-ink/10 px-5 py-4">
            <Search className="h-4 w-4 text-deep/50" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing && results[0]) goToEdition(results[0].id);
              }}
              placeholder="Search Buffalo, Dragon, Tý…"
              aria-label="Search editions"
              className="h-9 min-w-0 flex-1 bg-transparent font-sans text-base text-ink outline-none placeholder:text-deep/55"
            />
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 shrink-0 place-items-center rounded-full text-deep/60 transition-colors hover:bg-mist hover:text-ink"
              aria-label="Close search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
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

          <p id="edition-search-note" className="shrink-0 border-t border-ink/10 px-5 py-3 text-[11px] text-deep/65">
            SafeKid isn’t available to order yet.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
