// Adapted from React Bits Orbit Images by Dominik Koch (TS-TW).
// https://reactbits.dev/r/OrbitImages-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
import { motion } from "motion/react";
import { BREAKPOINT } from "@/lib/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DURATION, EASE } from "../tokens";
import { useEnhancedMotion } from "../useEnhancedMotion";

type OrbitItem = { id: string; image: string; label: string };

export function OrbitImages({ items, active, select }: { items: OrbitItem[]; active: number; select: (index: number) => void }) {
  const compact = useMediaQuery(`(max-width: ${BREAKPOINT.tablet - 1}px)`);
  const enhanced = useEnhancedMotion();
  const radius = compact ? 40 : 43;
  const size = items.length;
  const isNeighbor = (index: number) => [0, 1, 2, size - 2, size - 1].includes((index - active + size) % size);

  return (
    <div data-orbit-images="" className="pointer-events-none absolute inset-0 z-10">
      <span aria-hidden="true" className="absolute inset-[6%] rounded-full border border-primary/45" />
      {items.map((item, index) => {
        const offset = (index - active + size) % size;
        if (compact && !isNeighbor(index)) return null;
        const angle = offset / size * 2 * Math.PI + (compact ? Math.PI / 2 : -Math.PI / 2);
        const point = { left: `${50 + radius * Math.cos(angle)}%`, top: `${50 + radius * Math.sin(angle)}%` };
        return (
          <motion.button
            key={item.id}
            type="button"
            tabIndex={-1}
            aria-label={`Select ${item.label} in orbit`}
            aria-pressed={active === index}
            onClick={() => select(index)}
            initial={false}
            animate={point}
            transition={{ duration: enhanced ? DURATION.quick : 0, ease: EASE }}
            className="pointer-events-auto absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/45 bg-white/90 shadow-sm aria-pressed:border-aqua-ink aria-pressed:ring-2 aria-pressed:ring-primary/40 sm:size-[clamp(2.75rem,4.6vw,3.5rem)]"
          >
            <img src={item.image} alt="" width={48} height={48} loading="lazy"
              className="h-[86%] w-[86%] object-contain" />
          </motion.button>
        );
      })}
    </div>
  );
}
