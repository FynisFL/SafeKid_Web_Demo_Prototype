import { useEffect } from "react";

const defaultDescription =
  "Explore twelve SafeKid Zodiac watch designs, preview your bag and checkout, and try the Parent App. Watch orders are not open yet.";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description ?? defaultDescription);

    return () => {
      document.title = "SafeKid — The space between them";
    };
  }, [title, description]);
}
