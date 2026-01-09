'use client';

import { Tabs, Button, InputNumber, Card, Col, Row, theme, Space, Typography, Table, Empty, Image, Divider, Badge } from 'antd';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCartOutlined, HeartOutlined, DeleteOutlined, ArrowRightOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

export default function CartPage() {
  const { token } = theme.useToken();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("cart");

  useEffect(() => {
    const tab = searchParams.get("activeTab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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
    const delta = value - item.quantity;
    addToCart({ ...item, id }, delta);
  };

  const CartTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 120 }}
            description={
              <Space vertical size="small">
                <Title level={4}>Your shopping bag is empty</Title>
                <Text type="secondary">Looks like you haven't added anything to your bag yet.</Text>
              </Space>
            }
          >
            <Link href="/collections">
              <Button type="primary" size="large" shape="round" icon={<ArrowRightOutlined />}>
                Start Shopping
              </Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                <Title level={4} style={{ margin: 0 }}>Items ({cart.length})</Title>
                <Button type="text" danger onClick={clearCart}>Clear All</Button>
              </div>
              <div className="p-2 md:p-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-4 mb-6 last:mb-0 p-4 rounded-2xl hover:bg-white dark:hover:bg-zinc-800/80 transition-all group">
                    <div className="relative h-32 w-full md:w-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <Image
                        src={item.image_urls?.[0] ?? '/no-image.png'}
                        alt={item.product?.name}
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                        preview={false}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <Link href={`/variant/${item.id}`}>
                          <Title level={5} className="group-hover:text-blue-600 transition-colors cursor-pointer mb-1">
                            {item.product?.name}
                          </Title>
                        </Link>
                        <Text type="secondary" className="text-sm block mb-2">
                          {item.size ? `Size: ${item.size}` : ''} {item.color ? ` • Color: ${item.color}` : ''}
                        </Text>
                      </div>
                      <div className="flex items-center gap-4">
                        <Space.Compact className="rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                          <Button
                            onClick={() => handleQuantityChange(item.quantity - 1, item.id)}
                            disabled={item.quantity <= 1}
                            className="border-none"
                          >
                            -
                          </Button>
                          <div className="px-4 flex items-center justify-center bg-white dark:bg-zinc-900 border-x border-gray-200 dark:border-zinc-700 min-w-[40px]">
                            <Text strong>{item.quantity}</Text>
                          </div>
                          <Button
                            onClick={() => handleQuantityChange(item.quantity + 1, item.id)}
                            className="border-none"
                          >
                            +
                          </Button>
                        </Space.Compact>
                        <Button
                          type="text"
                          size="small"
                          onClick={() => {
                            removeFromCart(item.id);
                            addToFavorites(item);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <HeartOutlined /> Save for later
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between py-1 border-t md:border-t-0 pt-4 md:pt-0">
                      <Title level={4} style={{ margin: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</Title>
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromCart(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="sticky top-24">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                <Title level={3} className="mb-6">Order Summary</Title>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <Text type="secondary">Subtotal</Text>
                    <Text strong>₹{total.toLocaleString()}</Text>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <Text type="secondary">Shipping</Text>
                    <Text strong className="text-green-500">FREE</Text>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <Text type="secondary">Tax (Estimated)</Text>
                    <Text strong>₹0</Text>
                  </div>

                  <Divider className="my-6" />

                  <div className="flex justify-between items-center text-2xl font-bold">
                    <Text strong className="text-2xl">Total</Text>
                    <Text strong className="text-2xl text-blue-600">₹{total.toLocaleString()}</Text>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="mt-8 h-14 text-lg rounded-2xl shadow-lg shadow-blue-500/30"
                    icon={<ShoppingCartOutlined />}
                  >
                    Checkout Now
                  </Button>
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
                  <Text type="secondary">Secure Checkout • Apple Verified</Text>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <ShoppingOutlined />
                </div>
                <div>
                  <Text strong className="block">Free delivery soon</Text>
                  <Text type="secondary" className="text-xs">Enjoy fast, zero-cost delivery on this order.</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );

  const WishlistTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 120 }}
            description={<Title level={4}>Your wishlist is empty</Title>}
          >
            <Link href="/collections">
              <Button type="primary" size="large" shape="round">Explore Collections</Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <Title level={2} style={{ margin: 0 }}>My Wishlist</Title>
            <Button onClick={clearFavorites} shape="round">Clear All</Button>
          </div>
          <Row gutter={[16, 16]} justify="start">
            {favorites.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="overflow-hidden group rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white dark:bg-zinc-900"
                  hoverable
                  cover={
                    <div className="relative h-64 overflow-hidden">
                      <img
                        alt={item.product?.name}
                        src={item.image_urls?.[0] ?? '/no-image.png'}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          shape="circle"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromFavorites(item.id); }}
                        />
                      </div>
                    </div>
                  }
                >
                  <div className="p-1">
                    <Title level={5} className="mb-1 truncate">{item.product?.name}</Title>
                    <Text strong className="text-lg text-blue-600 block mb-3">₹{item.price?.toLocaleString()}</Text>
                    <Button
                      type="primary"
                      block
                      shape="round"
                      icon={<ShoppingCartOutlined />}
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await removeFromFavorites(item.id);
                        await addToCart(item, 1);
                      }}
                    >
                      Move to Bag
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen py-24 md:py-32"
      style={{
        background: `radial-gradient(circle at 0% 0%, ${token.colorPrimary}05 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${token.colorPrimary}05 0%, transparent 50%)`,
        backgroundColor: token.colorBgContainer
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          className="custom-tabs"
          items={[
            {
              key: 'cart',
              label: (
                <div className="flex items-center gap-3 px-4 py-2">
                  <ShoppingCartOutlined className="text-xl" />
                  <span className="font-semibold">Shopping Bag</span>
                  {cart.length > 0 && <Badge count={cart.length} offset={[10, -5]} className="scale-75" color={token.colorPrimary} />}
                </div>
              ),
              children: <CartTab />,
            },
            {
              key: 'wishlist',
              label: (
                <div className="flex items-center gap-3 px-4 py-2">
                  <HeartOutlined className="text-xl" />
                  <span className="font-semibold">My Wishlist</span>
                  {favorites.length > 0 && <Badge count={favorites.length} offset={[10, -5]} className="scale-75" color={token.colorPrimary} />}
                </div>
              ),
              children: <WishlistTab />,
            }
          ]}
        />
      </div>

      <style jsx global>{`
            .custom-tabs .ant-tabs-nav::before { border: none !important; }
            .custom-tabs .ant-tabs-ink-bar { height: 3px !important; border-radius: 3px; }
            .custom-tabs .ant-tabs-tab { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; padding: 12px 0 !important; }
            .custom-tabs .ant-tabs-tab:hover { opacity: 0.8; }
            .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: ${token.colorPrimary} !important; border-radius: 12px; }
        `}</style>
    </div>
  );
}
