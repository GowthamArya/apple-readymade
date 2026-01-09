"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, Row, Col, Typography, InputNumber, Button, Divider, Form, Input, Space, theme, App, Radio, Spin } from "antd";
import { DeleteOutlined, EditOutlined, EnvironmentOutlined, PlusOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import FlashSaleBanner from "../components/FlashSaleBanner";
import { signOut } from "next-auth/react";

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
  const [form] = Form.useForm();

  const [paying, setPaying] = useState(false);
  const [points, setPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [shippingRates, setShippingRates] = useState<any>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingAmount, setShippingAmount] = useState(0);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/points")
      .then((res) => res.json())
      .then((data) => {
        if (data.points) setPoints(data.points);
      })
      .catch((err) => console.error("Failed to fetch points", err));

    // Fetch saved addresses
    setAddressesLoading(true);
    fetch("/api/user/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses) {
          setAddresses(data.addresses);
          if (data.addresses.length > 0) {
            setSelectedAddressId(data.addresses[0].id);
            fillFormWithAddress(data.addresses[0]);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch addresses", err))
      .finally(() => setAddressesLoading(false));
  }, []);

  const fillFormWithAddress = (addr: any) => {
    form.setFieldsValue({
      address: addr.line1,
      line2: addr.line2 || "",
      street: addr.street || "",
      city: addr.city,
      pincode: addr.pincode,
      state: addr.state || "",
    });
    fetchShippingRates(addr.pincode);
  };

  const fetchPincodeDetails = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`/api/shipping/pincode?pincode=${pincode}`);
      const data = await res.json();
      if (data.city) {
        form.setFieldsValue({
          city: data.city,
          state: data.state
        });
        message.success(`Found: ${data.city}, ${data.state}`);
        fetchShippingRates(pincode);
      } else if (data.error) {
        message.warning(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch pincode details", err);
    } finally {
      setPincodeLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use OpenStreetMap Nominatim for free reverse geocoding
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await res.json();
          if (data.address) {
            const addr = data.address;
            form.setFieldsValue({
              pincode: addr.postcode,
              city: addr.city || addr.town || addr.village || addr.suburb,
              state: addr.state,
              address: addr.road || addr.suburb || "",
            });
            if (addr.postcode) {
              fetchPincodeDetails(addr.postcode);
            }
          }
        } catch (err) {
          message.error("Failed to get address from location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        message.error("Unable to retrieve your location");
        setLocationLoading(false);
      }
    );
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setIsEditingAddress(true);
    setSelectedAddressId("new"); // Show the form
    fillFormWithAddress(addr);
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        if (selectedAddressId === id) {
          setSelectedAddressId("new");
          form.resetFields(["address", "line2", "street", "pincode", "city", "state"]);
        }
        message.success("Address deleted");
      }
    } catch (err) {
      message.error("Failed to delete address");
    }
  };

  const fetchShippingRates = async (pincode: string) => {
    if (!pincode || pincode.length < 6) return;
    setShippingLoading(true);
    try {
      // Calculate total weight (default 0.5kg per item)
      const totalWeight = cart.reduce((acc: number, item: any) => acc + (item.quantity * 0.5), 0);
      const res = await fetch(`/api/shipping/rates?pincode=${pincode}&weight=${totalWeight}`);
      const data = await res.json();
      if (data.data?.available_courier_companies) {
        setShippingRates(data.data.available_courier_companies);
        // Automatically pick the cheapest rate
        const cheapest = data.data.available_courier_companies.reduce((prev: any, curr: any) =>
          (prev.freight_charge < curr.freight_charge) ? prev : curr
        );
        setShippingAmount(cheapest.freight_charge);
      } else {
        setShippingRates(null);
        setShippingAmount(0);
      }
    } catch (err) {
      console.error("Failed to fetch shipping rates", err);
    } finally {
      setShippingLoading(false);
    }
  };

  const subtotal = useMemo(
    () => cart.reduce((acc: number, it: any) => acc + Number(it.price || 0) * Number(it.quantity || 1), 0),
    [cart]
  );
  const shipping = shippingAmount;

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

      // 0. Resolve the shipping address details
      let finalAddressObj = {
        name: values.name,
        email: values.email,
        contact: values.phone,
        address: values.address,
        line2: values.line2,
        street: values.street,
        city: values.city,
        state: values.state,
        pincode: values.pincode
      };

      if (selectedAddressId !== "new") {
        const addr = addresses.find(a => a.id === selectedAddressId);
        if (addr) {
          finalAddressObj = {
            ...finalAddressObj,
            address: addr.line1,
            line2: addr.line2,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode
          };
        }
      }

      // 1. If it's a new or edited address, save it to the database
      let finalAddressId = selectedAddressId;
      if (selectedAddressId === "new") {
        try {
          const method = editingAddressId ? "PUT" : "POST";
          const addrRes = await fetch("/api/user/addresses", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: editingAddressId,
              line1: values.address,
              line2: values.line2,
              street: values.street,
              city: values.city,
              pincode: values.pincode,
              state: values.state,
            }),
          });
          const addrData = await addrRes.json();
          if (addrData.address) {
            if (editingAddressId) {
              setAddresses(prev => prev.map(a => a.id === editingAddressId ? addrData.address : a));
            } else {
              setAddresses(prev => [addrData.address, ...prev]);
            }
            finalAddressId = addrData.address.id;
            setSelectedAddressId(addrData.address.id);
            setEditingAddressId(null);
            setIsEditingAddress(false);
          }
        } catch (err) {
          console.error("Failed to save address", err);
        }
      }

      // Check if shipping rates are available
      if (!shippingRates && finalAddressObj.pincode) {
        message.error("No shipping service available for this pincode.");
        console.log(shippingRates, finalAddressObj);
        setPaying(false);
        return;
      }

      // If total is 0 (fully paid by points), handle directly
      if (total === 0 && redeemPoints) {
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 0, // 0 amount
            items: cart,
            address_id: finalAddressId === "new" ? null : finalAddressId,
            shippingAddress: finalAddressObj,
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
          address_id: finalAddressId === "new" ? null : finalAddressId,
          shippingAddress: finalAddressObj,
          pointsRedeemed: pointsValue
        }),
      });
      if (res.status === 401) {
        signOut({ callbackUrl: "/auth" });
      }
      const data = await res.json();
      if (!data.orderId) throw new Error(data.error ?? "Failed to create order");

      const options = {
        key: "rzp_test_RawNjBLLBDM7q9",
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
            if (vr.shiprocket_error) {
              message.warning({
                content: `Payment successful, but shipment creation failed: ${vr.shiprocket_error}. Our team will handle it manually.`,
                duration: 10,
              });
            } else {
              message.success("Payment successful and order placed!");
            }
            clearCart();
            setTimeout(() => {
              window.location.href = "/orders/success";
            }, 2000);
          } else {
            message.error("Verification failed.");
            window.location.href = "/orders/fail";
          }
        },
        modal: { ondismiss: () => message.info("Payment cancelled") },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
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

      <FlashSaleBanner />
      {!cart.length ? (
        <Card>
          <Space orientation="vertical" size="middle">
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
                form={form}
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
                    <Form.Item
                      label="Phone"
                      name="phone"
                      normalize={(value) => value.replace(/\D/g, "")}
                      rules={[
                        { required: true, message: "Enter your phone number" },
                        { pattern: /^[6789]\d{9}$/, message: "Enter a valid 10-digit phone number" },
                      ]}
                    >
                      <Input placeholder="9876543210" maxLength={10} type="tel" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Typography.Title level={5} style={{ marginBottom: token.marginSM }}>
                  Shipping address
                </Typography.Title>

                {addresses.length > 0 && (
                  <div className="mb-6">
                    <Typography.Text type="secondary" className="mb-2 block">Choose from saved addresses:</Typography.Text>
                    <Radio.Group
                      value={selectedAddressId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedAddressId(id);
                        if (id === "new") {
                          form.resetFields(["address", "pincode", "city", "state"]);
                          setShippingAmount(0);
                          setShippingRates(null);
                        } else {
                          const addr = addresses.find(a => a.id === id);
                          fillFormWithAddress(addr);
                        }
                      }}
                      className="w-full flex flex-col "
                    >
                      {addresses.map((addr) => (
                        <div key={addr.id} className="group relative">
                          <Radio value={addr.id} className="border mb-2! px-3! py-3! rounded w-full hover:border-blue-400 transition-colors">
                            <div className="inline-block ml-2 pr-16">
                              <Typography.Text strong className="block">{addr.line1}</Typography.Text>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {addr.line2 && `${addr.line2}, `}{addr.street && `${addr.street}, `}{addr.city} - {addr.pincode}
                                {addr.state && `, ${addr.state}`}
                              </div>
                            </div>
                          </Radio>
                          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="text"
                              size="small"
                              icon={<EditOutlined className="text-blue-500" />}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEditAddress(addr);
                              }}
                            />
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <Radio value="new" className="border px-3! py-3! rounded w-full hover:border-blue-400 transition-colors">
                        <span className="ml-2 font-medium flex items-center gap-2">
                          <PlusOutlined className="text-xs" />
                          {isEditingAddress ? "Editing Address" : "Add New Address"}
                        </span>
                      </Radio>
                    </Radio.Group>
                  </div>
                )}

                {selectedAddressId === "new" && (
                  <div className="bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-300 mb-6">
                    <div className="mb-4 flex justify-between items-center">
                      <Typography.Text strong>{isEditingAddress ? "Edit Details" : "Enter Details"}</Typography.Text>
                      <Button
                        size="small"
                        icon={<EnvironmentOutlined />}
                        onClick={getCurrentLocation}
                        loading={locationLoading}
                      >
                        Use Current Location
                      </Button>
                    </div>
                    <Row gutter={16}>
                      <Col xs={24} md={24}>
                        <Form.Item
                          label="Address (Flat, House no., Building, Company, Apartment)"
                          name="address"
                          rules={[{ required: true, message: "Please enter address" }]}
                        >
                          <Input placeholder="Flat 101, Apple Residency" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Area, Street, Sector, Village" name="line2">
                          <Input placeholder="Madhapur" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Landmark (Optional)" name="street">
                          <Input placeholder="Near Hitech City Metro" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item
                          label="Pincode"
                          name="pincode"
                          normalize={(value) => value.replace(/\D/g, "")}
                          rules={[
                            { required: true, message: "Enter pincode" },
                            { pattern: /^[1-9][0-9]{5}$/, message: "Enter a valid 6-digit pincode" },
                          ]}
                        >
                          <Input
                            placeholder="508207"
                            onChange={(e) => {
                              if (e.target.value.length === 6) {
                                fetchPincodeDetails(e.target.value);
                              }
                            }}
                            maxLength={6}
                            disabled={pincodeLoading}
                            suffix={pincodeLoading ? <Spin size="small" /> : null}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="City" name="city" rules={[{ required: true }]}>
                          <Input placeholder="Hyderabad" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="State" name="state" rules={[{ required: true }]}>
                          <Input placeholder="Telangana" />
                        </Form.Item>
                      </Col>
                      {isEditingAddress && (
                        <Col xs={24}>
                          <Button
                            type="link"
                            className="p-0 h-auto"
                            onClick={() => {
                              setIsEditingAddress(false);
                              setEditingAddressId(null);
                              form.resetFields(["address", "line2", "street", "pincode", "city", "state"]);
                            }}
                          >
                            Cancel editing and add new instead
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}

                {shippingLoading && (
                  <div className="my-4 text-center">
                    <Spin size="small" /> Calculating shipping rates...
                  </div>
                )}

                {shippingRates && (
                  <div className="my-4 p-3 border rounded" style={{ borderColor: token.colorPrimary }}>
                    <Typography.Text strong className="block mb-1">
                      Shipping estimated: ₹{shippingAmount}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="text-xs">
                      Delivery expected in {shippingRates[0]?.etd || "3-5 days"} via {shippingRates[0]?.courier_name}
                    </Typography.Text>
                  </div>
                )}

                <Divider />

                <Typography.Title level={5} style={{ marginBottom: token.marginSM }}>
                  Review items
                </Typography.Title>

                <Space orientation="vertical" style={{ width: "100%" }} size="middle">
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
              <Space orientation="vertical" style={{ width: "100%" }}>
                <div className="flex justify-between">
                  <Typography.Text>Subtotal</Typography.Text>
                  <Typography.Text>₹{subtotal}</Typography.Text>
                </div>

                <div className="flex justify-between">
                  <Typography.Text>Shipping</Typography.Text>
                  <Typography.Text>{shippingAmount > 0 ? `₹${shippingAmount}` : (shippingLoading ? <Spin size="small" /> : 'Calculated at next step')}</Typography.Text>
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
                  type="primary"
                  onClick={() => form.submit()}
                  loading={paying}
                  block
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
