# Task: Implement Scroll to Top

## Status: Completed

## Objective
Ensure that when a user navigates to a new page (e.g., collections, variants), the page scrolls to the top instead of maintaining the previous scroll position.

## Changes Implemented

### 1. ScrollToTop Component
- **File:** `app/components/ScrollToTop.tsx` (New)
- **Functionality:**
    - Uses `usePathname` to detect route changes.
    - Uses `useEffect` to trigger `window.scrollTo(0, 0)` whenever the pathname changes.
    - Returns `null` as it renders nothing visible.

### 2. Client Layout
- **File:** `app/components/ClientLayout.tsx`
- **Change:**
    - Imported `ScrollToTop`.
    - Added `<ScrollToTop />` inside the provider tree (inside `LoadingProvider`).
    - This ensures it's active on every page load and navigation event.

## Verification
- Navigate between pages (e.g., Home -> Collections -> Product Details).
- The new page should always start at the top of the viewport.
