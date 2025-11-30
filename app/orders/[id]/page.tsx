
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { Card, Typography, Divider, Tag, Image, Row, Col } from "antd";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth");
    }

    const { data: order, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product(*, variant(*)))") // Nested fetch might need adjustment depending on schema
        .eq("id", params.id)
        .eq("user_id", session.user.id) // Ensure user owns the order
        .single();

    if (error || !order) {
        console.error("Error fetching order:", error);
        return <div className="p-8">Order not found or access denied.</div>;
    }

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8">
            <Typography.Title level={2}>Order #{order.id}</Typography.Title>
            <div className="flex gap-4 mb-6">
                <Typography.Text type="secondary">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                </Typography.Text>
                <Tag color={order.status === "paid" ? "green" : "orange"}>
                    {order.status.toUpperCase()}
                </Tag>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card title="Items">
                        {order.order_items?.map((item: any) => {
                            // Find the specific variant details if needed, or use what's returned
                            // Assuming item.variant_id links to variant table
                            // We might need to fetch variant details separately or rely on product info
                            const variant = item.product?.variant?.find((v: any) => v.id === item.variant_id) || {};
                            const imageUrl = variant.image_urls?.[0] || item.product?.image_urls?.[0];

                            return (
                                <div key={item.id} className="flex gap-4 mb-4 border-b pb-4 last:border-0 last:pb-0">
                                    <Image
                                        src={imageUrl || "/placeholder.png"}
                                        alt={item.product?.name}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <div className="flex-1">
                                        <Typography.Text strong className="block text-lg">
                                            {item.product?.name}
                                        </Typography.Text>
                                        <Typography.Text type="secondary">
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

                    <Card title="Payment Summary" className="mt-4">
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
