create table public.customer (
  id serial not null,
  name character varying(100) not null,
  email character varying(255) not null,
  phone character varying(20) null,
  age integer null,
  profile_img character varying(255) null,
  role_id integer null,
  status_id integer null,
  created_by integer null,
  updated_by integer null,
  created_on timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_on timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint customers_pkey primary key (id),
  constraint customers_email_key unique (email),
  constraint customers_role_id_fkey foreign KEY (role_id) references role (id),
  constraint customers_status_id_fkey foreign KEY (status_id) references status (id)
) TABLESPACE pg_default;