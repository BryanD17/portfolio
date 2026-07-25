import { cn } from "@/lib/utils";

export interface MetricProps {
  /** Numeric portion, already formatted (e.g. "80,000" or "3.85"). */
  value: string;
  /** Optional suffix rendered tight against the value (e.g. "+", "%"). */
  suffix?: string;
  label: string;
  className?: string;
  /** Replaces the plain value; Agent 03's CountUp slots in here. */
  valueSlot?: React.ReactNode;
}

export function Metric({ value, suffix, label, className, valueSlot }: MetricProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="font-mono text-3xl font-semibold tabular-nums text-fg sm:text-4xl">
        {valueSlot ?? value}
        {suffix ? <span className="text-accent">{suffix}</span> : null}
      </p>
      <p className="font-mono text-xs uppercase tracking-wider text-fg-muted">{label}</p>
    </div>
  );
}
