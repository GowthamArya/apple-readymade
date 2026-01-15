import Filters from "./Filters";
import { productService } from "@/lib/services/product.service";
import { flashSaleService } from "@/lib/services/flash-sale.service";

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const {
    searchQuery,
    category,
    sortBy,
    sortOrder,
    page,
    minPrice,
    maxPrice,
    colors,
    sizes,
    inStock
  } = await searchParams;

  const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;
  const parsedColors = colors ? (colors as string).split(',') : undefined;
  const parsedSizes = sizes ? (sizes as string).split(',') : undefined;
  const parsedInStock = inStock === 'true';

  const [initialProducts, categories, flashSales] = await Promise.all([
    productService.getProducts({
      searchQuery: searchQuery as string,
      category: category as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string,
      page: page ? parseInt(page) : 1,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      colors: parsedColors,
      sizes: parsedSizes,
      inStock: parsedInStock
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
      />
    </div>
  );
}