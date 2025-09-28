import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.APPLE_DB_SUPABASE_URL!,
  process.env.APPLE_DB_SUPABASE_ANON_KEY!
);

function createIncludesQuery(includeRelations: string[]): string {
  if (includeRelations.length === 0) return '*';

  const relationsSelect = includeRelations.map(relation => {
    if (relation.includes('.')) {
      const parts = relation.split('.');
      return `${parts[0]}(${createIncludesQuery([parts.slice(1).join('.')])})`;
    } else {
      return `${relation}(*)`;
    }
  }).join(',');

  return `*,${relationsSelect}`;
}


export function fetchWithRelations(seletedTable: string, includeRelations: string[] = []) {
  var queryString = "*";
  if(!seletedTable){
    throw new Error("Table name is required");
  }
  if (includeRelations.length > 0) {
    queryString = createIncludesQuery(includeRelations);
  }
  //console.log("Query String: ", queryString);
  return supabase.from(seletedTable).select(queryString);
};

export default supabase;
