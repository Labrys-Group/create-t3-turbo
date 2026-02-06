# Agent Consolidation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate 22 agents from a different project into 9 focused agents aligned to the T3 Turbo monorepo stack.

**Architecture:** Delete 8 off-stack agents (DeFi/blockchain/Cloudflare), merge 6 overlapping agents into their consolidated targets, rewrite 9 agents with correct T3 Turbo stack references (Next.js 15, Expo, Tanstack Start, tRPC v11, Drizzle/Supabase, Better Auth, Tailwind v4, shadcn/ui).

**Tech Stack:** Claude Code agents (`.claude/agents/*.md` YAML frontmatter + Markdown body)

---

## Reference: T3 Turbo Stack

All agents must reference ONLY these technologies:

- **Apps:** Next.js 15 (App Router, React 19), Expo SDK 54 (NativeWind v5), Tanstack Start v1 (Vite 7, Nitro)
- **API:** tRPC v11, `publicProcedure`/`protectedProcedure`, `TRPCRouterRecord` pattern
- **Database:** Drizzle ORM, PostgreSQL via `@vercel/postgres` (edge-compatible), drizzle-zod validators
- **Auth:** Better Auth (Drizzle adapter, Discord OAuth, Expo plugin) — NOT Clerk
- **UI:** shadcn/ui (Radix + Tailwind CSS v4 + CVA), `@acme/ui` package
- **Validation:** Zod v4 (`zod/v4`), `@acme/validators`
- **Testing:** Vitest (unit, `@acme/vitest-config`), Playwright (E2E, `.e2e.ts`, port 3939)
- **Tooling:** Turborepo, pnpm, ESLint, Prettier, TypeScript
- **Conventions:** kebab-case files, `import type`, no non-null assertions, complexity <= 20, `import { env } from "~/env"` (t3-env), controller-view-hook pattern

**Must NOT reference:** thirdweb SDK, Cloudflare Workers/D1/R2, Clerk, DeFi/vaults/staking, Solidity, blockchain, Zustand, RockSolid, wallet connect.

## Reference: Agent File Structure

```yaml
---
name: agent-name
description: |-
  When to use this agent (1-3 sentences with examples).
model: inherit
color: <color>
---

[Role paragraph]

## Section 1
[Patterns, code examples, checklists]

## Integration with Other Agents
[When to delegate to sibling agents]
```

Target length: 300-500 lines for core agents, 200-300 for specialist agents.

---

### Task 1: Delete off-stack agents

These agents are for DeFi/blockchain/Cloudflare — completely wrong domain for T3 Turbo.

**Files:**
- Delete: `.claude/agents/defi-protocol-analyst.md`
- Delete: `.claude/agents/lagoon-vault-analyst.md`
- Delete: `.claude/agents/lido-staking-vault-analyst.md`
- Delete: `.claude/agents/solidity-contract-expert.md`
- Delete: `.claude/agents/quant-analyst.md`
- Delete: `.claude/agents/trend-analyst.md`
- Delete: `.claude/agents/cloudflare-infrastructure-specialist.md`
- Delete: `.claude/agents/documentation-specialist.md`

**Step 1: Delete the 8 files**

```bash
cd /Users/simontanna/repos/github/create-t3-turbo
git rm .claude/agents/defi-protocol-analyst.md \
      .claude/agents/lagoon-vault-analyst.md \
      .claude/agents/lido-staking-vault-analyst.md \
      .claude/agents/solidity-contract-expert.md \
      .claude/agents/quant-analyst.md \
      .claude/agents/trend-analyst.md \
      .claude/agents/cloudflare-infrastructure-specialist.md \
      .claude/agents/documentation-specialist.md
```

**Step 2: Commit**

```bash
git commit -m "chore: remove off-stack agents (DeFi/blockchain/Cloudflare)"
```

---

### Task 2: Write `nextjs-expert.md`

Rewrite the existing agent to focus purely on T3 Turbo Next.js patterns. This is the most critical agent — it covers the primary app.

**Files:**
- Modify: `.claude/agents/nextjs-expert.md`

**Content guidance:**

Frontmatter:
- name: `nextjs-expert`
- description: Use when working on Next.js 15 pages, layouts, tRPC data fetching, Better Auth integration, or App Router patterns in the T3 Turbo monorepo.
- model: `inherit`
- color: pick a color

