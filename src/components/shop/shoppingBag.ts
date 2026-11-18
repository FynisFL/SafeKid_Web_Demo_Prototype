import { createContext, useContext } from "react";

export const WATCH_PRICE_VND = 1_450_000;
export const MAX_QUANTITY = 99;

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export function formatVnd(amount: number) {
  return currency.format(amount);
}

export type BagLine = { id: string; quantity: number };

export const ShoppingBagContext = createContext<{
  lines: BagLine[];
  count: number;
  add: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
} | null>(null);

export function useShoppingBag() {
  const bag = useContext(ShoppingBagContext);
  if (!bag) throw new Error("Shopping bag provider is missing.");
  return bag;
}
