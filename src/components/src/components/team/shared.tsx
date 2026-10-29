import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";

export function RoleLabel({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-deep/80">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </p>
  );
}

/** "Duy" from "Nguyễn Trường Duy": the given name, derived from the confirmed full name. */
export function givenName(name: string) {
  return name.split(" ").pop() ?? name;
}

/** The line that finally hands the reader to the Our Journey section. */
export function JourneyPill({ className }: { className?: string }) {
  return (
    <Magnetic className={className}>
      <Link
        to="#our-journey"
        className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-primary/40 bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink shadow-pill transition-colors hover:border-primary btn-motion"
      >
        Our journey
        <ArrowDown
          className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    </Magnetic>
  );
}