Body sections (~400-500 lines):
1. **Role** — Senior Next.js 15 expert for the T3 Turbo monorepo
2. **Project Structure** — `apps/nextjs/src/` layout with routes, `_components/`, auth, trpc directories
3. **tRPC Data Fetching** — Server-side prefetching with `createCaller`, client-side with `api.*.useQuery()`, React Query integration
4. **Better Auth Integration** — Server auth (`packages/auth`), client auth, session flow through tRPC context
5. **Controller-View-Hook Pattern** — The enforced pattern from `docs/standards/react.md`:
   - Controller: thin orchestration (`useFeature()` + `<FeatureView />`)
   - Hook: all business logic, API calls, state
   - View: pure presentation, no state except ephemeral UI
   - File structure: `feature.tsx`, `feature.hook.ts`, `feature.view.tsx`
6. **Environment Variables** — `import { env } from "~/env"` via t3-env, never `process.env`
7. **Root Layout Pattern** — ThemeProvider, TRPCReactProvider, Toaster from actual `layout.tsx`
8. **E2E Testing** — `.e2e.ts` co-located, port 3939, accessible locators
9. **Integration with Other Agents** — delegate to `frontend-developer` for component design, `backend-developer` for tRPC routers, `qa-expert` for test strategy

Key code examples to include:
- tRPC router pattern (`satisfies TRPCRouterRecord`)
- Drizzle schema → drizzle-zod → tRPC input validation flow
- `publicProcedure` / `protectedProcedure` usage
- Controller-view-hook file structure
- E2E test skeleton

**Step 1: Write the agent file**

Replace full content of `.claude/agents/nextjs-expert.md` with the new content following the guidance above.

**Step 2: Verify line count is 300-500 lines**

```bash
wc -l .claude/agents/nextjs-expert.md
```

**Step 3: Commit**

```bash
git add .claude/agents/nextjs-expert.md
git commit -m "feat: rewrite nextjs-expert agent for T3 Turbo stack"
```

---

### Task 3: Write `frontend-developer.md` (consolidates `ui-specialist` + `ui-designer` + old `frontend-developer`)

Merge three UI/frontend agents into one comprehensive frontend specialist.

**Files:**
- Modify: `.claude/agents/frontend-developer.md`

**Content guidance:**

Frontmatter:
- name: `frontend-developer`
- description: Use when building React 19 components, implementing responsive layouts, working with shadcn/ui and Tailwind v4, or adding interactivity and accessibility.
- model: `inherit`

Body sections (~400-500 lines):
1. **Role** — Senior frontend developer for T3 Turbo apps (Next.js, Expo, Tanstack Start)
2. **Component Architecture** — Controller-view-hook pattern (reference `docs/standards/react.md`)
3. **shadcn/ui Patterns** (from ui-designer):
   - `pnpm ui-add` workflow
   - Component structure with `data-slot`, `cn()` utility
   - CVA variant design patterns
   - Composing Radix primitives
4. **Tailwind CSS v4** (from ui-designer):
   - Utility-first patterns, responsive design
   - CSS variable theming (HSL, light/dark modes, semantic colors)
   - ThemeProvider pattern from `@acme/ui/theme`
5. **Accessibility** (from ui-designer):
   - WCAG 2.1 AA compliance
   - Focus states, contrast ratios, touch targets, screen readers
   - Accessible locators for testing
6. **Data Fetching in Components** — React Query via tRPC (`api.*.useQuery()`), proper hook placement
7. **Shared Components** — `@acme/ui` package, cross-app sharing with Expo (NativeWind v5 awareness)
8. **Testing** — Vitest for hooks/components, Playwright for E2E
9. **Integration with Other Agents** — delegate to `nextjs-expert` for page/routing, `backend-developer` for API, `ui-designer` concerns are handled in-agent now

**Step 1: Write the agent file**

Replace full content of `.claude/agents/frontend-developer.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/frontend-developer.md
```

**Step 3: Commit**

```bash
git add .claude/agents/frontend-developer.md
git commit -m "feat: consolidate frontend-developer (absorbs ui-specialist + ui-designer)"
```

---

### Task 4: Write `backend-developer.md` (consolidates `backend-api-specialist` + `api-designer` + old `backend-developer`)

Merge three backend/API agents into one.

**Files:**
- Modify: `.claude/agents/backend-developer.md`

**Content guidance:**

Frontmatter:
- name: `backend-developer`
- description: Use when building tRPC v11 routers, Drizzle ORM schemas, database queries, Zod validation, or Better Auth integration.
- model: `inherit`

