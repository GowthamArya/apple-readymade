import { MdOutlineAddShoppingCart } from "react-icons/md";
import ProductCarousel from "../components/Carousel";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="p-1 col-span-1 rounded-md shadow-md hover:shadow-lg duration-500">
      <ProductCarousel product={product} />
      <h2 className="mt-2 font-semibold text-xs md:text-md">{product.product.name}</h2>
      <div className="flex items-center space-x-2 mt-auto">
        <p className="text-gray-700  text-md">₹{product.price} 
          <span className="text-xs line-through text-gray-400">{product.mrp}</span>
        </p>
        <MdOutlineAddShoppingCart className="text-xl cursor-grabbing hover:text-green-900 ml-auto"/>
      </div>
    </div>
  );
}
