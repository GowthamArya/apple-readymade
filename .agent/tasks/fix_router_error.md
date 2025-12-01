# Task: Fix Router Update Error in NotFound

## Status: Completed

## Objective
Fix the "Cannot update a component (`Router`) while rendering a different component (`NotFound`)" error.

## Changes Implemented

### 1. NotFound Component
- **File:** `app/not-found.tsx`
- **Change:** Refactored the countdown and redirect logic.
- **Details:**
    - Separated the countdown interval from the redirection logic.
    - The interval now strictly updates the `seconds` state.
    - A separate `useEffect` watches `seconds` and triggers `router.push("/")` when it reaches 0.
- **Reason:** The previous implementation was triggering `router.push` inside the `setSeconds` state updater callback. While technically inside an effect's callback, this pattern can sometimes lead to race conditions or unexpected behavior in React's batching, especially if the router update happens synchronously or interferes with the component's re-render cycle triggered by the state update. Separating the side effect (navigation) into its own `useEffect` is the standard and safer React pattern.

## Verification
- Visit a non-existent page (e.g., `/random-page`).
- The countdown should proceed from 5 to 0.
- At 0, the page should redirect to home without console errors.
