import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsSection />
      <ExperienceSection />
    </main>
  );
}
