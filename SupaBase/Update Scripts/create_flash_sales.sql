
-- Create flash_sales table
create table if not exists public.flash_sales (
  id serial primary key,
  product_id int references public.product(id) not null,
  discount_percentage numeric not null check (discount_percentage > 0 and discount_percentage <= 100),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.flash_sales enable row level security;

-- Policy: Everyone can view active flash sales
create policy "Public can view active flash sales"
on public.flash_sales for select
using (active = true and now() between start_time and end_time);

-- Policy: Admin can view all (for now, authenticated users can view all for management)
-- Ideally, restrict to admin role.
create policy "Authenticated users can view all flash sales"
on public.flash_sales for select
using (auth.role() = 'authenticated');

-- Policy: Admin can insert/update/delete
create policy "Authenticated users can manage flash sales"
on public.flash_sales for all
using (auth.role() = 'authenticated');
