import Filters from "./Filters";
import { getProduct } from "@/lib/productService";

export default async function ProductsPage() {
  const initialProducts = await getProduct();

  return (
    <div className="relative py-6 px-2 md:px-4 min-h-screen bg-gray-50 dark:bg-green-950">
      <Filters initialProducts={initialProducts}/>
    </div>
  );
}