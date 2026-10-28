import { useRef, useState } from "react";
import usePressHold from "../hooks/usePressHold.js";

export default function RippleButton({
  children,
  className = "",
  style,
  glowColor = "#00C7CA",
  onHoldComplete,
  onClick,
  disabled = false,
  as: Component = "button",
  ...rest
}) {
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const rippleIdRef = useRef(0);

  const { progress, isHolding, handlers } = usePressHold({
    duration: 600,
    onHoldComplete,
    disabled,
  });

  const handleClick = (event) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
    onClick?.(event);
  };

  const computedStyle = {
    ...style,
    "--glow-color": glowColor,
    "--hold-progress": String(progress),
  };

  return (
    <Component
      ref={btnRef}
      className={`ripple-button ${isHolding ? "is-holding" : ""} ${className}`}
      style={computedStyle}
      onClick={handleClick}
      {...handlers}
      {...(Component === "button" || Component === "textarea" || Component === "input" ? { disabled } : {})}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-button-ripple"
          style={{ left: r.x, top: r.y }}
          aria-hidden="true"
        />
      ))}
    </Component>
  );
}
