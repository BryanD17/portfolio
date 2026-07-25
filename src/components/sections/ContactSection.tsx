import fs from "node:fs";
import path from "node:path";
import { getProfile } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/interactive/ContactForm";

export function ContactSection() {
  const profile = getProfile();
  // Resume download renders only when the PDF actually exists; a download
  // button that 404s is worse than none.
  const resumeExists = fs.existsSync(path.join(process.cwd(), "public", "Bryan-Joseph-Resume.pdf"));

  return (
    <section id="contact" aria-label="Contact" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionHeader index="05" label="contact" title={profile.contactHeading} />
          <p className="max-w-xl text-base leading-relaxed text-fg-muted">{profile.contactBody}</p>
          <p className="font-mono text-sm">
            <a
              href={`mailto:${profile.email}`}
              className="text-accent underline underline-offset-4"
            >
              {profile.email}
            </a>
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-xs text-fg-muted">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
              LinkedIn
            </a>
          </div>
          {resumeExists ? (
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href="/Bryan-Joseph-Resume.pdf" download="Bryan-Joseph-Resume.pdf">
                  Download résumé
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/Bryan-Joseph-Resume.pdf" target="_blank" rel="noopener noreferrer">
                  View in browser
                </a>
              </Button>
            </div>
          ) : null}
        </div>
        <ContactForm email={profile.email} />
      </div>
    </section>
  );
}
