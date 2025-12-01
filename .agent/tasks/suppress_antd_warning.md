# Task: Suppress AntD Warning

## Status: Completed

## Objective
Suppress the console warning: `[antd: message] Static function can not consume context like dynamic theme...`

## Changes Implemented
- **File:** `app/components/ErrorLogger.tsx`
- **Change:** Updated the console.error override to filter out messages containing "Static function can not consume context".
- **Reason:** This warning is often a false positive or a known issue when using Ant Design's static methods (like `message.success`) alongside `App` component context in certain Next.js setups. Since we are already using `App.useApp()` in most places but might have some legacy or library calls triggering this, suppressing it in the logger prevents log noise.

## Verification
- **Console:** The warning should no longer appear in the browser console or be sent to the logs API.
