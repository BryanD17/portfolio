"use client";

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { MagneticCard } from "@/components/motion/MagneticCard";
import { Tag } from "@/components/ui/Tag";
import type { CardProject } from "@/components/interactive/projects-types";

const BADGE_TONES: Record<string, "accent" | "success" | "warning" | "danger" | "default"> = {
  LIVE: "success",
  "APP STORE": "success",
  PRIVATE: "danger",
  FORK: "warning",
  "TEAM PROJECT": "accent",
  "EARLY WORK": "default",
};

export function ProjectCard({ project }: { project: CardProject }) {
  return (
    <MagneticCard className="h-full">
      <div data-proj={project.name} className="flex h-full flex-col gap-3 rounded-lg p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-mono text-base font-semibold text-fg">{project.name}</h3>
          {project.badges.map((b) => (
            <Tag key={b} tone={BADGE_TONES[b] ?? "default"}>
              {b}
            </Tag>
          ))}
        </div>

        <p className="flex-1 text-sm text-fg-muted">{project.description}</p>
        {project.roleNote ? (
          <p className="font-mono text-xs text-fg-subtle">{project.roleNote}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-fg-subtle">
          {project.language ? (
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-sm"
                style={{ background: project.languageColor ?? "var(--fg-subtle)" }}
              />
              {project.language}
            </span>
          ) : null}
          {project.stars > 0 ? (
            <span className="flex items-center gap-1">
              <Star className="size-3" aria-hidden="true" />
              {project.stars}
            </span>
          ) : null}
          <span>pushed {project.pushedRelative}</span>
        </div>

        <div className="flex flex-wrap gap-3 font-mono text-xs">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target flex items-center gap-1 text-accent underline-offset-4 hover:underline"
            >
              repo <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target flex items-center gap-1 text-accent underline-offset-4 hover:underline"
            >
              live <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : null}
          {project.caseStudySlug ? (
            <Link
              href={`/projects/${project.caseStudySlug}`}
              className="touch-target flex items-center gap-1 text-accent underline-offset-4 hover:underline"
            >
              case study <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </MagneticCard>
  );
}
