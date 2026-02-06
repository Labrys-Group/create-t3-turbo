# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

T3 Turbo monorepo — Turborepo-managed full-stack TypeScript with Next.js 15, Expo (React Native), and Tanstack Start sharing tRPC v11 APIs, Drizzle ORM (PostgreSQL/Supabase), Better Auth, and Tailwind CSS v4. Replace `@acme` namespace with your project name.

**Requirements:** Node.js ^22.21.0, pnpm ^10.19.0

## Commands

All commands run from the monorepo root.

```bash
# Development
pnpm dev                   # All apps in watch mode
pnpm dev:next              # Next.js + dependent packages only

# Code quality
pnpm lint                  # ESLint (all workspaces)
pnpm lint:fix              # ESLint auto-fix
pnpm format                # Prettier check
pnpm format:fix            # Prettier fix
pnpm typecheck             # TypeScript check (all workspaces)
pnpm lint:ws               # Workspace integrity check (sherif)

# Testing
pnpm test                  # Unit tests (Vitest, all packages)
pnpm test:e2e              # E2E tests (Playwright, apps/nextjs)

# Database
pnpm db:push               # Push Drizzle schema to database
pnpm db:studio             # Drizzle Studio (visual DB editor)
pnpm auth:generate         # Regenerate Better Auth schema → packages/db/src/auth-schema.ts

# Run a single unit test (from the package directory):
cd packages/api && pnpm test -- src/router/post.test.ts

# Run a single E2E test (from apps/nextjs):
cd apps/nextjs && pnpm test:e2e -- src/app/example/example.e2e.ts

# Add shadcn/ui component
pnpm ui-add
```

## Architecture

```
apps/
  nextjs/              # Next.js 15 (App Router, React 19) — serves tRPC
  expo/                # Expo SDK 54 (React Native 0.81, NativeWind v5)
  tanstack-start/      # Tanstack Start v1 (Vite 7, Nitro)
packages/
  api/                 # tRPC v11 routers (consumed by all apps)
  auth/                # Better Auth (Drizzle adapter, Discord OAuth, Expo plugin)
  db/                  # Drizzle ORM + PostgreSQL schema (edge-compatible)
  ui/                  # shadcn/ui components (Radix + Tailwind v4 + CVA)
  validators/          # Shared Zod schemas
tooling/               # Shared configs: ESLint, Prettier, Tailwind theme, TypeScript, Vitest
```

### Data Flow

Drizzle schema → drizzle-zod validators → tRPC procedures → client type inference (React Query)

### Key Conventions

- **Environment variables**: Use `import { env } from "~/env"` (t3-env), never `process.env` directly. ESLint enforces this.
- **tRPC procedures**: `publicProcedure` and `protectedProcedure` in `packages/api/src/trpc.ts`. Auth session available via context.
- **File naming**: kebab-case enforced by ESLint. `_` prefix allowed for Next.js private folders.
- **Type imports**: Use `import type` for type-only imports. Top-level type specifiers preferred.
- **Complexity**: ESLint `complexity` rule is enabled (default threshold 20).
- **No non-null assertions**: Enforced by ESLint.
- **E2E tests**: `.e2e.ts` suffix, co-located with pages, port 3939, accessible locators over `data-testid`.
- **Unit tests**: `.spec.ts`/`.test.ts` co-located with source files. Vitest configured via `@acme/vitest-config`.

### Package Relationships

- `packages/api` depends on `auth`, `db`, `validators` — defines all tRPC routers
- `packages/auth` depends on `db` — Better Auth with Drizzle adapter
- `packages/db` is standalone — schema, client, and mocks
- Apps import `@acme/api` as production dep (Next.js) or dev dep (Expo, Tanstack Start)
- All apps share `@acme/ui` components and `@acme/validators`

## Coding Standards

@docs/agent-context.md
