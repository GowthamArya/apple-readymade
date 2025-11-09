import { fetchWithRelations } from "@/lib/supabase";

export async function getProduct({searchQuery}: any) {
  const allDefaultVariants = await fetchWithRelations("variant", ["product.category"])
    .eq("is_default", true)
    .ilike("product.name", `%${searchQuery || ""}%`)
    .order("created_on", { ascending: false });

  if (allDefaultVariants.error) {
    console.error(allDefaultVariants.error.message);
    return [];
  }

  return allDefaultVariants.data || [];
}