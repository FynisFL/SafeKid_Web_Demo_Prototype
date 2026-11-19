import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, LockKeyhole, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import "./shop-controls.css";

import momoIcon from "@/assets/safekid/payments/momo.png";
import { DURATION, EASE } from "@/components/motion/tokens";
import { Button } from "@/components/ui/button";

import { paymentMethods, type PaymentMethod } from "./paymentMethods";

function PaymentIcon({ method }: { method: PaymentMethod }) {
  const Icon = method.icon;
  return Icon ? (
    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-mist text-deep">
      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
    </span>
  ) : (
    <img src={momoIcon} width={36} height={36} className="size-9 shrink-0 object-contain" alt="" />
  );
}

export function PaymentPreview({ selected, onSelect }: {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <fieldset className="min-w-0 rounded-[28px] border border-border bg-white p-5 sm:p-7">
      <legend className="sr-only">Payment method</legend>
      <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight text-ink">Payment method</h2>
      <p className="mt-3 text-sm leading-relaxed text-deep">Choose a method to preview checkout. Ordering is closed until launch.</p>
      <div className="mt-5 grid gap-2.5">
        {paymentMethods.map((method) => {
          const active = method.id === selected.id;
          return (
            <motion.label
              key={method.id}
              className="relative isolate flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border border-border px-3.5 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink sm:px-4"
              whileTap={reduce ? undefined : { scale: 0.985 }}
            >
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : "checkout-payment-option"}
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] border border-deep/45 bg-mist"
                  transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
                />
              )}
              <input className="sr-only" type="radio" name="payment-method" checked={active} value={method.id} onChange={() => onSelect(method)} />
              <PaymentIcon method={method} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{method.label}</span>
                <span className="block text-xs leading-relaxed text-deep/75">{method.detail}</span>
              </span>
              <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${active ? "border-[#287475]" : "border-ink/30"}`} aria-hidden="true">
                {active && <motion.span className="size-2 rounded-full bg-[#287475]" initial={reduce ? false : { scale: 0.4 }} animate={{ scale: 1 }} />}
              </span>
            </motion.label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CheckoutConfirm({ method }: { method: PaymentMethod }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="shop-flow-btn w-full" variant="outline" type="button">
          Confirm payment <ArrowRight aria-hidden="true" />
        </Button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[90] bg-night/65 backdrop-blur-[3px]"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.22 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-[91] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[30rem] overflow-auto rounded-[28px] border border-white bg-white p-5 shadow-2xl [translate:-50%_-50%] sm:p-7"
                initial={reduce ? false : { opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
                transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
              >
                <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-aqua-soft text-[#17646a]" aria-hidden="true">
                  <ShoppingBag size={23} strokeWidth={1.75} />
                </span>
                <Dialog.Title className="display display-md max-w-[18ch] pr-4">SafeKid isn’t available to order yet</Dialog.Title>
                <Dialog.Description className="mt-3 text-sm leading-relaxed text-deep">Your items are still in your bag. No payment was taken.</Dialog.Description>
                <div className="my-5 flex items-center gap-3 rounded-2xl bg-mist p-3">
                  <PaymentIcon method={method} />
                  <div className="min-w-0">
                    <p className="text-xs text-deep/70">Selected method</p>
                    <p className="text-sm font-semibold text-ink">{method.label}</p>
                  </div>
                  <LockKeyhole size={17} className="ml-auto shrink-0 text-deep/65" aria-hidden="true" />
                </div>
                <Dialog.Close asChild>
                  <Button variant="outline" className="shop-flow-btn w-full" type="button">Continue reviewing checkout</Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button type="button" aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full text-deep hover:bg-mist">
                    <X size={19} aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
