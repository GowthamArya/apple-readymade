'use client';
import { Button, InputNumber } from 'antd';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
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
        console.log(value, id, item);
        addToCart({ ...item, quantity: value - item.quantity }); 
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <Link href="/Collections">
          <Button type="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20 md:px-20 bg-green-50/50">
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-2/3">
              <img
                src={item.image_urls?.[0]}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold text-lg dark:text-white">{item.product?.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center mt-2 md:mt-0 gap-2">
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(value) => handleQuantityChange(value || 1, item.id)}
              />
              <Button danger onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </div>
          </div>
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
    </div>
  );
}
