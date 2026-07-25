"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

type Range = [number, number];

interface ScrollLinkedProps {
  /** useScroll offset; defaults to the element's full pass through the viewport. */
  offset?: ["start end" | "start center" | "start start", "end start" | "end center" | "end end"];
  /** Output ranges mapped from scroll progress 0..1. */
  y?: Range;
  opacity?: Range;
  scale?: Range;
  className?: string;
  children: React.ReactNode;
}

/**
 * The workhorse: continuous scroll-bound transforms, never a one-shot
 * trigger. Under reduced motion it renders children statically with no
 * transform at all (the composed-at-rest state).
 */
export function ScrollLinked({
  offset = ["start end", "end start"],
  y,
  opacity,
  scale,
  className,
  children,
}: ScrollLinkedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset });

  const yValue = useTransform(scrollYProgress, [0, 1], y ?? [0, 0]);
  const opacityValue = useTransform(scrollYProgress, [0, 1], opacity ?? [1, 1]);
  const scaleValue = useTransform(scrollYProgress, [0, 1], scale ?? [1, 1]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: y ? yValue : undefined,
        opacity: opacity ? opacityValue : undefined,
        scale: scale ? scaleValue : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
