import { PostHog } from 'posthog-node'

const posthogKey = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST

export const posthogServer = posthogKey
  ? new PostHog(posthogKey, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
    })
  : null
