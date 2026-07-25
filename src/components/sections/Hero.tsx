import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/content";
import { getAllProjects } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/GridBackground";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { ScrollLinked } from "@/components/motion/ScrollLinked";
import { HeroBoot } from "@/components/sections/HeroBoot";

/**
 * Server component: reads content and live GitHub data, composes the five
 * motion layers from THE MOTION SPEC on top.
 */
export async function Hero() {
  const profile = getProfile();
  const sync = await getAllProjects();

  const publicRepos = sync.projects.filter((p) => !p.private && p.owner === profile.githubUsername);
  const languages = [...new Set(publicRepos.map((p) => p.primaryLanguage?.name).filter(Boolean))].slice(0, 3);
  const mostRecent = sync.lastPushedAt;

  return (
    <section aria-label="Introduction" className="relative overflow-hidden">
      {/* Layer 0: ambient depth. Desktop only, off under reduced motion. */}
      <AmbientBackdrop />
      <GridBackground />

      <ScrollLinked offset={["start start", "end start"]} y={[0, 120]} opacity={[1, 0.35]}>
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-20 pt-14 sm:px-8 lg:grid-cols-[1fr_280px] lg:gap-16 lg:pt-20">
          <div className="flex flex-col gap-8">
            {/* Open-to-work: color is never the only signal; the text is the label. */}
            <p className="flex items-center gap-2 font-mono text-xs text-success">
              <span aria-hidden="true" className="size-2 rounded-sm bg-success" />
              {profile.openToWork}
            </p>

            {/* Layers 1 to 3: boot, headline, count-up metrics. */}
            <HeroBoot
              bootLines={profile.heroBootLines}
              headline={profile.headline}
              stats={profile.heroStats}
              resumeAvailable={fs.existsSync(
                path.join(process.cwd(), "public", "Bryan-Joseph-Resume.pdf")
              )}
            />

            <p className="max-w-2xl text-base text-fg-muted">{profile.subHeadline}</p>

            {/* Live GitHub line. Honest about snapshot staleness. */}
            <p className="font-mono text-xs text-fg-subtle">
              github: {sync.publicRepoCount} public repos · {languages.join(" · ")}
              {mostRecent ? ` · last push ${new Date(mostRecent).toISOString().slice(0, 10)}` : ""}
              {sync.source === "snapshot" ? " · stats may be up to an hour old" : ""}
            </p>

            {/* CTAs: exactly two visually primary. */}
            <div className="flex flex-wrap gap-3">
              {profile.ctas.map((cta) =>
                cta.href.endsWith(".pdf") ? null : (
                  <Button
                    key={cta.label}
                    asChild
                    variant={cta.variant === "primary" ? "default" : "outline"}
                  >
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Layer 4: headshot with subtle parallax, max 16px travel. */}
          <ParallaxLayer travel={16} className="hidden lg:block">
            <div className="overflow-hidden rounded-lg border border-border">
              {/* No priority: the measured LCP element is the H1, and the
                  image is display:none below lg, where a priority preload
                  would tax the critical chain for nothing. */}
              <Image
                src="/bryan-joseph@2x.webp"
                alt="Bryan Joseph"
                width={800}
                height={800}
                sizes="280px"
                className="h-auto w-full"
              />
            </div>
          </ParallaxLayer>
        </div>
      </ScrollLinked>
    </section>
  );
}
