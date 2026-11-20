import { useLayoutEffect, useRef } from "react";
import { useFirstScene } from "@/components/preloader/firstSceneContext";
import { useMatches, useRouteError } from "react-router-dom";

import { ErrorFallback } from "./error-fallback";

/** Reload the entry to clear React Router's rejected lazy route state. */
export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const matches = useMatches();
  const retrying = useRef(false);
  const { ready } = useFirstScene();
  useLayoutEffect(() => ready(true), [ready]);

  async function retry() {
    if (retrying.current) return;
    retrying.current = true;
    const handle = matches[matches.length - 1]?.handle as { retryChunk?: string } | undefined;
    if (import.meta.env.PROD && handle?.retryChunk) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 4000);
      try {
        const base = new URL(import.meta.env.BASE_URL, window.location.origin);
        const response = await fetch(new URL("route-chunks.json", base), {
          cache: "no-store", signal: controller.signal,
        });
        if (response.ok) {
          const manifest: Record<string, string> = await response.json();
          const chunk = manifest[handle.retryChunk];
          // WebKit can retain the failed module request across a document reload.
          if (typeof chunk === "string" && /^assets\/[\w.-]+\.js$/.test(chunk)) {
            await fetch(new URL(chunk, base), { cache: "reload", signal: controller.signal });
          }
        }
      } catch {
        // Reload can still pick up a newer deployment if revalidation failed.
      } finally {
        window.clearTimeout(timeout);
      }
    }
    window.location.reload();
  }

  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={retry}
    />
  );
};
