export const BREAKPOINT = {
  phone: 390,
  phoneLarge: 480,
  tablet: 640,
  portraitTablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
  extraWide: 1536,
} as const;

export const MIN_STAGE_HEIGHT = 650;

export const MEDIA = {
  mobile: `(max-width: ${BREAKPOINT.portraitTablet - 1}px)`,
  laptop: `(min-width: ${BREAKPOINT.laptop}px)`,
  tabletStage: `(min-width: ${BREAKPOINT.tablet}px) and (max-width: ${BREAKPOINT.laptop - 1}px) and (min-height: ${MIN_STAGE_HEIGHT}px)`,
  desktopStage: `(min-width: ${BREAKPOINT.laptop}px) and (min-height: ${MIN_STAGE_HEIGHT}px)`,
  finePointer: "(hover: hover) and (pointer: fine)",
  // Matches the existing Parent App grid media query.
  parentAppStage: "(min-width: 961px)",
} as const;
