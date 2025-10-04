create table public.order_item (
  id serial not null,
  order_id integer null,
  variant_id integer null,
  quantity integer null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint order_item_pkey primary key (id),
  constraint order_item_order_id_fkey foreign KEY (order_id) references "order" (id),
  constraint order_item_status_id_fkey foreign KEY (status_id) references status (id),
  constraint order_item_variant_id_fkey foreign KEY (variant_id) references variant (id)
) TABLESPACE pg_default;