import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index?: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
  /** h1 on standalone pages (every page needs exactly one h1), h2 in sections. */
  as?: "h1" | "h2";
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
  as: Tag = "h2",
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {index ? `${index} / ` : "// "}
        {label}
      </p>
      <Tag className="font-mono text-3xl font-semibold text-fg sm:text-4xl">{title}</Tag>
      {description ? <p className="max-w-2xl text-base text-fg-muted">{description}</p> : null}
    </div>
  );
}
