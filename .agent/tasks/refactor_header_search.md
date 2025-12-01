# Task: Refactor Header and Search

## Status: Completed

## Objective
1. Isolate `useSearchParams` usage into a separate `SearchInput` component to avoid forcing the entire `Header` (and thus `ClientLayout`) into dynamic rendering or requiring Suspense at the top level.
2. Fix the theme issue where the header might render with the wrong theme initially.
3. Ensure the search input follows the application theme.

## Changes Implemented

### 1. SearchInput Component
- **File:** `app/components/SearchInput.tsx` (New)
- **Functionality:**
    - Encapsulates `useSearchParams`, `useRouter`, and the search input UI.
    - Handles both desktop and mobile modes.
    - Uses Ant Design `Input` and `Button` which automatically inherit the theme from `ConfigProvider`.

### 2. Header Component
- **File:** `app/components/Header.tsx`
- **Change:**
    - Removed `useSearchParams` and `useRouter` (for search) from `Header`.
    - Replaced the inline search inputs with `<SearchInput />` wrapped in `<Suspense>`.
    - This allows `Header` to be rendered without needing top-level Suspense.

### 3. Client Layout
- **File:** `app/components/ClientLayout.tsx`
- **Change:**
    - Removed `<Suspense>` wrapper around `<Header />`.
    - Cleaned up the file structure.

## Verification
- **Theme:** The header and search input should now correctly follow the theme (light/dark) immediately upon load/refresh.
- **Search:** Search functionality should work as before (updating URL and navigating).
- **Performance:** `ClientLayout` is no longer blocked by `useSearchParams` in `Header`.
