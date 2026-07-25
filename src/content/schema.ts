import { z } from "zod";

export const MetricSchema = z
  .object({
    /** Numeric target for the count-up. Omit for non-numeric metrics. */
    value: z.number().optional(),
    /** Non-numeric display (e.g. "Java 21"); mutually exclusive with value. */
    text: z.string().optional(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    decimals: z.number().int().min(0).max(3).optional(),
    label: z.string().min(1),
  })
  .refine((m) => (m.value !== undefined) !== (m.text !== undefined), {
    message: "a metric needs exactly one of value or text",
  });

export const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
});

export const GalleryImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(5),
  caption: z.string().optional(),
});

export const RepoVisibilitySchema = z.enum(["public", "private", "org"]);
export const TierSchema = z.enum(["case-study", "featured", "archive", "hidden"]);

export const CaseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  tagline: z.string().min(1),
  role: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  status: z.string().min(1),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  repoVisibility: RepoVisibilitySchema,
  /** Empty when the CONTENT BLOCK defines none (the wall is then omitted). */
  metrics: z.array(MetricSchema).max(4),
  outcomes: z.array(z.string().min(1)).min(1),
  whatIdDoDifferently: z.string().optional(),
  links: z.array(LinkSchema),
  coverImage: z.string().optional(),
  gallery: z.array(GalleryImageSchema).default([]),
  attributionNote: z.string().optional(),
  order: z.number().int().positive(),
});
export type CaseStudyFrontmatter = z.infer<typeof CaseStudySchema>;

export const ProfileSchema = z.object({
  fullName: z.string(),
  shortName: z.string(),
  location: z.string(),
  email: z.string().email(),
  linkedin: z.string().url(),
  github: z.string().url(),
  githubUsername: z.string(),
  openToWork: z.string(),
  headline: z.string(),
  subHeadline: z.string(),
  metaDescription: z.string().max(155),
  about: z.string(),
  shortBio: z.string(),
  heroBootLines: z.array(z.object({ command: z.string(), output: z.array(z.string()) })),
  heroStats: z.array(MetricSchema).length(4),
  ctas: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      variant: z.enum(["primary", "secondary"]),
    })
  ),
  contactHeading: z.string(),
  contactBody: z.string(),
  footerLine: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const PositionSchema = z.object({
  organization: z.string(),
  program: z.string().optional(),
  title: z.string(),
  location: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  /** null renders "Present". */
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  description: z.string(),
  skills: z.array(z.string()),
});
export type Position = z.infer<typeof PositionSchema>;

export const ExperienceGroupSchema = z.object({
  organization: z.string(),
  program: z.string().optional(),
  location: z.string(),
  combinedSummary: z.string(),
  roles: z.array(PositionSchema).min(1),
});
export type ExperienceGroup = z.infer<typeof ExperienceGroupSchema>;

export const EducationSchema = z.object({
  school: z.string(),
  location: z.string(),
  credential: z.string(),
  detail: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  endLabel: z.string().optional(),
  coursework: z.array(z.string()).default([]),
});
export type Education = z.infer<typeof EducationSchema>;

export const AwardSchema = z.object({
  title: z.string(),
  detail: z.string().optional(),
  year: z.number().int(),
});
export type Award = z.infer<typeof AwardSchema>;

export const MembershipSchema = z.object({
  organization: z.string(),
  abbreviation: z.string().optional(),
  chapter: z.string().optional(),
  since: z.string(),
});
export type Membership = z.infer<typeof MembershipSchema>;

export const LanguageSchema = z.object({
  language: z.string(),
  level: z.string(),
});
export type Language = z.infer<typeof LanguageSchema>;

export const SkillSchema = z.object({
  name: z.string(),
  top: z.boolean().default(false),
  /** Case-study slugs and role identifiers that demonstrate this skill. */
  evidence: z.array(z.string()).default([]),
});
export type Skill = z.infer<typeof SkillSchema>;

export const SkillGroupSchema = z.object({
  group: z.string(),
  skills: z.array(SkillSchema).min(1),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const ProjectOverrideSchema = z.object({
  /** GitHub repo name, exact. */
  name: z.string(),
  tier: TierSchema,
  /** Replaces the GitHub description when set. Never invented. */
  description: z.string().optional(),
  roleNote: z.string().optional(),
  badges: z
    .array(z.enum(["FORK", "TEAM PROJECT", "LIVE", "APP STORE", "PRIVATE", "EARLY WORK"]))
    .default([]),
  /** Product link for private repos; cards must never link to a private repo URL. */
  linkTo: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  hiddenReason: z.string().optional(),
  /** Ties a repo card to its case study page. */
  caseStudySlug: z.string().optional(),
});
export type ProjectOverride = z.infer<typeof ProjectOverrideSchema>;

export const PrivateRepoEntrySchema = z.object({
  name: z.string(),
  /**
   * Where the card links instead of the repo (App Store, live site). When
   * absent the card links only to its case study; never to the repo URL.
   */
  linkTo: z.string().url().optional(),
});
export type PrivateRepoEntry = z.infer<typeof PrivateRepoEntrySchema>;
