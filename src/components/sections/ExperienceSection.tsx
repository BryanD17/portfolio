import { format, parse } from "date-fns";
import { getEducation, getExperience } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { ExperienceTimeline } from "@/components/interactive/ExperienceTimeline";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

function fmtMonth(value: string): string {
  return format(parse(value, "yyyy-MM", new Date()), "MMM yyyy");
}

/**
 * Career timeline (three discrete DPI roles, exact LinkedIn dates; no merged
 * span anywhere) and education (SDSU exactly once).
 */
export function ExperienceSection() {
  const experience = getExperience();
  const education = getEducation();

  return (
    <section id="experience" aria-label="Experience and education" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-8">
        <SectionHeader
          index="02"
          label="experience"
          title="Where the work happened"
          description="Three separate selections into the same competitive program, each with its own dates. The spine draws as you scroll."
        />

        {experience.map((group) => (
          <ExperienceTimeline
            key={group.organization}
            organization={group.organization}
            program={group.program}
            location={group.location}
            combinedSummary={group.combinedSummary}
            roles={group.roles}
          />
        ))}

        <div className="flex flex-col gap-6">
          <h3 className="font-mono text-xl font-semibold text-fg">Education</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((school, i) => (
              <RevealOnScroll key={school.school} delay={i * 0.09}>
                <div className="flex h-full flex-col gap-2 rounded-lg border border-border bg-bg-elevated p-5">
                  <h4 className="font-mono text-base font-semibold text-fg">{school.school}</h4>
                  <p className="text-sm text-fg-muted">
                    {school.credential}
                    {school.detail ? ` · ${school.detail}` : ""}
                  </p>
                  <p className="font-mono text-xs text-fg-subtle">
                    {school.location} ·{" "}
                    {school.endLabel ?? `${fmtMonth(school.startDate)} - ${school.endDate ? fmtMonth(school.endDate) : "Present"}`}
                  </p>
                  {school.coursework.length > 0 ? (
                    <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Coursework">
                      {school.coursework.map((course) => (
                        <li key={course}>
                          <Tag>{course}</Tag>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
