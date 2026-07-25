"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

type Range = [number, number];

interface ScrollLinkedProps {
  /** useScroll offset; defaults to the element's full pass through the viewport. */
  offset?: [
    "start end" | "start center" | "start start",
    "start center" | "start start" | "end start" | "end center" | "end end",
  ];
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

  // Callback-form useTransform: with motion 12.42 the array form silently
  // drops a style binding whose initial output equals the CSS default (e.g.
  // opacity 1 at progress 0), so the value never updates. The callback form
  // subscribes reliably; keep it for all three channels.
  const lerp = (range: Range | undefined, fallback: number) => {
    if (!range) return fallback;
    const p = scrollYProgress.get();
    return range[0] + (range[1] - range[0]) * p;
  };
  const yValue = useTransform(() => lerp(y, 0));
  const opacityValue = useTransform(() => lerp(opacity, 1));
  const scaleValue = useTransform(() => lerp(scale, 1));

  if (reduced) {
    return (
      <div ref={ref} data-reveal className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      data-reveal
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
