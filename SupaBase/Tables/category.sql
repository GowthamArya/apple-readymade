create table public.category (
  id serial not null,
  name character varying(100) not null,
  description character varying(255) null,
  img_url character varying(255) null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint category_pkey primary key (id),
  constraint category_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;