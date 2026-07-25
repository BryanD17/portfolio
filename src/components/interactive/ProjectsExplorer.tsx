"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SPRING_SOFT, STAGGER, cappedStagger, DURATION, EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/interactive/ProjectCard";
import { CaseStudyCard } from "@/components/interactive/CaseStudyCard";
import type { CardProject, CaseStudyCardData } from "@/components/interactive/projects-types";

interface ProjectsExplorerProps {
  caseStudies: CaseStudyCardData[];
  projects: CardProject[];
  snapshotNote: boolean;
  /** Full explorer with filters (/projects) vs compact home section. */
  showFilters: boolean;
  archiveDefaultOpen: boolean;
}

type SortKey = "updated" | "stars" | "oldest" | "az";

export function ProjectsExplorer({
  caseStudies,
  projects,
  snapshotNote,
  showFilters,
  archiveDefaultOpen,
}: ProjectsExplorerProps) {
  const { reduced } = useReducedMotionSafe();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [archiveOpen, setArchiveOpen] = useState(archiveDefaultOpen);

  const q = searchParams.get("q") ?? "";
  const lang = searchParams.get("lang") ?? "all";
  const origin = searchParams.get("origin") ?? "all";
  const sort = (searchParams.get("sort") as SortKey) ?? "updated";

  const setParam = useCallback(
    (key: string, value: string, defaultValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === defaultValue) params.delete(key);
      else params.set(key, value);
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const languages = useMemo(
    () => [...new Set(projects.map((p) => p.language).filter((l): l is string => !!l))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const match = (p: CardProject) => {
      if (lang !== "all" && p.language !== lang) return false;
      if (origin === "original" && p.fork) return false;
      if (origin === "fork" && !p.fork) return false;
      if (needle) {
        const hay = `${p.name} ${p.description} ${p.language ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    };
    const sorted = [...projects].sort((a, b) => {
      switch (sort) {
        case "stars":
          return b.stars - a.stars;
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "az":
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
      }
    });
    return sorted.filter(match);
  }, [projects, q, lang, origin, sort]);

  const featured = filtered.filter((p) => p.tier === "featured");
  const archive = filtered.filter((p) => p.tier === "archive");
  const anyFilterActive = q !== "" || lang !== "all" || origin !== "all";

  // The text search also narrows the case-study band (name, tagline, stack),
  // so skill chips linking to /projects?q=Swift surface the right flagship.
  const needle = q.trim().toLowerCase();
  const visibleCaseStudies = needle
    ? caseStudies.filter((s) =>
        `${s.title} ${s.tagline} ${s.slug} ${s.stack.join(" ")}`.toLowerCase().includes(needle)
      )
    : caseStudies;

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const cardMotion = reduced
    ? {}
    : {
        layout: true as const,
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: SPRING_SOFT,
      };

  return (
    <div className="flex flex-col gap-12">
      {snapshotNote ? (
        <p className="rounded-md border border-warning/40 bg-warning/10 px-4 py-2 font-mono text-xs text-warning">
          GitHub was unreachable at render time; stats may be up to an hour old.
        </p>
      ) : null}

      {/* CASE STUDIES: the four flagships, content order. */}
      <div className="flex flex-col gap-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">
          case studies
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          {visibleCaseStudies.map((study, i) => (
            <RevealOnScroll key={study.slug} delay={reduced ? 0 : i * STAGGER.loose}>
              <CaseStudyCard study={study} />
            </RevealOnScroll>
          ))}
          {visibleCaseStudies.length === 0 ? (
            <p className="font-mono text-sm text-fg-muted">No case studies match this search.</p>
          ) : null}
        </div>
      </div>

      {showFilters ? (
        <div className="flex flex-col gap-3" role="search" aria-label="Filter projects">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setParam("q", e.target.value, "")}
              placeholder="search repositories"
              aria-label="Search repositories"
              className="h-9 w-56 font-mono text-sm"
            />
            <label className="flex items-center gap-2 font-mono text-xs text-fg-muted">
              language
              <select
                value={lang}
                onChange={(e) => setParam("lang", e.target.value, "all")}
                className="h-9 rounded-md border border-border bg-bg-elevated px-2 font-mono text-xs text-fg"
              >
                <option value="all">all</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 font-mono text-xs text-fg-muted">
              origin
              <select
                value={origin}
                onChange={(e) => setParam("origin", e.target.value, "all")}
                className="h-9 rounded-md border border-border bg-bg-elevated px-2 font-mono text-xs text-fg"
              >
                <option value="all">all</option>
                <option value="original">original</option>
                <option value="fork">fork</option>
              </select>
            </label>
            <label className="flex items-center gap-2 font-mono text-xs text-fg-muted">
              sort
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value, "updated")}
                className="h-9 rounded-md border border-border bg-bg-elevated px-2 font-mono text-xs text-fg"
              >
                <option value="updated">recently updated</option>
                <option value="stars">most starred</option>
                <option value="oldest">oldest</option>
                <option value="az">A to Z</option>
              </select>
            </label>
            {anyFilterActive ? (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="font-mono text-xs">
                clear filters
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* FEATURED */}
      <div className="flex flex-col gap-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">featured</h3>
        {featured.length === 0 ? (
          <EmptyState onClear={clearFilters} show={anyFilterActive} />
        ) : (
          <motion.div layout={!reduced} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {featured.map((p, i) => (
                <motion.div key={p.name} data-reveal {...cardMotion}>
                  <RevealOnScroll delay={reduced ? 0 : i * cappedStagger(featured.length, STAGGER.loose)}>
                    <ProjectCard project={p} />
                  </RevealOnScroll>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* THE ARCHIVE */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setArchiveOpen((v) => !v)}
          aria-expanded={archiveOpen}
          className="flex w-fit items-center gap-2 font-mono text-sm uppercase tracking-widest text-fg-subtle transition-colors hover:text-fg"
        >
          the archive
          <span className="text-xs normal-case tracking-normal text-fg-subtle">
            {archiveOpen ? "hide" : `show all ${archive.length} repositories`}
          </span>
        </button>
        {archiveOpen ? (
          archive.length === 0 ? (
            <EmptyState onClear={clearFilters} show={anyFilterActive} />
          ) : (
            <motion.ul layout={!reduced} className="flex flex-col divide-y divide-border rounded-lg border border-border">
              <AnimatePresence mode="popLayout">
                {archive.map((p) => (
                  <motion.li key={p.name} data-reveal {...cardMotion} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                    <span className="font-mono text-sm text-fg">{p.name}</span>
                    <span className="flex-1 truncate text-xs text-fg-muted">{p.description}</span>
                    {p.language ? (
                      <span className="flex items-center gap-1.5 font-mono text-xs text-fg-subtle">
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-sm"
                          style={{ background: p.languageColor ?? "var(--fg-subtle)" }}
                        />
                        {p.language}
                      </span>
                    ) : null}
                    <span className="font-mono text-xs text-fg-subtle">pushed {p.pushedRelative}</span>
                    {p.repoUrl ? (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent underline-offset-4 hover:underline"
                      >
                        repo
                      </a>
                    ) : null}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ onClear, show }: { onClear: () => void; show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
      className="flex flex-col items-start gap-3 rounded-lg border border-border bg-bg-elevated p-6"
    >
      <p className="font-mono text-sm text-fg-muted">No repositories match these filters.</p>
      {show ? (
        <Button variant="outline" size="sm" onClick={onClear} className="font-mono text-xs">
          clear filters
        </Button>
      ) : null}
    </motion.div>
  );
}
