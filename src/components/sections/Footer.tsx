import { getProfile } from "@/content";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

export function Footer() {
  const profile = getProfile();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-fg-muted">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-fg">
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/BryanD17/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            Source on GitHub
          </a>
        </div>
        <p className="font-mono text-xs text-fg-subtle">
          {profile.footerLine} Last updated {BUILD_DATE}.
        </p>
      </div>
    </footer>
  );
}
