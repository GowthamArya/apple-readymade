create table public.gst (
  id serial not null,
  percentage integer null,
  constraint gst_pkey primary key (id)
) TABLESPACE pg_default;