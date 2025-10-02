import { MdOutlineAddShoppingCart } from "react-icons/md";
import ProductCarousel from "../components/Carousel";
import { GrFavorite } from "react-icons/gr";
import { App, Button } from "antd";
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { message } = App.useApp();
  const handleAdd = () => {
    addToCart({...product, quantity: 1});
    message.success(`${product.product?.name || 'Product'} added to cart!`);
  };

  return (
    <div className="relative p-2 col-span-1 rounded-md shadow-md dark:shadow-gray-800 hover:shadow-lg transition-shadow duration-300 dark:border dark:border-gray-700">
      <div className="absolute top-2 right-2 z-50" tabIndex={-1}>
        <Button
          type="text"
          shape="circle"
          size="large"
          aria-label="Add to wishlist"
          tabIndex={-1}
          className="hover:bg-red-100 dark:hover:bg-gray-800 !hover:text-red-500 transition-colors"
        >
          <GrFavorite className="text-xl cursor-pointer"  tabIndex={-1}/>
        </Button>
      </div>

      <ProductCarousel product={product} />

      <h2 className="mt-3 font-semibold text-sm md:text-base dark:text-white">
        {product.product.name}
      </h2>

      <div className="flex items-center mt-2 justify-between">
        <p className="text-gray-700 dark:text-white text-sm md:text-base">
          ₹{product.price}{" "}
          <span className="text-xs line-through text-gray-400 dark:text-gray-300 ml-1">
            ₹{product.mrp}
          </span>
        </p>
        <MdOutlineAddShoppingCart
          onClick={handleAdd}
          className="text-xl cursor-pointer hover:text-green-700 transition-colors"
        />
      </div>
    </div>
  );
}
