import { useEffect } from "react";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", description);
    }

    return () => {
      document.title = "SafeKid — The space between them";
    };
  }, [title, description]);
}
