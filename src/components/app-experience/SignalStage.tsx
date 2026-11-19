import { useEnhancedMotion } from "@/components/motion/useEnhancedMotion";
import { BellRing, Check, RotateCcw, ShieldCheck, Signal, Zap } from "lucide-react";
import { motion, useAnimate } from "motion/react";
import { Fragment, useEffect } from "react";
import type { CSSProperties, PointerEvent } from "react";

import watch from "@/assets/safekid/editions/rat.webp";
import { DURATION, EASE } from "@/components/motion/tokens";

import { signalArrival, signalStart, travelDuration, type Scene } from "./scenes";
import { useClickSpark } from "./useClickSpark";
import "./signal-stage.css";

const stageSize = { width: 720, height: 480 };
const emitter = { x: 294, y: 220 };
const receiver = { x: 438, y: 220 };
const trigger = { x: 360, y: 307 };
const signalPath = `M ${emitter.x} ${emitter.y} C 326 220 318 188 354 188 S 382 244 409 239 S 425 220 ${receiver.x} ${receiver.y}`;

const impactParticles = Array.from({ length: 8 }, (_, index) => {
  const angle = index * (Math.PI / 4);
  const distance = [13, 22, 19][index % 3];
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, delay: (index % 3) * 0.04 };
});

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

function Shockwave({ point, delay, radius, color }: {
  point: typeof emitter;
  delay: number;
  radius: number;
  color: string;
}) {
  return (
    <motion.circle cx={point.x} cy={point.y} r={radius} stroke={color}
      strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: [0, 0.8, 0], scale: 1 }}
      transition={{ duration: 0.76, delay, ease: "easeOut", times: [0, 0.18, 1] }} />
  );
}

function SignalBurst({ scene, delay }: { scene: Scene; delay: number }) {
  const arrival = delay + travelDuration;
  const packetCount = scene.id === "habits" ? 4 : 3;
  const impactRadius = scene.id === "sos" ? 22 : 18;

  return (
    <g className="sk-stage__burst">
      <Shockwave point={emitter} delay={delay} radius={16} color={scene.accent} />
      <motion.path d={signalPath} stroke={scene.accent} strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.85, 0.85, 0] }}
        transition={{ duration: travelDuration + 0.4, delay, ease: "easeOut" }} />
      {Array.from({ length: packetCount }, (_, index) => {
        const start = delay + index * 0.11;
        return (
          <g key={index}>
            <animateMotion path={signalPath} dur={`${travelDuration}s`} begin="indefinite"
              ref={(animation) => { (animation as SVGAnimationElement | null)?.beginElementAt(start); }} />
            <motion.circle r={index === 0 ? 5.5 : 2.75} fill={index === 0 ? "white" : scene.accent}
              stroke={scene.accent} strokeWidth={index === 0 ? 2 : 0}
              className={index === 0 ? "sk-stage__pulse" : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: travelDuration, delay: start, times: [0, 0.1, 0.86, 1] }} />
          </g>
        );
      })}
      {[0, 1].map((index) => (
        <Shockwave key={index} point={receiver} delay={arrival + index * 0.11}
          radius={impactRadius - index * 7} color={scene.accent} />
      ))}
      {impactParticles.map(({ x, y, delay: stagger }, index) => (
        <motion.circle key={index} cx={receiver.x} cy={receiver.y}
          r={index % 3 === 0 ? 4 : 2} fill={scene.accent}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], x, y, scale: 1 }}
          transition={{ duration: 0.66, delay: arrival + stagger, ease: EASE, times: [0, 0.2, 1] }} />
      ))}
    </g>
  );
}

