"use client";

import Link from "next/link";
import { Tag, Typography, Button, List, Card, Space, theme, Empty } from "antd";
import { ShoppingOutlined, CalendarOutlined, FileTextOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useToken } = theme;

export default function OrdersList({ orders }: { orders: any[] }) {
    const { token } = useToken();

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Empty
                    image={<img src="/not_found_boy.png" alt="No orders" style={{ height: 200, objectFit: 'contain', margin: '0 auto' }} />}
                    description={<Text type="secondary">No orders found.</Text>}
                >
                    <Link href="/collections">
                        <Button className="mt-4" type="primary" size="middle" icon={<ShoppingOutlined />}>
                            Shop Now
                        </Button>
                    </Link>
                </Empty>
            </div>
        );
    }

    return (
        <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
            dataSource={orders}
            renderItem={(order) => (
                <List.Item>
                    <Link href={`/orders/${order.id}`}>
                        <Card
                            hoverable
                            style={{
                                borderColor: token.colorBorderSecondary,
                                borderRadius: token.borderRadiusLG,
                                transition: 'all 0.3s ease',
                                height: '100%'
                            }}
                            styles={{ body: { padding: '20px' } }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Space align="center" className="mb-1">
                                        <FileTextOutlined style={{ color: token.colorPrimary }} />
                                        <Text strong style={{ fontSize: 16 }}>
                                            Order #{typeof order.id === 'string' && order.id.length > 8 ? `${order.id.slice(0, 8)}...` : order.id}
                                        </Text>
                                    </Space>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                                        <CalendarOutlined />
                                        {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <Tag color={order.status === "paid" ? "success" : order.status === "pending" ? "warning" : "processing"} style={{ margin: 0, borderRadius: 12, padding: '0 10px' }}>
                                    {order.status?.toUpperCase() || 'UNKNOWN'}
                                </Tag>
                            </div>

                            <div className="flex justify-between items-end pt-2 border-t" style={{ borderColor: token.colorSplit }}>
                                <div>
                                    <Text type="secondary" className="text-xs block mb-1">Total Amount</Text>
                                    <Text strong style={{ fontSize: 18, color: token.colorPrimary }}>
                                        ₹{order.total_amount?.toLocaleString('en-IN') || 0}
                                    </Text>
                                </div>
                                <div className="text-right">
                                    <Text type="secondary" className="text-xs block mb-1">Items</Text>
                                    <Text strong>{order.order_items?.length || 0}</Text>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </List.Item>
            )}
        />
    );
}
