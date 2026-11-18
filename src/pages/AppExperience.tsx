import { ArrowLeft, ArrowUpRight, Download, Globe2, Smartphone } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { AndroidDownload } from "@/components/app-experience/AndroidDownload";
import { SignalStage } from "@/components/app-experience/SignalStage";
import { scenes } from "@/components/app-experience/scenes";
import { EASE } from "@/components/motion/tokens";
import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import "./app-experience.css";

const webAppUrl = "https://fynisfl.github.io/SafeKid-Parent-App-/";

function WebAppLink() {
  return (
    <Button asChild size="lg" variant="brand" className="sk-app__tap sk-app__primary">
      <a href={webAppUrl}>Open Web App <ArrowUpRight aria-hidden="true" /></a>
    </Button>
  );
}

function AndroidButton({ onClick }: { onClick: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button className="sk-app__tap sk-app__secondary" type="button" aria-haspopup="dialog" onClick={onClick}>
      <Download size={17} aria-hidden="true" /> Download Android APK
    </button>
  );
}

export default function AppExperience() {
  usePageTitle("Try the SafeKid Parent App | DigiBabi");

  const reduce = Boolean(useReducedMotion());
  const hero = useRef<HTMLElement>(null);
  const [searchParams] = useSearchParams();
  const [interaction, setInteraction] = useState(() => ({
    index: Math.max(0, scenes.findIndex(({ id }) => id === searchParams.get("scenario"))),
    replay: 0,
  }));
  const scene = scenes[interaction.index];
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadTrigger = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 0.65, 1], [0, 70, 20]);
  const stageScale = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1.065, 0.94]);

  useEffect(() => {
    if (window.location.hash === "#android") {
      document.getElementById("android")?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }

  }, []);

  function openDownload(event: MouseEvent<HTMLButtonElement>) {
    downloadTrigger.current = event.currentTarget;
    setDownloadOpen(true);
  }

  function playScene(index: number) {
    setInteraction((current) => ({ index, replay: current.replay + 1 }));
  }

  return (
    <div className="sk-app">
      <div className="sk-app__backdrop" aria-hidden="true">
        <span /><span /><span />
      </div>
      <motion.header className="sk-app__header sk-app__shell"
        initial={reduce ? false : { opacity: 0.78, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.65, ease: EASE }}>
        <BrandMark compact />
        <Link className="sk-app__tap sk-app__back" to="/"><ArrowLeft size={16} aria-hidden="true" /> Back to site</Link>
      </motion.header>

      <main>
        <section className="sk-app__hero sk-app__shell" ref={hero}>
          <div className="sk-app__intro">
            <motion.p className="sk-app__kicker"
              initial={reduce ? false : { opacity: 0, x: -26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.58, ease: EASE }}>
              SafeKid Parent App
            </motion.p>
            <h1>
              <span className="sk-app__title-mask">
                <motion.span initial={reduce ? false : { y: "112%", rotate: 7 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: reduce ? 0 : 0.85, ease: EASE }}>Closer, even</motion.span>
              </span>{" "}
              <span className="sk-app__title-mask sk-app__title-accent">
                <motion.span initial={reduce ? false : { y: "112%", rotate: 7 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: reduce ? 0 : 0.92, delay: reduce ? 0 : 0.11, ease: EASE }}>when apart.</motion.span>
              </span>
            </h1>
            <motion.p className="sk-app__lede"
              initial={reduce ? false : { opacity: 0, y: 27 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.74, delay: reduce ? 0 : 0.24, ease: EASE }}>
              Explore the Parent App, from safe zones to the little routines that shape each day.
            </motion.p>
            <div className="sk-app__actions">
              <motion.div initial={reduce ? false : { y: 16, opacity: 0.8 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.65, delay: reduce ? 0 : 0.17, ease: EASE }}>
                <WebAppLink />
              </motion.div>
              <motion.div initial={reduce ? false : { y: 16, opacity: 0.8 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.65, delay: reduce ? 0 : 0.26, ease: EASE }}>
                <AndroidButton onClick={openDownload} />
              </motion.div>
            </div>
          </div>

          <motion.div className="sk-app__stage-placement" style={reduce ? undefined : { y: stageY, scale: stageScale }}>
            <SignalStage scene={scene} replay={interaction.replay} reduce={reduce}
              onReplay={() => playScene(interaction.index)} />
          </motion.div>

          <div className="sk-app__scenes">
            <h2>Try a scenario</h2>
            <div className="sk-app__scene-options" role="group" aria-label="Demo scenarios">
              {scenes.map(({ id, label, icon: Icon }, index) => (
                <motion.button
                  type="button"
                  key={id}
                  className="sk-app__tap sk-app__scene"
                  aria-pressed={index === interaction.index}
                  whileHover={reduce ? undefined : { y: -3 }}
                  whileTap={reduce ? undefined : { scale: 0.91 }}
                  onClick={() => playScene(index)}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </motion.button>
              ))}
            </div>
            <p className="sk-app__scene-description" aria-live="polite" aria-atomic="true">
              <span className="sr-only">{scene.title}. </span>{scene.description}
            </p>
          </div>
        </section>

        <section className="sk-app__access sk-app__shell" aria-labelledby="sk-app-access-title">
          <motion.h2 id="sk-app-access-title"
            initial={reduce ? false : { opacity: 0.72, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0 : 0.65, ease: EASE }}>
            Choose how to try SafeKid
          </motion.h2>
          <div className="sk-app__cards">
            <motion.article className="sk-app__card"
              initial={reduce ? false : { opacity: 0.68, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: reduce ? 0 : 0.72, ease: EASE }}>
              <Globe2 size={22} aria-hidden="true" />
              <h3>Web App</h3>
              <p>Runs in your browser on iPhone, Android and desktop.</p>
              <WebAppLink />
            </motion.article>
            <motion.article className="sk-app__card" id="android"
              initial={reduce ? false : { opacity: 0.68, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: reduce ? 0 : 0.76, delay: reduce ? 0 : 0.1, ease: EASE }}>
              <Smartphone size={22} aria-hidden="true" />
              <h3>Android APK</h3>
              <p>Check the GitHub release for an installable test build.</p>
              <AndroidButton onClick={openDownload} />
            </motion.article>
          </div>
          <p className="sk-app__footnote">SafeKid Parent App is in testing. Its location view shows the device running the app. The Web App and Android app store data separately.</p>
        </section>
      </main>
      <AndroidDownload open={downloadOpen} onOpenChange={setDownloadOpen} trigger={downloadTrigger} />
    </div>
  );
}
