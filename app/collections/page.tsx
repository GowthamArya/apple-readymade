import Filters from "./Filters";
import { getProduct } from "@/lib/productService";

export default async function ProductsPage() {
  const initialProducts = await getProduct();

  return (
    <div className="relative min-h-screen" >
      <Filters initialProducts={initialProducts}/>
    </div>
  );
}