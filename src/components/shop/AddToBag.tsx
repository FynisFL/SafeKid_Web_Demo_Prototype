import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatVnd, MAX_QUANTITY, useShoppingBag, WATCH_PRICE_VND } from "./shoppingBag";

export function AddToBag({ editionId }: { editionId: string }) {
  const { add, lines } = useShoppingBag();
  const [added, setAdded] = useState(false);
  const quantity = lines.find(({ id }) => editionId === id)?.quantity ?? 0;
  const full = quantity >= MAX_QUANTITY;

  return (
    <div className="mt-7">
      <p className="font-display text-3xl font-semibold tracking-tight text-ink tabular-nums">{formatVnd(WATCH_PRICE_VND)}</p>
      <p className="mt-2 text-sm text-deep/70">Per watch · Not available to order yet</p>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button type="button" size="lg" variant="brand" disabled={full} onClick={() => {
          add(editionId);
          setAdded(true);
        }}>
          <ShoppingBag aria-hidden="true" /> Add to bag
        </Button>
        {quantity > 0 && (
          <Button asChild size="lg" variant="outline"><Link to="/cart">View bag</Link></Button>
        )}
      </div>
      <p className="mt-2 min-h-5 text-[13px] text-deep" role="status">
        {full ? "You've reached the limit for this edition." : added && quantity > 0 ? `${quantity} of this edition in your bag.` : null}
      </p>
    </div>
  );
}
