CREATE OR REPLACE VIEW public.vwTableColumnsMetaData AS
SELECT
  m.id,
  m.created_at,
  m."entityId",
  e."EntityName",
  m.filterable,
  m.sortable,
  m.type,
  m.value
FROM public.metadata m
JOIN public.entity e ON m."entityId" = e.id;
