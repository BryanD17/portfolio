import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile exists in the user home directory; pin the root so
  // Turbopack does not misinfer the workspace.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
