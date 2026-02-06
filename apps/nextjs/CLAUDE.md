# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the Next.js app within a T3 Turbo monorepo. See the root CLAUDE.md for full project context.

## Commands

Run all commands from the **monorepo root** (`../../`) unless noted otherwise.

### Development

```bash
pnpm dev:next              # Next.js + all dependent packages in watch mode
pnpm dev                   # All apps (Next.js, Expo, Tanstack Start)
```

### Code Quality

```bash
pnpm lint                  # ESLint across all workspaces
pnpm lint:fix              # ESLint with auto-fix
pnpm format                # Prettier check
pnpm format:fix            # Prettier fix
pnpm typecheck             # TypeScript check across all workspaces
```

### Testing

```bash
pnpm test                  # Unit tests (Vitest) across all packages
pnpm test:e2e              # Playwright E2E tests (from apps/nextjs)
pnpm test:e2e:ui           # Playwright interactive UI mode

# Run a specific E2E test file (from apps/nextjs directory):
pnpm test:e2e -- src/app/example/example.e2e.ts

# Run a specific unit test (from packages/api directory):
pnpm test -- src/router/post.test.ts
```

### Database

```bash
pnpm db:push               # Push Drizzle schema to database
pnpm db:studio             # Open Drizzle Studio (visual DB editor)
pnpm auth:generate         # Regenerate Better Auth schema → packages/db/src/auth-schema.ts
```

### UI Components

```bash
pnpm ui-add                # Add shadcn/ui components (interactive)
```

## Architecture

### Monorepo Layout

```
apps/nextjs/          ← This app (Next.js 15, App Router, React 19)
apps/expo/            ← React Native (Expo SDK 54, NativeWind v5)
apps/tanstack-start/  ← Tanstack Start v1 (Vite, Nitro)
packages/api/         ← tRPC v11 routers (served by Next.js, consumed by all apps)
packages/auth/        ← Better Auth (Drizzle adapter, Discord OAuth, Expo plugin)
packages/db/          ← Drizzle ORM + PostgreSQL schema (edge-compatible via @vercel/postgres)
packages/ui/          ← shadcn/ui components (Radix + Tailwind v4 + CVA)
packages/validators/  ← Shared Zod schemas (drizzle-zod for DB-derived validators)
tooling/              ← Shared ESLint, Prettier, Tailwind theme, TypeScript, Vitest configs
```

### Data Flow

Database schema (Drizzle) → Zod validators (drizzle-zod) → tRPC routers (type-safe procedures) → Client type inference (React Query hooks)

### Key Conventions

- **Environment variables**: Access via `import { env } from "~/env"` (t3-env validated), never `process.env` directly. ESLint enforces this.
- **tRPC context**: `publicProcedure` and `protectedProcedure` are defined in `packages/api/src/trpc.ts`. Protected procedures throw `UNAUTHORIZED` if no session.
- **Auth**: Better Auth sessions flow through tRPC context. Server-side: `src/auth/server.ts`. Client-side: `src/auth/client.ts`.
- **File naming**: kebab-case enforced by ESLint (`filenames/naming-convention`). Files starting with `_` are allowed (Next.js private folders).
- **Complexity**: ESLint `complexity` rule is enabled at default threshold (20).
- **Imports**: Use `type` imports for type-only imports (`@typescript-eslint/consistent-type-imports`). Top-level type specifiers preferred.
- **No non-null assertions**: `@typescript-eslint/no-non-null-assertion` is set to error.

### Next.js App Structure

```
src/
  app/
    page.tsx                           # Route entry
    layout.tsx                         # Root layout
    api/auth/[...all]/route.ts         # Better Auth handler
    api/trpc/[trpc]/route.ts           # tRPC handler
    <route>/
      page.tsx                         # Route entry (renders controller)
      <route>.e2e.ts                   # Co-located Playwright test
      _components/                     # Page-specific components (controller-view-hook)
  auth/                                # Auth client/server wrappers
  trpc/                                # tRPC client/server setup + React Query config
  env.ts                               # Environment variable validation (t3-env)
```

### E2E Tests

Tests use `.e2e.ts` suffix and are co-located next to the page they test. Port 3939 to avoid conflicts. Use accessible locators (`getByRole`, `getByLabel`, `getByText`), not `data-testid`.

## Coding Standards

@../../docs/standards/react.md
@../../docs/standards/e2e-testing.md
