
-- Add points columns to orders table
alter table public.orders 
add column if not exists points_redeemed int default 0,
add column if not exists points_amount numeric default 0;
