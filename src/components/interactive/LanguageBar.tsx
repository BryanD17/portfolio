"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface Segment {
  name: string;
  color: string;
  bytes: number;
  percent: number;
}

/**
 * THE PROPORTION FILL: the bar fills to its real byte-derived width over
 * 900ms using transform: scaleX with a left origin, never width. Full width
 * immediately under reduced motion.
 */
export function LanguageBar({ segments }: { segments: Segment[] }) {
  const { reduced } = useReducedMotionSafe();

  if (segments.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        data-reveal
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="flex h-2 origin-left overflow-hidden rounded-sm border border-border"
        role="img"
        aria-label={`Language breakdown by bytes: ${segments
          .map((s) => `${s.name} ${s.percent.toFixed(1)} percent`)
          .join(", ")}`}
      >
        {segments.map((s) => (
          <span key={s.name} style={{ width: `${s.percent}%`, background: s.color }} />
        ))}
      </motion.div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {segments.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5 font-mono text-xs text-fg-muted">
            <span aria-hidden="true" className="size-2 rounded-sm" style={{ background: s.color }} />
            {s.name} {s.percent.toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