Body sections (~400-500 lines):
1. **Role** — Senior backend developer for T3 Turbo monorepo
2. **Package Structure** — `packages/api/`, `packages/db/`, `packages/auth/`, `packages/validators/`
3. **tRPC Router Patterns** (from api-designer + backend-developer):
   - `TRPCRouterRecord` flat pattern (not `createTRPCRouter` for leaf routers)
   - `publicProcedure` / `protectedProcedure`
   - Registering routers in `src/root.ts`
   - Input validation with Zod/drizzle-zod
   - Error handling with `TRPCError`
4. **Drizzle ORM Patterns**:
   - `pgTable` callback style: `pgTable("name", (t) => ({...}))`
   - `casing: "snake_case"` — camelCase in TS, auto-converts
   - `createInsertSchema` from drizzle-zod, omit auto-generated fields
   - Relations, queries (`ctx.db.query.*.findMany()`)
   - Migrations in `packages/db/drizzle/`
5. **Database** — PostgreSQL via `@vercel/postgres`, edge-compatible, `POSTGRES_URL` env var
6. **Better Auth** (from backend-api-specialist):
   - `initAuth()` in `packages/auth/src/index.ts`
   - Drizzle adapter, Discord OAuth, Expo plugin
   - Auth schema auto-generated (`pnpm auth:generate`)
   - Session flow: headers → `authApi.getSession()` → tRPC context
7. **Data Flow** — Drizzle schema → drizzle-zod validators → tRPC procedures → client type inference
8. **Testing** — Vitest with PGlite mock DB (`createMockDb()`), `makeTestCaller()`, co-located `.test.ts` files
9. **Integration with Other Agents** — delegate to `nextjs-expert` for page integration, `frontend-developer` for UI, `typescript-pro` for advanced types

Key code examples to include:
- Complete router example (from actual `post.ts`)
- Schema definition example (from actual `schema.ts`)
- Test pattern with `vi.mock` and `makeTestCaller()` (from actual `post.test.ts`)
- `createTRPCContext` pattern (from actual `trpc.ts`)

**Step 1: Write the agent file**

Replace full content of `.claude/agents/backend-developer.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/backend-developer.md
```

**Step 3: Commit**

```bash
git add .claude/agents/backend-developer.md
git commit -m "feat: consolidate backend-developer (absorbs api-designer + backend-api-specialist)"
```

---

### Task 5: Write `fullstack-developer.md`

Rewrite for T3 Turbo stack. This agent coordinates across layers.

**Files:**
- Modify: `.claude/agents/fullstack-developer.md`

**Content guidance:**

Frontmatter:
- name: `fullstack-developer`
- description: Use when implementing complete end-to-end features spanning database, tRPC API, and frontend across the T3 Turbo monorepo.
- model: `inherit`

Body sections (~400-500 lines):
1. **Role** — Senior fullstack developer for T3 Turbo monorepo
2. **Monorepo Context** — All three apps (Next.js, Expo, Tanstack Start), all packages, Turborepo orchestration
3. **Package Relationships** — `api` depends on `auth`, `db`, `validators`; `auth` depends on `db`; `db` is standalone; apps import `@acme/api`
4. **End-to-End Feature Workflow** — Schema-first approach:
   1. Define Drizzle schema in `packages/db/src/schema.ts`
   2. Create drizzle-zod validators
   3. Build tRPC router in `packages/api/src/router/`
   4. Register in root router
   5. Consume in app via React Query hooks
   6. Build UI with controller-view-hook pattern
5. **Cross-Cutting Concerns**:
   - Type safety flow (Drizzle → Zod → tRPC → client inference)
   - Auth session through tRPC context
   - Environment variables via t3-env
   - Shared `@acme/ui` components
   - Shared `@acme/validators` schemas
6. **Testing Strategy** — Unit tests for routers (Vitest + PGlite), component tests, E2E tests (Playwright)
7. **Multi-App Awareness** — Features built in `packages/` are consumed by all apps; app-specific code stays in `apps/`
8. **Integration with Other Agents** — delegate DB-heavy work to `backend-developer`, UI-heavy work to `frontend-developer`, Next.js routing to `nextjs-expert`

**Step 1: Write the agent file**

Replace full content of `.claude/agents/fullstack-developer.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/fullstack-developer.md
```

**Step 3: Commit**

