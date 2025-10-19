create table public.favourite (
  id serial not null,
  variant_id integer null,
  customer_id integer null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint favourite_pkey primary key (id),
  constraint favourite_customer_id_fkey foreign KEY (customer_id) references customer (id),
  constraint favourite_status_id_fkey foreign KEY (status_id) references status (id),
  constraint favourite_variant_id_fkey foreign KEY (variant_id) references variant (id)
) TABLESPACE pg_default;