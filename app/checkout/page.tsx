"use client";

import { useMemo, useState } from "react";
import { Card, Row, Col, Typography, InputNumber, Button, Divider, Form, Input, Space, theme, App } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { token } = theme.useToken();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { message } = App.useApp();

  const [paying, setPaying] = useState(false);
  const [points, setPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Fetch points on mount
  useState(() => {
    fetch("/api/user/points")
      .then((res) => res.json())
      .then((data) => {
        if (data.points) setPoints(data.points);
      })
      .catch((err) => console.error("Failed to fetch points", err));
  });

  const subtotal = useMemo(
    () => cart.reduce((acc: number, it: any) => acc + Number(it.price || 0) * Number(it.quantity || 1), 0),
    [cart]
  );
  const shipping = 0; // add logic if needed

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.floor(subtotal * (appliedCoupon.discount_percentage / 100));
  }, [subtotal, appliedCoupon]);

  // Points logic: 1 Point = 1 INR
  const pointsValue = redeemPoints ? Math.min(points, subtotal + shipping - discountAmount) : 0;

  const total = Math.max(0, subtotal + shipping - discountAmount - pointsValue);

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const res = await fetch(`/api/flash-sales?code=${couponCode}`);
      const data = await res.json();
      if (data.sale) {
        setAppliedCoupon(data.sale);
        message.success(`Coupon applied! ${data.sale.discount_percentage}% off.`);
      } else {
        message.error("Invalid or expired coupon.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      message.error("Failed to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    message.info("Coupon removed.");
  };

  const handleQtyChange = (value: number, id: number) => {
    const item = cart.find((x: any) => x.id === id);
    if (!item) return;
    if (value <= 0) removeFromCart(id);
    else addToCart({ ...item, quantity: value - item.quantity });
  };

  const payWithRazorpay = async (values: any) => {
    if (!cart.length) {
      message.warning("Your cart is empty.");
      return;
    }
    try {
      setPaying(true);

      // If total is 0 (fully paid by points), handle directly
      if (total === 0 && redeemPoints) {
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 0, // 0 amount
            items: cart,
            shippingAddress: {
              name: values.name,
              email: values.email,
              contact: values.phone,
              address: values.address,
              city: values.city,
              state: values.state,
              pincode: values.pincode
            },
            pointsRedeemed: pointsValue
          }),
        });
        const data = await res.json();
        if (data.dbOrderId) {
          message.success("Order placed successfully!");
          clearCart();
          window.location.href = "/orders";
        } else {
          throw new Error(data.error || "Order placement failed");
        }
        return;
      }

      const ready = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ready) throw new Error("Failed to load Razorpay");

      // Create order (paise)
      const amountPaise = Math.round(total * 100);
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          items: cart,
          shippingAddress: {
            name: values.name,
            email: values.email,
            contact: values.phone,
            address: values.address,
            city: values.city,
            state: values.state,
            pincode: values.pincode
          },
          pointsRedeemed: pointsValue
        }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error(data.error ?? "Failed to create order");

      const options = {
        key: "rzp_test_RawNjBLLBDM7q9",                 // make sure this is not undefined
        amount: amountPaise,
        currency: "INR",
        name: "Apple Menswear",
        description: "Order payment",
        order_id: data.orderId,
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.phone ?? "",
        },
        theme: { color: token.colorPrimary },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const vr = await verify.json();
          if (vr.verified) {
            message.success("Payment successful!");
            clearCart();
            window.location.href = "/orders"; // Redirect to Orders page
          } else {
            message.error("Verification failed.");
            window.location.href = "/checkout/cancel";
          }
        },
        modal: { ondismiss: () => message.info("Payment cancelled") },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      message.error(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="px-4 md:px-10 lg:px-16 py-10">
      <Typography.Title level={2} style={{ color: token.colorTextHeading, marginBottom: token.marginSM }}>
        Checkout
      </Typography.Title>

      {!cart.length ? (
        <Card>
          <Space direction="vertical" size="middle">
            <Typography.Text>Your cart is empty.</Typography.Text>
            <Link href="/collections">
              <Button type="primary">Browse Products</Button>
            </Link>
          </Space>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {/* Left: Contact + Address + Review items */}
          <Col xs={24} md={16}>
            <Card
              title="Contact information"
              styles={{ header: { borderBottom: `1px solid ${token.colorBorderSecondary}` } }}
            >
              <Form
                layout="vertical"
                onFinish={(values: any) => {
                  void payWithRazorpay(values);
                }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Full name"
                      name="name"
                      rules={[{ required: true, message: "Please enter full name" }]}
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
                    >
                      <Input placeholder="john@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Phone" name="phone">
                      <Input placeholder="9876543210" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Typography.Title level={5} style={{ marginBottom: token.marginSM }}>
                  Shipping address
                </Typography.Title>
                <Row gutter={16}>
                  <Col xs={24} md={16}>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[{ required: true, message: "Please enter address" }]}
                    >
                      <Input placeholder="Street, Area" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
                      <Input placeholder="500001" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="City" name="city" rules={[{ required: true }]}>
                      <Input placeholder="Hyderabad" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="State" name="state" rules={[{ required: true }]}>
                      <Input placeholder="Telangana" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Typography.Title level={5} style={{ marginBottom: token.marginSM }}>
                  Review items
                </Typography.Title>

                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  {cart.map((item: any) => (
                    <Card
                      key={item.id}
                      size="small"
                      styles={{ body: { padding: 12 } }}
                      style={{ borderColor: token.colorBorderSecondary }}
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image_urls?.[0] || "/no-image.png"}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Typography.Text strong>{item.product?.name}</Typography.Text>
                          <div className="text-sm text-gray-500">
                            {item.size ? `Size: ${item.size} ` : ""} {item.color ? `• Color: ${item.color}` : ""}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Typography.Text>₹{item.price}</Typography.Text>
                            <Space.Compact>
                              <InputNumber
                                min={1}
                                value={item.quantity}
                                onChange={(val) => handleQtyChange(Number(val || 1), item.id)}
                              />
                              <Button danger onClick={() => removeFromCart(item.id)} icon={<DeleteOutlined />} />
                            </Space.Compact>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Space>

                <div className="mt-4 flex items-center justify-between">
                  <Link href="/cart?activeTab=cart">
                    <Button>Back to Cart</Button>
                  </Link>
                  <Button type="primary" htmlType="submit" loading={paying}>
                    Pay ₹{total}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          {/* Right: Order summary */}
          <Col xs={24} md={8}>
            <Card title="Order summary">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div className="flex justify-between">
                  <Typography.Text>Subtotal</Typography.Text>
                  <Typography.Text>₹{subtotal}</Typography.Text>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button danger onClick={removeCoupon}>Remove</Button>
                  ) : (
                    <Button type="primary" onClick={applyCoupon} loading={couponLoading}>Apply</Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <Typography.Text type="success">Discount ({appliedCoupon.coupon_code})</Typography.Text>
                    <Typography.Text type="success">-₹{discountAmount}</Typography.Text>
                  </div>
                )}
                <div className="flex justify-between">
                  <Typography.Text strong>Total</Typography.Text>
                  <Typography.Text strong>₹{total}</Typography.Text>
                </div>
                <Button
                  block
                  type="primary"
                  onClick={() =>
                    // Submit the form programmatically by triggering the primary action
                    document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click()
                  }
                  loading={paying}
                >
                  Pay ₹{total}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
