import { MdOutlineAddShoppingCart } from "react-icons/md";
import ProductCarousel from "../components/Carousel";
import { GrFavorite } from "react-icons/gr";
import { App, Button, Popover } from "antd";
import { useCart } from '../context/CartContext';
import { MdFavorite } from "react-icons/md";
import { useFavorites } from "../context/FavoriteContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const { data:session } = useSession();
  const [user, setUser] = useState(session?.user);
  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  const { addToCart } = useCart();
  const { addToFavorites, favorites,removeFromFavorites } = useFavorites();
  const { message } = App.useApp();
  const handleFavorite = (action:string) => {
    if(action === 'remove' && favorites.some((fav) => fav.id === product.id)) {
      removeFromFavorites(product.id);
      message.warning(`${product.product?.name || 'Product'} removed from favorites!`);
      return;
    }else if(action === 'add' && !favorites.some((fav) => fav.id === product.id)) {
      addToFavorites(product);
      message.success(`${product.product?.name || 'Product'} added to favorites!`);
      return;
    }
  }

  const handleAdd = () => {
    addToCart({...product, quantity: 1});
    message.success(`${product.product?.name || 'Product'} added to cart!`);
  };

  return (
    <div className="relative p-2 col-span-1 rounded-md shadow-md dark:shadow-gray-800 hover:shadow-lg transition-shadow duration-300 dark:border dark:border-gray-700">
      {user && <div className="absolute top-2 right-2 z-50" tabIndex={-1}>
        <Button
          shape="round"
          size="middle"
          aria-label="Add to wishlist"
          tabIndex={-1}
          type="text"
          onClick={()=>handleFavorite(favorites.some((fav) => fav.id === product.id) ? 'remove' : 'add')}
        >
          
          {favorites.some((fav) => fav.id === product.id) ?
            <MdFavorite className="text-xl cursor-pointer text-red-600" />
            :
            <GrFavorite className="text-xl cursor-pointer" />
          }
        </Button>
      </div>} 


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
