import { supabase } from './supabaseServer';



export async function uploadVariantFileToStorage(file: File) {
  const { data, error } = await supabase.storage
    .from("products")
    .upload(`products/variants/`, file, { upsert: true });
  if (error) {
    throw error;
  }
  const { data: publicUrlData } = await supabase.storage
    .from("products")
    .getPublicUrl(data.path);
  return publicUrlData.publicUrl;
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
