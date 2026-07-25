import type { Metadata } from "next";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every repository on the account plus four flagship case studies: StayFit (iOS), the StayFit website, WebMARS, and a Java futures trading engine.",
};

export default function ProjectsPage() {
  return (
    <main>
      <ProjectsSection showFilters archiveDefaultOpen headingAs="h1" />
    </main>
  );
}
