import type { Award, Language, Membership } from "@/content/schema";

export const awards: Award[] = [
  { title: "James Dyson Foundation Scholar", year: 2024 },
  { title: "Google Code Summit Hackathon Winner", detail: "Chicago, IL", year: 2024 },
];

export const memberships: Membership[] = [
  {
    organization: "National Society of Black Engineers",
    abbreviation: "NSBE",
    chapter: "SDSU",
    since: "Nov 2024 - Present",
  },
  {
    organization: "Association for Computing Machinery",
    abbreviation: "ACM",
    chapter: "SDSU",
    since: "Nov 2024 - Present",
  },
];

export const languages: Language[] = [
  { language: "English", level: "Native" },
  { language: "French", level: "Fluent" },
  { language: "Spanish", level: "Advanced (California Seal of Biliteracy)" },
];
