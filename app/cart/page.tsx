'use client';
import { Tabs, Button, InputNumber, Card, Col, Row } from 'antd';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';

const { Meta } = Card;

export default function CartPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("cart");

  useEffect(() => {
    const tab = searchParams.get("activeTab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const { favorites, removeFromFavorites, clearFavorites, addToFavorites } = useFavorites();
  const [total, setTotal] = useState(0);
  const [isLoading,setIsLoading] = useState(true);
  useEffect(()=>{
    setIsLoading(false);
  },[]);

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
            <Row gutter={16} justify="start">
              {cart.map((item) => (
                <Col 
                  key={item.id}
                  xs={{ flex: '100%' }}
                  sm={{ flex: '50%' }}
                  md={{ flex: '50%' }}
                  lg={{ flex: '25%' }}
                  xl={{ flex: '25%' }}
                >
                  <Card
                    className="m-2! w-full shadow-lg"
                    hoverable
                    loading={isLoading}
                    cover={
                      <img
                        alt={item.product?.name}
                        src={item.image_urls?.[0] ?? '/no-image.png'}
                        className="h-48 w-full object-cover"
                      />
                    }
                  >
                    <Meta
                      title={item.product?.name}
                      description={`₹${item.price} x ${item.quantity}`}
                    />

                    {/* Custom Action Buttons */}
                    <div className="mt-4 flex flex-wrap flex-row gap-2">
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(value || 1, item.id)}
                      />

                        <Button danger type="dashed" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </Button>

                        <Button  type="primary" onClick={() => {
                          removeFromCart(item.id);
                          addToFavorites({...item, quantity:1});
                        }}>
                          Move to Wishlist
                        </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold">
              Total: <span className="text-green-700 dark:text-green-300">₹{total}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={clearCart}>Clear Cart</Button>
              <Link href="/checkout"><Button type="primary">Proceed to Checkout</Button></Link>
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
          <Row gutter={16 } justify="start">
            {favorites.map((item) => (
              <Col 
                  key={item.id}
                  xs={{ flex: '100%' }}
                  sm={{ flex: '50%' }}
                  md={{ flex: '50%' }}
                  lg={{ flex: '25%' }}
                  xl={{ flex: '25%' }}
                >
                  <Card
                    className="m-2! w-full shadow-lg"
                    hoverable
                    cover={
                      <img
                        alt={item.product?.name}
                        src={item.image_urls?.[0] ?? '/no-image.png'}
                        className="h-48 w-full object-cover"
                      />
                    }
                    actions={[
                      <Button type="dashed" danger onClick={() => removeFromFavorites(item.id)} key="remove">
                        Remove
                      </Button>,
                      <Button type="primary" onClick={() => {
                        item.quantity = 1;
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
              </Col>
            ))}
          </Row>
          <div className="mt-8 flex justify-end">
            <Button onClick={clearFavorites}>Clear Wishlist</Button>
          </div>
        </>
      )}
    </>
  );


  return (
    <div className="min-h-screen px-4 py-20 md:px-20">
      <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={[
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
