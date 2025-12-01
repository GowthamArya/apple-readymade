-- Drop existing flash_sales table if it exists (since we are changing the schema entirely)
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

-- Enable RLS
alter table public.flash_sales enable row level security;

-- Policy: Everyone can view active flash sales (e.g. for banners)
create policy "Public can view active flash sales"
on public.flash_sales for select
using (active = true and now() between start_time and end_time);

-- Policy: Authenticated users (Admins) can view all
create policy "Authenticated users can view all flash sales"
on public.flash_sales for select
using (auth.role() = 'authenticated');

-- Policy: Authenticated users (Admins) can manage
create policy "Authenticated users can manage flash sales"
on public.flash_sales for all
using (auth.role() = 'authenticated');
