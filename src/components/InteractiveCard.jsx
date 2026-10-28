import { useRef, useCallback, useEffect } from "react";
import useMouseInteraction from "../hooks/useMouseInteraction.js";
import usePressHold from "../hooks/usePressHold.js";
import "../components/BorderGlow.css";

function getCenterOfElement(el) {
  const { width, height } = el.getBoundingClientRect();
  return [width / 2, height / 2];
}

function getEdgeProximity(el, x, y) {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return Math.min(Math.max((1 / Math.min(kx, ky)) * 100, 0), 100);
}

function getCursorAngle(el, x, y) {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}

export default function InteractiveCard({
  children,
  className = "",
  style,
  intensity = 8,
  scaleOnHover = 1.02,
  glowColor = "#00C7CA",
  onHoldComplete,
  onClick,
  as: Component = "div",
  variant = "3d",
  edgeSensitivity = 30,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  colors,
  fillOpacity = 0.5,
  disabled = false,
  ...rest
}) {
  const internalRef = useRef(null);
  const { ref, style: mouseStyle, handlers, isHovering, tiltX, tiltY, mousePos } =
    useMouseInteraction({ intensity, scaleOnHover, glowColor, disabled });

  const { progress, isHolding, handlers: pressHandlers } = usePressHold({
    duration: 600,
    onHoldComplete,
  });

  const mergedRef = (node) => {
    internalRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const handleClick = (event) => {
    onClick?.(event);
  };

  const isBorderGlow = variant === "border-glow";

  if (isBorderGlow && (!colors || colors.length === 0)) {
    colors = ["#00C7CA", "#00A3A6", "#7FDBDA", "#00C7CA", "#5CD6D8", "#00C7CA", "#4FD1D3"];
  }

  const handlePointerMove = useCallback(
    (event) => {
      const el = internalRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const edge = getEdgeProximity(el, x, y);
      const angle = getCursorAngle(el, x, y);
      el.style.setProperty("--edge-proximity", edge.toFixed(3));
      el.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    },
    [internalRef]
  );

  useEffect(() => {
    const el = internalRef.current;
    if (!el || !isBorderGlow) return;
    el.addEventListener("pointermove", handlePointerMove);
    return () => el.removeEventListener("pointermove", handlePointerMove);
  }, [isBorderGlow, handlePointerMove]);

  const glowVars = {};
  if (glowColor.startsWith("#")) {
    const hex = glowColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    glowVars["--glow-color"] = `${r} ${g} ${b}`;
  }

  const gradientVars = {};
  if (colors && colors.length > 0) {
    const positions = [
      "80% 55%",
      "69% 34%",
      "8% 6%",
      "41% 38%",
      "86% 85%",
      "82% 18%",
      "51% 4%",
    ];
    const keys = [
      "--gradient-one",
      "--gradient-two",
      "--gradient-three",
      "--gradient-four",
      "--gradient-five",
      "--gradient-six",
      "--gradient-seven",
    ];
    const map = [0, 1, 2, 0, 1, 2, 1];
    for (let i = 0; i < 7; i++) {
      const c = colors[Math.min(map[i], colors.length - 1)];
      gradientVars[keys[i]] = `radial-gradient(at ${positions[i]}, ${c} 0px, transparent 50%)`;
    }
    gradientVars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  }

  const computedStyle = {
    ...mouseStyle,
    ...style,
    "--tilt-x": `${tiltX}deg`,
    "--tilt-y": `${tiltY}deg`,
    "--hold-progress": String(progress),
    "--is-hovering": String(isHovering),
    "--mouse-x": String(mousePos.x),
    "--mouse-y": String(mousePos.y),
    ...(isBorderGlow
      ? {
          "--card-bg": "#0A192F",
          "--edge-sensitivity": edgeSensitivity,
          "--color-sensitivity": edgeSensitivity + 20,
          "--border-radius": "28px",
          "--glow-padding": `${glowRadius}px`,
          "--cone-spread": coneSpread,
          "--fill-opacity": fillOpacity,
          ...glowVars,
          ...gradientVars,
        }
      : {
          "--glow-color": glowColor,
        }),
  };

  return (
    <Component
      ref={mergedRef}
      className={`${isBorderGlow ? "border-glow-card" : "interactive-card"} ${isHovering ? "is-hovering" : ""} ${isHolding ? "is-holding" : ""} ${className}`.trim()}
      style={computedStyle}
      {...handlers}
      {...pressHandlers}
      onClick={handleClick}
      {...rest}
    >
      {isBorderGlow && <span className="edge-light" aria-hidden="true" />}
      <div className={isBorderGlow ? "border-glow-inner" : ""}>
        {children}
      </div>
    </Component>
  );
}
