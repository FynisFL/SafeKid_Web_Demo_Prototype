import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { zodiacProducts } from "@/data/zodiac";
import { cn } from "@/lib/utils";

type ZodiacStageProps = {
  variant?: "home" | "page";
};

export function ZodiacStage({ variant = "home" }: ZodiacStageProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const product = zodiacProducts[index];

  function select(next: number) {
    const count = zodiacProducts.length;
    const normalized = ((next % count) + count) % count;
    setDirection(normalized > index || (index === count - 1 && normalized === 0) ? 1 : -1);
    setIndex(normalized);
  }

  function handleKeyDown(event: React.KeyboardEvent, currentIndex: number) {
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const back = event.key === "ArrowUp" || event.key === "ArrowLeft";
    if (!forward && !back) return;

    event.preventDefault();
    const next = (currentIndex + (forward ? 1 : -1) + zodiacProducts.length) % zodiacProducts.length;
    select(next);
    itemRefs.current[next]?.focus();
  }

  const slide = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 56 : -56, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.98 }),
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white",
        variant === "page" ? "py-16 sm:py-20" : "py-20 sm:py-24 lg:py-28"
      )}
      aria-labelledby="collection-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-mist to-transparent"
      />
      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              The Vietnamese Zodiac Collection
            </p>
            <h2 id="collection-heading" className="display display-lg mt-6 max-w-[16ch]">
              Twelve characters.
              <br />
              One little explorer.
            </h2>
          </div>
          <p className="max-w-[36ch] text-[14px] leading-relaxed text-muted-foreground lg:pb-2">
            Each edition brings a different character to the same SafeKid watch concept. Choose a
            favourite to see it up close.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-deep/50">
                Choose a character
              </p>
              <p className="text-[10px] tabular-nums text-deep/55">
                {String(index + 1).padStart(2, "0")} / 12
              </p>
            </div>

            <ul
              className="mt-2 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-2"
              aria-label="Zodiac editions"
            >
              {zodiacProducts.map((item, itemIndex) => {
                const selected = itemIndex === index;
                return (
                  <li key={item.id}>
                    <button
                      ref={(node) => {
                        itemRefs.current[itemIndex] = node;
                      }}
                      type="button"
                      onClick={() => select(itemIndex)}
                      onKeyDown={(event) => handleKeyDown(event, itemIndex)}
                      aria-pressed={selected}
                      tabIndex={selected ? 0 : -1}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg border-b border-ink/[0.07] px-2 py-3 text-left transition-colors",
                        selected ? "bg-mist/70 text-ink" : "text-deep/55 hover:bg-mist/40 hover:text-ink"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[9px] tabular-nums tracking-[0.12em] transition-colors",
                          selected ? "text-primary" : "text-deep/45"
                        )}
                      >
                        {String(itemIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-[15px] font-medium tracking-[-0.02em]">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] transition-colors",
                          selected ? "text-primary" : "text-deep/45"
                        )}
                      >
                        {item.animal}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-1 w-1 rounded-full transition-all",
                          selected ? "bg-primary" : "bg-transparent"
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 max-w-[38ch] text-[11px] leading-relaxed text-deep/60">
              Use arrow keys to move through the collection. These are design concepts — pricing,
              availability and live device capabilities are not confirmed.
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              <div aria-hidden="true" className="stage-glow absolute inset-[3%] rounded-full" />
              <div
                aria-hidden="true"
                className="absolute inset-[9%] rounded-full border border-primary/20"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[17%] rounded-full border border-dashed border-primary/25 animate-sk-spin"
              />

              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={product.animal}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[40vw] font-extrabold leading-none text-primary/[0.13] sm:text-[17rem]"
                >
                  {product.animal.charAt(0)}
                </motion.span>
              </AnimatePresence>

              <motion.div
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -48 || info.velocity.x < -320) select(index + 1);
                  else if (info.offset.x > 48 || info.velocity.x > 320) select(index - 1);
                }}
                className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.img
                    key={product.id}
                    src={product.image}
                    alt={`SafeKid smartwatch concept in the ${product.label} edition, Vietnamese Zodiac ${product.animal}`}
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_40px_60px_rgba(16,42,56,0.14)]"
                    draggable={false}
                  />
                </AnimatePresence>
              </motion.div>

              <div className="absolute right-0 top-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => select(index - 1)}
                  aria-label="Previous edition"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-deep/60 backdrop-blur transition-colors hover:border-primary/40 hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => select(index + 1)}
                  aria-label="Next edition"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-deep/60 backdrop-blur transition-colors hover:border-primary/40 hover:text-ink"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="absolute bottom-1 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-deep/45 sm:flex">
                <MoveHorizontal className="h-3 w-3" aria-hidden="true" />
                Drag to explore
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-[24px] border border-ink/[0.08] bg-white/70 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Vietnamese Zodiac / {product.animal}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={product.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 font-display text-[22px] font-medium tracking-[-0.04em] text-ink"
                  >
                    {product.label} edition
                  </motion.p>
                </AnimatePresence>
              </div>
              <Link
                to={`/product/${product.id}`}
                className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-[13px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night btn-motion sm:self-auto"
              >
                Explore this edition
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
