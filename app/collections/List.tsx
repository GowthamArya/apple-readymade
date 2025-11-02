import ProductCard from "./Card";

export default function ProductList({ products, token }: { products: any[], token: any }) {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }
  return (
    <div className="pb-20 px-20 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 grid-flow-row gap-3 p-3" style={{ background: token.colorBgContainer }}>
      {products.map((p) => (
        <ProductCard key={p.id+p.price} product={p} token={token} />
      ))}
    </div>
  );
}