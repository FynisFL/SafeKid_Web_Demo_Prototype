import { useCallback, useEffect, useRef, useState, type PointerEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import logo from "@/assets/safekid/logo.webp";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
  onSecretUnlock?: () => void;
};

const HOLD_MS = 3000;
/** A touch that drifts further than this is a scroll or a swipe, not a hold. */
const TOUCH_SLOP = 12;
const RING_RADIUS = 21;

export function BrandMark({
  className,
  tone = "dark",
  compact = false,
  onSecretUnlock,
}: BrandMarkProps) {
  const reduce = useReducedMotion();
  const holdTimer = useRef<number | null>(null);
  const doneTimer = useRef<number | null>(null);
  const unlockedByHold = useRef(false);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const clearHold = useCallback(() => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    touchOrigin.current = null;
    setIsHolding(false);
  }, []);

  // Never leave a pending unlock behind if the logo unmounts mid-hold.
  const clearTimers = useCallback(() => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
    if (doneTimer.current !== null) window.clearTimeout(doneTimer.current);
    holdTimer.current = null;
    doneTimer.current = null;
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const startHold = useCallback(() => {
    if (!onSecretUnlock) return;
    clearHold();
    unlockedByHold.current = false;
    setIsHolding(true);
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      unlockedByHold.current = true;
      setIsHolding(false);
      setJustUnlocked(true);
      if (doneTimer.current !== null) window.clearTimeout(doneTimer.current);
      doneTimer.current = window.setTimeout(() => {
        doneTimer.current = null;
        setJustUnlocked(false);
      }, 700);
      onSecretUnlock();
    }, HOLD_MS);
  }, [clearHold, onSecretUnlock]);

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    // Desktop: hovering the logo for three seconds.
    if (event.pointerType !== "mouse") return;
    startHold();
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    // Touch and pen: a deliberate three-second press and hold.
    if (!onSecretUnlock || event.pointerType === "mouse") return;
    startHold();
    touchOrigin.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const origin = touchOrigin.current;
    if (!origin || event.pointerType === "mouse") return;
    if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > TOUCH_SLOP) clearHold();
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // After a successful unlock the same gesture must not also navigate home.
    if (unlockedByHold.current) {
      event.preventDefault();
      event.stopPropagation();
      unlockedByHold.current = false;
    }
  };

  const ringVisible = Boolean(onSecretUnlock) && (isHolding || justUnlocked);
  const circumference = 2 * Math.PI * RING_RADIUS;

  return (
    <Link
      to="/"
      aria-label="SafeKid home"
      className={cn("group inline-flex select-none items-center gap-2.5", className)}
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", touchAction: "manipulation" }}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") clearHold();
      }}
      onPointerLeave={clearHold}
      onPointerCancel={() => {
        clearHold();
        unlockedByHold.current = false;
      }}
      onBlur={clearHold}
      onClick={handleClick}
      onContextMenu={(event) => {
        // Mobile browsers otherwise open the native link/image menu before
        // the three-second hold can complete.
        if (onSecretUnlock) event.preventDefault();
      }}
      onDragStart={(event) => {
        if (onSecretUnlock) event.preventDefault();
      }}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span
          className={cn(
            "relative flex h-full w-full items-center justify-center overflow-hidden rounded-[11px] bg-white ring-1 ring-ink/10 transition-[transform,box-shadow] duration-500 ease-smooth group-hover:scale-105",
            justUnlocked && "shadow-[0_0_0_4px_hsl(var(--primary)/0.18),0_0_22px_hsl(var(--primary)/0.55)]"
          )}
        >
          <img
            src={logo}
            alt=""
            className="h-full w-full select-none object-cover"
            width={36}
            height={36}
            draggable={false}
          />
        </span>
        {onSecretUnlock && (
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className={cn(
              "pointer-events-none absolute -inset-[6px] h-[48px] w-[48px] -rotate-90 transition-opacity duration-300",
              ringVisible ? "opacity-100" : "opacity-0"
            )}
            fill="none"
          >
            <circle cx="24" cy="24" r={RING_RADIUS} stroke="hsl(var(--primary))" strokeOpacity="0.18" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r={RING_RADIUS}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={false}
              animate={{
                strokeDashoffset: isHolding || justUnlocked ? 0 : circumference,
              }}
              transition={
                isHolding
                  ? { duration: HOLD_MS / 1000, ease: "linear" }
                  : { duration: reduce ? 0 : 0.12, ease: "easeOut" }
              }
            />
            {justUnlocked && !reduce && (
              <motion.circle
                cx="24"
                cy="24"
                r={RING_RADIUS}
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "24px 24px" }}
              />
            )}
          </svg>
        )}
      </span>
      <span
        className={cn(
          "font-display text-[21px] font-semibold tracking-[-0.045em] leading-none",
          tone === "dark" ? "text-ink" : "text-white"
        )}
      >
        SafeKid
        {!compact && (
          <span className="ml-1 align-super text-[9px] font-medium tracking-[0.18em] text-primary">
            CONCEPT
          </span>
        )}
      </span>
    </Link>
  );
}
