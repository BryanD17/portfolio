/**
 * Build-time content validation. Runs every schema against every content
 * file and exits non-zero on any failure. Wired into prebuild and CI.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  AwardSchema,
  CaseStudySchema,
  EducationSchema,
  ExperienceGroupSchema,
  LanguageSchema,
  MembershipSchema,
  PrivateRepoEntrySchema,
  ProfileSchema,
  ProjectOverrideSchema,
  SkillGroupSchema,
} from "../src/content/schema";
import { profile } from "../src/content/profile";
import { experience } from "../src/content/experience";
import { education } from "../src/content/education";
import { awards, languages, memberships } from "../src/content/awards";
import { skillGroups } from "../src/content/skills";
import { projectOverrides } from "../content/config/projects";
import { privateRepos } from "../content/config/private-repos";

let failures = 0;

function check(label: string, fn: () => void) {
  try {
    fn();
    console.log(`ok    ${label}`);
  } catch (err) {
    failures += 1;
    console.error(`FAIL  ${label}`);
    console.error(err instanceof Error ? err.message : err);
  }
}

check("profile", () => ProfileSchema.parse(profile));
check("experience", () => experience.forEach((g) => ExperienceGroupSchema.parse(g)));
check("education", () => education.forEach((e) => EducationSchema.parse(e)));
check("awards", () => awards.forEach((a) => AwardSchema.parse(a)));
check("memberships", () => memberships.forEach((m) => MembershipSchema.parse(m)));
check("languages", () => languages.forEach((l) => LanguageSchema.parse(l)));
check("skills", () => skillGroups.forEach((s) => SkillGroupSchema.parse(s)));
check("project overrides", () => projectOverrides.forEach((p) => ProjectOverrideSchema.parse(p)));
check("private repo allow-list", () => privateRepos.forEach((p) => PrivateRepoEntrySchema.parse(p)));

check("private allow-list is exactly the three known repos", () => {
  const names = privateRepos.map((p) => p.name).sort();
  const expected = ["Futures-Trading-Algorithm", "StayFit---Healthy-lifestyle-", "stayfit-website"];
  if (JSON.stringify(names) !== JSON.stringify(expected)) {
    throw new Error(`allow-list drift: ${names.join(", ")}`);
  }
});

const caseStudyDir = path.join(process.cwd(), "content", "case-studies");
const mdxFiles = fs.readdirSync(caseStudyDir).filter((f) => f.endsWith(".mdx"));
check("four case studies exist", () => {
  if (mdxFiles.length !== 4) throw new Error(`expected 4 case studies, found ${mdxFiles.length}`);
});
for (const file of mdxFiles) {
  check(`case study ${file}`, () => {
    const raw = fs.readFileSync(path.join(caseStudyDir, file), "utf8");
    const { data, content } = matter(raw);
    CaseStudySchema.parse(data);
    if (content.trim().length < 100) throw new Error("body suspiciously short");
    if (data.repoVisibility === "private" && data.repoUrl) {
      throw new Error("private case study must not carry a repoUrl");
    }
  });
}

/* Hard site rules, enforced at build time. */
const scanTargets: string[] = [];
function collect(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (/\.(ts|tsx|mdx|md|css|json)$/.test(entry.name)) scanTargets.push(full);
  }
}
collect(path.join(process.cwd(), "src"));
collect(path.join(process.cwd(), "content"));

check("no phone number anywhere (RULE 11)", () => {
  for (const file of scanTargets) {
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("655-8730") || text.includes("7736558730")) {
      throw new Error(`phone number found in ${file}`);
    }
  }
});

check("no em dashes in site content", () => {
  for (const file of scanTargets) {
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("—")) {
      throw new Error(`em dash found in ${file}`);
    }
  }
});

if (failures > 0) {
  console.error(`\n${failures} validation failure(s)`);
  process.exit(1);
}
console.log("\ncontent validation passed");
