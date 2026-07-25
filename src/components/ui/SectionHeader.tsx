import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index?: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ index, label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {index ? `${index} / ` : "// "}
        {label}
      </p>
      <h2 className="font-mono text-3xl font-semibold text-fg sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base text-fg-muted">{description}</p> : null}
    </div>
  );
}
