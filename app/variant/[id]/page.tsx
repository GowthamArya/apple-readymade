import { supabase } from "@/lib/supabaseServer";
import VariantDetails from "../Details";
import { getSimilarVariants } from "@/lib/productService";
import redis from "@/lib/infrastructure/redis";

export default async function VariantPage(props: PageProps<"/variant/[id]">) {
  const id = (await (await props).params).id;
  async function fetchVariant() {
    const cacheKey = `variant-details:${id}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error("Redis cache error:", e);
    }

    const { data: productData } = await supabase.from("variant").select("product_id, product(*)").eq("id", id).single();
    const product_id = productData?.product_id;
    const { data, error } = await supabase.from("variant").select("*").eq("product_id", product_id);
    if (error) throw error;

    const recommendedVariants = await getSimilarVariants(Number(id));

    const result = { variants: data || [], product: productData?.product, recommendedVariants };

    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    } catch (e) {
      console.error("Redis set error:", e);
    }

    return result;
  }
  const variantData = await fetchVariant();
  return <>
    <VariantDetails
      variants={variantData.variants}
      variant_id={id}
      productData={variantData.product}
      recommendedVariants={variantData.recommendedVariants}
    />
  </>;
}