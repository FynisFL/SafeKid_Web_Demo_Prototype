import { Link } from "react-router-dom";
import logo from "@/assets/safekid/logo.webp";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
};

export function BrandMark({ className, tone = "dark", compact = false }: BrandMarkProps) {
  return (
    <Link
      to="/"
      aria-label="SafeKid home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-white ring-1 ring-ink/10 transition-transform duration-500 ease-smooth group-hover:scale-105">
        <img src={logo} alt="" className="h-full w-full object-cover" width={36} height={36} />
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
