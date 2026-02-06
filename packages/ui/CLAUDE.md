# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

`@acme/ui` is a shared component library built on shadcn/ui (new-york style), Radix UI primitives, and Tailwind CSS v4. Components are consumed by all apps in the monorepo (Next.js, Expo via NativeWind, Tanstack Start).

## Commands

```bash
# From monorepo root
pnpm ui-add                # Add a new shadcn/ui component (interactive CLI)

# From this package
pnpm lint                  # ESLint check
pnpm typecheck             # TypeScript check
pnpm ui-add                # Add shadcn component + auto-format
```

## Adding Components

shadcn CLI is configured via `components.json`. When adding a new component:

1. Run `pnpm ui-add` — the CLI places files in `src/`
2. Add an export entry in `package.json` `"exports"` field (e.g., `"./new-component": "./src/new-component.tsx"`)
3. Components are imported by apps as `@acme/ui/component-name`

The `cn` utility (class merging via CVA + tailwind-merge) is exported from the package root: `import { cn } from "@acme/ui"`.

## Component Patterns

- **Styling**: CVA (`class-variance-authority`) for variants, `cn()` for class merging, Tailwind v4 classes
- **Radix imports**: Use `radix-ui` package directly (e.g., `import { Slot as SlotPrimitive } from "radix-ui"`)
- **Props pattern**: Extend `React.ComponentProps<"element">` intersected with `VariantProps<typeof variants>` — no `React.forwardRef` needed (React 19)
- **`data-slot` attributes**: All components use `data-slot="component-name"` for CSS targeting and composition
- **`"use client"` directive**: Required on components with state, effects, or browser APIs (theme, toast, field). Omit for pure presentational components (button, input, label)

## Theme System

- Theme CSS variables defined in `tooling/tailwind/theme.css` using oklch colors
- `ThemeProvider` + `useTheme()` manage light/dark/auto modes via localStorage and class toggling
- `themeDetectorScript` is an inline script for flash-free SSR theme detection — must be included in `<head>`
- Theme modes cycle: auto → dark → light (or auto → light → dark when system is dark)
- `Toaster` (sonner) reads theme from `useTheme()` — must be inside `ThemeProvider`

## Key Dependencies

- `class-variance-authority` — component variant definitions
- `tailwind-merge` — intelligent Tailwind class merging
- `radix-ui` — accessible UI primitives
- `sonner` — toast notifications
- `zod/v4` — used in theme for schema validation (peer dependency)
