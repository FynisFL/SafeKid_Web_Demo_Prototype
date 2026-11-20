import { useSyncExternalStore } from "react";

type DataConnection = EventTarget & { saveData?: boolean };
const connection = () => (navigator as Navigator & { connection?: DataConnection }).connection;
const preference = "(prefers-reduced-motion: reduce)";

function subscribe(update: () => void) {
  const query = window.matchMedia(preference);
  const network = connection();
  query.addEventListener("change", update);
  network?.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  return () => {
    query.removeEventListener("change", update);
    network?.removeEventListener("change", update);
    document.removeEventListener("visibilitychange", update);
  };
}

function snapshot() {
  return !document.hidden && !window.matchMedia(preference).matches && !connection()?.saveData;
}

export function useEnhancedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
