import { useEffect, useState } from "react";

/**
 * True only on devices with a real hover-capable, fine pointer (mouse/trackpad).
 * Touch devices skip tilt/magnetic effects so taps never feel laggy or "stuck".
 */
export function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return canHover;
}
