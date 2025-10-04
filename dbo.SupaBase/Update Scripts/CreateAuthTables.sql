create schema if not exists next_auth;

DROP TABLE IF EXISTS next_auth.verification_tokens;
DROP TABLE IF EXISTS next_auth.sessions;
DROP TABLE IF EXISTS next_auth.accounts;
DROP TABLE IF EXISTS next_auth.users;

create table next_auth.users (
  id uuid not null default gen_random_uuid (),
  email text null,
  name text null,
  image text null,
  email_verified boolean null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
) TABLESPACE pg_default;


create table next_auth.accounts (
  "userId" uuid null,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text null,
  access_token text null,
  expires_at bigint null,
  token_type text null,
  scope text null,
  id_token text null,
  session_state text null,
  constraint accounts_userId_fkey foreign KEY ("userId") references next_auth.users (id) on delete CASCADE
) TABLESPACE pg_default;


create table next_auth.sessions (
  id uuid not null default gen_random_uuid (),
  "userId" uuid null,
  expires timestamp without time zone not null,
  "sessionToken" text not null,
  constraint sessions_pkey primary key (id),
  constraint sessions_session_token_key unique ("sessionToken"),
  constraint sessions_userId_fkey foreign KEY ("userId") references next_auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create table next_auth.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp without time zone not null,
  constraint verification_tokens_pkey primary key (identifier, token)
) TABLESPACE pg_default;

create policy "Allow all" on next_auth.users for all using (true);
