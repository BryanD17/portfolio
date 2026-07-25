/** Serializable palette content assembled server-side. */
export interface PaletteData {
  email: string;
  github: string;
  linkedin: string;
  resumeAvailable: boolean;
  caseStudies: { slug: string; title: string }[];
  repos: { name: string; url: string }[];
  roles: { title: string; dates: string }[];
}
