/** Canonical site URL: env in production, the planned subdomain otherwise. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bryanjoseph.vercel.app";

/**
 * OG-image palette. ImageResponse renders outside the CSS variable scope,
 * so these are the hex equivalents of the globals.css tokens (bg, fg,
 * fg-muted, accent). Change globals.css first, then mirror here.
 */
export const OG_COLORS = {
  bg: "#181614",
  fg: "#eceae6",
  muted: "#a8a39b",
  accent: "#e0a938",
  border: "#3a3630",
} as const;
