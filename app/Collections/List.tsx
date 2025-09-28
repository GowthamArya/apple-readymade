import ProductCard from "./Card";

export default function ProductList({ products }: { products: any[] }) {
  return (
    <div className="mt-15 grid grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
