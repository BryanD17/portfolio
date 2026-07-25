import { cn } from "@/lib/utils";
import { Metric, type MetricProps } from "@/components/ui/Metric";

interface StatBlockProps {
  stats: Omit<MetricProps, "className">[];
  className?: string;
}

export function StatBlock({ stats, className }: StatBlockProps) {
  return (
    <ul
      className={cn(
        "grid list-none grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-6 lg:grid-cols-4",
        className
      )}
    >
      {stats.map((stat) => (
        <li key={stat.label}>
          <Metric {...stat} />
        </li>
      ))}
    </ul>
  );
}
