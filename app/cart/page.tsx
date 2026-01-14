'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Button, Card, Col, Row, theme, Space, Typography, Empty, Image, Divider, Badge, App } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';

const { Title, Text } = Typography;

export default function CartPage() {
  const { token } = theme.useToken();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  const [activeTab, setActiveTab] = useState('cart');
  const [total, setTotal] = useState(0);

  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const { favorites, removeFromFavorites, addToFavorites } = useFavorites();

  /* ---------------- URL tab sync ---------------- */
  useEffect(() => {
    const tab = searchParams.get('activeTab');
    if (tab === 'cart' || tab === 'wishlist') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  /* ---------------- Total calculation ---------------- */
  useEffect(() => {
    setTotal(
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  }, [cart]);

  /* ---------------- Quantity handling ---------------- */
  const updateQuantity = (id: number, newQty: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item || newQty < 1) return;

    if (item.stock !== undefined && newQty > item.stock && newQty > item.quantity) {
      message.warning(`Only ${item.stock} units available!`);
      return;
    }

    const delta = newQty - item.quantity;
    if (delta !== 0) {
      addToCart(item, delta);
    }
  };

  /* ---------------- Cart Tab ---------------- */
  const CartTab = useMemo(
    () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed">
            <Empty description="Your cart is empty" >
              <Link href="/collections">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                >
                  Start Shopping
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="rounded-3xl border overflow-hidden">
                <div className="p-4 border-b flex justify-between">
                  <Title level={4} style={{ margin: 0 }}>
                    Items ({cart.length})
                  </Title>
                  <Button type="text" danger onClick={clearCart}>
                    Clear All
                  </Button>
                </div>

                <div className="p-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 mb-2 p-2 rounded-2xl border border-transparent hover:border-gray-200 transition-colors"
                    >
                      <div className="h-32 w-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={item.image_urls?.[0] ?? '/no-image.png'}
                          alt={item.product?.name ?? 'Product'}
                          preview={false}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <Link href={`/variant/${item.id}`}>
                          <Title level={5} className="cursor-pointer hover:text-blue-600 transition-colors m-0!">
                            {item.product?.name}
                          </Title>
                        </Link>

                        <Text type="secondary" className="block mt-1">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </Text>

                        {item.stock !== undefined && item.stock <= 5 && (
                          <Text type="danger" strong className="text-xs block mt-1">
                            {item.stock <= 0 ? "Out of Stock" : `Only ${item.stock} left!`}
                          </Text>
                        )}

                        <div className="mt-2 flex items-center gap-4 flex-wrap">
                          <Space.Compact>
                            <Button
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>
                            <div className="px-4 flex items-center">
                              <Text strong>{item.quantity}</Text>
                            </div>
                            <Button
                              disabled={item.stock !== undefined && item.quantity >= item.stock}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </Space.Compact>

                          <Button
                            type="text"
                            icon={<HeartOutlined />}
                            onClick={() => {
                              removeFromCart(item.id);
                              addToFavorites(item);
                            }}
                          >
                            Save for later
                          </Button>
                        </div>
                      </div>

                      <div className="text-right flex flex-row md:flex-col justify-between items-center md:items-end mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <Title level={4} style={{ margin: 0 }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </Title>
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className="sticky top-20">
                <div className="md:p-4 p-2 rounded-3xl border">
                  <Title level={3}>Order Summary</Title>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Text>Subtotal</Text>
                      <Text strong>₹{total.toLocaleString()}</Text>
                    </div>
                  </div>

                  <Divider />

                  <div className="flex justify-between text-xl font-bold">
                    <Text>Total</Text>
                    <Text style={{ color: token.colorPrimary }}>
                      ₹{total.toLocaleString()}
                    </Text>
                  </div>

                  <Link href="/checkout">
                    <Button
                      type="primary"
                      block
                      size="large"
                      className="mt-2!"
                      icon={<ShoppingCartOutlined />}
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div >
    ),
    [cart, total, token]
  );

  /* ---------------- Wishlist Tab ---------------- */
  const WishlistTab = useMemo(
    () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed">
            <Empty description="Your wishlist is empty">
              <Link href="/collections">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                >
                  Start Shopping
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {favorites.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <div
                  className="group relative flex flex-col h-full rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[1/1] overflow-hidden bg-gray-100">
                    <Image
                      src={item.image_urls?.[0] ?? '/no-image.png'}
                      alt={item.product?.name ?? 'Product'}
                      preview={false}
                      className="h-full w-full object-cover aspect-[1/1] transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        shape="circle"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromFavorites(item.id)}
                        className="shadow-md"
                      />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/variant/${item.id}`} className="block">
                      <Title level={5} className="mb-1 line-clamp-1 hover:text-blue-600 transition-colors" title={item.product?.name}>
                        {item.product?.name}
                      </Title>
                    </Link>

                    <Text type="secondary" className="text-xs mb-2 block">
                      {item.size ? `Size: ${item.size}` : ''}
                      {item.color ? (item.size ? ` • ${item.color}` : `Color: ${item.color}`) : ''}
                    </Text>

                    <div className="mt-auto flex items-center justify-between">
                      <Text strong className="text-lg">₹{item.price}</Text>
                      <Button
                        type="primary"
                        size="middle"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => {
                          removeFromFavorites(item.id);
                          addToCart(item, 1);
                        }}
                        className="bg-black text-white hover:bg-gray-800 border-none shadow-none"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    ),
    [favorites]
  );

  return (
    <div
      className="min-h-screen py-4"
      style={{ backgroundColor: token.colorBgContainer }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'cart',
              label: (
                <span className="flex items-center gap-2">
                  <ShoppingCartOutlined /> Cart
                  {cart.length > 0 && (
                    <Badge
                      size="small"
                      offset={[0, -12]}
                      count={cart.length}
                      color={token.colorPrimary}
                    />
                  )}
                </span>
              ),
              children: CartTab,
            },
            {
              key: 'wishlist',
              label: (
                <span className="flex items-center gap-2">
                  <HeartOutlined /> Wishlist
                  {favorites.length > 0 && (
                    <Badge
                      size="small"
                      offset={[0, -12]}
                      count={favorites.length}
                      color={token.colorPrimary}
                    />
                  )}
                </span>
              ),
              children: WishlistTab,
            },
          ]}
        />
      </div>
    </div>
  );
}
