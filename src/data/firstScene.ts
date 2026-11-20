import watch from "@/assets/safekid/editions/rat.webp";
import digibabi from "@/assets/digibabi/logo-digibabi.webp";
import { zodiacProducts } from "./zodiac";

export type SceneImage = { url: string; purpose: string };

const imageByPath: Record<string, SceneImage> = {
  "/": { url: watch, purpose: "Hero watch and the opening Story scene" },
  "/zodiac": { url: watch, purpose: "First watch in the Zodiac collection" },
  "/app": { url: watch, purpose: "Parent App signal demo watch" },
  "/about": { url: digibabi, purpose: "About hero artwork" },
};

export const FIRST_SCENE_FONTS = ['500 1em "Plus Jakarta Sans"', "400 1em Inter"];

// The entry already imports Motion. React Router and Vite resolve only the
// requested route chunk and its dependencies. Inline SVG and CSS need no fetch.
export function firstSceneImages(pathname: string): SceneImage[] {
  const path = pathname.replace(/\/+$/, "") || "/";
  const edition = /^\/product\/([a-z]+)$/i.exec(path)?.[1]?.toLowerCase();
  const product = edition && zodiacProducts.find((item) => item.id === edition);
  if (product) return [{ url: product.image, purpose: "Selected product's opening image" }];
  return imageByPath[path] ? [imageByPath[path]] : [];
}
