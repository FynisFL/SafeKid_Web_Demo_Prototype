import { useState, useEffect, useRef, useCallback } from "react";

export default function usePressHold({
  duration = 600,
  onHoldComplete,
  disabled = false,
} = {}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: true }
  );

  const clearTimers = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    rafRef.current = null;
    timerRef.current = null;
    setProgress(0);
    setIsHolding(false);
  }, []);

  const startHold = useCallback(() => {
    if (disabled || reducedMotion.current.matches) return;
    clearTimers();
    setIsHolding(true);
    startTimeRef.current = Date.now();

    const tick = () => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const nextProgress = Math.min(elapsed / duration, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        onHoldComplete?.();
        clearTimers();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [clearTimers, duration, disabled, onHoldComplete]);

  const endHold = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handlers = {
    onMouseDown: startHold,
    onMouseUp: endHold,
    onMouseLeave: endHold,
    onTouchStart: startHold,
    onTouchEnd: endHold,
    onTouchCancel: endHold,
  };

  if (reducedMotion.current.matches || disabled) {
    return {
      progress: 0,
      isHolding: false,
      handlers: {},
    };
  }

  return {
    progress,
    isHolding,
    handlers,
  };
}
