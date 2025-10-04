"use client";
import { useState, useEffect } from "react";
import { uiData } from "@/lib/config/uiData";
import ProductList from "./List";
import { useLoading } from "../context/LoadingContext";
import { Button, Input, Select, Radio, Popover } from 'antd';

// Mock sort options
const sortOptions = [
  { value: 'created_on', label: 'Most Recent' },
  { value: 'price', label: 'Price' },
  { value: 'mrp', label: 'MRP - Original Price' },
];

interface FilterProps {
  initialProducts: any[];
}

export default function Filters({ initialProducts }: FilterProps) {
  const [products, setProducts] = useState(initialProducts);
  const [currentPopup, setCurrentPopup] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("created_on");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0); // set from API
  const pageLoading = useLoading();

  useEffect(() => {
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
        pageLoading.setLoading(false);
      });
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
    <>
      <ProductList products={products} />
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-wrap justify-around md:min-w-auto min-w-dvw bg-white dark:bg-black rounded-t-xl shadow-3xl overflow-hidden dark:shadow-gray-700 pb-2 items-center">
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
                  className="flex items-center gap-2 font-medium"
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
                      search, setSearch, category, setCategory,
                      sortBy, setSortBy, sortOrder, setSortOrder, handleReset
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
                      : "text-gray-200 dark:text-green-100"}`}
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
                      ? "dark:text-green-500 text-black"
                      : "md:block dark:text-green-100 text-green-800"}`}>
                      {item.label}
                    </div>
                  )}
                </div>
              </Popover>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PopUp({
  currentPopupType,
  onClose,
  search,
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
          <h3 className="text-gray-800 font-semibold text-base">Filters</h3>
          <Button
            type="default"
            aria-label="Close sort popup"
            onClick={onClose}
            className="mt-4"
          >✕</Button>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          <h3 className="text-gray-800 font-semibold text-base">Sort By</h3>
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
          <Button type="primary" onClick={onClose}>Apply</Button>
        </div>
      </div>
    );
  }
  return <></>;
}
