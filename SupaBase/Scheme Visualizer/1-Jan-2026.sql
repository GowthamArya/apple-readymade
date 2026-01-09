-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  provider text NOT NULL,
  provideraccountid text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.address (
  id integer NOT NULL DEFAULT nextval('address_id_seq'::regclass),
  line1 character varying NOT NULL,
  line2 character varying,
  street character varying,
  city character varying,
  pincode character varying,
  status_id integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  user_id uuid,
  state text,
  country text DEFAULT 'India'::text,
  CONSTRAINT address_pkey PRIMARY KEY (id),
  CONSTRAINT address_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id),
  CONSTRAINT address_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.cart (
  id integer NOT NULL DEFAULT nextval('cart_id_seq'::regclass),
  variant_id integer,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  quantity integer NOT NULL DEFAULT 1,
  user_id uuid,
  CONSTRAINT cart_pkey PRIMARY KEY (id),
  CONSTRAINT cart_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.variant(id),
  CONSTRAINT cart_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id),
  CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.category (
  id integer NOT NULL DEFAULT nextval('category_id_seq'::regclass),
  name character varying NOT NULL,
  description character varying,
  img_url character varying,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT category_pkey PRIMARY KEY (id),
  CONSTRAINT category_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.customer (
  id integer NOT NULL DEFAULT nextval('customers_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone character varying,
  age integer,
  profile_img character varying,
  role_id integer,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT customer_pkey PRIMARY KEY (id),
  CONSTRAINT customers_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id),
  CONSTRAINT customers_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.entity (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL UNIQUE,
  created_on timestamp with time zone NOT NULL DEFAULT now(),
  updated_on timestamp without time zone DEFAULT now(),
  created_by timestamp without time zone DEFAULT now(),
  updated_by timestamp without time zone DEFAULT now(),
  CONSTRAINT entity_pkey PRIMARY KEY (id)
);
CREATE TABLE public.error_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  message text,
  stack text,
  url text,
  user_agent text,
  created_on timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT error_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.favourite (
  id integer NOT NULL DEFAULT nextval('favourite_id_seq'::regclass),
  variant_id integer,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  user_id uuid,
  CONSTRAINT favourite_pkey PRIMARY KEY (id),
  CONSTRAINT favourite_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.variant(id),
  CONSTRAINT favourite_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id),
  CONSTRAINT favourite_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.flash_sales (
  id integer NOT NULL DEFAULT nextval('flash_sales_id_seq'::regclass),
  coupon_code text NOT NULL UNIQUE,
  discount_percentage numeric NOT NULL CHECK (discount_percentage > 0::numeric AND discount_percentage <= 100::numeric),
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flash_sales_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gst (
  id integer NOT NULL DEFAULT nextval('gst_id_seq'::regclass),
  percentage integer,
  CONSTRAINT gst_pkey PRIMARY KEY (id)
);
CREATE TABLE public.invoice (
  id integer NOT NULL DEFAULT nextval('invoice_id_seq'::regclass),
  invoice_no character varying,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT invoice_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.loyalty_points (
  id integer NOT NULL DEFAULT nextval('loyalty_points_id_seq'::regclass),
  user_id uuid NOT NULL,
  points integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type = ANY (ARRAY['earn'::text, 'redeem'::text, 'refund'::text])),
  order_id text,
  amount numeric,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT loyalty_points_pkey PRIMARY KEY (id),
  CONSTRAINT loyalty_points_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.metadata (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_on timestamp with time zone NOT NULL DEFAULT now(),
  entity_id bigint NOT NULL,
  filterable boolean,
  sortable boolean,
  type text DEFAULT 'string'::text,
  value text,
  required boolean DEFAULT false,
  CONSTRAINT metadata_pkey PRIMARY KEY (id),
  CONSTRAINT metadata_entityId_fkey FOREIGN KEY (entity_id) REFERENCES public.entity(id)
);
CREATE TABLE public.notifications (
  id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  title text NOT NULL,
  message text NOT NULL,
  url text,
  image text,
  user_email text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.user(email)
);
CREATE TABLE public.order_items (
  id integer NOT NULL DEFAULT nextval('order_items_id_seq'::regclass),
  order_id integer NOT NULL,
  product_id integer NOT NULL,
  variant_id integer NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id),
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.variant(id)
);
CREATE TABLE public.orders (
  id integer NOT NULL DEFAULT nextval('orders_id_seq1'::regclass),
  user_id uuid NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text, 'refunded'::text])),
  shipping_address jsonb,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp with time zone DEFAULT now(),
  points_redeemed integer DEFAULT 0,
  points_amount numeric DEFAULT 0,
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  address_id integer,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id),
  CONSTRAINT orders_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.payment (
  id integer NOT NULL DEFAULT nextval('payment_id_seq'::regclass),
  method character varying NOT NULL,
  amount numeric,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payment_pkey PRIMARY KEY (id),
  CONSTRAINT payment_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.product (
  id integer NOT NULL DEFAULT nextval('product_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  category_id integer,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT product_pkey PRIMARY KEY (id),
  CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id),
  CONSTRAINT product_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.promo_code (
  id integer NOT NULL DEFAULT nextval('promo_code_id_seq'::regclass),
  name character varying,
  code character varying NOT NULL,
  discount numeric,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT promo_code_pkey PRIMARY KEY (id),
  CONSTRAINT promo_code_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.push_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT push_subscriptions_userId_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.reviews (
  id integer NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
  user_id uuid NOT NULL,
  product_id integer NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id),
  CONSTRAINT reviews_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.role (
  id integer NOT NULL DEFAULT nextval('role_id_seq'::regclass),
  name character varying NOT NULL,
  description character varying,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT role_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sessiontoken text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  expires timestamp without time zone NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.shipment (
  id integer NOT NULL DEFAULT nextval('shipment_id_seq'::regclass),
  address_id integer,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT shipment_pkey PRIMARY KEY (id),
  CONSTRAINT shipment_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id),
  CONSTRAINT shipment_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.status (
  id integer NOT NULL DEFAULT nextval('status_id_seq'::regclass),
  name character varying NOT NULL,
  description character varying,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT status_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  image_url text,
  age smallint,
  phone character varying DEFAULT ''::character varying,
  created_on timestamp with time zone DEFAULT now(),
  updated_on timestamp with time zone DEFAULT now(),
  role_id integer,
  emailVerified timestamp with time zone,
  image text,
  email_verified timestamp with time zone,
  theme_preference text DEFAULT 'system'::text,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id)
);
CREATE TABLE public.variant (
  id integer NOT NULL DEFAULT nextval('variant_id_seq'::regclass),
  product_id integer,
  sku character varying,
  size character varying,
  color character varying,
  price numeric,
  mrp numeric,
  gst integer,
  stock integer,
  status_id integer,
  created_by integer,
  updated_by integer,
  created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  is_default boolean NOT NULL DEFAULT false,
  image_urls ARRAY,
  embedding USER-DEFINED,
  CONSTRAINT variant_pkey PRIMARY KEY (id),
  CONSTRAINT variant_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id),
  CONSTRAINT variant_gst_fkey FOREIGN KEY (gst) REFERENCES public.gst(id),
  CONSTRAINT variant_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id)
);
CREATE TABLE public.verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamp without time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier, token)
);

