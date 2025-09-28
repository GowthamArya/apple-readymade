export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="p-4 col-1 rounded-md shadow-md">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
      <h2 className="mt-2 font-semibold">{product.name}</h2>
      <p className="text-gray-600">₹{product.price}</p>
      <button className="mt-2 w-1/2 bg-green-700 text-white py-1 rounded-lg hover:bg-green-900">
        Add to Cart
      </button>
    </div>
  );
}
