"use client";
import { useState, useEffect } from "react";
import { uiData } from "@/lib/config/uiData";

export default function Filters() {
  const [category, setCategory] = useState("");
  const [currentPopuop, setCurrentPopup] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
        const res = await fetch(`/api/collections?category=${category}`);
        const data = await res.json();
        setProducts(data);
    }
    fetchProducts();
  }, [category]);


  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white rounded-t-xl shadow-3xl overflow-hidden">
        <div className="flex flex-wrap justify-between">
            {uiData.map((item, index) => {
                return <div key={index}  className={`flex items-center p-4 duration-500 hover:bg-green-100 cursor-pointer ${currentPopuop == item.label && item.showBgOnClick ? "bg-green-100": ""}`} onClick={() => setCategory(item.label || "")}>
                    {item.icon && <item.icon size={20} />}
                    {item.label && <div className="text-sm font-medium">{item.label}</div>}
                </div>
            })}
        </div>    
    </div>  
  );
}
