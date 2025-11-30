
"use client";

import Link from "next/link";
import { Tag, Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

export default function OrdersList({ orders }: { orders: any[] }) {
    return (
        <div className="space-y-4">
            {orders && orders.length > 0 ? (
                orders.map((order: any) => (
                    <Link href={`/orders/${order.id}`} key={order.id} className="block">
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <Typography.Text strong>Order #{order.id}</Typography.Text>
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <Tag color={order.status === "paid" ? "green" : order.status === "pending" ? "orange" : "blue"}>
                                    {order.status.toUpperCase()}
                                </Tag>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography.Text>
                                    Total: <strong>₹{order.total_amount}</strong>
                                </Typography.Text>
                                <Button type="link" icon={<RightOutlined />}>
                                    View Details
                                </Button>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                {order.order_items?.length} items
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-10">
                    <Typography.Text>No orders found.</Typography.Text>
                    <br />
                    <Link href="/collections">
                        <Button type="primary" className="mt-4">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
