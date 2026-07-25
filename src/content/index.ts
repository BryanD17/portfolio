import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CaseStudySchema,
  type Award,
  type CaseStudyFrontmatter,
  type Education,
  type ExperienceGroup,
  type Language,
  type Membership,
  type PrivateRepoEntry,
  type Profile,
  type ProjectOverride,
  type SkillGroup,
} from "@/content/schema";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { awards, languages, memberships } from "@/content/awards";
import { skillGroups, topSkills } from "@/content/skills";
import { projectOverrides } from "../../content/config/projects";
import { privateRepos } from "../../content/config/private-repos";

/**
 * The ONLY content API. Pages and components read content exclusively
 * through these functions; nothing imports the underlying files directly.
 */

export function getProfile(): Profile {
  return profile;
}

export function getExperience(): ExperienceGroup[] {
  return experience;
}

export function getEducation(): Education[] {
  return education;
}

export function getAwards(): Award[] {
  return awards;
}

export function getMemberships(): Membership[] {
  return memberships;
}

export function getLanguages(): Language[] {
  return languages;
}

export function getSkills(): { groups: SkillGroup[]; topSkills: string[] } {
  return { groups: skillGroups, topSkills };
}

export function getProjectOverrides(): ProjectOverride[] {
  return projectOverrides;
}

export function getPrivateRepoAllowList(): PrivateRepoEntry[] {
  return privateRepos;
}

export interface CaseStudy {
  frontmatter: CaseStudyFrontmatter;
  body: string;
}

const CASE_STUDY_DIR = path.join(process.cwd(), "content", "case-studies");

export function getCaseStudies(): CaseStudy[] {
  const files = fs.readdirSync(CASE_STUDY_DIR).filter((f) => f.endsWith(".mdx"));
  const studies = files.map((file) => {
    const raw = fs.readFileSync(path.join(CASE_STUDY_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const frontmatter = CaseStudySchema.parse(data);
    return { frontmatter, body: content };
  });
  return studies.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((s) => s.frontmatter.slug === slug);
}
