import ProductCard from "./Card";

export default function ProductList({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }
  return (
    <div className="my-15 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 grid-flow-row gap-1 p-1 rounded-md">
      {products.map((p) => (
        <ProductCard key={p.id+p.price} product={p} />
      ))}
    </div>
  );
}