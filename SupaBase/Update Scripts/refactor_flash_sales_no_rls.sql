-- Drop existing flash_sales table if it exists
drop table if exists public.flash_sales;

-- Create new flash_sales table for coupons
create table public.flash_sales (
  id serial primary key,
  coupon_code text not null unique,
  discount_percentage numeric not null check (discount_percentage > 0 and discount_percentage <= 100),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Note: We are NOT enabling RLS or adding policies because the user specified they don't use Supabase Auth for RLS.
-- The application logic (API routes) should handle authentication and authorization.
