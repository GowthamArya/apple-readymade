
-- Create orders table
create table if not exists public.orders (
  id serial primary key,
  user_id uuid references auth.users(id) not null,
  total_amount numeric not null,
  status text check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')) default 'pending',
  shipping_address jsonb,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp with time zone default now()
);

-- Create order_items table
create table if not exists public.order_items (
  id serial primary key,
  order_id int references public.orders(id) not null,
  product_id int references public.product(id) not null,
  variant_id int references public.variant(id) not null,
  quantity int not null,
  price numeric not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policy: Users can view their own orders
create policy "Users can view own orders"
on public.orders for select
using (auth.uid() = user_id);

-- Policy: Users can view their own order items
create policy "Users can view own order items"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

-- Policy: Authenticated users can insert orders (for now, ideally service role)
create policy "Authenticated users can insert orders"
on public.orders for insert
with check (auth.uid() = user_id);

create policy "Authenticated users can insert order items"
on public.order_items for insert
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);
