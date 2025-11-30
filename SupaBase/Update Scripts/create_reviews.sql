
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

-- Policy: Authenticated users can create reviews
create policy "Authenticated users can create reviews"
on public.reviews for insert
with check (auth.uid() = user_id);

-- Policy: Users can update their own reviews
create policy "Users can update own reviews"
on public.reviews for update
using (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
create policy "Users can delete own reviews"
on public.reviews for delete
using (auth.uid() = user_id);
