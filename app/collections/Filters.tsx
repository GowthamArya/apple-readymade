"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ProductList from "./List";
import { Button, Drawer, theme, FloatButton } from 'antd';
import { useProductFilters } from "@/hooks/useProductFilters";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import { FilterOutlined } from "@ant-design/icons";

interface FilterProps {
  initialProducts: any[];
  totalCount: number;
  categories: any[];
  flashSales?: any[];
}

export default function Filters({
  initialProducts,
  totalCount,
  categories = [],
  flashSales = [],
}: FilterProps) {
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const { token } = theme.useToken();

  // Reset products when the URL-driven initial search occurs (prop update)
  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialProducts.length < totalCount);
  }, [initialProducts, totalCount]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = Math.ceil(products.length / 20) + 1;

    // Construct query params from current filters
    const query = new URLSearchParams({
      page: String(nextPage),
      pageSize: '20'
    });

    if (filters.searchQuery) query.set('searchQuery', filters.searchQuery);
    if (filters.category) query.set('category', filters.category);
    query.set('sortBy', filters.sortBy);
    query.set('sortOrder', filters.sortOrder);
    if (filters.minPrice !== undefined) query.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) query.set('maxPrice', String(filters.maxPrice));
    if (filters.colors.length > 0) query.set('colors', filters.colors.join(','));
    if (filters.sizes.length > 0) query.set('sizes', filters.sizes.join(','));
    if (filters.inStock) query.set('inStock', 'true');

    try {
      const res = await fetch(`/api/collections?${query.toString()}`);
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        setProducts(prev => [...prev, ...data.data]);
        setHasMore(products.length + data.data.length < data.totalCount);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more products", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);


  return (
    <div className="min-h-screen" style={{ backgroundColor: token.colorBgLayout }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 p-6 rounded-xl shadow-sm border" style={{ backgroundColor: token.colorBgContainer, borderColor: token.colorBorderSecondary }}>
              <FilterSidebar
                filters={filters}
                updateFilters={updateFilters}
                resetFilters={resetFilters}
                categories={categories}
              />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: token.colorBgContainer }}>
            <span className="font-semibold" style={{ color: token.colorText }}>Filters</span>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setMobileFilterOpen(true)}
              type="primary"
            >
              Filters
            </Button>
          </div>

          {/* Mobile Filter Drawer */}
          <Drawer
            title="Filters"
            placement="right"
            onClose={() => setMobileFilterOpen(false)}
            open={mobileFilterOpen}
            width={320}
            styles={{ body: { padding: 0 } }}
          >
            <div className="p-6">
              <FilterSidebar
                filters={filters}
                updateFilters={updateFilters}
                resetFilters={resetFilters}
                categories={categories}
              />
            </div>
          </Drawer>

          {/* Main Content */}
          <main className="flex-1">
            <SortBar
              totalCount={totalCount}
              currentCount={products.length}
              filters={filters}
              updateFilters={updateFilters}
            />

            <div className="bg-transparent">
              {products.length > 0 ? (
                <ProductList products={products} token={token} flashSales={flashSales} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 rounded-xl shadow-sm" style={{ backgroundColor: token.colorBgContainer }}>
                  <img
                    src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    alt="No products"
                    className="h-32 mb-4"
                  />
                  <p className="text-lg" style={{ color: token.colorTextSecondary }}>No products found matching your criteria</p>
                  <Button type="primary" className="mt-4" onClick={resetFilters}>Clear Filters</Button>
                </div>
              )}
            </div>

            {/* Infinite Scroll Loader */}
            <div ref={lastProductElementRef} className="h-20 flex justify-center items-center w-full py-4 mt-8">
              {loadingMore && <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: token.colorPrimary }}></div>}
              {!loadingMore && hasMore && <div className="text-sm" style={{ color: token.colorTextSecondary }}>Scroll for more...</div>}
              {!hasMore && products.length > 0 && <span className="text-sm" style={{ color: token.colorTextDisabled }}>You've reached the end</span>}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Action Button for Mobile Filter (Optional, keeping it clean for now) */}
      <FloatButton.BackTop />
    </div>
  );
}
