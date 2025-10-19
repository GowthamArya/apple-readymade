create table public.promo_code (
  id serial not null,
  name character varying(50) null,
  code character varying(50) not null,
  discount numeric(5, 2) null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint promo_code_pkey primary key (id),
  constraint promo_code_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;