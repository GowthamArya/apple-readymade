"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ProductList from "./List";
import { Button, Input, Select, Radio, Popover, theme, Tag } from 'antd';
import { useRouter } from "next/navigation";
import { TbFilterSearch } from "react-icons/tb";
import { BiSort } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

const { useToken } = theme;

const sortOptions = [
  { value: 'created_on', label: 'Most Recent' },
  { value: 'price', label: 'Price' },
  { value: 'mrp', label: 'MRP - Original Price' },
];

interface FilterProps {
  initialProducts: any[];
  totalCount: number;
  categories: any[];
  searchQuery?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
}

export default function Filters({
  initialProducts,
  totalCount,
  categories = [],
  searchQuery = "",
  category = "",
  sortBy = "created_on",
  sortOrder = "desc",
  page = 1
}: FilterProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [currentPopup, setCurrentPopup] = useState("");

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(category);

  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const [currentPage, setCurrentPage] = useState(page);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const { token } = useToken();

  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialProducts.length < totalCount);
    setCurrentPage(1);
    setLocalSearch(searchQuery);
    setLocalCategory(category);
    setLoading(false);
  }, [searchQuery, category, sortBy, sortOrder, initialProducts, totalCount]);

  const updateFilters = (newParams: any) => {
    setLoading(true);
    const params = new URLSearchParams({
      searchQuery: searchQuery,
      category: category,
      sortBy: sortBy,
      sortOrder: sortOrder,
      page: '1',
      ...newParams
    });

    router.push(`/collections?${params.toString()}`);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = currentPage + 1;
    const query = new URLSearchParams({
      searchQuery,
      category,
      sortBy,
      sortOrder,
      page: String(nextPage),
      pageSize: '20'
    }).toString();

    try {
      const res = await fetch(`/api/collections?${query}`);
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        setProducts(prev => [...prev, ...data.data]);
        setCurrentPage(nextPage);
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


  // Show popover for filter/sort only
  const showPopup = (key: string) => {
    setCurrentPopup(currentPopup === key ? "" : key);
  };

  const handleReset = () => {
    setLoading(true);
    setLocalSearch("");
    setLocalCategory("");
    router.push('/collections');
    setCurrentPopup("");
  };

  const handleSearchApply = () => {
    updateFilters({ searchQuery: localSearch, category: localCategory });
    setCurrentPopup("");
  };

  const clearFilter = (key: string) => {
    if (key === 'search') updateFilters({ searchQuery: '' });
    if (key === 'category') updateFilters({ category: '' });
  };

  return (
    <div className="relative min-h-screen!" style={{ backgroundColor: token.colorBgContainer }}>
      {/* Top Filter Bar */}
      <div className="sticky top-0 z-40 w-full shadow-sm py-3 px-4 flex flex-col gap-3" style={{ background: token.colorBgContainer }}>
        <div className="flex md:flex-row md:flex-row-reverse flex-col justify-center md:justify-between items-center gap-2">
          <div className="flex gap-2">
            <Popover
              content={
                <PopUp
                  currentPopupType="filter"
                  onClose={() => setCurrentPopup("")}
                  search={localSearch}
                  setSearch={setLocalSearch}
                  category={localCategory}
                  setCategory={setLocalCategory}
                  categories={categories}
                  handleReset={handleReset}
                  onApply={handleSearchApply}
                />
              }
              title={null}
              trigger="click"
              open={currentPopup === 'filter'}
              placement="bottom"
            >
              <Button
                size="middle"
                icon={<TbFilterSearch className="text-lg" />}
                onClick={() => showPopup('filter')}
                type={searchQuery || category ? "primary" : "default"}
              >
                Filter
              </Button>
            </Popover>

            <Popover
              content={
                <PopUp
                  size="middle"
                  currentPopupType="sort"
                  onClose={() => setCurrentPopup("")}
                  sortBy={sortBy}
                  setSortBy={(val: string) => {
                    updateFilters({ sortBy: val });
                    setCurrentPopup("");
                  }}
                  sortOrder={sortOrder}
                  setSortOrder={(val: string) => {
                    updateFilters({ sortOrder: val });
                    setCurrentPopup("");
                  }}
                />
              }
              title={null}
              open={currentPopup === 'sort'}
              placement="bottom"
            >
              <Button
                size="middle"
                icon={<BiSort className="text-lg" />}
                onClick={() => showPopup('sort')}>
                Sort
              </Button>
            </Popover>
          </div>
          {/* Applied Filters Chips */}
          {(searchQuery || category) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Tag closable onClose={() => clearFilter('search')} color="blue" className="flex items-center text-sm py-1 px-2">
                  Search: {searchQuery}
                </Tag>
              )}
              {category && (
                <Tag closable onClose={() => clearFilter('category')} color="green" className="flex items-center text-sm py-1 px-2">
                  Category: {category}
                </Tag>
              )}
              {(searchQuery || category) && (
                <Button type="link" size="small" onClick={handleReset} className="p-0 h-auto text-xs">Clear All</Button>
              )}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <ProductList products={products} token={token} />
      )}
      <div ref={lastProductElementRef} className="h-10 flex justify-center items-center w-full py-4">
        {loadingMore && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>}
        {!hasMore && products.length <= 0 && <span className="text-gray-400 text-sm">No more products</span>}
      </div>
    </div>
  );
}

function PopUp({
  currentPopupType,
  onClose,
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleReset,
  onApply
}: any) {
  if (!currentPopupType) return <></>;

  if (currentPopupType === "filter") {
    return (
      <div style={{ width: 300 }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-base">Filters</h3>
          <Button
            type="text"
            size="small"
            icon={<CgClose />}
            aria-label="Close filter popup"
            onClick={onClose}
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Search</label>
            <Input.Search
              placeholder="Search product..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              allowClear
              onSearch={onApply}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {categories.map((cat: any) => (
                <Tag.CheckableTag
                  key={cat.id}
                  checked={category === cat.name}
                  onChange={(checked) => setCategory(checked ? cat.name : "")}
                  className="border border-gray-200 m-0"
                >
                  {cat.name}
                </Tag.CheckableTag>
              ))}
              {categories.length === 0 && <span className="text-gray-400 text-sm">No categories found</span>}
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t mt-2">
            <Button type="default" onClick={handleReset}>Reset</Button>
            <Button type="primary" onClick={onApply}>Apply</Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPopupType === "sort") {
    return (
      <div style={{ width: 280 }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-base">Sort By</h3>
          <Button
            type="text"
            size="small"
            icon={<CgClose />}
            aria-label="Close sort popup"
            onClick={onClose}
          />
        </div>
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          options={sortOptions}
          style={{ width: '100%', marginBottom: 8 }}
          placeholder="Select sorting option"
          size="middle"
        />
        <div className="my-2 flex justify-between items-center">
          <Radio.Group
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            optionType="default"
            buttonStyle="solid"
          >
            <Radio.Button value="asc">Ascending</Radio.Button>
            <Radio.Button value="desc">Descending</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
  return <></>;
}
