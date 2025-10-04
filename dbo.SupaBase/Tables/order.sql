create table public.order (
  id serial not null,
  customer_id integer null,
  payment_id integer null,
  shipment_id integer null,
  invoice_id integer null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint orders_pkey primary key (id),
  constraint orders_customer_id_fkey foreign KEY (customer_id) references customer (id),
  constraint orders_invoice_id_fkey foreign KEY (invoice_id) references invoice (id),
  constraint orders_payment_id_fkey foreign KEY (payment_id) references payment (id),
  constraint orders_shipment_id_fkey foreign KEY (shipment_id) references shipment (id),
  constraint orders_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;