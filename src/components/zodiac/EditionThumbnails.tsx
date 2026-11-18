import { useEffect, useRef, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { zodiacProducts } from "@/data/zodiac";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/tokens";

export function EditionThumbnails({ index, onPick, className }: {
  index: number;
  onPick: (index: number) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const initialIndex = useRef(index);
  const [viewport, api] = useEmblaCarousel({
    align: "center", containScroll: "keepSnaps", watchFocus: false, startIndex: initialIndex.current,
  });
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!api) return;
    const align = () => api.scrollTo(index, Boolean(reduce));
    align();
    api.on("reInit", align);
    return () => { api.off("reInit", align); };
  }, [api, index, reduce]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const count = zodiacProducts.length;
    const targets = { ArrowLeft: (index + count - 1) % count, ArrowRight: (index + 1) % count, Home: 0, End: count - 1 };
    const next = targets[event.key as keyof typeof targets];
    if (next === undefined) return;
    event.preventDefault();
    onPick(next);
    refs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <div className={cn("max-w-full rounded-2xl border border-ink/10 bg-white/65", className)}>
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 text-xs font-medium text-deep">
        <span>Choose an edition</span>
        <span className="tabular-nums">{String(index + 1).padStart(2, "0")} / {zodiacProducts.length}</span>
      </div>
      <div ref={viewport} className="overflow-hidden rounded-b-2xl">
        <div className="flex touch-pan-y touch-pinch-zoom gap-1.5 px-1.5 py-2.5" role="group" aria-label="Edition thumbnails">
          {zodiacProducts.map((edition, i) => (
            <motion.button
              key={edition.id}
              ref={(node) => { refs.current[i] = node; }}
              type="button"
              aria-label={edition.detailTitle}
              aria-pressed={index === i}
              tabIndex={index === i ? 0 : -1}
              onClick={() => onPick(i)}
              onKeyDown={onKeyDown}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={{ duration: 0.14, ease: EASE }}
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink sm:size-14",
                index === i ? "border-[#17646a] bg-aqua-soft" : "border-ink/10 bg-white hover:border-ink/40"
              )}
            >
              <img src={edition.image} alt="" loading="lazy" width={48} height={48} className="size-full object-contain" draggable={false} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
