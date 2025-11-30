# Task: Fix Hydration Mismatch in Header

## Status: Completed

## Objective
Resolve the "Hydration failed" error caused by a mismatch between server-rendered and client-rendered HTML in the `AppHeader` component.

## Root Cause
The `NotifPopover` component (and potentially the Account section) was being rendered conditionally based on the `user` object from `useSession`.
- On the server (SSR), `user` is typically `undefined` (or `null`), so `NotifPopover` is not rendered.
- On the client, if the session is restored immediately (e.g., from `SessionProvider` props or cache), `user` might be present during the initial hydration render.
- This caused React to see a `span` (from `Badge` in `NotifPopover`) on the client where the server rendered a `div` (the `ThemeToggle` container), leading to a hydration mismatch.

## Changes Implemented

### 1. Header Component
- **File:** `app/components/Header.tsx`
- **Change:** Gated the rendering of `NotifPopover` and the user-dependent Account dropdown/Login button with a `mounted` state check.
- **Mechanism:** `mounted` is initialized to `false` and set to `true` in a `useEffect`. This ensures that these components are only rendered on the client *after* the initial hydration pass, guaranteeing that the initial client render matches the server render (where `mounted` is effectively false).

### 2. Bottom Navigation
- **File:** `app/components/BottomNav.tsx`
- **Change:** Proactively added a `mounted` check for the "Account"/"Login" label and link to prevent similar hydration mismatches in the mobile navigation.

## Verification
- The `mounted` check ensures that user-specific content is deferred until after the component has mounted on the client.
- This aligns the server-rendered HTML (which lacks user-specific content) with the initial client-rendered HTML.
- The "Hydration failed" error should be resolved.
