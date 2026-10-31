import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { Thesis } from "@/components/home/Thesis";
import { StorySequence } from "@/components/home/StorySequence";
import { ProductChapters } from "@/components/home/ProductChapters";
import { WatchPassportSection } from "@/components/home/WatchPassportSection";
import { ZodiacStage } from "@/components/home/ZodiacStage";
import { SOSIntroduction } from "@/components/home/SOSIntroduction";
import { Closing } from "@/components/home/Closing";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Home() {
  usePageTitle(
    "SafeKid — The space between them",
    "SafeKid is a product concept: a child's smartwatch and a parent's app, imagined around the space between independence and connection."
  );

  return (
    <SiteLayout>
      <Hero />
      <Thesis />
      <StorySequence />
      <ProductChapters />
      <WatchPassportSection />
      <ZodiacStage />
      <SOSIntroduction />
      <Closing />
    </SiteLayout>
  );
}
