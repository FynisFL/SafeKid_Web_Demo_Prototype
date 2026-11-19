import { createContext, useContext } from "react";

export type Entrance = "waiting" | "play" | "static";

export const FirstSceneContext = createContext<{
  entrance: Entrance;
  ready: (failed?: boolean) => void;
}>({ entrance: "play", ready: () => {} });

export function useFirstScene() {
  return useContext(FirstSceneContext);
}
