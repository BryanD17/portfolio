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
 * NOTE: StayFit's App Store listing URL is still owner-pending; until it
 * arrives the card links to the marketing site, which links to the App Store.
 */
export const privateRepos: PrivateRepoEntry[] = [
  {
    name: "StayFit---Healthy-lifestyle-",
    linkTo: "https://getstayfitapp.com",
  },
  {
    name: "stayfit-website",
    linkTo: "https://getstayfitapp.com",
  },
  {
    // No public product link yet; the card links only to its case study.
    // Agent 15 owns the visibility decision.
    name: "Futures-Trading-Algorithm",
  },
];
