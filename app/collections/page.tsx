import Filters from "./Filters";
import { productService } from "@/lib/services/product.service";
import { flashSaleService } from "@/lib/services/flash-sale.service";

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const { searchQuery, category, sortBy, sortOrder, page } = await searchParams;

  const [initialProducts, categories, flashSales] = await Promise.all([
    productService.getProducts({
      searchQuery,
      category,
      sortBy,
      sortOrder,
      page: page ? parseInt(page) : 1
    }),
    productService.getAllCategories(),
    flashSaleService.getActiveSales()
  ]);

  return (
    <div className="relative min-h-screen mb-3">
      <Filters
        initialProducts={initialProducts.data}
        totalCount={initialProducts.totalCount}
        categories={categories}
        flashSales={flashSales}
        searchQuery={searchQuery as string}
        category={category as string}
        sortBy={sortBy as string}
        sortOrder={sortOrder as string}
        page={page ? parseInt(page) : 1}
      />
    </div>
  );
}