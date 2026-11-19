// Adapted from React Bits Animated Content (TS-TW).
// https://reactbits.dev/r/AnimatedContent-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
import { useRef, type ComponentPropsWithoutRef } from "react";
import { SET_PIECES } from "../setPieces";
import { DISTANCE, DURATION } from "../tokens";
import { useSceneEntrance } from "./useSceneEntrance";

type Props = ComponentPropsWithoutRef<"div"> & {
  as?: "main" | "div";
  trigger?: "enter" | "mount";
  distance?: number;
  direction?: "vertical" | "horizontal";
  initialOpacity?: number;
  duration?: number;
};

export function AnimatedContent({
  as: Element = "div", trigger = "enter", distance = DISTANCE.sm, direction = "vertical",
  initialOpacity = 0.82, duration = DURATION.base, ...props
}: Props) {
  const element = useRef<HTMLDivElement>(null);
  useSceneEntrance(element, {
    enabled: SET_PIECES.animatedContent, trigger, duration, opacity: initialOpacity,
    x: direction === "horizontal" ? distance : 0, y: direction === "vertical" ? distance : 0,
  });
  return <Element ref={element} data-animated-content="" {...props} />;
}
