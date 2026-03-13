import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  // Configuration for Next.js 16
};

// Wrap with PWA support
const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

// Wrap with Sentry error tracking
// See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
const sentryConfig = withSentryConfig(withPWAConfig(nextConfig), {
  // Suppresses source map upload logs during build
  silent: true,
  // Upload source maps to Sentry for better stack traces
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only upload source maps when SENTRY_AUTH_TOKEN is set
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Automatically tree-shake Sentry logger statements
  disableLogger: true,
});

export default sentryConfig;
