import { withSentryConfig } from "@sentry/nextjs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  turbopack: {
    root: repoRoot,
  },
}

export default withSentryConfig(nextConfig, {
  org: "linglix",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
