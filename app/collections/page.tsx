import Filters from "./Filters";
import { getProduct, getAllCategories } from "@/lib/productService";

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const { searchQuery, category, sortBy, sortOrder, page } = await searchParams;
  const initialProducts = await getProduct({
    searchQuery,
    category,
    sortBy,
    sortOrder,
    page: page ? parseInt(page) : 1
  });
  const categories = await getAllCategories();

  return (
    <div className="relative min-h-screen!" >
      <Filters
        initialProducts={initialProducts.data}
        totalCount={initialProducts.totalCount}
        categories={categories}
        searchQuery={searchQuery as string}
        category={category as string}
        sortBy={sortBy as string}
        sortOrder={sortOrder as string}
        page={page ? parseInt(page) : 1}
      />
    </div>
  );
}