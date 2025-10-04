create table public.product (
  id serial not null,
  name character varying(100) not null,
  description text null,
  category_id integer null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint product_pkey primary key (id),
  constraint product_category_id_fkey foreign KEY (category_id) references category (id),
  constraint product_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;