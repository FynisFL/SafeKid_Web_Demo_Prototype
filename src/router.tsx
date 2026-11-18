import { lazy } from "react";

const AppExperience = lazy(() => import("./pages/AppExperience"));
const Home = lazy(() => import("./pages/Home"));
const Zodiac = lazy(() => import("./pages/Zodiac"));
const WatchPassport = lazy(() => import("./pages/WatchPassport"));
const Product = lazy(() => import("./pages/Product"));
const ShoppingBag = lazy(() => import("./pages/ShoppingBag"));
const About = lazy(() => import("./pages/About"));
const Support = lazy(() => import("./pages/Support"));
const Contact = lazy(() => import("./pages/Contact"));
const Chat = lazy(() => import("./pages/Chat"));
const Sos = lazy(() => import("./pages/Sos"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const routers = [
  { path: "/", name: "home", element: <Home /> },
  { path: "/app", name: "app", element: <AppExperience /> },
  { path: "/zodiac", name: "zodiac", element: <Zodiac /> },
  { path: "/watch-passport", name: "watch-passport", element: <WatchPassport /> },
  { path: "/product/:id", name: "product", element: <Product /> },
  { path: "/cart", name: "cart", element: <ShoppingBag /> },
  { path: "/checkout", name: "checkout", element: <ShoppingBag checkout /> },
  { path: "/about", name: "about", element: <About /> },
  { path: "/support", name: "support", element: <Support /> },
  { path: "/contact", name: "contact", element: <Contact /> },
  { path: "/chat", name: "chat", element: <Chat /> },
  { path: "/s-f-ai", name: "s-f-ai", element: <Chat /> },
  { path: "/sos", name: "sos", element: <Sos /> },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  { path: "*", name: "404", element: <NotFound /> },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
