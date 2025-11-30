
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

    // Fetch active flash sale
    const now = new Date().toISOString();
    const { data: flashSale } = await supabase
      .from('flash_sales')
      .select('*')
      .eq('product_id', product_id)
      .eq('active', true)
      .lte('start_time', now)
      .gte('end_time', now)
      .single();

    return { variants: data || [], product: productData?.product, recommendedVariants, flashSale };
  }
  const variantData = await fetchVariant();
  return <>
    <VariantDetails
      variants={variantData.variants}
      variant_id={id}
      productData={variantData.product}
      recommendedVariants={variantData.recommendedVariants}
      flashSale={variantData.flashSale}
    />
  </>;
}