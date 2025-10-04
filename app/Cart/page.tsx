'use client';
import { Tabs, Button, InputNumber, Card } from 'antd';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function CartPage() {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const { favorites, removeFromFavorites, clearFavorites, addToFavorites } = useFavorites();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalPrice);
  }, [cart]);

  const handleQuantityChange = (value: number, id: number) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    if (value <= 0) {
      removeFromCart(id);
    } else {
      addToCart({ ...item, quantity: value - item.quantity });
    }
  };

  const CartTab = () => (
    <>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 p-4">
          <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
          <Link href="/collections">
            <Button type="primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap pt-3">
            {cart.map((item) => (
              <Card
                key={item.id}
                className="!p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                hoverable
                cover={
                  <img
                    alt={item.product?.name}
                    src={item.image_urls?.[0]}
                    className="h-48 w-full object-cover"
                  />
                }
                actions={[
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(value || 1, item.id)}
                    key="quantity"
                  />,
                  <Button danger type="dashed" onClick={() => removeFromCart(item.id)} key="remove">
                    Remove
                  </Button>,
                  <Button block type='primary' 
                    onClick={() => {
                      removeFromCart(item.id);
                      addToFavorites(item);
                    }}>
                      Move to Wishlist
                    </Button>,
                ]}
                >
                <Meta
                  title={item.product?.name}
                  description={`₹${item.price} x ${item.quantity}`}
                />
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold">
              Total: <span className="text-green-700 dark:text-green-300">₹{total}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={clearCart}>Clear Cart</Button>
              <Button type="primary">Proceed to Checkout</Button>
            </div>
          </div>
        </>
      )}
    </>
  );


  const WishlistTab = () => (
    <>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 p-4">
          <h1 className="text-2xl font-semibold mb-2">Your wishlist is empty</h1>
          <Link href="/collections">
            <Button type="primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap pt-3">
            {favorites.map((item) => (
              <Card
                key={item.id}
                className="!p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                hoverable
                cover={
                  <img
                    alt={item.product?.name}
                    src={item.image_urls?.[0]}
                    className="h-48 w-full object-cover"
                  />
                }
                actions={[
                  <Button type="link" danger onClick={() => removeFromFavorites(item.id)} key="remove">
                    Remove
                  </Button>,
                  <Button type="primary" onClick={() => {
                    removeFromFavorites(item.id);
                    addToCart(item);
                  }} key="remove">
                    Move To Cart
                  </Button>,
                ]}
              >
                <Meta
                  title={item.product?.name}
                  description={`₹${item.price}`}
                />
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={clearFavorites}>Clear Wishlist</Button>
          </div>
        </>
      )}
    </>
  );


  return (
    <div className="min-h-screen px-4 py-20 md:px-20 bg-green-50/50">
      <Tabs defaultActiveKey="cart" centered items={[
        {
          key: 'cart',
          label: (
            <span className="flex items-center gap-1">
              <ShoppingCartOutlined />
              Your Bag ({cart.length})
            </span>
          ),
          children: <CartTab />,
        },
        {
          key: 'wishlist',
          label: (
            <span className="flex items-center gap-1">
              <HeartOutlined />
              Your Wishlist ({favorites.length})
            </span>
          ),
          children: <WishlistTab />,
        }
      ]} />
    </div>
  );
}
