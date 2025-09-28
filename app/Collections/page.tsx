import ProductList from "./List";
import Filters from "./Filters";
import { getProduct } from "../api/collections/route";

export default async function ProductsPage() {
  const productsData = await (await getProduct()).json();
  return (
    <div className="relative py-6 px-2 md:px-4 min-h-screen bg-gray-50">
      <ProductList products={productsData} />
      <Filters />
    </div>
  );
}