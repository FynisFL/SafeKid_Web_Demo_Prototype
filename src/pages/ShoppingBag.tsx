import { ArrowLeft, ArrowRight, CreditCard, LockKeyhole, Minus, Plus, ShoppingBag as BagIcon, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

import "@/components/shop/shop-controls.css";

import { DISTANCE, DURATION, EASE } from "@/components/motion/tokens";
import { CheckoutConfirm, PaymentPreview } from "@/components/shop/PaymentPreview";
import { paymentMethods, type PaymentMethod } from "@/components/shop/paymentMethods";
import { formatVnd, MAX_QUANTITY, useShoppingBag, WATCH_PRICE_VND } from "@/components/shop/shoppingBag";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { zodiacProducts } from "@/data/zodiac";
import { usePageTitle } from "@/hooks/usePageTitle";

const previewFees = [
  { label: "Shipping", amount: 0 },
  { label: "VAT", amount: 0 },
  { label: "Platform fee", amount: 0 },
];

function PurchaseSteps({ checkout }: { checkout: boolean }) {
  return (
    <nav aria-label="Shopping steps" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-deep/75">
        <li>
          {checkout ? (
            <Link to="/cart" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 hover:bg-white hover:text-ink">
              <BagIcon size={15} aria-hidden="true" /> Bag
            </Link>
          ) : (
            <span aria-current="step" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink px-3 text-white">
              <BagIcon size={15} aria-hidden="true" /> Bag
            </span>
          )}
        </li>
        <li aria-hidden="true"><ArrowRight size={13} /></li>
        <li>
          <span
            aria-current={checkout ? "step" : undefined}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 ${checkout ? "bg-ink text-white" : ""}`}
          >
            <CreditCard size={15} aria-hidden="true" /> Checkout
          </span>
        </li>
      </ol>
    </nav>
  );
}

function BagItems({ checkout }: { checkout: boolean }) {
  const { lines, setQuantity } = useShoppingBag();
  const reduce = useReducedMotion();

  return (
    <section className="min-w-0 rounded-[28px] border border-border bg-white p-4 sm:p-7" aria-labelledby="bag-items-title">
      <h2 id="bag-items-title" className="shop-card-title">{checkout ? "Your items" : "In your bag"}</h2>
      <ul className="relative mt-4 divide-y divide-border">
        <AnimatePresence initial={false} mode={reduce ? "sync" : "popLayout"}>
          {lines.map(({ id, quantity }) => {
            const product = zodiacProducts.find((item) => item.id === id);
            if (!product) return null;
            return (
              <motion.li
                key={id}
                layout={reduce ? false : "position"}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-4 sm:gap-5"
              >
                <Link to={`/product/${id}`} aria-label={product.detailTitle} className="grid size-16 place-items-center rounded-xl bg-mist transition-colors hover:bg-aqua-soft sm:size-24">
                  <img src={product.image} width={900} height={900} alt="" className="h-full w-full object-contain" />
                </Link>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-semibold text-ink">{product.detailTitle}</p>
                    <motion.p
                      key={quantity}
                      initial={reduce ? false : { opacity: 0.55, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduce ? 0 : 0.24, ease: EASE }}
                      className="text-sm font-semibold tabular-nums text-ink"
                    >
                      {formatVnd(quantity * WATCH_PRICE_VND)}
                    </motion.p>
                  </div>
                  <p className="mt-1 text-xs text-deep/75">{quantity} × {formatVnd(WATCH_PRICE_VND)}</p>
                  {!checkout && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <motion.button
                          type="button" className="grid size-11 place-items-center rounded-full hover:bg-mist disabled:opacity-40"
                          disabled={quantity <= 1} whileTap={reduce ? undefined : { scale: 0.87 }}
                          aria-label={`Decrease quantity for ${product.detailTitle}`} onClick={() => setQuantity(id, quantity - 1)}
                        >
                          <Minus size={15} aria-hidden="true" />
                        </motion.button>
                        <output aria-label={`Quantity for ${product.detailTitle}`} className="min-w-5 text-center text-sm tabular-nums">{quantity}</output>
                        <motion.button
                          type="button" className="grid size-11 place-items-center rounded-full hover:bg-mist disabled:opacity-40"
                          disabled={quantity >= MAX_QUANTITY} whileTap={reduce ? undefined : { scale: 0.87 }}
                          aria-label={`Increase quantity for ${product.detailTitle}`} onClick={() => setQuantity(id, quantity + 1)}
                        >
                          <Plus size={15} aria-hidden="true" />
                        </motion.button>
                      </div>
                      <button
                        type="button" aria-label={`Remove ${product.detailTitle}`}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-xs text-deep transition-colors hover:bg-mist hover:text-ink"
                        onClick={() => setQuantity(id, 0)}
                      >
                        <Trash2 size={14} aria-hidden="true" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function BagSummary({ checkout, method, subtotal, total }: {
  checkout: boolean;
  method: PaymentMethod;
  subtotal: number;
  total: number;
}) {
  const { count } = useShoppingBag();
  const reduce = useReducedMotion();

  return (
    <section id="bag-summary" className="min-w-0 scroll-mt-24 rounded-[24px] bg-night p-5 text-white shadow-[0_16px_40px_-30px_rgba(16,42,56,0.6)] sm:p-6 lg:sticky lg:top-28" aria-labelledby="bag-summary-title">
      <h2 id="bag-summary-title" className="shop-card-title text-white">Bag summary</h2>
      <dl className="mt-4">
        <div className="flex justify-between gap-3 text-sm">
          <dt>Subtotal <span className="whitespace-nowrap text-white/65">· {count} {count === 1 ? "watch" : "watches"}</span></dt>
          <dd className="shrink-0 font-semibold tabular-nums">{formatVnd(subtotal)}</dd>
        </div>
        {previewFees.map(({ label, amount }) => (
          <div key={label} className="mt-3 flex justify-between gap-3 text-sm text-white/75">
            <dt>{label}</dt>
            <dd className="shrink-0 font-medium text-aqua-soft">{amount === 0 ? "Free" : formatVnd(amount)}</dd>
          </div>
        ))}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-white/20 pt-4">
          <dt className="font-semibold">Preview total</dt>
          <motion.dd
            key={total}
            data-preview-total=""
            initial={reduce ? false : { opacity: 0.45, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
            className="font-display text-2xl font-semibold tracking-tight text-white tabular-nums"
          >
            {formatVnd(total)}
          </motion.dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-white/70">Fees shown apply to this preview. Launch rates may differ.</p>
      <div className="mb-4 mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/85">
        <LockKeyhole size={16} className="shrink-0 text-aqua-soft" aria-hidden="true" /> SafeKid isn’t available to order yet.
      </div>
      {checkout ? (
        <CheckoutConfirm method={method} />
      ) : (
        <Button asChild className="shop-flow-btn w-full" variant="outline">
          <Link to="/checkout">Preview checkout <ArrowRight aria-hidden="true" /></Link>
        </Button>
      )}
    </section>
  );
}

export default function ShoppingBag({ checkout = false }: { checkout?: boolean }) {
  const { count } = useShoppingBag();
  const reduce = useReducedMotion();
  const [method, setMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const subtotal = count * WATCH_PRICE_VND;
  const total = subtotal + previewFees.reduce((sum, fee) => sum + fee.amount, 0);
  const title = checkout ? "Checkout" : "Shopping bag";
  usePageTitle(`${title} | SafeKid`);

  return (
    <SiteLayout>
      <div className="overflow-x-clip">
        <AnimatePresence mode="wait">
          <motion.section
            key={title}
            data-shop-step={checkout ? "checkout" : "bag"}
            className="bg-mist pb-20 pt-28 sm:pb-28 lg:pt-36"
            initial={reduce ? false : { opacity: 0.65, x: checkout ? DISTANCE.sm : -DISTANCE.sm }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0.65, x: checkout ? DISTANCE.sm : -DISTANCE.sm }}
            transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
          >
            <div className="shell">
              <PurchaseSteps checkout={checkout} />
              <h1 className="display display-lg">{title}</h1>
              <p className="lede mt-4 max-w-[48ch]">
                {checkout ? "Review your total and choose a payment method to preview." : "Review your chosen editions before previewing checkout."}
              </p>
              {count === 0 ? (
                <div className="mt-8 rounded-[28px] border border-border bg-white px-5 py-12 text-center">
                  <BagIcon className="mx-auto mb-4 h-7 w-7 text-deep" aria-hidden="true" />
                  <h2 className="display display-md">Your bag is empty</h2>
                  <Button asChild variant="outline" className="shop-flow-btn mt-6"><Link to="/zodiac">Explore the collection</Link></Button>
                </div>
              ) : (
                <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <div className="grid min-w-0 gap-5">
                    {checkout && <PaymentPreview selected={method} onSelect={setMethod} />}
                    <BagItems checkout={checkout} />
                  </div>
                  <BagSummary checkout={checkout} method={method} subtotal={subtotal} total={total} />
                </div>
              )}
              <Link to={checkout ? "/cart" : "/zodiac"} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-deep hover:text-ink">
                <ArrowLeft size={16} aria-hidden="true" /> {checkout ? "Back to bag" : "Browse the collection"}
              </Link>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
      {count > 0 && <div className="h-[calc(5rem+var(--safe-bottom))] lg:hidden" aria-hidden="true" />}
      {count > 0 && createPortal(
        <motion.aside
          aria-label="Quick bag total"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-white pl-[max(1.25rem,var(--safe-left))] pr-[max(1.25rem,var(--safe-right))] pb-[calc(0.75rem+var(--safe-bottom))] pt-3 shadow-[0_-6px_24px_#172b350d] lg:hidden"
          initial={reduce ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
        >
          <div className="mx-auto flex max-w-[60rem] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-deep/75">Preview total · {count} {count === 1 ? "watch" : "watches"}</p>
              <p className="text-sm font-semibold tabular-nums text-ink">{formatVnd(total)}</p>
            </div>
            <Button asChild variant="outline" className="shop-flow-btn shrink-0">
              {checkout ? (
                <a href="#bag-summary">Review total <ArrowRight aria-hidden="true" /></a>
              ) : (
                <Link to="/checkout">Checkout <ArrowRight aria-hidden="true" /></Link>
              )}
            </Button>
          </div>
        </motion.aside>,
        document.body
      )}
    </SiteLayout>
  );
}