```bash
git add .claude/agents/fullstack-developer.md
git commit -m "feat: rewrite fullstack-developer agent for T3 Turbo stack"
```

---

### Task 6: Write `code-reviewer.md` (consolidates `code-review-specialist` + `production-readiness-reviewer`)

Merge two review agents into one. Rename from `code-review-specialist`.

**Files:**
- Create: `.claude/agents/code-reviewer.md`
- Delete (later in Task 11): `.claude/agents/code-review-specialist.md`, `.claude/agents/production-readiness-reviewer.md`

**Content guidance:**

Frontmatter:
- name: `code-reviewer`
- description: Use when reviewing code for security, quality, performance, production readiness, and adherence to T3 Turbo conventions.
- model: `inherit`
- tools: `Read, Glob, Grep, Bash` (read-only — reviewer should NOT edit)

Body sections (~300-400 lines):
1. **Role** — Senior code reviewer for T3 Turbo monorepo
2. **T3 Turbo Convention Checklist** (derived from CLAUDE.md):
   - [ ] kebab-case file names
   - [ ] `import type` for type-only imports
   - [ ] No non-null assertions
   - [ ] Complexity <= 20
   - [ ] `import { env } from "~/env"` not `process.env`
   - [ ] Controller-view-hook pattern followed
   - [ ] Drizzle schema uses callback `pgTable` style
   - [ ] tRPC routers use `satisfies TRPCRouterRecord`
   - [ ] Tests co-located with source
3. **Security Review** (from production-readiness-reviewer):
   - OWASP top 10 awareness
   - Input validation (Zod on all tRPC inputs)
   - Auth checks (protected procedures where needed)
   - No secrets in code
4. **Performance Review** (from production-readiness-reviewer):
   - Proper use of Server Components vs Client Components
   - React Query cache configuration
   - Drizzle query efficiency
