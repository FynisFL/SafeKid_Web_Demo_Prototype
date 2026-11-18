import { useEffect, useState, type ReactNode } from "react";

import { zodiacProducts } from "@/data/zodiac";
import { MAX_QUANTITY, ShoppingBagContext, type BagLine } from "./shoppingBag";

const storageKey = "safekid.shopping-bag.v1";
const editionIds = new Set(zodiacProducts.map(({ id }) => id));

function readBag(): BagLine[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(value)) return [];
    const quantities = new Map<string, number>();
    for (const line of value) {
      if (!line || !editionIds.has(line.id) || !Number.isInteger(line.quantity) || line.quantity < 1) continue;
      quantities.set(line.id, Math.min(MAX_QUANTITY, (quantities.get(line.id) ?? 0) + line.quantity));
    }
    return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
  } catch {
    return [];
  }
}

export function ShoppingBagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState(readBag);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lines));
    } catch {
      // The bag still works for this visit when browser storage is unavailable.
    }
  }, [lines]);

  function add(id: string) {
    setLines((current) => {
      const line = current.find((item) => item.id === id);
      if (!line) return [...current, { id, quantity: 1 }];
      if (line.quantity >= MAX_QUANTITY) return current;
      return current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
    });
  }

  function setQuantity(id: string, quantity: number) {
    setLines((current) => quantity <= 0
      ? current.filter((line) => line.id !== id)
      : current.map((line) => line.id === id ? { ...line, quantity: Math.min(quantity, MAX_QUANTITY) } : line));
  }

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <ShoppingBagContext.Provider value={{ lines, count, add, setQuantity }}>
      {children}
    </ShoppingBagContext.Provider>
  );
}
