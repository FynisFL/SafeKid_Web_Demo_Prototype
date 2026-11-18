import { BellRing, Check, RotateCcw, ShieldCheck, Signal, Zap } from "lucide-react";
import { motion, useAnimate, useMotionValue, useSpring } from "motion/react";
import { Fragment, useEffect } from "react";
import type { CSSProperties, PointerEvent } from "react";

import watch from "@/assets/safekid/hero-watch.webp";
import { EASE } from "@/components/motion/tokens";

import type { Scene } from "./scenes";
import { useClickSpark } from "./useClickSpark";

const stageSize = { width: 720, height: 480 };
const emitter = { x: 337, y: 237 };
const receiver = { x: 497, y: 259 };
const signalPath = `M ${emitter.x} ${emitter.y} C 383 237 365 324 415 324 S 457 259 ${receiver.x} ${receiver.y}`;
const travelDuration = 0.94;
const impactParticles = Array.from({ length: 12 }, (_, index) => {
  const angle = index * (Math.PI / 6);
  const distance = [82, 56, 106][index % 3];
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
  const impactRadius = scene.id === "sos" ? 116 : 90;

  return (
    <g className="sk-stage__burst">
      <Shockwave point={emitter} delay={delay} radius={54} color={scene.accent} />
      <motion.path d={signalPath} stroke={scene.accent} strokeWidth="7" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.85, 0.85, 0] }}
        transition={{ duration: travelDuration + 0.4, delay, ease: "easeOut" }} />
      {Array.from({ length: packetCount }, (_, index) => {
        const start = delay + index * 0.11;
        return (
          <g key={index}>
            <animateMotion path={signalPath} dur={`${travelDuration}s`} begin="indefinite"
              ref={(animation) => { (animation as SVGAnimationElement | null)?.beginElementAt(start); }} />
            <motion.circle r={index === 0 ? 7 : 3.25} fill={index === 0 ? "white" : scene.accent}
              stroke={scene.accent} strokeWidth={index === 0 ? 2.5 : 0}
              className={index === 0 ? "sk-stage__pulse" : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: travelDuration, delay: start, times: [0, 0.1, 0.86, 1] }} />
          </g>
        );
      })}
      {[0, 1, 2].map((index) => (
        <Shockwave key={index} point={receiver} delay={arrival + index * 0.11}
          radius={impactRadius - index * 14} color={scene.accent} />
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
  scene, replay, reduce, onReplay,
}: {
  scene: Scene;
  replay: number;
  reduce: boolean;
  onReplay: () => void;
}) {
  const intro = replay === 0;
  const signalDelay = intro ? 0.72 : 0.18;
  const arrival = signalDelay + travelDuration;
  const [rig, animateRig] = useAnimate<HTMLDivElement>();
  const { canvasRef, spark } = useClickSpark(reduce, scene.accent);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 135, damping: 19 });
  const rotateY = useSpring(pointerX, { stiffness: 135, damping: 19 });

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
    if (event.pointerType === "mouse") {
      pointerX.set((x - 0.5) * 18);
      pointerY.set((y - 0.5) * -12);
    }
  }

  function resetPointer(event: PointerEvent<HTMLDivElement>) {
    delete event.currentTarget.dataset.spotlight;
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <figure className="sk-stage" style={{ "--scene-color": scene.accent } as CSSProperties} aria-label="SafeKid connection demo">
      <div className="sk-stage__top">
        <span><i /> Interactive demo</span>
        <button type="button" className="sk-app__tap sk-stage__replay" onClick={onReplay} aria-label="Replay demo" title="Replay demo">
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="sk-stage__viewport" data-scene={scene.id}
        onPointerMove={(event) => { if (!reduce && event.pointerType === "mouse") aimSpotlight(event); }}
        onPointerDown={(event) => { if (!reduce && event.isPrimary) aimSpotlight(event); }}
        onPointerUp={(event) => { if (event.pointerType !== "mouse") resetPointer(event); }}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
        onClick={spark}>
        <motion.div className="sk-stage__art" style={reduce ? undefined : { rotateX, rotateY }}>
          <div ref={rig} className="sk-stage__rig">
            <Fragment key={replay}>
              <motion.div className="sk-stage__halo" aria-hidden="true"
                initial={reduce ? false : { opacity: 0.45, scale: 0.62, rotate: -36 }}
                animate={{ opacity: 1, scale: 1, rotate: -14 }}
                transition={{ duration: reduce ? 0 : 1.05, ease: EASE }} />
              <div className="sk-stage__devices" aria-hidden="true">
                <div className="sk-stage__watch">
                  <motion.img src={watch} width={620} height={620} fetchPriority="high" alt="" draggable={false}
                    initial={reduce ? false : intro
                      ? { opacity: 0, x: "-38%", y: "27%", scale: 0.48, rotate: -33, rotateY: -48 }
                      : { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }}
                    animate={reduce ? undefined : intro
                      ? { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }
                      : { scale: [1, 1.15, 1], rotate: [0, -11, 4, 0], rotateY: [0, -13, 0] }}
                    transition={{ duration: intro ? 1.44 : 0.76, ease: EASE }} />
                </div>
                <div className="sk-stage__phone">
                  <motion.div className="sk-stage__phone-shell"
                    initial={reduce ? false : intro
                      ? { opacity: 0, x: "49%", y: "19%", scale: 0.55, rotate: 38, rotateY: 67 }
                      : { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }}
                    animate={reduce ? undefined : intro
                      ? { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }
                      : { scale: [1, 1.16, 1], rotate: [0, 10, -4, 0], rotateY: [0, 19, 0] }}
                    transition={{ duration: intro ? 1.48 : 0.9, delay: intro ? 0.16 : arrival - 0.18, ease: EASE }}>
                    <DemoScreen scene={scene} arrival={arrival} reduce={reduce} />
                  </motion.div>
                </div>
              </div>
              <svg className="sk-stage__signal" viewBox={`0 0 ${stageSize.width} ${stageSize.height}`} aria-hidden="true" preserveAspectRatio="none" fill="none">
                <circle cx={receiver.x} cy={receiver.y} r="5" stroke={scene.accent} />
                <path d={signalPath} stroke={scene.accent} strokeOpacity=".48" strokeWidth="1.5" strokeDasharray="3 7" />
                {!reduce && <SignalBurst scene={scene} delay={signalDelay} />}
              </svg>
              {!reduce && (
                <motion.div className="sk-stage__sweep" aria-hidden="true"
                  initial={{ x: "-78%", opacity: 0 }}
                  animate={{ x: "78%", opacity: [0, 0.68, 0] }}
                  transition={{ duration: 1.66, delay: signalDelay + 0.04, ease: "easeInOut" }} />
              )}
            </Fragment>
            <motion.button className="sk-app__tap sk-stage__trigger" type="button" onClick={onReplay}
              aria-label="Send signal from the watch" title="Send signal from the watch"
              style={{ left: `${(emitter.x / stageSize.width) * 100}%`, top: `${(emitter.y / stageSize.height) * 100}%` }}
              whileHover={reduce ? undefined : { scale: 1.12 }} whileTap={reduce ? undefined : { scale: 0.87 }}>
              <Zap size={18} aria-hidden="true" />
            </motion.button>
          </div>
        </motion.div>
        {!reduce && <canvas ref={canvasRef} className="sk-stage__sparks" aria-hidden="true" />}
      </div>
      <figcaption className="sk-stage__caption">
        <span aria-hidden="true">SafeKid Watch</span>
        <span aria-hidden="true">Parent App</span>
        <span className="sr-only">{scene.title}. {scene.description}</span>
      </figcaption>
    </figure>
  );
}