create view public.vwtablecolumnsmetadata as
select
  m.id,
  m.created_on as created_at,
  m.entity_id as "entityId",
  e.name as "EntityName",
  m.filterable,
  m.sortable,
  m.type,
  m.value
from
  metadata m
  join entity e on m.entity_id = e.id;


-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE next_auth.accounts (
  userId uuid,
  type text NOT NULL,
  provider text NOT NULL,
  providerAccountId text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  CONSTRAINT accounts_userId_fkey FOREIGN KEY (userId) REFERENCES next_auth.users(id)
);
CREATE TABLE next_auth.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  userId uuid,
  expires timestamp without time zone NOT NULL,
  sessionToken text NOT NULL UNIQUE,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_userId_fkey FOREIGN KEY (userId) REFERENCES next_auth.users(id)
);
CREATE TABLE next_auth.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text UNIQUE,
  name text,
  image text,
  email_verified boolean,
  emailVerified timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE next_auth.verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamp without time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier, token)
);


-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE realtime.messages (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_06 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_06_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_07 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_07_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_08 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_08_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_09 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_09_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_10 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_10_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_11 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_11_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.messages_2026_01_12 (
  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT messages_2026_01_12_pkey PRIMARY KEY (id, inserted_at)
);
CREATE TABLE realtime.schema_migrations (
  version bigint NOT NULL,
  inserted_at timestamp without time zone,
  CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
);
CREATE TABLE realtime.subscription (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  subscription_id uuid NOT NULL,
  entity regclass NOT NULL,
  filters ARRAY NOT NULL DEFAULT '{}'::realtime.user_defined_filter[],
  claims jsonb NOT NULL,
  claims_role regrole NOT NULL DEFAULT realtime.to_regrole((claims ->> 'role'::text)),
  created_at timestamp without time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT subscription_pkey PRIMARY KEY (id)
);