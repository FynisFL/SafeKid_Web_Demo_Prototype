import { MEDIA } from "@/lib/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function useIsMobile() {
  return useMediaQuery(MEDIA.mobile);
}
