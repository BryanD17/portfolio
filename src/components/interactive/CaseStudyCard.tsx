"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MagneticCard } from "@/components/motion/MagneticCard";
import { ScrollLinked } from "@/components/motion/ScrollLinked";
import { GridBackground } from "@/components/ui/GridBackground";
import { Tag } from "@/components/ui/Tag";
import type { CaseStudyCardData } from "@/components/interactive/projects-types";

const BADGE_TONES: Record<string, "accent" | "success" | "warning" | "danger" | "default"> = {
  LIVE: "success",
  "APP STORE": "success",
  PRIVATE: "danger",
};

export function CaseStudyCard({ study }: { study: CaseStudyCardData }) {
  const externalUrl = study.liveUrl ?? study.productUrl;
  return (
    <MagneticCard className="h-full">
      <div data-proj={study.slug} className="flex h-full flex-col rounded-lg">
        {/* Cover: slow Ken-Burns drift (scale 1 to 1.04) across the card's
            scroll range. Applies to real cover images when the owner
            supplies them; until then the terminal motif is the cover. */}
        <Link
          href={`/projects/${study.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block h-36 overflow-hidden border-b border-border bg-bg-subtle"
        >
          <ScrollLinked scale={[1, 1.04]} className="absolute inset-0">
            <GridBackground className="opacity-50" />
            <p className="absolute bottom-3 left-4 font-mono text-lg text-fg-subtle">
              ~/shipped/<span className="text-accent">{study.slug}</span>
            </p>
          </ScrollLinked>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-lg font-semibold text-fg">
              <Link href={`/projects/${study.slug}`} className="hover:text-accent">
                {study.title}
              </Link>
            </h3>
            {study.badges.map((b) => (
              <Tag key={b} tone={BADGE_TONES[b] ?? "default"}>
                {b}
              </Tag>
            ))}
          </div>
          <p className="text-sm text-fg-muted">{study.tagline}</p>
          <p className="font-mono text-xs text-fg-subtle">{study.role}</p>
          <div className="flex flex-wrap gap-1.5">
            {study.stack.slice(0, 6).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap gap-4 pt-2 font-mono text-xs">
            <Link
              href={`/projects/${study.slug}`}
              className="touch-target flex items-center gap-1 text-accent underline-offset-4 hover:underline"
            >
              read the case study <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target flex items-center gap-1 text-accent underline-offset-4 hover:underline"
              >
                {externalUrl.replace("https://", "")} <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : null}
            {study.repoUrl ? (
              <a
                href={study.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target flex items-center gap-1 text-accent underline-offset-4 hover:underline"
              >
                repo <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </MagneticCard>
  );
}
