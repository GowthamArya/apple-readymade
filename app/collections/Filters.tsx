"use client";
import { useState, useEffect } from "react";
import { uiData } from "@/lib/config/uiData";
import ProductList from "./List";
import { useLoading } from "../context/LoadingContext";
import { Button, Input, Select, Radio, Popover, theme } from 'antd';
import { useRouter } from "next/navigation";
const { useToken } = theme;

// Mock sort options
const sortOptions = [
  { value: 'created_on', label: 'Most Recent' },
  { value: 'price', label: 'Price' },
  { value: 'mrp', label: 'MRP - Original Price' },
];

interface FilterProps {
  initialProducts: any[];
  searchQuery?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function Filters( {initialProducts, searchQuery} : FilterProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [currentPopup, setCurrentPopup] = useState("");
  const [search, setSearch] = useState(searchQuery || "");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("created_on");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(initialProducts.length || 0);
  const pageLoading = useLoading();
  const { token } = useToken();

  function fetchProducts() {
    pageLoading.setLoading(true);
    const query = new URLSearchParams({
      search,
      category,
      sortBy,
      sortOrder,
      skip: String((page - 1) * pageSize),
      pageSize: String(pageSize)
    }).toString();

    fetch(`/api/collections?${query}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data ?? []);
        setTotalCount(data.totalCount ?? 0);
      }).catch(err => {
        console.error("Failed to fetch products:", err);
      }).finally(() => {
        pageLoading.setLoading(false);
      });
  };

  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search, category, sortBy, sortOrder, page]);



  // Show popover for filter/sort only
  const showPopup = (key: string) => {
    setCurrentPopup(currentPopup === key ? "" : key);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSortBy("created_on");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <div className="relative min-h-screen!" style={{ backgroundColor: token.colorBgContainer }}>
      <ProductList products={products} token={token} />
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-wrap justify-around md:min-w-auto min-w-dvw rounded-t-xl shadow-3xl overflow-hidden shadow-gray-700 pb-2 items-center" style={{ background: token.colorBgContainer }} >
          {uiData.map((item, index) => {
            if (item.key === "prev") {
              return (
                <Button
                  key={index}
                  type="link"
                  color="green"
                  disabled={page <= 1}
                  aria-label="Previous Page"
                  title={`Current page no. ${page}`}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="flex items-center gap-2 font-medium dark:text-green-50!"
                >
                  <item.icon className="text-xl" /> {`${page - 1} ` + item.label}
                </Button>
              );
            }
            if (item.key === "next") {
              return (
                <Button
                  key={index}
                  color="green"
                  type="text"
                  disabled={(page * pageSize) >= totalCount || products.length < pageSize}
                  aria-label="Next Page"
                  title={`Current page no. ${page}`}
                  onClick={() => setPage(prev => prev + 1)}
                  className="flex items-center gap-2 font-medium"
                >
                  <item.icon className="text-xl" title={`Current page no. ${page}`}/> {`${page + 1} ` + item.label}
                </Button>
              );
            }
            return (
              <Popover
                key={index}
                content={
                  <PopUp
                    currentPopupType={item.key === currentPopup ? currentPopup : ""}
                    onClose={() => setCurrentPopup("")}
                    {...{
                      search, router, category, setCategory,
                      sortBy, setSearch, setSortBy, sortOrder, setSortOrder, handleReset
                    }}
                  />
                }
                title={null}
                trigger="click"
                open={item.key === currentPopup}
                placement="top"
              >
                <div
                  className={`flex items-center duration-500 
                    hover:bg-green-100 cursor-pointer md:p-4 p-1 py-3 sm:p-2
                    ${currentPopup === item.key && item.showBgOnClick
                      ? "bg-green-100 font-bold"
                      : ""}`}
                  onClick={() => showPopup(item.key || "")}
                >
                  {item.icon && (
                    <item.icon
                      className={`${currentPopup === item.key
                        ? "dark:text-green-50 text-black"
                        : "dark:text-green-100 text-green-800 "}`} />
                  )}
                  {item.label && (
                    <div className={`font-medium text-sm ${currentPopup === item.key
                      ? "text-black"
                      : "md:block"}`}>
                      {item.label}
                    </div>
                  )}
                </div>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PopUp({
  currentPopupType,
  onClose,
  search,
  router,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleReset
}: any) {
  if (!currentPopupType) return <></>;

  if (currentPopupType === "filter") {
    return (
      <div style={{ width: 280 }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-base">Filters</h3>
          <Button
            type="default"
            aria-label="Close sort popup"
            onClick={onClose}
            className="mt-4"
          >✕</Button>
        </div>
        <div className="space-y-3">
          <Input.Search
            placeholder="Search product..."
            onChange={(e) => setSearch(e.target.value)} 
            value={search}
            allowClear
            onClear={() => {
              router.push(`/collections?searchQuery=`);
              setSearch("");
            }}
            onSearch={(value) => {
              router.push(`/collections?searchQuery=${value}`);
            }}
            style={{ marginBottom: 8 }}
          />
          <Input
            placeholder="Category name..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <div className="flex justify-between pt-2">
            <Button type="default" onClick={handleReset}>Reset</Button>
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
          <Button type="default" aria-label="Close sort popup" onClick={onClose} className="mt-4">✕</Button>
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