export function SignalStage({
  scene, replay, reduce, onReplay, onStep, loading = "eager",
}: {
  scene: Scene;
  replay: number;
  reduce: boolean;
  onReplay: () => void;
  onStep: (direction: 1 | -1) => void;
  loading?: "eager" | "lazy";
}) {
  const intro = replay === 0;
  const signalDelay = signalStart(intro);
  const arrival = signalArrival(intro);
  const [rig, animateRig] = useAnimate<HTMLDivElement>();
  const enhanced = useEnhancedMotion();
  const { canvasRef, spark } = useClickSpark(reduce || !enhanced, scene.accent);

  useEffect(() => {
    const element = rig.current;
    if (!element) return;
    const camera = animateRig(element, {
      scale: reduce ? 1 : [intro ? 0.95 : 1, 1.025, 1.055, 1],
      x: reduce ? "0%" : ["0%", "1.2%", "-1.45%", "0%"],
    }, {
      duration: reduce ? 0 : intro ? 2.65 : 2.25,
      times: [0, 0.25, 0.63, 1],
      ease: "easeInOut",
    });

    return () => camera.stop();
  }, [animateRig, intro, reduce, replay, rig]);

  // SpotlightCard's local pointer-positioned radial gradient, adapted for touch.
  // https://github.com/DavidHDev/react-bits/blob/1eeb6f105c68b964289d85dabbe84a1d551f3797/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx
  function aimSpotlight(event: PointerEvent<HTMLDivElement>) {
    const stage = event.currentTarget;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    stage.style.setProperty("--spotlight-x", `${x * 100}%`);
    stage.style.setProperty("--spotlight-y", `${y * 100}%`);
    stage.dataset.spotlight = "active";
  }

  function resetSpotlight(event: PointerEvent<HTMLDivElement>) {
    delete event.currentTarget.dataset.spotlight;
  }

  return (
    <figure className="sk-stage" style={{ "--scene-color": scene.accent } as CSSProperties} aria-label="SafeKid connection demo">
      <div className="sk-stage__top">
        <span><i /> Interactive demo</span>
        <button type="button" className="sk-app__tap sk-stage__replay" onClick={onReplay} aria-label="Replay demo" title="Replay demo">
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <motion.div className="sk-stage__viewport" data-scene={scene.id}
        style={{ touchAction: "pan-y pinch-zoom" }}
        onPanEnd={(event, { offset }) => {
          if ((event.target as Element | null)?.closest?.("button")) return;
          if (Math.abs(offset.x) > 56 && Math.abs(offset.x) > Math.abs(offset.y) * 1.5) onStep(offset.x < 0 ? 1 : -1);
        }}
        onPointerMove={(event) => { if (!reduce && event.pointerType === "mouse") aimSpotlight(event); }}
        onPointerDown={(event) => { if (!reduce && event.isPrimary) aimSpotlight(event); }}
        onPointerUp={(event) => { if (event.pointerType !== "mouse") resetSpotlight(event); }}
        onPointerLeave={resetSpotlight}
        onPointerCancel={resetSpotlight}
        onClick={spark}>
        <div className="sk-stage__art">
          <div ref={rig} className="sk-stage__rig">
            <Fragment key={replay}>
              <div className="sk-stage__devices">
                <div className="sk-stage__watch">
                  <motion.img src={watch} width={620} height={620} loading={loading}
                    fetchPriority={loading === "eager" ? "high" : undefined} alt="" draggable={false}
                    initial={reduce ? false : intro
                      ? { opacity: 0, x: "-12%", y: "8%", scale: 0.85, rotate: -6 }
                      : { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0 }}
                    animate={reduce ? undefined : intro
                      ? { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0 }
                      : { scale: [1, 1.08, 1], rotate: [0, -4, 0] }}
                    transition={{ duration: intro ? DURATION.slow : DURATION.base, ease: EASE }} />
                </div>
                <div className="sk-stage__phone">
                  <motion.div className="sk-stage__phone-shell"
                    initial={reduce ? false : intro
                      ? { opacity: 0, x: "14%", y: "8%", scale: 0.9 }
                      : { opacity: 1, x: "0%", y: "0%", scale: 1 }}
                    animate={reduce ? undefined : intro
                      ? { opacity: 1, x: "0%", y: "0%", scale: 1 }
                      : { scale: [1, 1.045, 1], y: [0, -3, 0] }}
                    transition={{ duration: intro ? DURATION.slow : DURATION.base, delay: intro ? 0.16 : arrival - 0.18, ease: EASE }}>
                    <DemoScreen scene={scene} arrival={arrival} reduce={reduce} />
                  </motion.div>
                </div>
              </div>
              <svg className="sk-stage__signal" viewBox={`0 0 ${stageSize.width} ${stageSize.height}`} aria-hidden="true" preserveAspectRatio="none" fill="none">
                <path d={signalPath} stroke={scene.accent} strokeOpacity=".58" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
                <path d={`M${stageSize.width * .12} ${stageSize.height * .76}Q${stageSize.width * .5} ${stageSize.height * .53} ${stageSize.width * .88} ${stageSize.height * .73}`}
                  fill="none" stroke={scene.accent} strokeOpacity=".26" strokeDasharray="3 9" />
                {!reduce && enhanced && [0, 1].map(index => (
                  <motion.circle key={index} cx={receiver.x} cy={receiver.y} fill="none" stroke={scene.accent} strokeWidth="1.5"
                    initial={{ r: 8, opacity: 0 }} animate={{ r: [8, 15, 44], opacity: [0, .7, 0] }}
                    transition={{ duration: DURATION.base, delay: arrival + index * DURATION.feedback, ease: EASE }} />
                ))}
                <circle cx={emitter.x} cy={emitter.y} r="3" fill={scene.accent} />
                <circle cx={receiver.x} cy={receiver.y} r="5" fill="white" stroke={scene.accent} strokeWidth="2" />
                {!reduce && <SignalBurst scene={scene} delay={signalDelay} />}
              </svg>
              {!reduce && (
                <motion.div className="sk-stage__sweep" aria-hidden="true"
                  initial={{ x: "-78%", opacity: 0 }}
                  animate={{ x: "78%", opacity: [0, 0.46, 0] }}
                  transition={{ duration: 1.66, delay: signalDelay + 0.04, ease: "easeInOut" }} />
              )}
            </Fragment>
            <motion.button className="sk-app__tap sk-stage__trigger" type="button" onClick={onReplay}
              aria-label="Send signal from the watch" title="Send signal from the watch"
              style={{ left: `${(trigger.x / stageSize.width) * 100}%`, top: `${(trigger.y / stageSize.height) * 100}%` }}
              whileHover={reduce ? undefined : { scale: 1.12 }} whileTap={reduce ? undefined : { scale: 0.87 }}>
              <Zap size={18} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
        {!reduce && enhanced && <canvas ref={canvasRef} className="sk-stage__sparks" aria-hidden="true" />}
      </motion.div>
      <figcaption className="sk-stage__caption">
        <span aria-hidden="true">SafeKid Watch</span>
        <span aria-hidden="true">Parent App</span>
        <span className="sr-only">{scene.title}. {scene.description}</span>
      </figcaption>
    </figure>
  );
}
