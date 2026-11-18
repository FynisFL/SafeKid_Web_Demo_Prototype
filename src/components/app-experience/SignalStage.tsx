import { BellRing, Check, RotateCcw, ShieldCheck, Signal, Zap } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { CSSProperties, PointerEvent } from "react";

import watch from "@/assets/safekid/hero-watch.webp";
import { EASE } from "@/components/motion/tokens";

import type { Scene } from "./scenes";

const emitter = { x: 262, y: 266 };
const receiver = { x: 497, y: 259 };
const signalPath = `M ${emitter.x} ${emitter.y} C 329 266 308 355 386 355 S 421 259 ${receiver.x} ${receiver.y}`;
const travelDuration = 0.58;
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
            <span><Check /> Đọc sách</span>
            <div><motion.i initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 0.72, delay: reduce ? 0 : arrival, ease: EASE }} /></div>
            <motion.strong initial={reduce ? false : { scale: 0.7, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 11, delay: reduce ? 0 : arrival + 0.32 }}>
              +10 điểm
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
        transition={{ duration: 0.95, delay, ease: "easeOut" }} />
      {Array.from({ length: packetCount }, (_, index) => {
        const start = delay + index * 0.085;
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
  const signalDelay = intro ? 0.52 : 0.08;
  const arrival = signalDelay + travelDuration;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 135, damping: 19 });
  const rotateY = useSpring(pointerX, { stiffness: 135, damping: 19 });

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -17);
  }

  return (
    <figure className="sk-stage" style={{ "--scene-color": scene.accent } as CSSProperties} aria-label="Mô phỏng kết nối SafeKid">
      <div className="sk-stage__top">
        <span><i /> Mô phỏng tương tác</span>
        <button type="button" className="sk-app__tap sk-stage__replay" onClick={onReplay} aria-label="Phát lại mô phỏng" title="Phát lại mô phỏng">
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="sk-stage__viewport" data-scene={scene.id} onPointerMove={tilt} onPointerLeave={resetTilt}>
        <motion.div className="sk-stage__art" aria-hidden="true" style={reduce ? undefined : { rotateX, rotateY }}>
          <motion.div key={replay} className="sk-stage__rig"
            initial={reduce ? false : { scale: intro ? 0.9 : 1, x: "0%" }}
            animate={reduce ? undefined : {
              scale: [intro ? 0.9 : 1, 1.055, 1.105, 1],
              x: ["0%", "2.6%", "-3.1%", "0%"],
            }}
            transition={{ duration: intro ? 1.68 : 1.36, times: [0, 0.24, 0.59, 1], ease: "easeInOut" }}>
            <motion.div className="sk-stage__halo"
              initial={reduce ? false : { opacity: 0.45, scale: 0.62, rotate: -36 }}
              animate={{ opacity: 1, scale: 1, rotate: -14 }}
              transition={{ duration: reduce ? 0 : 1.05, ease: EASE }} />
            <div className="sk-stage__devices">
              <div className="sk-stage__watch">
                <motion.img src={watch} width={620} height={620} fetchPriority="high" alt="" draggable={false}
                  initial={reduce ? false : intro
                    ? { opacity: 0, x: "-58%", y: "27%", scale: 0.48, rotate: -33, rotateY: -48 }
                    : { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }}
                  animate={reduce ? undefined : intro
                    ? { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }
                    : { x: ["0%", "-5%", "2%", "0%"], y: ["0%", "-6%", "0%"], scale: [1, 1.15, 1], rotate: [0, -11, 4, 0], rotateY: [0, -13, 0] }}
                  transition={{ duration: intro ? 0.92 : 0.62, ease: EASE }} />
              </div>
              <div className="sk-stage__phone">
                <motion.div className="sk-stage__phone-shell"
                  initial={reduce ? false : intro
                    ? { opacity: 0, x: "78%", y: "19%", scale: 0.55, rotate: 38, rotateY: 67 }
                    : { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }}
                  animate={reduce ? undefined : intro
                    ? { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0, rotateY: 0 }
                    : { x: ["0%", "7%", "0%"], y: ["0%", "-6%", "0%"], scale: [1, 1.16, 1], rotate: [0, 10, -4, 0], rotateY: [0, 19, 0] }}
                  transition={{ duration: intro ? 0.9 : 0.71, delay: intro ? 0.15 : arrival - 0.17, ease: EASE }}>
                  <DemoScreen scene={scene} arrival={arrival} reduce={reduce} />
                </motion.div>
              </div>
            </div>
            <svg className="sk-stage__signal" viewBox="0 0 720 480" preserveAspectRatio="none" fill="none">
              <circle cx={receiver.x} cy={receiver.y} r="5" stroke={scene.accent} />
              <path d={signalPath} stroke={scene.accent} strokeOpacity=".48" strokeWidth="1.5" strokeDasharray="3 7" />
              {!reduce && <SignalBurst scene={scene} delay={signalDelay} />}
            </svg>
            {!reduce && (
              <motion.div className="sk-stage__sweep"
                initial={{ x: "-105%", opacity: 0 }}
                animate={{ x: "105%", opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.84, delay: signalDelay + 0.02, ease: EASE }} />
            )}
          </motion.div>
          <div className="sk-stage__caption"><span>SafeKid Watch</span><span>Parent App</span></div>
        </motion.div>
        <motion.button className="sk-app__tap sk-stage__trigger" type="button" onClick={onReplay}
          aria-label="Phát tín hiệu từ đồng hồ" title="Phát tín hiệu từ đồng hồ"
          whileHover={reduce ? undefined : { scale: 1.12 }} whileTap={reduce ? undefined : { scale: 0.87 }}>
          <Zap size={18} aria-hidden="true" />
        </motion.button>
      </div>
      <figcaption className="sr-only">{scene.title}. {scene.description}</figcaption>
    </figure>
  );
}
