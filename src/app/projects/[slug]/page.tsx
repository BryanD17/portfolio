import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCaseStudies, getCaseStudy, getProjectOverrides } from "@/content";
import { Tag } from "@/components/ui/Tag";
import { SplitText } from "@/components/motion/SplitText";
import { MetricWall } from "@/components/case-study/MetricWall";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { SectionReveal } from "@/components/case-study/SectionReveal";
import { CaseStudyToc } from "@/components/case-study/CaseStudyToc";
import { CaseStudyGallery } from "@/components/case-study/CaseStudyGallery";
import { Callout, StackList, mdxComponents, slugify } from "@/components/case-study/mdx-components";

export function generateStaticParams() {
  return getCaseStudies().map((s) => ({ slug: s.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const og = `/og?slug=${study.frontmatter.slug}`;
  return {
    title: study.frontmatter.title,
    description: study.frontmatter.tagline,
    alternates: { canonical: `/projects/${study.frontmatter.slug}` },
    openGraph: {
      type: "article",
      title: study.frontmatter.title,
      description: study.frontmatter.tagline,
      images: [{ url: og, width: 1200, height: 630, alt: study.frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: study.frontmatter.title,
      description: study.frontmatter.tagline,
      images: [og],
    },
  };
}

/** SoftwareApplication JSON-LD for the shipped products. */
const APP_JSONLD: Record<string, { category: string; os?: string; url: string }> = {
  stayfit: { category: "HealthApplication", os: "iOS", url: "https://getstayfitapp.com" },
  "stayfit-website": { category: "WebApplication", url: "https://getstayfitapp.com" },
  webmars: { category: "DeveloperApplication", url: "https://webmarsimulator.com" },
};

/** Split the MDX body on ## headings so each section gets its own reveal. */
function splitSections(body: string): { heading: string; content: string }[] {
  const parts = body.split(/^## /m).filter((p) => p.trim().length > 0);
  return parts.map((part) => {
    const newline = part.indexOf("\n");
    return { heading: part.slice(0, newline).trim(), content: part.slice(newline + 1) };
  });
}

const BADGE_TONES: Record<string, "accent" | "success" | "warning" | "danger" | "default"> = {
  LIVE: "success",
  "APP STORE": "success",
  PRIVATE: "danger",
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { frontmatter: fm, body } = study;
  const sections = splitSections(body);
  const overrides = getProjectOverrides();
  const override = overrides.find((o) => o.caseStudySlug === fm.slug);
  const badges = override?.badges ?? [];

  const all = getCaseStudies();
  const index = all.findIndex((s) => s.frontmatter.slug === fm.slug);
  const prev = all[(index - 1 + all.length) % all.length]!;
  const next = all[(index + 1) % all.length]!;

  const tocEntries = [
    { id: "at-a-glance", label: "At a glance" },
    ...(fm.metrics.length > 0 ? [{ id: "metrics", label: "Metrics" }] : []),
    ...sections.map((s) => ({ id: slugify(s.heading), label: s.heading })),
    { id: "outcomes", label: "Outcomes" },
    ...(fm.whatIdDoDifferently ? [{ id: "what-id-do-differently", label: "What I'd do differently" }] : []),
    ...(fm.gallery.length > 0 ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(fm.links.length > 0 ? [{ id: "links", label: "Links" }] : []),
  ];

  const appMeta = APP_JSONLD[fm.slug];

  return (
    <main className="relative">
      {appMeta ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: fm.title,
              description: fm.tagline,
              applicationCategory: appMeta.category,
              ...(appMeta.os ? { operatingSystem: appMeta.os } : {}),
              url: appMeta.url,
              author: { "@type": "Person", name: "Bryan Djenabia Joseph" },
            }),
          }}
        />
      ) : null}
      <ReadingProgress />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-8">
        <Link
          href="/projects"
          className="flex w-fit items-center gap-1 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3" aria-hidden="true" /> back to all projects
        </Link>

        {/* HEADER: per-line split reveal. */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((b) => (
              <Tag key={b} tone={BADGE_TONES[b] ?? "default"}>
                {b}
              </Tag>
            ))}
            <span className="font-mono text-xs text-fg-subtle">{fm.status}</span>
          </div>
          <SplitText
            text={fm.title}
            per="line"
            as="h1"
            className="max-w-4xl font-mono text-3xl font-semibold text-fg sm:text-4xl lg:text-5xl"
          />
          <p className="max-w-2xl text-lg text-fg-muted">{fm.tagline}</p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <div className="order-2 lg:order-1">
            <CaseStudyToc entries={tocEntries} />
          </div>

          <article className="order-1 flex max-w-3xl flex-col gap-12 lg:order-2">
            {/* AT A GLANCE */}
            <section id="at-a-glance" aria-label="At a glance" className="scroll-mt-24 flex flex-col gap-4 rounded-lg border border-border bg-bg-elevated p-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-fg-subtle">Role</dt>
                  <dd className="text-sm text-fg">{fm.role}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-fg-subtle">Status</dt>
                  <dd className="text-sm text-fg">{fm.status}</dd>
                </div>
              </dl>
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-fg-subtle">Stack</p>
                <StackList items={fm.stack} />
              </div>
              {fm.attributionNote ? <Callout>{fm.attributionNote}</Callout> : null}
            </section>

            {/* METRIC WALL */}
            {fm.metrics.length > 0 ? (
              <section id="metrics" aria-label="Metrics" className="scroll-mt-24">
                <MetricWall metrics={fm.metrics} />
              </section>
            ) : null}

            {/* BODY SECTIONS */}
            {sections.map((section) => (
              <SectionReveal key={section.heading}>
                <section className="flex flex-col gap-4">
                  <h2 id={slugify(section.heading)} className="scroll-mt-24 font-mono text-2xl font-semibold text-fg">
                    {section.heading}
                  </h2>
                  <div className="flex flex-col gap-4">
                    <MDXRemote source={section.content} components={mdxComponents} />
                  </div>
                </section>
              </SectionReveal>
            ))}

            {/* OUTCOMES */}
            <SectionReveal>
              <section id="outcomes" aria-label="Outcomes" className="scroll-mt-24 flex flex-col gap-4">
                <h2 className="font-mono text-2xl font-semibold text-fg">Outcomes</h2>
                <ul className="flex flex-col gap-2">
                  {fm.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-base text-fg-muted">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-sm bg-accent" />
                      {o}
                    </li>
                  ))}
                </ul>
              </section>
            </SectionReveal>

            {/* WHAT I'D DO DIFFERENTLY: omitted entirely while owner input is pending. */}
            {fm.whatIdDoDifferently ? (
              <SectionReveal>
                <section id="what-id-do-differently" className="scroll-mt-24 flex flex-col gap-4">
                  <h2 className="font-mono text-2xl font-semibold text-fg">What I&apos;d do differently</h2>
                  <p className="text-base leading-relaxed text-fg-muted">{fm.whatIdDoDifferently}</p>
                </section>
              </SectionReveal>
            ) : null}

            {/* GALLERY: omitted while the owner has not supplied screenshots. */}
            {fm.gallery.length > 0 ? (
              <section id="gallery" aria-label="Gallery" className="scroll-mt-24 flex flex-col gap-4">
                <h2 className="font-mono text-2xl font-semibold text-fg">Gallery</h2>
                <CaseStudyGallery images={fm.gallery} />
              </section>
            ) : null}

            {/* LINKS */}
            {fm.links.length > 0 ? (
              <section id="links" aria-label="Links" className="scroll-mt-24 flex flex-col gap-3">
                <h2 className="font-mono text-2xl font-semibold text-fg">Links</h2>
                <ul className="flex flex-col gap-2">
                  {fm.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-fit items-center gap-1 font-mono text-sm text-accent underline-offset-4 hover:underline"
                      >
                        {link.label} <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* PREV / NEXT */}
            <nav aria-label="More case studies" className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              <Link
                href={`/projects/${prev.frontmatter.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-accent/60"
              >
                <span className="font-mono text-xs text-fg-subtle">previous</span>
                <span className="font-mono text-sm text-fg group-hover:text-accent">
                  {prev.frontmatter.title}
                </span>
              </Link>
              <Link
                href={`/projects/${next.frontmatter.slug}`}
                className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-accent/60"
              >
                <span className="font-mono text-xs text-fg-subtle">next</span>
                <span className="font-mono text-sm text-fg group-hover:text-accent">
                  {next.frontmatter.title}
                </span>
              </Link>
            </nav>
          </article>
        </div>
      </div>
    </main>
  );
}
