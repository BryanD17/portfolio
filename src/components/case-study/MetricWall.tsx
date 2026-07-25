"use client";

import { Metric } from "@/components/ui/Metric";
import { CountUp } from "@/components/motion/CountUp";

interface WallMetric {
  value?: number;
  text?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

/**
 * THE METRIC WALL: count-ups fire on viewport entry, staggered 100ms, 1.2s
 * each. Non-numeric metrics (e.g. "Java 21") render as text.
 */
export function MetricWall({ metrics }: { metrics: WallMetric[] }) {
  if (metrics.length === 0) return null;
  return (
    <ul className="grid list-none grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-8 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <li key={m.label}>
          <Metric
            value={m.text ?? String(m.value ?? "")}
            suffix={m.suffix}
            label={m.label}
            valueSlot={
              m.value !== undefined ? (
                <>
                  {m.prefix ?? ""}
                  <CountUp to={m.value} decimals={m.decimals ?? 0} delay={i * 0.1} />
                </>
              ) : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
