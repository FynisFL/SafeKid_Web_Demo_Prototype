/**
 * Shared motion language. One curve, three durations, three distances, one
 * smoothing spring, so scroll and entrance motion feels related everywhere.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Seconds. `quick` for swaps and feedback, `base` for entrances, `slow` for hero-scale moments. */
export const DURATION = { quick: 0.35, base: 0.8, slow: 1.2 } as const;

/** Pixels an element travels while entering. */
export const DISTANCE = { sm: 10, md: 24, lg: 36 } as const;

/** Smooths raw scroll progress (same feel as the header's progress line). */
export const SCROLL_SPRING = { stiffness: 140, damping: 26, mass: 0.3 } as const;
