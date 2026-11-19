// Adapted from React Bits Scroll Reveal (TS-TW).
// https://reactbits.dev/r/ScrollReveal-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
import { useRef, type ComponentPropsWithoutRef } from "react";
import { SET_PIECES } from "../setPieces";
import { DISTANCE, DURATION } from "../tokens";
import { useSceneEntrance } from "./useSceneEntrance";

export function ScrollReveal(props: ComponentPropsWithoutRef<"p">) {
  const node = useRef<HTMLParagraphElement>(null);
  useSceneEntrance(node, { enabled: SET_PIECES.scrollText, trigger: "enter", duration: DURATION.base,
    y: DISTANCE.sm, opacity: 0.8, filter: "blur(2px)" });
  return <p ref={node} data-scroll-reveal="" {...props} />;
}
