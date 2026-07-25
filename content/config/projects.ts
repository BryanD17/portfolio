import type { ProjectOverride } from "@/content/schema";

/**
 * Tier and badge assignments from the CONTENT BLOCK. Descriptions here only
 * override GitHub where the CONTENT BLOCK supplies copy; a repo with neither
 * renders the literal "No description yet", never invented text.
 */
export const projectOverrides: ProjectOverride[] = [
  /* case studies: the four flagships */
  {
    name: "StayFit---Healthy-lifestyle-",
    tier: "case-study",
    badges: ["APP STORE", "PRIVATE"],
    linkTo: "https://apps.apple.com/app/stayfit-ai-health-fitness/id6779075884",
    caseStudySlug: "stayfit",
  },
  {
    name: "stayfit-website",
    tier: "case-study",
    badges: ["LIVE", "PRIVATE"],
    linkTo: "https://getstayfitapp.com",
    liveUrl: "https://getstayfitapp.com",
    caseStudySlug: "stayfit-website",
  },
  {
    name: "WebMARS",
    tier: "case-study",
    description: "A complete MIPS32 toolchain that runs entirely in your browser.",
    badges: ["LIVE"],
    liveUrl: "https://webmarsimulator.com",
    caseStudySlug: "webmars",
  },
  {
    name: "Futures-Trading-Algorithm",
    tier: "case-study",
    badges: ["PRIVATE"],
    linkTo: "https://github.com/BryanD17/futures-engine-architecture",
    caseStudySlug: "futures-engine",
  },

  /* featured */
  {
    name: "SDSUMaps",
    tier: "featured",
    description: "A campus mapping application for San Diego State, built with a four-person team.",
    roleNote: "Team contributor",
    badges: ["FORK", "TEAM PROJECT"],
  },
  {
    name: "webmars-api",
    tier: "featured",
    description: "The API component of WebMARS.",
    badges: ["FORK"],
    liveUrl: "https://webmarsimulator.com",
  },
  {
    // Renamed from hateSpeechDetector.py in Agent 14 (a repo is not a file).
    name: "hate-speech-detector",
    tier: "featured",
    description: "A classifier that flags hate speech in input text.",
    badges: ["EARLY WORK"],
  },

  /* archive */
  {
    name: "Ai-reservation-bot",
    tier: "archive",
    // No description yet; Agent 14 inspects the contents and reports back.
    badges: [],
  },
  {
    name: "Stock-Market-Predictor",
    tier: "archive",
    badges: ["EARLY WORK"],
  },
  {
    name: "NLP-Project",
    tier: "archive",
    badges: ["EARLY WORK"],
  },

  /* hidden */
  {
    name: "futures-engine-architecture",
    tier: "hidden",
    badges: [],
    hiddenReason:
      "Companion write-up for the futures case study; linked from that card rather than listed as its own project.",
  },
  {
    name: "BryanD17",
    tier: "hidden",
    badges: [],
    hiddenReason: "Profile README repository, not a project.",
  },
  {
    name: "portfolio",
    tier: "hidden",
    badges: [],
    hiddenReason: "This site itself; linked from the footer, not listed as a project.",
  },
  {
    name: "Basic-Guessing-Game",
    tier: "hidden",
    badges: [],
    hiddenReason:
      "First-program repo from 2020 (20-line guessing game); cleaned up in Agent 14 (file renamed to .py, README added) but not portfolio material.",
  },
  {
    name: "Bryan-Portfolio",
    tier: "hidden",
    badges: [],
    hiddenReason: "Legacy 2023 site superseded by this portfolio; archived in Agent 14.",
  },
];
