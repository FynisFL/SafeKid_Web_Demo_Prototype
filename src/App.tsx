import { Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { RouteErrorBoundary } from "./components/error-boundary/route-error-boundary";
import { routers } from "./router";

// Created once so remounting App (e.g. after an error-boundary retry) never
// leaves a second router listening to history. The pathless root route is the
// shared errorElement every page bubbles up to; a page can still declare its
// own errorElement, statically or through lazy().
const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    element: <RootShell />,
    children: routers,
  },
], { basename: "/SafeKid_Web_Demo_Prototype" });

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/30">
          <span className="h-2 w-2 rounded-full bg-primary animate-sk-pulse" />
          <span className="absolute inset-0 rounded-full border border-primary/20 animate-sk-spin" />
        </span>
        <span className="font-display text-[11px] uppercase tracking-[0.24em] text-deep/55">
          SafeKid
        </span>
      </div>
    </div>
  );
}

function RootShell() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
