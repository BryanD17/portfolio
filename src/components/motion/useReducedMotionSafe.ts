"use client";

import { createContext, createElement, useContext } from "react";
import { useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { fadeIn, fadeUp, scaleIn } from "@/lib/motion";

/**
 * Lets /motion-lab (and tests) force reduced motion on a subtree regardless
 * of the OS setting. null means "defer to the user's preference".
 */
const ReducedMotionOverrideContext = createContext<boolean | null>(null);

interface OverrideProps {
  value: boolean | null;
  children: React.ReactNode;
}

export function ReducedMotionOverride({ value, children }: OverrideProps) {
  return createElement(ReducedMotionOverrideContext.Provider, { value }, children);
}

/** Collapses a hidden/visible variant pair so the final state renders instantly. */
function settled(variants: Variants): Variants {
  const visible = variants.visible;
  const final = typeof visible === "object" ? { ...visible, transition: { duration: 0 } } : {};
  return { hidden: final, visible: final };
}

/**
 * Wraps Motion's useReducedMotion and hands back pre-resolved variant sets so
 * a consumer cannot forget the reduced path: use the returned variants and
 * the right thing happens in both modes.
 */
export function useReducedMotionSafe() {
  const system = useReducedMotion() ?? false;
  const override = useContext(ReducedMotionOverrideContext);
  const reduced = override ?? system;
  return {
    reduced,
    fadeUp: reduced ? settled(fadeUp) : fadeUp,
    fadeIn: reduced ? settled(fadeIn) : fadeIn,
    scaleIn: reduced ? settled(scaleIn) : scaleIn,
  };
}
