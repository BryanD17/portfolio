import { Suspense } from "react";
import { getCaseStudies, getProjectOverrides } from "@/content";
import { getAllProjects } from "@/lib/github";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectsExplorer } from "@/components/interactive/ProjectsExplorer";
import type { CardProject, CaseStudyCardData } from "@/components/interactive/projects-types";

interface ProjectsSectionProps {
  showFilters?: boolean;
  archiveDefaultOpen?: boolean;
}

/**
 * Server component: assembles serializable card data from the GitHub sync
 * and the case-study content. Case-study cards render from content even
 * when their private repos are invisible to the API (no token), so the four
 * flagships always appear.
 */
export async function ProjectsSection({
  showFilters = false,
  archiveDefaultOpen = false,
}: ProjectsSectionProps) {
  const sync = await getAllProjects();
  const overrides = getProjectOverrides();

  const caseStudies: CaseStudyCardData[] = getCaseStudies().map((s) => {
    const override = overrides.find((o) => o.caseStudySlug === s.frontmatter.slug);
    return {
      slug: s.frontmatter.slug,
      title: s.frontmatter.title,
      tagline: s.frontmatter.tagline,
      role: s.frontmatter.role,
      status: s.frontmatter.status,
      badges: override?.badges ?? [],
      liveUrl: s.frontmatter.liveUrl,
      repoUrl: s.frontmatter.repoVisibility === "private" ? undefined : s.frontmatter.repoUrl,
      productUrl: override?.linkTo,
      stack: s.frontmatter.stack,
      order: s.frontmatter.order,
    };
  });

  const projects: CardProject[] = sync.projects
    .filter((p) => p.tier !== "case-study")
    .map((p) => ({
      name: p.name,
      tier: p.tier,
      description: p.displayDescription,
      roleNote: p.roleNote,
      badges: p.badges,
      language: p.primaryLanguage?.name ?? null,
      languageColor: p.primaryLanguage?.color ?? null,
      stars: p.stargazersCount,
      pushedAt: p.pushedAt,
      pushedRelative: p.lastPushedRelative,
      createdAt: p.createdAt,
      fork: p.fork,
      repoUrl: p.showRepoLink ? p.htmlUrl : undefined,
      liveUrl: p.liveUrl,
      caseStudySlug: p.caseStudySlug,
    }));

  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8">
        <SectionHeader
          index="01"
          label="projects"
          title="The work"
          description="Every repository on the account, plus the four flagship projects the public API cannot see. Live data, revalidated hourly."
        />
        <Suspense>
          <ProjectsExplorer
            caseStudies={caseStudies}
            projects={projects}
            snapshotNote={sync.source === "snapshot"}
            showFilters={showFilters}
            archiveDefaultOpen={archiveDefaultOpen}
          />
        </Suspense>
      </div>
    </section>
  );
}
