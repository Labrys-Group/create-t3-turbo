# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

`@acme/api` — tRPC v11 router package consumed by all apps (Next.js, Expo, Tanstack Start). Defines the API surface as type-safe procedures. Depends on `@acme/auth`, `@acme/db`, and `@acme/validators`.

## Commands

Run from this directory (`packages/api`):

```bash
pnpm test                  # Run all unit tests (vitest run)
pnpm test -- src/router/post.test.ts   # Run a single test file
pnpm lint                  # ESLint
pnpm typecheck             # TypeScript check
```

## Architecture

```
src/
  trpc.ts          # tRPC initialization, context, middleware, procedure exports
  root.ts          # Root router — merges all sub-routers, exports AppRouter type
  index.ts         # Public API — re-exports appRouter, createTRPCContext, type helpers
  test-helpers.ts  # makeTestCaller() for unit testing procedures
  router/
    post.ts        # Post CRUD (example router)
    post.test.ts   # Tests for post router
    auth.ts        # Auth session/secret message (example router)
```

### Key Exports (from `@acme/api`)

| Export | Purpose |
|---|---|
| `appRouter` | Root tRPC router instance |
| `AppRouter` | Type for client inference |
| `createTRPCContext` | Context factory — takes `{ headers, auth }`, returns `{ authApi, session, db }` |
| `RouterInputs` / `RouterOutputs` | Inferred input/output types for all procedures |

### Adding a New Router

1. Create `src/router/<name>.ts` — export a `TRPCRouterRecord` using `publicProcedure` / `protectedProcedure` from `../trpc`
2. Register it in `src/root.ts` inside `createTRPCRouter({ ... })`
3. Input validation: use Zod schemas from `@acme/validators` or inline `z.object(...)`. For DB-derived validators, use `createInsertSchema` from `@acme/db/schema`.

### Procedure Types

- `publicProcedure` — no auth required, session may be null
- `protectedProcedure` — requires auth, throws `UNAUTHORIZED` if no session. `ctx.session.user` guaranteed non-null.

Both include timing middleware (logs execution time, adds artificial delay in dev).

### Router Definition Style

Routers use the flat `TRPCRouterRecord` pattern (object literal with `satisfies TRPCRouterRecord`), not `createTRPCRouter`:

```ts
export const myRouter = {
  myQuery: publicProcedure.query(({ ctx }) => { ... }),
} satisfies TRPCRouterRecord;
```

## Testing

Tests use Vitest with an in-memory PGlite database (real SQL, no external dependencies).

### Test Pattern

1. **Mock the DB** at the top of the test file using `vi.mock`:
   ```ts
   vi.mock("@acme/db/client", async () => {
     const { createMockDb } = await import("@acme/db/mocks");
     return { db: await createMockDb() };
   });
   ```

2. **Use `makeTestCaller()`** from `../test-helpers` to call procedures directly:
   ```ts
   // Unauthenticated caller (default)
   const caller = makeTestCaller();
   const posts = await caller.post.all();

   // Authenticated caller — pass a session with user
   const caller = makeTestCaller({
     session: { user: { id: "user-123" } } as any,
   });
   await caller.post.create({ title: "Test", content: "Content" });
   ```

3. **Clean up** in `beforeEach` by deleting table contents: `await db.delete(Post)`

4. Test files are co-located with routers: `src/router/<name>.test.ts`
