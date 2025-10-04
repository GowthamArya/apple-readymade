create table public.role (
  id serial not null,
  name character varying(100) not null,
  description character varying(255) null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint role_pkey primary key (id)
) TABLESPACE pg_default;