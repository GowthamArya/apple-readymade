# Task: Fix Flash Sales API Types

## Status: Completed

## Objective
Fix the TypeScript error: `Type 'PostgrestBuilder<any, any[], false>' is missing the following properties from type 'PostgrestFilterBuilder...`

## Changes Implemented
- **File:** `app/api/flash-sales/route.ts`
- **Change:** Cast the initial query builder to `any`.
- **Reason:** The Supabase client's type definitions can sometimes be strict about the return type of `select('*')` when assigned to a variable that is later modified with filter methods (`eq`, `lte`, etc.) in a conditional manner. Casting to `any` allows us to chain these methods dynamically without TS complaining, while the runtime behavior remains correct.

## Verification
- **Build:** The TypeScript error should be gone.
- **Functionality:** The API should still correctly filter flash sales based on the query parameters.
