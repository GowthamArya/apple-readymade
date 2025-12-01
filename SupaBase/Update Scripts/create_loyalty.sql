
-- Create loyalty_points table
create table if not exists public.loyalty_points (
  id serial primary key,
  user_id uuid references auth.users(id) not null,
  points int not null,
  transaction_type text check (transaction_type in ('earn', 'redeem', 'refund')) not null,
  order_id text, -- Can be null for manual adjustments or other types
  amount numeric, -- The monetary value associated with the transaction
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.loyalty_points enable row level security;

-- Function to calculate user's total points
create or replace function get_user_points(user_uuid uuid)
returns int
language plpgsql
as $$
declare
  total_points int;
begin
  select coalesce(sum(points), 0) into total_points
  from public.loyalty_points
  where user_id = user_uuid;
  
  return total_points;
end;
$$;
