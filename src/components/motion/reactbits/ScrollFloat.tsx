// Adapted from React Bits Scroll Float (TS-TW).
// https://reactbits.dev/r/ScrollFloat-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
import { useRef, type ReactNode } from "react";
import { SET_PIECES } from "../setPieces";
import { DISTANCE, DURATION } from "../tokens";
import { useSceneEntrance } from "./useSceneEntrance";

export function ScrollFloat({ children, className }: { children: ReactNode; className?: string }) {
  const node = useRef<HTMLSpanElement>(null);
  useSceneEntrance(node, { enabled: SET_PIECES.scrollText, trigger: "enter",
    y: DISTANCE.md, scale: 0.97, opacity: 0.74, duration: DURATION.base });
  return <span ref={node} className={className} data-scroll-float="" style={{ display: "inline-block" }}>{children}</span>;
}
