import Filters from "./Filters";
import { getProduct } from "@/lib/productService";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = await searchParams;
  const initialProducts = await getProduct(search);
  return (
    <div className="relative min-h-screen" >
      <Filters initialProducts={initialProducts} searchQuery={search.searchQuery as string}/>
    </div>
  );
}