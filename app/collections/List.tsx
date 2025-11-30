import ProductCard from "./Card";

export default function ProductList({ products, token }: { products: any[], token: any }) {
  return (
    <div className="pb-20 md:px-20 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 grid-flow-row gap-3 p-3" style={{ backgroundColor: token.colorBgContainer }}>
      {products.map((p) => (
        <ProductCard key={p.id + p.price} product={p} token={token} />
      ))}
    </div>
  );
}