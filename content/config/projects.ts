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
    linkTo: "https://getstayfitapp.com",
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
    badges: ["LIVE"],
    liveUrl: "https://webmarsimulator.com",
    caseStudySlug: "webmars",
  },
  {
    name: "Futures-Trading-Algorithm",
    tier: "case-study",
    badges: ["PRIVATE"],
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
    name: "hateSpeechDetector.py",
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
    name: "Basic-Guessing-Game",
    tier: "hidden",
    badges: [],
    hiddenReason: "Empty repository (0 KB, 2020); pending Agent 14 resolution.",
  },
  {
    name: "Bryan-Portfolio",
    tier: "hidden",
    badges: [],
    hiddenReason: "Legacy 2023 site superseded by this portfolio; archived in Agent 14.",
  },
];
