"use client";

import { motion } from "motion/react";
import { SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface RevealOnScrollProps {
  /** Seconds of delay, used by parents to choreograph a stagger. */
  delay?: number;
  /** Entrance travel in px. */
  distance?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * One-shot entrance for small elements. Fires ONCE and never re-animates on
 * scroll-back. Under reduced motion the element renders in place, visible.
 */
export function RevealOnScroll({ delay = 0, distance = 24, className, children }: RevealOnScrollProps) {
  const { reduced } = useReducedMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ ...SPRING_SOFT, delay }}
    >
      {children}
    </motion.div>
  );
}
