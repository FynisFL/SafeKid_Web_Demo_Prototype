import { useLayoutEffect } from "react";
import { useFirstScene } from "@/components/preloader/firstSceneContext";
import { useRouteError } from "react-router-dom";

import { ErrorFallback } from "./error-fallback";

/** Route-level errorElement; React Router resets it on navigation, so retry reloads the page. */
export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const { ready } = useFirstScene();
  useLayoutEffect(() => ready(true), [ready]);

  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={() => window.location.reload()}
    />
  );
};
