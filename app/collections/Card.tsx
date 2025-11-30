import { MdOutlineAddShoppingCart } from "react-icons/md";
import ProductCarousel from "../components/Carousel";
import { GrFavorite } from "react-icons/gr";
import { App, Button } from "antd";
import { useCart } from '../context/CartContext';
import { MdFavorite } from "react-icons/md";
import { useFavorites } from "../context/FavoriteContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, token, flashSale }: { product: any, token: any, flashSale?: any }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  const { addToCart, cart } = useCart();
  const { addToFavorites, favorites, removeFromFavorites } = useFavorites();
  const { message } = App.useApp();

  const discountedPrice = flashSale
    ? Math.floor(product.price * (1 - flashSale.discount_percentage / 100))
    : product.price;

  const handleFavorite = (action: string) => {
    if (action === 'remove' && favorites.some((fav) => fav.id === product.id)) {
      removeFromFavorites(product.id);
      message.warning(`${product.product?.name || 'Product'} removed from favorites!`);
      return;
    } else if (action === 'add' && !favorites?.some((fav) => fav.id === product.id)) {
      addToFavorites(product);
      message.success(`${product.product?.name || 'Product'} added to favorites!`);
      return;
    }
  }

  const handleAdd = () => {
    addToCart({ ...product, price: discountedPrice, quantity: 1 }); // Use discounted price
    message.success(`${product.product?.name || 'Product'} added to cart!`);
  };

  return (
    <Link href={`/variant/${product.id}`} className="relative p-2 col-span-1 rounded-md shadow-lg duration-3000! hover:shadow-green-900/30 dark:shadow-green-50/25 transition-shadow" style={{ border: `1px solid ${token.colorBorder}` }}>
      {flashSale && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-br-md z-10">
          Flash Sale {flashSale.discount_percentage}% OFF
        </div>
      )}
      {user && <div className="absolute top-2 right-2 z-50" tabIndex={-1}>
        <Button
          shape="round"
          size="middle"
          aria-label="Add to wishlist"
          tabIndex={-1}
          type="text"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavorite(favorites.some((fav) => fav.id === product.id) ? 'remove' : 'add')
          }}
        >
          {favorites.some((fav) => fav.id === product.id) ?
            <MdFavorite className="text-xl cursor-pointer text-red-600!" />
            :
            <GrFavorite className="text-xl cursor-pointer" />
          }
        </Button>
      </div>}

      <ProductCarousel product={product} />

      <h2 className="mt-3 font-semibold text-sm md:text-base leading-tight" style={{ color: token.colorText }}>
        {product.product.name}
      </h2>

      <div className="flex items-center mt-2 justify-between" style={{ color: token.colorText }}>
        <p className="text-sm md:text-base">
          ₹{discountedPrice}{" "}
          {
            (product.mrp && product.mrp > discountedPrice) || (flashSale && product.price > discountedPrice) ? (
              <span className="text-xs line-through ml-1">
                ₹{flashSale ? product.price : product.mrp}
              </span>
            ) : null
          }
        </p>
        {cart.some((item) => item.id === product.id) ?
          <Button
            type="primary"
            icon={<MdOutlineAddShoppingCart />}
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/cart");
            }}
          >
          </Button>
          :
          <MdOutlineAddShoppingCart
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAdd();
            }}
            className={`text-xl cursor-pointer transition-colors }`}
          />
        }
      </div>
    </Link>
  );
}
