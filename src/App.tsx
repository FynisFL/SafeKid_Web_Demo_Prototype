import { Suspense, useLayoutEffect } from "react";
import { MotionConfig } from "motion/react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { RouteErrorBoundary } from "./components/error-boundary/route-error-boundary";
import { ShoppingBagProvider } from "./components/shop/ShoppingBagProvider";
import { FirstSceneGate } from "./components/preloader/FirstSceneGate";
import { useFirstScene } from "./components/preloader/firstSceneContext";
import "./components/preloader/first-scene.css";
import { routers } from "./router";

// Created once so remounting App (e.g. after an error-boundary retry) never
// leaves a second router listening to history. The pathless root route is the
// shared errorElement every page bubbles up to; a page can still declare its
// own errorElement, statically or through lazy().
const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: () => null,
    element: <RootShell />,
    children: routers,
  },
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
});

function RouteReady() {
  const { ready } = useFirstScene();
  useLayoutEffect(() => ready(), [ready]);
  return null;
}

function RootShell() {
  const { entrance } = useFirstScene();
  return (
    <ShoppingBagProvider>
      <Suspense fallback={entrance === "waiting" ? null : (
        <p className="mx-auto grid min-h-screen place-items-center bg-mist text-sm text-deep" role="status">Opening page…</p>
      )}>
        <Outlet />
        <RouteReady />
      </Suspense>
    </ShoppingBagProvider>
  );
}

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <FirstSceneGate><RouterProvider router={router} /></FirstSceneGate>
    </MotionConfig>
  );
};

export default App;
