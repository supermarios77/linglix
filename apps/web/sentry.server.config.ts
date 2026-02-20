// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  tracesSampleRate: isProd ? 0.1 : 1.0,
  enableLogs: true,
  sendDefaultPii: isProd ? false : true,
});
