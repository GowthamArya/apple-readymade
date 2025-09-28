import { fetchWithRelations } from "@/lib/supabase";

export async function getProduct() {
  const allDefaultVariants = await fetchWithRelations("variant", ["product.category"])
    .eq("is_default", true)
    .range(0, 10)
    .order("created_on", { ascending: false });

  if (allDefaultVariants.error) {
    throw new Error(allDefaultVariants.error.message);
  }
  return allDefaultVariants.data;
}
