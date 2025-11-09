import Filters from "./Filters";
import { getProduct } from "@/lib/productService";

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const {searchQuery} = await searchParams;
  const initialProducts = await getProduct({searchQuery});
  return (
    <div className="relative min-h-screen!" >
      <Filters initialProducts={initialProducts} searchQuery={searchQuery as string}/>
    </div>
  );
}