create table public.invoice (
  id serial not null,
  invoice_no character varying(50) null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint invoice_pkey primary key (id),
  constraint invoice_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;