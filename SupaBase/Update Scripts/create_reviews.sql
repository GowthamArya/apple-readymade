
-- Create reviews table
create table if not exists public.reviews (
  id serial primary key,
  user_id uuid references auth.users(id) not null,
  product_id int references public.product(id) not null,
  rating int check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policy: Anyone can read reviews
create policy "Reviews are public"
on public.reviews for select
using (true);
