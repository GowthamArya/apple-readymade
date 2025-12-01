# Task: Add Flash Sales Link and Fix Theme Issue

## Status: Completed

## Objective
1. Add a "Flash Sales" link for admins in the Header.
2. Fix the issue where the Header theme stays light on refresh even when dark mode is selected.

## Changes Implemented

### 1. Header Component
- **File:** `app/components/Header.tsx`
- **Change:** Added "Flash Sales" link to the admin menu (both desktop dropdown and mobile drawer).
- **Link:** `/admin/flash-sales`

### 2. Client Layout
- **File:** `app/components/ClientLayout.tsx`
- **Change:** Removed the redundant inner `ConfigProvider` and `App` components.
- **Reason:** `ThemeContext` already provides `ConfigProvider` and `App` with the correct theme. The inner `ConfigProvider` in `ClientLayout` was resetting the theme to default (light) for its children (including `Header`), causing the "stuck" light theme issue.
- **Fix:** Cleaned up the file structure which was corrupted during editing.

## Verification
- **Admin Link:** Admins should now see "Flash Sales" in their account menu.
- **Theme:** Refreshing the page in dark mode should now correctly render the Header in dark mode, as it now consumes the correct theme context from the outer `ConfigProvider`.
