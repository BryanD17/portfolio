import type { Transition, Variants } from "motion/react";

/*
  The single source of truth for motion. Every spring, easing, duration, and
  stagger on the site lives here; components import these and never inline
  their own values.
*/

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
};

export const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const SPRING_DRIFT: Transition = {
  type: "spring",
  stiffness: 60,
  damping: 24,
  mass: 1.4,
};

/** Fast-out, slow-settle. The only tween curve on the site. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Seconds, for Motion transitions. */
export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  reveal: 0.7,
  /** Route crossfade; the spec caps page transitions at 220ms. */
  page: 0.22,
} as const;

/** Seconds between siblings. */
export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.09,
} as const;

/** Cap so a large group never takes longer than 700ms to fully arrive. */
export const GROUP_ARRIVAL_CAP = 0.7;

export function cappedStagger(count: number, step: number = STAGGER.base): number {
  if (count <= 1) return step;
  return Math.min(step, GROUP_ARRIVAL_CAP / (count - 1));
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING_SOFT },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: SPRING_SOFT },
};

export const staggerContainer = (step: number = STAGGER.base): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step } },
});

export const staggerItem: Variants = fadeUp;

/** Terminal typing: per-character delay bounds in ms (varied, seeded). */
export const TYPE_CHAR_MS = { min: 18, max: 34 } as const;

/** Terminal block cursor blink cycle in ms. */
export const CURSOR_BLINK_MS = 530;

/** Parallax travel clamps in px. */
export const PARALLAX_MAX_DESKTOP = 40;
export const PARALLAX_MAX_MOBILE = 20;
