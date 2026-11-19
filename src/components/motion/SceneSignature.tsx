import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SET_PIECES } from "./setPieces";
import { DURATION, EASE } from "./tokens";
import { useEnhancedMotion } from "./useEnhancedMotion";

const lines = {
  zodiac: "M6 42C6 12 90 9 90 40S6 71 6 42M26 43C26 25 70 24 70 40S26 61 26 43",
  product: "M6 48L48 16L90 48L48 70ZM14 46L48 27L81 46",
  passport: "M10 26L48 7L86 26L48 45ZM10 42L48 61L86 42M10 57L48 76L86 57",
  app: "M7 53H29L41 32L53 63L64 14L76 53H91",
  about: "M6 66C26 60 27 35 47 35C67 35 70 11 91 8M6 74C31 74 35 52 52 51C71 49 83 27 91 23",
  support: "M12 20H85V57H43L28 71V57H12ZM28 33H65M28 44H56",
  contact: "M10 20H86V65H10ZM10 20L48 45L86 20M48 45L65 34",
  chat: "M7 15H68V46H33L20 58V46H7ZM30 64H69L83 75V64H90V33H78",
  sos: "M48 10L81 23V42C81 60 63 72 48 77C33 72 15 60 15 42V23ZM48 26V51M48 61V63",
  bag: "M15 27H81L74 72H22ZM34 35V20C34 8 62 8 62 20V35M37 50L45 58L61 44",
  missing: "M8 45H22L38 29L48 43L59 21L72 45H89M62 60L81 60L89 55",
};

export type SceneName = keyof typeof lines;

export function SceneSignature({ scene, className = "" }: { scene: SceneName; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref, { once: true });
  const enhanced = useEnhancedMotion() && SET_PIECES.pageSignatures;
  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 96 82"
      fill="none"
      aria-hidden="true"
      data-scene-signature={scene}
      className={`sk-scene-signature pointer-events-none ${className}`}
      initial={false}
      animate={enhanced && visible ? { y: [6, -3, 0], opacity: [0.46, 1, 0.68] } : { y: 0, opacity: 0.68 }}
      transition={{ duration: enhanced ? DURATION.slow : 0, ease: EASE }}
    >
      <path d={lines[scene]} stroke="currentColor" strokeWidth="5" opacity=".16" strokeLinecap="round" strokeLinejoin="round" />
      <motion.path d={lines[scene]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={false}
        animate={enhanced && visible ? { pathLength: [0.12, 1] } : { pathLength: 1 }}
        transition={{ duration: enhanced ? DURATION.base : 0, ease: EASE }} />
    </motion.svg>
  );
}
