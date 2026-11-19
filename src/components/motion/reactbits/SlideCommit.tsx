// Adapted from React Bits Slide Commit (TS-TW).
// https://reactbits.dev/r/SlideCommit-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
import { useRef, useState, type PointerEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { animate, motion, useMotionValue } from "motion/react";
import { DURATION, EASE } from "../tokens";
import { useEnhancedMotion } from "../useEnhancedMotion";

type Grip = { id: number; start: number; travel: number };
type Props = { label: string; doneLabel: string; onConfirm: () => boolean | void; completed?: boolean };

export function SlideCommit({ label, doneLabel, onConfirm, completed }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const pointer = useRef<Grip | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const done = completed ?? confirmed;
  const x = useMotionValue(0);
  const enhanced = useEnhancedMotion();

  function goBack() {
    if (enhanced) animate(x, 0, { duration: DURATION.quick, ease: EASE });
    else x.set(0);
  }

  function confirm() {
    if (onConfirm() !== false) setConfirmed(true);
    goBack();
  }

  function start(event: PointerEvent<HTMLButtonElement>) {
    if (done || event.button !== 0 || !track.current) return;
    const travel = track.current.clientWidth - event.currentTarget.offsetWidth - 8;
    if (travel <= 0) return;
    pointer.current = { id: event.pointerId, start: event.clientX, travel };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const grip = pointer.current;
    if (!grip || grip.id !== event.pointerId) return;
    x.set(Math.min(grip.travel, Math.max(0, event.clientX - grip.start)));
  }

  function finish(event: PointerEvent<HTMLButtonElement>, cancelled: boolean) {
    const grip = pointer.current;
    if (!grip || grip.id !== event.pointerId) return;
    pointer.current = null;
    if (!cancelled && x.get() >= grip.travel * 0.8) confirm();
    else goBack();
  }

  return (
    <div ref={track} data-slide-commit="" className="relative flex min-h-14 w-full max-w-80 items-center justify-center rounded-full border border-primary/40 bg-mist pl-14 pr-3 text-center text-sm font-semibold text-ink">
      <span aria-live="polite">{done ? doneLabel : label}</span>
      <motion.button
        type="button"
        aria-label={label}
        disabled={done}
        className="absolute left-1 top-1 grid size-11 touch-none select-none place-items-center rounded-full bg-ink text-white"
        style={{ x }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={event => finish(event, false)}
        onPointerCancel={event => finish(event, true)}
        onLostPointerCapture={event => finish(event, true)}
        onClick={event => { if (event.detail === 0) confirm(); }}
      >
        {done ? <Check size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
