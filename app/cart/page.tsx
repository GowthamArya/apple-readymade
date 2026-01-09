'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Button, Card, Col, Row, theme, Space, Typography, Empty, Image, Divider, Badge } from 'antd';
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
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              styles={{
                image: {
                  height: 120,
                },
              }}
              description={
                <Space orientation="vertical">
                  <Title level={4}>Your shopping bag is empty</Title>
                  <Text type="secondary">
                    Looks like you haven&apos;t added anything yet.
                  </Text>
                </Space>
              }
            >
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
                <div className="p-6 border-b flex justify-between">
                  <Title level={4} style={{ margin: 0 }}>
                    Items ({cart.length})
                  </Title>
                  <Button type="text" danger onClick={clearCart}>
                    Clear All
                  </Button>
                </div>

                <div className="p-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-2xl"
                    >
                      <div className="h-32 w-32 rounded-xl overflow-hidden">
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
                          <Title level={5} className="cursor-pointer">
                            {item.product?.name}
                          </Title>
                        </Link>

                        <Text type="secondary">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </Text>

                        <div className="mt-3 flex items-center gap-4">
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

                      <div className="text-right flex flex-col justify-between">
                        <Title level={4}>
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
              <div className="sticky top-24">
                <div className="p-8 rounded-3xl border">
                  <Title level={3}>Order Summary</Title>

                  <div className="space-y-3">
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
                      className="mt-6"
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
      </div>
    ),
    [cart, total, token]
  );

  /* ---------------- Wishlist Tab ---------------- */
  const WishlistTab = useMemo(
    () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {favorites.length === 0 ? (
          <Empty description="Your wishlist is empty" />
        ) : (
          <Row gutter={[16, 16]}>
            {favorites.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={item.image_urls?.[0] ?? '/no-image.png'}
                      alt={item.product?.name}
                      className="h-56 w-full object-cover"
                    />
                  }
                >
                  <Title level={5}>{item.product?.name}</Title>
                  <Text strong>₹{item.price}</Text>

                  <Space className="mt-3">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeFromFavorites(item.id)}
                    />
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => {
                        removeFromFavorites(item.id);
                        addToCart(item, 1);
                      }}
                    >
                      Move to Bag
                    </Button>
                  </Space>
                </Card>
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
      className="min-h-screen py-24"
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
                  <ShoppingCartOutlined />
                  Cart
                  {cart.length > 0 && (
                    <Badge count={cart.length} color={token.colorPrimary} />
                  )}
                </span>
              ),
              children: CartTab,
            },
            {
              key: 'wishlist',
              label: (
                <span className="flex items-center gap-2">
                  <HeartOutlined />
                  Wishlist
                  {favorites.length > 0 && (
                    <Badge
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
