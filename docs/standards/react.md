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
    _components/                # Page-specific components
      home.controller.tsx
      home.hook.ts
      home.view.tsx
      other-component.tsx
  dashboard/
    page.tsx
    _components/
      dashboard.controller.tsx
      dashboard.hook.ts
      dashboard.view.tsx
```

**Rules:**
- `page.tsx` imports from `_components` folder
- Shared components go in root `components/` directory
- `_components` prefix keeps them private to Next.js routing
