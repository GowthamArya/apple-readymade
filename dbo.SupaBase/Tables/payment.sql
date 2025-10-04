create table public.payment (
  id serial not null,
  method character varying(50) not null,
  amount numeric(12, 2) null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint payment_pkey primary key (id),
  constraint payment_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;