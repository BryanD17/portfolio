import "server-only";

import fs from "node:fs";
import path from "node:path";
import { formatDistanceToNowStrict } from "date-fns";
import { getPrivateRepoAllowList, getProjectOverrides, getCaseStudies } from "@/content";
import type { ProjectOverride } from "@/content/schema";

const API = "https://api.github.com";
const USERNAME = process.env.GITHUB_USERNAME ?? "BryanD17";
const REVALIDATE_SECONDS = 3600;
const SNAPSHOT_PATH = path.join(process.cwd(), "content", "generated", "repos-snapshot.json");

/** Linguist colors for the languages that actually appear in this account. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#663399",
  Swift: "#F05138",
  Java: "#b07219",
  Shell: "#89e051",
};

export interface RepoData {
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  private: boolean;
  size: number;
  stargazersCount: number;
  language: string | null;
  pushedAt: string;
  createdAt: string;
  topics: string[];
}

export interface Project extends RepoData {
  tier: "case-study" | "featured" | "archive";
  badges: string[];
  displayDescription: string;
  roleNote?: string;
  linkTo?: string;
  liveUrl?: string;
  caseStudySlug?: string;
  isEmpty: boolean;
  ageInYears: number;
  lastPushedRelative: string;
  primaryLanguage: { name: string; color: string } | null;
  authoredCommits?: number;
  /** True when the card may render a repo link (public repos only). */
  showRepoLink: boolean;
}

export interface SyncResult {
  projects: Project[];
  hidden: { name: string; reason: string }[];
  /** "live" when fetched from the API this render, "snapshot" on fallback. */
  source: "live" | "snapshot";
  fetchedAt: string;
  rateLimitRemaining: number | null;
  /** True count of the account's public repos, before any hiding. */
  publicRepoCount: number;
  /** Most recent push across ALL fetched repos, before any hiding. */
  lastPushedAt: string | null;
}

let lastRateLimitRemaining: number | null = null;

async function ghFetch(pathname: string, withToken = true): Promise<Response | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = withToken ? process.env.GITHUB_TOKEN : undefined;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API}${pathname}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining !== null) lastRateLimitRemaining = Number(remaining);
    if (res.status === 403 || res.status === 429) {
      // Rate limited. Never throw: the caller falls back to the snapshot.
      console.warn(`[github] rate limited on ${pathname} (remaining: ${remaining})`);
      return null;
    }
    if (res.status === 401 && token) {
      // Invalid token: warn and retry once unauthenticated so public data
      // stays live instead of dropping to the snapshot.
      console.warn(`[github] invalid token rejected on ${pathname}; retrying without it`);
      return ghFetch(pathname, false);
    }
    return res;
  } catch (err) {
    console.warn(`[github] network failure on ${pathname}: ${(err as Error).message}`);
    return null;
  }
}

interface RawRepo {
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  private: boolean;
  size: number;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  created_at: string;
  topics?: string[];
}

function toRepoData(raw: RawRepo): RepoData {
  return {
    name: raw.name,
    fullName: raw.full_name,
    owner: raw.owner.login,
    description: raw.description,
    htmlUrl: raw.html_url,
    homepage: raw.homepage,
    fork: raw.fork,
    archived: raw.archived,
    private: raw.private,
    size: raw.size,
    stargazersCount: raw.stargazers_count,
    language: raw.language,
    pushedAt: raw.pushed_at,
    createdAt: raw.created_at,
    topics: raw.topics ?? [],
  };
}

/** Paginated via the Link header; never assumes a single page. */
export async function fetchPublicRepos(): Promise<RepoData[] | null> {
  const repos: RepoData[] = [];
  let url: string | null = `/users/${USERNAME}/repos?per_page=100&sort=updated`;
  while (url) {
    const res = await ghFetch(url);
    if (!res || !res.ok) return repos.length > 0 ? repos : null;
    const page = (await res.json()) as RawRepo[];
    repos.push(...page.map(toRepoData));
    const link = res.headers.get("link");
    const next = link?.split(",").find((part) => part.includes('rel="next"'));
    url = next ? new URL(next.split(";")[0]!.trim().slice(1, -1)).pathname + new URL(next.split(";")[0]!.trim().slice(1, -1)).search : null;
  }
  return repos;
}

