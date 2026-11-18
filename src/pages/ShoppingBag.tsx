import { ArrowLeft, ArrowRight, CreditCard, Minus, Plus, QrCode, ShoppingBag as BagIcon, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

import { formatVnd, MAX_QUANTITY, useShoppingBag, WATCH_PRICE_VND } from "@/components/shop/shoppingBag";
import { Reveal } from "@/components/site/Reveal";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodiacProducts } from "@/data/zodiac";
import { usePageTitle } from "@/hooks/usePageTitle";

const paymentMethods = [
  { id: "qr", label: "Bank QR", detail: "VNPAY-QR", icon: QrCode },
  { id: "card", label: "Debit or credit card", detail: "Domestic or international card", icon: CreditCard },
  { id: "wallet", label: "E-wallet", detail: "MoMo", icon: Wallet },
] as const;

function PaymentPreview() {
  return (
    <fieldset className="min-w-0 rounded-[28px] border border-border bg-white p-5 sm:p-7">
      <legend className="sr-only">Payment method</legend>
      <h2 className="display display-md">Payment method</h2>
      <p className="mt-3 text-sm leading-relaxed text-deep/75">Preview the options planned for launch. Ordering is currently closed.</p>
      <div className="mt-5 grid gap-2">
        {paymentMethods.map(({ id, label, detail, icon: Icon }, index) => (
          <label key={id} className="flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border border-border px-3 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-aqua-soft/60 sm:px-4">
            <input className="h-4 w-4 shrink-0 accent-ink" type="radio" name="payment-method" value={id} defaultChecked={index === 0} />
            <Icon className="h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{label}</span>
              <span className="block text-xs leading-relaxed text-deep/70">{detail}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ShoppingBag({ checkout = false }: { checkout?: boolean }) {
  const { count, lines, setQuantity } = useShoppingBag();
  const title = checkout ? "Checkout" : "Shopping bag";
  usePageTitle(`${title} | SafeKid`);

  return (
    <SiteLayout>
      <section className="bg-mist pb-20 pt-28 sm:pb-28 lg:pt-36">
        <div className="shell">
          <Reveal>
            <Link to={checkout ? "/cart" : "/zodiac"} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-deep hover:text-ink">
              <ArrowLeft size={16} aria-hidden="true" /> {checkout ? "Back to bag" : "Browse the collection"}
            </Link>
            <h1 className="display display-lg mt-4">{title}</h1>
            <p className="lede mt-4 max-w-[48ch]">
              {checkout ? "Review your bag and explore the planned payment options." : "Review your chosen editions before previewing checkout."}
            </p>
          </Reveal>
          {count === 0 ? (
            <Reveal className="mt-8 rounded-[28px] border border-border bg-white px-5 py-12 text-center">
              <BagIcon className="mx-auto mb-4 h-7 w-7 text-deep" aria-hidden="true" />
              <h2 className="display display-md">Your bag is empty</h2>
              <Button asChild variant="brand" className="mt-6"><Link to="/zodiac">Explore the collection</Link></Button>
            </Reveal>
          ) : (
            <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="grid min-w-0 gap-5">
                {checkout && <PaymentPreview />}
                <Reveal className="min-w-0 rounded-[28px] border border-border bg-white p-4 sm:p-7">
                  <h2 className="display display-md">{checkout ? "Your items" : "In your bag"}</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {lines.map(({ id, quantity }) => {
                      const product = zodiacProducts.find((item) => item.id === id);
                      if (!product) return null;
                      return (
                        <li key={id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-4 sm:gap-5">
                          <Link to={`/product/${id}`} aria-label={product.detailTitle} className="grid size-16 place-items-center rounded-xl bg-mist sm:size-24">
                            <img src={product.image} alt="" className="h-full w-full object-contain" />
                          </Link>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">{product.detailTitle}</p>
                            <p className="mt-1 text-xs text-deep/75">{formatVnd(WATCH_PRICE_VND)} each</p>
                            {checkout ? (
                              <p className="mt-2 text-sm text-deep">Quantity {quantity}</p>
                            ) : (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center rounded-full border border-border">
                                  <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-mist disabled:opacity-40" disabled={quantity <= 1}
                                    aria-label={`Decrease quantity for ${product.detailTitle}`} onClick={() => setQuantity(id, quantity - 1)}>
                                    <Minus size={15} aria-hidden="true" />
                                  </button>
                                  <output aria-label={`Quantity for ${product.detailTitle}`} className="min-w-5 text-center text-sm tabular-nums">{quantity}</output>
                                  <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-mist disabled:opacity-40" disabled={quantity >= MAX_QUANTITY}
                                    aria-label={`Increase quantity for ${product.detailTitle}`} onClick={() => setQuantity(id, quantity + 1)}>
                                    <Plus size={15} aria-hidden="true" />
                                  </button>
                                </div>
                                <button type="button" aria-label={`Remove ${product.detailTitle}`} className="min-h-11 px-1 text-xs text-deep underline underline-offset-4" onClick={() => setQuantity(id, 0)}>
                                  Remove
                                </button>
                              </div>
                            )}
                            <p className="mt-2 text-sm font-semibold tabular-nums text-ink">{formatVnd(quantity * WATCH_PRICE_VND)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              </div>
              <Reveal delay={0.06} className="rounded-[28px] border border-border bg-white p-5 sm:p-7">
                <h2 className="display display-md">Bag summary</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-3 text-ink">
                    <dt>Subtotal · {count} {count === 1 ? "watch" : "watches"}</dt>
                    <dd className="shrink-0 font-semibold tabular-nums">{formatVnd(count * WATCH_PRICE_VND)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 text-deep/75">
                    <dt>Delivery</dt>
                    <dd>Calculated after launch</dd>
                  </div>
                </dl>
                <p className="my-5 border-t border-border pt-4 text-sm leading-relaxed text-deep/75">
                  SafeKid isn’t available to order yet.
                </p>
                {checkout ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="brand" size="lg">Confirm payment <ArrowRight aria-hidden="true" /></Button>
                    </DialogTrigger>
                    <DialogContent className="w-[calc(100%-2rem)] max-w-[28rem] rounded-[28px]">
                      <DialogTitle className="display display-md pr-7">SafeKid isn’t available to order yet</DialogTitle>
                      <DialogDescription className="leading-relaxed">Your items are still in your bag. No payment was taken.</DialogDescription>
                      <DialogClose asChild>
                        <Button variant="brand" className="mt-1">Continue reviewing checkout</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button asChild className="w-full" variant="brand" size="lg">
                    <Link to="/checkout">Preview checkout <ArrowRight aria-hidden="true" /></Link>
                  </Button>
                )}
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
