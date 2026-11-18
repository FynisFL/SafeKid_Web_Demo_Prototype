import { BellRing, Check, RotateCcw, ShieldCheck, Signal } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { CSSProperties, PointerEvent } from "react";

import watch from "@/assets/safekid/hero-watch.webp";
import { EASE } from "@/components/motion/tokens";

import type { Scene } from "./scenes";

const signalPath = "M 262 266 C 329 266 308 355 386 355 S 421 259 497 259";

function DemoScreen({ scene, replay, reduce }: { scene: Scene; replay: number; reduce: boolean }) {
  const Icon = scene.icon;

  return (
    <div className="sk-stage__phone-screen">
      <div className="sk-stage__phone-top"><ShieldCheck /> SafeKid <Signal /></div>
      <div className="sk-stage__phone-label">{scene.label}</div>
      <motion.div
        key={replay}
        className="sk-stage__phone-visual"
        initial={reduce ? false : { opacity: 0.45, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : (replay === 0 ? 0.62 : 0.36), ease: EASE }}
      >
        {scene.id === "zone" ? (
          <svg viewBox="0 0 144 110" className="sk-stage__map">
            <path d="M-5 33L24 26 44 49 69 38 96 12 153 4M-8 92L16 80 45 88 72 67 118 57 151 80M39-4L56 26 44 49 45 88 57 113M115-2L96 12 97 33 118 57 103 87 110 113M-7 56L22 62 44 49 72 67 103 87 147 96" />
            <motion.circle cx="78" cy="53" r="27" className="sk-stage__zone"
              initial={reduce ? false : { scale: 0.5, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.65, ease: EASE }} />
            <circle cx="78" cy="53" r="6" fill={scene.accent} />
            <circle cx="78" cy="53" r="2.5" fill="#0b242d" />
          </svg>
        ) : scene.id === "sos" ? (
          <div className="sk-stage__alarm">
            {!reduce && (
              <motion.span initial={{ scale: 0.8, opacity: 0.85 }}
                animate={{ scale: 2.15, opacity: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} />
            )}
            <BellRing />
          </div>
        ) : (
          <div className="sk-stage__habit">
            <span><Check /> Đọc sách</span>
            <div><motion.i initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 0.65, ease: EASE }} /></div>
            <strong>+10 điểm</strong>
          </div>
        )}
      </motion.div>
      <motion.div
        key={`event-${replay}`}
        className="sk-stage__phone-event"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.34, delay: reduce ? 0 : (replay === 0 ? 0.92 : 0.64), ease: EASE }}
      >
        <Icon />
        <span>{scene.title}</span>
      </motion.div>
    </div>
  );
}

export function SignalStage({
  scene, replay, reduce, onReplay,
}: {
  scene: Scene;
  replay: number;
  reduce: boolean;
  onReplay: () => void;
}) {
  const signalDelay = replay === 0 ? 0.28 : 0;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(pointerX, { stiffness: 100, damping: 22 });

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -8);
  }

  return (
    <figure className="sk-stage" style={{ "--scene-color": scene.accent } as CSSProperties} aria-label="Mô phỏng kết nối SafeKid">
      <div className="sk-stage__top">
        <span><i /> Mô phỏng tương tác</span>
        <button type="button" className="sk-app__tap sk-stage__replay" onClick={onReplay} aria-label="Phát lại mô phỏng" title="Phát lại mô phỏng">
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="sk-stage__viewport" onPointerMove={tilt} onPointerLeave={resetTilt} aria-hidden="true">
        <motion.div className="sk-stage__art" style={reduce ? undefined : { rotateX, rotateY }}>
          <div className="sk-stage__halo" />
          <motion.div className="sk-stage__devices"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.85, ease: EASE }}>
            <div className="sk-stage__watch">
              <img src={watch} width={620} height={620} fetchPriority="high" alt="" draggable={false} />
            </div>
            <div className="sk-stage__phone">
              <DemoScreen scene={scene} replay={replay} reduce={reduce} />
            </div>
          </motion.div>
          <svg className="sk-stage__signal" viewBox="0 0 720 480" preserveAspectRatio="none" fill="none">
            <circle cx="262" cy="266" r="6" stroke={scene.accent} />
            <circle cx="262" cy="266" r="2.5" fill={scene.accent} />
            <circle cx="497" cy="259" r="5" stroke={scene.accent} />
            <path d={signalPath} stroke={scene.accent} strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="3 7" />
            {!reduce && (
              <g key={replay}>
                <motion.path
                  d={signalPath}
                  stroke={scene.accent}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 1, 0.25] }}
                  transition={{ duration: 0.88, delay: signalDelay, ease: EASE }}
                />
                <g>
                  <animateMotion path={signalPath} dur="0.7s" begin="indefinite"
                    ref={(animation) => { (animation as SVGAnimationElement | null)?.beginElementAt(signalDelay); }} />
                  <motion.circle r="4.5" fill={scene.accent} className="sk-stage__pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.7, delay: signalDelay, times: [0, 0.1, 0.85, 1] }} />
                </g>
                <motion.circle cx="497" cy="259" r="12" stroke={scene.accent}
                  style={{ transformOrigin: "497px 259px" }}
                  initial={{ opacity: 0, scale: 0.45 }}
                  animate={{ opacity: [0, 0.9, 0], scale: 2.2 }}
                  transition={{ duration: 0.7, delay: signalDelay + 0.66, ease: "easeOut" }} />
              </g>
            )}
          </svg>
          <div className="sk-stage__caption"><span>SafeKid Watch</span><span>Parent App</span></div>
        </motion.div>
      </div>
      <figcaption className="sr-only">{scene.title}. {scene.description}</figcaption>
    </figure>
  );
}
