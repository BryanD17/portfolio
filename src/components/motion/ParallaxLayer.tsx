"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { SPRING_DRIFT, PARALLAX_MAX_DESKTOP, PARALLAX_MAX_MOBILE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useIsMobile } from "@/components/motion/useIsMobile";

interface ParallaxLayerProps {
  /** Total travel in px across the scroll range. Clamped to 40 desktop, 20 mobile; halved on mobile. */
  travel?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Scroll-linked vertical drift on SPRING_DRIFT. Depth comes from small
 * differential speed, so travel is deliberately clamped. Under reduced
 * motion the layer renders at its mid-scroll offset (zero), keeping the
 * composition intact.
 */
export function ParallaxLayer({ travel = 16, className, children }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionSafe();
  const isMobile = useIsMobile();

  const max = isMobile ? PARALLAX_MAX_MOBILE : PARALLAX_MAX_DESKTOP;
  const clamped = Math.min(Math.abs(travel) * (isMobile ? 0.5 : 1), max) * Math.sign(travel || 1);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [clamped, -clamped]);
  const y = useSpring(raw, SPRING_DRIFT);

  if (reduced) {
    return (
      <div ref={ref} data-reveal className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} data-reveal className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
