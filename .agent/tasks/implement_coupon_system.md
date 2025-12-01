# Task: Implement Coupon System

## Status: Completed

## Objective
1. Refactor `flash_sales` table to remove RLS (since Supabase Auth is not used).
2. Implement coupon application logic in the Checkout page.
3. Add a global banner to display active flash sale coupons.

## Changes Implemented

### 1. Database Schema
- **File:** `SupaBase/Update Scripts/refactor_flash_sales_no_rls.sql`
- **Change:** Created script to drop and recreate `flash_sales` table without RLS policies.
- **Reason:** User confirmed they don't use Supabase Auth for RLS.

### 2. Checkout Page
- **File:** `app/checkout/page.tsx`
- **Change:**
    - Added state for `couponCode` and `appliedCoupon`.
    - Added `applyCoupon` function to fetch coupon details from API.
    - Added UI for entering coupon code and displaying discount.
    - Updated `total` calculation to subtract `discountAmount`.

### 3. Flash Sale Banner
- **File:** `app/components/FlashSaleBanner.tsx` (New)
- **Functionality:** Fetches active flash sales and displays the first one in a dismissible alert at the top of the page.
- **Integration:** Added to `app/components/ClientLayout.tsx`.

### 4. API
- **File:** `app/api/flash-sales/route.ts`
- **Change:** Updated to handle `code` query parameter for validating coupons.

## Verification
- **Database:** Run the new SQL script.
- **Banner:** Verify that the banner appears with a coupon code if a flash sale exists.
- **Checkout:** Verify that entering a valid coupon code applies the discount and updates the total.
