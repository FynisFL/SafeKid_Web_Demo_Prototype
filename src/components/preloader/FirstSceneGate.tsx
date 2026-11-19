import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { firstSceneImages, FIRST_SCENE_FONTS } from "@/data/firstScene";
import { DURATION, EASE } from "@/components/motion/tokens";
import { FirstSceneContext, type Entrance } from "./firstSceneContext";

const MAX_WAIT_MS = 8_000;
const FONT_WAIT_MS = 160;
const SHOW_AFTER_MS = 350;
const SKIP_AFTER_MS = 1_800;

function imageDecoded(url: string) {
  const image = new Image();
  image.fetchPriority = "high";
  image.src = url;
  return image.decode();
}

async function loadFonts() {
  const stylesheet = document.querySelector<HTMLLinkElement>("#safekid-webfonts");
  if (!document.fonts || !stylesheet || stylesheet.dataset.fallback === "true") return;

  let timer: number | undefined;
  const listener = new AbortController();
  const stylesReady = stylesheet.media === "all"
    ? Promise.resolve()
    : new Promise<void>((resolve, reject) => {
        stylesheet.addEventListener("load", () => resolve(), { once: true, signal: listener.signal });
        stylesheet.addEventListener("error", () => reject(new Error("Font stylesheet unavailable")), {
          once: true, signal: listener.signal,
        });
      });
  const fontsReady = stylesReady
    .then(() => Promise.all(FIRST_SCENE_FONTS.map((font) => document.fonts.load(font))))
    .then(() => document.fonts.ready)
    .then(() => true);

  try {
    const loaded = await Promise.race([
      fontsReady,
      new Promise<false>((resolve) => { timer = window.setTimeout(() => resolve(false), FONT_WAIT_MS); }),
    ]);
    if (loaded) return;
  } catch {
    // Use the CSS fallback when the font provider is unavailable.
  } finally {
    window.clearTimeout(timer);
    listener.abort();
  }
  // Keep the same metrics for this visit when a font responds after the intro.
  stylesheet.dataset.fallback = "true";
  stylesheet.media = "not all";
}

function initialState() {
  const pathname = window.location.pathname;
  const images = firstSceneImages(pathname);
  const key = `safekid-first-scene-v1:${pathname.replace(/\/+$/, "") || "/"}:${images.map(({ url }) => url).join(",")}`;
  let cached = false;
  let benchmarkBypass = false;
  try {
    cached = sessionStorage.getItem(key) === "ready";
    benchmarkBypass = sessionStorage.getItem("safekid:skip-first-scene") === "1";
  } catch {
    // Private browser settings can block storage.
  }
  return { images, key, bypass: cached || benchmarkBypass };
}

export function FirstSceneGate({ children }: { children: ReactNode }) {
  const [plan] = useState(initialState);
  const [phase, setPhase] = useState<Entrance>(plan.bypass ? "play" : "waiting");
  const [routeReady, setRouteReady] = useState(false);
  const [prepared, setPrepared] = useState(0);
  const [frameReady, setFrameReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const bootDone = useRef(plan.bypass);
  const focusOnExit = useRef(false);
  const [releaseOverlay, setReleaseOverlay] = useState(plan.bypass);
  const reduced = useReducedMotion();

  // Entry and Motion can execute already, since this component is rendering.
  const total = plan.images.length + 4;
  const workReady = prepared === plan.images.length + 1;
  const progress = Math.round(((1 + Number(routeReady) + prepared + Number(frameReady)) / total) * 100);

  const enter = useCallback((next: Entrance) => {
    if (bootDone.current) return;
    bootDone.current = true;
    setPhase(next);
    if (next === "play") {
      try { sessionStorage.setItem(plan.key, "ready"); } catch { /* storage is optional */ }
    }
  }, [plan.key]);

  const ready = useCallback((failed = false) => {
    setRouteReady(true);
    if (failed) enter("static");
  }, [enter]);

  useEffect(() => {
    if (plan.bypass) return;
    let active = true;
    function finishTask() {
      if (active && !bootDone.current) setPrepared((count) => count + 1);
    }
    for (const { url } of plan.images) {
      void imageDecoded(url).then(finishTask, () => { if (active) enter("static"); });
    }
    void loadFonts().then(finishTask);
    const overlay = window.setTimeout(() => { if (!bootDone.current) setShowOverlay(true); }, SHOW_AFTER_MS);
    const skip = window.setTimeout(() => { if (!bootDone.current) setShowSkip(true); }, SKIP_AFTER_MS);
    const timeout = window.setTimeout(() => enter("static"), MAX_WAIT_MS);
    return () => {
      active = false;
      window.clearTimeout(overlay);
      window.clearTimeout(skip);
      window.clearTimeout(timeout);
    };
  }, [enter, plan]);

  useEffect(() => {
    if (!routeReady || !workReady || phase !== "waiting") return;
    const frame = requestAnimationFrame(() => setFrameReady(true));
    return () => cancelAnimationFrame(frame);
  }, [phase, routeReady, workReady]);

  useEffect(() => {
    if (!frameReady || phase !== "waiting") return;
    enter("play");
  }, [enter, frameReady, phase]);

  useEffect(() => {
    if (phase === "waiting" || !releaseOverlay || !routeReady || !focusOnExit.current) return;
    const target = document.querySelector<HTMLElement>("main, [role=main]");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    focusOnExit.current = false;
  }, [phase, releaseOverlay, routeReady]);

  return (
    <FirstSceneContext.Provider value={{ entrance: phase, ready }}>
      <div inert={phase === "waiting" && showOverlay ? true : undefined}>{children}</div>
      <AnimatePresence onExitComplete={() => setReleaseOverlay(true)}>
        {phase === "waiting" && showOverlay && (
          <motion.div key="first-scene" className="first-scene" data-testid="first-scene"
            exit={{ opacity: 0, pointerEvents: "none" }} transition={{ duration: reduced ? 0 : DURATION.feedback, ease: EASE }}>
            <div className="first-scene__inner">
              <span className="sr-only" aria-live="polite">Preparing the first scene.</span>
              <div role="progressbar" aria-label="First scene preparation" aria-valuenow={progress}
                aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${progress}% of first scene preparation`}>
                <div className="first-scene__dial" aria-hidden="true">
                  <svg viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="67" fill="none" stroke="#c6dedf" strokeWidth="1" />
                    <motion.circle cx="72" cy="72" r="67" fill="none" stroke="#00787a" strokeWidth="2.5"
                      strokeLinecap="round" transform="rotate(-90 72 72)" initial={false}
                      animate={{ pathLength: progress / 100 }}
                      transition={{ duration: reduced ? 0 : DURATION.feedback, ease: EASE }} />
                  </svg>
                  {plan.images[0]?.purpose.startsWith("Hero") && !reduced && (
                    <img src={plan.images[0].url} alt="" width={620} height={620} fetchPriority="high" />
                  )}
                  <span>{progress}%</span>
                </div>
              </div>
              <p className="first-scene__brand">SafeKid</p>
              <div className="first-scene__actions">
                {showSkip && (
                  <button type="button" onClick={() => {
                    focusOnExit.current = true;
                    enter("static");
                  }}>Skip intro</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FirstSceneContext.Provider>
  );
}
