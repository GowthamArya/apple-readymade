"use client";

import { useMemo, useState } from "react";
import { Card, Radio, Image, Typography, Space, Tag, Button, theme, App } from "antd";
import { ShoppingCartOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import ProductCard from "../collections/Card";

export default function VariantDetails({ variants, variant_id, productData, recommendedVariants = [] }: { variants: any[], variant_id: any, productData: any, recommendedVariants?: any[] }) {
  const { token } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { message } = App.useApp();

  const setVariantId = (id: number | string, { replace = true } = {}) => {
    const segments = pathname.split("/");
    segments[segments.length - 1] = String(id);
    const nextPath = segments.join("/");
    replace
      ? router.replace(nextPath, { scroll: false })
      : router.push(nextPath, { scroll: false });
  };
  const initialId = useMemo(() => {
    const byDefault = variants.find(v => v.id == variant_id);
    return (byDefault ?? variants[0])?.id;
  }, [variants]);

  const [selectedId, setSelectedId] = useState<number>(initialId);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => variants.find(v => v.id === selectedId) ?? variants[0],
    [variants, selectedId]
  );

  const handleShare = async () => {
    const shareData = {
      title: productData?.name,
      text: productData?.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Avoid showing an error if the user cancels the share dialog.
        if ((err as Error).name !== 'AbortError') {
          message.error('Error sharing product.');
        }
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      await navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    }
  };

  const discountPct =
    selected?.price != null && selected?.mrp != null && selected.mrp > 0
      ? Math.round(((selected.mrp - selected.price) / selected.mrp) * 100)
      : null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 min-h-screen px-4 md:px-8 lg:px-16 py-8" style={{ backgroundColor: token.colorBgContainer }}>
        {/* Left: Gallery */}
        <div>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {selected?.image_urls?.length ? (
              <Image.PreviewGroup>
                <Image
                  src={selected.image_urls[0]}
                  alt={`Variant ${selected.id}`}
                  width="100%"
                  className="h-[40vh]! md:h-[70vh]!"
                  style={{ objectFit: "cover", borderRadius: token.borderRadius }}
                  preview
                />
                {selected.image_urls.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selected.image_urls.slice(1).map((src: string, idx: number) => (
                      <Image
                        key={idx}
                        src={src}
                        alt={`Variant ${selected.id} - ${idx + 2}`}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: token.borderRadiusSM }}
                        preview={{ src }}
                      />
                    ))}
                  </div>
                )}
              </Image.PreviewGroup>
            ) : (
              <Card
                style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Typography.Text type="secondary">No images for this variant</Typography.Text>
              </Card>
            )}
          </Space>
        </div>

        {/* Right: Variant selector and buy box */}
        <div>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <div>
                <Typography.Title level={3} style={{ marginBottom: token.marginXXS }}>
                  {productData?.name}
                </Typography.Title>
                {productData?.description && (
                  <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    {productData.description}
                  </Typography.Paragraph>
                )}
              </div>
              <Radio.Group
                value={selectedId}
                onChange={(e) => {
                  const id = e.target.value;
                  setVariantId(id);
                  setSelectedId(id);
                }}
                style={{ width: "100%" }}
              >
                <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                  {variants.slice(0, 3).map((v) => {
                    const isSelected = v.id === selectedId;
                    const labelParts = [
                      v.size ? `Size: ${v.size}` : null,
                      v.color ? `Color: ${v.color}` : null,
                      v.sku ? `SKU: ${v.sku}` : null,
                    ].filter(Boolean);

                    return (
                      <Radio.Button
                        key={v.id}
                        value={v.id}
                        style={{
                          // Let the Card define the size; make the button a block wrapper
                          display: "block",
                          height: "30vh",
                          width: "100%",
                          padding: 0,
                          borderRadius: token.borderRadiusLG,
                          overflow: "hidden",
                          borderColor: isSelected ? token.colorPrimary : token.colorBorderSecondary,
                        }}
                      >
                        <Card
                          hoverable
                          style={{
                            height: "100%",
                            borderColor: isSelected ? token.colorPrimary : token.colorBorderSecondary,
                          }}
                        >
                          <div className="flex flex-col h-full gap-2">
                            {/* Fixed-height media area */}
                            <div
                              className="w-full overflow-hidden rounded"
                              style={{
                                height: 100,
                                backgroundColor: token.colorFillTertiary,
                              }}
                            >
                              {v.image_urls?.[0] ? (
                                <img
                                  src={v.image_urls[0]}
                                  alt={`Variant ${v.id}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Typography.Text type="secondary">No image</Typography.Text>
                                </div>
                              )}
                            </div>

                            {/* Text area fills remaining space */}
                            <div className="flex flex-col flex-1">
                              <Typography.Text strong>₹{v.price ?? "-"}</Typography.Text>

                              {v.mrp != null && v.price != null && v.mrp > v.price && (
                                <div className="flex items-center gap-2">
                                  <Typography.Text delete type="secondary">₹{v.mrp}</Typography.Text>
                                  <Tag color="green">
                                    -{Math.round(((v.mrp - v.price) / v.mrp) * 100)}%
                                  </Tag>
                                </div>
                              )}

                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {labelParts.join(" • ") || `Variant #${v.id}`}
                              </Typography.Text>
                            </div>
                          </div>
                        </Card>
                      </Radio.Button>
                    );
                  })}
                </div>
              </Radio.Group>

            </div>

            <div>
              <Typography.Title level={4} style={{ marginBottom: token.marginXS }}>
                Selected variant
              </Typography.Title>
              <Space direction="vertical" size={4}>
                <Typography.Text>
                  Price: <strong>₹{selected?.price ?? "-"}</strong>
                </Typography.Text>
                {selected?.mrp != null && selected?.price != null && selected.mrp > selected.price && (
                  <Typography.Text type="secondary">
                    MRP: <span style={{ textDecoration: "line-through" }}>₹{selected.mrp}</span>{" "}
                    {discountPct != null && <Tag color="green">Save {discountPct}%</Tag>}
                  </Typography.Text>
                )}
                <Typography.Text type="secondary">
                  Size: {selected?.size ?? "-"} • Color: {selected?.color ?? "-"}
                </Typography.Text>
                <Typography.Text type="secondary">
                  SKU: {selected?.sku ?? "—"}
                </Typography.Text>
              </Space>
            </div>

            <div className="flex gap-3">
              {cart.some(item => item.id === selected.id) ? (
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={() => router.push("/cart")}
                >
                  Go to cart
                </Button>
              )
                :
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={() => {
                    addToCart({ ...selected, quantity: 1 });
                    message.success(`${selected.product?.name || 'Product'} added to cart!`);
                  }}
                >
                  Add to cart
                </Button>}
              <Button size="large" loading={loading} onClick={() => {
                setLoading(true);
                addToCart({ ...selected, quantity: 1 });
                router.push("/checkout");
              }}>Buy now</Button>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
          </Space>
        </div>
      </div>

      {/* Recommended Variants Section */}
      {recommendedVariants && recommendedVariants.length > 0 && (
        <div className="px-4 md:px-8 lg:px-16 py-8" style={{ backgroundColor: token.colorBgContainer }}>
          <Typography.Title level={3}>Recommended For You</Typography.Title>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {recommendedVariants.map((variant) => (
              <ProductCard key={variant.id} product={variant} token={token} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
