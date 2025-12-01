"use client";

import { useEffect, useState } from "react";
import { Rate, Input, Button, Avatar, Typography, Form, theme, Modal, App } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

export default function Reviews({ productId }: { productId: number }) {
    const { token } = theme.useToken();
    const { data: session } = useSession();
    const { message } = App.useApp();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [canReview, setCanReview] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            const data = await res.json();
            if (data.reviews) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    useEffect(() => {
        if (session && productId) {
            fetch(`/api/user/can-review?productId=${productId}`)
                .then(res => res.json())
                .then(data => {
                    setCanReview(data.canReview);
                })
                .catch(err => console.error("Failed to check review eligibility", err));
        }
    }, [session, productId]);

    const handleSubmit = async (values: any) => {
        if (!session) {
            message.error("Please login to submit a review");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    rating: values.rating,
                    comment: values.comment,
                }),
            });
            const data = await res.json();
            if (data.error) {
                message.error(data.error);
            } else {
                message.success("Review submitted successfully!");
                form.resetFields();
                setIsModalOpen(false);
                fetchReviews(); // Refresh reviews
            }
        } catch (error) {
            message.error("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8" style={{ backgroundColor: token.colorBgContainer }}>
            <div className="flex justify-between items-center mb-6">
                <Typography.Title level={3} style={{ margin: 0 }}>Customer Reviews</Typography.Title>
                {session && canReview && (
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Write a Review
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No reviews yet. Be the first to review!
                        </div>
                    ) : (
                        reviews.map((item) => (
                            <div key={item.id} className="border-b pb-4 last:border-0">
                                <div className="flex gap-3">
                                    <Avatar src={item.user?.image} icon={<UserOutlined />} />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold">{item.user?.name || "Anonymous"}</span>
                                            <Rate disabled defaultValue={item.rating} style={{ fontSize: 14 }} />
                                        </div>
                                        <div>
                                            <p className="mb-1">{item.comment}</p>
                                            <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <Modal
                title="Write a Review"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Please give a rating" }]}>
                        <Rate />
                    </Form.Item>
                    <Form.Item name="comment" label="Comment" rules={[{ required: true, message: "Please write a comment" }]}>
                        <Input.TextArea rows={4} placeholder="Share your thoughts..." />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Submit Review
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
