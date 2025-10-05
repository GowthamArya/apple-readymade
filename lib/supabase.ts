import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadVariantFileToStorage(productId: string, variantId: string, file: File) {
  const { data, error } = await supabase.storage
    .from("products")
    .upload(`products/${productId}/variants/${variantId}/${file.name}`, file, { upsert: true });
  if (error) {
    throw error;
  }
  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);
  return publicUrlData;
}

function createIncludesQuery(includeRelations: string[]): string {
  if (includeRelations.length === 0) return '*';

  const relationsSelect = includeRelations.map(relation => {
    if (relation.includes('.')) {
      const parts = relation.split('.');
      // inner join syntax relation build 
      return `${parts[0]}!inner(${createIncludesQuery([parts.slice(1).join('.')])})`;
    } else {
      // simple relation inner join
      return `${relation}!inner(*)`;
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