/**
 * Fetches each allow-listed private repo INDIVIDUALLY by name. This function
 * never calls /user/repos: enumerating every private repo and filtering
 * would put the whole account one bug away from a leak. Allow-list only,
 * fail closed.
 */
export async function fetchPrivateRepos(
  allowList: { name: string }[] = getPrivateRepoAllowList()
): Promise<RepoData[]> {
  if (!process.env.GITHUB_TOKEN || allowList.length === 0) return [];
  const results: RepoData[] = [];
  for (const entry of allowList) {
    const res = await ghFetch(`/repos/${USERNAME}/${encodeURIComponent(entry.name)}`);
    if (!res || !res.ok) continue;
    results.push(toRepoData((await res.json()) as RawRepo));
  }
  return results;
}

export async function fetchOrgRepo(org: string, name: string): Promise<RepoData | null> {
  const res = await ghFetch(`/repos/${org}/${name}`);
  if (!res || !res.ok) return null;
  return toRepoData((await res.json()) as RawRepo);
}

export async function fetchRepoLanguages(fullName: string): Promise<Record<string, number> | null> {
  const res = await ghFetch(`/repos/${fullName}/languages`);
  if (!res || !res.ok) return null;
  return (await res.json()) as Record<string, number>;
}

export async function fetchAuthoredCommitCount(fullName: string): Promise<number | null> {
  const res = await ghFetch(`/repos/${fullName}/commits?author=${USERNAME}&per_page=100`);
  if (!res || !res.ok) return null;
  const commits = (await res.json()) as unknown[];
  return commits.length;
}

/**
 * Byte counts per language across the account's ORIGINAL public repos
 * (forks excluded; upstream code would inflate the picture). The skills
 * section renders these with a visible caveat: StayFit's 80,000+ lines of
 * Swift live in a private repo and are absent here by design.
 */
export async function getPublicLanguageBytes(): Promise<Record<string, number>> {
  const repos = await fetchPublicRepos();
  if (!repos) return {};
  const totals: Record<string, number> = {};
  for (const repo of repos.filter((r) => !r.fork)) {
    const langs = await fetchRepoLanguages(repo.fullName);
    if (!langs) continue;
    for (const [lang, bytes] of Object.entries(langs)) {
      totals[lang] = (totals[lang] ?? 0) + bytes;
    }
  }
  return totals;
}

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? "var(--fg-subtle)";
}

function readSnapshot(): { repos: RepoData[]; fetchedAt: string } | null {
  try {
    const raw = fs.readFileSync(SNAPSHOT_PATH, "utf8");
    return JSON.parse(raw) as { repos: RepoData[]; fetchedAt: string };
  } catch {
    return null;
  }
}

function writeSnapshot(repos: RepoData[]): void {
  try {
    fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
    fs.writeFileSync(
      SNAPSHOT_PATH,
      JSON.stringify({ repos, fetchedAt: new Date().toISOString() }, null, 2)
    );
  } catch {
    // Read-only filesystem (Vercel runtime): the committed snapshot stands.
  }
}

const TIER_ORDER = { "case-study": 0, featured: 1, archive: 2 } as const;

function decorate(
  repo: RepoData,
  override: ProjectOverride | undefined,
  authoredCommits: number | undefined
): Project {
  const tier = (override?.tier ?? "archive") as Project["tier"];
  const language = repo.language;
  return {
    ...repo,
    tier,
    badges: override?.badges ?? [],
    displayDescription: override?.description ?? repo.description ?? "No description yet",
    roleNote:
      override?.roleNote && authoredCommits !== undefined
        ? `${override.roleNote}, ${authoredCommits} commits authored`
        : override?.roleNote,
    linkTo: override?.linkTo,
    liveUrl: override?.liveUrl ?? repo.homepage ?? undefined,
    caseStudySlug: override?.caseStudySlug,
    isEmpty: repo.size === 0,
    ageInYears:
      Math.round(((Date.now() - new Date(repo.createdAt).getTime()) / (365.25 * 24 * 3600 * 1000)) * 10) / 10,
    lastPushedRelative: formatDistanceToNowStrict(new Date(repo.pushedAt), { addSuffix: true }),
    primaryLanguage: language
      ? { name: language, color: LANGUAGE_COLORS[language] ?? "var(--fg-subtle)" }
      : null,
    authoredCommits,
    showRepoLink: !repo.private,
  };
}

