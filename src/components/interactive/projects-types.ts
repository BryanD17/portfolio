/** Serializable card data passed from the server section to client components. */
export interface CardProject {
  name: string;
  tier: "case-study" | "featured" | "archive";
  description: string;
  roleNote?: string;
  badges: string[];
  language: string | null;
  languageColor: string | null;
  stars: number;
  pushedAt: string;
  pushedRelative: string;
  createdAt: string;
  fork: boolean;
  /** Public repos only; private repos never carry a repo URL. */
  repoUrl?: string;
  liveUrl?: string;
  caseStudySlug?: string;
}

export interface CaseStudyCardData {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  status: string;
  badges: string[];
  liveUrl?: string;
  /** Only for public/org repos. */
  repoUrl?: string;
  productUrl?: string;
  stack: string[];
  order: number;
}
