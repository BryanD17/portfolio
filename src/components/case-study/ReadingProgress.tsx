"use client";

import { motion, useScroll } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

/** Scroll-linked reading progress via transform: scaleX, never width. */
export function ReadingProgress() {
  const { reduced } = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
