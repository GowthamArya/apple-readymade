# Task: Refactor Flash Sales to Coupons

## Status: Completed

## Objective
Refactor Flash Sales logic to manage time-limited coupons instead of product-specific discounts.

## Changes Implemented

### 1. Database Schema
- **File:** `SupaBase/Update Scripts/refactor_flash_sales.sql`
- **Change:** Dropped old `flash_sales` table (product-based) and created new one (coupon-based).
- **Schema:** `id`, `coupon_code`, `discount_percentage`, `start_time`, `end_time`, `active`.

### 2. Admin UI
- **File:** `app/admin/flash-sales/page.tsx`
- **Change:**
    - Removed product fetching and selection.
    - Added `coupon_code` input field.
    - Updated table columns to show Coupon Code.
    - Updated API calls to send/receive `coupon_code`.

### 3. API
- **File:** `app/api/flash-sales/route.ts`
- **Change:**
    - Updated `GET` to select from new schema (no product join).
    - Updated `POST` to accept `coupon_code` and insert into new schema.

### 4. Frontend (Variant Details)
- **File:** `app/variant/Details.tsx` & `app/variant/[id]/page.tsx`
- **Change:**
    - Removed all flash sale logic (timer, price calculation, fetching).
    - The page now behaves normally, as flash sales are now just coupons to be applied at checkout (or via a global banner if implemented later).

## Verification
- **Admin:** Can create a flash sale with a coupon code.
- **Frontend:** Variant page loads without errors (no invalid flash sale fetching).
- **Database:** New `flash_sales` table exists and is populated.
