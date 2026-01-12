import { MdOutlineAddShoppingCart } from "react-icons/md";
import ProductCarousel from "../components/Carousel";
import { GrFavorite } from "react-icons/gr";
import { App, Button, Typography } from "antd";
import { useCart } from '../context/CartContext';
import { MdFavorite } from "react-icons/md";
import { useFavorites } from "../context/FavoriteContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

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

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleFavorite = async (action: string) => {
    setLoadingFav(true);
    try {
      if (action === 'remove' && favorites.some((fav) => fav.id === product.id)) {
        await removeFromFavorites(product.id);
        message.warning(`${product.product?.name || 'Product'} removed from favorites!`);
      } else if (action === 'add' && !favorites?.some((fav) => fav.id === product.id)) {
        await addToFavorites(product);
        message.success(`${product.product?.name || 'Product'} added to favorites!`);
      }
    } finally {
      setLoadingFav(false);
    }
  }

  const handleAdd = async () => {
    setLoadingCart(true);
    try {
      await addToCart({ ...product, price: discountedPrice, quantity: 1 });
      message.success(`${product.product?.name || 'Product'} added to cart!`);
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <Link href={`/variant/${product.id}`} className="relative p-3 col-span-1 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group" style={{ border: `1px solid ${token.colorBorderSecondary}`, backgroundColor: token.colorBgContainer }}>
      {flashSale && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-xl rounded-tl-xl z-10 shadow-md">
          {flashSale.discount_percentage}% OFF
        </div>
      )}
      <div className="absolute top-3 right-3 z-50">
        <Button
          shape="circle"
          size="middle"
          aria-label="Add to wishlist"
          type="text"
          loading={loadingFav}
          className="backdrop-blur-xl shadow-lg duration-500 transition-transform"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavorite(favorites.some((fav) => fav.id === product.id) ? 'remove' : 'add')
          }}
          icon={favorites.some((fav) => fav.id === product.id) ?
            <HeartFilled style={{ color: 'red' }} className="text-xl text-red-500! animate-in zoom-in" /> : <HeartOutlined className="text-xl" />
          }
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <ProductCarousel product={product} />
      </div>

      <div className="px-1">
        <h2 className="mt-4 font-bold text-sm md:text-base leading-tight truncate group-hover:text-blue-600 transition-colors" style={{ color: token.colorText }}>
          {product.product.name}
        </h2>

        <div className="flex items-center mt-3 justify-between">
          <div className="flex flex-col">
            <Text strong className="text-sm md:text-lg">₹{discountedPrice.toLocaleString()}</Text>
            {((product.mrp && product.mrp > discountedPrice) || (flashSale && product.price > discountedPrice)) && (
              <Text delete type="secondary" className="text-xs">
                ₹{flashSale ? product.price.toLocaleString() : product.mrp.toLocaleString()}
              </Text>
            )}
            {(product.stock !== undefined && product.stock <= 0) && (
              <Text type="danger" className="text-xs font-bold mt-1">
                Out of Stock
              </Text>
            )}
          </div>

          <Button
            type={cart.some((item) => item.id === product.id) ? "primary" : "default"}
            shape="circle"
            disabled={product.stock !== undefined && product.stock <= 0}
            icon={cart.some((item) => item.id === product.id) ? <ArrowRightOutlined /> : <MdOutlineAddShoppingCart className="text-lg" />}
            loading={loadingCart}
            className="shadow-md hover:scale-110 transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.stock !== undefined && product.stock <= 0) return;
              if (cart.some((item) => item.id === product.id)) {
                router.push("/cart");
              } else {
                handleAdd();
              }
            }}
          />
        </div>
      </div>
    </Link>
  );
}
