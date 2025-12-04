"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, InputNumber, DatePicker, message, Tag, Typography, Card, Input } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function FlashSalesAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth");
        } else if (status === "authenticated") {
            fetchSales();
        }
    }, [status, router]);

    const fetchSales = async () => {
        try {
            const res = await fetch("/api/flash-sales?all=true");
            const data = await res.json();
            if (data.sales) setSales(data.sales);
        } catch (error) {
            message.error("Failed to fetch sales");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values: any) => {
        try {
            const res = await fetch("/api/flash-sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    coupon_code: values.coupon_code,
                    discount_percentage: values.discount_percentage,
                    start_time: values.timeRange[0].toISOString(),
                    end_time: values.timeRange[1].toISOString(),
                }),
            });

            if (res.ok) {
                message.success("Flash sale created");
                setIsModalOpen(false);
                form.resetFields();
                fetchSales();
            } else {
                const err = await res.json();
                message.error(err.error || "Failed to create sale");
            }
        } catch (error) {
            message.error("Error creating sale");
        }
    };

    const columns = [
        {
            title: "Coupon Code",
            dataIndex: "coupon_code",
            key: "coupon_code",
            render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
        },
        {
            title: "Discount",
            dataIndex: "discount_percentage",
            key: "discount",
            render: (val: number) => `${val}%`,
        },
        {
            title: "Start Time",
            dataIndex: "start_time",
            key: "start",
            render: (val: string) => dayjs(val).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "End Time",
            dataIndex: "end_time",
            key: "end",
            render: (val: string) => dayjs(val).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Status",
            key: "status",
            render: (_: any, record: any) => {
                const now = dayjs();
                const start = dayjs(record.start_time);
                const end = dayjs(record.end_time);
                const isActive = record.active && now.isAfter(start) && now.isBefore(end);
                return isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>;
            },
        },
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <Typography.Title level={2}>Flash Sales Management</Typography.Title>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Flash Sale
                </Button>
            </div>

            <Table dataSource={sales} columns={columns} rowKey="id" loading={loading} />

            <Modal
                title="Create Flash Sale"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="coupon_code" label="Coupon Code" rules={[{ required: true, message: 'Please enter coupon code' }]}>
                        <Input placeholder="e.g. FLASH50" />
                    </Form.Item>
                    <Form.Item name="discount_percentage" label="Discount (%)" rules={[{ required: true }]}>
                        <InputNumber min={1} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="timeRange" label="Duration" rules={[{ required: true }]}>
                        <DatePicker.RangePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
