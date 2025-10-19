create table public.sessions (
  id uuid not null default gen_random_uuid (),
  session_token text not null,
  user_id uuid not null,
  expires timestamp without time zone not null,
  constraint sessions_pkey primary key (id),
  constraint sessions_session_token_key unique (session_token),
  constraint sessions_user_id_fkey foreign KEY (user_id) references "user" (id)
) TABLESPACE pg_default;