/**
 * The single entry point pages use. Fetches public repos, allow-listed
 * private repos, and the WebMARS org repo; merges overrides and case
 * studies; drops hidden repos; sorts case-study, featured, archive, then by
 * pushed_at descending. Falls back to the committed snapshot when GitHub is
 * unreachable or rate limited.
 */
export async function getAllProjects(): Promise<SyncResult> {
  const overrides = getProjectOverrides();
  const overrideByName = new Map(overrides.map((o) => [o.name, o]));

  let source: SyncResult["source"] = "live";
  let fetchedAt = new Date().toISOString();

  const publicRepos = await fetchPublicRepos();
  let repos: RepoData[];
  if (publicRepos === null) {
    const snapshot = readSnapshot();
    if (!snapshot) {
      return {
        projects: [],
        hidden: [],
        source: "snapshot",
        fetchedAt: "",
        rateLimitRemaining: lastRateLimitRemaining,
        publicRepoCount: 0,
        lastPushedAt: null,
      };
    }
    repos = snapshot.repos;
    source = "snapshot";
    fetchedAt = snapshot.fetchedAt;
  } else {
    const privateRepos = await fetchPrivateRepos();
    const orgRepo = await fetchOrgRepo("Webmarssimulator", "WebMARS");
    repos = [...publicRepos, ...privateRepos, ...(orgRepo ? [orgRepo] : [])];
    writeSnapshot(repos);
  }

  // Private allow-listed repos may be absent (no token): their case-study
  // cards still render from the case-study content itself in Agent 07; the
  // sync layer only reports repos it actually fetched.

  const authored = new Map<string, number>();
  if (source === "live") {
    for (const target of ["SDSUMaps", "webmars-api"]) {
      if (repos.some((r) => r.name === target)) {
        const count = await fetchAuthoredCommitCount(`${USERNAME}/${target}`);
        if (count !== null) authored.set(target, count);
      }
    }
    if (repos.some((r) => r.fullName === "Webmarssimulator/WebMARS")) {
      const count = await fetchAuthoredCommitCount("Webmarssimulator/WebMARS");
      if (count !== null) authored.set("WebMARS", count);
    }
  }

  const hidden: SyncResult["hidden"] = [];
  const projects: Project[] = [];
  for (const repo of repos) {
    const override = overrideByName.get(repo.name);
    if (override?.tier === "hidden") {
      hidden.push({ name: repo.name, reason: override.hiddenReason ?? "hidden by override" });
      continue;
    }
    projects.push(decorate(repo, override, authored.get(repo.name)));
  }

  projects.sort((a, b) => {
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (tierDiff !== 0) return tierDiff;
    if (a.tier === "case-study") {
      const studies = getCaseStudies();
      const orderOf = (p: Project) =>
        studies.find((s) => s.frontmatter.slug === p.caseStudySlug)?.frontmatter.order ?? 99;
      return orderOf(a) - orderOf(b);
    }
    return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
  });

  const publicRepoCount = repos.filter((r) => !r.private && r.owner === USERNAME).length;
  const lastPushedAt = repos.reduce<string | null>(
    (latest, r) => (!latest || r.pushedAt > latest ? r.pushedAt : latest),
    null
  );

  return {
    projects,
    hidden,
    source,
    fetchedAt,
    rateLimitRemaining: lastRateLimitRemaining,
    publicRepoCount,
    lastPushedAt,
  };
}
