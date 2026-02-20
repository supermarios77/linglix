import posthog from 'posthog-js';
import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30'
  })
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: isProd ? 0.2 : 1.0,
  replaysSessionSampleRate: isProd ? 0.05 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: isProd ? false : true,
  enableLogs: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
