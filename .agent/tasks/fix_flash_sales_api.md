# Task: Fix Flash Sales API

## Status: Completed

## Objective
Fix the `showAll` undefined error in `app/api/flash-sales/route.ts`.

## Changes Implemented
- **File:** `app/api/flash-sales/route.ts`
- **Change:** Added `const showAll = searchParams.get('all') === 'true';` before it is used.
- **Reason:** The variable `showAll` was being used but not defined in the scope after the previous refactor.

## Verification
- **API:** `GET /api/flash-sales` should now work correctly without crashing.
- **Banner:** The banner should be able to fetch active sales.
- **Admin:** The admin page should be able to fetch all sales (including inactive ones) using `?all=true`.
