"use client"
import { Card, Col, Divider, Image, Row, Tag, Typography, Timeline, Button, Spin, Empty } from "antd";
import { useEffect, useState } from "react";
import { TruckOutlined, InfoCircleOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";

export default function OrderDetails({ order }: { order: any }) {
    const [tracking, setTracking] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (order.shiprocket_shipment_id) {
            fetchTracking(order.shiprocket_shipment_id);
        }
    }, [order.shiprocket_shipment_id]);

    const fetchTracking = async (shipmentId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/shipping/tracking?shipmentId=${shipmentId}`);
            const data = await res.json();
            console.log({ data });
            if (data[shipmentId]) {
                setTracking(data[shipmentId].tracking_data);
            }
        } catch (err) {
            console.error("Failed to fetch tracking details", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = () => {
        Modal.confirm({
            title: 'Are you sure you want to cancel this order?',
            content: 'If you have already paid, a refund will be initiated to your original payment method.',
            okText: 'Yes, Cancel Order',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                setActionLoading(true);
                try {
                    const res = await fetch('/api/orders/cancel', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                        message.success('Order cancelled successfully');
                        router.refresh();
                    } else {
                        message.error(data.error || 'Failed to cancel order');
                    }
                } catch (err) {
                    message.error('An error occurred while cancelling the order');
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const handleReturnOrder = () => {
        Modal.confirm({
            title: 'Request Return',
            content: 'Are you sure you want to request a return for this order?',
            okText: 'Request Return',
            cancelText: 'Cancel',
            onOk: async () => {
                setActionLoading(true);
                try {
                    const res = await fetch('/api/orders/return', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                        message.success('Return requested successfully');
                        router.refresh();
                    } else {
                        message.error(data.error || 'Failed to request return');
                    }
                } catch (err) {
                    message.error('An error occurred while requesting return');
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'green';
            case 'pending': return 'orange';
            case 'shipped': return 'blue';
            case 'delivered': return 'success';
            case 'cancelled': return 'red';
            case 'refunded': return 'magenta';
            case 'return_requested': return 'warning';
            case 'returned': return 'default';
            default: return 'orange';
        }
    };

    const trackingHistory = tracking?.shipment_track_activities || [];
    const isDelivered = tracking?.current_status?.toLowerCase() === 'delivered' || order.status === 'delivered';
    const canCancel = ['paid', 'pending'].includes(order.status) && !isDelivered;

    const deliveryActivity = tracking?.shipment_track_activities?.find((a: any) => a.activity.toLowerCase() === 'delivered');
    // If we can't find exact delivery date from tracking, fallback to updated_at if status is delivered, else strict (false) or lenient (true)? 
    // Let's rely on status. If status is delivered, we assume updated_at is close to delivery time if tracking fails.
    const deliveryDate = deliveryActivity ? deliveryActivity.date : (order.status === 'delivered' ? order.updated_at : null);

    // Check if within 7 days
    const isWithin7Days = deliveryDate
        ? (new Date().getTime() - new Date(deliveryDate).getTime()) / (1000 * 3600 * 24) <= 7
        : false;

    const canReturn = isDelivered && order.status !== 'return_requested' && order.status !== 'returned' && isWithin7Days;

    const error = tracking?.error;
    return (
        <div className="px-4 md:px-8 lg:px-16 py-8">
            <Typography.Title level={2}>Order #{order.id}</Typography.Title>
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex gap-4 items-center">
                    <Typography.Text>
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                    </Typography.Text>
                    <Tag color={getStatusColor(order.status)}>
                        {order.status.toUpperCase().replace('_', ' ')}
                    </Tag>
                    {canCancel && (
                        <Button
                            danger
                            size="small"
                            icon={<CloseCircleOutlined />}
                            onClick={handleCancelOrder}
                            loading={actionLoading}
                        >
                            Cancel Order
                        </Button>
                    )}
                    {canReturn && (
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={handleReturnOrder}
                            loading={actionLoading}
                        >
                            Return Order
                        </Button>
                    )}
                </div>
                {isDelivered && !canReturn && order.status !== 'returned' && order.status !== 'return_requested' && (
                    <Typography.Text type="secondary" className="text-xs">
                        * Return window closed (7 days from delivery).
                    </Typography.Text>
                )}
                {canReturn && (
                    <Typography.Text type="secondary" className="text-xs">
                        * Return available within 7 days of delivery. Refund processed as Loyalty Points within 5 working days.
                    </Typography.Text>
                )}
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card title="Items">
                        {order.order_items?.map((item: any) => {
                            const variant = item.product?.variant?.find((v: any) => v.id === item.variant_id) || {};
                            const imageUrl = variant.image_urls?.[0] || item.product?.image_urls?.[0];

                            return (
                                <div key={item.id} className="flex gap-4 mb-4 border-b pb-4 last:border-0 last:pb-0">
                                    <Image
                                        src={imageUrl || "/no-image.png"}
                                        alt={item.product?.name}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <div className="flex-1">
                                        <Typography.Text strong className="block text-lg">
                                            {item.product?.name}
                                        </Typography.Text>
                                        <Typography.Text>
                                            Qty: {item.quantity} × ₹{item.price}
                                        </Typography.Text>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {variant.size && `Size: ${variant.size}`} {variant.color && `• Color: ${variant.color}`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Typography.Text strong>₹{item.price * item.quantity}</Typography.Text>
                                    </div>
                                </div>
                            )
                        })}
                    </Card>

                    {order.shiprocket_shipment_id && (
                        <Card
                            title={<div className="flex items-center gap-2"><TruckOutlined /> Live Tracking</div>}
                            className="mt-6!"
                        >
                            {loading ? (
                                <Spin tip="Fetching tracking status...">
                                    <div className="py-10" />
                                </Spin>
                            ) : trackingHistory.length > 0 ? (
                                <Timeline
                                    items={trackingHistory.map((activity: any) => ({
                                        children: (
                                            <div>
                                                <Typography.Text strong>{activity.activity}</Typography.Text>
                                                <div className="text-xs text-gray-500">
                                                    {activity.location} • {new Date(activity.date).toLocaleString()}
                                                </div>
                                            </div>
                                        ),
                                        color: activity.activity.toLowerCase().includes('delivered') ? 'green' : 'blue'
                                    }))}
                                />
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={error ? error : "Tracking information will be available once the carrier updates the status."}
                                />
                            )}
                            {tracking?.track_url && (
                                <Button
                                    type="primary"
                                    block
                                    href={tracking.track_url}
                                    target="_blank"
                                    className="mt-4"
                                >
                                    Track on External Site
                                </Button>
                            )}
                        </Card>
                    )}
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Shipping Address">
                        {order.shipping_address ? (
                            <div className="flex flex-col">
                                <Typography.Text strong>{order.shipping_address.name}</Typography.Text>
                                <Typography.Text>{order.shipping_address.address}</Typography.Text>
                                <Typography.Text>
                                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                </Typography.Text>
                                <Typography.Text className="mt-2">
                                    Phone: {order.shipping_address.contact}
                                </Typography.Text>
                            </div>
                        ) : (
                            <Typography.Text type="secondary">No address details</Typography.Text>
                        )}
                    </Card>

                    <Card title="Payment Summary" className="mt-4!">
                        <div className="flex justify-between mb-2">
                            <Typography.Text>Subtotal</Typography.Text>
                            <Typography.Text>₹{order.total_amount}</Typography.Text>
                        </div>
                        <div className="flex justify-between mb-2">
                            <Typography.Text>Shipping</Typography.Text>
                            <Typography.Text>Free</Typography.Text>
                        </div>
                        <Divider className="my-2" />
                        <div className="flex justify-between">
                            <Typography.Text strong>Total Paid</Typography.Text>
                            <Typography.Text strong className="text-lg">
                                ₹{order.total_amount}
                            </Typography.Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}