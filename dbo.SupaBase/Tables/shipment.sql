create table public.shipment (
  id serial not null,
  address_id integer null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint shipment_pkey primary key (id),
  constraint shipment_address_id_fkey foreign KEY (address_id) references address (id),
  constraint shipment_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;