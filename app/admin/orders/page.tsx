"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Typography, message, Select, Modal, Space, Card, Descriptions } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { EyeOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewOrder, setViewOrder] = useState<any>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth");
        } else if (status === "authenticated") {
            if (session?.user?.role_name !== "admin") {
                router.push("/");
                message.error("Access denied");
            } else {
                fetchOrders();
            }
        }
    }, [status, router, session]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
            else message.error(data.error || "Failed to fetch orders");
        } catch (error) {
            message.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            setUpdating(true);
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            const data = await res.json();

            if (res.ok) {
                message.success(`Order #${id} updated to ${newStatus}`);
                setOrders((prev: any) => prev.map((o: any) => o.id === id ? { ...o, status: newStatus } : o));
                if (viewOrder?.id === id) {
                    setViewOrder({ ...viewOrder, status: newStatus });
                }
            } else {
                message.error(data.error || "Failed to update status");
            }
        } catch (err) {
            message.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            render: (id: any) => <Text strong>#{id}</Text>,
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            width: 150,
            render: (date: string) => dayjs(date).format("MMM D, YYYY HH:mm"),
        },
        {
            title: "Customer",
            key: "customer",
            render: (_: any, record: any) => (
                <div>
                    <Text strong className="block">{record.shipping_address?.name}</Text>
                    <Text type="secondary" className="text-xs">{record.shipping_address?.contact}</Text>
                </div>
            ),
        },
        {
            title: "Amount",
            dataIndex: "total_amount",
            key: "amount",
            width: 120,
            render: (val: number) => <Text strong>₹{val}</Text>,
        },
        {
            title: "Payment",
            key: "payment",
            width: 120,
            render: (_: any, record: any) => (
                <Tag color={record.razorpay_payment_id ? "green" : "orange"}>
                    {record.razorpay_payment_id ? "Paid" : "Unpaid"}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status: string, record: any) => (
                <Select
                    defaultValue={status}
                    style={{ width: 130 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                    disabled={updating}
                    size="small"
                >
                    <Option value="pending">Pending</Option>
                    <Option value="proccessing">Processing</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                    <Option value="returned">Returned</Option>
                </Select>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            render: (_: any, record: any) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => setViewOrder(record)}
                />
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>Order Management</Title>
                <Button onClick={fetchOrders} loading={loading}>Refresh</Button>
            </div>

            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                loading={loading}
                scroll={{ x: 1000 }}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={`Order #${viewOrder?.id}`}
                open={!!viewOrder}
                onCancel={() => setViewOrder(null)}
                footer={null}
                width={800}
            >
                {viewOrder && (
                    <div className="space-y-6">
                        <Descriptions title="Customer Details" bordered size="small" column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="Name">{viewOrder.shipping_address?.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{viewOrder.shipping_address?.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{viewOrder.shipping_address?.contact}</Descriptions.Item>
                            <Descriptions.Item label="Address">
                                {viewOrder.shipping_address?.address}, {viewOrder.shipping_address?.line2}, {viewOrder.shipping_address?.city}, {viewOrder.shipping_address?.state} - {viewOrder.shipping_address?.pincode}
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="Order Info" bordered size="small">
                            <Descriptions.Item label="Status">
                                <Tag color="blue">{viewOrder.status?.toUpperCase()}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount">₹{viewOrder.total_amount}</Descriptions.Item>
                            <Descriptions.Item label="Payment ID">{viewOrder.razorpay_payment_id || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Shiprocket Order">{viewOrder.shiprocket_order_id || "N/A"}</Descriptions.Item>
                        </Descriptions>

                        <div>
                            <Text strong className="block mb-2">Order Items:</Text>
                            <div className="space-y-2">
                                {viewOrder.items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 rounded border">
                                        <div>
                                            <Text strong>{item.variant?.product?.name}</Text>
                                            <div className="text-gray-500 text-sm">
                                                Size: {item.variant?.size} | Color: {item.variant?.color}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Text>x{item.quantity}</Text>
                                            <div className="font-medium">₹{item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
