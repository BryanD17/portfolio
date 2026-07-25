import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { CopyButton } from "@/components/case-study/CopyButton";

/** Callout: used for attribution notes and asides. */
export function Callout({
  tone = "accent",
  children,
}: {
  tone?: "accent" | "warning";
  children: React.ReactNode;
}) {
  return (
    <aside
      className={
        tone === "warning"
          ? "rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg"
          : "rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg"
      }
    >
      {children}
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 800,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-md border border-border"
      />
      {caption ? <figcaption className="font-mono text-xs text-fg-subtle">{caption}</figcaption> : null}
    </figure>
  );
}

export function StackList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technology stack">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function Timeline({ items }: { items: { date: string; label: string }[] }) {
  return (
    <ol className="flex flex-col gap-3 border-l border-border pl-4">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col">
          <span className="font-mono text-xs text-fg-subtle">{item.date}</span>
          <span className="text-sm text-fg">{item.label}</span>
        </li>
      ))}
    </ol>
  );
}

export function Comparison({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-md border border-border bg-bg-elevated p-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-fg-subtle">{beforeLabel}</p>
        <div className="text-sm text-fg-muted">{before}</div>
      </div>
      <div className="rounded-md border border-accent/40 bg-bg-elevated p-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{afterLabel}</p>
        <div className="text-sm text-fg-muted">{after}</div>
      </div>
    </div>
  );
}

export function CodeBlock({ children, className }: { children: string; className?: string }) {
  const language = className?.replace("language-", "") ?? "";
  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-bg-elevated">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-xs text-fg-subtle">{language || "code"}</span>
        <CopyButton text={children} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-fg">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** Markdown element mapping shared by every case study body. */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      id={slugify(textOf(props.children))}
      className="scroll-mt-24 font-mono text-2xl font-semibold text-fg"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="font-mono text-lg font-semibold text-fg" {...props} />
  ),
  p: (props) => <p className="text-base leading-relaxed text-fg-muted" {...props} />,
  ul: (props) => <ul className="flex list-disc flex-col gap-1 pl-5 text-fg-muted" {...props} />,
  li: (props) => <li className="text-base leading-relaxed" {...props} />,
  a: (props) => (
    <a className="text-accent underline underline-offset-4" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  code: (props) =>
    typeof props.children === "string" && !props.className ? (
      <code className="rounded-sm bg-bg-subtle px-1 py-0.5 font-mono text-sm text-fg" {...props} />
    ) : (
      <CodeBlock className={props.className}>{String(props.children)}</CodeBlock>
    ),
  Callout,
  Figure,
  StackList,
  Timeline,
  Comparison,
  CodeBlock,
};

export function textOf(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
