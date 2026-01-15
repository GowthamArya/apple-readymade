import { supabase } from './supabaseServer';



export async function uploadVariantFileToStorage(file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(filePath, file, { upsert: true });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

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



export function fetchWithRelations(seletedTable: string, includeRelations: string[] = [], options?: { head?: boolean; count?: 'exact' | 'planned' | 'estimated' }) {
  var queryString = "*";
  if (!seletedTable) {
    throw new Error("Table name is required");
  }
  if (includeRelations.length > 0) {
    queryString = createIncludesQuery(includeRelations);
  }
  //console.log("Query String: ", queryString);
  return supabase.from(seletedTable).select(queryString, options);
};

export default supabase;
