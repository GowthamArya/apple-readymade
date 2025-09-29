"use client";
import { useState } from "react";
import { uiData } from "@/lib/config/uiData";
import ProductList from "./List";
import { useLoading } from "../context/LoadingContext";

interface FilterProps {
  initialProducts: any[];
}

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
      <div className="flex flex-wrap justify-around md:min-w-auto min-w-dvw bg-white dark:bg-black rounded-t-xl shadow-3xl overflow-hidden dark:shadow-gray-700">
        {uiData.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex items-center duration-500 
                hover:bg-green-100 cursor-pointer md:p-4 p-1 py-4 sm:p-2
                ${currentPopup == item.key && item.showBgOnClick ? "bg-green-100 font-bold": "text-gray-200 dark:text-green-100"}`} 
              onClick={() => showPopup(item.key || "")}
            >
              {item.icon && <item.icon className={`${currentPopup == item.key ? " text-black" : "dark:text-green-100 text-green-700 "}`}/>}
              {item.label && (
                <div className={`font-medium text-sm ${currentPopup == item.key ? "text-black" : "md:block dark:text-green-100 text-green-700"}`}
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
        <h3 className="font-semibold mb-3 text-gray-700 flex justify-between">
          Filters 
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category name..."
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={handleReset} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">
              Reset
            </button>
            <button onClick={handleApply} className="px-3 py-1 text-sm bg-green-900 text-white rounded-md hover:bg-green-800">
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPopupType === "sort") {
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white shadow-2xl rounded-md p-4 w-64">
        <h3 className="font-semibold mb-3 text-gray-700 flex justify-between">
          Sort By 
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </h3>
        <div className="space-y-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
          >
            <option value="created_on">Most Recent</option>
            <option value="product.name">Product Name</option>
            <option value="product.category.name">Category</option>
          </select>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1 text-sm">
              <input type="radio" checked={sortOrder === "asc"} onChange={() => setSortOrder("asc")} />
              <span>Ascending</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input type="radio" checked={sortOrder === "desc"} onChange={() => setSortOrder("desc")} />
              <span>Descending</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleApply} className="px-3 py-1 text-sm bg-green-700 text-white rounded-md hover:bg-green-900">
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};
