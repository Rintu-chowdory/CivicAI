/** @type {import('next').NextConfig} */
const repoName = "CivicAI";
const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Project pages are served at <user>.github.io/<repo>/ — set basePath only
  // when building for GitHub Pages. Leave unset for Vercel/local/custom domain.
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  trailingSlash: true,
};

export default nextConfig;
