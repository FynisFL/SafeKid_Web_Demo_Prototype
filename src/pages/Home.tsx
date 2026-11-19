import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { Thesis } from "@/components/home/Thesis";
import { StorySequence } from "@/components/home/StorySequence";
import { ProductChapters } from "@/components/home/ProductChapters";
import { ParentAppSection } from "@/components/home/ParentAppSection";
import { WatchPassportSection } from "@/components/home/WatchPassportSection";
import { ZodiacStage } from "@/components/home/ZodiacStage";
import { SOSIntroduction } from "@/components/home/SOSIntroduction";
import { Closing } from "@/components/home/Closing";
import { SET_PIECES } from "@/components/motion/setPieces";
import { useFirstScene } from "@/components/preloader/firstSceneContext";
import { usePageTitle } from "@/hooks/usePageTitle";

const HomeThread = lazy(() => import("@/components/home/HomeThread"));

export default function Home() {
  const home = useRef<HTMLDivElement>(null);
  const { entrance } = useFirstScene();
  const [showThread, setShowThread] = useState(false);

  useEffect(() => {
    if (!SET_PIECES.thread || entrance === "waiting") return;
    // Give the semantic Home a paint before asking for the decorative chunk.
    let visibleFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      visibleFrame = requestAnimationFrame(() => setShowThread(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(visibleFrame);
    };
  }, [entrance]);

  usePageTitle(
    "SafeKid — The space between them",
    "Explore SafeKid’s twelve Zodiac watch designs, preview your shopping bag and checkout, and try the Parent App. Watch orders are not open yet."
  );

  return (
    <SiteLayout>
      <div ref={home} className="relative isolate">
        <Hero />
        <StorySequence />
        <Thesis />
        <ProductChapters />
        <ParentAppSection />
        <WatchPassportSection />
        <ZodiacStage />
        <SOSIntroduction />
        <Closing />
        {showThread && (
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <HomeThread home={home} staticEntrance={entrance === "static"} />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </SiteLayout>
  );
}
