import { BellRing, Check, RotateCcw, ShieldCheck, Signal, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";

import watch from "@/assets/safekid/hero-watch.webp";
import { EASE } from "@/components/motion/tokens";

import type { Scene } from "./scenes";

const stageSize = { width: 720, height: 480 };
const emitter = { x: 337, y: 237 };
const receiver = { x: 497, y: 259 };
const signalPath = `M ${emitter.x} ${emitter.y} C 383 237 365 324 415 324 S 457 259 ${receiver.x} ${receiver.y}`;
const travelDuration = 0.78;

function DemoScreen({ scene, arrival, reduce }: { scene: Scene; arrival: number; reduce: boolean }) {
  const Icon = scene.icon;

  return (
    <div className="sk-stage__phone-screen">
      <div className="sk-stage__phone-top"><ShieldCheck /> SafeKid <Signal /></div>
      <div className="sk-stage__phone-label">{scene.label}</div>
      <motion.div
        className="sk-stage__phone-visual"
        initial={reduce ? false : { opacity: 0.35, scale: 0.78, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : arrival, ease: EASE }}
      >
        {scene.id === "zone" ? (
          <svg viewBox="0 0 144 110" className="sk-stage__map">
            <path d="M-5 33L24 26 44 49 69 38 96 12 153 4M-8 92L16 80 45 88 72 67 118 57 151 80M39-4L56 26 44 49 45 88 57 113M115-2L96 12 97 33 118 57 103 87 110 113M-7 56L22 62 44 49 72 67 103 87 147 96" />
            <motion.circle cx="78" cy="53" r="27" className="sk-stage__zone"
              initial={reduce ? false : { scale: 0.12 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 13, delay: reduce ? 0 : arrival }} />
            <circle cx="78" cy="53" r="6" fill={scene.accent} />
            <circle cx="78" cy="53" r="2.5" fill="white" />
          </svg>
        ) : scene.id === "sos" ? (
          <motion.div className="sk-stage__alarm"
            initial={reduce ? false : { rotate: 0, scale: 1 }}
            animate={reduce ? undefined : { rotate: [0, -23, 19, -13, 9, 0], scale: [1, 1.27, 1] }}
            transition={{ duration: 0.54, delay: arrival }}>
            <BellRing />
          </motion.div>
        ) : (
          <div className="sk-stage__habit">
            <span><Check /> Read a book</span>
            <div><motion.i initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 0.72, delay: reduce ? 0 : arrival, ease: EASE }} /></div>
            <motion.strong initial={reduce ? false : { scale: 0.7, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 11, delay: reduce ? 0 : arrival + 0.32 }}>
              +10 points
            </motion.strong>
          </div>
        )}
      </motion.div>
      <motion.div className="sk-stage__phone-event"
        initial={reduce ? false : { opacity: 0, y: 22, scale: 0.77 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 190, damping: 14, delay: reduce ? 0 : arrival + 0.12 }}>
        <Icon />
        <span>{scene.title}</span>
      </motion.div>
    </div>
  );
}

function SignalBurst({ scene, delay }: { scene: Scene; delay: number }) {
  const arrival = delay + travelDuration;

  return (
    <g>
      <motion.path d={signalPath} stroke={scene.accent} strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.75, 0.75, 0] }}
        transition={{ pathLength: { duration: travelDuration, delay, ease: "linear" },
          opacity: { duration: travelDuration + 0.25, delay, times: [0, 0.12, 0.72, 1] } }} />
      <g>
        <animateMotion path={signalPath} dur={`${travelDuration}s`} begin="indefinite"
          ref={(animation) => { (animation as SVGAnimationElement | null)?.beginElementAt(delay); }} />
        <motion.circle r="6" fill="white" stroke={scene.accent} strokeWidth="2"
          className="sk-stage__pulse" initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: travelDuration, delay, times: [0, 0.1, 0.9, 1] }} />
      </g>
      <motion.circle cx={receiver.x} cy={receiver.y} r="30" stroke={scene.accent} strokeWidth="2"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 0.65, 0], scale: 1 }}
        transition={{ duration: 0.48, delay: arrival, ease: "easeOut" }} />
    </g>
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
  const signalDelay = replay === 0 ? 0.38 : 0.08;
  const arrival = signalDelay + travelDuration;

  return (
    <figure className="sk-stage" style={{ "--scene-color": scene.accent } as CSSProperties} aria-label="SafeKid connection demo">
      <div className="sk-stage__top">
        <span><i /> Interactive demo</span>
        <button type="button" className="sk-app__tap sk-stage__replay" onClick={onReplay} aria-label="Replay demo" title="Replay demo">
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="sk-stage__viewport" data-scene={scene.id}>
        <div className="sk-stage__art">
          <div className="sk-stage__halo" aria-hidden="true" />
          <div className="sk-stage__devices" aria-hidden="true">
            <div className="sk-stage__watch">
              <img src={watch} width={620} height={620} fetchPriority="high" alt="" draggable={false} />
            </div>
            <div className="sk-stage__phone">
              <div className="sk-stage__phone-shell">
                <DemoScreen key={replay} scene={scene} arrival={arrival} reduce={reduce} />
              </div>
            </div>
          </div>
          <svg className="sk-stage__signal" viewBox={`0 0 ${stageSize.width} ${stageSize.height}`}
            aria-hidden="true" preserveAspectRatio="none" fill="none">
            <circle cx={receiver.x} cy={receiver.y} r="5" stroke={scene.accent} />
            <path d={signalPath} stroke={scene.accent} strokeOpacity=".48" strokeWidth="1.5" strokeDasharray="3 7" />
            {!reduce && <SignalBurst key={replay} scene={scene} delay={signalDelay} />}
          </svg>
          <motion.button className="sk-app__tap sk-stage__trigger" type="button" onClick={onReplay}
            aria-label="Send signal from the watch" title="Send signal from the watch"
            style={{ left: `${(emitter.x / stageSize.width) * 100}%`, top: `${(emitter.y / stageSize.height) * 100}%` }}
            whileHover={reduce ? undefined : { scale: 1.08 }} whileTap={reduce ? undefined : { scale: 0.94 }}>
            <Zap size={18} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
      <figcaption className="sk-stage__caption">
        <span aria-hidden="true">SafeKid Watch</span>
        <span aria-hidden="true">Parent App</span>
        <span className="sr-only">{scene.title}. {scene.description}</span>
      </figcaption>
    </figure>
  );
}
