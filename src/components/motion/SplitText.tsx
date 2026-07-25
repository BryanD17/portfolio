"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SPRING_SOFT, STAGGER, cappedStagger } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface SplitTextProps {
  text: string;
  /** "word" wipes per word; "line" wipes per explicit line (split on \n). */
  per?: "word" | "line";
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** When false the reveal holds; flip to true to fire (hero boot sync). */
  start?: boolean;
  className?: string;
}

/**
 * Split reveal: each unit rises out of an overflow-hidden clip with a
 * spring, staggered in reading order. The complete string stays available
 * to screen readers through a visually-hidden sibling; the animated spans
 * are aria-hidden. Under reduced motion the full text renders instantly.
 *
 * Technique after studying react-bits SplitText: wrap units in inline-block
 * overflow-hidden clips so the wipe is pure transform; keep the spaces as
 * plain text nodes between clips so the browser wraps lines naturally.
 */
export function SplitText({
  text,
  per = "word",
  as: Tag = "h2",
  start = true,
  className,
}: SplitTextProps) {
  const { reduced } = useReducedMotionSafe();
  const units = useMemo(
    () => (per === "line" ? text.split("\n") : text.split(" ")),
    [text, per]
  );
  const step = per === "word" ? STAGGER.tight : STAGGER.base;

  // Server HTML renders the text fully VISIBLE so the largest contentful
  // paint happens at first paint, not at hydration. The animated structure
  // swaps in during a layout effect (before that commit paints), then the
  // wipe plays as choreographed.
  const [hydrated, setHydrated] = useState(false);
  const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
  useIso(() => setHydrated(true), []);

  if (reduced || !hydrated) {
    return <Tag className={cn("whitespace-pre-line", className)}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        animate={start ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: cappedStagger(units.length, step) },
          },
        }}
      >
        {units.map((unit, i) => (
          <span key={`${unit}-${i}`} className="inline">
            <span
              className={cn(
                "inline-block overflow-hidden align-bottom",
                per === "line" && "block"
              )}
            >
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "110%" },
                  visible: { y: "0%", transition: SPRING_SOFT },
                }}
              >
                {unit === "" ? " " : unit}
              </motion.span>
            </span>
            {per === "word" && i < units.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
