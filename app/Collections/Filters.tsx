"use client";
import { useState } from "react";
import { uiData } from "@/lib/config/uiData";
import ProductList from "./List";
import { useLoading } from "../context/LoadingContext";
import { Button, Input, Select, Radio } from 'antd';

interface FilterProps {
  initialProducts: any[];
}

const sortOptions = [
  { value: 'created_on', label: 'Most Recent' },
  { value: 'price', label: 'Price' },
  { value: 'mrp', label: 'MRP - Original Price' },
];

export default function Filters({ initialProducts }: FilterProps) {
  const [products, setProducts] = useState(initialProducts);
  const [currentPopup, setCurrentPopup] = useState("");

  const showPopup = (key: string) => {
    if (currentPopup === key) {
      setCurrentPopup("");
      return;
    }
    setCurrentPopup(key);
  };

  return (
    <>
    <ProductList products={products} />
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2">
      <div className="flex flex-wrap justify-around md:min-w-auto min-w-dvw bg-white dark:bg-black rounded-t-xl shadow-3xl overflow-hidden dark:shadow-gray-700 pb-2">
        {uiData.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex items-center duration-500 
                hover:bg-green-100 cursor-pointer md:p-4 p-1 py-3 sm:p-2
                ${currentPopup == item.key && item.showBgOnClick ? "bg-green-100 font-bold": "text-gray-200 dark:text-green-100"}`} 
              onClick={() => showPopup(item.key || "")}
            >
              {item.icon && <item.icon className={`${currentPopup == item.key ? "dark:text-green-50 text-black" : "dark:text-green-100 text-green-800 "}`}/>}
              {item.label && (
                <div className={`font-medium text-sm ${currentPopup == item.key ? "dark:text-green-500 text-black" : "md:block dark:text-green-100 text-green-800"}`}
                >{item.label}</div>
              )}
            </div>
          );
        })}
      </div>

      <PopUp currentPopupType={currentPopup} onClose={() => setCurrentPopup("")} setProducts={setProducts}/>
    </div>
  </>);
}

const PopUp = function({ currentPopupType, onClose, setProducts }: { currentPopupType: string, onClose: () => void , setProducts: any}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("created_on");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageLoading = useLoading();

  if (!currentPopupType) return <></>;
  
  const handleApply = () => {
    pageLoading.setLoading(true);
    const query = new URLSearchParams({
      search,
      category,
      sortBy,
      sortOrder,
      skip: "0",
      pageSize: "20"
    }).toString();
    fetch(`/api/collections?${query}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        pageLoading.setLoading(false);
      });

    onClose();
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSortBy("created_on");
    setSortOrder("desc");
  };

  if (currentPopupType === "filter") {
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white shadow-2xl rounded-md p-4 w-72">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-800 font-semibold text-base">Filters</h3>
          <Button
            type="default"
            aria-label="Close sort popup"
            onClick={onClose}
            className="mt-4"
          >
           ✕
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Input placeholder="Search product..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Input placeholder="Category name..." value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button type="default" onClick={handleReset}>Reset</Button>
            <Button type="primary" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPopupType === "sort") {
    return (
      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white shadow-2xl rounded-md p-4 w-72 animate-fade-in border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-800 font-semibold text-base">Sort By</h3>
          <Button type="default" aria-label="Close sort popup" onClick={onClose} className="mt-4" > ✕ </Button>
        </div>

        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          options={sortOptions}
          style={{ width: '100%' }}
          placeholder="Select sorting option"
          size="middle"
          className="!my-2"
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

          <Button
            type="primary"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
        
      </div>
    );
  }
  return <></>;
};
