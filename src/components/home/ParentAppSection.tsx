import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

import { SignalStage } from "@/components/app-experience/SignalStage";
import { scenes } from "@/components/app-experience/scenes";
import { DURATION, EASE } from "@/components/motion/tokens";
import { Reveal } from "@/components/site/Reveal";
import "./parent-app-section.css";

export function ParentAppSection() {
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.35 });
  const reduce = Boolean(useReducedMotion());
  const [interaction, setInteraction] = useState({ index: 0, replay: 0 });
  const scene = scenes[interaction.index];
  const play = inView || interaction.replay > 0;

  function playScene(index: number) {
    setInteraction((current) => ({ index, replay: current.replay + 1 }));
  }

  return (
    <section
      aria-labelledby="home-parent-app"
      className="home-parent-app relative isolate overflow-clip bg-night py-20 text-white sm:py-28"
      data-in-view={inView}
      style={{ "--home-app-signal": scene.accent } as CSSProperties}
    >
      <div className="home-parent-app__glow" aria-hidden="true" />
      <div className="shell home-parent-app__layout relative">
        <Reveal className="home-parent-app__intro min-w-0">
          <h2 id="home-parent-app" className="display display-lg text-white">
            SafeKid <span className="text-primary">Parent App</span>
          </h2>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.75] text-white/75 sm:text-base">
            Pick a scenario or press the signal button to see how watch activity reaches the Parent App.
          </p>
        </Reveal>

        <div ref={stage} className="home-parent-app__stage min-w-0">
          <SignalStage
            scene={scene}
            replay={play ? interaction.replay + 1 : 0}
            reduce={reduce || !play}
            loading="lazy"
            onReplay={() => playScene(interaction.index)}
          />
        </div>

        <div className="home-parent-app__controls min-w-0">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2" role="group" aria-label="Parent App demo scenarios">
            {scenes.map(({ id, label, icon: Icon }, index) => {
              const active = index === interaction.index;
              return (
                <motion.button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => playScene(index)}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  className="home-parent-app__scenario sk-app__tap"
                >
                  {active && (
                    <motion.span
                      aria-hidden="true"
                      className="home-parent-app__selection"
                      layoutId={reduce ? undefined : "home-parent-app-selection"}
                      transition={{ duration: DURATION.quick, ease: EASE }}
                    />
                  )}
                  <Icon size={17} className="relative shrink-0" aria-hidden="true" />
                  <span className="relative">{label}</span>
                </motion.button>
              );
            })}
          </div>
          <div className="home-parent-app__event" aria-live="polite" aria-atomic="true">
            <motion.div
              key={scene.id}
              initial={reduce ? false : { opacity: 0.45, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : DURATION.quick, ease: EASE }}
            >
              <p className="text-sm font-semibold text-white">{scene.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/70">{scene.description}</p>
            </motion.div>
          </div>
          <Link
            to={interaction.index === 0 ? "/app" : `/app?scenario=${scene.id}`}
            className="btn-motion btn-motion-light group mt-5 inline-flex min-h-12 max-w-full items-center gap-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-aqua-soft"
          >
            Explore the Parent App
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
