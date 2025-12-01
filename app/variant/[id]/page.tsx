
import { supabase } from "@/lib/supabaseServer";
import VariantDetails from "../Details";
import { getSimilarVariants } from "@/lib/productService";

export default async function VariantPage(props: PageProps<"/variant/[id]">) {
  const id = (await (await props).params).id;
  async function fetchVariant() {
    const { data: productData } = await supabase.from("variant").select("product_id, product(*)").eq("id", id).single();
    const product_id = productData?.product_id;
    const { data, error } = await supabase.from("variant").select("*").eq("product_id", product_id);
    if (error) throw error;

    const recommendedVariants = await getSimilarVariants(Number(id));

    return { variants: data || [], product: productData?.product, recommendedVariants };
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