import type { PrivateRepoEntry } from "@/content/schema";

/**
 * ALLOW-LIST ONLY. Never a deny-list. The GitHub sync layer fetches EXACTLY
 * these private repositories by name, one request each, and nothing else.
 * If the token is absent or an entry is removed, that repo simply does not
 * appear: the system fails closed.
 *
 * Every entry maps to a linkTo so its card links to the PRODUCT (App Store,
 * live site). A private repo URL 404s for every visitor and must never be
 * rendered.
 *
 */
export const privateRepos: PrivateRepoEntry[] = [
  {
    // Listing URL verified live and cross-checked against the resume PDF
    // and getstayfitapp.com (both reference the same id).
    name: "StayFit---Healthy-lifestyle-",
    linkTo: "https://apps.apple.com/app/stayfit-ai-health-fitness/id6779075884",
  },
  {
    name: "stayfit-website",
    linkTo: "https://getstayfitapp.com",
  },
  {
    // Owner chose option (b): the engine stays private (it trades live
    // prop-firm accounts); the card links to the public architecture
    // companion repo.
    name: "Futures-Trading-Algorithm",
    linkTo: "https://github.com/BryanD17/futures-engine-architecture",
  },
];
