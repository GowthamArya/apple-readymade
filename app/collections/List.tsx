import { useEffect, useState } from "react";
import ProductCard from "./Card";

export default function ProductList({ products, token }: { products: any[], token: any }) {
  const [flashSales, setFlashSales] = useState<Record<number, any>>({});

  useEffect(() => {
    fetch("/api/flash-sales")
      .then((res) => res.json())
      .then((data) => {
        if (data.sales) {
          const salesMap: Record<number, any> = {};
          data.sales.forEach((sale: any) => {
            salesMap[sale.product_id] = sale;
          });
          setFlashSales(salesMap);
        }
      })
      .catch((err) => console.error("Failed to fetch flash sales", err));
  }, []);

  return (
    <div className="pb-20 md:px-20 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 grid-flow-row gap-3 p-3" style={{ backgroundColor: token.colorBgContainer }}>
      {products.map((p) => (
        <ProductCard
          key={p.id + p.price}
          product={p}
          token={token}
          flashSale={flashSales[p.product?.id]}
        />
      ))}
    </div>
  );
}