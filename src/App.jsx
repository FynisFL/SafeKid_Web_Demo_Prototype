import { useEffect, useState } from "react";
import AboutPage from "./pages/AboutPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import SosPage from "./pages/SosPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import ZodiacPage from "./pages/ZodiacPage.jsx";
import { zodiacProducts } from "./data/zodiac.js";

function currentRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash.startsWith("/")) return "/";
  return hash.split("?")[0] || "/";
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const productMatch = route.match(/^\/product\/([a-z-]+)$/);
  const activeProduct = productMatch
    ? zodiacProducts.find((item) => item.id === productMatch[1])
    : null;

  useEffect(() => {
    const syncRoute = () => {
      if (!window.location.hash.startsWith("#/")) return;
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    const title = route === "/"
      ? "SafeKid | DigiBabi"
      : activeProduct
        ? `${activeProduct.detailTitle} | SafeKid`
        : `${route.split("/").filter(Boolean).pop() ?? "SafeKid"} | SafeKid`;
    document.title = title;
  }, [route, activeProduct]);

  if (route === "/") return <HomePage />;
  if (route === "/zodiac") return <ZodiacPage />;
  if (route === "/about") return <AboutPage />;
  if (route === "/support") return <SupportPage />;
  if (route === "/contact") return <ContactPage />;
  if (route === "/chat" || route === "/s-f-ai") return <ChatPage />;
  if (route === "/sos") return <SosPage />;
  if (productMatch) {
    if (activeProduct) return <ProductPage product={activeProduct} />;
  }
  return <NotFoundPage />;
}
