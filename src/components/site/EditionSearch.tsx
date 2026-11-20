import { useMemo, useRef, useState, type RefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Search, X } from "lucide-react";
import { zodiacProducts } from "@/data/zodiac";

type EditionSearchProps = {
  open: boolean;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
};

export function EditionSearch({ open, onClose, returnFocus }: EditionSearchProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      {open && <SearchContent onClose={onClose} returnFocus={returnFocus} />}
    </Dialog.Root>
  );
}

function SearchContent({ onClose, returnFocus }: Omit<EditionSearchProps, "open">) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const leaving = useRef(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zodiacProducts;
    return zodiacProducts.filter((product) =>
      `${product.label} ${product.animal} ${product.id}`.toLowerCase().includes(q)
    );
  }, [query]);

  function goToEdition(id: string) {
    leaving.current = true;
    onClose();
    navigate(`/product/${id}`);
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[79] bg-night/35 backdrop-blur-[6px]" />
      <Dialog.Content
        aria-describedby={undefined}
        className="safe-search fixed z-[80] mx-auto max-w-xl overflow-y-auto rounded-[28px] border border-white/70 bg-white shadow-xl motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:slide-in-from-top-2 duration-200"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (!leaving.current) returnFocus.current?.focus({ preventScroll: true });
        }}
      >
        <Dialog.Title className="sr-only">Search the Zodiac collection</Dialog.Title>
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
            className="min-h-11 min-w-0 flex-1 bg-transparent font-sans text-base text-ink outline-none placeholder:text-deep/55"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full text-deep/70 transition-colors hover:bg-mist hover:text-ink"
            aria-label="Close search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[54vh] supports-[height:100dvh]:max-h-[54dvh] overflow-y-auto p-2">
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
                  onClick={() => { leaving.current = true; onClose(); }}
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
          SafeKid isn’t available to order yet.
        </p>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
