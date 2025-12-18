# React Standards

## Controller-View Pattern

Every feature follows a controller-view-hook pattern:

```
src/feature/
  feature.tsx            # Orchestration
  feature.hook.ts        # Business logic & state
  feature.hook.spec.ts   # Hook tests
  feature.view.tsx       # Pure presentation
  feature.view.spec.tsx  # View tests
  feature.md             # Documentation (optional), yes, lowercase file name

```

### Controller (feature.tsx)

Thin orchestration layer - compose hook + view only:

```tsx
export const HomeController = () => {
  const props = useHome();
  return <HomeView {...props} />;
};

```

### Hook (feature.hook.ts)

All business logic, API calls, external state, side effects:

```tsx
export const useHome = () => {
  const { data } = api.home.get.useQuery();
  const [state, setState] = useState();

  const handleAction = () => {
    // business logic
  };

  return { data, state, handleAction };
};

// Export inferred type for View
export type UseHomeProps = ReturnType<typeof useHome>;

```

### View (feature.view.tsx)

**Pure components only** - no state, no context, same props, same output.

**Why?** It makes development easier. Testing (mock props → assert output), debuggability (no hidden state), and refactorability (swap hooks without breaking UI) are all obvious, simple, and easy to achieve when the view and business logic are properly separated.

### Valid Local State

Local state is allowed for **ephemeral UI concerns only** - things that control how content displays, not what displays.

**✅ Valid:** Modal/dropdown open state, accordion expanded, form inputs (pre-submit), tab index, animations
**❌ Invalid:** Data fetching (`useQuery`), filtering/sorting, business calculations, auth state

### Examples

```tsx
// ❌ BAD - Business logic in View
export const ProductListView = ({ products }: UseProductListProps) => {
  const [search, setSearch] = useState("");
  const filtered = products.filter(p => p.name.includes(search)); // ❌
  const { data } = api.categories.list.useQuery(); // ❌
  return <div>{filtered.map(...)}</div>;
};

// ✅ GOOD - Business logic in Hook
export const useProductList = () => {
  const [search, setSearch] = useState("");
  const products = api.products.list.useQuery();
  const filtered = products.filter(p => p.name.includes(search));
  return { products: filtered, search, setSearch };
};

export const ProductListView = ({ products, search, setSearch }: UseProductListProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false); // ✅ UI state only
  return <div><input value={search} onChange={e => setSearch(e.target.value)} /></div>;
};

```

**Rule of thumb:** If it affects **what** data is shown → Hook. If it affects **how** it's shown → View.

**Note:** Trivial formatting (`name.toUpperCase()`) is fine in View. Complex filtering/sorting/calculations with testable business rules must go in Hook for unit testability.

If your view component contains a lot of valid local state, consider moving it to a separate hook and passing it in via the component hook. Including local state in the view component is useful when it is simple, but when it becomes complicated it should be moved out of the component for readability. 

## Folder Structure (Next.js)

Co-locate page components with routes, keep page-specific components in `_components`:

```
app/
  home/
    page.tsx                    # Route entry point
    _components/
      home.controller.tsx       # Orchestration
      home.hook.ts              # Single hook when page isn't complex
      home.hook.spec.ts         # Specs co-located
      home.view.tsx
      home.md                   # Docs co-located
      other-component.tsx       # Simple specific to the home page
      home-table/               # Complex component gets subdirectory
        home-table.tsx
        home-table.hook.ts
        home-table.view.tsx
        table-row.view.tsx      # Sub-views
    _hooks/                     # Multiple hooks for complex pages
      use-home-data.ts
      use-home-actions.ts
    _lib/                       # Page-specific helpers
      helpers.ts

```

**Rules:**

- `_components/` for page-specific components (**not reusable across pages**)
- Shared/reusable components go in root `components/` directory
- `_hooks/` for complex pages requiring multiple hooks
- `_lib/` for page-specific helpers/utilities
- Break complex pages into self-contained sections when possible
- Spec files (`.spec.ts`, `.spec.tsx`) co-located next to implementation files
- Documentation files (`.md`) co-located with features/components
- `_` prefix keeps folders private to Next.js routing

## Folder Structure (Vanilla React)

Same controller-view-hook pattern, just under `features/` instead of `app/route/_components/`:

```
src/
  features/
    home/
      home.tsx                  # Controller
      home.hook.ts              # Single hook for simple features
      home.hook.spec.ts
      home.view.tsx
      home.md
      components/               # Feature-specific components
        home-table/
          home-table.tsx
          home-table.hook.ts
          home-table.view.tsx
      hooks/                    # Multiple hooks for complex features
        use-home-data.ts
        use-home-actions.ts
      lib/                      # Feature-specific helpers
        helpers.ts
  components/                   # Shared/reusable components
  hooks/                        # Shared hooks
  lib/                          # Shared utilities

```

**Rules:**

- `features/` for self-contained feature modules
- `components/` subdirectory for feature-specific components
- Shared components/hooks/utils at root level
- Same controller-view-hook pattern applies
- Spec files and docs co-located with implementation
