import { getAwards, getLanguages, getMemberships } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

/**
 * Supporting motion only (staggered fade-and-rise); this section backs the
 * projects up, it does not compete with them. No signature moment.
 */
export function AwardsSection() {
  const awards = getAwards();
  const memberships = getMemberships();
  const languages = getLanguages();

  return (
    <section aria-label="Awards, leadership and languages" className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8">
        <SectionHeader
          index="04"
          label="recognition"
          title="Awards, leadership & languages"
        />
        <div className="grid gap-8 md:grid-cols-3">
          <RevealOnScroll delay={0}>
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">awards</h3>
              <ul className="flex flex-col gap-3">
                {awards.map((award) => (
                  <li key={award.title} className="flex flex-col">
                    <span className="text-sm font-medium text-fg">{award.title}</span>
                    <span className="font-mono text-xs text-fg-subtle">
                      {award.detail ? `${award.detail} · ` : ""}
                      {award.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.06}>
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">
                memberships
              </h3>
              <ul className="flex flex-col gap-3">
                {memberships.map((m) => (
                  <li key={m.organization} className="flex flex-col">
                    <span className="text-sm font-medium text-fg">
                      {m.organization}
                      {m.abbreviation ? ` (${m.abbreviation})` : ""}
                    </span>
                    <span className="font-mono text-xs text-fg-subtle">
                      {m.chapter ? `${m.chapter} · ` : ""}
                      {m.since}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-sm uppercase tracking-widest text-fg-subtle">
                languages
              </h3>
              <ul className="flex flex-col gap-3">
                {languages.map((l) => (
                  <li key={l.language} className="flex flex-col">
                    <span className="text-sm font-medium text-fg">{l.language}</span>
                    <span className="font-mono text-xs text-fg-subtle">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
