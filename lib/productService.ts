import { fetchWithRelations } from "@/lib/supabase";

export async function getProduct() {
  const allDefaultVariants = await fetchWithRelations("variant", ["product.category"])
    .eq("is_default", true)
    .order("created_on", { ascending: false });

  if (allDefaultVariants.error) {
    console.error(allDefaultVariants.error.message);
    return [];
  }

  return allDefaultVariants.data || [];
}