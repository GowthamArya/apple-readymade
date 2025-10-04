create table public.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp without time zone not null,
  constraint verification_tokens_pkey primary key (identifier, token)
) TABLESPACE pg_default;