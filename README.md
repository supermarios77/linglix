# Linglix

Linglix is an online 1‑to‑1 language tutoring service. This repository is the
monorepo that hosts the production web app and shared UI library. It is built
on Next.js (App Router + Turbopack), TypeScript, and a reusable design system
powered by shadcn/ui-style primitives.

---

## Tech stack

- Package manager: pnpm (workspaces)
- Monorepo task runner: Turborepo
- Web app: Next.js 16 (App Router, Turbopack)
- Language: TypeScript (strict)
- UI: React 19, `@workspace/ui` design system
- Styling: Tailwind tokens via `@workspace/ui/globals.css`
- Testing:
  - Unit: Jest (+ Testing Library)
  - E2E: Playwright (`@linglix/e2e`)
- Observability:
  - Sentry (errors, performance, replays)
  - PostHog (product analytics)

---

## Repository layout

```text
apps/
  web/           # Next.js application

packages/
  ui/            # Shared UI library and design system
  e2e/           # Playwright end-to-end tests
  eslint-config/ # Shared ESLint configs
  typescript-config/ # Shared TS configs
  config/jest/   # Shared Jest config
```

---

## Getting started

### Prerequisites

- Node.js ≥ 20
- pnpm (see `packageManager` field in `package.json` for the exact version)

### Install dependencies

```bash
pnpm install
```

### Run the app locally

From the repo root:

```bash
pnpm dev
```

This runs `turbo dev` and starts the Next.js app at:

- http://localhost:3000

---

## Applications and packages

### `apps/web` (Next.js app)

Key scripts:

```bash
pnpm --filter web dev          # next dev --turbopack
pnpm --filter web build        # next build
pnpm --filter web start        # next start
pnpm --filter web lint         # eslint . --max-warnings 0
pnpm --filter web typecheck    # tsc --noEmit
pnpm --filter web test         # jest (currently passes with no tests)
pnpm --filter web test:e2e     # run Playwright tests via Turborepo
```

The app imports all styling from the shared UI package:

- Global styles: `@workspace/ui/globals.css`
- Components: `@workspace/ui/components/*`

### `packages/ui` (design system)

Key points:

- React component library used by `apps/web`
- Exports:
  - `./globals.css` – base styles & design tokens
  - `./components/*` – UI components (e.g. `button`)
  - `./lib/*`, `./hooks/*`

Scripts:

```bash
pnpm --filter @workspace/ui lint
pnpm --filter @workspace/ui test
```

### `packages/e2e` (Playwright tests)

End-to-end tests for the web app using Playwright.

Scripts:

```bash
pnpm --filter @linglix/e2e playwright install --with-deps  # install browsers
pnpm --filter @linglix/e2e test:e2e                        # playwright test
pnpm --filter @linglix/e2e test:headed                     # headed mode
pnpm --filter @linglix/e2e test:ui                         # Playwright UI mode
pnpm --filter @linglix/e2e test:report                     # open last HTML report
```

The Playwright config lives in:

- `packages/e2e/playwright.config.ts`

By default:

- Locally: runs Chromium + WebKit
- CI: runs Chromium, Firefox, and WebKit (and retries are enabled)

---

## Common workflows

From the repo root:

```bash
pnpm dev        # turbo dev (local development)
pnpm build      # turbo build (all packages)
pnpm lint       # turbo lint (all packages)
pnpm turbo test # run Jest tests in web + ui
```

End-to-end tests:

```bash
pnpm --filter @linglix/e2e playwright install --with-deps
pnpm turbo test:e2e --filter=@linglix/e2e
```

---

## Environment variables

The app expects configuration via environment variables. Typical ones include:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `POSTHOG_API_KEY`
- `POSTHOG_HOST`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`

Create an `.env.local` in `apps/web` (or configure these in your deployment
platform) before running in production.

> The repo `.gitignore` already excludes `.env*` files.

---

## Observability

### Sentry

Sentry is wired via:

- `apps/web/instrumentation.ts`
- `apps/web/sentry.server.config.ts`
- `apps/web/sentry.edge.config.ts`
- `apps/web/instrumentation-client.ts`

The DSN and behavior are controlled via environment variables and the current
`NODE_ENV`. Production defaults are tuned for lower sampling and no default PII.

### PostHog

PostHog analytics are initialized from `apps/web/instrumentation-client.ts` and
server helpers in `apps/web/lib/posthog.ts` (if present). The client only
initializes when `NEXT_PUBLIC_POSTHOG_KEY` is set, so missing configuration
does not crash the app.

---

## Linting and formatting

The repo uses a shared ESLint configuration and Prettier.

Root `package.json`:

- `pnpm lint` – runs `turbo lint`
- `pnpm format` – formats `*.ts,*.tsx,*.md` with Prettier

Lint-staged is configured to run ESLint/Prettier on changed files before commit.

---

## Continuous integration

GitHub Actions is configured to run:

- Unit tests (Jest) via `pnpm turbo test`
- E2E tests (Playwright) via `pnpm turbo test:e2e --filter=@linglix/e2e`
- Build & lint pipelines via Turborepo

Builds use Next.js with Turbopack and a shared Turborepo cache. Production
builds are created by running:

```bash
pnpm turbo build --filter='...[origin/main]'
```

This command is what CI uses before deploying.
