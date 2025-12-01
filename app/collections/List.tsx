import { useEffect, useState } from "react";
import ProductCard from "./Card";

export default function ProductList({ products, token, flashSales = [] }: { products: any[], token: any, flashSales?: any[] }) {
  const [salesMap, setSalesMap] = useState<Record<number, any>>({});

  useEffect(() => {
    const map: Record<number, any> = {};
    if (flashSales && flashSales.length > 0) {
      flashSales.forEach((sale: any) => {
        map[sale.product_id] = sale;
      });
    }
    setSalesMap(map);
  }, [flashSales]);

  return (
    <div className="pb-20 md:px-20 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 grid-flow-row gap-3 p-3" style={{ backgroundColor: token.colorBgContainer }}>
      {products.map((p) => (
        <ProductCard
          key={p.id + p.price}
          product={p}
          token={token}
          flashSale={salesMap[p.product?.id]}
        />
      ))}
    </div>
  );
}