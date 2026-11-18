import { useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Check, ShoppingBag } from "lucide-react";
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EASE } from "@/components/motion/tokens";
import { Button } from "@/components/ui/button";
import { formatVnd, MAX_QUANTITY, useShoppingBag, WATCH_PRICE_VND } from "./shoppingBag";

type Point = { x: number; y: number };
type Flight = { id: number; start: Point; end: Point };
const tileSize = 56;

function center(element: Element): Point {
  const bounds = element.getBoundingClientRect();
  return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
}

export function AddToBag({ editionId, image }: { editionId: string; image: string }) {
  const { add, lines } = useShoppingBag();
  const reduce = useReducedMotion();
  const [added, setAdded] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const sequence = useRef(0);
  const quantity = lines.find(({ id }) => editionId === id)?.quantity ?? 0;
  const full = quantity >= MAX_QUANTITY;

  function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    const bagIcon = document.querySelector("#site-shopping-bag svg");
    if (!reduce && bagIcon) {
      const start = center(event.currentTarget);
      const end = center(bagIcon);
      const id = ++sequence.current;
      setFlights((current) => [...current.slice(-2), { id, start, end }]);
    }
    add(editionId);
    setAdded(true);
  }

  function land(id: number) {
    setFlights((current) => current.filter((flight) => flight.id !== id));
    const bagIcon = document.querySelector("#site-shopping-bag svg");
    if (bagIcon && !reduce) {
      void animate(bagIcon, { scale: [1, 1.24, 1] }, { duration: 0.34, ease: EASE });
    }
  }

  return (
    <div className="mt-7">
      <p className="font-display text-3xl font-semibold tracking-tight text-ink tabular-nums">{formatVnd(WATCH_PRICE_VND)}</p>
      <p className="mt-2 text-sm text-deep/70">Per watch · Not available to order yet</p>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button type="button" size="lg" variant="brand" disabled={full} onClick={handleAdd}>
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={added && quantity > 0 ? "added" : "bag"}
              initial={reduce ? false : { opacity: 0, scale: 0.68 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.68 }}
              transition={{ duration: reduce ? 0 : 0.15, ease: EASE }}
              aria-hidden="true"
            >
              {added && quantity > 0 ? <Check /> : <ShoppingBag />}
            </motion.span>
          </AnimatePresence>
          Add to bag
        </Button>
        <AnimatePresence initial={false}>
          {quantity > 0 && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
            >
              <Button asChild size="lg" variant="outline"><Link to="/cart">View bag</Link></Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-2 min-h-5 text-[13px] text-deep" role="status">
        {full ? "You've reached the limit for this edition." : added && quantity > 0 ? `${quantity} of this edition in your bag.` : null}
      </p>
      {!reduce && flights.length > 0 && createPortal(
        flights.map(({ id, start, end }) => {
          const half = tileSize / 2;
          return (
            <motion.div
              key={id}
              data-bag-flight=""
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-[80] grid place-items-center rounded-2xl border border-primary/55 bg-white shadow-lg"
              style={{ height: tileSize, width: tileSize }}
              initial={{ x: start.x - half, y: start.y - half, scale: 0.48, opacity: 0.7 }}
              animate={{
                x: [start.x - half, (start.x + end.x) / 2 - half, end.x - half],
                y: [start.y - half, Math.max(4, (start.y + end.y) / 2 - half - 64), end.y - half],
                scale: [0.48, 1, 0.18],
                rotate: [0, -11, 8],
                opacity: [0.7, 1, 0],
              }}
              transition={{ duration: 0.68, times: [0, 0.38, 1], ease: EASE }}
              onAnimationComplete={() => land(id)}
            >
              <img src={image} alt="" className="size-12 object-contain" />
            </motion.div>
          );
        }),
        document.body
      )}
    </div>
  );
}
