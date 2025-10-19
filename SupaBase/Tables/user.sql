create table public.user (
  id uuid not null default gen_random_uuid (),
  name text null,
  email text null,
  image_url text null,
  age smallint null,
  phone character varying null default ''::character varying,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
) TABLESPACE pg_default;