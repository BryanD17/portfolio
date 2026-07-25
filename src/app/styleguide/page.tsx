import type { Metadata } from "next";
import { Terminal } from "@/components/ui/Terminal";
import { Prompt } from "@/components/ui/Prompt";
import { Cursor } from "@/components/ui/Cursor";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { Metric } from "@/components/ui/Metric";
import { StatBlock } from "@/components/ui/StatBlock";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colorTokens = [
  "bg",
  "bg-elevated",
  "bg-subtle",
  "border",
  "border-strong",
  "fg",
  "fg-muted",
  "fg-subtle",
  "accent",
  "accent-fg",
  "success",
  "warning",
  "danger",
];

const typeSteps = [
  { cls: "text-xs", label: "text-xs / 0.75rem" },
  { cls: "text-sm", label: "text-sm / 0.875rem" },
  { cls: "text-base", label: "text-base / 1rem" },
  { cls: "text-lg", label: "text-lg / 1.125rem" },
  { cls: "text-xl", label: "text-xl / 1.25rem" },
  { cls: "text-2xl", label: "text-2xl / 1.563rem" },
  { cls: "text-3xl", label: "text-3xl / 1.953rem" },
  { cls: "text-4xl", label: "text-4xl / 2.441rem" },
  { cls: "text-5xl", label: "text-5xl / 3.052rem" },
  { cls: "text-6xl", label: "text-6xl / 3.815rem" },
];

export default function StyleguidePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-16 sm:px-8">
      <SectionHeader
        index="00"
        label="styleguide"
        title="Design system"
        description="Every token, type step, and primitive in every state. Dark terminal aesthetic, one accent, radii capped at 6px. This page is noindexed."
      />

      <section aria-labelledby="sg-colors" className="flex flex-col gap-4">
        <h3 id="sg-colors" className="font-mono text-xl text-fg">
          Color tokens (OKLCH)
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colorTokens.map((token) => (
            <div key={token} className="flex flex-col gap-2 rounded-md border border-border p-3">
              <div
                className="h-12 w-full rounded-sm border border-border"
                style={{ background: `var(--${token})` }}
              />
              <code className="font-mono text-xs text-fg-muted">--{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="sg-type" className="flex flex-col gap-4">
        <h3 id="sg-type" className="font-mono text-xl text-fg">
          Type scale (ratio 1.250)
        </h3>
        <div className="flex flex-col gap-3">
          {typeSteps.map((step) => (
            <div
              key={step.cls}
              className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <code className="shrink-0 font-mono text-xs text-fg-subtle sm:w-40">{step.label}</code>
              <p className={`${step.cls} min-w-0 break-words text-fg`}>I ship production software.</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-fg-muted">
          Sans carries body copy; mono carries headings, labels, metadata, and numbers.
        </p>
      </section>

      <section aria-labelledby="sg-primitives" className="flex flex-col gap-8">
        <h3 id="sg-primitives" className="font-mono text-xl text-fg">
          Primitives
        </h3>

        <Terminal title="bryan@portfolio: styleguide">
          <p>
            <Prompt path="~/dev" />
            <span className="text-fg">whoami</span>
          </p>
          <p className="text-fg-muted">Bryan Djenabia Joseph</p>
          <p>
            <Prompt path="~/dev" />
            <Cursor />
          </p>
        </Terminal>

        <div className="flex flex-wrap items-center gap-2">
          <Tag>default</Tag>
          <Tag tone="accent">accent</Tag>
          <Tag tone="success">LIVE</Tag>
          <Tag tone="warning">FORK</Tag>
          <Tag tone="danger">PRIVATE</Tag>
        </div>

        <StatBlock
          stats={[
            { value: "80,000", suffix: "+", label: "lines of Swift" },
            { value: "15,000", suffix: "+", label: "lines of TypeScript" },
            { value: "3.85", label: "GPA" },
            { value: "100", suffix: "+", label: "students taught" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Card primitive</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Metric value="58" label="services" />
              <div className="flex gap-2">
                <Button>Primary action</Button>
                <Button variant="outline">Secondary</Button>
              </div>
            </CardContent>
          </Card>
          <div className="relative overflow-hidden rounded-lg border border-border">
            <GridBackground />
            <div className="relative flex h-full min-h-40 items-center justify-center">
              <p className="font-mono text-sm text-fg-muted">GridBackground layer</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-base text-fg">States</h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
            <Badge>Badge</Badge>
            <Badge variant="outline">Outline</Badge>
            <Skeleton className="h-9 w-32" />
            <a href="#sg-colors" className="font-mono text-sm text-accent underline underline-offset-4">
              Focusable link (Tab to see the ring)
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
