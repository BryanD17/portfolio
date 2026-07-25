/**
 * Failure-path tests for the GitHub sync layer:
 * 1. empty allow-list yields zero private repos even with a token
 * 2. forced 403 (rate limit) falls back to the snapshot without throwing
 * 3. full network failure falls back to the snapshot without throwing
 */
import { fetchPrivateRepos, getAllProjects } from "../src/lib/github";

const realFetch = globalThis.fetch;

async function main() {
  let failures = 0;
  const check = (label: string, ok: boolean, detail: string) => {
    console.log(`${ok ? "ok  " : "FAIL"}  ${label}  (${detail})`);
    if (!ok) failures += 1;
  };

  // 1. Empty allow-list: no private fetches at all.
  let requests = 0;
  globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
    requests += 1;
    return realFetch(...args);
  }) as typeof fetch;
  const empty = await fetchPrivateRepos([]);
  check("empty allow-list yields zero private repos", empty.length === 0 && requests === 0, `repos=${empty.length}, requests=${requests}`);

  // 2. Forced 403 on every request.
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ message: "rate limited" }), {
      status: 403,
      headers: { "x-ratelimit-remaining": "0" },
    })) as typeof fetch;
  const rateLimited = await getAllProjects();
  check(
    "403 falls back to snapshot, no crash",
    rateLimited.source === "snapshot" && rateLimited.projects.length > 0,
    `source=${rateLimited.source}, projects=${rateLimited.projects.length}`
  );

  // 3. Network completely down.
  globalThis.fetch = (async () => {
    throw new Error("ENOTFOUND api.github.com");
  }) as typeof fetch;
  const offline = await getAllProjects();
  check(
    "offline falls back to snapshot, no crash",
    offline.source === "snapshot" && offline.projects.length > 0,
    `source=${offline.source}, projects=${offline.projects.length}`
  );

  globalThis.fetch = realFetch;
  if (failures) process.exit(1);
  console.log("\ngithub fallback tests passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
