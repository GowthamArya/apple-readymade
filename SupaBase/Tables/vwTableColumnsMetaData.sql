CREATE OR REPLACE VIEW public.vwTableColumnsMetaData AS
SELECT
  m.*,
  e.name AS EntityName
FROM public.metadata m
JOIN public.entity e ON m.entity_id = e.id;
