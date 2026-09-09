# Linglix

Online 1-to-1 language tutoring service, built as a Turborepo monorepo

Run the production web app and shared UI library from a single workspace with coordinated builds and tests.

## Install

```bash
git clone https://github.com/supermarios77/linglix.git
cd linglix
pnpm install
```

## Quickstart

```bash
pnpm dev
```

Turborepo boots the web app and shared packages in parallel with hot reload.

## Features

- **Tutoring web app:** book and attend 1-to-1 language sessions in the browser.
- **Shared UI library:** reusable component package consumed by the app and exportable for reuse.
- **Strict TypeScript:** end-to-end type safety with strict mode enabled across every workspace.
- **React 19:** latest React with server components and concurrent rendering.
- **Turbopack:** Next.js 16 App Router powered by Turbopack for fast dev builds.
- **Test coverage:** Jest for unit tests, Playwright for end-to-end flows.

## Tech stack

- **Monorepo:** pnpm workspaces, Turborepo
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **UI:** React 19, shadcn/ui-style components, Tailwind CSS
- **Testing:** Jest, Playwright
