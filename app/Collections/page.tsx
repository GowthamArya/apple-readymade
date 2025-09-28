import ProductList from "./List";
import Filters from "./Filters";
import Repository from "@/lib/repository";

export default async function ProductsPage() {
  const db = new Repository('product');
  const products = await db.getAll();

  return (
    <div className="relative p-6 min-h-screen bg-gray-50">
      <ProductList products={products} />
      <Filters />
    </div>
  );
}