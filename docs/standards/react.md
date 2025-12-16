# React Standards

## Controller-View Pattern

Every feature follows a three-file pattern:

```
feature/
  feature.tsx  # Orchestration
  feature.hook.ts        # Business logic & state
  feature.view.tsx       # Pure presentation
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

**Must be deterministic** - same props = same output.

**Why?** Easy testing (mock props → assert output), debuggability (no hidden state), and refactorability (swap hooks without breaking UI).

#### Valid Local State

Local state is allowed for **ephemeral UI concerns only** - things that control how content displays, not what displays.

**✅ Valid:** Modal/dropdown open state, accordion expanded, form inputs (pre-submit), tab index, animations
**❌ Invalid:** Data fetching (`useQuery`), filtering/sorting, business calculations, auth state

#### Examples

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

**Note:** Trivial formatting (`name.toUpperCase()`, `price.toFixed(2)`) is fine in View. Complex filtering/sorting/calculations with testable business rules must go in Hook for unit testability.

## Folder Structure (Next.js)

Co-locate page components with routes, keep page-specific components in `_components`:

```
app/
  home/
    page.tsx                    # Route entry point
    _components/                # Page-specific components only
      home.controller.tsx
      home.hook.ts              # Single hook when page isn't complex
      home.hook.spec.ts         # Spec file co-located with implementation
      home.view.tsx
      home.view.spec.tsx
      home.md                   # Documentation co-located with feature
      other-component.tsx       # Simple component used only on home page
      data-table/               # Complex component with sub-views
        data-table.tsx          # Controller
        data-table.hook.ts      # Business logic
        data-table.hook.spec.ts
        data-table.view.tsx     # Main view
        data-table.view.spec.tsx
        data-table.md           # Component-specific documentation
        table-header.view.tsx   # Sub-view
        table-row.view.tsx      # Sub-view
    _hooks/                     # Complex pages: split into multiple hooks
      use-home-data.ts
      use-home-data.spec.ts
      use-home-actions.ts
      use-home-actions.spec.ts
    _lib/                       # Page-specific helpers/utilities
      helpers.ts
      helpers.spec.ts
  dashboard/
    page.tsx
    _components/
      dashboard.controller.tsx
      dashboard.hook.ts
      dashboard.view.tsx
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