5. **Review Process** — Read changes → check conventions → check security → check performance → provide structured feedback
6. **Feedback Format** — Critical Issues, Improvements, Suggestions, What's Done Well
7. **Verification Commands**:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test
   ```
8. **Integration with Other Agents** — can suggest delegating fixes to `frontend-developer`, `backend-developer`, etc.

**Step 1: Write the agent file**

Create `.claude/agents/code-reviewer.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/code-reviewer.md
```

**Step 3: Commit**

```bash
git add .claude/agents/code-reviewer.md
git commit -m "feat: create code-reviewer agent (consolidates code-review-specialist + production-readiness-reviewer)"
```

---

### Task 7: Write `debugger.md` (replaces `expert-debugger`)

Rewrite with correct stack references. Rename from `expert-debugger`.

**Files:**
- Create: `.claude/agents/debugger.md`
- Delete (later in Task 11): `.claude/agents/expert-debugger.md`

**Content guidance:**

Frontmatter:
- name: `debugger`
- description: Use when encountering bugs, errors, unexpected behavior, or system failures that require systematic diagnosis and root cause analysis.
- model: `inherit`

Body sections (~300-400 lines):
1. **Role** — Expert debugger for T3 Turbo monorepo
2. **Diagnostic Methodology** — Observe → Hypothesize → Test → Isolate → Fix → Verify
3. **Stack-Specific Debugging**:
   - **Next.js 15**: Hydration mismatches, RSC errors, async API issues (`cookies()`, `headers()`), Server Actions
   - **tRPC**: Error propagation, input validation failures, context issues, procedure type mismatches
   - **Drizzle ORM**: Query errors, schema mismatches, migration issues, PGlite mock vs real DB differences
   - **Better Auth**: Session problems, OAuth flow failures, middleware issues
   - **React Query**: Stale data, cache invalidation, refetch issues
4. **Monorepo-Specific Issues**: Package resolution, Turborepo cache, TypeScript project references, environment variable validation (t3-env)
5. **Debugging Tools**:
   ```bash
   pnpm lint          # Check for lint errors
   pnpm typecheck     # TypeScript errors
   pnpm test          # Unit test failures
   pnpm test:e2e      # E2E failures
   ```
6. **Common Bug Patterns** — t3-env validation failures, missing `"use client"` directives, tRPC context type mismatches, Drizzle casing issues (camelCase TS vs snake_case SQL)
7. **Integration with Other Agents** — delegate fixes to appropriate specialist

**Step 1: Write the agent file**

Create `.claude/agents/debugger.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/debugger.md
```

**Step 3: Commit**

```bash
git add .claude/agents/debugger.md
git commit -m "feat: create debugger agent (replaces expert-debugger for T3 Turbo)"
```

---

### Task 8: Update `typescript-pro.md`

Update references — remove `@rocksolid/tsconfig`, add `@acme/*` patterns.

**Files:**
- Modify: `.claude/agents/typescript-pro.md`

**Content guidance:**

Frontmatter:
- name: `typescript-pro`
- description: Use when working with advanced TypeScript features, type-safe patterns, or full-stack type safety across the T3 Turbo monorepo.
- model: `inherit`

Body sections (~300-400 lines):
1. **Role** — Senior TypeScript specialist for T3 Turbo monorepo
2. **Monorepo Type Architecture** — `tooling/typescript/` shared configs, `@acme/*` package types
3. **tRPC Type Patterns** — `RouterInputs`/`RouterOutputs` inference, `TRPCRouterRecord`, context typing
4. **Drizzle ORM Types** — Table types, `InferSelectModel`/`InferInsertModel`, relation types
5. **Zod Integration** — `drizzle-zod` `createInsertSchema`, Zod v4 (`zod/v4`), schema composition
6. **React Type Patterns** — Component props, `ReturnType<typeof useHook>` for view props, generic components
7. **Advanced Patterns** — Discriminated unions, branded types, const assertions, `satisfies`, type guards, exhaustive checking
8. **Integration with Other Agents**

Remove all references to: `@rocksolid/*`, thirdweb types, blockchain types, Cloudflare types.

**Step 1: Write the agent file**

Replace full content of `.claude/agents/typescript-pro.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/typescript-pro.md
```

**Step 3: Commit**

```bash
git add .claude/agents/typescript-pro.md
git commit -m "feat: update typescript-pro agent for T3 Turbo stack"
```

---

### Task 9: Update `qa-expert.md`

Update with correct testing conventions.

**Files:**
- Modify: `.claude/agents/qa-expert.md`

**Content guidance:**

Frontmatter:
- name: `qa-expert`
- description: Use when developing test strategies, writing test plans, improving test coverage, or ensuring quality standards across the T3 Turbo monorepo.
- model: `inherit`

Body sections (~200-300 lines):
1. **Role** — Senior QA expert for T3 Turbo monorepo
2. **Testing Infrastructure**:
   - Vitest via `@acme/vitest-config` for unit tests
   - Playwright for E2E tests
   - PGlite mock DB for API router tests
3. **Unit Test Conventions**:
   - `.test.ts` / `.spec.ts` co-located with source
   - `makeTestCaller()` for tRPC router testing
   - `vi.mock("@acme/db/client")` + `createMockDb()` pattern
4. **E2E Test Conventions**:
   - `.e2e.ts` suffix, co-located with pages
   - Port 3939
   - Accessible locators (`getByRole`, `getByLabel`, `getByText`) over `data-testid`
   - Reference: `docs/standards/e2e-testing.md`
5. **Test Commands**:
   ```bash
   pnpm test              # All unit tests
   pnpm test:e2e          # All E2E tests
   pnpm test:e2e:ui       # Interactive E2E
   ```
6. **Quality Standards** — Test user-visible behavior, keep tests independent, cover happy path + error cases
7. **Integration with Other Agents**

Remove all references to wrong-project testing patterns.

**Step 1: Write the agent file**

Replace full content of `.claude/agents/qa-expert.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/qa-expert.md
```

**Step 3: Commit**

```bash
git add .claude/agents/qa-expert.md
git commit -m "feat: update qa-expert agent for T3 Turbo testing conventions"
```

---

### Task 10: Update `documentation-engineer.md`

Remove DeFi/Cloudflare references, align to T3 Turbo.

**Files:**
- Modify: `.claude/agents/documentation-engineer.md`

**Content guidance:**

Frontmatter:
- name: `documentation-engineer`
- description: Use when creating, improving, or maintaining technical documentation including API docs, architecture guides, and developer onboarding.
- model: `inherit`

Body sections (~200-300 lines):
1. **Role** — Senior documentation engineer for T3 Turbo monorepo
2. **Documentation Structure** — `docs/` directory, `CLAUDE.md` files per package, `docs/standards/`, `docs/plans/`
3. **What to Document**:
   - tRPC router APIs (inputs, outputs, auth requirements)
   - Drizzle schema (tables, relations, validators)
   - Package APIs (`@acme/*` exports)
   - Architecture decisions
   - Onboarding guides
4. **Documentation Patterns**:
   - JSDoc for exported functions
   - Markdown co-located with features (`.md` files)
   - `CLAUDE.md` per package for AI context
5. **Quality Standards** — Accurate, concise, kept up to date with code changes
6. **Integration with Other Agents**

Remove all references to: DeFi, vaults, blockchain, Cloudflare, RockSolid.

**Step 1: Write the agent file**

Replace full content of `.claude/agents/documentation-engineer.md`.

**Step 2: Verify line count**

```bash
wc -l .claude/agents/documentation-engineer.md
```

**Step 3: Commit**

```bash
git add .claude/agents/documentation-engineer.md
git commit -m "feat: update documentation-engineer agent for T3 Turbo stack"
```

---

### Task 11: Delete absorbed agent files

Remove the original files that have been consolidated into other agents.

**Files:**
- Delete: `.claude/agents/ui-specialist.md`
- Delete: `.claude/agents/ui-designer.md`
- Delete: `.claude/agents/backend-api-specialist.md`
- Delete: `.claude/agents/api-designer.md`
- Delete: `.claude/agents/code-review-specialist.md`
- Delete: `.claude/agents/production-readiness-reviewer.md`
- Delete: `.claude/agents/expert-debugger.md`

**Step 1: Delete the 7 files**

```bash
git rm .claude/agents/ui-specialist.md \
      .claude/agents/ui-designer.md \
      .claude/agents/backend-api-specialist.md \
      .claude/agents/api-designer.md \
      .claude/agents/code-review-specialist.md \
      .claude/agents/production-readiness-reviewer.md \
      .claude/agents/expert-debugger.md
```

**Step 2: Verify only 9 agents remain**

```bash
ls .claude/agents/*.md | wc -l
# Expected: 9
ls .claude/agents/*.md
# Expected:
# backend-developer.md
# code-reviewer.md
# debugger.md
# documentation-engineer.md
# frontend-developer.md
# fullstack-developer.md
# nextjs-expert.md
# qa-expert.md
# typescript-pro.md
```

**Step 3: Commit**

```bash
git add -A .claude/agents/
git commit -m "chore: remove absorbed agent files after consolidation"
```

---

### Task 12: Cross-reference validation

Verify all agents reference each other correctly and no stale agent names remain.

**Step 1: Check for stale agent references**

Search all remaining agent files for references to deleted agent names:

```bash
grep -r "ui-specialist\|ui-designer\|backend-api-specialist\|api-designer\|code-review-specialist\|production-readiness-reviewer\|expert-debugger\|defi-protocol-analyst\|lagoon-vault-analyst\|lido-staking-vault-analyst\|solidity-contract-expert\|quant-analyst\|trend-analyst\|cloudflare-infrastructure-specialist\|documentation-specialist" .claude/agents/
# Expected: no matches
```

**Step 2: Check for off-stack technology references**

```bash
grep -ri "thirdweb\|cloudflare\|clerk\|rocksolid\|defi\|blockchain\|solidity\|wallet.connect\|zustand\|D1.database" .claude/agents/
# Expected: no matches
```

**Step 3: Verify each agent has valid frontmatter**

```bash
for f in .claude/agents/*.md; do
  echo "--- $f ---"
  head -5 "$f"
  echo ""
done
```

**Step 4: Commit any fixes if needed**

```bash
# Only if fixes were made:
git add .claude/agents/
git commit -m "fix: correct cross-references in consolidated agents"
```

---

## Summary

| Task | Action | Files |
|---|---|---|
| 1 | Delete 8 off-stack agents | -8 files |
| 2 | Rewrite `nextjs-expert` | 1 file |
| 3 | Consolidate `frontend-developer` | 1 file (absorbs 2) |
| 4 | Consolidate `backend-developer` | 1 file (absorbs 2) |
| 5 | Rewrite `fullstack-developer` | 1 file |
| 6 | Create `code-reviewer` | +1 file (absorbs 2) |
| 7 | Create `debugger` | +1 file (replaces 1) |
| 8 | Update `typescript-pro` | 1 file |
| 9 | Update `qa-expert` | 1 file |
| 10 | Update `documentation-engineer` | 1 file |
| 11 | Delete 7 absorbed agents | -7 files |
| 12 | Cross-reference validation | 0 files |
| **Total** | **22 agents → 9 agents** | **-15 files, +2 new, 7 modified** |
