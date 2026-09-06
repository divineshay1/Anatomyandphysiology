import type { NextConfig } from "next";

// GitHub Actions sets GITHUB_ACTIONS=true on every runner, so CI builds
// automatically get the project-page base path while `npm run dev`/local
// `npm run build` stay at the root — no manual toggling needed before deploy.
const basePath = process.env.GITHUB_ACTIONS === "true" ? "/Anatomyandphysiology" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
