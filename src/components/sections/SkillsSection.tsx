import { getSkills } from "@/content";
import { getPublicLanguageBytes, languageColor } from "@/lib/github";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LanguageBar } from "@/components/interactive/LanguageBar";
import { SkillChips } from "@/components/interactive/SkillChips";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

export async function SkillsSection() {
  const { groups, topSkills } = getSkills();
  const bytes = await getPublicLanguageBytes();

  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  const segments = Object.entries(bytes)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      bytes: count,
      percent: total > 0 ? (count / total) * 100 : 0,
      color: languageColor(name),
    }))
    .filter((s) => s.percent >= 0.5);

  // Top skills first, in a distinct treatment, without duplicating chips.
  const orderedGroups = groups.map((g) => ({
    ...g,
    skills: [...g.skills].sort((a, b) => Number(b.top) - Number(a.top)),
  }));

  return (
    <section id="skills" aria-label="Skills" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8">
        <SectionHeader
          index="03"
          label="skills"
          title="What the work is built with"
          description="Every chip links to the project or role that demonstrates it. No star ratings, no self-assigned percentages."
        />

        <p className="font-mono text-xs text-fg-muted">
          top skills:{" "}
          {topSkills.map((s, i) => (
            <span key={s} className="text-accent">
              {s}
              {i < topSkills.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>

        {segments.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">
              public code by language
            </h3>
            <LanguageBar segments={segments} />
            <p className="max-w-2xl font-mono text-xs text-warning">
              Public repositories only (forks excluded). StayFit&apos;s 80,000+ lines of Swift are
              in a private repo, so Swift is massively understated here.
            </p>
          </div>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2">
          {orderedGroups.map((group, i) => (
            <RevealOnScroll key={group.group} delay={i * 0.06}>
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">
                  {group.group}
                </h3>
                <SkillChips skills={group.skills} />
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Plain-text list for screen readers and ATS-style scrapers. */}
        <p className="sr-only">
          Skills:{" "}
          {groups
            .flatMap((g) => g.skills.map((s) => s.name))
            .join(", ")}
        </p>
      </div>
    </section>
  );
}
