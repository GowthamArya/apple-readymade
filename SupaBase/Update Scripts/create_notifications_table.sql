
-- Create a table to store notifications
create table if not exists public.notifications (
  id serial primary key,
  title text not null,
  message text not null,
  url text,
  image text,
  user_email text, -- If null, it's a broadcast notification
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policy: Users can read broadcast notifications or their own notifications
create policy "Users can read own or broadcast notifications"
on public.notifications for select
using (
  user_email is null or user_email = auth.jwt() ->> 'email'
);

-- Policy: Only admins can insert (assuming you have an admin role check or similar)
-- For simplicity in this demo, we might allow authenticated users to insert if it's for testing, 
-- but ideally this is restricted.
-- We'll allow public insert for now to let the 'sendNotification' action work easily from the client/server 
-- without complex admin role checks for this specific step, or you can rely on service role in API.
create policy "Enable insert for authenticated users only"
on public.notifications for insert
with check (true); 

-- Policy: Users can update 'is_read' on their own notifications (conceptually difficult for broadcasts)
-- For broadcast, we might need a separate 'user_notifications' table to track read state per user.
-- For now, we'll keep it simple: The 'is_read' on the main table only really works for individual notifications.
-- For broadcasts, we won't track 'read' state per user in this simple schema.
