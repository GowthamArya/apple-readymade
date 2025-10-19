create table public.accounts (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text null,
  access_token text null,
  expires_at bigint null,
  token_type text null,
  scope text null,
  id_token text null,
  session_state text null,
  constraint accounts_pkey primary key (id),
  constraint accounts_user_id_fkey foreign KEY (user_id) references "user" (id)
) TABLESPACE pg_default;