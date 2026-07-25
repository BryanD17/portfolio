import type { SkillGroup } from "@/content/schema";

/**
 * Evidence values are case-study slugs (stayfit, stayfit-website, webmars,
 * futures-engine), repo names, or DPI role titles. Every chip on the site
 * links to the project or role that demonstrates it. NO star ratings, NO
 * proficiency percentages, ever.
 */
export const skillGroups: SkillGroup[] = [
  {
    group: "Languages",
    skills: [
      { name: "Java", top: true, evidence: ["futures-engine"] },
      {
        name: "Python",
        top: false,
        evidence: ["Student Intern", "hate-speech-detector", "Stock-Market-Predictor", "NLP-Project"],
      },
      { name: "C++", top: false, evidence: [] },
      { name: "Swift", top: true, evidence: ["stayfit", "Youth Mentor", "Summer Intern"] },
      {
        name: "TypeScript",
        top: false,
        evidence: ["webmars", "SDSUMaps", "stayfit-website"],
      },
      { name: "JavaScript", top: false, evidence: ["webmars", "stayfit-website"] },
      { name: "SQL", top: false, evidence: ["stayfit"] },
      { name: "Bash", top: false, evidence: [] },
      { name: "HTML/CSS", top: false, evidence: ["stayfit-website"] },
    ],
  },
  {
    group: "Frameworks & Libraries",
    skills: [
      { name: "SwiftUI", top: false, evidence: ["stayfit"] },
      { name: "Combine", top: false, evidence: ["stayfit"] },
      { name: "Spring Boot", top: false, evidence: ["futures-engine"] },
      { name: "React", top: false, evidence: ["webmars", "stayfit-website", "futures-engine"] },
      { name: "Next.js", top: false, evidence: ["stayfit-website"] },
      { name: "Node.js", top: false, evidence: ["stayfit-website"] },
      { name: "Tailwind CSS", top: false, evidence: ["stayfit-website"] },
      { name: "Pandas", top: false, evidence: ["Student Intern"] },
      { name: "NumPy", top: false, evidence: ["Student Intern"] },
      { name: "Matplotlib", top: false, evidence: ["Student Intern"] },
      { name: "JUnit", top: false, evidence: ["futures-engine"] },
      { name: "Vitest", top: false, evidence: ["webmars"] },
    ],
  },
  {
    group: "Systems & Infrastructure",
    skills: [
      { name: "Concurrency & multithreading", top: false, evidence: ["futures-engine"] },
      { name: "Event-driven architecture", top: false, evidence: ["futures-engine"] },
      { name: "REST APIs", top: false, evidence: ["stayfit", "futures-engine"] },
      { name: "WebSockets", top: false, evidence: ["futures-engine"] },
      { name: "Docker", top: false, evidence: [] },
      { name: "CI/CD (GitHub Actions)", top: false, evidence: ["webmars"] },
      { name: "Linux", top: false, evidence: [] },
      { name: "TCP/IP", top: false, evidence: [] },
      { name: "Caching", top: false, evidence: ["stayfit"] },
      { name: "Observability", top: false, evidence: ["futures-engine"] },
    ],
  },
  {
    group: "Data & Tools",
    skills: [
      { name: "PostgreSQL", top: false, evidence: ["stayfit"] },
      { name: "SQLite", top: false, evidence: ["stayfit"] },
      { name: "Supabase", top: false, evidence: ["stayfit"] },
      { name: "Redis", top: false, evidence: [] },
      { name: "Git", top: false, evidence: ["webmars", "SDSUMaps"] },
      { name: "Gradle", top: false, evidence: ["futures-engine"] },
      { name: "Vite", top: false, evidence: ["webmars"] },
      { name: "OpenAI APIs", top: false, evidence: ["stayfit"] },
      { name: "Stripe", top: false, evidence: ["stayfit"] },
      { name: "Monte Carlo simulation", top: false, evidence: ["futures-engine"] },
      { name: "Backtesting & statistical analysis", top: false, evidence: ["futures-engine"] },
    ],
  },
];

/** LinkedIn top skills, surfaced first with distinct treatment. */
export const topSkills = ["Swift", "Data Science", "Java"];
