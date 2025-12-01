# Task: Fix Hydration, Smooth Scroll, and Cleanup

## Status: Completed

## Objective
1. Fix hydration mismatch error in `VariantDetails` caused by random `name` attribute generation in Ant Design `Radio.Group`.
2. Implement smooth scrolling for page navigation.
3. Remove unused dependencies (`mongodb`, `nodemailer`).

## Changes Implemented

### 1. Variant Details
- **File:** `app/variant/Details.tsx`
- **Change:** Added `name="variant-selector"` to `Radio.Group`.
- **Reason:** Ant Design generates a random name if not provided, which causes mismatch between server (one random ID) and client (another random ID). Providing a static name fixes this.

### 2. ScrollToTop
- **File:** `app/components/ScrollToTop.tsx`
- **Change:** Updated `window.scrollTo` to use `{ top: 0, behavior: 'smooth' }`.
- **Reason:** User requested smooth scrolling.

### 3. Dependency Cleanup
- **Command:** `npm uninstall mongodb nodemailer`
- **Result:** Unused packages removed from `package.json`.

## Verification
- **Hydration:** The console error about hydration mismatch should be gone on the variant details page.
- **Scroll:** Navigating between pages should now scroll to the top smoothly.
- **Dependencies:** `mongodb` and `nodemailer` should be absent from `package.json`.
