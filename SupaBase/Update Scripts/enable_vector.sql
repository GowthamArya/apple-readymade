-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Add a column to the variant table to store the vector embeddings
-- Google Gemini text-embedding-004 uses 768 dimensions
alter table public.variant 
add column if not exists embedding vector(768);

-- Create a function to search for similar variants
create or replace function match_variants (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id int,
  product_id int,
  sku text,
  size text,
  color text,
  price numeric,
  image_urls text[],
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    variant.id,
    variant.product_id,
    variant.sku::text,
    variant.size::text,
    variant.color::text,
    variant.price,
    variant.image_urls,
    1 - (variant.embedding <=> query_embedding) as similarity
  from variant
  where 1 - (variant.embedding <=> query_embedding) > match_threshold
  order by variant.embedding <=> query_embedding
  limit match_count;
end;
$$;
