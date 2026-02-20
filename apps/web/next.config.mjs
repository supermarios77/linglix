import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  turbopack: {
    root: "/Users/mario/Documents/Projects/Web/Linglix",
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
