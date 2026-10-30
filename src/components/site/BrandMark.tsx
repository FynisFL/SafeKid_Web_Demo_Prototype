import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/safekid/logo.webp";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
  onSecretUnlock?: () => void;
};

export function BrandMark({
  className,
  tone = "dark",
  compact = false,
  onSecretUnlock,
}: BrandMarkProps) {
  const holdTimer = useRef<number | null>(null);
  const unlockedByHold = useRef(false);
  const [isHolding, setIsHolding] = useState(false);

  const clearHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsHolding(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!onSecretUnlock || (event.pointerType === "mouse" && event.button !== 0)) return;
    unlockedByHold.current = false;
    setIsHolding(true);
    holdTimer.current = window.setTimeout(() => {
      unlockedByHold.current = true;
      onSecretUnlock();
    }, 3000);
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (unlockedByHold.current) {
      event.preventDefault();
      event.stopPropagation();
      unlockedByHold.current = false;
    }
  };

  return (
    <Link
      to="/"
      aria-label="SafeKid home"
      className={cn("group inline-flex items-center gap-2.5", className)}
      onPointerDown={handlePointerDown}
      onPointerUp={clearHold}
      onPointerLeave={clearHold}
      onPointerCancel={() => {
        clearHold();
        unlockedByHold.current = false;
      }}
      onClick={handleClick}
      onContextMenu={(event) => {
        if (unlockedByHold.current) event.preventDefault();
      }}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-white ring-1 ring-ink/10 transition-transform duration-500 ease-smooth group-hover:scale-105">
        <img src={logo} alt="" className="h-full w-full object-cover" width={36} height={36} />
        {onSecretUnlock && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -inset-1 rounded-[14px] border border-primary/80 transition-opacity duration-300",
              isHolding ? "opacity-100" : "opacity-0",
            )}
          />
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
