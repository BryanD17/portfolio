/** Prints the table of what the projects index would render. */
import { getAllProjects } from "../src/lib/github";

async function main() {
  const result = await getAllProjects();

  console.log(`source: ${result.source}  fetched: ${result.fetchedAt}`);
  console.log(`rate limit remaining: ${result.rateLimitRemaining ?? "unknown"}`);
  console.log("");
  const rows = result.projects.map((p) => ({
    tier: p.tier,
    name: p.name,
    lang: p.primaryLanguage?.name ?? "-",
    stars: p.stargazersCount,
    pushed: p.lastPushedRelative,
    badges: p.badges.join("|") || "-",
    desc: p.displayDescription.slice(0, 48),
  }));
  console.table(rows);
  console.log("hidden:");
  for (const h of result.hidden) console.log(`  ${h.name}: ${h.reason}`);
  console.log(`\ntotal rendered: ${result.projects.length}, hidden: ${result.hidden.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
